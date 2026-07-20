// Пост-билд пре-рендер blog-страниц в статический HTML.
// Для каждой markdown-статьи генерит dist/public/blog/<slug>.html с реальным
// контентом в #root и пер-страничной SEO/OG-метой в <head>. Список — blog-list.html.
// Express отдаёт эти файлы для /blog и /blog/:slug (см. server/_core/vite.ts).
// Пользователь получает SPA поверх (createRoot заменяет #root на монтировании).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://gipoteza-agency.ru";
const BLOG_DIR = path.join(ROOT, "client/src/content/blog");
const DIST = path.join(ROOT, "dist/public");
const TEMPLATE = path.join(DIST, "index.html");

const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

const ARTICLE_CSS = `
.pr-wrap{background:#0A0A0A;min-height:100vh}
.pr-article{max-width:720px;margin:0 auto;padding:9rem 1.5rem 6rem}
.pr-meta{font-family:Inter,sans-serif;font-size:.65rem;font-weight:600;color:#FF2D20;letter-spacing:.15em;text-transform:uppercase;margin-bottom:1.5rem}
.pr-article h1{font-family:Unbounded,sans-serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:900;color:#F5F5F0;letter-spacing:-.03em;line-height:1.05;margin:0 0 2rem}
.pr-cover{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;margin:0 0 2.5rem;display:block}
.article-md{font-family:Inter,sans-serif;color:rgba(255,255,255,.82);font-size:1.05rem;line-height:1.8}
.article-md h2{font-family:Unbounded,sans-serif;font-weight:900;color:#F5F5F0;font-size:1.8rem;margin:3rem 0 1rem}
.article-md h3{font-family:Unbounded,sans-serif;font-weight:700;color:#F5F5F0;font-size:1.3rem;margin:2.2rem 0 .75rem}
.article-md p{margin:0 0 1.25rem}
.article-md a{color:#FF2D20;text-decoration:none}
.article-md ul,.article-md ol{margin:0 0 1.25rem;padding-left:1.4rem}
.article-md li{margin:.4rem 0}
.article-md strong{color:#F5F5F0}
.article-md table{width:100%;border-collapse:collapse;margin:0 0 1.5rem;font-size:.95rem}
.article-md th,.article-md td{border:1px solid rgba(255,255,255,.1);padding:.6rem .9rem;text-align:left}
.article-md th{background:rgba(255,255,255,.04);color:#F5F5F0}
.article-md img{max-width:100%;height:auto;border-radius:8px;margin:1.5rem 0}
`;

function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function displayDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  if (!m) return "";
  return `${MONTHS_RU[Number(m[2]) - 1] ?? ""} ${m[1]}`;
}

