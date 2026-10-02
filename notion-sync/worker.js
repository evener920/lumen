// worker.js — Cloudflare Worker 入口（方案B：Notion Webhook → GitHub 实时推送）
// 接收 Notion Webhook → 校验签名/握手 → 读页面+块 → 转 Markdown → 提交到 md/ → 回填 Notion。
//
// 部署：在 notion-sync/ 目录执行 `wrangler deploy`
// 密钥（wrangler secret put）：NOTION_TOKEN、GITHUB_TOKEN
// 其余配置在 wrangler.toml 的 [vars] 中。

import { configure, getPage, getBlocks, patchPage } from './notion-client.mjs';
import { getFile, putFile, fromBase64, deleteFile, configure as ghConfigure } from './github-client.mjs';
import { renderFullMarkdown, slugify } from './notion-to-md.mjs';

// 我们回填 Notion 时改动的字段；这些字段触发的 webhook 不重跑同步，避免死循环。
const SYNC_FIELDS = new Set(['GitHub链接', '推送状态', 'goodlinks状态', 'goodlinks']);

export default {
  async fetch(request, env) {
    configure({
      notionToken: env.NOTION_TOKEN,
      githubToken: env.GITHUB_TOKEN,
      owner: env.GH_OWNER || 'evener920',
      repo: env.GH_REPO || 'lumen',
      branch: env.GH_BRANCH || 'main',
    });
    ghConfigure({
      notionToken: env.NOTION_TOKEN,
      githubToken: env.GITHUB_TOKEN,
      owner: env.GH_OWNER || 'evener920',
      repo: env.GH_REPO || 'lumen',
      branch: env.GH_BRANCH || 'main',
    });

    if (request.method !== 'POST') {
      return new Response('Notion→GitHub sync worker. POST only.', { status: 200 });
    }

    const rawBody = await request.text();
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response('invalid json', { status: 400 });
    }

    // 1) 一次性握手：Notion 创建 webhook 时会发带 verification_token 的包（无签名）
    if (payload.verification_token) {
      console.log('Notion verification_token:', payload.verification_token);
      // 若绑定了 KV，自动保存以便后续验证事件；否则请手动设为 NOTION_VERIFICATION_TOKEN secret
      if (env.KV) await env.KV.put('notion_verify_token', payload.verification_token).catch(() => {});
      return new Response(JSON.stringify({ verification_token: payload.verification_token }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    // 2) 校验事件签名
    const token = env.NOTION_VERIFICATION_TOKEN || (env.KV ? await env.KV.get('notion_verify_token') : null);
    const sig = request.headers.get('x-notion-signature');
    if (!token || !verifySignature(rawBody, sig, token)) {
      return new Response('invalid signature', { status: 401 });
    }

    // 3) 取页面 id 与事件类型
    const entity = payload.entity || {};
    const pageId = entity.id;
    const type = payload.type;
    if (!pageId || entity.type !== 'page') {
      return new Response('ignored (non-page event)', { status: 200 });
    }

    // 4) 死循环守卫：仅我们回填字段被改动时，不重跑
    if (type === 'page.properties_updated') {
      const updated = payload.data?.updated_properties || [];
      if (updated.length && updated.every((p) => SYNC_FIELDS.has(p))) {
        return new Response('ignored (self sync field)', { status: 200 });
      }
    }
    if (type === 'page.deleted' || type === 'page.undeleted') {
      // 可选：删除对应 md 文件
      try {
      const p = await getPage(pageId);
      const t = (p.properties?.Name?.title || []).map((x) => x.plain_text).join('') || '(无标题)';
      const path = `${env.MD_DIR || 'md'}/${slugify(t, pageId)}.md`;
      const f = await getFile(path);
        if (f) await deleteFile(path, f.sha, `delete: ${pageId}`);
      } catch (e) {
        console.error('delete failed', e);
      }
      return new Response('handled delete', { status: 200 });
    }
    if (!['page.created', 'page.content_updated', 'page.properties_updated', 'data_source.content_updated'].includes(type)) {
      return new Response('ignored event type: ' + type, { status: 200 });
    }

    // 5) 同步（异步执行，立即返回 200 让 Notion 不必重试）
    const ctx = { request, env };
    try {
      await syncPage(pageId, env);
      return new Response('ok', { status: 200 });
    } catch (e) {
      console.error('sync error', e);
      // 已尽力，返回 200 避免 Notion 重试风暴；错误见 Worker 日志
      return new Response('error: ' + (e.message || e), { status: 200 });
    }
  },
};

async function syncPage(pageId, env) {
  const page = await getPage(pageId);
  const blocks = await getBlocks(pageId);
  const md = await renderFullMarkdown(page, blocks, (id) => getBlocks(id));
  const props = page.properties || {};
  const title = (props.Name?.title || []).map((t) => t.plain_text).join('') || '(无标题)';
  const path = `${env.MD_DIR || 'md'}/${slugify(title, pageId)}.md`;

  const existing = await getFile(path);
  if (existing && fromBase64(existing.content) === md) {
    console.log('no change:', title);
    return;
  }
  await putFile(path, md, `sync: ${title}`, existing?.sha);
  console.log('committed', path);

  // 回填 Notion
  const blobUrl = `https://github.com/${env.GH_OWNER || 'evener920'}/${env.GH_REPO || 'lumen'}/blob/${env.GH_BRANCH || 'main'}/${path}`;
  const curStatus = props['推送状态']?.select?.name;
  if (curStatus !== '已推送' || props['GitHub链接']?.url !== blobUrl) {
    await patchPage(pageId, {
      'GitHub链接': { url: blobUrl },
      '推送状态': { select: { name: '已推送' } },
    });
    console.log('patched Notion (GitHub链接 / 推送状态=已推送)');
  }
}

// Web Crypto HMAC-SHA256，对原始 body 计算，恒定时间比较
async function verifySignature(rawBody, sigHeader, token) {
  if (!sigHeader || !sigHeader.startsWith('sha256=')) return false;
  const expected = 'sha256=' + (await hmacHex(rawBody, token));
  if (expected.length !== sigHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sigHeader.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacHex(body, key) {
  const keyBuf = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', keyBuf, new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
