// notion-to-md.mjs
// 纯函数：Notion 页面 + 块 → Markdown。
// 跨运行时通用（Node 18+ / Cloudflare Workers），不依赖 node: 私有模块。
//
// 设计目标：针对「文章数据库260813」的 15 个属性做友好映射，
// 同时对未知属性做兜底（使用原始属性名），避免结构变动即崩。

// 已知属性（中文名）→ frontmatter 键 的映射
const PROP_MAP = {
  Name: 'title',
  '分类': 'category',
  '作者': 'author',
  '标签': 'tags',
  '来源': 'source',
  '发布时间': 'published',
  '文章链接': 'source_url',
  'Bear链接': 'bear_url',
  'Address': 'address',
  'GitHub链接': 'github_url',
  '推送状态': 'sync_status',
  '归档状态': 'archived',
  'goodlinks': 'goodlinks',
  'goodlinks状态': 'goodlinks_status',
  '创建时间': 'created',
};

// rich_text 数组 → Markdown 片段（保留加粗/斜体/删除线/行内代码/链接/下划线）
export function richTextToMd(rich) {
  let out = '';
  for (const r of rich || []) {
    let t = r.plain_text ?? '';
    const a = r.annotations || {};
    if (a.code) t = '`' + t + '`';
    if (a.bold) t = '**' + t + '**';
    if (a.italic) t = '*' + t + '*';
    if (a.strikethrough) t = '~~' + t + '~~';
    if (a.underline) t = '<u>' + t + '</u>';
    if (r.href) t = '[' + t + '](' + r.href + ')';
    out += t;
  }
  return out;
}

// 单个属性 → 可被 YAML 序列化的标量 / 数组
function propValueToMd(prop) {
  if (!prop) return undefined;
  const type = prop.type;
  switch (type) {
    case 'title':
    case 'rich_text':
      return richTextToMd(prop[type]);
    case 'select':
    case 'status':
      return prop[type]?.name;
    case 'multi_select':
      return (prop.multi_select || []).map((o) => o.name);
    case 'url':
    case 'email':
    case 'phone_number':
      return prop[type];
    case 'date':
      return prop.date?.start;
    case 'checkbox':
      return prop.checkbox;
    case 'number':
      return prop.number;
    case 'created_time':
    case 'last_edited_time':
      return prop[type];
    case 'relation':
      return (prop.relation || []).map((r) => r.id);
    case 'formula':
      return prop.formula?.string ?? prop.formula?.number;
    default:
      return undefined;
  }
}

// 页面属性 → frontmatter 对象（丢弃空值）
export function pagePropertiesToFrontmatter(page) {
  const props = page.properties || {};
  const fm = {};
  for (const [name, prop] of Object.entries(props)) {
    const key = PROP_MAP[name] || name; // 未知属性用原始名兜底
    const val = propValueToMd(prop);
    if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) continue;
    fm[key] = val;
  }
  if (page.last_edited_time) fm.updated = page.last_edited_time;
  if (fm.tags && !Array.isArray(fm.tags)) fm.tags = [fm.tags];
  return fm;
}

// YAML 标量转义（双引号包裹，避免 : # 等破坏结构）
function yamlScalar(v) {
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  const s = String(v);
  const escaped = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}"`;
}

export function frontmatterToYaml(fm) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fm)) {
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      lines.push(`${k}:`);
      for (const it of v) lines.push(`  - ${yamlScalar(it)}`);
    } else {
      lines.push(`${k}: ${yamlScalar(v)}`);
    }
  }
  lines.push('---');
  return lines.join('\n') + '\n';
}

