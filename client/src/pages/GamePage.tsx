import { useState, useEffect, useRef } from "react";
import { SCENES } from "./GameScenes";

// ─── Asset URLs ───────────────────────────────────────────────────────────────
const CEO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/ceo-art-PobN59gHN7XUMgGNPvnJRJ.webp";
const CMO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/cmo-art-5aiSzDGWARQzz6a7JyHPZ4.webp";

// ─── Typewriter ───────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 14) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false);
    if (!text) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return { out, done };
}

type Screen = "intro" | "game" | "end";

const CARD_COLORS = [
  { bg: "#5c1a12", accent: "#ff6b5b", numBg: "rgba(255,107,91,0.18)", border: "rgba(255,107,91,0.2)" },
  { bg: "#4a2e00", accent: "#f5a623", numBg: "rgba(245,166,35,0.18)", border: "rgba(245,166,35,0.2)" },
  { bg: "#083a1c", accent: "#22c55e", numBg: "rgba(34,197,94,0.18)", border: "rgba(34,197,94,0.2)" },
  { bg: "#220d50", accent: "#a855f7", numBg: "rgba(168,85,247,0.18)", border: "rgba(168,85,247,0.2)" },
];

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  .game-screen { overflow: hidden; }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 60%{transform:translateX(6px)} }
  @keyframes scoreFloat { 0%{opacity:1;transform:translateX(-50%) translateY(0) scale(1.5)} 100%{opacity:0;transform:translateX(-50%) translateY(-100px) scale(0.8)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
  @keyframes comboIn { 0%{transform:scale(0.5) rotate(-10deg);opacity:0} 60%{transform:scale(1.2) rotate(3deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
  .card-btn { border:none;outline:none;cursor:pointer;text-align:left;transition:transform 0.18s,filter 0.18s,box-shadow 0.18s;position:relative; }
  .card-btn:hover:not(:disabled) { transform:translateY(-3px);filter:brightness(1.18);box-shadow:0 8px 32px rgba(0,0,0,0.5); }
  .card-btn:disabled { cursor:not-allowed; }
  .card-btn.selected-good { outline:3px solid #22c55e;outline-offset:-3px; }
  .card-btn.selected-bad  { animation:shake 0.35s ease;outline:3px solid #ff3d2e;outline-offset:-3px; }
  .card-btn.dimmed { opacity:0.35;filter:grayscale(0.6); }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1);border-radius:2px; }
  .form-input { background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#f0ede8;font-family:inherit;font-size:15px;padding:13px 16px;width:100%;outline:none;transition:border-color 0.2s; }
  .form-input:focus { border-color:#ff3d2e; }
  .form-input::placeholder { color:rgba(240,237,232,0.28); }
  .start-btn { background:#ff3d2e;color:#fff;border:none;border-radius:12px;font-family:inherit;font-weight:800;font-size:18px;padding:18px;width:100%;cursor:pointer;transition:all 0.2s;letter-spacing:0.3px; }
  .start-btn:hover { background:#e8261a;transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,61,46,0.4); }
`;

export default function GamePage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [idx, setIdx] = useState(0);
  const [budget, setBudget] = useState(500000);
  const [romi, setRomi] = useState(0);
  const [conv, setConv] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [showRes, setShowRes] = useState(false);
  const [scoreAnim, setScoreAnim] = useState({ val: 0, show: false });
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [journal, setJournal] = useState<Array<{ week: number; choice: string; good: boolean; pts: number }>>([]);
  const [formData, setFormData] = useState({ name: "", niche: "", telegram: "", phone: "" });
  const [formSent, setFormSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [comboAnim, setComboAnim] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  const scene = SCENES[Math.min(idx, SCENES.length - 1)];
  const week = idx + 1;
  const isLast = idx >= SCENES.length - 1;
  const optimalIdx = scene.options.findIndex(o => o.isOptimal);

  const { out: typeOut, done: typeDone } = useTypewriter(
    screen === "game" ? scene.situation : "", 13
  );

  useEffect(() => { setTypingDone(typeDone); }, [typeDone]);
  useEffect(() => { setTypingDone(false); }, [idx]);

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    const opt = scene.options[i];
    const isGood = opt.isOptimal ?? false;
    const newCombo = isGood ? combo + 1 : 0;
    const multiplier = isGood && combo >= 2 ? combo : 1;
    const pts = Math.round(opt.delta.score * multiplier);
    setBudget(b => b + opt.delta.budget);
    setRomi(r => r + opt.delta.romi);
    setConv(c => c + opt.delta.conv);
    setScore(s => s + pts);
    setScoreAnim({ val: pts, show: true });
    setTimeout(() => setScoreAnim(a => ({ ...a, show: false })), 1600);
    setJournal(j => [...j, { week, choice: opt.label, good: isGood, pts }]);
    if (isGood) {
      setCombo(newCombo);
      if (newCombo >= 2) { setComboAnim(true); setTimeout(() => setComboAnim(false), 800); }
    } else {
      setCombo(0);
      setLives(l => Math.max(0, l - 1));
    }
    setShowHint(false);
    try { (window as any).ym(107722529, 'reachGoal', `game_scene_${week}`, { choice: opt.label, good: isGood }); } catch{}
    setTimeout(() => setShowRes(true), 200);
  }

  function next() {
    if (isLast || lives <= 0) { setScreen("end"); try { (window as any).ym(107722529, 'reachGoal', 'game_finish', { score, romi }); } catch{} return; }
    setIdx(i => i + 1); setChosen(null); setShowRes(false);
  }

  function restart() {
    setScreen("intro"); setIdx(0); setBudget(500000); setRomi(0); setConv(0);
    setScore(0); setLives(3); setCombo(0); setChosen(null); setShowRes(false);
    setFormSent(false); setHintsLeft(3); setShowHint(false); setJournal([]);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault(); setFormLoading(true);
    try {
      await fetch("/api/game-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, niche: formData.niche, telegram: formData.telegram, phone: formData.phone, score, romi }),
      });
    } catch { /* ignore */ }
    try { (window as any).ym(107722529, 'reachGoal', 'game_lead_submit'); } catch{}
    setFormSent(true); setFormLoading(false);
  }

  const metrics = [
    { icon: "", iconBg: "#4a1010", label: "Пользователи", value: (12580 + score * 2).toLocaleString("ru"), delta: romi > 0 ? `+${Math.round(romi * 0.4)}%` : "-8%", up: romi > 0, color: "#ff6b5b" },
    { icon: "", iconBg: "#3a2800", label: "Выручка", value: `${((8400000 + Math.max(0, budget - 500000)) / 1000000).toFixed(1)} млн ₽`, delta: budget > 500000 ? `+${Math.round((budget - 500000) / 10000)}%` : "+12%", up: true, color: "#f5a623" },
    { icon: "", iconBg: "#3a1020", label: "NPS", value: String(Math.max(10, 32 + Math.round(conv * 0.5))), delta: conv > 0 ? `+${Math.round(conv * 0.3)}` : "-10", up: conv > 0, color: "#ff6b5b" },
    { icon: "", iconBg: "#3a1e00", label: "Популярность", value: String(Math.min(99, 68 + combo * 3)), delta: combo > 0 ? `+${combo * 3}` : "+5", up: true, color: "#f5a623" },
  ];

  // ─── INTRO ─────────────────────────────────────────────────────────────────
  if (screen === "intro") return (
    <div style={{
      width: "100vw", height: "100vh",
      position: "relative",
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      color: "#f0ede8",
      overflow: "hidden",
    }}>
      <style>{GLOBAL_CSS}</style>

      {/* Full-screen background: CEO left, CMO right */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1008 0%, #110d06 50%, #0d0a06 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 90%, rgba(180,100,20,0.3) 0%, transparent 50%), radial-gradient(ellipse at 75% 20%, rgba(120,60,10,0.18) 0%, transparent 45%)" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: "52%", height: "100%" }}>
        <img src={CEO_IMG} alt="CEO" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
      </div>
      <div style={{ position: "absolute", right: 0, bottom: 0, width: "50%", height: "95%" }}>
        <img src={CMO_IMG} alt="CMO" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
      </div>
      {/* Dark overlay for readability */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,5,0.72) 0%, rgba(10,8,5,0.35) 30%, rgba(10,8,5,0.55) 70%, rgba(10,8,5,0.92) 100%)" }} />

      {/* Content overlay */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "32px 20px 28px", animation: "fadeUp 0.6s ease" }}>

        {/* Top: Logo */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "clamp(42px,7vw,72px)", fontWeight: 900, color: "#fff", lineHeight: 0.9, letterSpacing: -3 }}>
            ЗАПУСК<span style={{ fontSize: "0.18em", verticalAlign: "super", color: "#f5a623" }}>✦</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(240,237,232,0.5)", letterSpacing: 4, marginTop: 8, textTransform: "uppercase" }}>Маркетинговый симулятор для EdTech</div>
        </div>

        {/* Center: CEO/CMO labels */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 11, color: "#f5a623", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", background: "rgba(0,0,0,0.6)", padding: "4px 16px", borderRadius: 20 }}>CEO-Босс</div>
          <div style={{ fontSize: "clamp(36px,6vw,56px)", fontWeight: 900, color: "#ff3d2e", textShadow: "0 0 40px rgba(255,61,46,0.9)", lineHeight: 1 }}>VS</div>
          <div style={{ fontSize: 11, color: "#ff3d2e", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", background: "rgba(0,0,0,0.6)", padding: "4px 16px", borderRadius: 20 }}>Вы — CMO</div>
        </div>

        {/* Bottom: info + button */}
        <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Briefing */}
          <div style={{ background: "rgba(10,8,5,0.82)", backdropFilter: "blur(12px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", padding: "12px 16px" }}>
            <div style={{ fontSize: 10, color: "#ff3d2e", fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 5 }}>Брифинг</div>
            <p style={{ fontSize: 13, color: "#f0ede8", lineHeight: 1.6 }}>
              Ты — CMO онлайн-школы.{" "}
              <span style={{ color: "#ff3d2e", fontWeight: 700 }}>CAC 38 000 ₽ — это провал.</span>{" "}
              <span style={{ color: "#f5a623", fontWeight: 700 }}>500К ₽ бюджета. 7 реальных ситуаций.</span>{" "}
              Каждое решение — реальный кейс российского рынка 2026 года.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {[
              { val: "500К ₽", lbl: "Бюджет", c: "#f5a623" },
              { val: "7", lbl: "Сценариев", c: "#ff3d2e" },
              { val: "3", lbl: "Жизни", c: "#ff6b5b" },
              { val: "3", lbl: "Подсказки", c: "#f5a623" },
            ].map(s => (
              <div key={s.lbl} style={{ background: "rgba(10,8,5,0.75)", backdropFilter: "blur(8px)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", padding: "10px 5px", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: s.c, marginBottom: 3 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(240,237,232,0.45)" }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          <button className="start-btn" onClick={() => { setScreen("game"); try { (window as any).ym(107722529, 'reachGoal', 'game_start'); } catch{} }}>Начать игру</button>
          <div style={{ textAlign: "center", fontSize: 11, color: "rgba(240,237,232,0.25)" }}>
            Powered by <span style={{ color: "#ff3d2e", fontWeight: 700 }}>Гипотеза Agency</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── GAME ──────────────────────────────────────────────────────────────────
  if (screen === "game") {
    const chosenOpt = chosen !== null ? scene.options[chosen] : null;
    const isGood = chosen === optimalIdx;

    return (
      <div className="game-screen" style={{
        width: "100vw", height: "100vh",
        display: "flex", flexDirection: "column",
        background: "#111",
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        color: "#f0ede8",
        overflow: "hidden",
        userSelect: "none",
      }}>
        <style>{GLOBAL_CSS}</style>

        {/* Score float */}
        {scoreAnim.show && (
          <div style={{ position: "fixed", top: "20%", left: "50%", zIndex: 9999, fontSize: 44, fontWeight: 900, color: scoreAnim.val > 0 ? "#22c55e" : "#ff3d2e", animation: "scoreFloat 1.6s ease-out forwards", pointerEvents: "none", textShadow: `0 0 32px ${scoreAnim.val > 0 ? "#22c55e" : "#ff3d2e"}`, whiteSpace: "nowrap" }}>
            {scoreAnim.val > 0 ? `+${scoreAnim.val}` : scoreAnim.val}
          </div>
        )}

        {/* Combo */}
        {comboAnim && (
          <div style={{ position: "fixed", top: "30%", left: "50%", zIndex: 9999, fontSize: 32, fontWeight: 900, color: "#f5a623", animation: "comboIn 0.8s ease-out forwards", pointerEvents: "none", textShadow: "0 0 24px #f5a623", whiteSpace: "nowrap", transform: "translateX(-50%)" }}>
            🔥 COMBO ×{combo + 1}
          </div>
        )}

        {/* ══ TOP BAR ══════════════════════════════════════════════════════════ */}
        <div style={{ height: 76, flexShrink: 0, background: "#1a1a1a", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "stretch" }}>
          {/* Logo */}
          <div style={{ width: 210, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>
              ЗАПУСК<span style={{ color: "#f5a623", fontSize: 11, verticalAlign: "super" }}>✦</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(240,237,232,0.35)", marginTop: 4, lineHeight: 1.4 }}>
              Маркетинговый симулятор<br />для EdTech
            </div>
          </div>

          {/* Metrics */}
          {metrics.map((m) => (
            <div key={m.label} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", borderRight: "1px solid rgba(255,255,255,0.06)", minWidth: 0 }}>
              {m.icon && (
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: m.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                  {m.icon}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, color: "rgba(240,237,232,0.4)", lineHeight: 1, marginBottom: 4, whiteSpace: "nowrap" }}>{m.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "nowrap" }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1, whiteSpace: "nowrap" }}>{m.value}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: m.up ? "#22c55e" : "#ff3d2e", whiteSpace: "nowrap" }}>{m.delta}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Week */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#1a2a3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "rgba(240,237,232,0.5)" }}>Нед</div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(240,237,232,0.4)", lineHeight: 1, marginBottom: 4 }}>Неделя</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{week} / {SCENES.length}</div>
            </div>
          </div>

          {/* Hamburger */}
          <div style={{ width: 68, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <button onClick={() => setShowJournal(v => !v)} style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 16, height: 2, background: "#fff", borderRadius: 1 }} />)}
            </button>
          </div>
        </div>

        {/* ══ MAIN AREA ════════════════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", minHeight: 0 }}>

          {/* ── Left sidebar ── */}
          <div style={{ width: 210, flexShrink: 0, background: "rgba(8,8,8,0.85)", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "14px 13px", display: "flex", flexDirection: "column", gap: 10, zIndex: 20, overflowY: "auto" }}>
            {/* Situation */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)", padding: "12px 13px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ff3d2e", marginBottom: 7 }}>Ситуация</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{scene.crisis ? "⚠️" : "🔥"}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: scene.crisis ? "#ff3d2e" : "#f5a623", animation: scene.crisis ? "pulse 0.8s steps(1) infinite" : "none" }}>
                  {scene.crisis ? "Кризис!" : "Горячая"}
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: "rgba(240,237,232,0.72)", lineHeight: 1.65 }}>
                {typeOut}{!typingDone && <span style={{ animation: "pulse 0.6s steps(1) infinite" }}>|</span>}
              </p>
            </div>

            {/* Metrics */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "rgba(240,237,232,0.35)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 7 }}>Метрики</div>
              <div style={{ fontSize: 11, color: "rgba(240,237,232,0.6)", lineHeight: 1.7 }}>{scene.metrics}</div>
            </div>

            {/* Lives */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "rgba(240,237,232,0.35)", letterSpacing: 1 }}>ЖИЗНИ</span>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ fontSize: 16, opacity: i < lives ? 1 : 0.15 }}>❤️</span>
              ))}
            </div>

            {/* Goal */}
            <div style={{ background: "rgba(255,61,46,0.05)", borderRadius: 10, border: "1px solid rgba(255,61,46,0.12)", padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#ff3d2e", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>
                <span style={{ marginRight: 5 }}>🎯</span>Цель
              </div>
              <div style={{ fontSize: 11.5, color: "#f0ede8", lineHeight: 1.6 }}>
                Снизить CAC до 30К ₽ за 4 недели
              </div>
              <div style={{ marginTop: 8, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (week / SCENES.length) * 100)}%`, background: "#ff3d2e", borderRadius: 2, transition: "width 0.5s ease" }} />
              </div>
            </div>
          </div>

          {/* ── Center: characters ── */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {/* Background */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1008 0%, #110d06 50%, #0d0a06 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 90%, rgba(180,100,20,0.28) 0%, transparent 50%), radial-gradient(ellipse at 75% 20%, rgba(120,60,10,0.18) 0%, transparent 45%)" }} />

            {/* CEO */}
            <div style={{ position: "absolute", left: 0, bottom: 0, width: "52%", height: "100%" }}>
              <img src={CEO_IMG} alt="CEO" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
            </div>
            {/* CMO */}
            <div style={{ position: "absolute", right: 0, bottom: 0, width: "50%", height: "95%" }}>
              <img src={CMO_IMG} alt="CMO" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
            </div>

            {/* Bottom fade */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to top, #0a0a0a, transparent)", pointerEvents: "none" }} />

            {/* CEO speech bubble */}
            {typingDone && chosen === null && (
              <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: "min(420px, 54%)", background: "rgba(14,11,8,0.95)", backdropFilter: "blur(14px)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", padding: "16px 20px", boxShadow: "0 12px 56px rgba(0,0,0,0.75)", animation: "fadeDown 0.4s ease", zIndex: 25 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ff3d2e", marginBottom: 8 }}>CEO</div>
                <div style={{ fontSize: "clamp(15px,1.8vw,21px)", fontWeight: 600, color: "#fff", lineHeight: 1.45, whiteSpace: "pre-line" }}>
                  Мы теряем позиции!{"\n"}Нужно срочно что-то{"\n"}менять. Твои действия?
                </div>
              </div>
            )}

            {/* CEO badge */}
            <div style={{ position: "absolute", bottom: 14, left: "5%", background: "rgba(10,8,6,0.92)", backdropFilter: "blur(8px)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)", padding: "8px 14px", zIndex: 25, animation: "fadeIn 0.5s ease" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f5a623", marginBottom: 3 }}>CEO</div>
              <div style={{ fontSize: 11, color: "rgba(240,237,232,0.48)", display: "flex", alignItems: "center", gap: 5 }}>
                <span>⚡</span><span>Хочет быстрых результатов</span>
              </div>
            </div>

            {/* CMO badge */}
            <div style={{ position: "absolute", bottom: 14, right: "2%", background: "rgba(10,8,6,0.92)", backdropFilter: "blur(8px)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)", padding: "8px 14px", zIndex: 25, animation: "fadeIn 0.5s ease" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>СМО (Вы)</div>
              <div style={{ fontSize: 11, color: "rgba(240,237,232,0.48)", display: "flex", alignItems: "center", gap: 5 }}>
                <span>🧠</span><span>Думает на 3 шага вперёд</span>
              </div>
            </div>
          </div>

          {/* ── Result panel ── */}
          {showRes && chosenOpt && (
            <div style={{ width: 270, flexShrink: 0, background: "rgba(8,8,8,0.97)", borderLeft: "1px solid rgba(255,255,255,0.06)", padding: "14px 13px", display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", zIndex: 20, animation: "slideUp 0.35s ease" }}>
              <div style={{ borderRadius: 10, padding: "12px 13px", background: isGood ? "rgba(34,197,94,0.07)" : "rgba(255,61,46,0.07)", border: `1.5px solid ${isGood ? "rgba(34,197,94,0.3)" : "rgba(255,61,46,0.3)"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                  <span style={{ fontSize: 16 }}>{isGood ? "✅" : "❌"}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#f0ede8" }}>{chosenOpt.label}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(240,237,232,0.8)", lineHeight: 1.7 }}>{chosenOpt.consequence}</p>
                {chosenOpt.trap && (
                  <div style={{ marginTop: 8, padding: "6px 9px", background: "rgba(255,61,46,0.07)", borderRadius: 7, fontSize: 11, color: "#ff3d2e", fontWeight: 600 }}>⚠ {chosenOpt.trap}</div>
                )}
              </div>
              <div style={{ background: "rgba(245,166,35,0.05)", borderRadius: 10, border: "1px solid rgba(245,166,35,0.15)", padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#f5a623", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>💡 Инсайт Гипотезы</div>
                <p style={{ fontSize: 11.5, color: "rgba(240,237,232,0.78)", lineHeight: 1.7 }}>{scene.insight}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { l: "ROMI", v: chosenOpt.delta.romi, s: "%" },
                  { l: "Бюджет", v: Math.round(chosenOpt.delta.budget / 1000), s: "К" },
                  { l: "Конверсия", v: chosenOpt.delta.conv, s: "%" },
                  { l: "Очки", v: chosenOpt.delta.score, s: "" },
                ].map(d => (
                  <div key={d.l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", padding: "8px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(240,237,232,0.38)", marginBottom: 3 }}>{d.l}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: d.v > 0 ? "#22c55e" : d.v < 0 ? "#ff3d2e" : "rgba(240,237,232,0.35)" }}>
                      {d.v > 0 ? "+" : ""}{d.v}{d.s}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={next} style={{ background: "#ff3d2e", color: "#fff", border: "none", borderRadius: 10, fontFamily: "inherit", fontWeight: 700, fontSize: 14, padding: "12px", cursor: "pointer", width: "100%", transition: "all 0.2s" }}>
                {isLast || lives <= 0 ? "▶ Завершить" : "▶ Следующая неделя →"}
              </button>
            </div>
          )}
        </div>

        {/* ══ BOTTOM: question + 4 cards ═══════════════════════════════════════ */}
        {!showRes && typingDone && (
          <div style={{ background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, zIndex: 50, animation: "slideUp 0.4s ease" }}>
            {/* Question */}
            <div style={{ textAlign: "center", fontSize: 15, fontWeight: 600, color: "#f0ede8", padding: "10px 16px 8px" }}>
              Какой шаг вы сделаете?
            </div>

            {/* 4 cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
              {scene.options.map((opt, i) => {
                const cs = CARD_COLORS[i % CARD_COLORS.length];
                const isChosen = chosen === i;
                const isDimmed = chosen !== null && chosen !== i;
                return (
                  <button
                    key={i}
                    className={`card-btn${isChosen && isGood ? " selected-good" : ""}${isChosen && !isGood ? " selected-bad" : ""}${isDimmed ? " dimmed" : ""}`}
                    disabled={chosen !== null}
                    onClick={() => pick(i)}
                    style={{
                      background: cs.bg,
                      padding: "14px 16px 44px",
                      color: "#f0ede8",
                      borderRadius: 0,
                      borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      fontFamily: "inherit",
                    }}
                  >
                    {/* Number + big icon */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: cs.numBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: cs.accent, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: 30 }}>{opt.icon}</span>
                    </div>
                    {/* Title */}
                    <div style={{ fontSize: 15, fontWeight: 700, color: cs.accent, marginBottom: 6, lineHeight: 1.3 }}>
                      {opt.label}
                    </div>
                    {/* Description */}
                    <div style={{ fontSize: 11.5, color: "rgba(240,237,232,0.58)", lineHeight: 1.6 }}>
                      {opt.detail.length > 75 ? opt.detail.slice(0, 75) + "…" : opt.detail}
                    </div>
                    {/* Arrow */}
                    <div style={{ position: "absolute", bottom: 12, right: 12, width: 30, height: 30, borderRadius: "50%", background: cs.numBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: cs.accent, fontWeight: 700 }}>
                      →
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px 10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button onClick={() => setShowJournal(v => !v)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(240,237,232,0.48)", padding: "6px 14px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit" }}>
                📖 Журнал
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {showHint && (
                  <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.22)", borderRadius: 8, padding: "6px 11px", fontSize: 12, color: "#f5a623", maxWidth: 240, animation: "fadeIn 0.3s ease" }}>
                    💡 {scene.insight.slice(0, 85)}…
                  </div>
                )}
                <button
                  onClick={() => { if (hintsLeft > 0 && !showHint) { setHintsLeft(h => h - 1); setShowHint(true); } }}
                  disabled={hintsLeft === 0 || showHint}
                  style={{ background: "transparent", border: "1px solid rgba(245,166,35,0.28)", borderRadius: 8, color: hintsLeft > 0 ? "#f5a623" : "rgba(240,237,232,0.28)", padding: "6px 14px", cursor: hintsLeft > 0 && !showHint ? "pointer" : "not-allowed", fontSize: 13, display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit", opacity: hintsLeft === 0 ? 0.5 : 1 }}
                >
                  Подсказка {hintsLeft}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Journal overlay */}
        {showJournal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowJournal(false)}>
            <div style={{ background: "#1a1a1a", borderRadius: 16, border: "1px solid rgba(255,255,255,0.09)", padding: "22px", maxWidth: 440, width: "90%", maxHeight: "70vh", overflowY: "auto", animation: "fadeUp 0.3s ease", fontFamily: "inherit" }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f0ede8", marginBottom: 14 }}>📖 Журнал решений</div>
              {journal.length === 0 ? (
                <div style={{ fontSize: 14, color: "rgba(240,237,232,0.38)" }}>Решений пока нет</div>
              ) : journal.map((j, i) => (
                <div key={i} style={{ padding: "9px 11px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: `1px solid ${j.good ? "rgba(34,197,94,0.18)" : "rgba(255,61,46,0.18)"}`, marginBottom: 7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <div style={{ fontSize: 10, color: "rgba(240,237,232,0.35)" }}>Неделя {j.week}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: j.pts > 0 ? "#22c55e" : "#ff3d2e" }}>{j.pts > 0 ? `+${j.pts}` : j.pts} очков</div>
                  </div>
                  <div style={{ fontSize: 13, color: j.good ? "#22c55e" : "#ff3d2e", fontWeight: 600 }}>{j.good ? "✅" : "❌"} {j.choice}</div>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "rgba(240,237,232,0.5)" }}>Итого очков</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#f5a623" }}>{score.toLocaleString()}</span>
              </div>
              <button onClick={() => setShowJournal(false)} style={{ marginTop: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, color: "#f0ede8", padding: "8px 18px", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Закрыть</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── END SCREEN ────────────────────────────────────────────────────────────
  const ending = romi > 150
    ? {
        headline: "Эксперт-запуск!",
        emoji: "🏆",
        color: "#22c55e",
        glowColor: "rgba(34,197,94,0.15)",
        rank: "Маркетинг-легенда",
        rankSub: "CEO удвоил бюджет. Тебя зовут на конференцию EdTech Russia 2026",
        insight: "Ты освоил ключевые инструменты онлайн-образования: A/B тест офферов, post-webinar воронки, сегментацию лидов по возражениям и защиту бюджета перед CEO. Именно так работает Гипотеза Agency.",
        ctaTitle: "Хочешь такой ROMI в реальности?",
        ctaText: "Разберём твою воронку бесплатно за 30 минут. Покажем конкретные точки роста.",
        ctaBtn: "▶ Разобрать мою воронку",
        btnBg: "#22c55e", btnColor: "#fff",
      }
    : romi >= 50
    ? {
        headline: "Неплохой результат",
        emoji: "⭐",
        color: "#f5a623",
        glowColor: "rgba(245,166,35,0.15)",
        rank: "Крепкий CMO",
        rankSub: "CEO доволен. Бюджет сохранён. Но конкуренты не спят",
        insight: "Ты принял несколько верных решений, но часть бюджета ушла впустую. Главный рост — в автоматизации воронки и сегментации лидов по типу возражения.",
        ctaTitle: "Хочешь вырасти до ROMI 200%+?",
        ctaText: "Покажем конкретные точки роста твоей воронки. Бесплатный аудит за 30 минут.",
        ctaBtn: "▶ Получить аудит воронки",
        btnBg: "#f5a623", btnColor: "#000",
      }
    : {
        headline: "Провал запуска",
        emoji: "💀",
        color: "#ff3d2e",
        glowColor: "rgba(255,61,46,0.15)",
        rank: "Стажёр маркетинга",
        rankSub: "Бюджет сожжён. CEO требует объяснений.",
        insight: "Главные ошибки: масштабирование без оптимизации воронки и ценовые войны. Нужна система, а не интуиция. Именно это мы строим в Гипотезе.",
        ctaTitle: "Хочешь окупаемый запуск?",
        ctaText: "Покажем как делать запуски с ROMI 200%+ без ценовых войн и слива бюджета.",
        ctaBtn: "▶ Спасти мою воронку",
        btnBg: "#ff3d2e", btnColor: "#fff",
      };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 0%, ${ending.glowColor} 0%, transparent 50%), #0f0f0f`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "32px 16px 48px",
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      color: "#f0ede8",
      overflowY: "auto",
    }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ maxWidth: 580, width: "100%", animation: "fadeUp 0.6s ease" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: "clamp(26px,7vw,50px)", fontWeight: 900, color: ending.color, lineHeight: 1.1, marginBottom: 6 }}>{ending.headline}</div>
          <div style={{ fontSize: 13, color: "rgba(240,237,232,0.38)", letterSpacing: 2, textTransform: "uppercase" }}>Итоги симуляции</div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { l: "Итоговый ROMI", v: `${romi}%`, c: romi > 150 ? "#22c55e" : romi >= 50 ? "#f5a623" : "#ff3d2e" },
            { l: "Остаток бюджета", v: `${(budget / 1000).toFixed(0)}К ₽`, c: budget > 0 ? "#f5a623" : "#ff3d2e" },
            { l: "Конверсия", v: `${Math.max(0, conv).toFixed(1)}%`, c: "#60a5fa" },
            { l: "Итоговый счё", v: score.toLocaleString(), c: "#f5a623" },
          ].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: "18px", textAlign: "center" }}>
  
              <div style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: s.c, marginBottom: 5 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: "rgba(240,237,232,0.4)" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Rank */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, border: `1.5px solid ${ending.color}44`, padding: "16px 18px", marginBottom: 12, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "rgba(240,237,232,0.38)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Ранг CMO</div>
          <div style={{ fontSize: "clamp(16px,4vw,22px)", fontWeight: 800, color: ending.color, marginBottom: 6 }}>{ending.rank}</div>
          <div style={{ fontSize: 13, color: "rgba(240,237,232,0.48)", lineHeight: 1.7 }}>{ending.rankSub}</div>
        </div>

        {/* Insight */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: "14px 16px", marginBottom: 12 }}>
             <div style={{ fontSize: 10, color: ending.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 7 }}>Разбор результата</div>
          <p style={{ fontSize: 13.5, color: "#f0ede8", lineHeight: 1.8 }}>{ending.insight}</p>
        </div>

        {/* CTA form */}
        {!formSent ? (
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, border: `1.5px solid ${ending.color}44`, padding: "18px", marginBottom: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: ending.color, marginBottom: 6 }}>{ending.ctaTitle}</div>
            <div style={{ fontSize: 13, color: "rgba(240,237,232,0.48)", marginBottom: 14, lineHeight: 1.75 }}>{ending.ctaText}</div>
            <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="form-input" placeholder="Имя" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} required />
              <input className="form-input" placeholder="🎯 Ниша / продукт" value={formData.niche} onChange={e => setFormData(f => ({ ...f, niche: e.target.value }))} required />
              <input className="form-input" placeholder="💬 Telegram (@username)" value={formData.telegram} onChange={e => setFormData(f => ({ ...f, telegram: e.target.value }))} />
              <input className="form-input" placeholder="📱 Телефон: +7..." type="tel" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} />
              <button type="submit" disabled={formLoading} style={{ background: ending.btnBg, color: ending.btnColor, border: "none", borderRadius: 10, fontFamily: "inherit", fontWeight: 800, fontSize: 16, padding: "14px", cursor: "pointer", marginTop: 2, opacity: formLoading ? 0.7 : 1, transition: "all 0.2s" }}>
                {formLoading ? "Отправка..." : ending.ctaBtn}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: "rgba(34,197,94,0.06)", borderRadius: 14, border: "1.5px solid rgba(34,197,94,0.22)", padding: "26px", marginBottom: 16, textAlign: "center" }}>

            <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e", marginBottom: 6 }}>Заявка принята!</div>
            <div style={{ fontSize: 14, color: "rgba(240,237,232,0.48)", lineHeight: 1.75 }}>Свяжемся в течение 2 часов. Подготовьте данные по вашей воронке.</div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <button onClick={restart} style={{ flex: 1, background: "#ff3d2e", color: "#fff", border: "none", borderRadius: 10, fontFamily: "inherit", fontWeight: 700, fontSize: 15, padding: "13px", cursor: "pointer", transition: "all 0.2s" }}>Играть снова</button>
          <button onClick={() => window.location.href = "/"} style={{ flex: 1, background: "transparent", color: "#f0ede8", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 10, fontFamily: "inherit", fontWeight: 700, fontSize: 15, padding: "13px", cursor: "pointer", transition: "all 0.2s" }}>На главную</button>
        </div>

        <div style={{ textAlign: "center", fontSize: 12, color: "rgba(240,237,232,0.25)" }}>
          Powered by <span style={{ color: "#ff3d2e", fontWeight: 700 }}>Гипотеза Agency</span>
        </div>
      </div>
    </div>
  );
}
