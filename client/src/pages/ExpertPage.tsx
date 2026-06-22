// ExpertPage.tsx
// Лендинг /expert — упаковка экспертизы, mobile-first, ВК-трафик
// Стиль: #0A0A0A / #FF2D20 / Unbounded display (font-display)

import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import TeamSection from "@/components/TeamSection";

const TG_BOT_TOKEN = "8672812865:AAGt98zHZj_Q2r5DnSNXxMl_fNe_Ti9DPxw";
const TG_CHAT_IDS = ["1342421992", "683646991"];

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

async function sendToTelegram(fields: Record<string, string>) {
  const text =
    `🎯 ЗАЯВКА: упаковка экспертизы\n\n` +
    Object.entries(fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n") +
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
    transition: "border-color 0.2s",
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: "2.5rem 2rem",
          border: "1px solid rgba(255,45,32,0.3)",
          background: "rgba(255,45,32,0.05)",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
        <div
          className="font-display"
          style={{ fontSize: "1.4rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.5rem" }}
        >
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
          background: "#FF2D20", color: "#fff", border: "none",
          padding: "1rem 2rem", fontSize: "0.9rem", fontWeight: 700,
          letterSpacing: "0.07em", cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1, transition: "opacity 0.2s", width: "100%",
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

// ─── Общие стили ─────────────────────────────────────────────────────────────

const wrap: React.CSSProperties = { maxWidth: "760px", margin: "0 auto" };
const sec: React.CSSProperties = { padding: "3.5rem 1.25rem" };
const h2Style: React.CSSProperties = {
  fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)",
  fontWeight: 900,
  letterSpacing: "-0.02em",
  color: "#F5F5F0",
  lineHeight: 1.05,
  margin: "0 0 1.5rem",
};
const bodyText: React.CSSProperties = {
  fontFamily: "Inter",
  fontSize: "0.95rem",
  color: "rgba(255,255,255,0.5)",
  lineHeight: 1.75,
  margin: "0 0 1rem",
};

// ─── Страница ─────────────────────────────────────────────────────────────────

export default function ExpertPage() {
  useEffect(() => {
    document.title = "Упакуем вашу экспертизу в продающую воронку — Гипотеза";
  }, []);

  const scrollToForm = () => {
    document.getElementById("zayavka")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F5F0", overflowX: "hidden" }}>

      {/* ── Шапка ── */}
      <header style={{
        padding: "1.1rem 1.25rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)",
      }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <span className="font-display" style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.05em", cursor: "pointer", textDecoration: "none", color: "#F5F5F0" }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
          </Link>
          <button
            onClick={scrollToForm}
            style={{ fontFamily: "Inter", fontSize: "0.78rem", color: "#FF2D20", background: "none", border: "1px solid rgba(255,45,32,0.35)", padding: "0.45rem 1rem", cursor: "pointer", letterSpacing: "0.04em" }}
          >
            Получить разбор
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero-section" style={{ position: "relative", minHeight: "92svh", display: "flex", alignItems: "flex-end" }}>
        <img
          src="/expert/hero.png"
          alt=""
          className="hero-img"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Горизонтальный градиент: тёмная левая полоса, правая открыта */}
        <div className="hero-grad-h" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #0A0A0A 0%, rgba(10,10,10,0.85) 38%, rgba(10,10,10,0.15) 70%, transparent 100%)" }} />
        {/* Вертикальный градиент: низ закрыт */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, #0A0A0A 100%)" }} />

        <div style={{ position: "relative", padding: "0 1.25rem 3.5rem", width: "100%", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "620px" }}>
            <FadeUp>
              <p style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "#FF2D20", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                ДЛЯ ЭКСПЕРТОВ, НАСТАВНИКОВ И БЛОГЕРОВ
              </p>
              <h1 className="font-display hero-h1" style={{ fontSize: "clamp(1.75rem, 5.5vw, 3.8rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
                Экспертиза есть. Системных <span style={{ color: "#FF2D20" }}>продаж</span> — нет.
              </h1>
              <p style={{ fontFamily: "Inter", fontSize: "clamp(0.9rem, 3vw, 1.05rem)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "480px", marginBottom: "2rem" }}>
                Упакуем ваши знания в продающую воронку под ключ: оффер, продукт, вебинар, дожим. Вы в кадре — деньги в системе.
              </p>
              <button
                onClick={scrollToForm}
                className="font-display"
                style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.07em", cursor: "pointer", width: "100%", maxWidth: "340px" }}
              >
                Получить бесплатный разбор →
              </button>
            </FadeUp>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-section { min-height: 88vh !important; }
            .hero-img { object-position: 72% 20% !important; }
            .hero-grad-h { background: rgba(10,10,10,0.7) !important; }
            .hero-h1 { font-size: clamp(1.6rem, 7vw, 2.4rem) !important; }
          }
        `}</style>
      </section>

      {/* ── Это про вас, если ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Это про вас, если</h2>
            {[
              "ведёте блог, консультируете или обучаете, но покупают от случая к случаю",
              "запускали сами: бюджет ушёл, заявок мало, сил ноль",
              "аудитория есть, а продаж из неё — нет",
              "тему знаете глубоко, но упаковать её в продукт и воронку — не ваша работа",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", padding: "1.1rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "flex-start" }}>
                <span style={{ color: "#FF2D20", flexShrink: 0, fontFamily: "Inter", lineHeight: 1.75 }}>—</span>
                <span style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{item}</span>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── Почему сильная экспертиза не приносит денег ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Почему сильная экспертиза не приносит денег</h2>
            <p style={bodyText}>
              Знать тему и продавать её — два разных навыка. Между ними стоит упаковка. Обычно не хватает четырёх вещей: оффера, который бьёт в боль; продуктовой линейки; воронки с касаниями; системы вместо разовых запусков.
            </p>
            <p style={{ ...bodyText, borderLeft: "3px solid #FF2D20", paddingLeft: "1.25rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic", margin: 0 }}>
              Контент вы и так делаете. Денег он не приносит, потому что за ним нет механики продаж.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Что входит в упаковку ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Что входит в упаковку</h2>
          </FadeUp>
          {[
            { n: "01", title: "Распаковка экспертизы", desc: "Достаём смыслы, собираем оффер и обещание под вашу аудиторию." },
            { n: "02", title: "Продуктовая линейка", desc: "Лид-магнит → недорогой вход → основной продукт. Чтобы покупали по шагам." },
            { n: "03", title: "Воронка", desc: "Вебинар или автовебинар + прогрев + дожим. Продаёт без вашего ручного участия." },
            { n: "04", title: "Контент и трафик", desc: "Связки под каналы, включая ВК. Чтобы воронка наполнялась." },
            { n: "05", title: "Запуск и аналитика", desc: "Считаем юнит-экономику до старта и доводим до окупаемости." },
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
      </section>

      {/* ── Кейсы — с цифрами ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Уже делали это — с цифрами</h2>
          </FadeUp>

          <div
            className="expert-cases-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}
          >
            {[
              {
                tag: "EdTech / Живой вебинар",
                idx: "01",
                client: "Живой вебинар с нуля",
                desc: "Создали формат живого мероприятия для онлайн-школы 1–11 классов. Разработали структуру эфира, настроили бот, протестировали связки.",
                result: "CAC −44%",
                caseUrl: "/cases/school1-webinar",
              },
              {
                tag: "EdTech / Трафик ВК",
                idx: "02",
                client: "Перезапуск трафика ВКонтакте",
                desc: "Провели анализ целевых лидов, протестировали 20+ креативов, выделили TOP-5. Выстроили систему масштабирования.",
                result: "−45% стоимость лида",
                caseUrl: "/cases/school1-traffic",
              },
              {
                tag: "D2C / FMCG",
                idx: "03",
                client: "AI-бот сегментации",
                desc: "Запустили AI-бота на GPT-логике: проводит мини-кастдев, формирует персональные офферы, ведёт до корзины и допродаж.",
                result: "+12% средний чек",
                caseUrl: "/cases/primekraft",
              },
            ].map((c, i) => (
              <FadeUp key={c.idx} delay={i * 0.08} style={{ height: "100%" }}>
                <div
                  style={{
                    background: "#0D0D0D", padding: "2rem 1.5rem", cursor: "pointer", transition: "background 0.2s",
                    height: "100%", boxSizing: "border-box",
                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#111")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0D0D0D")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                    <span className="pill">{c.tag}</span>
                    <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>{c.idx}</span>
                  </div>
                  <div className="font-display" style={{ fontSize: "1.05rem", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.15, marginBottom: "0.75rem" }}>
                    {c.client}
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                    {c.desc}
                  </div>
                  <div className="font-display" style={{ fontSize: "1.8rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1.0, marginBottom: "1.25rem" }}>
                    {c.result}
                  </div>
                  <Link
                    href={c.caseUrl}
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
              <Link
                href="/#cases"
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
            .expert-cases-grid {
              grid-template-columns: 1fr !important;
            }
            .expert-cases-grid > div > div {
              border-right: none !important;
              border-bottom: 1px solid rgba(255,255,255,0.06) !important;
            }
          }
        `}</style>
      </section>

      {/* ── Как идёт работа ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Как идёт работа</h2>
          </FadeUp>
          <div className="expert-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {[
              { n: "1", title: "Разбор", desc: "Смотрим вашу экспертизу, аудиторию и продукт." },
              { n: "2", title: "Стратегия", desc: "Собираем воронку и оффер под вашу нишу." },
              { n: "3", title: "Сборка", desc: "Лендинги, вебинар, письма, дожим — под ключ." },
              { n: "4", title: "Запуск", desc: "Ведём, считаем метрики, докручиваем." },
            ].map((item, i) => (
              <FadeUp key={item.n} delay={i * 0.08}>
                <div style={{ background: "#0A0A0A", padding: "1.75rem 1.25rem", height: "100%", boxSizing: "border-box" }}>
                  <span className="font-display" style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1, display: "block", marginBottom: "0.5rem" }}>{item.n}</span>
                  <div className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.4rem" }}>{item.title}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </FadeUp>
            ))}
          </div>
          <style>{`
            @media (max-width: 400px) {
              .expert-steps-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ── Почему мы ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Почему мы</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "0 0 1.5rem" }}>
              {[
                "12 лет в маркетинге, 6 из них — в EdTech",
                "100+ вебинарных запусков",
                "30+ кейсов в онлайн-образовании",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#FF2D20", flexShrink: 0, fontFamily: "Inter" }}>—</span>
                  <span style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ ...bodyText, borderLeft: "3px solid #FF2D20", paddingLeft: "1.25rem", margin: 0 }}>
              Вы остаётесь экспертом в кадре. Продюсирование берём на себя.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Команда ── */}
      <TeamSection />

      {/* ── CTA + Форма ── */}
      <section id="zayavka" style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={wrap}>
          <FadeUp>
            <div style={{ borderTop: "3px solid #FF2D20", paddingTop: "2rem", marginBottom: "2rem" }}>
              <h2 className="font-display" style={h2Style}>Разберём вашу воронку бесплатно</h2>
              <p style={bodyText}>Покажем, как упаковать вашу экспертизу в продажи и с чего начать. Без обязательств.</p>
            </div>
            <ExpertForm />
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ ...sec, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0D0D0D" }}>
        <div style={wrap}>
          <FadeUp>
            <h2 className="font-display" style={h2Style}>Частые вопросы</h2>
            {[
              { q: "У меня небольшая аудитория.", a: "Воронка работает и на малых охватах, если оффер точный. Покажем на разборе." },
              { q: "Не хочу сам вести вебинары.", a: "Есть форматы с минимумом эфира: автовебинар, записанные сессии." },
              { q: "Сколько стоит?", a: "Цена индивидуальная, зависит от объёма. Назовём после бесплатного разбора." },
              { q: "С чего начать?", a: "С заявки на разбор. Дальше — стратегия под вашу нишу." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div style={{ padding: "1.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="font-display" style={{ fontSize: "0.95rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.5rem" }}>{item.q}</div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{item.a}</div>
                </div>
              </FadeUp>
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
      <a
        href="https://t.me/+qTCI2A9QEOY3YzUy"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Наш Telegram"
        style={{ position: "fixed", bottom: "1.5rem", right: "1.25rem", zIndex: 1000, textDecoration: "none" }}
      >
        <div
          style={{
            width: "3rem", height: "3rem", borderRadius: "50%",
            background: "#FF2D20", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(255,45,32,0.4)", transition: "transform 0.2s",
          }}
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
