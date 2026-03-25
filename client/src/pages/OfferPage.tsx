// OfferPage.tsx
// Design: Dark editorial — same system as main site (#0A0A0A bg, #FF2D20 accent, Bebas Neue display)
// Route: /offer — standalone page for event attendees, not in main nav

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const MARKETOS_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/marketos-logo_49b1e73a.jpg";
const TG_BOT_TOKEN = "8672812865:AAGt98zHZj_Q2r5DnSNXxMl_fNe_Ti9DPxw";
const TG_CHAT_ID = "1342421992";

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

async function sendToTelegram(data: Record<string, string>, type: "razvor" | "marketos") {
  const label = type === "razvor" ? "🔍 ЗАЯВКА НА РАЗБОР ВОРОНКИ" : "⚡ ЗАЯВКА НА MARKETOS";
  const text = `${label}\n\n` +
    Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nИсточник: /offer (мероприятие)`;
  try {
    if (TG_BOT_TOKEN && TG_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: "HTML" }),
      });
    }
  } catch {}
}

// ─── Form: Разбор воронки ────────────────────────────────────────────────────

function RazborForm() {
  const [fields, setFields] = useState({ name: "", project: "", phone: "", niche: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.phone) return;
    setLoading(true);
    await sendToTelegram({
      "Имя": fields.name,
      "Проект": fields.project,
      "Телефон / Telegram": fields.phone,
      "Ниша": fields.niche,
    }, "razvor");
    setLoading(false);
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    color: "#F5F5F0", fontFamily: "Inter", fontSize: "1rem",
    padding: "0.6rem 0", outline: "none", transition: "border-color 0.2s",
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        style={{ padding: "3rem 2.5rem", border: "1px solid rgba(255,45,32,0.3)", background: "rgba(255,45,32,0.05)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✓</div>
        <div className="font-display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.75rem" }}>
          ЗАЯВКА ПРИНЯТА
        </div>
        <p style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          Свяжемся в течение дня, согласуем время разбора. Без спама и навязчивых продаж.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {[
        { key: "name", label: "ИМЯ *", placeholder: "Как вас зовут" },
        { key: "project", label: "ПРОЕКТ / ПРОДУКТ", placeholder: "Название или описание" },
        { key: "phone", label: "ТЕЛЕФОН ИЛИ TELEGRAM *", placeholder: "+7 999 000 00 00 или @username" },
        { key: "niche", label: "НИША", placeholder: "EdTech, коучинг, инфобизнес…" },
      ].map(f => (
        <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>
            {f.label}
          </label>
          <input
            style={inputStyle}
            placeholder={f.placeholder}
            value={fields[f.key as keyof typeof fields]}
            onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
            onFocus={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.5)")}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="font-display"
        style={{
          background: "#FF2D20", color: "#fff", border: "none",
          padding: "1rem 2.5rem", fontSize: "0.9rem", fontWeight: 700,
          letterSpacing: "0.08em", cursor: loading ? "wait" : "pointer",
          transition: "opacity 0.2s", opacity: loading ? 0.7 : 1,
          alignSelf: "flex-start",
        }}
      >
        {loading ? "ОТПРАВЛЯЕМ..." : "ЗАПИСАТЬСЯ НА РАЗБОР →"}
      </button>
      <p style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>
        Ответим в течение дня. Без спама.
      </p>
    </form>
  );
}

// ─── Form: MarketOS ──────────────────────────────────────────────────────────

function MarketOSForm() {
  const [fields, setFields] = useState({ name: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.phone) return;
    setLoading(true);
    await sendToTelegram({
      "Имя": fields.name,
      "Телефон / Telegram": fields.phone,
      "Тариф": "Доступ участника эфира — 0 ₽ (специальная цена)",
    }, "marketos");
    setLoading(false);
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    color: "#F5F5F0", fontFamily: "Inter", fontSize: "1rem",
    padding: "0.6rem 0", outline: "none", transition: "border-color 0.2s",
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        style={{ padding: "2rem", border: "1px solid rgba(181,242,61,0.3)", background: "rgba(181,242,61,0.05)" }}>
        <div className="font-display" style={{ fontSize: "1.2rem", fontWeight: 900, color: "#B5F23D", marginBottom: "0.5rem" }}>
          ДОСТУП ОФОРМЛЕН
        </div>
        <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          Свяжемся и пришлём данные для входа в MarketOS.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {[
        { key: "name", label: "ИМЯ *", placeholder: "Как вас зовут" },
        { key: "phone", label: "ТЕЛЕФОН ИЛИ TELEGRAM *", placeholder: "+7 999 000 00 00 или @username" },
      ].map(f => (
        <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>
            {f.label}
          </label>
          <input
            style={inputStyle}
            placeholder={f.placeholder}
            value={fields[f.key as keyof typeof fields]}
            onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
            onFocus={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.5)")}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="font-display"
        style={{
          background: "#B5F23D", color: "#0A0A0A", border: "none",
          padding: "0.9rem 2rem", fontSize: "0.85rem", fontWeight: 700,
          letterSpacing: "0.08em", cursor: loading ? "wait" : "pointer",
          transition: "opacity 0.2s", opacity: loading ? 0.7 : 1,
          alignSelf: "flex-start",
        }}
      >
        {loading ? "ОТПРАВЛЯЕМ..." : "ПОЛУЧИТЬ ДОСТУП →"}
      </button>
    </form>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function OfferPage() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F5F0" }}>

      {/* ── Шапка ── */}
      <header style={{ padding: "1.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
              <ellipse cx="14" cy="10" rx="13" ry="9" stroke="#FF2D20" strokeWidth="1.5"/>
              <ellipse cx="14" cy="10" rx="5" ry="9" stroke="#FF2D20" strokeWidth="1.5"/>
              <line x1="1" y1="10" x2="27" y2="10" stroke="#FF2D20" strokeWidth="1.5"/>
            </svg>
            <span className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, letterSpacing: "0.04em" }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
          </div>
          <span style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Спецпредложение для участников эфира
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ padding: "5rem 0 4rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <FadeUp>
            <p style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "#FF2D20", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              — Только для участников эфира
            </p>
            <h1 className="font-display" style={{ fontSize: "clamp(2rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
              ДВА ОФФЕРА<br />
              <span style={{ color: "#FF2D20" }}>ДЛЯ ВАС</span>
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "560px" }}>
              Разбор вашей воронки от команды агентства и доступ к AI-маркетологу MarketOS — оба предложения доступны прямо сейчас.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Два оффера рядом ── */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2px",
          }}>

            {/* ─── Оффер 1: Разбор воронки ─── */}
            <FadeUp delay={0}>
              <div style={{
                background: "#0D0D0D",
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "3rem 2.5rem",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Шапка оффера */}
                <div style={{ marginBottom: "2.5rem" }}>
                  <p style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                    ОФФЕР 01
                  </p>
                  <div className="font-display" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
                    РАЗБОР<br />
                    <span style={{ color: "#FF2D20" }}>ВОРОНКИ</span>
                  </div>
                  <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                    Команда агентства «Гипотеза» разберёт вебинар, оффер, структуру воронки и покажет ключевые точки роста.
                  </p>
                </div>

                {/* Что входит */}
                <div style={{ border: "1px solid rgba(255,255,255,0.06)", marginBottom: "2.5rem" }}>
                  {[
                    { n: "01", title: "Вебинар и оффер", desc: "Структура выступления, логика продажи, сила предложения" },
                    { n: "02", title: "Воронка целиком", desc: "Путь клиента от первого касания до оплаты" },
                    { n: "03", title: "Точки потерь", desc: "Где проект теряет заявки, доходимость и продажи" },
                    { n: "04", title: "3–5 изменений", desc: "Конкретные шаги для максимального роста конверсии" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "2.5rem 1fr",
                      gap: "0.75rem", padding: "1.1rem 1.25rem",
                      borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      alignItems: "start",
                    }}>
                      <span style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", paddingTop: "0.1rem" }}>{item.n}</span>
                      <div>
                        <div className="font-display" style={{ fontSize: "0.9rem", fontWeight: 700, color: "#F5F5F0", marginBottom: "0.2rem" }}>{item.title}</div>
                        <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Цена */}
                <div style={{ border: "1px solid rgba(255,45,32,0.2)", padding: "1.5rem", marginBottom: "2rem", background: "rgba(255,45,32,0.03)" }}>
                  <p style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                    СПЕЦИАЛЬНАЯ ЦЕНА
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                    <span className="font-display" style={{ fontSize: "2.8rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>
                      0 ₽
                    </span>
                    <span style={{ fontFamily: "Inter", fontSize: "1.1rem", color: "rgba(255,255,255,0.2)", textDecoration: "line-through" }}>
                      5 000 ₽
                    </span>
                  </div>
                  <p style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>
                    Бесплатно для участников эфира
                  </p>
                </div>

                {/* Форма */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                    ЗАПИСАТЬСЯ НА РАЗБОР
                  </p>
                  <RazborForm />
                </div>
              </div>
            </FadeUp>

            {/* ─── Оффер 2: MarketOS ─── */}
            <FadeUp delay={0.15}>
              <div style={{
                background: "#0D0D0D",
                border: "1px solid rgba(181,242,61,0.12)",
                padding: "3rem 2.5rem",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Шапка оффера */}
                <div style={{ marginBottom: "2.5rem" }}>
                  <p style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                    ОФФЕР 02 · БОНУС
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src={MARKETOS_LOGO}
                      alt="MarketOS"
                      style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                    />
                    <div className="font-display" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                      MARKET<span style={{ color: "#B5F23D" }}>OS</span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                    AI-маркетолог для ускорения маркетинга, усиления материалов и быстрой работы с гипотезами.
                  </p>
                </div>

                {/* Что входит */}
                <div style={{ border: "1px solid rgba(181,242,61,0.12)", marginBottom: "2.5rem" }}>
                  {[
                    "Ускоряет работу с маркетинговыми гипотезами",
                    "Усиливает офферы, тексты и сценарии вебинаров",
                    "Помогает системно работать с маркетингом",
                    "Экспертный взгляд агентства + инструмент в одном",
                  ].map((item, i, arr) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: "0.75rem",
                      padding: "1rem 1.25rem",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(181,242,61,0.08)" : "none",
                    }}>
                      <span style={{ color: "#B5F23D", fontSize: "0.8rem", marginTop: "0.1rem", flexShrink: 0 }}>→</span>
                      <span style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Цена */}
                <div style={{ border: "1px solid rgba(181,242,61,0.2)", padding: "1.5rem", marginBottom: "2rem", background: "rgba(181,242,61,0.03)" }}>
                  <p style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                    СПЕЦИАЛЬНАЯ ЦЕНА
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                    <span className="font-display" style={{ fontSize: "2.8rem", fontWeight: 900, color: "#B5F23D", lineHeight: 1 }}>
                      0 ₽
                    </span>
                    <span style={{ fontFamily: "Inter", fontSize: "1.1rem", color: "rgba(255,255,255,0.2)", textDecoration: "line-through" }}>
                      5 000 ₽
                    </span>
                  </div>
                  <p style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>
                    Бесплатно для участников эфира
                  </p>
                </div>

                {/* Ссылка на демо */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <a
                    href="https://gipoteza.agency/marketos"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(181,242,61,0.6)",
                      textDecoration: "none", borderBottom: "1px solid rgba(181,242,61,0.2)",
                      paddingBottom: "2px", transition: "color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B5F23D")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(181,242,61,0.6)")}
                  >
                    Попробовать MarketOS →
                  </a>
                </div>

                {/* Форма */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                    ПОЛУЧИТЬ ДОСТУП
                  </p>
                  <MarketOSForm />
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "2.5rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 900 }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
            <p style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", marginTop: "0.25rem" }}>
              Агентство вебинарного продакшна
            </p>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="https://gipoteza.agency/" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F0")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
              Сайт агентства
            </a>
            <a href="https://t.me/gipoteza_agency" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F0")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
              Telegram
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
