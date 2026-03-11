/**
 * DESIGN PHILOSOPHY: Dark Cinematic / Comic-Book Noir
 * "Команда супергероев вебинарного маркетинга"
 * Colors: Deep black (#0A0A0F) + Electric gold + Neon blue
 * Typography: Bebas Neue (display) + Montserrat (body)
 * Layout: Asymmetric, diagonal dividers, large bg numbers, overlapping elements
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/hero-bg-73xexy543rbkv9VveVjfXv.webp";
const TEAM_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/team-hero-g2GCjBGgukt5LKCCDMRqeY.webp";
const WEBINAR_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/webinar-action-ZzRnCAE2mNBiy5Ej3tD8qq.webp";

// Fade-in animation wrapper
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stat counter animation
function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Navigation
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0F]/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.08em" }}
            className="text-white">
            gipot<span className="text-gold-gradient">é</span>za
          </span>
          <span className="hidden sm:block text-xs text-white/30 font-medium tracking-widest uppercase ml-2 mt-1">
            agency
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Услуги", id: "services" },
            { label: "Кейсы", id: "cases" },
            { label: "Команда", id: "team" },
            { label: "FAQ", id: "faq" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-white/60 hover:text-white text-sm font-medium tracking-wide transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            className="btn-primary text-xs py-2.5 px-5"
          >
            Оставить заявку
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A0A0F]/98 border-b border-white/5 px-4 pb-4">
          {[
            { label: "Услуги", id: "services" },
            { label: "Кейсы", id: "cases" },
            { label: "Команда", id: "team" },
            { label: "FAQ", id: "faq" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="block w-full text-left text-white/70 hover:text-white py-3 text-sm font-medium border-b border-white/5"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            className="btn-primary w-full mt-4 text-center"
          >
            Оставить заявку
          </button>
        </div>
      )}
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
          style={{ transform: "scale(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/85 to-[#0A0A0F]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-[#0A0A0F]/30" />
      </motion.div>

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 z-0 overflow-hidden pointer-events-none">
        <span
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(8rem, 20vw, 18rem)", lineHeight: 1, opacity: 0.04, letterSpacing: "0.05em" }}
          className="text-white select-none"
        >
          HERO
        </span>
      </div>

      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge inline-flex items-center gap-2 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Агентство вебинарного продакшна
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 9vw, 7rem)", lineHeight: 0.95, letterSpacing: "0.02em" }}
            className="text-white mb-4"
          >
            Команда{" "}
            <span className="text-gold-gradient">супергероев</span>
            <br />
            вебинарного
            <br />
            маркетинга
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/65 text-lg font-medium leading-relaxed mb-8 max-w-xl"
          >
            Делаем вебинары и автоворонки под ключ для EdTech и крупных брендов.
            Превращаем живые эфиры в предсказуемую машину продаж.
          </motion.p>

          {/* Clients logos row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 mb-10"
          >
            {["Skillbox", "SkillFactory", "Primecraft", "Логомашина"].map((brand) => (
              <span
                key={brand}
                className="text-xs font-semibold tracking-widest uppercase text-white/30 border border-white/10 px-3 py-1.5 rounded"
              >
                {brand}
              </span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <button
              className="btn-primary"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Получить консультацию
            </button>
            <button
              className="btn-secondary"
              onClick={() => document.getElementById("cases")?.scrollIntoView({ behavior: "smooth" })}
            >
              Смотреть кейсы →
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stats strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border-t border-white/5"
          >
            {[
              { num: 5, suffix: "+ лет", label: "опыта в вебинарах" },
              { num: 160, suffix: "%", label: "ROMI автоворонки" },
              { num: 4, suffix: "x", label: "рост выручки без бюджета" },
              { num: 70, suffix: "%+", label: "рост ROMI на холодном трафике" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0A0A0F]/80 backdrop-blur-sm px-6 py-5">
                <div className="stat-number text-4xl">
                  <CountUp end={stat.num} suffix={stat.suffix} />
                </div>
                <div className="text-white/40 text-xs font-medium mt-1 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Problem Section — "Узнаёшь себя?"
function ProblemSection() {
  const problems = [
    {
      icon: "⚡",
      title: "Вебинары есть, но продаж нет",
      desc: "Эксперт выкладывается на 100%, зал собирается — а конверсия в продажу не растёт. Каждый запуск — лотерея.",
    },
    {
      icon: "🔥",
      title: "Команда выгорает на живых эфирах",
      desc: "Каждый вебинар требует огромных ресурсов. Нет системы, нет автоматизации — только ручной труд снова и снова.",
    },
    {
      icon: "🎯",
      title: "Нет понимания, что работает",
      desc: "Непонятно, какой оффер цепляет, какой сценарий конвертирует. Решения принимаются на ощущениях, не на данных.",
    },
    {
      icon: "💸",
      title: "Холодный трафик не окупается",
      desc: "Вкладываете деньги в рекламу, а ROMI уходит в минус. Воронка не выстроена — каждый рубль сгорает впустую.",
    },
  ];

  return (
    <section className="py-24 bg-[#0A0A0F] relative overflow-hidden">
      {/* Large background number */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden">
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20rem", opacity: 0.025, color: "white", lineHeight: 1 }}>
          ?
        </span>
      </div>

      <div className="container relative z-10">
        <FadeIn>
          <div className="hero-badge inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Узнаёшь себя?
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1, letterSpacing: "0.02em" }}
            className="text-white mb-4"
          >
            Ты хочешь сделать вебинар
            <br />
            <span className="text-gold-gradient">машиной продаж</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-white/50 text-lg mb-16 max-w-xl font-medium">
            Но что-то мешает. Вот самые частые боли, с которыми к нам приходят:
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((p, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div className="card-hero rounded-lg p-6 flex gap-4">
                <div className="text-3xl flex-shrink-0">{p.icon}</div>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const services = [
    {
      num: "01",
      title: "Вебинар под ключ",
      desc: "Сценарий, структура, слайды, технический продакшн, аналитика. Берём на себя всё — от идеи до цифр конверсии.",
      features: ["Сценарий и оффер", "Слайды и визуал", "Технический продакшн", "Аналитика и отчёт"],
      color: "gold",
    },
    {
      num: "02",
      title: "Автоворонка на вебинаре",
      desc: "Записываем один раз — продаём постоянно. Строим автоворонку с окупаемостью от 160% ROMI на холодном трафике.",
      features: ["CJM и архитектура воронки", "Автовебинар + касания", "Трафик и аналитика", "Оптимизация ROMI"],
      color: "blue",
    },
    {
      num: "03",
      title: "Стратегия вебинарного маркетинга",
      desc: "Аудит текущих вебинаров, разработка стратегии роста, внедрение системы тестирования гипотез.",
      features: ["Аудит воронки", "Стратегия роста", "Фабрика гипотез", "Передача команде"],
      color: "gold",
    },
    {
      num: "04",
      title: "Серия запусков",
      desc: "Системная работа на 3–6 месяцев. Выстраиваем предсказуемый канал продаж через вебинары и живые эфиры.",
      features: ["Регулярные запуски", "A/B тестирование", "Масштабирование", "Команда под ключ"],
      color: "blue",
    },
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0A0A0F 0%, #0D0D18 100%)" }}>
      {/* Diagonal accent line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <FadeIn>
              <div className="hero-badge inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Что мы делаем
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1, letterSpacing: "0.02em" }}
                className="text-white"
              >
                Суперсилы
                <br />
                <span className="text-gold-gradient">нашей команды</span>
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <p className="text-white/50 text-base max-w-sm font-medium leading-relaxed">
              5 лет делаем вебинары для лидеров рынка. Знаем, что работает — и делаем это быстро.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((s, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div className="card-hero rounded-xl p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <span
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", lineHeight: 1, opacity: 0.15 }}
                    className={s.color === "gold" ? "text-yellow-400" : "text-blue-400"}
                  >
                    {s.num}
                  </span>
                  <div className={`w-2 h-2 rounded-full mt-2 ${s.color === "gold" ? "bg-yellow-400" : "bg-blue-400"}`} />
                </div>
                <h3
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.03em", lineHeight: 1.1 }}
                  className="text-white mb-3"
                >
                  {s.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 flex-grow">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.features.map((f, j) => (
                    <span key={j} className="text-xs font-medium text-white/40 border border-white/10 px-2.5 py-1 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Cases Section
function CasesSection() {
  const cases = [
    {
      tag: "EdTech",
      result: "ROMI +70%",
      title: "Рост ROMI на холодном трафике",
      before: "ROMI -30–0%, бюджет 300К/мес",
      after: "ROMI +70%, бюджет 1M+/мес",
      steps: ["Аудит воронки и рекламных каналов", "Сквозная аналитика, отключение минус-источников", "Пересборка концепции воронки", "Корректировка стратегии привлечения"],
      color: "gold",
    },
    {
      tag: "Онлайн-школа",
      result: "×2.5 выручка",
      title: "Рост выручки школы в 2.5 раза",
      before: "1M/мес, хаос в процессах",
      after: "2.5M+/мес, системная работа",
      steps: ["Аудит проекта и команд", "Переписали KPI, ввели мотивацию", "Мультиканальное привлечение (автоворонки, квизы)", "Внедрение аналитики подрядчиков"],
      color: "blue",
    },
    {
      tag: "База клиентов",
      result: "×4 без бюджета",
      title: "Рост выручки в 4 раза без увеличения бюджета",
      before: "2.5M/мес, хаос с базой",
      after: "10M+/мес, системная работа",
      steps: ["Диагностика базы и воронок", "Серия спецпроектов: ретаргет, e-mail, upsell", "Автоматизация CRM"],
      color: "gold",
    },
    {
      tag: "Автоворонка",
      result: "ROMI 160%",
      title: "Автоворонка на холодном трафике",
      before: "Нет системы окупаемого привлечения",
      after: "Автоворонка с ROMI 160%",
      steps: ["Аудит проекта, упаковка ЦА и продукта", "Сборка CJM и автоворонки", "Ежедневная аналитика и оптимизация"],
      color: "blue",
    },
  ];

  return (
    <section id="cases" className="py-24 bg-[#0A0A0F] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <div className="container relative z-10">
        <FadeIn>
          <div className="hero-badge inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Кейсы
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1, letterSpacing: "0.02em" }}
            className="text-white mb-16"
          >
            Результаты,
            <br />
            <span className="text-gold-gradient">которые говорят сами</span>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-4">
          {cases.map((c, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div className="card-hero rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-4 border-b border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded ${
                      c.color === "gold" ? "bg-yellow-400/10 text-yellow-400" : "bg-blue-400/10 text-blue-400"
                    }`}>
                      {c.tag}
                    </span>
                    <span className={`stat-number text-3xl ${c.color === "gold" ? "" : "text-blue-gradient"}`}>
                      {c.result}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.03em" }} className="text-white">
                    {c.title}
                  </h3>
                </div>

                {/* Before/After */}
                <div className="grid grid-cols-2 gap-px bg-white/5">
                  <div className="bg-[#0A0A0F] p-4">
                    <div className="text-xs text-white/30 font-semibold uppercase tracking-widest mb-1">Было</div>
                    <div className="text-white/60 text-sm font-medium">{c.before}</div>
                  </div>
                  <div className={`p-4 ${c.color === "gold" ? "bg-yellow-400/5" : "bg-blue-400/5"}`}>
                    <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${c.color === "gold" ? "text-yellow-400/60" : "text-blue-400/60"}`}>Стало</div>
                    <div className={`text-sm font-bold ${c.color === "gold" ? "text-yellow-400" : "text-blue-400"}`}>{c.after}</div>
                  </div>
                </div>

                {/* Steps */}
                <div className="p-6 pt-4">
                  <div className="text-xs text-white/30 font-semibold uppercase tracking-widest mb-3">Что сделали</div>
                  <ul className="space-y-1.5">
                    {c.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/50">
                        <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${c.color === "gold" ? "bg-yellow-400" : "bg-blue-400"}`} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Webinar Section — aha-момент
function WebinarSection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0A0A0F 0%, #0D0D18 100%)" }}>
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div>
              <div className="hero-badge inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Наша суперсила
              </div>
              <h2
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1, letterSpacing: "0.02em" }}
                className="text-white mb-6"
              >
                Мощнейшая
                <br />
                <span className="text-gold-gradient">вебинарная</span>
                <br />
                экспертиза
                <br />
                на рынке
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-8 font-medium">
                5 лет я делаю вебинары для крупнейших EdTech-проектов России. Знаю изнутри, как устроена вебинарная машина Skillbox, SkillFactory, как строятся продающие сценарии, которые конвертируют в 2–3 раза лучше среднего по рынку.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "🎬", text: "Сценарии вебинаров с конверсией выше рынка в 2–3 раза" },
                  { icon: "📊", text: "Аналитика каждого эфира: где теряем, где усиливаем" },
                  { icon: "🤖", text: "Автоворонки, которые работают без вашего участия" },
                  { icon: "🚀", text: "Опыт запусков от 300К до 1M+/мес бюджета" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <span className="text-white/70 text-sm font-medium leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/10 to-blue-500/10 rounded-2xl blur-xl" />
              <img
                src={WEBINAR_IMG}
                alt="Вебинарный продакшн"
                className="relative rounded-xl w-full object-cover"
                style={{ aspectRatio: "16/10" }}
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0A0A0F]/90 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/40 font-medium uppercase tracking-widest mb-1">Текущий проект</div>
                    <div className="text-white font-bold text-sm">Primecraft — федеральный бренд спортпита</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// Team Section
