// NeuroPage.tsx
// Лендинг /neuro — НейроПродавец, AI-бот + автоворонка для онлайн-школ
// Стиль: #0A0A0A / #FF2D20 / Unbounded display (font-display)

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

const TG_BOT_TOKEN = "8672812865:AAGt98zHZj_Q2r5DnSNXxMl_fNe_Ti9DPxw";
const TG_CHAT_IDS = ["1342421992", "683646991"];

// ─── FadeUp ───────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >{children}</motion.div>
  );
}

// ─── Telegram ─────────────────────────────────────────────────────────────────

async function sendToTelegram(fields: Record<string, string>) {
  const text = `🤖 ЗАЯВКА: НейроПродавец\n\n` +
    Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nИсточник: /neuro`;
  try {
    await Promise.all(TG_CHAT_IDS.map(chat_id =>
      fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text }),
      })
    ));
  } catch {}
}

// ─── FAQ аккордеон ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "1.25rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", textAlign: "left" }}>
        <span className="font-display" style={{ fontSize: "0.95rem", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.3 }}>{q}</span>
        <span style={{ color: "#FF2D20", fontSize: "1.1rem", flexShrink: 0, display: "inline-block", transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, paddingBottom: "1.25rem", margin: 0 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Форма ────────────────────────────────────────────────────────────────────

function NeuroForm() {
  const [fields, setFields] = useState({ name: "", school: "", contact: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.contact) return;
    setLoading(true);
    await sendToTelegram({ "Имя": fields.name, "Школа / ниша": fields.school || "—", "Telegram / телефон": fields.contact });
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
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        style={{ padding: "2.5rem 2rem", border: "1px solid rgba(255,45,32,0.3)", background: "rgba(255,45,32,0.05)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
        <div className="font-display" style={{ fontSize: "1.4rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.5rem" }}>ЗАЯВКА ПРИНЯТА</div>
        <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>Свяжемся в течение дня.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {[
        { key: "name", label: "ИМЯ *", placeholder: "Как вас зовут" },
        { key: "school", label: "ШКОЛА / НИША", placeholder: "Название или тема курса" },
        { key: "contact", label: "TELEGRAM / ТЕЛЕФОН *", placeholder: "@username или +7 999 000 00 00" },
      ].map(f => (
        <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em" }}>{f.label}</label>
          <input style={inp} placeholder={f.placeholder}
            value={fields[f.key as keyof typeof fields]}
            onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
            onFocus={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.5)")}
            onBlur={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
          />
        </div>
      ))}
      <button type="submit" disabled={loading} className="font-display"
        style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.07em", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.2s", width: "100%" }}>
        {loading ? "ОТПРАВЛЯЕМ…" : "ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ →"}
      </button>
      <p style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", margin: 0 }}>
        Бесплатно · 30 минут · на выходе — готовый план автоматизации под вашу нишу
      </p>
    </form>
  );
}

// ─── Мотив «нейросеть» (inline SVG) ──────────────────────────────────────────

function NeuralSvg() {
  return (
    <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", right: 0, top: 0, width: "55%", height: "100%", opacity: 0.18, pointerEvents: "none" }}>
      {/* Узлы */}
      {[
        [480, 80], [540, 200], [500, 320], [420, 420], [350, 160],
        [310, 300], [240, 80], [160, 200], [200, 350], [90, 270],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 0 ? 14 : i < 3 ? 9 : 6} fill="#FF2D20" />
      ))}
      {/* Связи */}
      {[
        [480, 80, 540, 200], [540, 200, 500, 320], [500, 320, 420, 420],
        [480, 80, 350, 160], [350, 160, 540, 200], [350, 160, 310, 300],
        [310, 300, 500, 320], [310, 300, 420, 420], [350, 160, 240, 80],
        [240, 80, 160, 200], [160, 200, 310, 300], [160, 200, 200, 350],
        [200, 350, 310, 300], [90, 270, 160, 200], [90, 270, 200, 350],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF2D20" strokeWidth="1" />
      ))}
      {/* Радиальное свечение */}
      <radialGradient id="glow" cx="75%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#FF2D20" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#FF2D20" stopOpacity="0" />
      </radialGradient>
      <rect x="0" y="0" width="600" height="500" fill="url(#glow)" />
    </svg>
  );
}

// ─── Общие стили ─────────────────────────────────────────────────────────────

const wrap: React.CSSProperties = { maxWidth: "760px", margin: "0 auto" };
const sec: React.CSSProperties = { padding: "3.5rem 1.25rem" };
const h2Style: React.CSSProperties = { fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.02em", color: "#F5F5F0", lineHeight: 1.05, margin: "0 0 1.5rem" };
const bodyText: React.CSSProperties = { fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 1rem" };

// ─── Страница ─────────────────────────────────────────────────────────────────

export default function NeuroPage() {
  useEffect(() => {
    document.title = "НейроПродавец для онлайн-школ: автоворонка + AI-бот под ключ — Гипотеза";
  }, []);

  const scrollToForm = () => document.getElementById("zayavka")?.scrollIntoView({ behavior: "smooth" });

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
            Получить консультацию
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: "90svh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Радиальное свечение фоном */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 80% 40%, rgba(255,45,32,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <NeuralSvg />

        <div style={{ position: "relative", padding: "5rem 1.25rem 4rem", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "640px" }}>
            <FadeUp>
              {/* Тег-чип */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", border: "1px solid rgba(255,45,32,0.4)", padding: "0.35rem 0.85rem", marginBottom: "1.75rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF2D20", flexShrink: 0 }} />
                <span style={{ fontFamily: "Inter", fontSize: "0.68rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", textTransform: "uppercase" }}>НейроЛидГен для EdTech · под ключ</span>
              </div>

              <h1 className="font-display" style={{ fontSize: "clamp(1.75rem, 5.5vw, 3.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
                НейроПродавец, который не ошибается и не устаёт
              </h1>
              <p className="font-display" style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
                AI-система, которая сама сегментирует лидов, прогревает их и доводит до оплаты <span style={{ color: "#FF2D20" }}>24/7</span>
              </p>
              <p style={{ fontFamily: "Inter", fontSize: "clamp(0.875rem, 2.8vw, 1rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: "560px", marginBottom: "1.75rem" }}>
                Настраиваем автоворонку и AI-бота, который мгновенно подключается к каждому лиду, проводит мини-кастдев, квалифицирует и передаёт горячего клиента в отдел продаж — или сразу закрывает сделку. Без менеджеров на первой линии.
              </p>

              {/* Буллиты */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
                {[
                  "Персонализация под сегменты аудитории",
                  "Автоматический scoring и квалификация лидов",
                  "Полная аналитика: причины отказов, ветки диалога, слабые точки",
                  "Умные апселлы по поведенческим и продуктовым триггерам",
                ].map(b => (
                  <div key={b} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ color: "#FF2D20", flexShrink: 0, marginTop: "0.05rem" }}>→</span>
                    <span style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{b}</span>
                  </div>
                ))}
              </div>

              <button onClick={scrollToForm} className="font-display"
                style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.07em", cursor: "pointer", width: "100%", maxWidth: "340px", display: "block" }}>
                Получить консультацию →
              </button>
              <p style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", marginTop: "0.75rem" }}>
                Бесплатно · 30 минут · покажем, как это работает на вашей нише
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 6 проблем ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Ваши 6 главных проблем — и как AI закрывает каждую</h2>
          </FadeUp>
          <div className="neuro-problems-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "2rem" }}>
            {[
              { pain: "Лиды «остывают», пока менеджер отвечает 30+ минут", fix: "AI вступает в диалог мгновенно. SLA < 15 секунд." },
              { pain: "Менеджеры перегружены — заявки теряются", fix: "AI-бот закрывает первую линию 24/7: смены, выходные, форс-мажоры." },
              { pain: "Нет системного кастдева", fix: "AI сам проводит микрокастдев: цели, боли, ожидания." },
              { pain: "Ресурсы уходят на «мусорные» лиды", fix: "AI фильтрует, квалифицирует, передаёт только готовых." },
              { pain: "Высокие косты на первую линию", fix: "AI закрывает первую линию и сокращает косты на 30–60%." },
              { pain: "Внедрение AI кажется сложным", fix: "Внедряем под ключ: сценарии, обучение, CRM. Без вашего IT." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.06} style={{ height: "100%" }}>
                <div style={{ background: "#0D0D0D", padding: "1.5rem 1.25rem", height: "100%", boxSizing: "border-box" }}>
                  <div style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5, marginBottom: "0.75rem" }}>{item.pain}</div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <span style={{ color: "#FF2D20", flexShrink: 0, fontSize: "0.85rem" }}>→</span>
                    <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "#F5F5F0", lineHeight: 1.55, fontWeight: 500 }}>{item.fix}</span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.3}>
            <button onClick={scrollToForm} className="font-display"
              style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.07em", cursor: "pointer", width: "100%" }}>
              Получить консультацию →
            </button>
          </FadeUp>
          <style>{`@media (max-width: 540px) { .neuro-problems-grid { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      </section>

      {/* ── 6 шагов ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Как работает НейроПродавец — 6 шагов</h2>
          </FadeUp>
          {[
            { n: "01", title: "Лид поступает", desc: "Бот мгновенно подключается. SLA < 15 секунд." },
            { n: "02", title: "Автосегментация", desc: "По 5–10 сценариям: цель, боль, готовность, тип запроса." },
            { n: "03", title: "Индивидуальная работа", desc: "Возражения → мягкая обработка; контент → прогрев/кейсы; продукт → точное предложение под задачу." },
            { n: "04", title: "Умное решение", desc: "Готов купить → ссылка на оплату; хочет консультацию → заявка в отдел продаж; нужен прогрев → контент и возврат к диалогу." },
            { n: "05", title: "Мини-кастдев в реальном времени", desc: "Боли, цели, мотивация, ожидания, возражения → усиливает маркетинг, продукт и продажи." },
            { n: "06", title: "Интеграция в вашу CRM", desc: "Кто приходит, что ищет, где сомневается. Прозрачность от клика до оплаты." },
          ].map((item, i) => (
            <FadeUp key={item.n} delay={i * 0.07}>
              <div style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "1rem", padding: "1.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "start" }}>
                <span className="font-display" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#FF2D20", paddingTop: "0.1rem" }}>{item.n}</span>
                <div>
                  <div className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.3rem" }}>{item.title}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              </div>
            </FadeUp>
          ))}
          <FadeUp delay={0.3}>
            <button onClick={scrollToForm} className="font-display"
              style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.07em", cursor: "pointer", width: "100%", marginTop: "2rem" }}>
              Получить консультацию →
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── 6 цифр ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Что получаете в итоге</h2>
          </FadeUp>
          <div className="neuro-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {[
              { val: "< 15 сек", label: "первый ответ вместо 30–60 минут" },
              { val: "−30–60%", label: "косты на первую линию" },
              { val: "×2–3", label: "конверсия заявка → диалог" },
              { val: "24/7", label: "приём и квалификация" },
              { val: "100%", label: "лидов обработаны" },
              { val: "Авто", label: "данные кастдева в CRM" },
            ].map((m, i) => (
              <FadeUp key={m.val} delay={i * 0.06} style={{ height: "100%" }}>
                <div style={{ background: "#0D0D0D", padding: "1.5rem 1rem", height: "100%", boxSizing: "border-box", textAlign: "center" }}>
                  <div className="font-display" style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 900, color: "#FF2D20", lineHeight: 1, marginBottom: "0.5rem" }}>{m.val}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{m.label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
          <style>{`
            @media (max-width: 540px) { .neuro-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; } }
            @media (max-width: 360px) { .neuro-metrics-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </div>
      </section>

      {/* ── Кейсы ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Примеры из практики</h2>
          </FadeUp>
          <div className="neuro-cases-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0" }}>
            {[
              {
                tag: "Онлайн-школа по маркетингу",
                idx: "01",
                sub: "3 000 лидов/мес",
                desc: "Заявки шли в 4 канала, теряли до 30% обращений. Внедрили AI-бота: агрегирует обращения из всех каналов, проводит микрокастдев, квалифицирует, передаёт горячего лида с карточкой и приоритетом.",
                result: "18% → 41%",
                resultLabel: "конверсия в звонок",
                caseUrl: "/cases/primekraft",
              },
              {
                tag: "E-com",
                idx: "02",
                sub: "Автоматизация входящих регистраций",
                desc: "Кастдев, выявление потребности, персональная товарная линейка. Бот определял сегмент и предлагал оптимальный вход в воронку.",
                result: "22% → 58%",
                resultLabel: "доходимость до вебинара",
                caseUrl: "/cases/primekraft",
              },
            ].map((c, i) => (
              <FadeUp key={c.idx} delay={i * 0.1} style={{ height: "100%" }}>
                <div
                  style={{ background: "#0A0A0A", padding: "2rem 1.5rem", height: "100%", boxSizing: "border-box", borderRight: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none", cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#111")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#0A0A0A")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <span className="pill">{c.tag}</span>
                    <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>{c.idx}</span>
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginBottom: "1rem", lineHeight: 1.4 }}>{c.sub}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "1.25rem" }}>{c.desc}</div>
                  <div className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1, marginBottom: "0.3rem" }}>{c.result}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>{c.resultLabel}</div>
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
          <style>{`@media (max-width: 600px) { .neuro-cases-grid { grid-template-columns: 1fr !important; } .neuro-cases-grid > div > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; } }`}</style>
        </div>
      </section>

      {/* ── Что входит ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Что входит в пакет</h2>
          </FadeUp>
          {[
            { n: "01", title: "AI-бот с автосегментацией", desc: "Telegram / WhatsApp / VK, до 20 сценариев" },
            { n: "02", title: "Автоворонка прогрева", desc: "До 14 шагов под сегмент" },
            { n: "03", title: "Интеграция с CRM", desc: "GetCourse / amoCRM / Bitrix" },
            { n: "04", title: "Scoring и квалификация", desc: "Только горячие лиды к менеджеру" },
            { n: "05", title: "Аналитический дашборд", desc: "Конверсия по шагам, причины отказов" },
            { n: "06", title: "Обучение модели", desc: "На ваших данных, продуктах и кейсах" },
            { n: "07", title: "Сопровождение 30 дней", desc: "Доработка, тестирование, поддержка" },
          ].map((item, i) => (
            <FadeUp key={item.n} delay={i * 0.06}>
              <div style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "1rem", padding: "1.25rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "start" }}>
                <span className="font-display" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#FF2D20", paddingTop: "0.1rem" }}>{item.n}</span>
                <div>
                  <div className="font-display" style={{ fontSize: "0.95rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.2rem" }}>{item.title}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Под ключ ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Услуга под ключ — без участия вашей команды</h2>
            <p style={bodyText}>Сложная интеграция — наша забота. Берём на себя:</p>
            {[
              "разработку сценариев и логики диалогов",
              "обучение модели на ваших данных, продуктах и кейсах",
              "подключение к CRM и настройку автоматизации",
              "тестирование и доработку до стабильного результата",
            ].map(item => (
              <div key={item} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem" }}>
                <span style={{ color: "#FF2D20", flexShrink: 0 }}>→</span>
                <span style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
            <p style={{ ...bodyText, marginTop: "1.25rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
              Без вашей команды. Без IT-отдела. Без необходимости разбираться в технологиях.
            </p>
            <p style={{ ...bodyText, borderLeft: "3px solid #FF2D20", paddingLeft: "1.25rem", margin: 0 }}>
              Вы получаете цифрового менеджера, который стабильно закрывает первую линию — уже в первые дни после внедрения.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Частые вопросы</h2>
            {[
              { q: "Сколько занимает запуск?", a: "3–4 недели от старта до первой живой заявки через систему." },
              { q: "Нужно ли менять CRM / платформу?", a: "Нет. Работаем с GetCourse, amoCRM, Bitrix24, Notion+Make. Нет платформы — поможем выбрать." },
              { q: "Что если бот не справится с нестандартным вопросом?", a: "Сценарий эскалации: передаёт диалог менеджеру с полным контекстом и карточкой лида. Ни один лид не теряется." },
              { q: "Подойдёт для небольшой школы?", a: "Да. AI-бот закрывает объём двух менеджеров на первой линии." },
              { q: "Как бот узнаёт о продукте?", a: "Обучаем модель на ваших материалах: курсы, FAQ, кейсы, возражения. Бот говорит о продукте как ваш лучший менеджер." },
            ].map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </FadeUp>
        </div>
      </section>

      {/* ── CTA + Форма ── */}
      <section id="zayavka" style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <div style={{ borderTop: "3px solid #FF2D20", paddingTop: "2rem", marginBottom: "2rem" }}>
              <h2 className="font-display" style={h2Style}>Запустите НейроПродавца, который работает пока вы спите</h2>
              <p style={bodyText}>
                Оставьте заявку — на стратегической сессии разберём вашу текущую воронку, покажем где вы теряете лидов прямо сейчас и составим план внедрения AI под вашу школу.
              </p>
            </div>
            <NeuroForm />
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "2rem 1.25rem", background: "#0A0A0A" }}>
        <div style={{ ...wrap, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 900, color: "rgba(255,255,255,0.2)" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
          <p style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 Агентство вебинарного продакшна</p>
        </div>
      </footer>

      {/* ── Плавающая кнопка Telegram ── */}
      <a href="https://t.me/+qTCI2A9QEOY3YzUy" target="_blank" rel="noopener noreferrer" aria-label="Наш Telegram"
        style={{ position: "fixed", bottom: "1.5rem", right: "1.25rem", zIndex: 1000, textDecoration: "none" }}>
        <div
          style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "#FF2D20", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(255,45,32,0.4)", transition: "transform 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21.93 3.29a1.5 1.5 0 0 0-1.55-.22L2.34 10.34a1.5 1.5 0 0 0 .1 2.79l4.06 1.35 1.57 4.91a1.5 1.5 0 0 0 2.59.44l2.1-2.73 4.32 3.19a1.5 1.5 0 0 0 2.33-1.01l2-14a1.5 1.5 0 0 0-.48-1.99Z" fill="white" />
          </svg>
        </div>
      </a>

    </div>
  );
}
