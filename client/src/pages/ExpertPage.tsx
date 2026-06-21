// ExpertPage.tsx
// Лендинг /expert — оффер для экспертов, mobile-first, ВК-трафик
// Фирстиль: #0A0A0A / #FF2D20 / Unbounded display

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const TG_BOT_TOKEN = "8672812865:AAGt98zHZj_Q2r5DnSNXxMl_fNe_Ti9DPxw";
const TG_CHAT_IDS = ["1342421992", "683646991"];

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
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

async function sendToTelegram(fields: Record<string, string>) {
  const text =
    `🎯 ЗАЯВКА: упаковка экспертизы\n\n` +
    Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nИсточник: /expert (ВК)`;
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

// ─── Форма заявки ────────────────────────────────────────────────────────────

function ExpertForm() {
  const [fields, setFields] = useState({ name: "", contact: "", niche: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.contact) return;
    setLoading(true);
    await sendToTelegram({
      "Имя": fields.name,
      "Telegram / телефон / ВК": fields.contact,
      "Тема экспертизы": fields.niche || "—",
    });
    setLoading(false);
    setSent(true);
  };

  const inp: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    color: "#F5F5F0",
    fontFamily: "Inter",
    fontSize: "1rem",
    padding: "0.65rem 0",
    outline: "none",
    boxSizing: "border-box",
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
          Свяжемся в течение дня. Без спама и навязчивых продаж.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {[
        { key: "name", label: "ИМЯ *", placeholder: "Как вас зовут" },
        { key: "contact", label: "TELEGRAM / ТЕЛЕФОН / ВК *", placeholder: "@username или +7 999 000 00 00" },
        { key: "niche", label: "ТЕМА ВАШЕЙ ЭКСПЕРТИЗЫ", placeholder: "Психология, дизайн, маркетинг…" },
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
        type="submit"
        disabled={loading}
        className="font-display"
        style={{
          background: "#FF2D20",
          color: "#fff",
          border: "none",
          padding: "1rem 2rem",
          fontSize: "0.9rem",
          fontWeight: 700,
          letterSpacing: "0.07em",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.2s",
          width: "100%",
        }}
      >
        {loading ? "ОТПРАВЛЯЕМ…" : "ПОЛУЧИТЬ РАЗБОР →"}
      </button>
      <p style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", margin: 0 }}>
        Ответим в течение дня. Без спама.
      </p>
    </form>
  );
}

// ─── Главная страница ─────────────────────────────────────────────────────────

export default function ExpertPage() {
  useEffect(() => {
    document.title = "Упакуем вашу экспертизу в продающую воронку — Гипотеза";
  }, []);

  const scrollToForm = () => {
    document.getElementById("zayavka")?.scrollIntoView({ behavior: "smooth" });
  };

  const sec: React.CSSProperties = { padding: "3.5rem 1.25rem" };
  const container: React.CSSProperties = { maxWidth: "760px", margin: "0 auto" };

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F5F0", overflowX: "hidden" }}>

      {/* ── Шапка ── */}
      <header style={{ padding: "1.1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="font-display" style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.05em" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
          <button
            onClick={scrollToForm}
            style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "#FF2D20", background: "none", border: "1px solid rgba(255,45,32,0.35)", padding: "0.45rem 1rem", cursor: "pointer", letterSpacing: "0.04em" }}
          >
            Получить разбор
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: "90svh", display: "flex", alignItems: "flex-end", padding: 0 }}>
        <img
          src="/expert/hero.png"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.75) 55%, #0A0A0A 100%)" }} />
        <div style={{ position: "relative", padding: "0 1.25rem 3rem", width: "100%", maxWidth: "760px", margin: "0 auto" }}>
          <FadeUp>
            <p style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "#FF2D20", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              ДЛЯ ЭКСПЕРТОВ, НАСТАВНИКОВ И БЛОГЕРОВ
            </p>
            <h1 className="font-display" style={{ fontSize: "clamp(2rem, 8vw, 3.6rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              У вас есть экспертиза.<br />
              Нет воронки,<br />которая её <span style={{ color: "#FF2D20" }}>продаёт.</span>
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: "clamp(0.9rem, 3.5vw, 1.05rem)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "520px", marginBottom: "2rem" }}>
              Упакуем ваши знания в продающую воронку под ключ: смыслы, продукт, вебинар, дожим. Вы — в кадре, мы — за кадром.
            </p>
            <button
              onClick={scrollToForm}
              className="font-display"
              style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.07em", cursor: "pointer", width: "100%", maxWidth: "360px" }}
            >
              Получить бесплатный разбор →
            </button>
          </FadeUp>
        </div>
      </section>

      {/* ── Это про вас, если ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={container}>
          <FadeUp>
            <h2 className="font-display" style={h2}>Это про вас, если</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                "ведёте блог, консультируете или обучаете, но продажи — от случая к случаю",
                "пробовали запускать сами: бюджет ушёл, заявок мало, сил ноль",
                "аудитория есть, а системных продаж нет",
                "тему знаете глубоко, но упаковать её в продукт и воронку — не ваша работа",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", padding: "1.1rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "flex-start" }}>
                  <span style={{ color: "#FF2D20", flexShrink: 0, fontSize: "1rem", lineHeight: 1.6 }}>—</span>
                  <span style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Почему экспертиза не продаётся сама ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={container}>
          <FadeUp>
            <h2 className="font-display" style={h2}>Почему экспертиза не продаётся сама</h2>
            <p style={body}>
              Сильная экспертиза не равна продажам. Между ними — упаковка. Чаще всего не хватает четырёх вещей:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", margin: "1.5rem 0 1.25rem" }}>
              {[
                "оффера, который бьёт в боль",
                "продуктовой линейки",
                "воронки с касаниями",
                "системы, а не разовых запусков",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: "0.75rem" }}>
                  <span style={{ color: "#FF2D20", flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ ...body, fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>
              Контент есть. Денег он не приносит.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Что входит в упаковку ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={container}>
          <FadeUp>
            <h2 className="font-display" style={h2}>Что входит в упаковку</h2>
          </FadeUp>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { n: "01", title: "Распаковка экспертизы", desc: "Достаём смыслы, формулируем оффер и обещание под вашу аудиторию." },
              { n: "02", title: "Продуктовая линейка", desc: "Лид-магнит → недорогой вход → основной продукт. Чтобы покупали по шагам." },
              { n: "03", title: "Воронка", desc: "Вебинар или автовебинар + прогрев + дожим. Система, что продаёт без вашего ручного участия." },
              { n: "04", title: "Контент и трафик", desc: "Связки под каналы, включая ВК. Чтобы воронка наполнялась." },
              { n: "05", title: "Запуск и аналитика", desc: "Считаем по метрикам и доводим до окупаемости, а не «запустили и забыли»." },
            ].map((item, i) => (
              <FadeUp key={item.n} delay={i * 0.07}>
                <div style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "1rem", padding: "1.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "start" }}>
                  <span className="font-display" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#FF2D20", paddingTop: "0.15rem" }}>{item.n}</span>
                  <div>
                    <div className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.3rem" }}>{item.title}</div>
                    <div style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Баннер funnel.png ── */}
      <div style={{ width: "100%", maxHeight: "60vw", overflow: "hidden", position: "relative" }}>
        <img
          src="/expert/funnel.png"
          alt="Воронка под ключ"
          style={{ width: "100%", display: "block", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #0A0A0A 0%, transparent 15%, transparent 85%, #0A0A0A 100%)" }} />
      </div>

      {/* ── Как идёт работа ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={container}>
          <FadeUp>
            <h2 className="font-display" style={h2}>Как идёт работа</h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", marginTop: "1.5rem" }}>
            {[
              { n: "1", title: "Разбор", desc: "Смотрим вашу экспертизу, аудиторию и продукт." },
              { n: "2", title: "Стратегия", desc: "Собираем воронку и оффер под вашу нишу." },
              { n: "3", title: "Сборка", desc: "Лендинги, вебинар, письма, дожим — под ключ." },
              { n: "4", title: "Запуск", desc: "Ведём, считаем метрики, докручиваем." },
            ].map((item, i) => (
              <FadeUp key={item.n} delay={i * 0.08}>
                <div style={{ background: "#0D0D0D", padding: "1.5rem 1.25rem", height: "100%" }}>
                  <span className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1, display: "block", marginBottom: "0.5rem" }}>{item.n}</span>
                  <div className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.4rem" }}>{item.title}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Почему мы ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={container}>
          <FadeUp>
            <h2 className="font-display" style={h2}>Почему мы</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.25rem 0 1.5rem" }}>
              {[
                "12 лет в маркетинге, 6 из них — в EdTech",
                "100+ вебинарных запусков",
                "30+ кейсов в онлайн-образовании",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#FF2D20", flexShrink: 0 }}>—</span>
                  <span style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ ...body, borderLeft: "3px solid #FF2D20", paddingLeft: "1.25rem", fontStyle: "italic" }}>
              Вы остаётесь экспертом в кадре. Продюсирование берём на себя.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA + Форма ── */}
      <section id="zayavka" style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={container}>
          <FadeUp>
            <div style={{ borderTop: "3px solid #FF2D20", paddingTop: "2rem", marginBottom: "2rem" }}>
              <h2 className="font-display" style={{ ...h2, marginBottom: "0.75rem" }}>Разберём вашу воронку бесплатно</h2>
              <p style={body}>
                Покажем, как упаковать вашу экспертизу в продажи и с чего начать. Без обязательств.
              </p>
            </div>
            <ExpertForm />
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={container}>
          <FadeUp>
            <h2 className="font-display" style={h2}>Частые вопросы</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  q: "У меня небольшая аудитория.",
                  a: "Воронка работает и на малых охватах, если оффер точный. Покажем на разборе.",
                },
                {
                  q: "Не хочу сам вести вебинары.",
                  a: "Есть форматы с минимумом эфира: автовебинар, записанные сессии.",
                },
                {
                  q: "Сколько стоит?",
                  a: "Цена индивидуальная, зависит от объёма. Назовём после бесплатного разбора.",
                },
                {
                  q: "С чего начать?",
                  a: "С заявки на разбор. Дальше — стратегия под вашу нишу.",
                },
              ].map((item, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div style={{ padding: "1.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="font-display" style={{ fontSize: "0.95rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.5rem" }}>
                      {item.q}
                    </div>
                    <div style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
                      {item.a}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "2rem 1.25rem", background: "#0A0A0A" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 900, color: "rgba(255,255,255,0.2)" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
          <p style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", margin: 0 }}>
            © 2026 Агентство вебинарного продакшна
          </p>
        </div>
      </footer>

      {/* ── Плавающая кнопка Telegram ── */}
      <a
        href="https://t.me/+qTCI2A9QEOY3YzUy"
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: "fixed", bottom: "1.5rem", right: "1.25rem", zIndex: 1000, display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}
      >
        <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", whiteSpace: "nowrap", display: "none" }}
          className="tg-label">
          Наш Telegram
        </span>
        <div
          style={{ width: "2.75rem", height: "2.75rem", borderRadius: "50%", background: "#FF2D20", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(255,45,32,0.35)", transition: "transform 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L12 2M12 2H4M12 2V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </a>

    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const h2: React.CSSProperties = {
  fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
  fontWeight: 900,
  letterSpacing: "-0.02em",
  color: "#F5F5F0",
  marginBottom: "1.25rem",
  marginTop: 0,
  lineHeight: 1.05,
};

const body: React.CSSProperties = {
  fontFamily: "Inter",
  fontSize: "0.95rem",
  color: "rgba(255,255,255,0.5)",
  lineHeight: 1.75,
  marginBottom: "1rem",
  fontWeight: 300,
};
