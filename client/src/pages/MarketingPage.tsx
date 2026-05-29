import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useLocation } from "wouter";

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}>
      {children}
    </motion.div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(8px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.3s"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontFamily: "Unbounded, sans-serif", fontSize: 18, fontWeight: 900, letterSpacing: "0.06em", color: "#F5F5F0" }}>
            ГИПОТ<span style={{ color: "#ff3d2e" }}>Е</span>ЗА
          </span>
        </a>
        <a href="#register" style={{ background: "#ff3d2e", color: "#fff", fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 6, textDecoration: "none" }}>
          Начать бесплатно
        </a>
      </div>
    </nav>
  );
}

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

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "14px 16px", color: "#F5F5F0", fontSize: 16, outline: "none", boxSizing: "border-box"
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" style={inputStyle} />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required style={inputStyle} />
      {error && <div style={{ color: "#ef4444", fontSize: 14 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{
        background: loading ? "rgba(255,61,46,0.5)" : "#ff3d2e", color: "#fff", border: "none",
        borderRadius: 10, padding: 16, fontWeight: 700, fontSize: 16, cursor: loading ? "default" : "pointer"
      }}>
        {loading ? "Загрузка..." : "Получить доступ к курсу"}
      </button>
      <div style={{ fontSize: 13, color: "rgba(245,245,240,0.35)", textAlign: "center" }}>
        Без карты. Доступ сразу после регистрации.
      </div>
    </form>
  );
}

