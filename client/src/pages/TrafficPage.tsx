// TrafficPage.tsx
// Лендинг /traffic — трафик для онлайн-школ, mobile-first
// Стиль: #0A0A0A / #FF2D20 / Unbounded display (font-display)

import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";

const TG_BOT_TOKEN = "8672812865:AAGt98zHZj_Q2r5DnSNXxMl_fNe_Ti9DPxw";
const TG_CHAT_IDS = ["1342421992", "683646991"];

// ─── Данные калькулятора ──────────────────────────────────────────────────────

const BASE_CPL: Record<string, number> = {
  "Регистрация на вебинар": 350,
  "Лид-магнит / бот": 150,
  "Подписка на Telegram-канал": 100,
  "Подписка на группу ВК": 90,
  "Пробное занятие / консультация": 900,
  "Заявка на курс": 1800,
};

const NICHE_MULT: Record<string, number> = {
  "Иностранные языки": 0.9,
  "Подготовка к ЕГЭ": 1.0,
  "IT-курсы для взрослых": 1.6,
  "IT-курсы для детей": 1.4,
  "Удалённые профессии": 1.1,
  "Психология и саморазвитие": 0.85,
  "Маркетинг и продажи": 1.2,
  "Творчество (музыка, рисование, танцы)": 0.9,
  "Фитнес": 0.9,
  "Инвестиции": 1.7,
  "Профпереподготовка": 1.3,
  "Кулинария": 0.9,
  "Мода и стиль": 1.0,
  "Ведение блога, личный бренд": 1.0,
  "Другое": 1.0,
};

// ─── FadeUp ───────────────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Telegram ─────────────────────────────────────────────────────────────────

async function sendToTelegram(fields: Record<string, string>) {
  const text =
    `🚦 ЗАЯВКА: трафик\n\n` +
    Object.entries(fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n") +
    `\n\nИсточник: /traffic`;
  try {
    await Promise.all(
      TG_CHAT_IDS.map((chat_id) =>
        fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, text }),
        })
      )
    );
  } catch {}
}

// ─── Калькулятор ─────────────────────────────────────────────────────────────

function Calculator({ onScrollToForm }: { onScrollToForm: () => void }) {
  const [budget, setBudget] = useState(50000);
  const [niche, setNiche] = useState("Иностранные языки");
  const [entry, setEntry] = useState("Регистрация на вебинар");

  const cpl = Math.round(BASE_CPL[entry] * NICHE_MULT[niche]);
  const leads = Math.floor(budget / cpl);

  const fmt = (n: number) => n.toLocaleString("ru-RU");

  const selStyle: React.CSSProperties = {
    width: "100%",
    background: "#111",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#F5F5F0",
    fontFamily: "Inter",
    fontSize: "0.9rem",
    padding: "0.7rem 0.9rem",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    borderRadius: 0,
  };

  return (
    <div id="calculator" style={{ padding: "2.5rem 1.75rem", border: "1px solid rgba(255,255,255,0.08)", background: "#0D0D0D" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Бюджет */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
            <label style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>
              БЮДЖЕТ
            </label>
            <span className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0" }}>
              {fmt(budget)} ₽
            </span>
          </div>
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#FF2D20", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
            <span style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.2)" }}>10 000 ₽</span>
            <span style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.2)" }}>500 000 ₽</span>
          </div>
        </div>

        {/* Ниша */}
        <div>
          <label style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", display: "block", marginBottom: "0.6rem" }}>
            НИША
          </label>
          <div style={{ position: "relative" }}>
            <select value={niche} onChange={(e) => setNiche(e.target.value)} style={selStyle}>
              {Object.keys(NICHE_MULT).map((k) => <option key={k}>{k}</option>)}
            </select>
            <span style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none", fontSize: "0.75rem" }}>▾</span>
          </div>
        </div>

        {/* Точка входа */}
        <div>
          <label style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", display: "block", marginBottom: "0.6rem" }}>
            ТОЧКА ВХОДА В ВОРОНКУ
          </label>
          <div style={{ position: "relative" }}>
            <select value={entry} onChange={(e) => setEntry(e.target.value)} style={selStyle}>
              {Object.keys(BASE_CPL).map((k) => <option key={k}>{k}</option>)}
            </select>
            <span style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none", fontSize: "0.75rem" }}>▾</span>
          </div>
        </div>

        {/* Результат */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.08)" }}>
          <div style={{ background: "#0D0D0D", padding: "1.25rem 1rem" }}>
            <div style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>ЛИДОВ</div>
            <div className="font-display" style={{ fontSize: "clamp(1.8rem, 6vw, 2.6rem)", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>
              {fmt(leads)} <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)" }}>чел</span>
            </div>
          </div>
          <div style={{ background: "#0D0D0D", padding: "1.25rem 1rem" }}>
            <div style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>СТОИМОСТЬ ЛИДА</div>
            <div className="font-display" style={{ fontSize: "clamp(1.8rem, 6vw, 2.6rem)", fontWeight: 900, color: "#F5F5F0", lineHeight: 1 }}>
              {fmt(cpl)} <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)" }}>₽</span>
            </div>
          </div>
        </div>

        <p style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", margin: 0 }}>
          Расчёт приблизительный. Реальные цифры зависят от воронки, креативов и посадочной.
        </p>

        <button
          onClick={onScrollToForm}
          className="font-display"
          style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", width: "100%" }}
        >
          Записаться на сессию — рассчитаем точный медиаплан →
        </button>
      </div>
    </div>
  );
}

