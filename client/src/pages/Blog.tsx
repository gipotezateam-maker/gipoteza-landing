// Design: Dark editorial, Unbounded display font, red accents #FF2D20, background #0A0A0A
// Same visual language as the main landing page

import { Link } from "wouter";

const ARTICLES = [
  {
    slug: "edtech-2026-konchilos-detstvo",
    tag: "Аналитика",
    date: "Март 2026",
    title: "EdTech 2026: Кончилось детство. Кто выживет?",
    excerpt:
      "EdTech больше не растёт на вере. Закончились дешёвые деньги, хайп пандемии и курсы «на коленке». Наступила взрослая жизнь — и не все к ней готовы.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/article-hero-YqwjNYyRnGFgMQtKMm7E9b.webp",
    readTime: "7 мин",
  },
];

export default function Blog() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1.25rem 0",
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Link href="/">
            <span
              className="font-display"
              style={{
                fontSize: "1rem",
                fontWeight: 900,
                letterSpacing: "0.06em",
                color: "#F5F5F0",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
          </Link>
          <Link href="/">
            <span
              style={{
                fontFamily: "Inter",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              ← На главную
            </span>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section style={{ paddingTop: "10rem", paddingBottom: "5rem" }}>
        <div className="container">
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            МЕДИА
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 900,
              color: "#F5F5F0",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            СТАТЬИ<span style={{ color: "#FF2D20" }}>.</span>
          </h1>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "1rem",
              color: "rgba(255,255,255,0.35)",
              marginTop: "2rem",
              maxWidth: "480px",
              lineHeight: 1.7,
            }}
          >
            Разбираем EdTech, вебинарные воронки и запуски. Без воды — только то, что работает.
          </p>
        </div>
      </section>

      {/* Articles grid */}
      <section style={{ paddingBottom: "8rem" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            {ARTICLES.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <div
                  style={{
                    background: "#0A0A0A",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#111")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0A0A0A")}
                >
                  {/* Image */}
                  <div style={{ position: "relative", paddingBottom: "56.25%", overflow: "hidden" }}>
                    <img
                      src={article.image}
                      alt={article.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  {/* Content */}
                  <div style={{ padding: "2rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontFamily: "Inter",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          color: "#FF2D20",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                        }}
                      >
                        {article.tag}
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter",
                          fontSize: "0.65rem",
                          color: "rgba(255,255,255,0.2)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {article.date} · {article.readTime}
                      </span>
                    </div>
                    <h2
                      className="font-display"
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 900,
                        color: "#F5F5F0",
                        lineHeight: 1.1,
                        letterSpacing: "-0.01em",
                        margin: 0,
                      }}
                    >
                      {article.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "Inter",
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.4)",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {article.excerpt}
                    </p>
                    <div
                      style={{
                        marginTop: "auto",
                        paddingTop: "1rem",
                        fontFamily: "Inter",
                        fontSize: "0.8rem",
                        color: "#FF2D20",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      Читать →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "3rem 0",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}
        >
          <span
            className="font-display"
            style={{ fontSize: "0.9rem", fontWeight: 900, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}
          >
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
