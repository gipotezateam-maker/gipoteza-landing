// Генерирует client/public/sitemap.xml на этапе сборки.
// Источник статей блога — markdown-файлы client/src/content/blog/*.md (frontmatter slug + lastmod).
// Запускается перед `vite build` (см. package.json → scripts.build).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://gipoteza-agency.ru";
const BLOG_DIR = path.join(ROOT, "client/src/content/blog");
const OUT = path.join(ROOT, "client/public/sitemap.xml");

const today = new Date().toISOString().slice(0, 10);

// Статические индексируемые страницы (curated — без служебных /admin, /pay, /game).
const STATIC = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/blog", priority: "0.8", changefreq: "daily" },
  { loc: "/offer", priority: "0.8", changefreq: "monthly" },
  { loc: "/expert", priority: "0.7", changefreq: "monthly" },
  { loc: "/b2b", priority: "0.7", changefreq: "monthly" },
  { loc: "/traffic", priority: "0.7", changefreq: "monthly" },
  { loc: "/neuro", priority: "0.7", changefreq: "monthly" },
  { loc: "/course", priority: "0.6", changefreq: "monthly" },
];

// 3 исходные статьи (написаны как .tsx-компоненты, не md).
const LEGACY_POSTS = [
  { slug: "okupaemost-vebinarov-dlya-onlajn-shkoly", lastmod: "2026-07-20" },
  { slug: "edtech-2026-konchilos-detstvo", lastmod: "2026-07-20" },
  { slug: "iz-chego-sostoit-zapusk-vebinara", lastmod: "2026-07-20" },
];

function frontmatter(raw) {
  const m = /^---\s*\n([\s\S]*?)\n---/.exec(raw);
  if (!m) return {};
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([A-Za-z0-9_]+):\s*(.+)$/.exec(line);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return data;
}

function mdPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => frontmatter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8")))
    .filter((d) => d.slug && d.draft !== "true")
    .map((d) => ({ slug: d.slug, lastmod: (d.lastmod || d.date || today).slice(0, 10) }));
}

const urls = [
  ...STATIC.map((s) => ({ loc: SITE + s.loc, lastmod: today, changefreq: s.changefreq, priority: s.priority })),
  ...[...mdPosts(), ...LEGACY_POSTS].map((p) => ({
    loc: `${SITE}/blog/${p.slug}`,
    lastmod: p.lastmod,
    changefreq: "monthly",
    priority: "0.7",
  })),
];

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join("\n") +
  "\n</urlset>\n";

fs.writeFileSync(OUT, xml, "utf8");
console.log(`[gen-sitemap] wrote ${urls.length} urls → ${path.relative(ROOT, OUT)}`);
