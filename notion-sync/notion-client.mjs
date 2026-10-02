// notion-client.mjs
// Notion API 封装。跨运行时（Node / Cloudflare Workers）通用，仅依赖全局 fetch。
// token 通过 configure() 注入，避免在模块内直接引用 process.env（Workers 无 process）。

const API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2025-09-03';

let CFG = {};
export function configure(c) {
  Object.assign(CFG, c);
}

export async function notionFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      Authorization: `Bearer ${CFG.notionToken}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Notion ${opts.method || 'GET'} ${path} -> ${res.status}: ${txt.slice(0, 300)}`);
  }
  return res.json();
}

export async function getPage(pageId) {
  return notionFetch(`/pages/${pageId}`);
}

// 分页拉取某页所有块
export async function getBlocks(pageId) {
  const out = [];
  let cursor;
  do {
    const qs = cursor
      ? `?start_cursor=${encodeURIComponent(cursor)}&page_size=100`
      : '?page_size=100';
    const data = await notionFetch(`/blocks/${pageId}/children${qs}`);
    out.push(...data.results);
    cursor = data.next_cursor;
  } while (cursor);
  return out;
}

// 分页查询数据源（数据库）全部页面
export async function queryDataSource(dataSourceId) {
  const out = [];
  let cursor;
  do {
    const body = cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 };
    const data = await notionFetch(`/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    out.push(...data.results);
    cursor = data.next_cursor;
  } while (cursor);
  return out;
}

// 回填页面属性（推送成功后写入 GitHub链接 / 推送状态）
export async function patchPage(pageId, properties) {
  return notionFetch(`/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties }),
  });
}
