# Notion → GitHub 自动推送（evener920/lumen）

把 Notion「文章数据库260813」里的文章，实时/定时转换成 Markdown 提交到仓库 `md/`，
并回填页面的 `GitHub链接` 与 `推送状态=已推送`。

数据库属性（已实测）：`Name`(标题)、`分类`、`作者`、`标签`、`来源`、`发布时间`、
`文章链接`、`Bear链接`、`Address`、`GitHub链接`、`推送状态`、`归档状态`、
`goodlinks`、`goodlinks状态`、`创建时间` —— 全部映射进 Markdown 的 YAML frontmatter。

## 两种方案

| | 方案A：定时 Action（兜底/最简） | 方案B：Cloudflare Worker（实时推荐） |
|---|---|---|
| 触发 | GitHub Actions cron（每 15 分） | Notion Webhook → Worker |
| 服务器 | 无 | 无（Cloudflare Workers 边缘） |
| 延迟 | 最长 15 分钟 | 秒级 |
| 文件 | `.github/workflows/notion-sync.yml` + `notion-sync/sync.mjs` | `notion-sync/worker.js` + `wrangler.toml` |
| 复用 | 同一套 `notion-to-md.mjs` 转换逻辑 | 同一套转换逻辑 |

> ⚠️ 不要改动仓库里既有的「清理未引用上传文件」Workflow；本方案只新增文件。

---

## 方案A：定时同步（零基础设施，推荐先跑通）

1. 在仓库 **Settings → Secrets and variables → Actions → New repository secret** 添加：
   - `NOTION_TOKEN` = Notion integration 的 Internal Integration Secret（`ntn_...`）
2. 确认 Notion integration 已对该数据库有 **读写** 权限（页面右侧 "..." → Connections → 连接你的 integration）。
3. 推送本目录后，Actions 会按 cron 自动运行；也可在 Actions 页面 **Run workflow** 手动触发。
4. 效果：改动过的文章会被 `git commit` 到 `md/<page_id>.md`，并回填 Notion。

---

## 方案B：实时 Webhook（Cloudflare Worker）

### 1. 准备密钥
```bash
cd notion-sync
wrangler secret put NOTION_TOKEN     # Notion integration secret
wrangler secret put GITHUB_TOKEN     # Fine-grained PAT：仅 evener920/lumen，权限 Contents:read+write
```

### 2. 部署 Worker
```bash
wrangler deploy
# 记下分配的 *.workers.dev 地址，例如 https://notion-to-lumen.<sub>.workers.dev
```

### 3. 在 Notion 后台创建 Webhook
- 进入 integration 设置页 → Webhooks → 添加 `https://notion-to-lumen.<sub>.workers.dev`
- 订阅事件：`page.created` / `page.content_updated` / `page.properties_updated`
- Notion 会先发一次**握手** POST（带 `verification_token`，无签名）。Worker 收到后
  返回 200 并自动把它存入 KV（若未绑 KV，请把该 token 设为 `NOTION_VERIFICATION_TOKEN` secret）。
- 之后每次文章变更，Notion 用 `X-Notion-Signature: sha256=...` 签名推送，Worker 校验后实时同步。

### 4. 完整链路（你已有的 WeChat → Notion）
```
微信文章 → Notion(文章数据库260813)
        → Notion Webhook
        → Cloudflare Worker
        → 写入 evener920/lumen 的 md/<page_id>.md
        → commit
        → Lumen 站点
        → (Worker 回填 GitHub链接 / 推送状态=已推送)
```

---

## 防死循环说明
Worker 在 `syncPage` 末尾会 `PATCH` 页面 `GitHub链接`/`推送状态`，这会再次触发
`page.properties_updated`。Worker 检测到「被改动的属性全是同步字段」时直接返回 200、**不重跑**，
因此不会无限循环。方案A 不经过 Webhook，天然无此问题。

## 文件说明
- `notion-to-md.mjs` —— 纯函数：页面属性 + 块 → Markdown（跨 Node/Workers）
- `notion-client.mjs` / `github-client.mjs` —— Notion / GitHub API 封装
- `sync.mjs` —— 方案A 编排器（也支持 `DRY_RUN=1 PAGE_ID=xxx` 本地验证）
- `worker.js` / `wrangler.toml` —— 方案B Worker

## 本地验证转换器（不碰 GitHub / 不回填 Notion）
```bash
NOTION_TOKEN=xxx DRY_RUN=1 PAGE_ID=<page_id> node notion-sync/sync.mjs
# 产物在 ./test-md/<page_id>.md
```