function TeamSection() {
  const team = [
    {
      name: "Денис Зюлин",
      role: "Стратегический маркетинг и продукт",
      superpower: "Стратег",
      desc: "Формирует маркетинговую стратегию и продуктовую логику. Погружается в бизнес как собственник, проводит исследования, помогает увидеть истинные точки роста и собрать систему, которая работает предсказуемо.",
      exp: ["Skillfactory", "Skillbox", "Логомашина"],
      color: "gold",
      icon: "⚡",
    },
    {
      name: "Алексей Пономарёв",
      role: "Аналитика, трафик и стратегические механики",
      superpower: "Аналитик",
      desc: "Формирует экономику и аналитику каналов. Управляет холодным трафиком и системными механиками, которые масштабируют выручку и делают маркетинг предсказуемым.",
      exp: ["Логомашина", "Skillfactory", "Alteco"],
      color: "blue",
      icon: "🎯",
    },
    {
      name: "Алла Захарова",
      role: "Архитектура воронок и контента",
      superpower: "Архитектор",
      desc: "Создаёт концепции, воронки и живые запуски, которые дают стабильный поток заявок. Опыт в крупнейших EdTech-проектах страны.",
      exp: ["Skillbox", "SkillFactory"],
      color: "gold",
      icon: "🔮",
    },
    {
      name: "Дмитрий Лебедев",
      role: "Операционная поддержка",
      superpower: "Операционист",
      desc: "Отчёты, аналитика, контроль процессов. Держит проекты в порядке и помогает команде быть быстрее.",
      exp: ["Операционный менеджмент"],
      color: "blue",
      icon: "🛡️",
    },
  ];

  return (
    <section id="team" className="py-24 bg-[#0A0A0F] relative overflow-hidden">
      {/* Team hero image */}
      <div className="absolute inset-0 z-0">
        <img src={TEAM_HERO} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-[#0A0A0F]/70 to-[#0A0A0F]" />
      </div>

      <div className="container relative z-10">
        <FadeIn>
          <div className="hero-badge inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Команда
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1, letterSpacing: "0.02em" }}
            className="text-white mb-4"
          >
            Ваши супергерои
            <br />
            <span className="text-gold-gradient">на проекте</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-white/50 text-base mb-16 max-w-lg font-medium">
            Каждый — специалист с реальным опытом в топовых проектах рынка. Не агентство-посредник, а команда практиков.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((member, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div className="card-hero rounded-xl p-6 h-full flex flex-col">
                {/* Avatar placeholder with icon */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4 ${
                  member.color === "gold" ? "bg-yellow-400/10" : "bg-blue-400/10"
                }`}>
                  {member.icon}
                </div>

                {/* Superpower badge */}
                <span className={`text-xs font-bold tracking-widest uppercase mb-3 ${
                  member.color === "gold" ? "text-yellow-400" : "text-blue-400"
                }`}>
                  {member.superpower}
                </span>

                <h3 className="text-white font-bold text-base mb-1">{member.name}</h3>
                <p className={`text-xs font-semibold mb-3 ${member.color === "gold" ? "text-yellow-400/70" : "text-blue-400/70"}`}>
                  {member.role}
                </p>
                <p className="text-white/45 text-xs leading-relaxed mb-4 flex-grow">{member.desc}</p>

                <div className="flex flex-wrap gap-1.5">
                  {member.exp.map((e, j) => (
                    <span key={j} className="text-xs text-white/30 border border-white/8 px-2 py-0.5 rounded">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Us / Value Section
function ValueSection() {
  const values = [
    {
      num: "01",
      title: "Не подрядчик — партнёр",
      desc: "Погружаемся в бизнес как собственники. Говорим на языке продукта и цифр, а не «ведём проекты».",
    },
    {
      num: "02",
      title: "Насмотренность топ-проектов",
      desc: "Видели изнутри, как устроен маркетинг Skillbox, SkillFactory. Знаем типовые ошибки и что реально работает.",
    },
    {
      num: "03",
      title: "Система, а не разовый запуск",
      desc: "Строим предсказуемую машину продаж. После работы с нами у вас остаётся документация, процессы, команда.",
    },
    {
      num: "04",
      title: "Быстрее найма",
      desc: "Найм ≈ 1.5–2 мес. + онбординг. Мы выстраиваем всё быстрее и дешевле, потом передаём вашему специалисту.",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0D0D18 0%, #0A0A0F 100%)" }}>
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeIn>
              <div className="hero-badge inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Почему мы
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1, letterSpacing: "0.02em" }}
                className="text-white mb-6"
              >
                Увольняем
                <br />
                <span className="text-gold-gradient">конкурентов</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-white/50 text-base leading-relaxed font-medium mb-8">
                Сравните нас с альтернативами — и вы поймёте, почему EdTech-лидеры выбирают нас.
              </p>
            </FadeIn>

            {/* Comparison table */}
            <FadeIn delay={0.3}>
              <div className="rounded-xl overflow-hidden border border-white/8">
                <div className="grid grid-cols-3 bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40 px-4 py-3">
                  <span>Критерий</span>
                  <span className="text-center text-yellow-400">Гипотеза</span>
                  <span className="text-center">Альтернативы</span>
                </div>
                {[
                  ["Опыт в топ-EdTech", "✓", "Редко"],
                  ["Вебинары + автоворонки", "✓", "Обычно одно"],
                  ["Аналитика и ROMI", "✓", "Частично"],
                  ["Скорость запуска", "1–2 нед.", "1–2 мес."],
                  ["Передача процессов", "✓", "Нет"],
                ].map(([crit, us, them], i) => (
                  <div key={i} className={`grid grid-cols-3 px-4 py-3 text-sm border-t border-white/5 ${i % 2 === 0 ? "bg-[#0A0A0F]" : "bg-white/2"}`}>
                    <span className="text-white/60 font-medium">{crit}</span>
                    <span className="text-center text-yellow-400 font-bold">{us}</span>
                    <span className="text-center text-white/30">{them}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="space-y-4">
            {values.map((v, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className="card-hero rounded-xl p-6 flex gap-4">
                  <span
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", lineHeight: 1, opacity: 0.2 }}
                    className="text-yellow-400 flex-shrink-0"
                  >
                    {v.num}
                  </span>
                  <div>
                    <h3 className="text-white font-bold text-base mb-2">{v.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Point B Section — "Точка Б"
function PointBSection() {
  const outcomes = [
    { icon: "📈", text: "Вебинар стал предсказуемым каналом продаж с понятным ROMI" },
    { icon: "🤖", text: "Автоворонка работает без вашего участия и окупает трафик" },
    { icon: "😌", text: "Команда не выгорает — есть система, сценарии, процессы" },
    { icon: "🎯", text: "Вы знаете, какой оффер работает, и масштабируете его" },
    { icon: "💰", text: "Холодный трафик окупается с первого месяца" },
    { icon: "🏆", text: "Ваш вебинар выглядит и продаёт как у лидеров рынка" },
  ];

  return (
    <section className="py-24 bg-[#0A0A0F] relative overflow-hidden">
      {/* Gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.15 85 / 5%) 0%, transparent 70%)" }} />

      <div className="container relative z-10">
        <FadeIn>
          <div className="hero-badge inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Точка Б
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1, letterSpacing: "0.02em" }}
            className="text-white mb-4"
          >
            Как выглядит
            <br />
            <span className="text-gold-gradient">ваш результат</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-white/50 text-base mb-16 max-w-lg font-medium">
            После работы с нами вы получаете не просто «проведённый вебинар» — а работающую систему.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outcomes.map((o, i) => (
            <FadeIn key={i} delay={0.08 * i}>
              <div className="card-hero rounded-xl p-6 flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{o.icon}</span>
                <p className="text-white/70 text-sm font-medium leading-relaxed">{o.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "У нас уже есть маркетолог. Зачем нам вы?",
      a: "Мы не замещаем вашего маркетолога — мы усиливаем. Ваш маркетолог остаётся в фокусе — но теперь с поддержкой, стратегией и рабочей системой. Работаем в партнёрстве: глубоко погружаемся в продукт, разбираемся «по локоть», а не по верхам. Даём внешний взгляд с опытом десятков EdTech-проектов.",
    },
    {
      q: "Проще же нанять человека в команду?",
      a: "В теории — да, но на практике: найм ≈ 1.5–2 мес. + онбординг, риски промаха. Стоимость + налоги = ≈ 200–250 тыс. ₽/мес за медла. Мы выстраиваем всё быстрее, потом можем передать процессы вашему специалисту — с документацией и обучением.",
    },
    {
      q: "Вы работаете только с EdTech?",
      a: "Нет. Наш основной опыт — EdTech и крупные онлайн-школы, но вебинарный маркетинг работает для любого бизнеса с экспертным продуктом. Сейчас, например, делаем вебинарку для Primecraft — федерального бренда спортивного питания.",
    },
    {
      q: "Сколько стоят ваши услуги?",
      a: "Стоимость зависит от объёма и формата работы. Разовый вебинар под ключ — от 150К. Системная работа на 3–6 месяцев — от 300К/мес. Оставьте заявку, и мы подготовим индивидуальное предложение под вашу задачу.",
    },
    {
      q: "А если у нас NDA / чувствительная информация?",
      a: "Спокойно. Мы работаем с EdTech, где это стандарт. Соблюдаем NDA юридически и по факту. Не раскрываем стратегии, данные и цифры. Наш фокус — рост вашего бизнеса, не «собирать портфолио».",
    },
    {
      q: "Как быстро вы можете начать?",
      a: "Обычно мы готовы стартовать в течение 1–2 недель после первой встречи. Для срочных проектов — быстрее. Оставьте заявку, и мы обсудим сроки на звонке.",
    },
  ];

  return (
    <section id="faq" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0A0A0F 0%, #0D0D18 100%)" }}>
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeIn>
              <div className="hero-badge inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                FAQ
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1, letterSpacing: "0.02em" }}
                className="text-white mb-6"
              >
                Снимаем
                <br />
                <span className="text-gold-gradient">барьеры</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-white/50 text-base leading-relaxed font-medium">
                Отвечаем на вопросы, которые возникают перед тем, как написать нам.
              </p>
            </FadeIn>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={0.08 * i}>
                <div className="card-hero rounded-xl overflow-hidden">
                  <button
                    className="w-full text-left p-5 flex items-start justify-between gap-4"
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <span className="text-white font-semibold text-sm leading-relaxed">{faq.q}</span>
                    <span className={`flex-shrink-0 text-yellow-400 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  {open === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5"
                    >
                      <p className="text-white/50 text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact / CTA Section
function ContactSection() {
  const [form, setForm] = useState({ name: "", company: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#0A0A0F] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse, oklch(0.82 0.15 85 / 8%) 0%, transparent 70%)" }} />
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <FadeIn>
            <div className="hero-badge inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Начнём работу
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 1, letterSpacing: "0.02em" }}
              className="text-white mb-4"
            >
              Готовы стать
              <br />
              <span className="text-gold-gradient">вашими супергероями?</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-white/50 text-base font-medium">
              Оставьте заявку — обсудим вашу задачу на бесплатном звонке и предложим решение.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <div className="max-w-lg mx-auto">
            {sent ? (
              <div className="card-hero rounded-xl p-12 text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.03em" }} className="text-white mb-3">
                  Заявка отправлена!
                </h3>
                <p className="text-white/50 text-sm">Мы свяжемся с вами в течение 24 часов.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-hero rounded-xl p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-2">Имя</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Иван Иванов"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-2">Компания</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Название проекта"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/40 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-2">Telegram / Телефон</label>
                  <input
                    type="text"
                    required
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="@username или +7..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-2">Задача</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Расскажите о вашем проекте и задаче..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/40 transition-colors resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full text-center">
                  Отправить заявку
                </button>
                <p className="text-white/25 text-xs text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой обработки данных
                </p>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-white/5 py-10" style={{ background: "#080810" }}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.08em" }} className="text-white">
              gipot<span className="text-gold-gradient">é</span>za
            </span>
            <span className="text-white/20 text-xs font-medium tracking-widest uppercase">agency</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/30">
            <a href="mailto:gipoteza.team@gmail.com" className="hover:text-white/60 transition-colors">
              gipoteza.team@gmail.com
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">Политика обработки данных</a>
            <a href="#" className="hover:text-white/60 transition-colors">Реквизиты</a>
          </div>

          <div className="text-white/20 text-xs">
            © 2025 Гипотеза. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Home component
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Nav />
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <WebinarSection />
      <CasesSection />
      <TeamSection />
      <PointBSection />
      <ValueSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