// 单块 → Markdown 行（递归处理嵌套 children）
// getChildren(blockId) 返回子块数组；无则为 null。
export async function renderBlocks(blocks, getChildren, indent = 0) {
  const pad = '  '.repeat(indent);
  const out = [];
  let listState = null; // 'bulleted' | 'numbered'，用于 list 序号

  const flushListGap = () => {
    if (listState) {
      out.push('');
      listState = null;
    }
  };

  for (const b of blocks || []) {
    const t = b.type;
    const body = b[t] || {};
    const txt = richTextToMd(body.rich_text);
    const caption = body.caption ? richTextToMd(body.caption) : '';

    switch (t) {
      case 'paragraph':
        flushListGap();
        out.push(txt || '');
        break;
      case 'heading_1':
        flushListGap(); out.push(`# ${txt}`); break;
      case 'heading_2':
        flushListGap(); out.push(`## ${txt}`); break;
      case 'heading_3':
        flushListGap(); out.push(`### ${txt}`); break;
      case 'bulleted_list_item': {
        if (listState !== 'bulleted') { out.push(''); listState = 'bulleted'; }
        const t2 = txt.replace(/^[•·‣◦\-]\s*/, ''); // 去掉微信裁剪带来的多余项目符号
        out.push(`${pad}- ${t2}`);
        break;
      }
      case 'numbered_list_item': {
        if (listState !== 'numbered') { out.push(''); listState = 'numbered'; }
        const t2 = txt.replace(/^[•·‣◦\-]\s*/, '');
        out.push(`${pad}1. ${t2}`);
        break;
      }
      case 'quote':
        flushListGap(); out.push(`> ${txt}`); break;
      case 'callout':
        flushListGap(); out.push(`> 💡 ${txt}`); break;
      case 'divider':
        flushListGap(); out.push('---'); break;
      case 'code':
        flushListGap();
        out.push('```' + (body.language || '') );
        out.push(txt);
        out.push('```');
        break;
      case 'image': {
        flushListGap();
        const url = body.type === 'external' ? body.external?.url : body.file?.url;
        out.push(`![${caption || 'image'}](${url || ''})`);
        break;
      }
      case 'bookmark':
      case 'link_preview':
      case 'embed':
      case 'video':
      case 'audio':
      case 'file': {
        flushListGap();
        const url = body.url || (body.file?.url) || (body.external?.url);
        out.push(`[${caption || txt || url || t}](${url || '#'})`);
        break;
      }
      case 'equation':
        flushListGap(); out.push(`$${body.expression || ''}$`); break;
      case 'toggle':
        flushListGap(); out.push(`<details><summary>${txt}</summary>`);
        if (b.has_children && getChildren) {
          const kids = (await getChildren(b.id)) || [];
          out.push(...renderBlocks(kids, getChildren, indent + 1));
        }
        out.push('</details>');
        break;
      case 'table':
      case 'table_row':
      case 'column_list':
      case 'column':
      case 'child_page':
      case 'child_database':
      case 'breadcrumb':
      case 'table_of_contents':
      case 'synced_block':
      case 'template':
        // 跳过纯结构块；table_row 由上层 table 处理（如需可扩展）
        break;
      default:
        // 兜底：尝试取 rich_text
        if (body.rich_text) { flushListGap(); out.push(txt); }
        break;
    }

    // 嵌套块（callout / 带 children 的容器）递归渲染
    if (b.has_children && t !== 'toggle' && getChildren) {
      const kids = (await getChildren(b.id)) || [];
      if (kids.length) {
        flushListGap();
        out.push(...renderBlocks(kids, getChildren, indent + 1));
      }
    }
  }
  flushListGap();
  return out;
}

// 组装完整 Markdown 文档
export async function renderFullMarkdown(page, blocks, getChildren) {
  const fm = pagePropertiesToFrontmatter(page);
  const yaml = frontmatterToYaml(fm);
  const bodyLines = (await renderBlocks(blocks, getChildren)).map((l) => l.replace(/\s+$/, ''));
  const body = bodyLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return `${yaml}\n${body}\n`;
}

// 标题 → 文件名 slug（保证唯一性与可读，保留 page_id 兜底）
export function slugify(title, pageId) {
  const base = (title || 'untitled')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\w一-龥]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return (base || 'page') + '--' + pageId.replace(/-/g, '');
}
