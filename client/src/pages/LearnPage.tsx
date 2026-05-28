import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.learn-page { font-family:'Inter','Segoe UI',system-ui,sans-serif; background:#0a0805; color:#f0ede8; min-height:100vh; }
.learn-hero { max-width:760px; margin:0 auto; padding:80px 24px 60px; text-align:center; animation:fadeUp 0.6s ease; }
.learn-badge { display:inline-block; background:rgba(255,61,46,0.15); border:1px solid rgba(255,61,46,0.3); color:#ff3d2e; font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:6px 16px; border-radius:100px; margin-bottom:24px; }
.learn-title { font-size:clamp(32px,6vw,58px); font-weight:900; line-height:1.1; margin-bottom:20px; }
.learn-title span { color:#ff3d2e; }
.learn-sub { font-size:18px; color:rgba(240,237,232,0.6); line-height:1.6; max-width:560px; margin:0 auto 40px; }
.learn-form { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:32px; max-width:480px; margin:0 auto; }
.learn-input { background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; color:#f0ede8; font-family:inherit; font-size:15px; padding:14px 18px; width:100%; outline:none; transition:border-color 0.2s; margin-bottom:12px; }
.learn-input:focus { border-color:#ff3d2e; }
.learn-input::placeholder { color:rgba(240,237,232,0.3); }
.learn-btn { background:#ff3d2e; color:#fff; border:none; border-radius:14px; font-family:inherit; font-weight:800; font-size:17px; padding:18px 32px; cursor:pointer; transition:all 0.2s; width:100%; }
.learn-btn:hover:not(:disabled) { background:#e8261a; transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,61,46,0.4); }
.learn-btn:disabled { opacity:0.6; cursor:not-allowed; }
.learn-btn-secondary { background:transparent; color:#ff3d2e; border:1.5px solid rgba(255,61,46,0.4); border-radius:14px; font-family:inherit; font-weight:700; font-size:15px; padding:14px 28px; cursor:pointer; transition:all 0.2s; }
.learn-btn-secondary:hover { border-color:#ff3d2e; background:rgba(255,61,46,0.08); }
.lessons-grid { max-width:760px; margin:0 auto; padding:0 24px 80px; }
.lessons-title { font-size:24px; font-weight:800; margin-bottom:24px; }
.lesson-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:20px 24px; margin-bottom:12px; display:flex; align-items:center; gap:16px; cursor:pointer; transition:all 0.2s; text-decoration:none; color:inherit; }
.lesson-card:hover:not(.locked) { border-color:rgba(255,61,46,0.3); background:rgba(255,61,46,0.04); transform:translateX(4px); }
.lesson-card.locked { opacity:0.5; cursor:default; }
.lesson-card.completed { border-color:rgba(34,197,94,0.3); background:rgba(34,197,94,0.04); }
.lesson-num { width:44px; height:44px; border-radius:12px; background:rgba(255,61,46,0.15); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:#ff3d2e; flex-shrink:0; }
.lesson-card.completed .lesson-num { background:rgba(34,197,94,0.15); color:#22c55e; }
.lesson-card.locked .lesson-num { background:rgba(255,255,255,0.06); color:rgba(240,237,232,0.3); }
.lesson-info { flex:1; }
.lesson-info-title { font-size:16px; font-weight:700; margin-bottom:4px; }
.lesson-info-desc { font-size:13px; color:rgba(240,237,232,0.5); }
.lesson-tag { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:4px 10px; border-radius:100px; flex-shrink:0; }
.tag-free { background:rgba(255,61,46,0.15); color:#ff3d2e; }
.tag-paid { background:rgba(255,255,255,0.06); color:rgba(240,237,232,0.4); }
.tag-done { background:rgba(34,197,94,0.15); color:#22c55e; }
.paywall-banner { background:linear-gradient(135deg,rgba(255,61,46,0.12),rgba(255,61,46,0.04)); border:1px solid rgba(255,61,46,0.25); border-radius:20px; padding:32px; text-align:center; margin:24px 0; }
.paywall-banner h3 { font-size:22px; font-weight:800; margin-bottom:8px; }
.paywall-banner p { color:rgba(240,237,232,0.6); margin-bottom:24px; font-size:15px; }
.error-msg { color:#ff3d2e; font-size:13px; margin-top:8px; text-align:center; }
.progress-bar { height:4px; background:rgba(255,255,255,0.08); border-radius:2px; margin-bottom:32px; overflow:hidden; }
.progress-fill { height:100%; background:#ff3d2e; border-radius:2px; transition:width 0.5s ease; }
`;

const LESSONS = [
  { id: 1, title: "Что такое маркетинг и почему все делают это неправильно", desc: "Котлер, Огилви, Бернбах — что они поняли раньше всех", free: true },
  { id: 2, title: "Контент-маркетинг: смыслы и копирайтинг", desc: "Формула «пиши как говоришь, сокращай вдвое»", free: true },
  { id: 3, title: "Юнит-экономика: считаем деньги любого проекта", desc: "CAC, LTV, ROMI — без этого маркетинг это просто красивые картинки", free: true },
  { id: 4, title: "Что хочет заказчик и как стоить дорого", desc: "Психология клиента, позиционирование, ценообразование", free: false },
  { id: 5, title: "Продающий лендинг с нуля", desc: "Структура, смыслы, CTA — анатомия страницы которая продаёт", free: false },
  { id: 6, title: "Лиды и квалификация: работа с отделом продаж", desc: "MQL, SQL, SLA — как маркетолог и продажник перестают воевать", free: false },
  { id: 7, title: "Вебинарная воронка", desc: "От холодного трафика до оплаты за 7 дней — актуальная схема 2025", free: false },
  { id: 8, title: "Стратегия в маркетинге", desc: "Как думать на год вперёд и не облажаться", free: false },
  { id: 9, title: "Нейросети и вайб-кодинг в маркетинге", desc: "AI-инструменты которые умножают скорость в 10 раз", free: false },
  { id: 10, title: "Итоговый урок: ты маркетолог или ещё нет?", desc: "Финальный тест, сертификат и что делать дальше", free: false },
];

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
        setCompletedLessons(
          data.progress.filter((p: { completed: boolean }) => p.completed).map((p: { lessonId: number }) => p.lessonId)
        );
      } else {
        localStorage.removeItem("course_token");
        setToken(null);
      }
    } catch {}
    setLoadingMe(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Укажите корректный email");
      return;
    }
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
    } catch {
      setError("Ошибка соединения");
    }
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

  return (
    <>
      <style>{CSS}</style>
      <div className="learn-page">
        {!token ? (
          <div className="learn-hero">
            <div className="learn-badge">Бесплатный курс от агентства Гипотеза</div>
            <h1 className="learn-title">
              Маркетинг:<br /><span>инструкция по применению</span>
            </h1>
            <p className="learn-sub">
              10 уроков с практическими заданиями. Первые 3 — бесплатно.
              В стиле Тима Урбана: легко, с юмором и без воды.
            </p>
            <div className="learn-form">
              <form onSubmit={handleRegister}>
                <input
                  className="learn-input"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="learn-input"
                  type="email"
                  placeholder="Email для доступа к курсу"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <p className="error-msg">{error}</p>}
                <button className="learn-btn" type="submit" disabled={loading} style={{ marginTop: "8px" }}>
                  {loading ? "Регистрация..." : "Начать бесплатно →"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="learn-hero" style={{ paddingBottom: "32px" }}>
            <div className="learn-badge">Добро пожаловать на курс</div>
            <h1 className="learn-title" style={{ fontSize: "clamp(24px,4vw,40px)" }}>
              Маркетинг: <span>инструкция по применению</span>
            </h1>
            {loadingMe ? (
              <p style={{ color: "rgba(240,237,232,0.4)", marginTop: "16px" }}>Загрузка...</p>
            ) : (
              <p style={{ color: "rgba(240,237,232,0.5)", marginTop: "12px", fontSize: "14px" }}>
                {completedCount} из {totalAccessible} уроков пройдено
              </p>
            )}
          </div>
        )}

        {token && (
          <div className="lessons-grid">
            {!loadingMe && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            )}

            <div className="lessons-title">Программа курса</div>

            {LESSONS.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isLocked = !lesson.free && !isPaid;
              return (
                <div
                  key={lesson.id}
                  className={`lesson-card${isLocked ? " locked" : ""}${isCompleted ? " completed" : ""}`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="lesson-num">
                    {isCompleted ? "✓" : String(lesson.id).padStart(2, "0")}
                  </div>
                  <div className="lesson-info">
                    <div className="lesson-info-title">{lesson.title}</div>
                    <div className="lesson-info-desc">{lesson.desc}</div>
                  </div>
                  <span className={`lesson-tag ${isCompleted ? "tag-done" : lesson.free ? "tag-free" : "tag-paid"}`}>
                    {isCompleted ? "✓ Готово" : lesson.free ? "Бесплатно" : isLocked ? "🔒" : "Доступно"}
                  </span>
                </div>
              );
            })}

            {!isPaid && (
              <div className="paywall-banner">
                <h3>Открыть все 10 уроков</h3>
                <p>Уроки 4–10 + сертификат от агентства Гипотеза</p>
                <button
                  className="learn-btn"
                  style={{ maxWidth: "320px" }}
                  onClick={() => setLocation("/learn/pay")}
                >
                  Получить полный доступ — 5 000 ₽
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
