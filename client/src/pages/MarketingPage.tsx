/**
 * /marketing — Продающая страница курса для маркетологов агентств
 * JTBD-структура: Oneliner → Aha-момент → Ценность → Узнаёшь себя? → Как выполним → Точка Б → Барьеры → Конкуренты → CTA
 * Стиль: Magic Camp — чёрный фон, Unbounded, красный акцент #FF2D20, лаймовый #B5F23D
 */
import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useLocation } from "wouter";

// ─── Helpers ────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "", style = {} }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className} style={style}>
      {children}
    </motion.div>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(10,10,10,0.95)" : "transparent", backdropFilter: scrolled ? "blur(8px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="7" stroke="#F5F5F0" strokeWidth="1.5" fill="none"/>
            <ellipse cx="14" cy="14" rx="13" ry="5" stroke="#F5F5F0" strokeWidth="1.5" fill="none"/>
            <circle cx="14" cy="14" r="2" fill="#FF2D20"/>
          </svg>
          <span style={{ fontFamily: "Unbounded, sans-serif", fontSize: "1.1rem", fontWeight: 900, letterSpacing: "0.06em", color: "#F5F5F0" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
        </a>
        <a href="#register"
          style={{ background: "#FF2D20", color: "#fff", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", fontWeight: 600, padding: "0.5rem 1.25rem", borderRadius: "6px", textDecoration: "none" }}>
          Начать бесплатно →
        </a>
      </div>
    </nav>
  );
}

// ─── CAC Calculator (Aha-момент) ─────────────────────────────────────────────
function CACCalculator() {
  const [budget, setBudget] = useState("");
  const [clients, setClients] = useState("");
  const [ltv, setLtv] = useState("");
  const [result, setResult] = useState<{ cac: number; ratio: number; verdict: string; color: string } | null>(null);

  const calc = () => {
    const b = parseFloat(budget.replace(/\s/g, ""));
    const c = parseFloat(clients);
    const l = parseFloat(ltv.replace(/\s/g, ""));
    if (!b || !c || !l || c === 0) return;
    const cac = b / c;
    const ratio = l / cac;
    let verdict = "";
    let color = "";
    if (ratio >= 10) { verdict = "🚀 Отлично! Бизнес масштабируется"; color = "#22c55e"; }
    else if (ratio >= 3) { verdict = "✅ Норма. Есть куда расти"; color = "#86efac"; }
    else if (ratio >= 1) { verdict = "⚠️ Опасно. Маркетинг почти не окупается"; color = "#f59e0b"; }
    else { verdict = "🔴 Критично. Вы тратите больше, чем зарабатываете"; color = "#ef4444"; }
    setResult({ cac, ratio, verdict, color });
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "2rem" }}>
      <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#F5F5F0", marginBottom: "0.5rem" }}>
        Посчитайте свой CAC прямо сейчас
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(245,245,240,0.5)", marginBottom: "1.5rem" }}>
        Если CAC {">"} LTV / 3 — ваш маркетинг убыточен. Большинство агентств об этом не знают.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        {[
          { label: "Бюджет на маркетинг, ₽", val: budget, set: setBudget, ph: "50 000" },
          { label: "Новых клиентов за месяц", val: clients, set: setClients, ph: "5" },
          { label: "LTV клиента, ₽", val: ltv, set: setLtv, ph: "150 000" },
        ].map(f => (
          <div key={f.label}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(245,245,240,0.5)", marginBottom: "0.4rem" }}>{f.label}</div>
            <input value={f.val} onChange={e => f.set(e.target.value)}
              placeholder={f.ph}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.6rem 0.8rem", color: "#F5F5F0", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", outline: "none" }} />
          </div>
        ))}
      </div>
      <button onClick={calc}
        style={{ background: "#FF2D20", color: "#fff", border: "none", borderRadius: "8px", padding: "0.75rem 2rem", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
        Рассчитать →
      </button>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: "1.5rem", padding: "1.25rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: `1px solid ${result.color}33` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(245,245,240,0.5)", marginBottom: "0.25rem" }}>CAC</div>
              <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#FF2D20" }}>
                {Math.round(result.cac).toLocaleString("ru")} ₽
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(245,245,240,0.5)", marginBottom: "0.25rem" }}>LTV / CAC</div>
              <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: result.color }}>
                {result.ratio.toFixed(1)}×
              </div>
            </div>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: result.color, fontWeight: 600 }}>
            {result.verdict}
          </div>
          {result.ratio < 3 && (
            <div style={{ marginTop: "0.75rem", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(245,245,240,0.6)" }}>
              Урок 3 курса — «Юнит-экономика» — объясняет как это исправить. Бесплатно. ↓
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError("Введите корректный email"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/course/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("courseToken", data.token);
        setLocation("/learn");
      } else {
        setError(data.message || "Ошибка регистрации");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "0.85rem 1rem", color: "#F5F5F0", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none" }} />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "0.85rem 1rem", color: "#F5F5F0", fontFamily: "Inter, sans-serif", fontSize: "0.95rem", outline: "none" }} />
      {error && <div style={{ color: "#ef4444", fontFamily: "Inter, sans-serif", fontSize: "0.85rem" }}>{error}</div>}
      <button type="submit" disabled={loading}
        style={{ background: loading ? "rgba(255,45,32,0.5)" : "#FF2D20", color: "#fff", border: "none", borderRadius: "10px", padding: "1rem", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", cursor: loading ? "default" : "pointer", transition: "background 0.2s" }}>
        {loading ? "Загрузка..." : "Получить доступ к курсу →"}
      </button>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "rgba(245,245,240,0.35)", textAlign: "center" }}>
        Без спама. Только ссылка на курс и приветствие от Дениса.
      </div>
    </form>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function MarketingPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#F5F5F0" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container">
          <FadeUp>
            <div style={{ display: "inline-block", background: "rgba(181,242,61,0.12)", border: "1px solid rgba(181,242,61,0.3)", borderRadius: "999px", padding: "0.35rem 1rem", fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#B5F23D", marginBottom: "1.5rem" }}>
              Курс от агентства Гипотеза · Для маркетологов агентств
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "1.5rem", maxWidth: "900px" }}>
              Маркетинг агентства —<br />
              <span style={{ color: "#FF2D20" }}>от теории к деньгам</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(245,245,240,0.65)", maxWidth: "600px", lineHeight: 1.6, marginBottom: "2.5rem" }}>
              Курс от команды, которая сама делает вебинарные воронки. Мы не теоретики — мы сапожники с сапогами. И теперь учим этому вас.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <a href="#register"
                style={{ background: "#FF2D20", color: "#fff", padding: "1rem 2rem", borderRadius: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", textDecoration: "none", display: "inline-block" }}>
                Начать бесплатно →
              </a>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(245,245,240,0.45)" }}>
                Первые 3 урока — бесплатно. Без карты.
              </div>
            </div>
          </FadeUp>

          {/* Stats */}
          <FadeUp delay={0.4}>
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "3.5rem", flexWrap: "wrap" }}>
              {[
                { n: "40+", l: "вебинарных воронок" },
                { n: "5 лет", l: "на рынке" },
                { n: "160%", l: "средний ROMI" },
                { n: "10", l: "уроков · 3 бесплатно" },
              ].map(s => (
                <div key={s.n}>
                  <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "1.6rem", fontWeight: 900, color: "#FF2D20" }}>{s.n}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(245,245,240,0.45)", marginTop: "0.2rem" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── AHA-МОМЕНТ: КАЛЬКУЛЯТОР ── */}
      <section style={{ paddingBottom: "80px" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <FadeUp>
            <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#FF2D20", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Aha-момент
            </div>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "0.75rem" }}>
              Знаете свой CAC?
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "rgba(245,245,240,0.6)", marginBottom: "2rem", lineHeight: 1.6 }}>
              Большинство маркетологов агентств не знают свой CAC. Они знают CAC клиентов — но не свой. Посчитайте прямо сейчас.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <CACCalculator />
          </FadeUp>
        </div>
      </section>

      {/* ── САПОЖНИКИ С САПОГАМИ ── */}
      <section style={{ paddingBottom: "80px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "80px" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#B5F23D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  Мы сами делаем то, чему учим
                </div>
                <h2 style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "1.25rem", lineHeight: 1.2 }}>
                  Сапожники<br /><span style={{ color: "#FF2D20" }}>с сапогами</span>
                </h2>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(245,245,240,0.65)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  Гипотеза — агентство вебинарных воронок. 5 лет, 40+ запусков, клиенты от EdTech до крупных брендов.
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(245,245,240,0.65)", lineHeight: 1.7 }}>
                  Мы не теоретики. Мы каждый день делаем то, о чём рассказываем в курсе: придумываем воронки, считаем юнит-экономику, пишем лендинги, квалифицируем лиды.
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "#F5F5F0", lineHeight: 1.7, marginTop: "1rem", fontStyle: "italic" }}>
                  Этот курс — не «как надо». Это «как делаем мы».
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  {
                    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/denis_68167dc3.jpg",
                    name: "Денис",
                    role: "Фаундер · 5 лет в вебинарных запусках",
                  },
                  {
                    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/alexey_68167dc3.jpg",
                    name: "Алексей",
                    role: "Трафик и аналитика · 40+ воронок",
                  },
                ].map(m => (
                  <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem" }}>
                    <img src={m.photo} alt={m.name}
                      style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div>
                      <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#F5F5F0" }}>{m.name}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(245,245,240,0.5)", marginTop: "0.2rem" }}>{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── УЗНАЁШЬ СЕБЯ? ── */}
      <section style={{ paddingBottom: "80px", paddingTop: "80px", background: "rgba(255,45,32,0.04)", borderTop: "1px solid rgba(255,45,32,0.1)", borderBottom: "1px solid rgba(255,45,32,0.1)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", marginBottom: "2rem", lineHeight: 1.2 }}>
              Узнаёшь себя?
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {[
              { emoji: "😤", text: "Ты запускаешь рекламу, тратишь бюджет — а новых клиентов нет. Или есть, но дорогие." },
              { emoji: "😳", text: "Ты умеешь делать маркетинг для клиентов, но свой агентский маркетинг — полный хаос." },
              { emoji: "🤷", text: "Не знаешь свой CAC, LTV, ROMI. Маркетинг на ощущениях, а не на цифрах." },
              { emoji: "😶", text: "Клиент спрашивает «а как вы сами продвигаетесь?» — уводишь тему." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{item.emoji}</div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(245,245,240,0.7)", lineHeight: 1.6 }}>{item.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЦЕННОСТЬ ── */}
      <section style={{ paddingBottom: "80px", paddingTop: "80px" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <FadeUp>
            <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#FF2D20", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Что вы получите
            </div>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "2.5rem" }}>
              10 уроков. Каждый — практика.
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {[
              { num: "01", title: "Маркетинг: что это на самом деле", desc: "Котлер, Огилви, Бернбах — что они поняли раньше всех. После этого урока смотришь на маркетинг иначе. Навсегда.", tag: "Бесплатно", xp: "+100 XP" },
              { num: "02", title: "Контент и копирайтинг", desc: "Почему «продающий текст» — оксюморон. Как писать так, чтобы люди читали, а не закрывали.", tag: "Бесплатно", xp: "+120 XP" },
              { num: "03", title: "Юнит-экономика: CAC, LTV, ROMI", desc: "С калькулятором. После урока знаешь свои цифры — не примерно, а точно.", tag: "Бесплатно", xp: "+150 XP" },
              { num: "04", title: "Как стоить дорого", desc: "Психология клиента, позиционирование, ценообразование. Почему одни берут 300к, другие — 30к за ту же работу.", tag: "Платно", xp: "+150 XP" },
              { num: "05", title: "Продающий лендинг с нуля", desc: "Структура, смыслы, CTA. Анатомия страницы с конверсией 8%+. С конструктором первого экрана.", tag: "Платно", xp: "+200 XP" },
              { num: "07", title: "Вебинарная воронка от А до Я", desc: "Та самая схема Гипотезы. От холодного трафика до оплаты за 7 дней. Впервые — открыто.", tag: "Платно", xp: "+250 XP" },
            ].map((l, i) => (
              <FadeUp key={l.num} delay={i * 0.06}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.25rem", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <span style={{ fontFamily: "Unbounded, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "rgba(255,255,255,0.12)" }}>{l.num}</span>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <span style={{ background: l.tag === "Бесплатно" ? "rgba(181,242,61,0.15)" : "rgba(255,45,32,0.12)", color: l.tag === "Бесплатно" ? "#B5F23D" : "#FF2D20", borderRadius: "999px", padding: "0.2rem 0.6rem", fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 600 }}>{l.tag}</span>
                      <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(245,245,240,0.5)", borderRadius: "999px", padding: "0.2rem 0.6rem", fontFamily: "Inter, sans-serif", fontSize: "0.72rem" }}>{l.xp}</span>
                    </div>
                  </div>
                  <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#F5F5F0", marginBottom: "0.5rem", lineHeight: 1.3 }}>{l.title}</div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(245,245,240,0.55)", lineHeight: 1.6 }}>{l.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ТОЧКА Б ── */}
      <section style={{ paddingBottom: "80px", paddingTop: "80px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <FadeUp>
            <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#B5F23D", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Точка Б
            </div>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "2rem", lineHeight: 1.2 }}>
              После курса вы:
            </h2>
          </FadeUp>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { emoji: "🧘", title: "Знаете откуда придут следующие 5 клиентов", desc: "Не надеетесь — знаете. Есть система: воронка, квалификация, дожим, повторные продажи." },
              { emoji: "📊", title: "Говорите на языке цифр", desc: "CAC, LTV, ROMI — не аббревиатуры, а инструменты. Вы знаете свои цифры и умеете их улучшать." },
              { emoji: "💪", title: "Применяете к себе то, что продаёте клиентам", desc: "Сапожники с сапогами. Ваш маркетинг работает так же, как маркетинг ваших лучших клиентов." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div style={{ display: "flex", gap: "1.25rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.25rem", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "2rem", flexShrink: 0 }}>{item.emoji}</div>
                  <div>
                    <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#F5F5F0", marginBottom: "0.4rem" }}>{item.title}</div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(245,245,240,0.6)", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── БАРЬЕРЫ ── */}
      <section style={{ paddingBottom: "80px", paddingTop: "80px" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "2rem" }}>
              «Но у меня есть возражение...»
            </h2>
          </FadeUp>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { q: "«Я и так всё это знаю»", a: "Возможно. Но знать и делать — разные вещи. Урок 3 бесплатный — пройди и проверь, знаешь ли ты свой CAC." },
              { q: "«Нет времени»", a: "Уроки по 15–30 минут. Без воды. Мы сами не любим длинные курсы — поэтому сделали короткие." },
              { q: "«5000₽ — дорого»", a: "Один новый клиент агентства стоит 30–150к. Если курс помогает привлечь хотя бы одного — он окупился в 6–30 раз." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.25rem" }}>
                  <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#FF2D20", marginBottom: "0.6rem" }}>{item.q}</div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(245,245,240,0.7)", lineHeight: 1.6 }}>{item.a}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── КОНКУРЕНТЫ ── */}
      <section style={{ paddingBottom: "80px", paddingTop: "80px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "2rem" }}>
              Почему не другие варианты?
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            {[
              { vs: "YouTube / статьи", why: "Информация без системы. Разница между «читал рецепт» и «готовил 5 лет»." },
              { vs: "Skillbox / Нетология", why: "3–6 месяцев, 50–150к, общая программа. Мы — 10 уроков, 5000₽, только про агентский маркетинг." },
              { vs: "Нанять маркетолога", why: "Хороший стоит 80–150к/мес. Сначала пойми систему сам — будешь знать кого искать." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.25rem" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(245,245,240,0.4)", marginBottom: "0.5rem" }}>Вместо</div>
                  <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "rgba(245,245,240,0.7)", marginBottom: "0.75rem", textDecoration: "line-through" }}>{item.vs}</div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(245,245,240,0.6)", lineHeight: 1.6 }}>{item.why}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTER CTA ── */}
      <section id="register" style={{ paddingBottom: "100px", paddingTop: "80px" }}>
        <div className="container" style={{ maxWidth: "520px" }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ display: "inline-block", background: "rgba(181,242,61,0.12)", border: "1px solid rgba(181,242,61,0.3)", borderRadius: "999px", padding: "0.35rem 1rem", fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#B5F23D", marginBottom: "1rem" }}>
                Первые 3 урока — бесплатно
              </div>
              <h2 style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
                Начни прямо сейчас
              </h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(245,245,240,0.55)", lineHeight: 1.6 }}>
                Введи email — получи доступ к курсу. Урок 3 с калькулятором юнит-экономики — бесплатно.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "2rem" }}>
              <RegisterForm />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "Unbounded, sans-serif", fontSize: "0.9rem", fontWeight: 900, color: "#F5F5F0" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(245,245,240,0.35)" }}>
            © 2025 Гипотеза. Агентство вебинарных воронок.
          </span>
        </div>
      </footer>
    </div>
  );
}