export default function MarketingPage() {
  const [salaryView, setSalaryView] = useState<"regular" | "ai">("regular");
  const [openLesson, setOpenLesson] = useState<number | null>(null);

  const lessons = [
    { id: 1, title: "Маркетинг в 2026: что изменилось и почему старые методы не работают", tags: ["AI", "Стратегия"], free: true },
    { id: 2, title: "Как мыслить системно: от задач к стратегии", tags: ["Стратегия"], free: true },
    { id: 3, title: "Юнит-экономика: считай деньги, а не лайки", tags: ["Практика"], free: true },
    { id: 4, title: "AI-инструменты маркетолога: что использовать каждый день", tags: ["AI", "Практика"], free: false },
    { id: 5, title: "Воронки продаж: как строить систему, а не разовые акции", tags: ["Стратегия", "Практика"], free: false },
    { id: 6, title: "Контент-маркетинг с AI: от идеи до публикации за 30 минут", tags: ["AI", "Практика"], free: false },
    { id: 7, title: "Трафик и аналитика: что считать и как принимать решения", tags: ["Практика"], free: false },
    { id: 8, title: "Продуктовый маркетинг: как думать как стратег", tags: ["Стратегия"], free: false },
    { id: 9, title: "Веб-кодинг для маркетолога: лендинги без разработчика", tags: ["AI", "Практика"], free: false },
    { id: 10, title: "Как стать незаменимым: карьерная стратегия маркетолога AI-first", tags: ["Стратегия", "AI"], free: false },
  ];

  // Фото из оригинального сайта gipoteza-agency.ru
  const PHOTO_DENIS = "/manus-storage/denis_a7150bb9.jpg";
  const PHOTO_ALEXEY = "/manus-storage/alexey_8a55e1aa.jpg";

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#F5F5F0", fontFamily: "Inter, sans-serif" }}>
      <Nav />

      {/* ===== ЭКРАН 1 — HERO ===== */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 5% 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <FadeUp>
              <div style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 24 }}>
                Курс от агентства Гипотеза
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.1, marginBottom: 24, fontWeight: 800 }}>
                Маркетологов много.<br />
                <span style={{ color: "#ff3d2e" }}>Настоящих — нет.</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: "#bbb", marginBottom: 32, maxWidth: 520 }}>
                Бесплатный курс для тех, кто хочет мыслить системно, работать с AI и строить маркетинг как стратег — а не как исполнитель задач из 2020 года.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <a href="#register" style={{ display: "inline-block", background: "#ff3d2e", color: "#fff", padding: "16px 40px", fontSize: 16, fontWeight: 600, textDecoration: "none", borderRadius: 6 }}>
                Начать бесплатно
              </a>
            </FadeUp>
            <FadeUp delay={0.4}>
              <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
                <div><span style={{ fontSize: 32, fontWeight: 700, fontFamily: "Unbounded, sans-serif" }}>5</span><br /><span style={{ fontSize: 13, color: "#888" }}>лет на рынке</span></div>
                <div><span style={{ fontSize: 32, fontWeight: 700, fontFamily: "Unbounded, sans-serif" }}>40+</span><br /><span style={{ fontSize: 13, color: "#888" }}>воронок запущено</span></div>
                <div><span style={{ fontSize: 32, fontWeight: 700, fontFamily: "Unbounded, sans-serif" }}>160%</span><br /><span style={{ fontSize: 13, color: "#888" }}>средний ROMI</span></div>
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={0.2} style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <div style={{ width: "48%", aspectRatio: "3/4", borderRadius: 16, overflow: "hidden", background: "#1a1a1a" }}>
              <img src={PHOTO_DENIS} alt="Денис — фаундер Гипотезы" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ width: "48%", aspectRatio: "3/4", borderRadius: 16, overflow: "hidden", background: "#1a1a1a", marginTop: 40 }}>
              <img src={PHOTO_ALEXEY} alt="Алексей — трафик и AI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== ЭКРАН 2 — ВЫЗОВ РЫНКА ===== */}
      <section style={{ padding: "100px 5%", background: "#111" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 60, lineHeight: 1.2 }}>
              Рынок изменился.<br /><span style={{ color: "#ff3d2e" }}>Ты — ещё нет.</span>
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              "AI уже делает работу обычного маркетолога. Таргет, тексты, аналитика — нейросеть справляется быстрее и дешевле.",
              "Маркетологов на рынке — тысячи. Тех, кто понимает систему и мыслит стратегически — десятки.",
              "Обычный маркетолог — 80 000 руб/мес. Продуктовый маркетолог AI-first — 200 000 руб. Разница — в голове, а не в опыте.",
            ].map((text, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 32, borderLeft: "3px solid #ff3d2e", height: "100%" }}>
                  <p style={{ fontSize: 17, lineHeight: 1.7, color: "#ddd", margin: 0 }}>{text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ЭКРАН 3 — САПОЖНИКИ С САПОГАМИ ===== */}
      <section style={{ padding: "100px 5%", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 12, lineHeight: 1.2 }}>
              Нас учат те, кто сам это делает.
            </h2>
            <p style={{ fontSize: 18, color: "#888", marginBottom: 60 }}>Каждый день. Не из учебника — из рабочего процесса.</p>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <FadeUp delay={0.1}>
              <div style={{ background: "#141414", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ aspectRatio: "4/3", overflow: "hidden", background: "#1a1a1a" }}>
                  <img src={PHOTO_DENIS} alt="Денис" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: 32 }}>
                  <h3 style={{ fontFamily: "Unbounded, sans-serif", fontSize: 24, marginBottom: 8 }}>Денис</h3>
                  <p style={{ color: "#ff3d2e", fontSize: 13, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Фаундер Гипотезы</p>
                  <p style={{ color: "#bbb", fontSize: 16, lineHeight: 1.7 }}>
                    5 лет строит воронки. 40+ запусков. 160% средний ROMI. Не рассказывает как надо — показывает как делает. Каждый день.
                  </p>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div style={{ background: "#141414", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ aspectRatio: "4/3", overflow: "hidden", background: "#1a1a1a" }}>
                  <img src={PHOTO_ALEXEY} alt="Алексей" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: 32 }}>
                  <h3 style={{ fontFamily: "Unbounded, sans-serif", fontSize: 24, marginBottom: 8 }}>Алексей</h3>
                  <p style={{ color: "#ff3d2e", fontSize: 13, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Трафик и AI</p>
                  <p style={{ color: "#bbb", fontSize: 16, lineHeight: 1.7 }}>
                    Считает юнит-экономику, настраивает AI-инструменты, масштабирует то, что работает. Знает, как превратить данные в деньги.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.3}>
            <p style={{ textAlign: "center", marginTop: 48, fontSize: 18, color: "#777", fontStyle: "italic" }}>
              Мы не преподаватели. Мы — агентство. Этот курс — наш рабочий процесс, открытый для тебя.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ===== ЭКРАН 4 — ЧТО ТЫ ПОЛУЧИШЬ ===== */}
      <section style={{ padding: "100px 5%", background: "#111" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 60, lineHeight: 1.2 }}>
              Не «знания».<br /><span style={{ color: "#ff3d2e" }}>Систему.</span>
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { num: "01", title: "Системное мышление", desc: "Как строить маркетинг, а не просто запускать рекламу. Стратегия, воронки, метрики — всё в одной голове." },
              { num: "02", title: "AI-first подход", desc: "Нейросети, автоматизация, веб-кодинг — как инструменты каждого дня, а не страшилки из новостей." },
              { num: "03", title: "Продуктовый маркетинг", desc: "Как думать стратегически, считать деньги и принимать решения на основе данных — а не на ощущениях." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div style={{ padding: 32, background: "#0a0a0a", borderRadius: 12 }}>
                  <div style={{ fontSize: 48, fontWeight: 700, color: "#ff3d2e", fontFamily: "Unbounded, sans-serif", marginBottom: 16 }}>{item.num}</div>
                  <h3 style={{ fontSize: 20, marginBottom: 12, fontWeight: 600 }}>{item.title}</h3>
                  <p style={{ color: "#999", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ЭКРАН 5 — КОМУ ПОДОЙДЁТ ===== */}
      <section style={{ padding: "100px 5%", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 60, lineHeight: 1.2 }}>
              Если ты тут — значит, ты уже понял<br />что <span style={{ color: "#ff3d2e" }}>что-то не так.</span>
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { title: "Хочешь войти в маркетинг", desc: "Но не хочешь учиться по учебникам 2015 года. Хочешь сразу в 2026 — с AI, с системой, с пониманием как это работает сейчас." },
              { title: "Уже работаешь маркетологом", desc: "Но чувствуешь, что делаешь руками то, что скоро будет делать нейросеть. Хочешь вырасти из исполнителя в стратега." },
              { title: "Руководишь или основал бизнес", desc: "Хочешь понимать маркетинг системно, а не зависеть от подрядчиков, которые «что-то там настраивают»." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div style={{ background: "#141414", borderRadius: 12, padding: 32, height: "100%" }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>{item.title}</h3>
                  <p style={{ color: "#999", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ЭКРАН 6 — ПРОГРАММА ===== */}
      <section style={{ padding: "100px 5%", background: "#111" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 60, lineHeight: 1.2 }}>
              10 уроков
            </h2>
          </FadeUp>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {lessons.map((lesson) => (
              <FadeUp key={lesson.id} delay={lesson.id * 0.03}>
                <div style={{ background: "#1a1a1a", borderRadius: 8, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenLesson(openLesson === lesson.id ? null : lesson.id)}
                    style={{
                      width: "100%", padding: "20px 24px", background: "none", border: "none", color: "#fff",
                      display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left"
                    }}
                  >
                    <span style={{ fontSize: 14, color: "#ff3d2e", fontWeight: 700, minWidth: 28 }}>{String(lesson.id).padStart(2, "0")}</span>
                    <span style={{ flex: 1, fontSize: 16, fontWeight: 500 }}>{lesson.title}</span>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      {lesson.tags.map((tag) => (
                        <span key={tag} style={{ fontSize: 11, padding: "3px 8px", background: "#333", borderRadius: 4, color: "#aaa" }}>{tag}</span>
                      ))}
                      <span style={{ fontSize: 11, padding: "3px 8px", background: lesson.free ? "#1a3a1a" : "#3a1a1a", borderRadius: 4, color: lesson.free ? "#4f4" : "#f44" }}>
                        {lesson.free ? "Бесплатно" : "Платно"}
                      </span>
                    </div>
                    <span style={{ fontSize: 20, color: "#666", marginLeft: 8 }}>{openLesson === lesson.id ? "\u2212" : "+"}</span>
                  </button>
                  {openLesson === lesson.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ padding: "0 24px 20px 68px", color: "#888", fontSize: 15, lineHeight: 1.7 }}>
                      Практический урок с AI-инструментами. Разбираем реальные кейсы агентства Гипотеза. Домашнее задание с обратной связью.
                    </motion.div>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ЭКРАН 7 — КАЛЬКУЛЯТОР ЗАРПЛАТЫ ===== */}
      <section style={{ padding: "100px 5%", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 60, lineHeight: 1.2 }}>
              Маркетолог vs.<br /><span style={{ color: "#ff3d2e" }}>Маркетолог AI-first</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <button
                onClick={() => setSalaryView("regular")}
                style={{
                  background: salaryView === "regular" ? "#1a1a1a" : "#111",
                  border: salaryView === "regular" ? "2px solid #ff3d2e" : "2px solid #333",
                  borderRadius: 12, padding: 32, cursor: "pointer", textAlign: "left", color: "#fff"
                }}
              >
                <div style={{ fontSize: 13, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Обычный маркетолог</div>
                <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "Unbounded, sans-serif", marginBottom: 20 }}>80 000 руб</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ color: "#888", fontSize: 15 }}>Настраивает таргет руками</span>
                  <span style={{ color: "#888", fontSize: 15 }}>Пишет тексты по шаблонам</span>
                  <span style={{ color: "#888", fontSize: 15 }}>Не считает юнит-экономику</span>
                  <span style={{ color: "#f44", fontSize: 15, marginTop: 8 }}>Заменяем нейросетью</span>
                </div>
              </button>
              <button
                onClick={() => setSalaryView("ai")}
                style={{
                  background: salaryView === "ai" ? "#1a1a1a" : "#111",
                  border: salaryView === "ai" ? "2px solid #ff3d2e" : "2px solid #333",
                  borderRadius: 12, padding: 32, cursor: "pointer", textAlign: "left", color: "#fff"
                }}
              >
                <div style={{ fontSize: 13, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Маркетолог AI-first</div>
                <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "Unbounded, sans-serif", color: "#ff3d2e", marginBottom: 20 }}>200 000 руб</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ color: "#ccc", fontSize: 15 }}>Мыслит системно и стратегически</span>
                  <span style={{ color: "#ccc", fontSize: 15 }}>Использует AI как инструмент</span>
                  <span style={{ color: "#ccc", fontSize: 15 }}>Считает деньги, а не лайки</span>
                  <span style={{ color: "#4f4", fontSize: 15, marginTop: 8 }}>Незаменим</span>
                </div>
              </button>
            </div>
            <p style={{ textAlign: "center", marginTop: 32, fontSize: 18, color: "#888" }}>
              Этот курс — мост из левого столбца в правый.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ===== ЭКРАН 8 — УЗНАЁШЬ СЕБЯ? ===== */}
      <section style={{ padding: "100px 5%", background: "#111" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 60, lineHeight: 1.2 }}>
              Узнаёшь себя?
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              "Знаешь инструменты — но не понимаешь зачем",
              "AI где-то рядом — но ты не знаешь как его использовать в работе",
              "Рынок меняется каждый месяц — а ты учился по курсу 2020 года",
              "Делаешь маркетинг на ощущениях. Без системы. Без стратегии.",
            ].map((pain, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 28, borderLeft: "3px solid #ff3d2e" }}>
                  <p style={{ fontSize: 17, lineHeight: 1.6, color: "#ddd", margin: 0 }}>{pain}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ЭКРАН 9 — ТОЧКА Б ===== */}
      <section style={{ padding: "100px 5%", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 60, lineHeight: 1.2 }}>
              После курса
            </h2>
          </FadeUp>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              "Мыслишь как стратег, а не как исполнитель",
              "AI — твой инструмент, а не угроза",
              "Понимаешь систему — от стратегии до денег",
            ].map((line, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <p style={{ fontSize: 22, color: "#eee", lineHeight: 1.5, margin: 0 }}>{line}</p>
                {i < 2 && <div style={{ height: 1, background: "#333", width: "60%", margin: "16px auto 0" }} />}
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ЭКРАН 10 — CTA ===== */}
      <section id="register" style={{ padding: "100px 5%", background: "#111" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "Unbounded, sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 16, lineHeight: 1.2 }}>
              Хватит читать. Начни.
            </h2>
            <p style={{ fontSize: 24, marginBottom: 40, color: "#888" }}>
              <span style={{ textDecoration: "line-through", color: "#666" }}>5 000 руб</span>{" "}
              <span style={{ color: "#ff3d2e", fontWeight: 700 }}>Бесплатно</span>
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <RegisterForm />
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 5%", borderTop: "1px solid #1a1a1a", textAlign: "center" }}>
        <p style={{ color: "#555", fontSize: 14 }}>Агентство Гипотеза, 2026</p>
      </footer>
    </div>
  );
}
