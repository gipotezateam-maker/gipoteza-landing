// Blog content loader.
// Статьи хранятся как markdown-файлы с frontmatter в этой же папке (*.md).
// Внешний генератор (content-factory) просто кладёт сюда новые .md и пушит —
// список статей, роут /blog/:slug и sitemap строятся из этих файлов автоматически.

import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export interface Article {
  // поля для карточки в списке (совпадают с legacy-форматом Blog.tsx)
  slug: string;
  tag: string; // рубрика (category)
  date: string; // отображаемая дата, напр. "Июль 2026"
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  // доп. поля для страницы статьи и SEO
  description: string; // meta description
  tags: string[];
  isoDate: string; // YYYY-MM-DD для сортировки/sitemap
  lastmod: string;
  html: string; // отрендеренное тело
  draft: boolean;
}

const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

function displayDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const month = MONTHS_RU[Number(m[2]) - 1] ?? "";
  return `${month} ${m[1]}`;
}

function readTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 180));
  return `${mins} мин`;
}

// Простой парсер frontmatter (подмножество YAML: строки, "quoted", inline [a, b] и блочные списки "- item").
function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const [, fm, body] = match;
  const data: Record<string, unknown> = {};
  const lines = fm.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!kv) { i++; continue; }
    const key = kv[1];
    let value = kv[2].trim();
    if (value === "" && /^\s*-\s+/.test(lines[i + 1] ?? "")) {
      // блочный список
      const arr: string[] = [];
      i++;
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        arr.push(lines[i].replace(/^\s*-\s+/, "").replace(/^["']|["']$/g, "").trim());
        i++;
      }
      data[key] = arr;
      continue;
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value.slice(1, -1).split(",").map((s) => s.replace(/^["']|["']$/g, "").trim()).filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
    i++;
  }
  return { data, body };
}

// Дефолтная обложка: брендовый SVG с рубрикой (data-URI, поддерживает кириллицу).
function placeholderCover(tag: string): string {
  const label = (tag || "ГИПОТЕЗА").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340"><rect width="600" height="340" fill="#0A0A0A"/><rect x="0" y="300" width="600" height="40" fill="#111"/><text x="40" y="180" font-family="Arial Black,sans-serif" font-size="34" font-weight="900" fill="#F5F5F0">${label}</text><rect x="40" y="128" width="54" height="6" fill="#FF2D20"/><text x="300" y="326" font-family="Arial,sans-serif" font-size="11" fill="rgba(255,255,255,0.25)" text-anchor="middle" letter-spacing="3">GIPOTEZA-AGENCY.RU</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const modules = import.meta.glob("./*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

function build(): Article[] {
  const articles: Article[] = [];
  for (const raw of Object.values(modules)) {
    const { data, body } = parseFrontmatter(raw);
    const slug = String(data.slug ?? "").trim();
    if (!slug) continue;
    const iso = String(data.date ?? "").slice(0, 10);
    const tag = String(data.category ?? "Статья");
    const description = String(data.description ?? "");
    articles.push({
      slug,
      tag,
      date: displayDate(iso),
      title: String(data.title ?? slug),
      excerpt: String(data.excerpt ?? description),
      image: String(data.cover ?? data.image ?? "") || placeholderCover(tag),
      readTime: readTime(body),
      description,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      isoDate: iso,
      lastmod: String(data.lastmod ?? iso).slice(0, 10),
      html: marked.parse(body) as string,
      draft: data.draft === true || data.draft === "true",
    });
  }
  return articles
    .filter((a) => !a.draft)
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : a.isoDate > b.isoDate ? -1 : 0));
}

export const mdArticles: Article[] = build();

export function getArticleBySlug(slug: string): Article | undefined {
  return mdArticles.find((a) => a.slug === slug);
}
