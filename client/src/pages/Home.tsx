/**
 * DESIGN PHILOSOPHY: Editorial Brutalism / ONY-style
 * Ref: ONY.ru, Charmer Studio, CreativePeople, Magma
 * Colors: #0A0A0A black + #F5F5F0 off-white + #FF2D20 red accent
 * Typography: Oswald (display, uppercase, tight) + Space Grotesk (body)
 * Layout: Asymmetric, full-bleed, editorial grid, NO rounded corners, NO gradients
 * Structure: AJTBD — Oneliner → Core Job → Micro Jobs → Aha-момент → Ценности
 *            → Узнаёт себя → Как мы делаем → Точка Б → Барьеры → Конкуренты → CTA
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// Asset URLs
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/hero-webinar-dark-eYBV49eTLsbtDe6pWjuCgU.webp";
const SCREEN_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/webinar-screen-glow-fGgcddaiWNH3J9bmXDFifb.webp";
const TEAM_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/team-dark-editorial-VvF3qT2ToSCVv42ryELZPm.webp";
const GRID_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/results-abstract-YDYZrzWWFfLuZoPRSM9Ndq.webp";

// ─── Helpers ───────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (1600 / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Navigation ────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  const links = [
    { label: "Услуги", id: "services" },
    { label: "Кейсы", id: "cases" },
    { label: "Команда", id: "team" },
    { label: "Контакт", id: "contact" },
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A0A0A]/96 backdrop-blur-sm border-b border-white/5" : "bg-transparent"}`}>
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => go("hero")} className="flex items-baseline gap-1.5">
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "#F5F5F0" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#888", textTransform: "uppercase" }}>AGENCY</span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)}
              className="text-[#888] hover:text-[#F5F5F0] text-xs tracking-widest uppercase transition-colors font-medium">
              {l.label}
            </button>
          ))}
          <button onClick={() => go("contact")} className="btn-cta text-xs py-3 px-6">
            Оставить заявку
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-[#F5F5F0]" onClick={() => setOpen(!open)}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M17 5L5 17M5 5l12 12" /> : <path d="M3 11h16M3 6h16M3 16h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0A0A0A] border-b border-white/5 overflow-hidden">
            <div className="container pb-6 pt-2 flex flex-col gap-4">
              {links.map(l => (
                <button key={l.id} onClick={() => go(l.id)}
                  className="text-left text-[#888] hover:text-[#F5F5F0] text-xs tracking-widest uppercase py-2 border-b border-white/5">
                  {l.label}
                </button>
              ))}
              <button onClick={() => go("contact")} className="btn-cta mt-2 text-center">Оставить заявку</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Marquee ───────────────────────────────────────────────────────────────

function Marquee({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/8 py-4 bg-[#0A0A0A]">
      <div style={{ display: "flex", animation: `marquee ${speed}s linear infinite`, whiteSpace: "nowrap" }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6 text-xs tracking-widest uppercase text-[#555] font-medium">
            <span style={{ color: "#FF2D20", fontSize: "0.5rem" }}>●</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── HERO (Oneliner + Core Job) ─────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.35)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0A 20%, transparent 70%)" }} />
      </div>

      {/* Content */}
      <div className="relative container pb-16 pt-32">
        <div className="max-w-5xl">
          {/* Label */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="section-label mb-8 flex items-center gap-3">
            <span style={{ display: "inline-block", width: "2rem", height: "1px", background: "#FF2D20" }} />
            Агентство вебинарного продакшна
          </motion.div>

          {/* Main headline — Oneliner */}
          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[#F5F5F0] mb-8"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}>
            ВЕБИНАРЫ,<br />
            КОТОРЫЕ<br />
            <span style={{ color: "#FF2D20" }}>ПРОДАЮТ.</span>
          </motion.h1>

          {/* Core Job */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
            className="text-[#888] max-w-xl mb-10"
            style={{ fontSize: "1rem", lineHeight: 1.7, fontWeight: 400 }}>
            Пересобираем вебинарные воронки и повышаем ROMI на холодном трафике —
            чтобы вы кратно масштабировали выручку без найма новых людей в штат.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4 items-center">
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-cta">
              Получить бесплатный аудит
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => document.getElementById("cases")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-ghost">
              Смотреть кейсы
            </button>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-white/8 pt-8">
          {[
            { n: 5, s: "+", label: "лет в вебинарном маркетинге" },
            { n: 70, s: "%+", label: "ROMI на холодном трафике" },
            { n: 4, s: "×", label: "рост выручки у клиентов" },
            { n: 50, s: "+", label: "вебинаров запущено" },
          ].map((stat, i) => (
            <div key={i} className="pr-8 pb-4 md:pb-0 border-r border-white/8 last:border-r-0 first:pl-0">
              <div className="num-accent" style={{ fontSize: "2.5rem" }}>
                <CountUp end={stat.n} suffix={stat.s} />
              </div>
              <div className="text-[#555] text-xs mt-1 leading-tight">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── MARQUEE CLIENTS ────────────────────────────────────────────────────────

function ClientsMarquee() {
  const clients = ["Skillbox", "SkillFactory", "Primecraft", "Логомашина", "EdTech", "Онлайн-школы", "Федеральные бренды", "D2C-проекты"];
  return <Marquee items={clients} speed={28} />;
}

// ─── MICRO JOBS (что мы делаем) ─────────────────────────────────────────────

function Services() {
  const services = [
    {
      num: "01",
      title: "Аудит воронки",
      desc: "Находим узкие горлышка, где вы теряете деньги прямо сейчас. Бесплатно для первого обращения.",
      tag: "Micro Job 1",
    },
    {
      num: "02",
      title: "Сценарий и смыслы",
      desc: "Разрабатываем продающий сценарий вебинара на основе реальных болей вашей ЦА. Спикер получает готовую презентацию.",
      tag: "Micro Job 2",
    },
    {
      num: "03",
      title: "Продакшн под ключ",
      desc: "Студийная картинка, звук, режиссура эфира. Ваш бренд выглядит дорого — без технических сбоев.",
      tag: "Micro Job 3",
    },
    {
      num: "04",
      title: "Автоворонка",
      desc: "Чат-боты, email, SMS — автоматизируем касания и увеличиваем доходимость до вебинара на 20–30%.",
      tag: "Micro Job 4",
    },
    {
      num: "05",
      title: "Аналитика и ROMI",
      desc: "Ежедневные отчёты по каждому вложенному рублю. Прозрачная экономика, понятная фаундерам.",
      tag: "Micro Job 5",
    },
    {
      num: "06",
      title: "Масштабирование",
      desc: "Запускаем новые направления без найма людей в штат. Система, которая работает без вас.",
      tag: "Micro Job 6",
    },
  ];

  return (
    <section id="services" className="py-24 bg-[#0A0A0A]">
      <div className="container">
        <FadeUp>
          <div className="flex items-end justify-between mb-16 border-b border-white/8 pb-8">
            <div>
              <div className="section-label mb-4">Что мы делаем</div>
              <h2 className="font-display text-[#F5F5F0]" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.92 }}>
                ПОЛНЫЙ ЦИКЛ<br />
                <span style={{ color: "#FF2D20" }}>ВЕБИНАРНОГО</span><br />
                МАРКЕТИНГА
              </h2>
            </div>
            <div className="hidden md:block text-[#555] text-xs max-w-xs text-right leading-relaxed">
              От аудита до масштабирования — берём на себя всё, чтобы ваша команда занималась продуктом.
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {services.map((s, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div className="border-b border-r border-white/8 p-8 group hover:bg-[#111] transition-colors"
                style={{ borderRight: (i + 1) % 3 === 0 ? "none" : undefined }}>
                <div className="flex items-start justify-between mb-6">
                  <span className="num-accent" style={{ fontSize: "1.1rem" }}>{s.num}</span>
                  <span className="section-label" style={{ color: "#444", fontSize: "0.55rem" }}>{s.tag}</span>
                </div>
                <h3 className="font-display text-[#F5F5F0] mb-4" style={{ fontSize: "1.4rem" }}>{s.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{s.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AHA-МОМЕНТ (кейсы с реальными вебинарами) ─────────────────────────────

function Cases() {
  const cases = [
    {
      client: "Онлайн-школа №1",
      period: "2023–2024",
      tag: "EdTech",
      result: "ROMI +70%",
      sub: "на холодном трафике за 1 месяц",
      desc: "Год работы с крупнейшей онлайн-школой: пересобрали воронку, переписали сценарии, внедрили автоворонку. Холодный трафик начал окупаться.",
      webinar: null,
      bg: "#111",
    },
    {
      client: "Primecraft",
      period: "2024–2025",
      tag: "Спортивное питание / D2C",
      result: "×4 выручка",
      sub: "в D2C-канале через вебинарную воронку",
      desc: "Федеральный бренд спортивного питания. Запустили обучающие вебинары для D2C-продаж. Собрали собственную базу, снизили зависимость от маркетплейсов.",
      webinar: "https://primecraft.ru",
      bg: "#0D0D0D",
    },
    {
      client: "SkillFactory",
      period: "2022–2023",
      tag: "EdTech",
      result: "ROMI 160%",
      sub: "на запуске нового курса",
      desc: "Продающие вебинары для запуска нового продуктового направления. Полный продакшн: сценарий, студия, автоворонка, аналитика.",
      webinar: null,
      bg: "#111",
    },
  ];

  return (
    <section id="cases" className="py-24 bg-[#0A0A0A]">
      <div className="container">
        <FadeUp>
          <div className="section-label mb-4">Aha-момент</div>
          <h2 className="font-display text-[#F5F5F0] mb-16" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.92 }}>
            КЕЙСЫ,<br />
            КОТОРЫЕ<br />
            <span style={{ color: "#FF2D20" }}>ГОВОРЯТ ЦИФРАМИ</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-white/8">
          {cases.map((c, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="p-8 border-r border-white/8 last:border-r-0 flex flex-col h-full" style={{ background: c.bg }}>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="section-label mb-1">{c.tag}</div>
                    <div className="text-[#F5F5F0] font-semibold text-sm">{c.client}</div>
                  </div>
                  <div className="text-[#444] text-xs">{c.period}</div>
                </div>

                <div className="mb-6">
                  <div className="num-accent" style={{ fontSize: "3rem" }}>{c.result}</div>
                  <div className="text-[#666] text-xs mt-1">{c.sub}</div>
                </div>

                <p className="text-[#666] text-sm leading-relaxed flex-1 mb-6">{c.desc}</p>

                {c.webinar ? (
                  <a href={c.webinar} target="_blank" rel="noopener noreferrer"
                    className="btn-ghost text-xs self-start">
                    Смотреть проект →
                  </a>
                ) : (
                  <span className="text-[#333] text-xs">NDA</span>
                )}
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Screen image */}
        <FadeUp delay={0.2}>
          <div className="mt-0 border-x border-b border-white/8 overflow-hidden" style={{ height: "320px" }}>
            <img src={SCREEN_IMG} alt="Аналитика вебинарной воронки" className="w-full h-full object-cover" style={{ filter: "brightness(0.7)" }} />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── УЗНАЁШЬ СЕБЯ (боли, триггеры) ─────────────────────────────────────────

function Recognition() {
  const triggers = [
    { q: "CPA вырос, а конверсия упала?", e: "Тревога за KPI перед фаундерами", p: "Старые связки выгорели" },
    { q: "Конец квартала, план горит?", e: "Усталость от гипотез без результата", p: "Команда не справляется с объёмом" },
    { q: "Реклама дорожает, маркетплейсы душат?", e: "Разочарование от падающего ROMI", p: "Нет экспертизы внутри для контентных воронок" },
    { q: "Хочешь D2C, но не знаешь как?", e: "Страх не выполнить план по новым каналам", p: "Нет насмотренности на рынке" },
  ];

  return (
    <section className="py-24 bg-[#0D0D0D]">
      <div className="container">
        <FadeUp>
          <div className="section-label mb-4">Узнаёшь себя?</div>
          <h2 className="font-display text-[#F5F5F0] mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 0.92 }}>
            ТЫ ХОЧЕШЬ КРАТНЫЙ РОСТ —<br />
            <span style={{ color: "#FF2D20" }}>НО ЧТО-ТО МЕШАЕТ.</span>
          </h2>
          <p className="text-[#666] mb-16 max-w-lg text-sm leading-relaxed">
            Ты хочешь выполнить амбициозные KPI или запустить новый продукт — но старые инструменты уже не работают.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/8">
          {triggers.map((t, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="p-8 border-b border-r border-white/8" style={{ borderRight: i % 2 === 1 ? "none" : undefined, borderBottom: i >= 2 ? "none" : undefined }}>
                <div className="text-[#F5F5F0] font-semibold mb-3 text-base">{t.q}</div>
                <div className="flex gap-6 mt-4">
                  <div>
                    <div className="section-label mb-1" style={{ color: "#FF2D20", fontSize: "0.55rem" }}>Эмоция</div>
                    <div className="text-[#666] text-xs leading-relaxed">{t.e}</div>
                  </div>
                  <div>
                    <div className="section-label mb-1" style={{ color: "#444", fontSize: "0.55rem" }}>Проблема</div>
                    <div className="text-[#555] text-xs leading-relaxed">{t.p}</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── КАК МЫ ДЕЛАЕМ (объясняем экспертизу) ──────────────────────────────────

function HowWeDo() {
  const steps = [
    { n: "01", title: "Аудит за 48 часов", desc: "Смотрим вашу воронку и показываем 3 точки потери денег. Прозрачно, без воды." },
    { n: "02", title: "Смысловая упаковка", desc: "Переписываем сценарий под боли холодной аудитории. Контент, который удерживает и конвертирует." },
    { n: "03", title: "Продакшн эфира", desc: "Студийная картинка, режиссура, телесуфлёр. Ваш спикер выглядит как профи." },
    { n: "04", title: "Автоматизация касаний", desc: "Боты и рассылки догревают тех, кто не дошёл. Доходимость +20–30%." },
  ];

  return (
    <section className="py-24 bg-[#0A0A0A]" style={{ backgroundImage: `url(${GRID_IMG})`, backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "multiply" }}>
      <div className="container">
        <FadeUp>
          <div className="section-label mb-4">Как мы выполним вашу задачу</div>
          <h2 className="font-display text-[#F5F5F0] mb-16" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.92 }}>
            СИСТЕМА,<br />
            <span style={{ color: "#FF2D20" }}>НЕ РАЗОВАЯ</span><br />
            УСЛУГА
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {steps.map((s, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="p-10 border border-white/8 bg-[#0A0A0A]/80" style={{ marginTop: i >= 2 ? "-1px" : 0, marginLeft: i % 2 === 1 ? "-1px" : 0 }}>
                <div className="num-accent mb-6" style={{ fontSize: "1rem" }}>{s.n}</div>
                <h3 className="font-display text-[#F5F5F0] mb-4" style={{ fontSize: "1.5rem" }}>{s.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{s.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ТОЧКА Б (образ результата) ─────────────────────────────────────────────

function PointB() {
  const outcomes = [
    { icon: "📈", title: "Стабильно растущий ROMI", desc: "Вы видите предсказуемую окупаемость каждого вложенного рубля. Не гадаете — знаете." },
    { icon: "🏆", title: "Выполненные KPI", desc: "Вы перевыполнили план. Фаундеры довольны. Вы получили заслуженный бонус и авторитет." },
    { icon: "⚙️", title: "Система без вас", desc: "Воронка работает автоматически. Команда занимается продуктом, а не операционкой." },
    { icon: "🚀", title: "Новые направления", desc: "Вы запустили новый продукт без найма людей. Масштаб без хаоса." },
  ];

  return (
    <section className="py-24 bg-[#0D0D0D]">
      <div className="container">
        <FadeUp>
          <div className="section-label mb-4">Точка Б</div>
          <h2 className="font-display text-[#F5F5F0] mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.92 }}>
            КАК ВЫ БУДЕТЕ<br />
            <span style={{ color: "#FF2D20" }}>СЕБЯ ЧУВСТВОВАТЬ</span>
          </h2>
          <p className="text-[#666] mb-16 max-w-lg text-sm leading-relaxed">
            Уверенность. Гордость. Облегчение. Вы делегировали сложный процесс надёжным партнёрам — и получили результат.
          </p>
        </FadeUp>

        {/* Team image */}
        <FadeUp delay={0.1}>
          <div className="mb-0 overflow-hidden border border-white/8" style={{ height: "400px" }}>
            <img src={TEAM_IMG} alt="Команда Гипотеза" className="w-full h-full object-cover" style={{ filter: "brightness(0.6)" }} />
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-x border-b border-white/8">
          {outcomes.map((o, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="p-8 border-r border-b border-white/8 last:border-r-0" style={{ borderBottom: "none" }}>
                <div className="text-2xl mb-4">{o.icon}</div>
                <h3 className="text-[#F5F5F0] font-semibold mb-3 text-sm">{o.title}</h3>
                <p className="text-[#555] text-xs leading-relaxed">{o.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── КОМАНДА ────────────────────────────────────────────────────────────────

function Team() {
  const team = [
    {
      name: "Денис Зюлин",
      role: "Стратегический маркетинг и продукт",
      color: "#FF2D20",
      desc: "Формирует маркетинговую стратегию и продуктовую логику. Погружается в бизнес как собственник, проводит исследования, помогает увидеть истинные точки роста.",
      exp: "5+ лет в EdTech",
    },
    {
      name: "Алексей Пономарёв",
      role: "Аналитика, трафик и стратегические механики",
      color: "#4A9EFF",
      desc: "Формирует экономику и аналитику каналов. Управляет холодным трафиком и системными механиками, которые масштабируют выручку и делают маркетинг предсказуемым.",
      exp: "Автоворонки и трафик",
    },
    {
      name: "Алла Захарова",
      role: "Архитектура воронок и контента",
      color: "#F5F5F0",
      desc: "Создаёт концепции, воронки и живые запуски, которые дают стабильный поток заявок. Работала в Skillbox, SkillFactory.",
      exp: "Skillbox, SkillFactory",
    },
    {
      name: "Дмитрий Лебедев",
      role: "Операционная поддержка",
      color: "#888",
      desc: "Отчёты, аналитика, контроль процессов. Держит проекты в порядке и помогает команде быть быстрее.",
      exp: "Операционный менеджмент",
    },
  ];

  return (
    <section id="team" className="py-24 bg-[#0A0A0A]">
      <div className="container">
        <FadeUp>
          <div className="section-label mb-4">Команда</div>
          <h2 className="font-display text-[#F5F5F0] mb-16" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.92 }}>
            ЧЕТЫРЕ<br />
            <span style={{ color: "#FF2D20" }}>СУПЕРГЕРОЯ</span><br />
            ВЕБИНАРОВ
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/8">
          {team.map((m, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="p-8 border-b border-r border-white/8 group"
                style={{ borderRight: i % 2 === 1 ? "none" : undefined, borderBottom: i >= 2 ? "none" : undefined }}>
                {/* Color accent line */}
                <div style={{ width: "2rem", height: "2px", background: m.color, marginBottom: "1.5rem" }} />
                <div className="text-[#F5F5F0] font-semibold text-base mb-1">{m.name}</div>
                <div className="section-label mb-4" style={{ color: m.color, fontSize: "0.6rem" }}>{m.role}</div>
                <p className="text-[#666] text-sm leading-relaxed mb-4">{m.desc}</p>
                <div className="text-[#444] text-xs tracking-wide">{m.exp}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── БАРЬЕРЫ ────────────────────────────────────────────────────────────────

function Barriers() {
  const items = [
    {
      barrier: "У нас уже есть маркетолог",
      answer: "Мы не замещаем вашего маркетолога — мы его усиливаем. Даём готовую систему и нашу насмотренность на рынке.",
    },
    {
      barrier: "Проще нанять человека в штат",
      answer: "Найм и онбординг займут 2 месяца. Мы запустим первые тесты уже через неделю.",
    },
    {
      barrier: "Боимся за утечку данных",
      answer: "Работаем с EdTech годами, строго соблюдаем NDA. Ваши цифры не раскрываем.",
    },
    {
      barrier: "Слишком дорого для нас",
      answer: "Стоимость одного выгоревшего запуска выше нашего ретейнера. Считаем вместе на первой встрече.",
    },
  ];

  return (
    <section className="py-24 bg-[#0D0D0D]">
      <div className="container">
        <FadeUp>
          <div className="section-label mb-4">Снижаем барьеры</div>
          <h2 className="font-display text-[#F5F5F0] mb-16" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.92 }}>
            МЫ СЛЫШАЛИ<br />
            <span style={{ color: "#FF2D20" }}>ЭТИ ВОЗРАЖЕНИЯ.</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/8">
          {items.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="p-8 border-b border-r border-white/8"
                style={{ borderRight: i % 2 === 1 ? "none" : undefined, borderBottom: i >= 2 ? "none" : undefined }}>
                <div className="flex gap-3 items-start mb-4">
                  <span style={{ color: "#FF2D20", fontSize: "1rem", marginTop: "2px" }}>✕</span>
                  <div className="text-[#F5F5F0] font-semibold text-sm">{item.barrier}</div>
                </div>
                <div className="flex gap-3 items-start">
                  <span style={{ color: "#4A9EFF", fontSize: "1rem", marginTop: "2px" }}>✓</span>
                  <div className="text-[#666] text-sm leading-relaxed">{item.answer}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── КОНКУРЕНТЫ ─────────────────────────────────────────────────────────────

function Competitors() {
  const rows = [
    {
      them: "Инхаус-команда",
      issue: "Не видит, что работает у других. Долго тестирует.",
      us: "Насмотренность на 50+ проектов. Запуск гипотез за неделю.",
    },
    {
      them: "Обычные фрилансеры",
      issue: "Делают одну часть. Нет системы, нет ответственности за ROMI.",
      us: "Полный цикл под ключ: от смыслов до аналитики. Отвечаем за результат.",
    },
    {
      them: "Классические агентства",
      issue: "Широкий профиль, нет глубины в вебинарах и EdTech.",
      us: "Узкая специализация. 5 лет только вебинарный маркетинг.",
    },
  ];

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="container">
        <FadeUp>
          <div className="section-label mb-4">Увольняем конкурентов</div>
          <h2 className="font-display text-[#F5F5F0] mb-16" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.92 }}>
            ПОЧЕМУ НЕ<br />
            <span style={{ color: "#FF2D20" }}>ДРУГИЕ.</span>
          </h2>
        </FadeUp>

        <div className="border border-white/8">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-white/8 bg-[#111]">
            <div className="p-4 text-[#444] text-xs tracking-widest uppercase border-r border-white/8">Альтернатива</div>
            <div className="p-4 text-[#444] text-xs tracking-widest uppercase border-r border-white/8">Проблема</div>
            <div className="p-4 text-[#FF2D20] text-xs tracking-widest uppercase">Гипотеза</div>
          </div>
          {rows.map((r, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="grid grid-cols-3 border-b border-white/8 last:border-b-0 hover:bg-[#0D0D0D] transition-colors">
                <div className="p-6 text-[#F5F5F0] text-sm font-medium border-r border-white/8">{r.them}</div>
                <div className="p-6 text-[#555] text-sm leading-relaxed border-r border-white/8">{r.issue}</div>
                <div className="p-6 text-[#F5F5F0] text-sm leading-relaxed">{r.us}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT (CTA + форма) ──────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", company: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#0D0D0D] border-t border-white/8">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left */}
          <FadeUp className="pr-0 lg:pr-16 border-b lg:border-b-0 lg:border-r border-white/8 pb-16 lg:pb-0">
            <div className="section-label mb-4">Начать работу</div>
            <h2 className="font-display text-[#F5F5F0] mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 0.92 }}>
              ПОЛУЧИТЕ<br />
              БЕСПЛАТНЫЙ<br />
              <span style={{ color: "#FF2D20" }}>АУДИТ ВОРОНКИ</span>
            </h2>
            <p className="text-[#666] text-sm leading-relaxed mb-10 max-w-sm">
              Оставьте заявку — и мы бесплатно покажем 3 узких горлышка, где вы теряете деньги прямо сейчас. Без обязательств.
            </p>

            <div className="space-y-4">
              {[
                { icon: "📞", text: "Ответим в течение 2 часов в рабочее время" },
                { icon: "🔒", text: "NDA по запросу. Ваши данные в безопасности" },
                { icon: "⚡", text: "Первые выводы — уже на первой встрече" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#555] text-xs">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Right — Form */}
          <FadeUp delay={0.15} className="pt-16 lg:pt-0 lg:pl-16">
            {sent ? (
              <div className="flex flex-col items-start justify-center h-full gap-4">
                <div className="num-accent" style={{ fontSize: "3rem" }}>✓</div>
                <h3 className="font-display text-[#F5F5F0]" style={{ fontSize: "2rem" }}>ЗАЯВКА ОТПРАВЛЕНА</h3>
                <p className="text-[#666] text-sm">Свяжемся с вами в течение 2 часов.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {[
                  { name: "name", placeholder: "Ваше имя", type: "text", required: true },
                  { name: "company", placeholder: "Компания / проект", type: "text", required: false },
                  { name: "phone", placeholder: "Телефон или Telegram", type: "text", required: true },
                ].map((field) => (
                  <input key={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={form[field.name as keyof typeof form]}
                    onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                    className="w-full bg-transparent border-b border-white/15 text-[#F5F5F0] placeholder-[#444] text-sm py-3 px-0 focus:outline-none focus:border-[#FF2D20] transition-colors"
                    style={{ borderRadius: 0 }}
                  />
                ))}
                <textarea
                  placeholder="Расскажите о задаче (необязательно)"
                  rows={3}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border-b border-white/15 text-[#F5F5F0] placeholder-[#444] text-sm py-3 px-0 focus:outline-none focus:border-[#FF2D20] transition-colors resize-none"
                  style={{ borderRadius: 0 }}
                />
                <div className="pt-4">
                  <button type="submit" className="btn-cta w-full justify-center">
                    Получить бесплатный аудит
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
                <p className="text-[#333] text-xs pt-2">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#0A0A0A]">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "#F5F5F0" }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
            <div className="text-[#333] text-xs mt-1">Агентство вебинарного продакшна</div>
          </div>
          <div className="flex gap-8 text-[#444] text-xs tracking-widest uppercase">
            <a href="https://gipoteza-agency.ru" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF2D20] transition-colors">Старый сайт</a>
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF2D20] transition-colors">Telegram</a>
          </div>
          <div className="text-[#333] text-xs">© 2025 Гипотеза Agency</div>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Nav />
      <Hero />
      <ClientsMarquee />
      <Services />
      <Cases />
      <Recognition />
      <HowWeDo />
      <PointB />
      <Team />
      <Barriers />
      <Competitors />
      <Contact />
      <Footer />
    </div>
  );
}
