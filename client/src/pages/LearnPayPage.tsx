import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.pay-page { font-family:'Inter','Segoe UI',system-ui,sans-serif; background:#0a0805; color:#f0ede8; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px 24px; }
.pay-card { max-width:520px; width:100%; animation:fadeUp 0.5s ease; }
.pay-badge { display:inline-block; background:rgba(255,61,46,0.15); border:1px solid rgba(255,61,46,0.3); color:#ff3d2e; font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:6px 16px; border-radius:100px; margin-bottom:24px; }
.pay-title { font-size:clamp(28px,5vw,44px); font-weight:900; line-height:1.15; margin-bottom:16px; }
.pay-title span { color:#ff3d2e; }
.pay-price { font-size:48px; font-weight:900; margin:24px 0 8px; }
.pay-price span { font-size:20px; color:rgba(240,237,232,0.5); font-weight:400; }
.pay-features { list-style:none; margin:24px 0 32px; }
.pay-features li { display:flex; align-items:center; gap:10px; font-size:15px; color:rgba(240,237,232,0.8); margin-bottom:12px; }
.pay-features li::before { content:"✓"; color:#22c55e; font-weight:700; flex-shrink:0; }
.pay-form { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:28px; }
.pay-input { background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; color:#f0ede8; font-family:inherit; font-size:15px; padding:14px 18px; width:100%; outline:none; transition:border-color 0.2s; margin-bottom:12px; }
.pay-input:focus { border-color:#ff3d2e; }
.pay-input::placeholder { color:rgba(240,237,232,0.3); }
.pay-btn { background:#ff3d2e; color:#fff; border:none; border-radius:14px; font-family:inherit; font-weight:800; font-size:17px; padding:18px 32px; cursor:pointer; transition:all 0.2s; width:100%; }
.pay-btn:hover:not(:disabled) { background:#e8261a; transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,61,46,0.4); }
.pay-btn:disabled { opacity:0.6; cursor:not-allowed; }
.pay-note { font-size:12px; color:rgba(240,237,232,0.35); text-align:center; margin-top:12px; }
.error-msg { color:#ff3d2e; font-size:13px; margin-bottom:12px; text-align:center; }
.back-btn { background:none; border:none; color:rgba(240,237,232,0.5); cursor:pointer; font-size:14px; font-family:inherit; display:flex; align-items:center; gap:6px; transition:color 0.2s; padding:0; margin-bottom:32px; }
.back-btn:hover { color:#f0ede8; }
`;

export default function LearnPayPage() {
  const [, setLocation] = useLocation();
  const [token] = useState(() => localStorage.getItem("course_token"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setLocation("/learn"); return; }
    fetch(`/api/course/me?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) { setLocation("/learn"); return; }
        if (data.student.isPaid) { setLocation("/learn"); return; }
        setEmail(data.student.email || "");
        setName(data.student.name || "");
      });
  }, []);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) { setError("Заполните имя и email"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/course/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, email, phone }),
      });
      const data = await res.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.message || "Ошибка при создании платежа");
      }
    } catch {
      setError("Ошибка соединения");
    }
    setLoading(false);
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="pay-page">
        <div className="pay-card">
          <button className="back-btn" onClick={() => setLocation("/learn")}>
            ← Назад к курсу
          </button>
          <div className="pay-badge">Полный доступ</div>
          <h1 className="pay-title">
            Маркетинг: <span>все 10 уроков</span>
          </h1>
          <ul className="pay-features">
            <li>Уроки 4–10 с практическими заданиями</li>
            <li>Юнит-экономика, лендинги, воронки</li>
            <li>Нейросети и вайб-кодинг в маркетинге</li>
            <li>Итоговый тест и сертификат от агентства Гипотеза</li>
            <li>Доступ навсегда</li>
          </ul>
          <div className="pay-price">5 000 ₽ <span>единоразово</span></div>

          <div className="pay-form">
            <form onSubmit={handlePay}>
              <input className="pay-input" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className="pay-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input className="pay-input" type="tel" placeholder="Телефон (необязательно)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              {error && <p className="error-msg">{error}</p>}
              <button className="pay-btn" type="submit" disabled={loading}>
                {loading ? "Создаём платёж..." : "Оплатить 5 000 ₽ →"}
              </button>
            </form>
            <p className="pay-note">Оплата через Т-Кассу — защищена 3D Secure</p>
          </div>
        </div>
      </div>
    </>
  );
}