function parseFrontmatter(raw) {
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!m) return { data: {}, body: raw };
  const data = {};
  const lines = m[1].split("\n");
  let i = 0;
  while (i < lines.length) {
    const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(lines[i]);
    if (!kv) { i++; continue; }
    const key = kv[1];
    let val = kv[2].trim();
    if (val === "" && /^\s*-\s+/.test(lines[i + 1] ?? "")) {
      const arr = []; i++;
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) { arr.push(lines[i].replace(/^\s*-\s+/, "").replace(/^["']|["']$/g, "").trim()); i++; }
      data[key] = arr; continue;
    }
    data[key] = val.replace(/^["']|["']$/g, "");
    i++;
  }
  return { data, body: m[2] };
}

// Замена мета/тегов в шаблоне index.html
function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
}
function setMetaByName(html, name, content) {
  const re = new RegExp(`(<meta\\s+name="${name}"\\s+content=")[^"]*(")`);
  if (re.test(html)) return html.replace(re, `$1${esc(content)}$2`);
  return html.replace(/<\/head>/, `  <meta name="${name}" content="${esc(content)}" />\n</head>`);
}
function setMetaByProp(html, prop, content) {
  const re = new RegExp(`(<meta\\s+property="${prop}"\\s+content=")[^"]*(")`);
  if (re.test(html)) return html.replace(re, `$1${esc(content)}$2`);
  return html.replace(/<\/head>/, `  <meta property="${prop}" content="${esc(content)}" />\n</head>`);
}
function setCanonical(html, href) {
  const re = /(<link\s+rel="canonical"\s+href=")[^"]*(")/;
  if (re.test(html)) return html.replace(re, `$1${esc(href)}$2`);
  return html.replace(/<\/head>/, `  <link rel="canonical" href="${esc(href)}" />\n</head>`);
}

function bakeHead(html, { title, description, url, image }) {
  html = setTitle(html, title);
  html = setCanonical(html, url);
  if (description) {
    html = setMetaByName(html, "description", description);
    html = setMetaByProp(html, "og:description", description);
    html = setMetaByName(html, "twitter:description", description);
  }
  html = setMetaByProp(html, "og:title", title);
  html = setMetaByName(html, "twitter:title", title);
  html = setMetaByProp(html, "og:url", url);
  html = setMetaByName(html, "twitter:url", url);
  html = setMetaByProp(html, "og:type", "article");
  if (image) {
    const abs = image.startsWith("http") ? image : `${SITE}${image}`;
    html = setMetaByProp(html, "og:image", abs);
    html = setMetaByName(html, "twitter:image", abs);
  }
  // инлайн-стили статьи (чтобы до-гидрационный вид и краулер видели оформленный контент)
  return html.replace(/<\/head>/, `  <style>${ARTICLE_CSS}</style>\n</head>`);
}

function injectRoot(html, inner) {
  return html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${inner}</div>`);
}

function main() {
  if (!fs.existsSync(TEMPLATE)) {
    console.error(`[prerender-blog] нет ${TEMPLATE} — сначала vite build`);
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE, "utf8");
  if (!fs.existsSync(BLOG_DIR)) { console.log("[prerender-blog] нет статей"); return; }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const cards = [];
  fs.mkdirSync(path.join(DIST, "blog"), { recursive: true });

  for (const f of files) {
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8"));
    if (!data.slug || data.draft === "true") continue;
    const iso = String(data.date || "").slice(0, 10);
    const title = data.title || data.slug;
    const desc = data.description || data.excerpt || "";
    const url = `${SITE}/blog/${data.slug}`;
    const bodyHtml = marked.parse(body);
    const coverTag = data.cover ? `<img class="pr-cover" src="${esc(data.cover)}" alt="${esc(title)}" />` : "";
    const inner =
      `<div class="pr-wrap"><article class="pr-article">` +
      `<p class="pr-meta">${esc(data.category || "Статья")} · ${esc(displayDate(iso))}</p>` +
      `<h1>${esc(title)}</h1>${coverTag}` +
      `<div class="article-md">${bodyHtml}</div></article></div>`;

    let page = bakeHead(template, { title: `${title} — Гипотеза`, description: desc, url, image: data.cover });
    page = injectRoot(page, inner);
    fs.writeFileSync(path.join(DIST, "blog", `${data.slug}.html`), page, "utf8");
    cards.push({ slug: data.slug, title, excerpt: data.excerpt || desc, tag: data.category || "Статья", date: displayDate(iso), iso, cover: data.cover });
  }

  // Список /blog
  cards.sort((a, b) => (a.iso < b.iso ? 1 : -1));
  const list = cards
    .map((c) => `<a href="/blog/${c.slug}" style="display:block;color:#F5F5F0;text-decoration:none;margin:0 0 2rem"><p class="pr-meta">${esc(c.tag)} · ${esc(c.date)}</p><h2 style="font-family:Unbounded,sans-serif;font-weight:900;font-size:1.4rem;margin:.3rem 0">${esc(c.title)}</h2><p style="color:rgba(255,255,255,.4)">${esc(c.excerpt)}</p></a>`)
    .join("\n");
  const listInner = `<div class="pr-wrap"><div class="pr-article"><h1>Статьи</h1>${list}</div></div>`;
  let listPage = bakeHead(template, {
    title: "Статьи — Гипотеза: EdTech, вебинарные воронки и запуски",
    description: "Разбираем EdTech, вебинарные воронки и запуски онлайн-курсов. Практика без воды — только то, что работает.",
    url: `${SITE}/blog`,
  });
  listPage = injectRoot(listPage, listInner);
  fs.writeFileSync(path.join(DIST, "blog-list.html"), listPage, "utf8");

  console.log(`[prerender-blog] ${cards.length} статей + список → dist/public/blog/`);
}

main();