// ─── Аккордеон FAQ ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "1.25rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", textAlign: "left" }}
      >
        <span className="font-display" style={{ fontSize: "0.95rem", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.3 }}>{q}</span>
        <span style={{ color: "#FF2D20", fontSize: "1.1rem", flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, paddingBottom: "1.25rem", margin: 0 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Форма заявки ─────────────────────────────────────────────────────────────

function TrafficForm() {
  const [fields, setFields] = useState({ name: "", niche: "", contact: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.contact) return;
    setLoading(true);
    await sendToTelegram({
      "Имя": fields.name,
      "Ниша / проект": fields.niche || "—",
      "Telegram / телефон": fields.contact,
    });
    setLoading(false);
    setSent(true);
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)", color: "#F5F5F0",
    fontFamily: "Inter", fontSize: "1rem", padding: "0.65rem 0",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ padding: "2.5rem 2rem", border: "1px solid rgba(255,45,32,0.3)", background: "rgba(255,45,32,0.05)" }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
        <div className="font-display" style={{ fontSize: "1.4rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.5rem" }}>
          ЗАЯВКА ПРИНЯТА
        </div>
        <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
          Свяжемся в течение дня.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {[
        { key: "name", label: "ИМЯ *", placeholder: "Как вас зовут" },
        { key: "niche", label: "НИША / ПРОЕКТ", placeholder: "Онлайн-школа, курс, эксперт…" },
        { key: "contact", label: "TELEGRAM / ТЕЛЕФОН *", placeholder: "@username или +7 999 000 00 00" },
      ].map((f) => (
        <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em" }}>
            {f.label}
          </label>
          <input
            style={inp}
            placeholder={f.placeholder}
            value={fields[f.key as keyof typeof fields]}
            onChange={(e) => setFields((p) => ({ ...p, [f.key]: e.target.value }))}
            onFocus={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
          />
        </div>
      ))}
      <button
        type="submit" disabled={loading} className="font-display"
        style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.07em", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.2s", width: "100%" }}
      >
        {loading ? "ОТПРАВЛЯЕМ…" : "ПОЛУЧИТЬ РАСЧЁТ →"}
      </button>
      <p style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", margin: 0 }}>
        Ответим в течение дня. Без спама.
      </p>
    </form>
  );
}

// ─── Общие стили ─────────────────────────────────────────────────────────────

