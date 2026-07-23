// Пост-билд пре-рендер маркетинговых роутов (SPA) в статический HTML.
// Страницы не задают SEO-мету и рендерят контент только на клиенте, поэтому
// краулер видел один и тот же index.html: дубли title/description, canonical=/,
// нет <h1>. Здесь для каждого роута запекаем пер-страничную мету в <head> и
// кладём настоящий (sr-only) <h1> в #root. React при монтировании перетирает
// #root — для пользователя страница не меняется, а краулер/Яндекс видят мету и H1.
// Express отдаёт эти файлы до express.static (см. server/_core/vite.ts).
// Для "/" перезапекаем сам index.html.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://gipoteza-agency.ru";
const DIST = path.join(ROOT, "dist/public");
const TEMPLATE = path.join(DIST, "index.html");

// Роут → { file, title (≤60), description (70–160), h1 }. Мета составлена по
// реальному содержимому страниц (client/src/pages/*.tsx).
const PAGES = [
  {
    route: "/", file: "index.html",
    title: "Гипотеза — вебинарные воронки и запуски под ключ",
    h1: "Вебинарные воронки и запуски онлайн-курсов под ключ",
    description: "Агентство вебинарных воронок и запусков онлайн-курсов под ключ для EdTech и брендов: продакшн вебинаров, автоворонки, прогрев трафика. 5 лет, 40+ запусков.",
  },
  {
    route: "/offer", file: "offer.html",
    title: "Разбор вебинарной воронки бесплатно — Гипотеза",
    h1: "Заявка на разбор вашей вебинарной воронки",
    description: "Бесплатный разбор вашей вебинарной воронки: покажем, где теряются деньги и как поднять окупаемость запуска. Свяжемся в течение дня, без навязчивых продаж.",
  },
  {
    route: "/expert", file: "expert.html",
    title: "Упаковка экспертизы в прибыльный запуск — Гипотеза",
    h1: "Почему сильная экспертиза не приносит денег",
    description: "Помогаем экспертам упаковать знания в прибыльный запуск: вебинарная воронка, контент и подготовка спикера под ключ. Реальные кейсы с цифрами по выручке.",
  },
  {
    route: "/b2b", file: "b2b.html",
    title: "Вебинары для B2B-продаж — Гипотеза",
    h1: "Вебинар как точка входа в B2B-сделку",
    description: "Выстраиваем вебинары как канал B2B-лидогенерации: точка входа в сделку, прогрев и заявки от компаний. Разберём ваш случай бесплатно и посчитаем результат.",
  },
  {
    route: "/traffic", file: "traffic.html",
    title: "Трафик и лиды для онлайн-школы — Гипотеза",
    h1: "Трафик и лиды для онлайн-школы",
    description: "Считаем медиаплан для онлайн-школы: какие каналы и бюджет дадут заявки в вашей нише. Бесплатный расчёт лидов и стоимости заявки без обязательств.",
  },
  {
    route: "/neuro", file: "neuro.html",
    title: "НейроЛидГен для EdTech под ключ — Гипотеза",
    h1: "НейроЛидГен для EdTech под ключ",
    description: "AI-лидогенерация для EdTech под ключ: закрываем 6 главных проблем запуска с помощью нейросетей. Получите консультацию и расчёт за один день, без спама.",
  },
  {
    route: "/course", file: "course.html",
    title: "Мини-курс для EdTech-школ — Гипотеза",
    h1: "Мини-курс для EdTech-школ",
    description: "Практический мини-курс для EdTech-школ: программа, тесты и разбор реальных запусков онлайн-курсов. Тестовая цена — скоро вырастет, забирайте сейчас.",
  },
];

function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

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

function bakeHead(html, { title, description, url }) {
  html = setTitle(html, title);
  html = setCanonical(html, url);
  html = setMetaByName(html, "description", description);
  html = setMetaByProp(html, "og:description", description);
  html = setMetaByName(html, "twitter:description", description);
  html = setMetaByProp(html, "og:title", title);
  html = setMetaByName(html, "twitter:title", title);
  html = setMetaByProp(html, "og:url", url);
  html = setMetaByName(html, "twitter:url", url);
  html = setMetaByProp(html, "og:type", "website");
  return html;
}

// sr-only <h1>: присутствует в DOM для краулера, но не мигает у пользователя —
// React всё равно заменит #root при монтировании (client render, не hydrate).
function injectH1(html, h1) {
  const tag = `<h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);border:0">${esc(h1)}</h1>`;
  return html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${tag}</div>`);
}

function main() {
  if (!fs.existsSync(TEMPLATE)) {
    console.error(`[prerender-pages] нет ${TEMPLATE} — сначала vite build`);
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE, "utf8");

  for (const p of PAGES) {
    const url = p.route === "/" ? `${SITE}/` : `${SITE}${p.route}`;
    let page = bakeHead(template, { title: p.title, description: p.description, url });
    page = injectH1(page, p.h1);
    fs.writeFileSync(path.join(DIST, p.file), page, "utf8");
  }

  console.log(`[prerender-pages] ${PAGES.length} маркетинговых роутов → dist/public/`);
}

main();
