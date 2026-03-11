/**
 * ГИПОТЕЗА AGENCY — Landing Page
 * Design: Magic Camp style — black bg, huge serif/display type, stickers, pill tags
 * Font: Unbounded (display) + Inter (body)
 * Colors: #111 black · #F5F5F0 white · #FF2D20 red accent · #B5F23D lime sticker
 * Structure: AJTBD — Hero → Clients → "Узнаёшь себя?" → Услуги → Вебинары → Почему мы → Точка Б → Барьеры → Конкуренты → Команда → CTA
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Helpers ────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const links = [
    { label: "Услуги", id: "services" },
    { label: "Кейсы", id: "cases" },
    { label: "Команда", id: "team" },
    { label: "Контакт", id: "contact" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(10,10,10,0.95)" : "transparent", backdropFilter: scrolled ? "blur(8px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none" }}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => go("hero")} className="flex items-center gap-2">
          {/* Planet icon */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="7" stroke="#F5F5F0" strokeWidth="1.5" fill="none"/>
            <ellipse cx="14" cy="14" rx="13" ry="5" stroke="#F5F5F0" strokeWidth="1.5" fill="none"/>
            <circle cx="14" cy="14" r="2" fill="#FF2D20"/>
          </svg>
          <span className="font-display" style={{ fontSize: "1.15rem", fontWeight: 900, letterSpacing: "0.06em", color: "#F5F5F0" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)}
              style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", fontWeight: 400 }}
              className="hover:text-white transition-colors duration-200">
              {l.label}
            </button>
          ))}
          <button onClick={() => go("contact")}
            className="pill"
            style={{ borderColor: "rgba(255,255,255,0.3)", color: "#F5F5F0", fontSize: "0.8rem" }}>
            Оставить заявку
          </button>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)}>
          <span style={{ width: 22, height: 1.5, background: "#F5F5F0", display: "block", transition: "transform 0.2s", transform: open ? "rotate(45deg) translate(2px, 5px)" : "none" }} />
          <span style={{ width: 22, height: 1.5, background: "#F5F5F0", display: "block", opacity: open ? 0 : 1, transition: "opacity 0.2s" }} />
          <span style={{ width: 22, height: 1.5, background: "#F5F5F0", display: "block", transition: "transform 0.2s", transform: open ? "rotate(-45deg) translate(2px, -5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}
            className="md:hidden px-6 py-6 flex flex-col gap-5">
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)}
                style={{ fontFamily: "Inter", fontSize: "1.1rem", color: "#F5F5F0", textAlign: "left" }}>
                {l.label}
              </button>
            ))}
            <button onClick={() => go("contact")}
              style={{ fontFamily: "Inter", fontSize: "1rem", color: "#FF2D20", textAlign: "left", fontWeight: 600 }}>
              Оставить заявку →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: "7rem", paddingBottom: "4rem" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>

          {/* Main layout: big title left, description right */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="lg:grid-cols-[1fr_280px]">

            {/* Big title */}
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <div className="font-display" style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)", lineHeight: 0.92, fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em" }}>
                <div>ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА —</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3em", flexWrap: "wrap" }}>
                  <span style={{ display: "inline-block", background: "#FF2D20", borderRadius: "999px", padding: "0.05em 0.4em", fontSize: "0.85em", transform: "rotate(-2deg)", position: "relative", top: "-0.05em" }}>
                    <span style={{ fontSize: "0.55em", fontFamily: "Inter", fontWeight: 700, letterSpacing: "0.05em" }}>это</span>
                  </span>
                  вебинары,
                </div>
                <div>которые</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.2em", flexWrap: "wrap" }}>
                  продают
                  <span style={{
                    display: "inline-block",
                    background: "#B5F23D",
                    clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                    width: "1.2em", height: "1.2em",
                    fontSize: "0.45em",
                    transform: "rotate(20deg)",
                    position: "relative",
                    top: "-0.3em"
                  }} />
                </div>
              </div>
            </motion.div>

            {/* Right column: description + pills */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "1.5rem", paddingBottom: "0.5rem" }}>
              <p style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontWeight: 300 }}>
                Делаем вебинарные воронки под ключ для EdTech и крупных брендов. Окупаем холодный трафик.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Онлайн-колледж №1", "Primekraft", "SkillFactory", "Skyeng", "Skillbox"].map(c => (
                  <span key={c} className="pill" style={{ display: "block", width: "fit-content" }}>{c}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            style={{ display: "flex", gap: "3rem", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem" }}>
            {[
              { n: "5 лет", l: "только вебинары" },
              { n: "40+", l: "запущенных воронок" },
              { n: "160%", l: "ROMI на холодном трафике" },
            ].map(s => (
              <div key={s.n}>
                <div className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#F5F5F0" }}>{s.n}</div>
                <div style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: "0.2rem" }}>{s.l}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="font-display"
              style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "0.85rem 2rem", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              ХОЧУ ТАКУЮ ВОРОНКУ →
            </button>
            <button
              onClick={() => document.getElementById("cases")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)", padding: "0.85rem 2rem", fontSize: "0.85rem", fontFamily: "Inter", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
              Смотреть кейсы
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────

function Marquee() {
  const items = ["Логомашина", "Онлайн-колледж №1", "Primekraft", "SkillFactory", "Skillbox", "Школа вокала Этери Бериашвили", "Онлайн-школа №1"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", padding: "1rem 0" }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "2rem", paddingRight: "2rem" }}>
            <span style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>{item}</span>
            <span style={{ color: "#FF2D20", fontSize: "0.5rem" }}>●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── "Узнаёшь себя?" ─────────────────────────────────────────────────────────

function RecognizeYourself() {
  return (
    <section style={{ background: "#0A0A0A", padding: "8rem 0" }}>
      <div className="container">
        <FadeUp>
          <div style={{ maxWidth: "900px" }}>
            <p style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "3rem" }}>
              — Стоп. Это про тебя?
            </p>

            <div className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1.05, fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em" }}>
              <div>Вебинары запускаешь.</div>
              <div style={{ color: "rgba(255,255,255,0.35)" }}>ROMI не сходится.</div>
            </div>

            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                "Деньги в трафик льёшь — холодная аудитория не доходит.",
                "Менял спикера, переписывал оффер, крутил аудитории.",
                "Каждый запуск начинается с вопроса: «Ну может на этот раз?»",
              ].map((line, i) => (
                <p key={i} style={{ fontFamily: "Inter", fontSize: "1.05rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, fontWeight: 300 }}>
                  {line}
                </p>
              ))}
            </div>

            <div style={{ margin: "3.5rem 0", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "3.5rem" }}>
              <div className="font-display" style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)", lineHeight: 1.1, fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em" }}>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>Или</span> видишь, что у конкурентов
                <br />вебинары работают.
                <br /><span style={{ color: "rgba(255,255,255,0.35)" }}>А внутри — никого, кто умеет.</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              <div className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", fontWeight: 900, color: "#FF2D20", letterSpacing: "-0.02em" }}>
                Мы знаем, где сломано.
              </div>
              <span style={{
                display: "inline-block",
                background: "#B5F23D",
                clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                width: "3rem", height: "3rem",
                flexShrink: 0
              }} />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────

function Services() {
  const items = [
    { n: "01", title: "Юнит-экономика до старта", desc: "Считаем окупаемость до первого рубля в трафик. Скучно, но именно это отделяет прибыльный запуск от «ну мы попробовали»." },
    { n: "02", title: "Сценарий и смыслы", desc: "Контент, который не бесит холодную аудиторию и ведёт к покупке без ощущения, что тебя разводят." },
    { n: "03", title: "Подбор и подготовка спикера", desc: "Хороший продукт + деревянный спикер = деньги на ветер. Найдём или подготовим." },
    { n: "04", title: "Презентация", desc: "Та, которую не стыдно показать. Не набор буллетов на синем фоне." },
    { n: "05", title: "Продакшн", desc: "Студийная картинка, свет, звук, стриминг. Без «технических неполадок» в прямом эфире." },
    { n: "06", title: "Боты и автоворонка", desc: "Telegram-боты, email-рассылки, дожимы. Поднимаем доходимость на 20–30%." },
    { n: "07", title: "Аналитика и ROMI", desc: "Ежедневные отчёты. Знаем, где воронка течёт, и чиним до следующего запуска." },
  ];

  return (
    <section id="services" style={{ background: "#0A0A0A", padding: "8rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container">
        <FadeUp>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em", lineHeight: 0.95 }}>
              ПОД<br />КЛЮЧ.
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", maxWidth: "280px", lineHeight: 1.6 }}>
              Всё, что нужно для вебинара, который продаёт — от стратегии до аналитики.
            </p>
          </div>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0" }}>
          {items.map((item, i) => (
            <FadeUp key={item.n} delay={i * 0.05}>
              <div
                style={{ display: "grid", gridTemplateColumns: "3rem 1fr 1fr", gap: "2rem", padding: "1.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "start" }}
                className="hover:bg-white/[0.02] transition-colors duration-200 px-2 -mx-2 rounded"
              >
                <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", paddingTop: "0.2rem" }}>{item.n}</span>
                <span className="font-display" style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F5F0", letterSpacing: "0.02em" }}>{item.title}</span>
                <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{item.desc}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Cases / Webinars ─────────────────────────────────────────────────────────

function Cases() {
  const [_active, _setActive] = useState<string | null>(null);

  const cases = [
    {
      id: "school1",
      client: "Онлайн-школа №1",
      tag: "EdTech",
      result: "ROMI +70%",
      desc: "Продающий вебинар на холодную аудиторию. Пересобрали воронку, переписали сценарий, подключили автоворонку.",
      videoUrl: null, // добавьте ссылку
    },
    {
      id: "college1",
      client: "Онлайн-колледж №1",
      tag: "EdTech",
      result: "×3 доходимость",
      desc: "Запустили серию вебинаров с нуля. Боты, рассылки, студийный продакшн.",
      videoUrl: null,
    },
    {
      id: "primekraft",
      client: "Primekraft",
      tag: "D2C / FMCG",
      result: "×4 выручка",
      desc: "Первый вебинарный канал продаж для спортивного питания. Считали юнит-экономику до старта.",
      videoUrl: null,
    },
    {
      id: "skillfactory",
      client: "SkillFactory",
      tag: "EdTech",
      result: "ROMI 160%",
      desc: "Запуск нового курса на холодный трафик. Сценарий + продакшн + аналитика.",
      videoUrl: null,
    },
  ];

  return (
    <section id="cases" style={{ background: "#0A0A0A", padding: "8rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container">
        <FadeUp>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em", lineHeight: 0.95 }}>
              НЕ ВЕРЬТЕ<br />НА СЛОВО.
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", maxWidth: "280px", lineHeight: 1.6 }}>
              Реальные кейсы с цифрами. Скоро добавим видео — смотрите прямо здесь.
            </p>
          </div>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
          {cases.map((c, i) => (
            <FadeUp key={c.id} delay={i * 0.08}>
              <div
                style={{ background: "#0A0A0A", padding: "2.5rem 2rem", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#111")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0A0A0A")}
                onClick={() => _setActive(_active === c.id ? null : c.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                  <span className="pill">{c.tag}</span>
                  <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>0{i + 1}</span>
                </div>
                <div className="font-display" style={{ fontSize: "1.4rem", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.1, marginBottom: "0.75rem" }}>
                  {c.client}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  {c.desc}
                </div>
                <div className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#FF2D20" }}>
                  {c.result}
                </div>
                {c.videoUrl && (
                  <a href={c.videoUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
                    onClick={e => e.stopPropagation()}>
                    ▶ Смотреть вебинар
                  </a>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────

function WhyUs() {
  return (
    <section style={{ background: "#0A0A0A", padding: "8rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4rem" }} className="lg:grid-cols-2">
          <FadeUp>
            <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em", lineHeight: 0.95 }}>
              5 ЛЕТ.<br />ТОЛЬКО<br />ВЕБИНАРЫ.
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              <p style={{ fontFamily: "Inter", fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                Не контекст, не SMM, не «комплексный маркетинг» — только вебинарные воронки. Работали внутри Skillbox, SkillFactory, Skyeng. Знаем, как устроен маркетинг в крупных EdTech изнутри.
              </p>
              {[
                { title: "Считаем юнит-экономику до старта", desc: "Вы знаете результат до того, как вложили деньги в трафик." },
                { title: "Полный цикл без субподрядчиков", desc: "Стратегия, продакшн, боты, аналитика — одна команда." },
                { title: "Насмотренность из 40+ запусков", desc: "Ваш бюджет не тратится на наши эксперименты." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "1.5rem" }}>
                  <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "#FF2D20", paddingTop: "0.25rem", flexShrink: 0 }}>0{i + 1}</span>
                  <div>
                    <div className="font-display" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#F5F5F0", marginBottom: "0.3rem" }}>{item.title}</div>
                    <div style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Point B ──────────────────────────────────────────────────────────────────

function PointB() {
  return (
    <section style={{ background: "#111", padding: "8rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container">
        <FadeUp>
          <p style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "3rem" }}>
            — Через 2 месяца работы
          </p>
          <div className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1.05, fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em", maxWidth: "800px" }}>
            Ты знаешь, сколько принесёт следующий вебинар{" "}
            <span style={{ color: "#FF2D20" }}>ещё до запуска.</span>
          </div>
          <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: "700px" }} className="sm:grid-cols-2">
            {[
              { label: "Для EdTech", text: "Воронка, которая окупает холодный трафик стабильно, а не «иногда»." },
              { label: "Для брендов", text: "Собственный D2C-канал через вебинары без зависимости от маркетплейсов." },
            ].map(item => (
              <div key={item.label} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
                <div style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "#FF2D20", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{item.label}</div>
                <div style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Barriers ────────────────────────────────────────────────────────────────

function Barriers() {
  const items = [
    { q: "«У нас есть маркетолог»", a: "Мы его не замещаем — берём на себя весь продакшн, пока он занимается трафиком." },
    { q: "«Проще нанять в штат»", a: "Найм + онбординг = полгода. Мы запускаем за 2–3 недели. И стоим дешевле одного хорошего специалиста." },
    { q: "«Мы уже пробовали — не сработало»", a: "Покажите предыдущий запуск. В 90% случаев видим конкретную точку, где сломано." },
    { q: "«Непонятно, сколько стоит»", a: "Начинаем с бесплатного аудита. После — конкретное предложение с цифрами." },
  ];

  return (
    <section style={{ background: "#0A0A0A", padding: "8rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container">
        <FadeUp>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em", marginBottom: "4rem", lineHeight: 0.95 }}>
            МЫ УГАДАЕМ,<br />ЧТО ВЫ ДУМАЕТЕ.
          </h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0" }}>
          {items.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", padding: "2rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "start" }}
                className="sm:grid-cols-2">
                <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", lineHeight: 1.3 }}>{item.q}</div>
                <div style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{item.a}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Competitors ──────────────────────────────────────────────────────────────

function Competitors() {
  const items = [
    { who: "Фрилансер", why: "Закроет одну задачу. Собирать систему из фрилансеров — ваша операционка и ваши нервы." },
    { who: "Агентство полного цикла", why: "Делают всё — значит ничего по-настоящему хорошо. Вебинары для них — один из двадцати инструментов." },
    { who: "Штатный сотрудник", why: "Один человек не закроет весь цикл. Мы — готовая команда из 4 ролей с насмотренностью из 40+ запусков." },
  ];

  return (
    <section style={{ background: "#0A0A0A", padding: "8rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container">
        <FadeUp>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em", marginBottom: "4rem", lineHeight: 0.95 }}>
            ПОЧЕМУ<br />НЕ ОНИ.
          </h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
          {items.map((item, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div style={{ background: "#0A0A0A", padding: "2.5rem 2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <span style={{ width: "1.5rem", height: "1.5rem", borderRadius: "50%", border: "1px solid rgba(255,45,32,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#FF2D20", fontSize: "0.7rem" }}>✕</span>
                  </span>
                  <span className="font-display" style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F5F0" }}>{item.who}</span>
                </div>
                <p style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.why}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────

function Team() {
  const members = [
    {
      id: "ДЗ-001",
      codename: "СТРАТЕГ",
      name: "Денис Зюлин",
      role: "Основатель",
      photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/denis_30d9c6b7.jpg",
      accent: "#FF2D20",
      rows: [
        { k: "Опыт", v: "5 лет — только вебинары" },
        { k: "Запусков", v: "40+" },
        { k: "Суперсила", v: "Видит воронку насквозь" },
      ],
    },
    {
      id: "АЗ-002",
      codename: "ПРОДЮСЕР",
      name: "Алла Захарова",
      role: "Партнёр, контент",
      photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/alla_c7f64f85.jpg",
      accent: "#B5F23D",
      rows: [
        { k: "Опыт", v: "Skyeng, Skillbox" },
        { k: "Специализация", v: "Сценарии и смыслы" },
        { k: "Суперсила", v: "Знает голову покупателя" },
      ],
    },
    {
      id: "АП-003",
      codename: "ТРАФИК",
      name: "Алексей Пономарёв",
      role: "Партнёр, автоматизация",
      photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/alexey_68167dc3.jpg",
      accent: "#FF2D20",
      rows: [
        { k: "Специализация", v: "Холодный трафик" },
        { k: "Инструменты", v: "Боты, автоворонки" },
        { k: "Суперсила", v: "Маркетинг без угадайки" },
      ],
    },
  ];

  return (
    <section
      id="team"
      style={{
        background: "#0A0A0A",
        padding: "8rem 0 6rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container">

        {/* ── Заголовок секции ── */}
        <FadeUp>
          <div style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                КОМАНДА
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.15)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                3 ЧЕЛОВЕКА
              </span>
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                fontWeight: 900,
                color: "#F5F5F0",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              Лига вебинарных<br />
              <span style={{ color: "#FF2D20" }}>воронок.</span>
            </h2>
          </div>
        </FadeUp>

        {/* ── Карточки ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
            background: "rgba(255,255,255,0.05)",
          }}
          className="team-grid"
        >
          {members.map((m, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div
                style={{
                  background: "#0A0A0A",
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  transition: "background 0.25s",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "#111";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "#0A0A0A";
                }}
              >
                {/* Фото */}
                <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4" }}>
                  <img
                    src={m.photo}
                    alt={m.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                  />
                  {/* ID badge — верхний левый */}
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      background: "#0A0A0A",
                      padding: "0.25rem 0.6rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <div style={{ width: "6px", height: "6px", background: m.accent, borderRadius: "50%" }} />
                    <span
                      style={{
                        fontFamily: "Inter, monospace",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {m.id}
                    </span>
                  </div>
                  {/* Кодовое имя — нижний правый */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      right: "1rem",
                      background: m.accent,
                      padding: "0.3rem 0.7rem",
                    }}
                  >
                    <span
                      className="font-display"
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 900,
                        color: m.accent === "#B5F23D" ? "#0A0A0A" : "#fff",
                        letterSpacing: "0.2em",
                      }}
                    >
                      {m.codename}
                    </span>
                  </div>
                </div>

                {/* Имя и роль */}
                <div
                  style={{
                    padding: "1.5rem 1.5rem 0",
                    borderTop: `2px solid ${m.accent}`,
                  }}
                >
                  <div
                    className="font-display"
                    style={{
                      fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
                      fontWeight: 900,
                      color: "#F5F5F0",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                      marginBottom: "0.4rem",
                    }}
                  >
                    {m.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {m.role}
                  </div>
                </div>

                {/* Досье — строки */}
                <div
                  style={{
                    padding: "0 1.5rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                    flex: 1,
                  }}
                >
                  {m.rows.map((row, ri) => (
                    <div
                      key={ri}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.5rem",
                        padding: "0.7rem 0",
                        borderBottom: ri < m.rows.length - 1
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "none",
                        alignItems: "baseline",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.6rem",
                          color: "rgba(255,255,255,0.25)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        {row.k}
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.78rem",
                          color: "#F5F5F0",
                          fontWeight: 500,
                          lineHeight: 1.3,
                        }}
                      >
                        {row.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* ── Дмитрий + ghost ── */}
        <FadeUp delay={0.3}>
          <div
            style={{
              marginTop: "2px",
              background: "rgba(255,255,255,0.02)",
              padding: "2rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  width: "4rem",
                  height: "4rem",
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="font-display"
                  style={{ fontSize: "1.4rem", fontWeight: 900, color: "rgba(255,255,255,0.15)" }}
                >
                  Д
                </span>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <div style={{ width: "0.75rem", height: "1px", background: "rgba(255,255,255,0.2)" }} />
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.2)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    ДЛ-004 · ОПЕРАЦИОНКА
                  </span>
                </div>
                <div
                  className="font-display"
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Дмитрий Лебедев
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.18)",
                    marginTop: "0.2rem",
                  }}
                >
                  Держит проекты в порядке, когда всё идёт не по плану.
                </div>
              </div>
            </div>

            <div
              className="font-display"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
                fontWeight: 900,
                fontStyle: "italic",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                textAlign: "right",
              }}
            >
              ...и другие<br />классные ребята
            </div>
          </div>
        </FadeUp>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .team-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Contact / CTA ────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", company: "", telegram: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" style={{ background: "#111", padding: "8rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4rem" }} className="lg:grid-cols-2">
          <FadeUp>
            <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em", lineHeight: 0.95 }}>
              БЕСПЛАТНЫЙ<br />АУДИТ<br />ВОРОНКИ.
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginTop: "2rem", maxWidth: "380px" }}>
              За 48 часов покажем 3 точки, где теряются деньги. Конкретно, без «ну это зависит от задач».
            </p>
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Разбор текущей воронки", "3 точки потери денег", "Рекомендации по исправлению", "Оценка потенциального ROMI"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#FF2D20", fontSize: "0.7rem" }}>●</span>
                  <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: "1rem" }}>
                <div className="font-display" style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FF2D20" }}>Отлично!</div>
                <p style={{ fontFamily: "Inter", fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  Мы получили вашу заявку и ответим в течение 2 часов.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { key: "name", label: "Имя", placeholder: "Как вас зовут?" },
                  { key: "company", label: "Компания / проект", placeholder: "Название проекта" },
                  { key: "telegram", label: "Telegram или телефон", placeholder: "@username или +7..." },
                ].map(field => (
                  <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      required
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                        color: "#F5F5F0",
                        fontFamily: "Inter",
                        fontSize: "1rem",
                        padding: "0.75rem 0",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="font-display"
                  style={{ marginTop: "1rem", background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 2rem", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", transition: "opacity 0.2s", alignSelf: "flex-start" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  ПОЛУЧИТЬ АУДИТ →
                </button>
                <p style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: "0.5rem" }}>
                  Отвечаем в течение 2 часов · Разобрали 40+ воронок
                </p>
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "3rem 0" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <span className="font-display" style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.06em", color: "#F5F5F0" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
          <span style={{ fontFamily: "Inter", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", marginLeft: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>AGENCY</span>
          <p style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: "0.4rem" }}>
            Агентство вебинарного продакшна
          </p>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <a href="https://t.me/" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F0")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
            Telegram
          </a>
          <a href="mailto:hello@gipoteza-agency.ru"
            style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F0")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
            Email
          </a>
        </div>
        <p style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)" }}>
          © 2025 Гипотеза Agency
        </p>
      </div>
    </footer>
  );
}

// ─── Visual Object Sections (MSCHF style) ───────────────────────────────────

type VisualBlockProps = {
  src: string;
  side?: "left" | "right" | "center";
  label?: string;
  headline: React.ReactNode;
  sub?: string;
  border?: boolean;
};

function VisualBlock({ src, side = "right", label, headline, sub, border = true }: VisualBlockProps) {
  const isCenter = side === "center";
  const isLeft = side === "left";
  return (
    <section style={{ background: "#0A0A0A", overflow: "hidden", position: "relative", minHeight: "75vh", display: "flex", alignItems: "center", borderTop: border ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
      {isCenter ? (
        <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.55 }} />
      ) : (
        <img src={src} alt="" style={{ position: "absolute", [isLeft ? "left" : "right"]: "-2%", top: "50%", transform: "translateY(-50%)", width: "52%", height: "115%", objectFit: "cover", objectPosition: "center" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: isCenter ? "rgba(10,10,10,0.55)" : isLeft ? "linear-gradient(to left, #0A0A0A 42%, transparent 80%)" : "linear-gradient(to right, #0A0A0A 42%, transparent 80%)" }} />
      <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "6rem", paddingBottom: "6rem", display: "flex", justifyContent: isLeft ? "flex-end" : "flex-start" }}>
        <FadeUp>
          <div style={{ maxWidth: "520px" }}>
            {label && <p style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>— {label}</p>}
            <div className="font-display" style={{ fontSize: "clamp(2.2rem, 5.5vw, 5rem)", fontWeight: 900, color: "#F5F5F0", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
              {headline}
            </div>
            {sub && <p style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", marginTop: "1.5rem", lineHeight: 1.6, maxWidth: "340px" }}>{sub}</p>}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function VisualBrainBag() {
  return <VisualBlock
    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/art-brain-bag_bf42f06f.png"
    side="right"
    label="Стратегия"
    headline={<>СТРАТЕГИЯ<br /><span style={{ color: "#FF2D20" }}>ВЕБИНАРА.</span></>}
    sub="Разбираем бизнес, аудиторию, оффер. Строим воронку, которая не сливает бюджет."
  />;
}

function VisualCupLeads() {
  return <VisualBlock
    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/art-cup-leads_8965a777.png"
    side="left"
    label="Трафик"
    headline={<>НАЛИВАЕМ<br /><span style={{ color: "#FF2D20" }}>ЛИДЫ.</span></>}
    sub="Холодный трафик, который окупается. Ads → вебинар → продажа."
  />;
}

function VisualMousetrap() {
  return <VisualBlock
    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/art-mousetrap_e326f999.png"
    side="right"
    label="Конверсия"
    headline={<>ЛОВУШКА<br /><span style={{ color: "#FF2D20" }}>ДЛЯ ЛИДОВ.</span></>}
    sub="Сценарий, который ведёт к покупке. Без ощущения, что тебя разводят."
  />;
}

function VisualLabyrinth() {
  return <VisualBlock
    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/art-labyrinth_1761c7bc.png"
    side="center"
    label="Путь клиента"
    headline={<>КАК ЛИД<br />ДОХОДИТ<br /><span style={{ color: "#FF2D20" }}>ДО ПОКУПКИ.</span></>}
    sub="Боты, дожимы, автоворонка. Поднимаем доходимость на 20–30%."
  />;
}

function VisualMagnet() {
  return <VisualBlock
    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/art-magnet_d47c6fe4.png"
    side="right"
    label="Онлайн-школа №1"
    headline={<>+70%<br /><span style={{ color: "#FF2D20" }}>ROMI.</span><br /><span style={{ fontSize: "0.45em", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>НА ХОЛОДНОМ ТРАФИКЕ</span></>}
    sub="Пересобрали воронку, переписали сценарий, подключили автоворонку."
  />;
}

function VisualReceipt() {
  return <VisualBlock
    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/art-receipt_e3b8e90c.png"
    side="left"
    label="Primekraft"
    headline={<>×4<br /><span style={{ color: "#FF2D20" }}>ВЫРУЧКА.</span></>}
    sub="Первый вебинарный канал продаж для спортивного питания. D2C без маркетплейсов."
  />;
}

function VisualBoxLeads() {
  return <VisualBlock
    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/art-box-leads_c63b6931.png"
    side="right"
    label="Результат"
    headline={<>ЛИДЫ<br />НЕ<br /><span style={{ color: "#FF2D20" }}>КОНЧАЮТСЯ.</span></>}
    sub="40+ запущенных воронок. Знаем, где теряются деньги — и чиним до следующего запуска."
  />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <Marquee />
      <VisualBrainBag />
      <RecognizeYourself />
      <VisualCupLeads />
      <Services />
      <VisualMousetrap />
      <Cases />
      <VisualMagnet />
      <VisualReceipt />
      <WhyUs />
      <VisualLabyrinth />
      <PointB />
      <Barriers />
      <VisualBoxLeads />
      <Competitors />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}
