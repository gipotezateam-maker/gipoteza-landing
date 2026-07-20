// Пер-страничная SEO-мета для SPA: обновляет title, description, canonical и OG/Twitter-теги.
// Пока рендер клиентский; при добавлении пре-рендера те же значения будут запекаться в HTML.

const SITE = "https://gipoteza-agency.ru";

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export interface PageMeta {
  title: string;
  description?: string;
  path?: string; // напр. "/blog/slug"
  image?: string;
}

export function setPageMeta({ title, description, path, image }: PageMeta) {
  const url = path ? `${SITE}${path}` : SITE + "/";
  document.title = title;
  if (description) {
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
  }
  upsertMeta('meta[property="og:title"]', "property", "og:title", title);
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
  upsertMeta('meta[property="og:url"]', "property", "og:url", url);
  upsertMeta('meta[name="twitter:url"]', "name", "twitter:url", url);
  upsertMeta('meta[property="og:type"]', "property", "og:type", path?.startsWith("/blog/") ? "article" : "website");
  if (image) {
    const abs = image.startsWith("http") || image.startsWith("data:") ? image : `${SITE}${image}`;
    upsertMeta('meta[property="og:image"]', "property", "og:image", abs);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", abs);
  }
  upsertCanonical(url);
}
