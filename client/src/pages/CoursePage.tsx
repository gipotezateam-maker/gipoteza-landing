import { useState, useEffect } from "react";

const COURSE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
  .course-page { font-family: 'Inter','Segoe UI',system-ui,sans-serif; background: #0a0805; color: #f0ede8; min-height: 100vh; }
  .course-btn { background: #ff3d2e; color: #fff; border: none; border-radius: 14px; font-family: inherit; font-weight: 800; font-size: 18px; padding: 20px 40px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; width: 100%; }
  .course-btn:hover:not(:disabled) { background: #e8261a; transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255,61,46,0.45); }
  .course-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .course-input { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 12px; color: #f0ede8; font-family: inherit; font-size: 15px; padding: 14px 18px; width: 100%; outline: none; transition: border-color 0.2s; }
  .course-input:focus { border-color: #ff3d2e; }
  .course-input::placeholder { color: rgba(240,237,232,0.3); }
  .module-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px 24px; transition: border-color 0.2s; }
  .module-card:hover { border-color: rgba(255,61,46,0.3); }
  .check-item { display: flex; align-items: flex-start; gap: 12px; }
  .check-icon { width: 22px; height: 22px; background: rgba(255,61,46,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
`;

const MODULES = [
  { num: "01", title: "Аудит воронки за 30 минут", desc: "Находим узкие места: где теряются деньги и почему конверсия ниже рынка" },
  { num: "02", title: "Трафик и CAC", desc: "Как снизить стоимость привлечения клиента на 20–40% без увеличения бюджета" },
  { num: "03", title: "Вебинарная воронка 2026", desc: "Актуальная схема: от холодного трафика до оплаты за 7 дней" },
  { num: "04", title: "Дожим и автоворонка", desc: "Сегментация базы по возражениям, серия писем и сценарии закрытия" },
  { num: "05", title: "Метрики и аналитика", desc: "ROMI, NPS, LTV — что считать, как интерпретировать и что делать с цифрами" },
];

const BONUSES = [
  "Шаблон аудита воронки (Google Таблица)",
  "Чек-лист запуска вебинара на 380+ участников",
  "Разбор 3 реальных кейсов Гипотезы",
];

export default function CoursePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"" | "success" | "fail">("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("status");
    if (s === "success" || s === "fail") setStatus(s);
  }, []);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Пожалуйста, заполните имя и email");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/tinkoff/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json() as { success: boolean; paymentUrl?: string; message?: string };
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.message || "Ошибка при создании платежа. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="course-page">
      <style>{COURSE_CSS}</style>

      {/* NAV */}
      <nav style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" style={{ textDecoration: "none", color: "#f0ede8", fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>
          <span style={{ color: "#ff3d2e" }}>ГИПОТ</span>ЕЗА
        </a>
        <a href="/game" style={{ color: "rgba(240,237,232,0.5)", fontSize: 13, textDecoration: "none" }}>← Сыграть в симулятор</a>
      </nav>

      {/* STATUS BANNERS */}
      {status === "success" && (
        <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 14, margin: "24px auto", maxWidth: 680, padding: "20px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#22c55e" }}>Оплата прошла успешно!</div>
          <div style={{ color: "rgba(240,237,232,0.7)", marginTop: 8 }}>Доступ к курсу придёт на вашу почту в течение 10 минут.</div>
        </div>
      )}
      {status === "fail" && (
        <div style={{ background: "rgba(255,61,46,0.1)", border: "1px solid rgba(255,61,46,0.3)", borderRadius: 14, margin: "24px auto", maxWidth: 680, padding: "20px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>😔</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#ff6b5b" }}>Платёж не прошёл</div>
          <div style={{ color: "rgba(240,237,232,0.7)", marginTop: 8 }}>Попробуйте ещё раз или напишите нам в Telegram.</div>
        </div>
      )}

      {/* HERO */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 40px", animation: "fadeUp 0.6s ease" }}>
        <div style={{ display: "inline-block", background: "rgba(255,61,46,0.12)", border: "1px solid rgba(255,61,46,0.25)", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "#ff6b5b", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
          Мини-курс · Тест
        </div>
        <h1 style={{ fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 20 }}>
          Маркетинг<br />
          <span style={{ color: "#ff3d2e" }}>EdTech-школы</span><br />
          с нуля до системы
        </h1>
        <p style={{ fontSize: 18, color: "rgba(240,237,232,0.65)", lineHeight: 1.6, maxWidth: 560, marginBottom: 32 }}>
          5 модулей. 3 часа практики. Реальные инструменты, которые Гипотеза использует в запусках на 8–50 млн ₽.
        </p>

        {/* PRICE BADGE */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#f5a623" }}>990 ₽</div>
          <div>
            <div style={{ textDecoration: "line-through", color: "rgba(240,237,232,0.3)", fontSize: 18 }}>4 900 ₽</div>
            <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 700 }}>Тестовая цена — скоро вырастет</div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 48 }}>
          {[
            { val: "5", label: "модулей" },
            { val: "3 ч", label: "практики" },
            { val: "∞", label: "доступ навсегда" },
          ].map(s => (
            <div key={s.val} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#ff3d2e" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "rgba(240,237,232,0.5)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 48px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>Программа курса</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MODULES.map(m => (
            <div key={m.num} className="module-card">
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontSize: 11, color: "#ff3d2e", fontWeight: 900, letterSpacing: 1, minWidth: 28, paddingTop: 3 }}>{m.num}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 14, color: "rgba(240,237,232,0.55)", lineHeight: 1.5 }}>{m.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BONUSES */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 48px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>Бонусы</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {BONUSES.map(b => (
            <div key={b} className="check-item">
              <div className="check-icon">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#ff3d2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.5, paddingTop: 1 }}>{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT FORM */}
      <section id="buy" style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "36px 32px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>Купить курс</h2>
          <p style={{ fontSize: 14, color: "rgba(240,237,232,0.5)", marginBottom: 28 }}>Оплата через Т-Кассу. Безопасно, быстро.</p>

          <form onSubmit={handlePay} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              className="course-input"
              type="text"
              placeholder="Ваше имя *"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              className="course-input"
              type="email"
              placeholder="Email для доступа *"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="course-input"
              type="tel"
              placeholder="Телефон (необязательно)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />

            {error && (
              <div style={{ color: "#ff6b5b", fontSize: 13, padding: "10px 14px", background: "rgba(255,61,46,0.08)", borderRadius: 8 }}>
                {error}
              </div>
            )}

            <button className="course-btn" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? "Создаём платёж..." : "Оплатить 990 ₽"}
            </button>

            <div style={{ textAlign: "center", fontSize: 12, color: "rgba(240,237,232,0.3)", lineHeight: 1.5 }}>
              Нажимая кнопку, вы соглашаетесь с{" "}
              <a href="/offer" style={{ color: "rgba(240,237,232,0.5)" }}>офертой</a>.
              Оплата через Т-Кассу — защищена 3D Secure.
            </div>
          </form>
        </div>

        {/* TEST MODE NOTICE */}
        <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 10, fontSize: 12, color: "rgba(245,166,35,0.8)", textAlign: "center" }}>
          ⚠️ Тестовый режим — реальные деньги не списываются. Для теста используйте карту 4300000000000777, CVV 111, любой срок.
        </div>
      </section>
    </div>
  );
}
