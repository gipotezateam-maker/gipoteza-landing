// Единый динамический рендер статьи блога: /blog/:slug.
// Контент берётся из markdown-файлов client/src/content/blog/*.md (см. loader.ts).
// Design: Dark editorial, Unbounded display, red accent #FF2D20, bg #0A0A0A — как в Blog.tsx.

import { useEffect } from "react";
import { Link } from "wouter";
import NotFound from "@/pages/NotFound";
import { getArticleBySlug } from "@/content/blog/loader";
import { setPageMeta } from "@/lib/seo";

const ARTICLE_CSS = `
.article-md { font-family: Inter, sans-serif; color: rgba(255,255,255,0.82); font-size: 1.05rem; line-height: 1.8; }
.article-md h2 { font-family: Unbounded, sans-serif; font-weight: 900; color: #F5F5F0; font-size: 1.8rem; letter-spacing: -0.02em; line-height: 1.15; margin: 3rem 0 1rem; }
.article-md h3 { font-family: Unbounded, sans-serif; font-weight: 700; color: #F5F5F0; font-size: 1.3rem; margin: 2.2rem 0 0.75rem; }
.article-md p { margin: 0 0 1.25rem; }
.article-md a { color: #FF2D20; text-decoration: none; border-bottom: 1px solid rgba(255,45,32,0.4); }
.article-md a:hover { border-bottom-color: #FF2D20; }
.article-md ul, .article-md ol { margin: 0 0 1.25rem; padding-left: 1.4rem; }
.article-md li { margin: 0.4rem 0; }
.article-md strong { color: #F5F5F0; font-weight: 600; }
.article-md blockquote { margin: 1.5rem 0; padding: 0.5rem 1.25rem; border-left: 3px solid #FF2D20; color: rgba(255,255,255,0.6); font-style: italic; }
.article-md code { background: rgba(255,255,255,0.08); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
.article-md pre { background: #111; padding: 1.25rem; border-radius: 8px; overflow-x: auto; margin: 0 0 1.25rem; }
.article-md pre code { background: none; padding: 0; }
.article-md table { width: 100%; border-collapse: collapse; margin: 0 0 1.5rem; font-size: 0.95rem; }
.article-md th, .article-md td { border: 1px solid rgba(255,255,255,0.1); padding: 0.6rem 0.9rem; text-align: left; }
.article-md th { background: rgba(255,255,255,0.04); color: #F5F5F0; font-weight: 600; }
.article-md img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.5rem 0; }
.article-md hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 2.5rem 0; }
`;

export default function BlogPost({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (article) {
      setPageMeta({
        title: `${article.title} — Гипотеза`,
        description: article.description || article.excerpt,
        path: `/blog/${article.slug}`,
        image: article.image,
      });
    }
  }, [article]);

  if (!article) return <NotFound />;

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: ARTICLE_CSS }} />

      {/* Nav */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "1.25rem 0",
          background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/">
            <span className="font-display" style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.06em", color: "#F5F5F0", cursor: "pointer" }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
          </Link>
          <Link href="/blog">
            <span style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              ← Все статьи
            </span>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <article style={{ maxWidth: "720px", margin: "0 auto", padding: "9rem 1.5rem 6rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 600, color: "#FF2D20", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {article.tag}
          </span>
          <span style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
            {article.date} · {article.readTime}
          </span>
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 2rem" }}>
          {article.title}
        </h1>

        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: "12px", margin: "0 0 2.5rem", display: "block" }}
          />
        )}

        <div className="article-md" dangerouslySetInnerHTML={{ __html: article.html }} />

        {/* CTA */}
        <div style={{ marginTop: "4rem", padding: "2rem", background: "#111", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontFamily: "Inter", fontSize: "1rem", color: "rgba(255,255,255,0.6)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
            Хотите вебинарную воронку, которая окупается? Гипотеза строит запуски под ключ.
          </p>
          <Link href="/">
            <span style={{ fontFamily: "Inter", fontSize: "0.9rem", fontWeight: 600, color: "#FF2D20", cursor: "pointer" }}>
              Обсудить проект →
            </span>
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "3rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 900, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
          <p style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)" }}>
            © 2026 Гипотеза — агентство вебинарных воронок
          </p>
        </div>
      </footer>
    </div>
  );
}
