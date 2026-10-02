// github-client.mjs
// GitHub Contents API 封装：读取 / 创建 / 更新 / 删除仓库内文件。
// 跨运行时通用，仅依赖全局 fetch。token 通过 configure() 注入。

let CFG = {};
export function configure(c) {
  Object.assign(CFG, c);
}

export function ghHeaders() {
  return {
    Authorization: `Bearer ${CFG.githubToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'notion-sync',
    'Content-Type': 'application/json',
  };
}

// 跨运行时 UTF-8 → base64（Workers 无 Buffer）
export function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function fromBase64(b64) {
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export async function getFile(path) {
  const res = await fetch(
    `https://api.github.com/repos/${CFG.owner}/${CFG.repo}/contents/${path}?ref=${CFG.branch}`,
    { headers: ghHeaders() }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub GET ${path} -> ${res.status}: ${t.slice(0, 300)}`);
  }
  return res.json(); // { sha, content(base64), ... }
}

export async function putFile(path, content, message, sha) {
  const body = { message, content: toBase64(content), branch: CFG.branch };
  if (sha) body.sha = sha;
  const res = await fetch(
    `https://api.github.com/repos/${CFG.owner}/${CFG.repo}/contents/${path}`,
    { method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body) }
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub PUT ${path} -> ${res.status}: ${t.slice(0, 300)}`);
  }
  return res.json();
}

export async function deleteFile(path, sha, message) {
  const res = await fetch(
    `https://api.github.com/repos/${CFG.owner}/${CFG.repo}/contents/${path}`,
    {
      method: 'DELETE',
      headers: ghHeaders(),
      body: JSON.stringify({ message, sha, branch: CFG.branch }),
    }
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub DELETE ${path} -> ${res.status}: ${t.slice(0, 300)}`);
  }
  return res.json();
}
