// OfferPage.tsx
// Design: Dark editorial — same system as main site (#0A0A0A bg, #FF2D20 accent, Bebas Neue display)
// Route: /offer — standalone page for event attendees, not in main nav
// Layout: Two gift offers above the fold + single form below

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const MARKETOS_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/marketos-logo_49b1e73a.jpg";
const TG_BOT_TOKEN = "8672812865:AAGt98zHZj_Q2r5DnSNXxMl_fNe_Ti9DPxw";
const TG_CHAT_ID = "1342421992";

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

async function sendToTelegram(data: Record<string, string>) {
  const text = `🎁 *ЗАЯВКА С ОФФЕРА (мероприятие)*\n\n` +
    Object.entries(data).map(([k, v]) => `*${k}:* ${v}`).join("\n") +
    `\n\nИсточник: gipoteza.agency/offer`;
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: "Markdown" }),
    });
  } catch {}
}

// ─── Unified Form ────────────────────────────────────────────────────────────

function UnifiedForm() {
  const [fields, setFields] = useState({ name: "", project: "", contact: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.contact) return;
    setLoading(true);
    await sendToTelegram({
      "Имя": fields.name,
      "Проект": fields.project || "—",
      "Telegram / телефон": fields.contact,
      "Получает": "Разбор воронки (бесплатно) + доступ MarketOS (5 000 ₽)",
    });
    setLoading(false);
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    color: "#F5F5F0", fontFamily: "Inter", fontSize: "1rem",
    padding: "0.65rem 0", outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ padding: "2.5rem", border: "1px solid rgba(255,45,32,0.3)", background: "rgba(255,45,32,0.05)", textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✓</div>
        <div className="font-display" style={{ fontSize: "1.8rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.75rem" }}>
          ЗАЯВКА ПРИНЯТА
        </div>
        <p style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          Свяжемся в течение дня — согласуем время разбора и пришлём доступ к MarketOS.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {[
        { key: "name", label: "ИМЯ *", placeholder: "Как вас зовут" },
        { key: "project", label: "ПРОЕКТ / ПРОДУКТ", placeholder: "Название или краткое описание" },
        { key: "contact", label: "TELEGRAM ИЛИ ТЕЛЕФОН *", placeholder: "@username или +7 999 000 00 00" },
      ].map(f => (
        <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>
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
          padding: "1.1rem 2.5rem", fontSize: "1rem", fontWeight: 700,
          letterSpacing: "0.06em", cursor: loading ? "wait" : "pointer",
          transition: "opacity 0.2s", opacity: loading ? 0.7 : 1,
          width: "100%",
        }}
      >
        {loading ? "ОТПРАВЛЯЕМ..." : "ЗАБРАТЬ ОБА ПОДАРКА →"}
      </button>
      <p style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
        Ответим в течение дня. Без спама.
      </p>
    </form>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function OfferPage() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F5F0" }}>

      {/* ── Шапка ── */}
      <header style={{ padding: "1.25rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="26" height="18" viewBox="0 0 28 20" fill="none">
              <ellipse cx="14" cy="10" rx="13" ry="9" stroke="#FF2D20" strokeWidth="1.5"/>
              <ellipse cx="14" cy="10" rx="5" ry="9" stroke="#FF2D20" strokeWidth="1.5"/>
              <line x1="1" y1="10" x2="27" y2="10" stroke="#FF2D20" strokeWidth="1.5"/>
            </svg>
            <span className="font-display" style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.04em" }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
          </div>
          <span style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Спецпредложение для участников эфира
          </span>
        </div>
      </header>

      {/* ── Hero + два оффера ── */}
      <section style={{ padding: "4rem 0 0" }}>
        <div className="container">

          {/* Заголовок */}
          <FadeUp>
            <p style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "#FF2D20", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              — Только для участников эфира · Количество мест ограничено
            </p>
            <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 5.5vw, 4.5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              ДВА ПОДАРКА<br />
              <span style={{ color: "#FF2D20" }}>ОТ АГЕНТСТВА</span>
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: "520px", marginBottom: "3rem" }}>
              Оставьте заявку — получите разбор вашей воронки и доступ к AI-маркетологу MarketOS.
            </p>
          </FadeUp>

          {/* Два оффера */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0, border: "1px solid rgba(255,255,255,0.08)", marginBottom: "4rem" }}
            className="md:grid-cols-2">

            {/* Оффер 1 — Разбор */}
            <FadeUp delay={0.1} style={{ height: "100%" }}>
              <div style={{
                padding: "2.5rem",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                height: "100%", boxSizing: "border-box",
                background: "rgba(255,45,32,0.03)",
                display: "flex", flexDirection: "column",
              }}>
                {/* Подарок 1 */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <span style={{
                    fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 700,
                    color: "#FF2D20", letterSpacing: "0.15em", textTransform: "uppercase",
                    border: "1px solid rgba(255,45,32,0.4)", padding: "0.25rem 0.6rem",
                  }}>ПОДАРОК 1</span>
                </div>

                <div className="font-display" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, lineHeight: 1, color: "#F5F5F0", marginBottom: "0.75rem" }}>
                  РАЗБОР<br />ВАШЕЙ ВОРОНКИ
                </div>

                {/* Цена */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <span className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#FF2D20" }}>
                    БЕСПЛАТНО
                  </span>
                  <span style={{ fontFamily: "Inter", fontSize: "1rem", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>
                    15 000 ₽
                  </span>
                </div>

                <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "1.75rem", flexGrow: 1 }}>
                  Разберём вебинар, оффер, структуру воронки и путь клиента.
                  Покажем, где проект теряет заявки и продажи — и дадим 3–5 конкретных изменений.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {["Вебинар и оффер", "Структура воронки", "Точки потерь", "3–5 ключевых изменений"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ color: "#FF2D20", fontSize: "0.75rem", flexShrink: 0 }}>→</span>
                      <span style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Оффер 2 — MarketOS */}
            <FadeUp delay={0.2} style={{ height: "100%" }}>
              <div style={{
                padding: "2.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                height: "100%", boxSizing: "border-box",
                background: "rgba(181,242,61,0.03)",
                display: "flex", flexDirection: "column",
              }}>
                {/* Подарок 2 */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <span style={{
                    fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 700,
                    color: "#B5F23D", letterSpacing: "0.15em", textTransform: "uppercase",
                    border: "1px solid rgba(181,242,61,0.35)", padding: "0.25rem 0.6rem",
                  }}>ПОДАРОК 2</span>
                </div>

                {/* Логотип + название */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                  <img src={MARKETOS_LOGO} alt="MarketOS"
                    style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                  <div className="font-display" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, lineHeight: 1, color: "#F5F5F0" }}>
                    MARKET<span style={{ color: "#B5F23D" }}>OS</span>
                  </div>
                </div>

                <div style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>
                  AI-маркетолог для онлайн-школ
                </div>

                {/* Цена */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <span className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#B5F23D" }}>
                    5 000 ₽
                  </span>
                  <span style={{ fontFamily: "Inter", fontSize: "1rem", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>
                    3 000 ₽
                  </span>
                </div>

                <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "1.75rem", flexGrow: 1 }}>
                  AI-маркетолог для ускорения маркетинга, усиления офферов и сценариев вебинаров.
                  Системная работа с гипотезами внутри вашего проекта.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {["Усиление офферов и текстов", "Работа с гипотезами", "Ускорение маркетинга", "Доступ сразу после оплаты"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ color: "#B5F23D", fontSize: "0.75rem", flexShrink: 0 }}>→</span>
                      <span style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── Форма ── */}
      <section style={{ padding: "0 0 6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }} className="lg:grid-cols-[1fr_480px] lg:gap-16">

            {/* Левая — итого */}
            <FadeUp delay={0.1}>
              <div style={{ padding: "2rem", border: "1px solid rgba(255,255,255,0.08)", background: "#0D0D0D" }}>
                <p style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  ВЫ ПОЛУЧАЕТЕ
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <div className="font-display" style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F5F0" }}>Разбор воронки</div>
                      <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>Стратегический разбор от агентства</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "1rem" }}>
                      <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#FF2D20" }}>БЕСПЛАТНО</div>
                      <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>15 000 ₽</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <div className="font-display" style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F5F0" }}>MarketOS</div>
                      <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>AI-маркетолог для вашего проекта</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "1rem" }}>
                      <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#B5F23D" }}>5 000 ₽</div>
                      <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>3 000 ₽</div>
                    </div>
                  </div>
                </div>

                {/* Ограничение мест */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", background: "rgba(255,45,32,0.08)", border: "1px solid rgba(255,45,32,0.2)" }}>
                  <span style={{ color: "#FF2D20", fontSize: "1rem", flexShrink: 0 }}>⚠</span>
                  <p style={{ fontFamily: "Inter", fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                    <strong style={{ color: "#FF2D20" }}>Количество мест ограничено.</strong> Разборы проводим лично — берём не всех.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Правая — форма */}
            <FadeUp delay={0.2}>
              <p style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                ОСТАВИТЬ ЗАЯВКУ
              </p>
              <UnifiedForm />
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 900 }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
            <p style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", marginTop: "0.2rem" }}>
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
            <a href="https://gipoteza-agency.ru/marketos" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F0")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
              MarketOS
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
