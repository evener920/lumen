// sync.mjs
// 编排器：被 GitHub Action（方案A 定时兜底）直接调用。
// 也可本地 DRY_RUN 验证转换器（不碰 GitHub / 不回填 Notion）。
//
// 用法：
//   DRY_RUN=1 NOTION_TOKEN=xxx node notion-sync/sync.mjs                 # 拉全库，写本地 ./test-md
//   DRY_RUN=1 NOTION_TOKEN=xxx PAGE_ID=xxx node notion-sync/sync.mjs     # 只同步单页
//   NOTION_TOKEN=xxx GITHUB_TOKEN=xxx node notion-sync/sync.mjs          # 真实提交到仓库

import { writeFileSync, mkdirSync } from 'node:fs';
import { configure, getPage, getBlocks, queryDataSource, patchPage } from './notion-client.mjs';
import { getFile, putFile, fromBase64 } from './github-client.mjs';
import { renderFullMarkdown, slugify } from './notion-to-md.mjs';

const DRY_RUN = !!process.env.DRY_RUN;
const PAGE_ID = process.env.PAGE_ID;
const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID || 'f82feb00-ed72-82fe-93d1-07e0dd0a0435';
const MD_DIR = process.env.MD_DIR || 'md';
const OWNER = process.env.GH_OWNER || 'evener920';
const REPO = process.env.GH_REPO || 'lumen';
const BRANCH = process.env.GH_BRANCH || 'main';

configure({
  notionToken: process.env.NOTION_TOKEN,
  githubToken: process.env.GITHUB_TOKEN,
  owner: OWNER,
  repo: REPO,
  branch: BRANCH,
});

const getChildren = (blockId) => getBlocks(blockId);

async function syncPage(page) {
  const id = page.id;
  const blocks = await getBlocks(id);
  const md = await renderFullMarkdown(page, blocks, getChildren);
  const title = (page.properties?.Name?.title || []).map((t) => t.plain_text).join('') || '(无标题)';
  const path = `${MD_DIR}/${slugify(title, id)}.md`;

  if (DRY_RUN) {
    mkdirSync('./test-md', { recursive: true });
    writeFileSync(`./test-md/${slugify(title, id)}.md`, md);
    console.log(`[dry] ${title} -> test-md/${slugify(title, id)}.md (${md.length} bytes)`);
    return { id, path, committed: false, dry: true };
  }

  const existing = await getFile(path);
  if (existing && fromBase64(existing.content) === md) {
    console.log(`[skip] 无变化: ${title}`);
    return { id, path, committed: false };
  }

  const res = await putFile(path, md, `sync: ${title}`, existing?.sha);
  const blobUrl = `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${path}`;
  console.log(`[put] ${title} -> ${path}`);

  // 回填 Notion：GitHub链接 + 推送状态=已推送
  const curStatus = page.properties?.['推送状态']?.select?.name;
  if (curStatus !== '已推送' || page.properties?.['GitHub链接']?.url !== blobUrl) {
    await patchPage(id, {
      'GitHub链接': { url: blobUrl },
      '推送状态': { select: { name: '已推送' } },
    });
    console.log(`[notion] 回填 GitHub链接 / 推送状态=已推送`);
  }
  return { id, path, committed: true, url: blobUrl };
}

async function syncAll() {
  const pages = await queryDataSource(DATA_SOURCE_ID);
  console.log(`数据源共 ${pages.length} 条`);
  let n = 0;
  for (const p of pages) {
    const r = await syncPage(p);
    if (r.committed) n++;
  }
  console.log(`完成：提交 ${n} 个文件`);
}

async function main() {
  if (PAGE_ID) {
    const page = await getPage(PAGE_ID);
    await syncPage(page);
  } else {
    await syncAll();
  }
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
