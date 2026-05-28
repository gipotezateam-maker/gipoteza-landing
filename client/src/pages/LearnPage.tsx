import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

.lp { font-family:'Inter','Segoe UI',system-ui,sans-serif; background:#0a0a0a; color:#f0ede8; min-height:100vh; }

/* NAV */
.lp-nav { display:flex; align-items:center; justify-content:space-between; padding:20px 32px; border-bottom:1px solid rgba(255,255,255,0.06); position:sticky; top:0; z-index:100; background:rgba(10,10,10,0.95); backdrop-filter:blur(12px); }
.lp-nav-logo { font-size:13px; font-weight:900; letter-spacing:0.15em; text-transform:uppercase; color:#f0ede8; text-decoration:none; }
.lp-nav-logo span { color:#ff3d2e; }
.lp-nav-badge { font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:rgba(240,237,232,0.4); }

/* HERO */
.lp-hero { max-width:900px; margin:0 auto; padding:80px 32px 60px; animation:fadeUp 0.7s ease; }
.lp-eyebrow { display:inline-flex; align-items:center; gap:8px; background:rgba(255,61,46,0.1); border:1px solid rgba(255,61,46,0.25); color:#ff3d2e; font-size:11px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; padding:7px 16px; border-radius:100px; margin-bottom:28px; }
.lp-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:#ff3d2e; animation:pulse 2s infinite; }
.lp-h1 { font-size:clamp(36px,7vw,72px); font-weight:900; line-height:1.05; letter-spacing:-0.03em; margin-bottom:24px; }
.lp-h1 em { font-style:normal; color:#ff3d2e; }
.lp-lead { font-size:clamp(16px,2.2vw,20px); color:rgba(240,237,232,0.6); line-height:1.65; max-width:640px; margin-bottom:48px; }

/* STATS ROW */
.lp-stats { display:flex; gap:0; border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; margin-bottom:60px; }
.lp-stat { flex:1; padding:24px 28px; border-right:1px solid rgba(255,255,255,0.08); }
.lp-stat:last-child { border-right:none; }
.lp-stat-num { font-size:clamp(28px,4vw,40px); font-weight:900; letter-spacing:-0.03em; color:#f0ede8; line-height:1; margin-bottom:6px; }
.lp-stat-num span { color:#ff3d2e; }
.lp-stat-label { font-size:12px; color:rgba(240,237,232,0.4); letter-spacing:0.05em; }
@media(max-width:600px) { .lp-stats { flex-direction:column; } .lp-stat { border-right:none; border-bottom:1px solid rgba(255,255,255,0.08); } .lp-stat:last-child { border-bottom:none; } }

/* STORY SECTION */
.lp-story { max-width:900px; margin:0 auto; padding:0 32px 80px; }
.lp-section-label { font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#ff3d2e; margin-bottom:20px; }
.lp-story-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start; }
@media(max-width:700px) { .lp-story-grid { grid-template-columns:1fr; } }

.lp-story-text h2 { font-size:clamp(24px,4vw,36px); font-weight:900; line-height:1.2; letter-spacing:-0.02em; margin-bottom:20px; }
.lp-story-text h2 em { font-style:normal; color:#ff3d2e; }
.lp-story-text p { font-size:15px; color:rgba(240,237,232,0.65); line-height:1.75; margin-bottom:16px; }
.lp-story-text p strong { color:#f0ede8; font-weight:700; }

.lp-team-cards { display:flex; flex-direction:column; gap:16px; }
.lp-team-card { display:flex; align-items:center; gap:16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:16px 20px; transition:all 0.2s; }
.lp-team-card:hover { border-color:rgba(255,61,46,0.25); background:rgba(255,61,46,0.04); }
.lp-team-photo { width:56px; height:56px; border-radius:12px; object-fit:cover; object-position:center top; flex-shrink:0; }
.lp-team-info-name { font-size:15px; font-weight:800; margin-bottom:3px; }
.lp-team-info-role { font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#ff3d2e; }
.lp-team-info-desc { font-size:12px; color:rgba(240,237,232,0.45); margin-top:4px; line-height:1.4; }

/* WHAT YOU'LL GET */
.lp-benefits { max-width:900px; margin:0 auto; padding:0 32px 80px; }
.lp-benefits-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:24px; }
@media(max-width:700px) { .lp-benefits-grid { grid-template-columns:1fr; } }
.lp-benefit { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:24px; }
.lp-benefit-icon { font-size:28px; margin-bottom:12px; }
.lp-benefit-title { font-size:15px; font-weight:800; margin-bottom:8px; }
.lp-benefit-desc { font-size:13px; color:rgba(240,237,232,0.5); line-height:1.6; }

/* REGISTER FORM */
.lp-register { max-width:900px; margin:0 auto; padding:0 32px 80px; }
.lp-register-box { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:40px; display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:center; }
@media(max-width:700px) { .lp-register-box { grid-template-columns:1fr; gap:24px; } }
.lp-register-text h2 { font-size:clamp(22px,3.5vw,32px); font-weight:900; line-height:1.2; margin-bottom:12px; letter-spacing:-0.02em; }
.lp-register-text h2 em { font-style:normal; color:#ff3d2e; }
.lp-register-text p { font-size:14px; color:rgba(240,237,232,0.5); line-height:1.65; }
.lp-input { background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; color:#f0ede8; font-family:inherit; font-size:15px; padding:14px 18px; width:100%; outline:none; transition:border-color 0.2s; margin-bottom:12px; }
.lp-input:focus { border-color:#ff3d2e; }
.lp-input::placeholder { color:rgba(240,237,232,0.3); }
.lp-btn { background:#ff3d2e; color:#fff; border:none; border-radius:14px; font-family:inherit; font-weight:800; font-size:16px; padding:17px 32px; cursor:pointer; transition:all 0.2s; width:100%; }
.lp-btn:hover:not(:disabled) { background:#e8261a; transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,61,46,0.4); }
.lp-btn:disabled { opacity:0.6; cursor:not-allowed; }
.lp-btn-outline { background:transparent; color:#ff3d2e; border:1.5px solid rgba(255,61,46,0.4); border-radius:14px; font-family:inherit; font-weight:700; font-size:15px; padding:14px 28px; cursor:pointer; transition:all 0.2s; }
.lp-btn-outline:hover { border-color:#ff3d2e; background:rgba(255,61,46,0.08); }
.lp-error { color:#ff3d2e; font-size:13px; margin-top:8px; }

/* LOGGED IN HERO */
.lp-user-hero { max-width:900px; margin:0 auto; padding:60px 32px 40px; animation:fadeUp 0.6s ease; }
.lp-user-greeting { font-size:clamp(24px,4vw,40px); font-weight:900; letter-spacing:-0.02em; margin-bottom:8px; }
.lp-user-greeting em { font-style:normal; color:#ff3d2e; }
.lp-user-sub { font-size:15px; color:rgba(240,237,232,0.5); margin-bottom:32px; }

/* PROGRESS */
.lp-progress-wrap { max-width:900px; margin:0 auto; padding:0 32px; margin-bottom:32px; }
.lp-progress-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.lp-progress-label { font-size:13px; color:rgba(240,237,232,0.5); }
.lp-progress-pct { font-size:13px; font-weight:700; color:#ff3d2e; }
.lp-progress-bar { height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden; }
.lp-progress-fill { height:100%; background:linear-gradient(90deg,#ff3d2e,#ff7a6e); border-radius:3px; transition:width 0.6s ease; }

/* XP BADGE */
.lp-xp-row { display:flex; align-items:center; gap:12px; margin-bottom:32px; }
.lp-xp-badge { display:flex; align-items:center; gap:8px; background:rgba(255,61,46,0.1); border:1px solid rgba(255,61,46,0.2); border-radius:100px; padding:8px 16px; }
.lp-xp-icon { font-size:16px; }
.lp-xp-text { font-size:13px; font-weight:700; color:#ff3d2e; }
.lp-level-badge { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:100px; padding:8px 16px; }
.lp-level-text { font-size:13px; font-weight:700; color:rgba(240,237,232,0.7); }

/* LESSONS */
.lp-lessons { max-width:900px; margin:0 auto; padding:0 32px 80px; }
.lp-lessons-title { font-size:20px; font-weight:800; margin-bottom:20px; }
.lp-lesson-card { display:flex; align-items:center; gap:16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:20px 24px; margin-bottom:10px; cursor:pointer; transition:all 0.2s; text-decoration:none; color:inherit; }
.lp-lesson-card:hover:not(.lp-locked) { border-color:rgba(255,61,46,0.3); background:rgba(255,61,46,0.04); transform:translateX(4px); }
.lp-lesson-card.lp-locked { opacity:0.45; cursor:default; }
.lp-lesson-card.lp-done { border-color:rgba(34,197,94,0.25); background:rgba(34,197,94,0.03); }
.lp-lesson-num { width:48px; height:48px; border-radius:12px; background:rgba(255,61,46,0.12); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:900; color:#ff3d2e; flex-shrink:0; letter-spacing:-0.02em; }
.lp-lesson-card.lp-done .lp-lesson-num { background:rgba(34,197,94,0.12); color:#22c55e; }
.lp-lesson-card.lp-locked .lp-lesson-num { background:rgba(255,255,255,0.05); color:rgba(240,237,232,0.25); }
.lp-lesson-body { flex:1; min-width:0; }
.lp-lesson-title { font-size:15px; font-weight:700; margin-bottom:4px; line-height:1.3; }
.lp-lesson-desc { font-size:12px; color:rgba(240,237,232,0.45); line-height:1.5; }
.lp-lesson-meta { display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0; }
.lp-lesson-tag { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:4px 10px; border-radius:100px; }
.lp-tag-free { background:rgba(255,61,46,0.12); color:#ff3d2e; }
.lp-tag-paid { background:rgba(255,255,255,0.05); color:rgba(240,237,232,0.35); }
.lp-tag-done { background:rgba(34,197,94,0.12); color:#22c55e; }
.lp-lesson-xp { font-size:11px; color:rgba(240,237,232,0.35); font-weight:600; }

/* PAYWALL */
.lp-paywall { background:linear-gradient(135deg,rgba(255,61,46,0.1),rgba(255,61,46,0.03)); border:1px solid rgba(255,61,46,0.2); border-radius:20px; padding:36px; text-align:center; margin:24px 0; }
.lp-paywall h3 { font-size:24px; font-weight:900; margin-bottom:10px; letter-spacing:-0.02em; }
.lp-paywall p { color:rgba(240,237,232,0.55); margin-bottom:24px; font-size:15px; line-height:1.6; }
.lp-paywall-features { display:flex; justify-content:center; gap:24px; margin-bottom:28px; flex-wrap:wrap; }
.lp-paywall-feat { font-size:13px; color:rgba(240,237,232,0.6); display:flex; align-items:center; gap:6px; }
.lp-paywall-feat::before { content:"✓"; color:#22c55e; font-weight:700; }
`;

const LESSONS = [
  { id: 1, title: "Что такое маркетинг и почему все делают это неправильно", desc: "Котлер, Огилви, Бернбах — что они поняли раньше всех", free: true, xp: 100, time: "15 мин" },
  { id: 2, title: "Контент-маркетинг: смыслы, копирайтинг и почему «продающий текст» — это оксюморон", desc: "Как писать так, чтобы люди читали, а не закрывали", free: true, xp: 120, time: "18 мин" },
  { id: 3, title: "Юнит-экономика: считаем деньги любого проекта", desc: "CAC, LTV, ROMI — без этого маркетинг это просто красивые картинки", free: true, xp: 150, time: "20 мин" },
  { id: 4, title: "Что хочет заказчик и как стоить дорого", desc: "Психология клиента, позиционирование, ценообразование", free: false, xp: 150, time: "20 мин" },
  { id: 5, title: "Продающий лендинг с нуля", desc: "Структура, смыслы, CTA — анатомия страницы которая продаёт", free: false, xp: 200, time: "25 мин" },
  { id: 6, title: "Лиды и квалификация: работа с отделом продаж", desc: "MQL, SQL, SLA — как маркетолог и продажник перестают воевать", free: false, xp: 180, time: "22 мин" },
  { id: 7, title: "Вебинарная воронка от А до Я", desc: "От холодного трафика до оплаты за 7 дней — актуальная схема 2025", free: false, xp: 250, time: "30 мин" },
  { id: 8, title: "Стратегия: как думать на год вперёд", desc: "Стратегическое мышление, OKR, приоритеты и как не облажаться", free: false, xp: 200, time: "25 мин" },
  { id: 9, title: "Нейросети и AI-инструменты в маркетинге", desc: "AI-инструменты которые умножают скорость в 10 раз", free: false, xp: 220, time: "28 мин" },
  { id: 10, title: "Итоговый проект: собери свою воронку", desc: "Финальный проект, сертификат и что делать дальше", free: false, xp: 300, time: "35 мин" },
];

const TEAM = [
  {
    name: "Денис Зюлин",
    role: "ОСНОВАТЕЛЬ / СТРАТЕГ",
    desc: "5 лет строит воронки, которые окупаются. Автор курса.",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/denis_30d9c6b7.jpg",
  },
  {
    name: "Алексей Пономарёв",
    role: "ОСНОВАТЕЛЬ / ТРАФИК",
    desc: "Холодный трафик, автоворонки, боты. Знает, где деньги.",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/alexey_68167dc3.jpg",
  },
];

function getLevel(xp: number) {
  if (xp < 200) return { name: "Стажёр", emoji: "🎓", prev: 0, next: 200, color: "#888" };
  if (xp < 500) return { name: "Джун", emoji: "📚", prev: 200, next: 500, color: "#60a5fa" };
  if (xp < 900) return { name: "Мид", emoji: "⚡", prev: 500, next: 900, color: "#a78bfa" };
  if (xp < 1500) return { name: "Сеньор", emoji: "🚀", prev: 900, next: 1500, color: "#f59e0b" };
  return { name: "Директор", emoji: "🏆", prev: 1500, next: 1870, color: "#ff3d2e" };
}

export default function LearnPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loadingMe, setLoadingMe] = useState(false);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("course_token");
    if (saved) {
      setToken(saved);
      loadMe(saved);
    }
  }, []);

  async function loadMe(t: string) {
    setLoadingMe(true);
    try {
      const res = await fetch(`/api/course/me?token=${t}`);
      const data = await res.json();
      if (data.success) {
        setIsPaid(data.student.isPaid);
        const completed = data.progress.filter((p: { completed: boolean }) => p.completed).map((p: { lessonId: number }) => p.lessonId);
        setCompletedLessons(completed);
        const xp = completed.reduce((sum: number, id: number) => {
          const lesson = LESSONS.find(l => l.id === id);
          return sum + (lesson?.xp || 0);
        }, 0);
        setTotalXP(xp);
      } else {
        localStorage.removeItem("course_token");
        setToken(null);
      }
    } catch {}
    setLoadingMe(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Укажите корректный email"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/course/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("course_token", data.token);
        setToken(data.token);
        await loadMe(data.token);
      } else {
        setError(data.message || "Ошибка регистрации");
      }
    } catch { setError("Ошибка соединения"); }
    setLoading(false);
  }

  function handleLessonClick(lesson: typeof LESSONS[0]) {
    if (!token) return;
    if (!lesson.free && !isPaid) return;
    setLocation(`/learn/lesson/${lesson.id}`);
  }

  const completedCount = completedLessons.length;
  const totalAccessible = isPaid ? 10 : 3;
  const progress = Math.round((completedCount / totalAccessible) * 100);
  const level = getLevel(totalXP);

  return (
    <>
      <style>{CSS}</style>
      <div className="lp">
        {/* NAV */}
        <nav className="lp-nav">
          <a href="/" className="lp-nav-logo">ГИПОТ<span>Е</span>ЗА</a>
          <span className="lp-nav-badge">Маркетинг: инструкция по применению</span>
        </nav>

        {!token ? (
          <>
            {/* HERO */}
            <section className="lp-hero">
              <div className="lp-eyebrow">
                <span className="lp-eyebrow-dot" />
                Мини-курс от агентства Гипотеза
              </div>
              <h1 className="lp-h1">
                Маркетинг:<br /><em>инструкция по применению</em>
              </h1>
              <p className="lp-lead">
                10 уроков о том, как работает маркетинг на самом деле. Написали те, кто 5 лет запускает вебинарные воронки — и знает, где деньги теряются. Первые 3 урока бесплатно.
              </p>

              {/* STATS */}
              <div className="lp-stats">
                <div className="lp-stat">
                  <div className="lp-stat-num"><span>5</span> лет</div>
                  <div className="lp-stat-label">только вебинары</div>
                </div>
                <div className="lp-stat">
                  <div className="lp-stat-num"><span>40+</span></div>
                  <div className="lp-stat-label">запущенных воронок</div>
                </div>
                <div className="lp-stat">
                  <div className="lp-stat-num"><span>160%</span></div>
                  <div className="lp-stat-label">ROMI на холодном трафике</div>
                </div>
                <div className="lp-stat">
                  <div className="lp-stat-num"><span>10</span> уроков</div>
                  <div className="lp-stat-label">3 бесплатно</div>
                </div>
              </div>
            </section>

            {/* STORY */}
            <section className="lp-story">
              <div className="lp-section-label">Почему мы это написали</div>
              <div className="lp-story-grid">
                <div className="lp-story-text">
                  <h2>Сапожники,<br />которые <em>сшили сапоги</em></h2>
                  <p>
                    Есть такая поговорка: «Сапожник без сапог». Это про тех, кто помогает другим, но сам ходит босиком.
                  </p>
                  <p>
                    Мы — агентство вебинарных воронок. Пять лет строим маркетинговые системы для EdTech и онлайн-школ. Знаем, где воронка течёт, почему холодный трафик не окупается и как написать сценарий, который не бесит аудиторию.
                  </p>
                  <p>
                    <strong>И вот мы решили сшить сапоги.</strong> Собрали всё, что знаем про маркетинг — в 10 уроков. Без воды, без «5 шагов к успеху», без мотивационных цитат Стива Джобса.
                  </p>
                  <p>
                    Только то, что реально работает. Проверено на 40+ запусках.
                  </p>
                </div>
                <div className="lp-team-cards">
                  {TEAM.map((member) => (
                    <div key={member.name} className="lp-team-card">
                      <img src={member.photo} alt={member.name} className="lp-team-photo" />
                      <div>
                        <div className="lp-team-info-name">{member.name}</div>
                        <div className="lp-team-info-role">{member.role}</div>
                        <div className="lp-team-info-desc">{member.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section className="lp-benefits">
              <div className="lp-section-label">Что внутри</div>
              <div className="lp-benefits-grid">
                <div className="lp-benefit">
                  <div className="lp-benefit-icon">📖</div>
                  <div className="lp-benefit-title">Длинные уроки</div>
                  <div className="lp-benefit-desc">15–35 минут чтения. Не тезисы, а полноценный разбор с примерами из реальных кейсов.</div>
                </div>
                <div className="lp-benefit">
                  <div className="lp-benefit-icon">🛠️</div>
                  <div className="lp-benefit-title">Реальные практики</div>
                  <div className="lp-benefit-desc">Калькуляторы, конструкторы, симуляторы. Не тест на 5 вопросов — а настоящая работа.</div>
                </div>
                <div className="lp-benefit">
                  <div className="lp-benefit-icon">⚡</div>
                  <div className="lp-benefit-title">XP и уровни</div>
                  <div className="lp-benefit-desc">За каждый урок — опыт. От Стажёра до Директора. Плюс сертификат в конце.</div>
                </div>
              </div>
            </section>

            {/* REGISTER */}
            <section className="lp-register">
              <div className="lp-register-box">
                <div className="lp-register-text">
                  <h2>Начни<br /><em>бесплатно</em></h2>
                  <p>
                    Первые 3 урока — без оплаты. Регистрация по email — никакого спама, только доступ к курсу.
                  </p>
                </div>
                <form onSubmit={handleRegister}>
                  <input
                    className="lp-input"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="lp-input"
                    type="email"
                    placeholder="Email для доступа"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error && <p className="lp-error">{error}</p>}
                  <button className="lp-btn" type="submit" disabled={loading} style={{ marginTop: "8px" }}>
                    {loading ? "Регистрация..." : "Начать бесплатно →"}
                  </button>
                </form>
              </div>
            </section>

            {/* LESSON LIST PREVIEW */}
            <section className="lp-lessons">
              <div className="lp-lessons-title">Программа курса</div>
              {LESSONS.map((lesson) => {
                const isLocked = !lesson.free;
                return (
                  <div key={lesson.id} className={`lp-lesson-card${isLocked ? " lp-locked" : ""}`}>
                    <div className="lp-lesson-num">{String(lesson.id).padStart(2, "0")}</div>
                    <div className="lp-lesson-body">
                      <div className="lp-lesson-title">{lesson.title}</div>
                      <div className="lp-lesson-desc">{lesson.desc}</div>
                    </div>
                    <div className="lp-lesson-meta">
                      <span className={`lp-lesson-tag ${lesson.free ? "lp-tag-free" : "lp-tag-paid"}`}>
                        {lesson.free ? "Бесплатно" : "🔒"}
                      </span>
                      <span className="lp-lesson-xp">+{lesson.xp} XP · {lesson.time}</span>
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        ) : (
          <>
            {/* LOGGED IN */}
            <section className="lp-user-hero">
              <h1 className="lp-user-greeting">
                {completedCount === 0 ? "Добро пожаловать" : "С возвращением"} <em>👋</em>
              </h1>
              <p className="lp-user-sub">
                {loadingMe ? "Загрузка..." : `${completedCount} из ${totalAccessible} уроков пройдено`}
              </p>

              {/* XP ROW */}
              {!loadingMe && (
                <div className="lp-xp-row">
                  <div className="lp-xp-badge">
                    <span className="lp-xp-icon">⚡</span>
                    <span className="lp-xp-text">{totalXP} XP</span>
                  </div>
                  <div className="lp-level-badge">
                    <span className="lp-level-text" style={{ color: level.color }}>
                      {level.emoji} {level.name}
                    </span>
                  </div>
                  {level.next < 9999 && (
                    <div className="lp-level-badge" style={{ opacity: 0.6 }}>
                      <span className="lp-level-text" style={{ fontSize: "11px" }}>
                        до следующего: {level.next - totalXP} XP
                      </span>
                    </div>
                  )}
                </div>
              )}
              {/* XP LEVEL PROGRESS */}
              {!loadingMe && level.next < 9999 && (
                <div className="lp-progress-wrap" style={{ marginBottom: "16px" }}>
                  <div className="lp-progress-header">
                    <span className="lp-progress-label" style={{ color: level.color }}>{level.emoji} {level.name}</span>
                    <span className="lp-progress-pct" style={{ color: level.color }}>
                      {Math.round(((totalXP - level.prev) / (level.next - level.prev)) * 100)}%
                    </span>
                  </div>
                  <div className="lp-progress-bar">
                    <div
                      className="lp-progress-fill"
                      style={{
                        width: `${Math.round(((totalXP - level.prev) / (level.next - level.prev)) * 100)}%`,
                        background: `linear-gradient(90deg, ${level.color}, ${level.color}aa)`
                      }}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* PROGRESS */}
            {!loadingMe && (
              <div className="lp-progress-wrap">
                <div className="lp-progress-header">
                  <span className="lp-progress-label">Прогресс</span>
                  <span className="lp-progress-pct">{progress}%</span>
                </div>
                <div className="lp-progress-bar">
                  <div className="lp-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* LESSONS */}
            <section className="lp-lessons">
              <div className="lp-lessons-title">Программа курса</div>

              {LESSONS.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isLocked = !lesson.free && !isPaid;
                return (
                  <div
                    key={lesson.id}
                    className={`lp-lesson-card${isLocked ? " lp-locked" : ""}${isCompleted ? " lp-done" : ""}`}
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <div className="lp-lesson-num">
                      {isCompleted ? "✓" : String(lesson.id).padStart(2, "0")}
                    </div>
                    <div className="lp-lesson-body">
                      <div className="lp-lesson-title">{lesson.title}</div>
                      <div className="lp-lesson-desc">{lesson.desc}</div>
                    </div>
                    <div className="lp-lesson-meta">
                      <span className={`lp-lesson-tag ${isCompleted ? "lp-tag-done" : lesson.free ? "lp-tag-free" : "lp-tag-paid"}`}>
                        {isCompleted ? "✓ Готово" : lesson.free ? "Бесплатно" : isLocked ? "🔒" : "Доступно"}
                      </span>
                      <span className="lp-lesson-xp">+{lesson.xp} XP · {lesson.time}</span>
                    </div>
                  </div>
                );
              })}

              {!isPaid && (
                <div className="lp-paywall">
                  <h3>Открыть все 10 уроков</h3>
                  <p>7 уроков о воронках, лендингах, стратегии и AI-инструментах.<br />Плюс сертификат от агентства Гипотеза.</p>
                  <div className="lp-paywall-features">
                    <span className="lp-paywall-feat">7 уроков с практиками</span>
                    <span className="lp-paywall-feat">Сертификат</span>
                    <span className="lp-paywall-feat">1670 XP</span>
                    <span className="lp-paywall-feat">Доступ навсегда</span>
                  </div>
                  <button
                    className="lp-btn"
                    style={{ maxWidth: "320px", margin: "0 auto", display: "block" }}
                    onClick={() => setLocation("/learn/pay")}
                  >
                    Получить полный доступ — 5 000 ₽
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
