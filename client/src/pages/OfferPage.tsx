// OfferPage.tsx
// Design: Dark editorial — same system as main site (#0A0A0A bg, #FF2D20 accent, Bebas Neue display)
// Route: /offer — standalone page for event attendees, not in main nav
// Layout: Hero → Two gift cards (both FREE) → Single form

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

// ─── Gift ribbon SVG ─────────────────────────────────────────────────────────
function GiftRibbon({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
      {/* Box */}
      <rect x="6" y="22" width="36" height="20" rx="1" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5"/>
      {/* Lid */}
      <rect x="4" y="16" width="40" height="8" rx="1" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
      {/* Ribbon vertical */}
      <rect x="21" y="16" width="6" height="26" fill={color} fillOpacity="0.5"/>
      {/* Ribbon horizontal on lid */}
      <rect x="4" y="18" width="40" height="4" fill={color} fillOpacity="0.5"/>
      {/* Bow left */}
      <path d="M24 16 C18 10 10 10 12 16 C14 18 20 17 24 16Z" fill={color}/>
      {/* Bow right */}
      <path d="M24 16 C30 10 38 10 36 16 C34 18 28 17 24 16Z" fill={color}/>
      {/* Bow center */}
      <circle cx="24" cy="16" r="3" fill={color}/>
    </svg>
  );
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
      "Получает": "🎁 Разбор воронки (0 ₽) + 🎁 MarketOS (0 ₽)",
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
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎁</div>
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

      {/* ── Hero ── */}
      <section style={{ padding: "4rem 0 3rem" }}>
        <div className="container">
          <FadeUp>
            <p style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "#FF2D20", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              — Только для участников эфира · Количество мест ограничено
            </p>
            <h1 className="font-display" style={{ fontSize: "clamp(2rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              ДВА ПОДАРКА<br />
              <span style={{ color: "#FF2D20" }}>ОТ АГЕНТСТВА</span><br />
              ГИПОТЕЗА
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: "520px", marginBottom: "0" }}>
              Оставьте заявку — получите разбор вашей воронки и доступ к AI-маркетологу MarketOS. Оба подарка бесплатно.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Два подарка ── */}
      <section style={{ padding: "0 0 3rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
            className="max-sm:grid-cols-1">

            {/* ── Подарок 1: Разбор ── */}
            <FadeUp delay={0.1} style={{ height: "100%" }}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "relative", height: "100%", boxSizing: "border-box",
                  border: "1px solid rgba(255,45,32,0.35)",
                  background: "linear-gradient(135deg, rgba(255,45,32,0.08) 0%, rgba(255,45,32,0.02) 100%)",
                  padding: "2.5rem",
                  display: "flex", flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Декоративный угол */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "80px", height: "80px",
                  background: "rgba(255,45,32,0.12)",
                  clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                }}/>
                {/* Бейдж */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "#FF2D20", color: "#fff",
                  fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  padding: "0.3rem 0.75rem", marginBottom: "1.75rem",
                  alignSelf: "flex-start",
                }}>
                  🎁 ПОДАРОК 1
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>
                  <GiftRibbon color="#FF2D20" />
                  <div className="font-display" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, lineHeight: 1, color: "#F5F5F0" }}>
                    РАЗБОР<br />ВАШЕЙ<br />ВОРОНКИ
                  </div>
                </div>

                {/* Цена */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <span className="font-display" style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>
                    0 ₽
                  </span>
                  <span style={{ fontFamily: "Inter", fontSize: "1.1rem", color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>
                    15 000 ₽
                  </span>
                </div>

                <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "1.75rem", flexGrow: 1 }}>
                  Разберём вебинар, оффер, структуру воронки и путь клиента.
                  Покажем, где проект теряет заявки и продажи — и дадим 3–5 конкретных изменений.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {["Вебинар и оффер", "Структура воронки", "Точки потерь", "3–5 ключевых изменений"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ color: "#FF2D20", fontSize: "0.75rem", flexShrink: 0 }}>→</span>
                      <span style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </FadeUp>

            {/* ── Подарок 2: MarketOS ── */}
            <FadeUp delay={0.2} style={{ height: "100%" }}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "relative", height: "100%", boxSizing: "border-box",
                  border: "1px solid rgba(181,242,61,0.3)",
                  background: "linear-gradient(135deg, rgba(181,242,61,0.07) 0%, rgba(181,242,61,0.02) 100%)",
                  padding: "2.5rem",
                  display: "flex", flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Декоративный угол */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "80px", height: "80px",
                  background: "rgba(181,242,61,0.1)",
                  clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                }}/>

                {/* Бейдж */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "#B5F23D", color: "#0A0A0A",
                  fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  padding: "0.3rem 0.75rem", marginBottom: "1.75rem",
                  alignSelf: "flex-start",
                }}>
                  🎁 ПОДАРОК 2
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem" }}>
                  <GiftRibbon color="#B5F23D" />
                  <div>
                    <div className="font-display" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, lineHeight: 1, color: "#F5F5F0" }}>
                      MARKET<span style={{ color: "#B5F23D" }}>OS</span>
                    </div>
                    <div style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.35rem" }}>
                      AI-маркетолог для онлайн-школ
                    </div>
                  </div>
                </div>

                {/* Логотип */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <img src={MARKETOS_LOGO} alt="MarketOS"
                    style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px" }} />
                </div>

                {/* Цена */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <span className="font-display" style={{ fontSize: "2.5rem", fontWeight: 900, color: "#B5F23D", lineHeight: 1 }}>
                    0 ₽
                  </span>
                  <span style={{ fontFamily: "Inter", fontSize: "1.1rem", color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>
                    5 000 ₽
                  </span>
                </div>

                <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "1.75rem", flexGrow: 1 }}>
                  AI-маркетолог для ускорения маркетинга, усиления офферов и сценариев вебинаров.
                  Системная работа с гипотезами внутри вашего проекта.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {["Усиление офферов и текстов", "Работа с гипотезами", "Ускорение маркетинга", "Доступ сразу после заявки"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ color: "#B5F23D", fontSize: "0.75rem", flexShrink: 0 }}>→</span>
                      <span style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── Форма ── */}
      <section style={{ padding: "0 0 6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }} className="lg:grid-cols-[1fr_480px]">

            {/* Левая — итого + ограничение */}
            <FadeUp delay={0.1}>
              <div style={{ padding: "2rem", border: "1px solid rgba(255,255,255,0.08)", background: "#0D0D0D" }}>
                <p style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  ВЫ ПОЛУЧАЕТЕ БЕСПЛАТНО
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    { title: "Разбор воронки", sub: "Стратегический разбор от агентства", price: "0 ₽", was: "15 000 ₽", color: "#FF2D20" },
                    { title: "MarketOS", sub: "AI-маркетолог для вашего проекта", price: "0 ₽", was: "5 000 ₽", color: "#B5F23D" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "1.25rem 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div>
                        <div className="font-display" style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F5F0" }}>{item.title}</div>
                        <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>{item.sub}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "1rem" }}>
                        <div className="font-display" style={{ fontSize: "1.2rem", fontWeight: 900, color: item.color }}>
                          {item.price}
                        </div>
                        <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>
                          {item.was}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 0" }}>
                    <div className="font-display" style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F5F0" }}>ИТОГО</div>
                    <div style={{ textAlign: "right" }}>
                      <div className="font-display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#F5F5F0" }}>0 ₽</div>
                      <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>20 000 ₽</div>
                    </div>
                  </div>
                </div>

                {/* Ограничение мест */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", background: "rgba(255,45,32,0.08)", border: "1px solid rgba(255,45,32,0.2)", marginTop: "0.5rem" }}>
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