const wrap: React.CSSProperties = { maxWidth: "760px", margin: "0 auto" };
const sec: React.CSSProperties = { padding: "3.5rem 1.25rem" };
const h2Style: React.CSSProperties = {
  fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)", fontWeight: 900,
  letterSpacing: "-0.02em", color: "#F5F5F0", lineHeight: 1.05, margin: "0 0 1.5rem",
};
const bodyText: React.CSSProperties = {
  fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 1rem",
};

// ─── Страница ─────────────────────────────────────────────────────────────────

export default function TrafficPage() {
  useEffect(() => {
    document.title = "Трафик для онлайн-школ, который продаёт — Гипотеза";
  }, []);

  const scrollToForm = () => document.getElementById("zayavka")?.scrollIntoView({ behavior: "smooth" });
  const scrollToCalc = () => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F5F0", overflowX: "hidden" }}>

      {/* ── Шапка ── */}
      <header style={{ padding: "1.1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)" }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <span className="font-display" style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.05em", cursor: "pointer", textDecoration: "none", color: "#F5F5F0" }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
          </Link>
          <button onClick={scrollToForm} style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "#FF2D20", background: "none", border: "1px solid rgba(255,45,32,0.35)", padding: "0.45rem 1rem", cursor: "pointer", letterSpacing: "0.04em" }}>
            Получить расчёт
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="tr-hero-section" style={{ position: "relative", minHeight: "92svh", display: "flex", alignItems: "flex-end" }}>
        <img src="/traffic/hero.jpg" alt="" className="tr-hero-img"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% center" }}
        />
        <div className="tr-hero-grad-h" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#0A0A0A 0%,rgba(10,10,10,0.85) 40%,rgba(10,10,10,0.2) 70%,transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 55%,#0A0A0A 100%)" }} />

        <div style={{ position: "relative", padding: "0 1.25rem 3.5rem", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "640px" }}>
            <FadeUp>
              <p style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "#FF2D20", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                ТРАФИК ДЛЯ ОНЛАЙН-ШКОЛ И ЭКСПЕРТОВ
              </p>
              <h1 className="font-display tr-hero-h1" style={{ fontSize: "clamp(1.75rem, 5.5vw, 3.8rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
                Трафик, который <span style={{ color: "#FF2D20" }}>продаёт</span>
              </h1>
              <p style={{ fontFamily: "Inter", fontSize: "clamp(0.9rem, 3vw, 1.05rem)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "500px", marginBottom: "2rem" }}>
                ВКонтакте, Яндекс, Telegram Ads, посевы, блогеры. Приводим целевые заявки и доводим до окупаемости — потому что понимаем вебинарную воронку, а не только рекламный кабинет.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button onClick={scrollToForm} className="font-display"
                  style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", flex: "1 1 220px" }}>
                  Бесплатный расчёт медиаплана →
                </button>
                <button onClick={scrollToCalc}
                  style={{ background: "none", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", padding: "1rem 1.5rem", fontFamily: "Inter", fontSize: "0.85rem", cursor: "pointer", flex: "1 1 180px" }}>
                  Калькулятор лидов ↓
                </button>
              </div>
            </FadeUp>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .tr-hero-section { min-height: 88vh !important; }
            .tr-hero-img { object-position: 60% center !important; }
            .tr-hero-grad-h { background: rgba(10,10,10,0.7) !important; }
            .tr-hero-h1 { font-size: clamp(1.6rem, 7vw, 2.4rem) !important; }
          }
        `}</style>
      </section>

      {/* ── Каналы ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Каналы</h2>
          </FadeUp>
          <div className="tr-channels-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {[
              { name: "ВКонтакте", sub: "таргет по интересам и конкурентам", fit: "вебинарные и лид-магнитные воронки, заявки", roi: "2–4 мес" },
              { name: "Яндекс Директ + РСЯ", sub: "горячие запросы", fit: "заявки на курс, вебинары", roi: "1–3 мес (быстро)" },
              { name: "Telegram Ads", sub: "таргет по каналам и интересам", fit: "подписки в бот/канал, лид-магниты", roi: "2–4 мес" },
              { name: "Посевы в Telegram", sub: "размещения в тематических каналах", fit: "подписчики, заявки", roi: "2–4 мес" },
              { name: "Блогеры", sub: "нативные интеграции", fit: "охват, узнаваемость, заявки", roi: "3–6 мес" },
            ].map((ch, i) => (
              <FadeUp key={ch.name} delay={i * 0.07} style={{ height: "100%" }}>
                <div style={{ background: "#0A0A0A", padding: "1.5rem 1.25rem", height: "100%", boxSizing: "border-box" }}>
                  <div className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.25rem" }}>{ch.name}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.85rem", lineHeight: 1.4 }}>{ch.sub}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: "0.5rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>ПОДХОДИТ ДЛЯ </span>{ch.fit}
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "#FF2D20" }}>
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>ОКУПАЕМОСТЬ </span>{ch.roi}
                  </div>
                </div>
              </FadeUp>
            ))}
            {/* 6-я ячейка: CTA */}
            <FadeUp delay={0.35} style={{ height: "100%" }}>
              <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,45,32,0.35)", padding: "1.5rem 1.25rem", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.25rem" }}>
                <div>
                  <div className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.6rem", lineHeight: 1.2 }}>
                    Не знаете, какой канал ваш?
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                    Подберём связку под вашу нишу и бюджет на бесплатном разборе.
                  </div>
                </div>
                <button
                  onClick={scrollToForm}
                  className="font-display"
                  style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "0.75rem 1.25rem", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", width: "100%", textAlign: "center" }}
                >
                  Получить разбор →
                </button>
              </div>
            </FadeUp>
          </div>
          <style>{`
            @media (max-width: 540px) {
              .tr-channels-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ── Калькулятор ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Калькулятор лидов для онлайн-школы</h2>
            <Calculator onScrollToForm={scrollToForm} />
          </FadeUp>
        </div>
      </section>

      {/* ── Как работаем ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Как работаем</h2>
          </FadeUp>
          {[
            "Бесплатный расчёт медиаплана и прогноз",
            "Аудит воронки продаж",
            "Аудит посадочных под конверсию",
            "Стратегия и расчёт бюджета по каналам",
            "Чат 24/7 + еженедельный отчёт с ежедневной разбивкой",
          ].map((step, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "1rem", padding: "1.25rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "center" }}>
                <span className="font-display" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#FF2D20" }}>0{i + 1}</span>
                <span style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{step}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Кейсы ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Кейсы</h2>
          </FadeUp>

          <div className="tr-cases-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
            {[
              { tag: "EdTech / Трафик ВК", idx: "01", client: "Перезапуск трафика ВКонтакте", desc: "20+ креативов, TOP-5 в работе. Система масштабирования по дублям кампаний.", result: "−45% стоимость лида", caseUrl: "/cases/school1-traffic" },
              { tag: "EdTech / Живой вебинар", idx: "02", client: "Живой вебинар с нуля", desc: "Формат для онлайн-школы 1–11 классов. Структура эфира, бот, тестирование связок.", result: "CAC −44%", caseUrl: "/cases/school1-webinar" },
              { tag: "D2C / FMCG", idx: "03", client: "AI-бот сегментации", desc: "GPT-бот: мини-кастдев, персональные офферы, ведёт до корзины и допродаж.", result: "+12% средний чек", caseUrl: "/cases/primekraft" },
            ].map((c, i) => (
              <FadeUp key={c.idx} delay={i * 0.08} style={{ height: "100%" }}>
                <div
                  style={{ background: "#0D0D0D", padding: "2rem 1.5rem", cursor: "pointer", transition: "background 0.2s", height: "100%", boxSizing: "border-box", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#111")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0D0D0D")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <span className="pill">{c.tag}</span>
                    <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>{c.idx}</span>
                  </div>
                  <div className="font-display" style={{ fontSize: "1.05rem", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.15, marginBottom: "0.75rem" }}>{c.client}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "1.25rem" }}>{c.desc}</div>
                  <div className="font-display" style={{ fontSize: "1.8rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1.0, marginBottom: "1.25rem" }}>{c.result}</div>
                  <Link href={c.caseUrl}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: "2px", transition: "color 0.2s" }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    Читать кейс →
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <div style={{ marginTop: "1.5rem" }}>
              <Link href="/#cases"
                style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: "2px", transition: "color 0.2s" }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                Все кейсы →
              </Link>
            </div>
          </FadeUp>
        </div>

        <style>{`
          @media (max-width: 700px) {
            .tr-cases-grid { grid-template-columns: 1fr !important; }
            .tr-cases-grid > div > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; }
          }
        `}</style>
      </section>

      {/* ── Почему мы ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Почему мы</h2>
            <p style={bodyText}>
              12 лет в маркетинге, 100+ вебинарных запусков. Не просто таргет — видим всю воронку: трафик, посадочную, прогрев, эфир, продажу.
            </p>
            <p style={{ ...bodyText, borderLeft: "3px solid #FF2D20", paddingLeft: "1.25rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic", margin: 0 }}>
              Не сливаем бюджет в дырявую воронку, а доводим до окупаемости. −45% стоимость лида, −44% привлечение клиента.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA + Форма ── */}
      <section id="zayavka" style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <div style={{ borderTop: "3px solid #FF2D20", paddingTop: "2rem", marginBottom: "2rem" }}>
              <h2 className="font-display" style={h2Style}>Бесплатный расчёт медиаплана</h2>
              <p style={bodyText}>Покажем, какие каналы и бюджет дадут заявки в вашей нише. Без обязательств.</p>
            </div>
            <TrafficForm />
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Частые вопросы</h2>
            {[
              { q: "Минимальный бюджет?", a: "От 40–50 тыс ₽ на канал. Меньше — тест без статистики, выводы делать нельзя." },
              { q: "Когда старт?", a: "Настройка в течение 2–3 дней после оплаты." },
              { q: "Нужен ли сайт?", a: "Необязательно — можем лить на вебинар, бот или соцсети." },
              { q: "Какие каналы выбрать?", a: "Зависит от ниши и воронки. Разберём на бесплатной сессии." },
              { q: "Если реклама не окупается?", a: "Тестируем несколько каналов, усиливаем рабочие, режем слабые." },
              { q: "Есть ли гарантии?", a: "Проанализируем прошлые кампании и улучшим. Чем лучше подготовка — тем выше результат." },
            ].map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "2rem 1.25rem", background: "#0A0A0A" }}>
        <div style={{ ...wrap, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 900, color: "rgba(255,255,255,0.2)" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
          <p style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", margin: 0 }}>
            © 2026 Агентство вебинарного продакшна
          </p>
        </div>
      </footer>

      {/* ── Плавающая кнопка Telegram ── */}
      <a href="https://t.me/+qTCI2A9QEOY3YzUy" target="_blank" rel="noopener noreferrer" aria-label="Наш Telegram"
        style={{ position: "fixed", bottom: "1.5rem", right: "1.25rem", zIndex: 1000, textDecoration: "none" }}>
        <div
          style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "#FF2D20", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(255,45,32,0.4)", transition: "transform 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21.93 3.29a1.5 1.5 0 0 0-1.55-.22L2.34 10.34a1.5 1.5 0 0 0 .1 2.79l4.06 1.35 1.57 4.91a1.5 1.5 0 0 0 2.59.44l2.1-2.73 4.32 3.19a1.5 1.5 0 0 0 2.33-1.01l2-14a1.5 1.5 0 0 0-.48-1.99Z" fill="white" />
          </svg>
        </div>
      </a>

    </div>
  );
}
