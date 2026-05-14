import { useState, useEffect, useRef, useCallback } from "react";

// ─── Image URLs ───────────────────────────────────────────────────────────────
const IMGS = {
  ceoNeutral:  "/manus-storage/ceo-neutral_1979d662.png",
  ceoAngry:    "/manus-storage/ceo-angry_e49b7aa1.png",
  ceoHappy:    "/manus-storage/ceo-happy_5deea0a8.png",
  ceoShocked:  "/manus-storage/ceo-shocked_50e45f47.png",
  ceoSarcastic:"/manus-storage/ceo-sarcastic_161f27fe.png",
  cmoFocused:  "/manus-storage/cmo-focused_3166d320.png",
  cmoConfident:"/manus-storage/cmo-confident_276cc8a7.png",
  cmoWorried:  "/manus-storage/cmo-worried_41ee7775.png",
};

// ─── Music Engine ─────────────────────────────────────────────────────────────
function useGameMusic() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const seqRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const beatRef = useRef(0);

  const NOTES = [
    [440, 0.15], [0, 0.05], [494, 0.1], [0, 0.05], [523, 0.2], [0, 0.05],
    [494, 0.1], [0, 0.05], [440, 0.15], [0, 0.1],
    [392, 0.15], [0, 0.05], [440, 0.1], [0, 0.05], [494, 0.2], [0, 0.05],
    [440, 0.1], [0, 0.05], [392, 0.15], [0, 0.1],
    [349, 0.15], [0, 0.05], [392, 0.1], [0, 0.05], [440, 0.2], [0, 0.05],
    [494, 0.1], [0, 0.05], [523, 0.15], [0, 0.1],
    [587, 0.2], [0, 0.05], [523, 0.15], [0, 0.05], [494, 0.1], [0, 0.05],
    [440, 0.1], [0, 0.05], [392, 0.2], [0, 0.15],
  ] as [number, number][];

  const playNote = (ctx: AudioContext, freq: number, dur: number, t: number) => {
    if (freq === 0) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  };

  const startMusic = () => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;
    let t = ctx.currentTime;
    const schedule = () => {
      while (t < ctx.currentTime + 1.5) {
        const [freq, dur] = NOTES[beatRef.current % NOTES.length];
        playNote(ctx, freq, dur, t);
        t += dur;
        beatRef.current++;
      }
      seqRef.current = setTimeout(schedule, 500);
    };
    schedule();
    setPlaying(true);
  };

  const stopMusic = () => {
    if (seqRef.current) clearTimeout(seqRef.current);
    ctxRef.current?.close();
    ctxRef.current = null;
    setPlaying(false);
  };

  const toggle = () => (playing ? stopMusic() : startMusic());
  useEffect(() => () => { if (seqRef.current) clearTimeout(seqRef.current); ctxRef.current?.close(); }, []);
  return { playing, toggle };
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function useTypewriter(text: string, spd = 18) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, spd);
    return () => clearInterval(t);
  }, [text]);
  return { out, done };
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(secs: number, active: boolean, onEnd: () => void) {
  const [left, setLeft] = useState(secs);
  useEffect(() => { setLeft(secs); }, [secs]);
  useEffect(() => {
    if (!active || left <= 0) { if (active && left <= 0) onEnd(); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, active]);
  return left;
}

// ─── Burst particles ──────────────────────────────────────────────────────────
interface Burst { id: number; x: number; y: number; good: boolean }
function Bursts({ list }: { list: Burst[] }) {
  return (
    <>
      {list.map(b => (
        <div key={b.id} style={{ position: "fixed", left: b.x, top: b.y, pointerEvents: "none", zIndex: 9990 }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const d = 30 + Math.random() * 50;
            return (
              <div key={i} style={{
                position: "absolute", width: 7, height: 7, borderRadius: "50%",
                background: b.good ? "#22c55e" : "#ff3d2e",
                boxShadow: `0 0 6px ${b.good ? "#22c55e" : "#ff3d2e"}`,
                animation: "burstOut 0.6s ease-out forwards",
                "--tx": `${Math.cos(a) * d}px`, "--ty": `${Math.sin(a) * d}px`,
              } as React.CSSProperties} />
            );
          })}
        </div>
      ))}
    </>
  );
}

// ─── Progress Steps ───────────────────────────────────────────────────────────
const STEP_ICONS = ["🎯", "📊", "⚡", "🔥", "💡", "🚀", "🏆"];
const STEP_LABELS = ["Воронка", "Доходимость", "Кризис", "Конкурент", "Бюджет", "Масштаб", "Финал"];

function ProgressSteps({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%", padding: "0 4px" }}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              flex: "0 0 auto",
            }}>
              <div style={{
                width: active ? 36 : 28, height: active ? 36 : 28,
                borderRadius: "50%",
                background: done ? "#22c55e" : active ? "#ff3d2e" : "rgba(255,255,255,0.07)",
                border: `2px solid ${done ? "#22c55e" : active ? "#ff3d2e" : "rgba(255,255,255,0.15)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: active ? 16 : 12,
                transition: "all 0.3s ease",
                boxShadow: active ? "0 0 16px rgba(255,61,46,0.5)" : done ? "0 0 10px rgba(34,197,94,0.3)" : "none",
                flexShrink: 0,
              }}>
                {done ? "✓" : STEP_ICONS[i]}
              </div>
              {active && (
                <div style={{ fontSize: 9, color: "#ff3d2e", fontWeight: 700, whiteSpace: "nowrap", letterSpacing: 0.3 }}>
                  {STEP_LABELS[i]}
                </div>
              )}
            </div>
            {i < total - 1 && (
              <div style={{
                flex: 1, height: 2,
                background: done ? "#22c55e" : "rgba(255,255,255,0.08)",
                transition: "background 0.5s ease",
                margin: "0 2px",
                marginBottom: active ? 16 : 0,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Animated metric number ───────────────────────────────────────────────────
function AnimMetric({ value, suffix = "", prefix = "", color }: { value: number; suffix?: string; prefix?: string; color: string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const diff = value - prev.current;
    if (diff === 0) return;
    const steps = 20;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDisplay(Math.round(prev.current + (diff * step) / steps));
      if (step >= steps) { clearInterval(interval); prev.current = value; }
    }, 30);
    return () => clearInterval(interval);
  }, [value]);
  return (
    <span style={{ color, fontWeight: 800, transition: "color 0.3s" }}>
      {prefix}{display > 999 ? `${(display / 1000).toFixed(0)}К` : display}{suffix}
    </span>
  );
}

// ─── CEO Reaction bubble ──────────────────────────────────────────────────────
const CEO_REACTIONS: Record<string, { img: string; text: string; color: string }> = {
  neutral:   { img: IMGS.ceoNeutral,   text: "Жду твоего решения...",           color: "#94a3b8" },
  angry:     { img: IMGS.ceoAngry,     text: "Это что за цифры?! Объясняй!",    color: "#ff3d2e" },
  happy:     { img: IMGS.ceoHappy,     text: "Отлично! Именно так и надо.",     color: "#22c55e" },
  shocked:   { img: IMGS.ceoShocked,   text: "Как это вообще возможно?!",       color: "#f5a623" },
  sarcastic: { img: IMGS.ceoSarcastic, text: "Серьёзно? Это твой план?",        color: "#fb923c" },
  crisis:    { img: IMGS.ceoAngry,     text: "КРИЗИС! Действуй немедленно!",    color: "#ff3d2e" },
};

const CMO_MOODS: Record<string, { img: string; label: string }> = {
  focused:   { img: IMGS.cmoFocused,   label: "Анализирую..." },
  confident: { img: IMGS.cmoConfident, label: "Уверена" },
  worried:   { img: IMGS.cmoWorried,   label: "Под давлением" },
};

// ─── GAME DATA ────────────────────────────────────────────────────────────────
import { SCENES } from "./GameScenes";
import type { Scene } from "./GameScenes";

type Opt = Scene["options"][number];
type Screen = "intro" | "game" | "end";

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  bg: "#0f0f13",
  bgWarm: "#13100e",
  card: "rgba(255,255,255,0.05)",
  cardBorder: "rgba(255,255,255,0.1)",
  text: "#f0ede8",
  muted: "rgba(240,237,232,0.45)",
  red: "#ff3d2e",
  redGlow: "rgba(255,61,46,0.25)",
  green: "#22c55e",
  yellow: "#f5a623",
  blue: "#60a5fa",
  orange: "#fb923c",
  gold: "#f5a623",
};

// ─── CARD COLORS for options ──────────────────────────────────────────────────
const CARD_COLORS = [
  { bg: "rgba(255,61,46,0.12)",  border: "rgba(255,61,46,0.35)",  accent: "#ff3d2e",  num: "rgba(255,61,46,0.2)" },
  { bg: "rgba(245,166,35,0.12)", border: "rgba(245,166,35,0.35)", accent: "#f5a623",  num: "rgba(245,166,35,0.2)" },
  { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.35)",  accent: "#22c55e",  num: "rgba(34,197,94,0.2)" },
  { bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.35)", accent: "#60a5fa",  num: "rgba(96,165,250,0.2)" },
];

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
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [formSent, setFormSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [scoreAnim, setScoreAnim] = useState({ val: 0, show: false });
  const [ceoMood, setCeoMood] = useState<keyof typeof CEO_REACTIONS>("neutral");
  const [cmoMood, setCmoMood] = useState<keyof typeof CMO_MOODS>("focused");
  const burstId = useRef(0);
  const { playing: musicPlaying, toggle: toggleMusic } = useGameMusic();

  const scene = SCENES[Math.min(idx, SCENES.length - 1)];
  const isCrisis = scene?.crisis ?? false;
  const isLast = idx >= SCENES.length - 1;

  const { out: typeOut, done: typeDone } = useTypewriter(
    screen === "game" ? scene.situation : "", 18
  );

  const timerSecs = isCrisis ? 20 : 45;
  const handleTimerEnd = useCallback(() => {
    if (chosen !== null) return;
    const worst = scene.options.reduce((wi, o, i) =>
      o.delta.score < scene.options[wi].delta.score ? i : wi, 0);
    pick(worst, true);
  }, [chosen, scene]);

  const timeLeft = useCountdown(timerSecs, timerOn && screen === "game" && chosen === null, handleTimerEnd);

  useEffect(() => {
    if (screen === "game" && typeDone && chosen === null) {
      setTimerOn(true);
      setCeoMood(isCrisis ? "crisis" : "neutral");
      setCmoMood(isCrisis ? "worried" : "focused");
    } else setTimerOn(false);
  }, [screen, typeDone, chosen, isCrisis]);

  useEffect(() => { setTimerOn(false); }, [idx]);

  function spawnBurst(x: number, y: number, good: boolean) {
    const id = burstId.current++;
    setBursts(b => [...b, { id, x, y, good }]);
    setTimeout(() => setBursts(b => b.filter(p => p.id !== id)), 700);
  }

  function pick(i: number, forced = false) {
    if (chosen !== null) return;
    setChosen(i);
    setTimerOn(false);
    const opt = scene.options[i];
    const isGood = opt.isOptimal;
    const comboMult = isGood ? Math.max(1, combo) : 1;
    const pts = Math.round(opt.delta.score * (isGood ? comboMult : 1));

    setBudget(b => b + opt.delta.budget);
    setRomi(r => r + opt.delta.romi);
    setConv(c => c + opt.delta.conv);
    setScore(s => s + pts);
    setScoreAnim({ val: pts, show: true });
    setTimeout(() => setScoreAnim(a => ({ ...a, show: false })), 1400);

    // CEO reaction
    if (isGood) {
      setCeoMood(combo >= 2 ? "happy" : "happy");
      setCmoMood("confident");
      setCombo(c => c + 1);
    } else {
      setCeoMood(forced ? "shocked" : opt.trap ? "angry" : "sarcastic");
      setCmoMood("worried");
      setCombo(0);
      if (!forced) setLives(l => Math.max(0, l - 1));
    }
    setTimeout(() => setShowRes(true), 200);
  }

  function next() {
    if (isLast || lives <= 0) { setScreen("end"); return; }
    setIdx(i => i + 1);
    setChosen(null);
    setShowRes(false);
    setCeoMood("neutral");
    setCmoMood("focused");
  }

  function restart() {
    setScreen("intro");
    setIdx(0);
    setBudget(500000);
    setRomi(0);
    setConv(0);
    setScore(0);
    setLives(3);
    setCombo(0);
    setChosen(null);
    setShowRes(false);
    setFormSent(false);
    setCeoMood("neutral");
    setCmoMood("focused");
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    try {
      await fetch("/api/game-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, score, romi }),
      });
      setFormSent(true);
    } catch { setFormSent(true); }
    setFormLoading(false);
  }

  const timerPct = (timeLeft / timerSecs) * 100;
  const timerColor = timeLeft <= 5 ? C.red : timeLeft <= 12 ? C.yellow : C.green;
  const diffColor: Record<string, string> = { HARD: C.yellow, EXPERT: C.orange, NIGHTMARE: C.red };

  const css = `
    * { box-sizing: border-box; }
    body { margin: 0; background: ${C.bg}; overflow-x: hidden; font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; }

    @keyframes burstOut { to { transform: translate(var(--tx),var(--ty)) scale(0); opacity:0; } }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideL { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes scoreFloat { 0%{opacity:1;transform:translateX(-50%) translateY(0) scale(1.2)} 100%{opacity:0;transform:translateX(-50%) translateY(-60px) scale(0.8)} }
    @keyframes introSlide { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes characterIn { from{opacity:0;transform:scale(0.9) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(255,61,46,0.3)} 50%{box-shadow:0 0 40px rgba(255,61,46,0.6)} }
    @keyframes warmGlow { 0%,100%{box-shadow:0 0 30px rgba(245,166,35,0.2)} 50%{box-shadow:0 0 50px rgba(245,166,35,0.4)} }
    @keyframes crisisPulse { 0%,100%{border-color:rgba(255,61,46,0.4)} 50%{border-color:rgba(255,61,46,0.9)} }
    @keyframes confetti { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }

    .game-btn {
      background: ${C.red};
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: inherit;
      font-weight: 700;
      font-size: 16px;
      padding: 15px 32px;
      cursor: pointer;
      transition: all 0.2s ease;
      letter-spacing: 0.3px;
    }
    .game-btn:hover { background: #e8261a; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(255,61,46,0.4); }
    .game-btn:active { transform: translateY(0); }
    .game-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .game-btn.secondary {
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.15);
      color: ${C.text};
    }
    .game-btn.secondary:hover { border-color: ${C.red}; color: ${C.red}; background: rgba(255,61,46,0.06); }
    .game-btn.green-btn { background: ${C.green}; }
    .game-btn.green-btn:hover { background: #16a34a; box-shadow: 0 6px 24px rgba(34,197,94,0.4); }
    .game-btn.yellow-btn { background: ${C.yellow}; color: #000; }
    .game-btn.yellow-btn:hover { background: #e09520; box-shadow: 0 6px 24px rgba(245,166,35,0.4); }

    .opt-card {
      border-radius: 14px;
      color: ${C.text};
      font-family: inherit;
      text-align: left;
      width: 100%;
      padding: 18px 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      border: 1.5px solid;
    }
    .opt-card:not(.disabled):hover {
      transform: translateY(-3px);
      filter: brightness(1.1);
    }
    .opt-card:not(.disabled):hover::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.04);
      border-radius: 14px;
    }
    .opt-card.correct { filter: brightness(1.15); }
    .opt-card.wrong { animation: shake 0.4s ease; filter: brightness(0.9); }
    .opt-card.disabled { opacity: 0.45; cursor: not-allowed; }

    .form-input {
      background: rgba(255,255,255,0.06);
      border: 1.5px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      color: ${C.text};
      font-family: inherit;
      font-size: 15px;
      padding: 13px 16px;
      width: 100%;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus { border-color: ${C.red}; background: rgba(255,255,255,0.08); }
    .form-input::placeholder { color: rgba(240,237,232,0.25); }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.bg}; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
  `;

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (screen === "intro") return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 30% 20%, rgba(255,61,46,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(245,166,35,0.06) 0%, transparent 60%), ${C.bg}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "32px 16px", position: "relative", overflow: "hidden",
    }}>
      <style>{css}</style>

      <div style={{
        position: "relative", zIndex: 10, maxWidth: 680, width: "100%",
        display: "flex", flexDirection: "column", alignItems: "center",
        animation: "introSlide 0.7s ease",
      }}>
        {/* Agency label */}
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 4, marginBottom: 20, textTransform: "uppercase", fontWeight: 600 }}>
          Гипотеза Agency · EdTech Simulator
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontSize: "clamp(52px,12vw,88px)", fontWeight: 900, color: C.red, lineHeight: 0.9, letterSpacing: -2 }}>
            ЗАПУСК
          </div>
        </div>
        <div style={{ fontSize: 13, color: C.muted, letterSpacing: 3, marginBottom: 40, textTransform: "uppercase", fontWeight: 500 }}>
          CMO Simulator · Детский EdTech · Россия 2026
        </div>

        {/* Characters showcase */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: 0, marginBottom: 32, width: "100%",
          background: "rgba(255,255,255,0.03)", borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden", position: "relative",
        }}>
          {/* Warm background overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(245,166,35,0.04) 0%, rgba(255,61,46,0.04) 100%)" }} />

          {/* CEO */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px 0", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, color: C.yellow, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
              CEO-Босс
            </div>
            <img
              src={IMGS.ceoNeutral}
              alt="CEO"
              style={{ width: "100%", maxWidth: 200, borderRadius: "12px 12px 0 0", objectFit: "cover", aspectRatio: "3/4", animation: "characterIn 0.8s ease 0.2s both" }}
            />
          </div>

          {/* VS divider */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px 40px", zIndex: 2 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.red, textShadow: "0 0 20px rgba(255,61,46,0.6)" }}>VS</div>
          </div>

          {/* CMO */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px 0", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, color: C.red, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
              Вы — CMO
            </div>
            <img
              src={IMGS.cmoConfident}
              alt="CMO"
              style={{ width: "100%", maxWidth: 200, borderRadius: "12px 12px 0 0", objectFit: "cover", aspectRatio: "3/4", animation: "characterIn 0.8s ease 0.4s both" }}
            />
          </div>
        </div>

        {/* Brief */}
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)", padding: "22px 26px", marginBottom: 24, width: "100%",
        }}>
          <div style={{ fontSize: 11, color: C.red, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Брифинг</div>
          <p style={{ fontSize: 16, color: C.text, lineHeight: 1.75, margin: 0 }}>
            Ты — CMO детской онлайн-школы. Родители — твоя аудитория.
            <span style={{ color: C.red, fontWeight: 700 }}> CAC сейчас 56 000 ₽ — это провал.</span>
            <br /><br />
            <span style={{ color: C.yellow, fontWeight: 700 }}>30 дней. 500К ₽ бюджета. 7 реальных ситуаций.</span>
            <br />Каждое решение — реальный кейс российского рынка 2026 года.
            Таймер давит. CEO злится. Один неверный выбор — теряешь жизнь.
          </p>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28, width: "100%" }}>
          {[
            { icon: "💰", val: "500К ₽", lbl: "Бюджет", c: C.yellow },
            { icon: "⚡", val: "7", lbl: "Сценариев", c: C.red },
            { icon: "❤️", val: "3", lbl: "Жизни", c: C.red },
            { icon: "🔥", val: "×6", lbl: "Макс комбо", c: C.orange },
          ].map(s => (
            <div key={s.lbl} style={{
              background: "rgba(255,255,255,0.04)", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.09)", padding: "14px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.c, marginBottom: 3 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        <button className="game-btn" style={{ fontSize: 18, padding: "18px 56px", marginBottom: 14, width: "100%" }} onClick={() => setScreen("game")}>
          ▶ Начать игру
        </button>

        <div style={{ fontSize: 12, color: C.muted, textAlign: "center" }}>
          Powered by <span style={{ color: C.red, fontWeight: 700 }}>Гипотеза Agency</span>
        </div>
      </div>
    </div>
  );

  // ── GAME ──────────────────────────────────────────────────────────────────
  if (screen === "game") {
    const optIdx = scene.options.findIndex(o => o.isOptimal);
    const chosenOpt = chosen !== null ? scene.options[chosen] : null;
    const isGood = chosen === optIdx;
    const ceo = CEO_REACTIONS[ceoMood];
    const cmo = CMO_MOODS[cmoMood];

    return (
      <div style={{
        minHeight: "100vh",
        background: isCrisis
          ? `radial-gradient(ellipse at 50% 0%, rgba(255,61,46,0.12) 0%, transparent 50%), ${C.bg}`
          : `radial-gradient(ellipse at 30% 30%, rgba(245,166,35,0.05) 0%, transparent 50%), ${C.bg}`,
        display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
        transition: "background 1s ease",
      }}>
        <style>{css}</style>
        <Bursts list={bursts} />

        {/* Score float */}
        {scoreAnim.show && (
          <div style={{
            position: "fixed", top: "18%", left: "50%", zIndex: 9999,
            fontSize: 32, fontWeight: 900,
            color: scoreAnim.val > 0 ? C.green : C.red,
            animation: "scoreFloat 1.4s ease-out forwards",
            pointerEvents: "none",
            textShadow: `0 0 24px ${scoreAnim.val > 0 ? C.green : C.red}`,
          }}>
            {scoreAnim.val > 0 ? `+${scoreAnim.val}` : scoreAnim.val}
          </div>
        )}

        {/* ── TOP BAR ── */}
        <div style={{
          background: "rgba(15,15,19,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${isCrisis ? "rgba(255,61,46,0.5)" : "rgba(255,255,255,0.08)"}`,
          padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          position: "sticky", top: 0, zIndex: 100,
          animation: isCrisis ? "crisisPulse 1s ease-in-out infinite" : "none",
        }}>
          {/* Logo */}
          <div style={{ fontSize: 15, fontWeight: 900, color: C.red, letterSpacing: 1 }}>ЗАПУСК</div>

          {/* Lives */}
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ fontSize: 14, opacity: i < lives ? 1 : 0.12, transition: "opacity 0.3s" }}>❤️</span>
            ))}
          </div>

          {/* Combo */}
          {combo >= 2 && (
            <div style={{ fontSize: 13, fontWeight: 800, color: C.yellow, padding: "2px 8px", background: "rgba(245,166,35,0.12)", borderRadius: 6, border: "1px solid rgba(245,166,35,0.3)" }}>
              ×{combo} 🔥
            </div>
          )}

          <div style={{ flex: 1 }} />

          {/* Metrics in top bar */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>Бюджет</div>
              <AnimMetric value={Math.round(budget / 1000)} suffix="К ₽" color={budget < 80000 ? C.red : C.yellow} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>ROMI</div>
              <AnimMetric value={romi} suffix="%" color={romi >= 100 ? C.green : romi >= 50 ? C.yellow : C.red} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>Очки</div>
              <AnimMetric value={score} color={C.yellow} />
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ fontSize: 10, fontWeight: 700, color: "#000", background: diffColor[scene.difficulty] || C.yellow, padding: "3px 8px", borderRadius: 5, letterSpacing: 0.5 }}>
            {scene.difficulty}
          </div>

          {/* Phase */}
          <div style={{ fontSize: 11, fontWeight: 600, color: isCrisis ? C.red : C.muted, padding: "2px 8px", border: `1px solid ${isCrisis ? "rgba(255,61,46,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 5, animation: isCrisis ? "pulse 1s ease-in-out infinite" : "none" }}>
            {isCrisis ? "⚠ КРИЗИС" : scene.phase}
          </div>

          {/* Music */}
          <button onClick={toggleMusic} style={{ background: musicPlaying ? "rgba(245,166,35,0.1)" : "transparent", border: `1px solid ${musicPlaying ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 6, color: musicPlaying ? C.yellow : C.muted, padding: "4px 10px", cursor: "pointer", fontSize: 14, transition: "all 0.2s" }}>
            {musicPlaying ? "🎵" : "🔇"}
          </button>
        </div>

        {/* ── PROGRESS STEPS ── */}
        <div style={{ padding: "14px 20px 10px", background: "rgba(15,15,19,0.7)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <ProgressSteps current={idx} total={SCENES.length} />
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, maxWidth: 820, margin: "0 auto", width: "100%", padding: "20px 16px 28px", display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 10 }}>

          {/* Scene title */}
          <div style={{ fontSize: "clamp(18px,3.5vw,24px)", fontWeight: 800, color: isCrisis ? C.red : C.text, lineHeight: 1.3, animation: "fadeUp 0.3s ease" }}>
            {isCrisis && <span style={{ animation: "pulse 0.8s steps(1) infinite", marginRight: 8 }}>⚠</span>}
            {scene.title}
          </div>

          {/* ── CHARACTERS + DIALOGUE ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 16, alignItems: "start", animation: "fadeUp 0.4s ease" }}>

            {/* CEO */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 11, color: C.yellow, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>CEO</div>
              <div style={{ position: "relative", width: "100%" }}>
                <img
                  src={ceo.img}
                  alt="CEO"
                  style={{
                    width: "100%", borderRadius: 14, objectFit: "cover", aspectRatio: "3/4",
                    border: `2px solid ${isCrisis ? "rgba(255,61,46,0.5)" : "rgba(255,255,255,0.1)"}`,
                    transition: "all 0.4s ease",
                    animation: isCrisis ? "glowPulse 1.5s ease-in-out infinite" : "none",
                    boxShadow: isCrisis ? "0 0 30px rgba(255,61,46,0.3)" : "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                />
              </div>
              {/* CEO speech bubble */}
              <div style={{
                background: "rgba(255,255,255,0.05)", borderRadius: 10,
                border: `1px solid ${ceo.color}44`,
                padding: "8px 12px", width: "100%",
                fontSize: 12, color: ceo.color, fontWeight: 600, lineHeight: 1.5,
                textAlign: "center",
                transition: "all 0.4s ease",
              }}>
                {ceo.text}
              </div>
            </div>

            {/* Dialogue box */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 16,
              border: `1.5px solid ${isCrisis ? "rgba(255,61,46,0.4)" : "rgba(255,255,255,0.1)"}`,
              padding: "20px 22px",
              boxShadow: isCrisis ? "0 0 32px rgba(255,61,46,0.15)" : "0 8px 32px rgba(0,0,0,0.3)",
              transition: "all 0.4s ease",
              animation: isCrisis ? "crisisPulse 1.5s ease-in-out infinite" : "none",
            }}>
              {isCrisis && (
                <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 12, animation: "pulse 0.8s ease-in-out infinite", letterSpacing: 1 }}>
                  ⚠ КРИЗИСНАЯ СИТУАЦИЯ — РЕШАЙ НЕМЕДЛЕННО
                </div>
              )}

              <div style={{ fontSize: "clamp(14px,2.2vw,16px)", color: C.text, lineHeight: 1.8, fontWeight: 400 }}>
                {typeOut}
                {!typeDone && <span style={{ animation: "pulse 0.6s steps(1) infinite", color: C.red }}>|</span>}
              </div>

              {typeDone && (
                <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, fontSize: 13, color: C.muted, lineHeight: 1.7, animation: "fadeUp 0.4s ease", fontWeight: 500, borderLeft: `3px solid ${C.yellow}` }}>
                  📊 {scene.metrics}
                </div>
              )}

              {/* Timer */}
              {chosen === null && typeDone && (
                <div style={{ marginTop: 14, animation: "fadeUp 0.3s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: isCrisis ? C.red : C.muted, fontWeight: 600 }}>
                      {isCrisis ? "⚠ КРИЗИС — РЕШАЙ БЫСТРО" : "⏱ Время на решение"}
                    </span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: timerColor, animation: timeLeft <= 5 ? "pulse 0.4s steps(1) infinite" : "none" }}>
                      {timeLeft}с
                    </span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${timerPct}%`, height: "100%", background: timerColor, borderRadius: 3, transition: "width 1s linear", boxShadow: `0 0 8px ${timerColor}66` }} />
                  </div>
                </div>
              )}
            </div>

            {/* CMO */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 11, color: C.red, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Вы — CMO</div>
              <div style={{ position: "relative", width: "100%" }}>
                <img
                  src={cmo.img}
                  alt="CMO"
                  style={{
                    width: "100%", borderRadius: 14, objectFit: "cover", aspectRatio: "3/4",
                    border: `2px solid ${showRes ? (isGood ? "rgba(34,197,94,0.5)" : "rgba(255,61,46,0.5)") : "rgba(255,255,255,0.1)"}`,
                    transition: "all 0.4s ease",
                    boxShadow: showRes ? (isGood ? "0 0 30px rgba(34,197,94,0.25)" : "0 0 30px rgba(255,61,46,0.25)") : "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                />
              </div>
              <div style={{
                background: "rgba(255,255,255,0.05)", borderRadius: 10,
                border: `1px solid rgba(255,255,255,0.1)`,
                padding: "8px 12px", width: "100%",
                fontSize: 12, color: C.muted, fontWeight: 600, lineHeight: 1.5,
                textAlign: "center",
              }}>
                {cmo.label}
              </div>
            </div>
          </div>

          {/* ── OPTIONS ── */}
          {!showRes && typeDone && (
            <div style={{ animation: "slideL 0.4s ease" }}>
              <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
                Какой шаг вы сделаете?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {scene.options.map((opt, i) => {
                  const cc = CARD_COLORS[i % CARD_COLORS.length];
                  return (
                    <button
                      key={i}
                      className={`opt-card${chosen !== null ? " disabled" : ""}`}
                      style={{ background: cc.bg, borderColor: cc.border }}
                      onClick={(e) => { spawnBurst(e.clientX, e.clientY, opt.isOptimal ?? false); pick(i); }}
                      disabled={chosen !== null}
                    >
                      {/* Number badge */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: cc.num, border: `1px solid ${cc.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 800, color: cc.accent }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.4 }}>{opt.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4, lineHeight: 1.3 }}>{opt.label}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, paddingLeft: 44 }}>{opt.detail}</div>
                      {opt.delta.budget !== 0 && (
                        <div style={{ marginTop: 10, paddingLeft: 44 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: opt.delta.budget < 0 ? C.red : C.green, padding: "3px 10px", background: opt.delta.budget < 0 ? "rgba(255,61,46,0.12)" : "rgba(34,197,94,0.12)", borderRadius: 6 }}>
                            {opt.delta.budget > 0 ? "+" : ""}{(opt.delta.budget / 1000).toFixed(0)}К ₽
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {showRes && chosenOpt && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              {/* Chosen option */}
              <div style={{
                borderRadius: 14, padding: "18px 20px", marginBottom: 14,
                background: isGood ? "rgba(34,197,94,0.08)" : "rgba(255,61,46,0.08)",
                border: `1.5px solid ${isGood ? "rgba(34,197,94,0.35)" : "rgba(255,61,46,0.35)"}`,
                cursor: "default",
                animation: !isGood ? "shake 0.4s ease" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{isGood ? "✅" : "❌"}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{chosenOpt.label}</span>
                  {combo >= 2 && isGood && (
                    <span style={{ fontSize: 12, color: C.yellow, fontWeight: 700, padding: "2px 10px", background: "rgba(245,166,35,0.12)", borderRadius: 6 }}>
                      КОМБО ×{combo}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 15, color: C.text, lineHeight: 1.75, margin: 0 }}>{chosenOpt.consequence}</p>
                {chosenOpt.trap && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,61,46,0.08)", borderRadius: 8, border: "1px solid rgba(255,61,46,0.2)", fontSize: 13, color: C.red, fontWeight: 600 }}>
                    ⚠ {chosenOpt.trap}
                  </div>
                )}
              </div>

              {/* Insight */}
              <div style={{ background: "rgba(245,166,35,0.06)", borderRadius: 12, border: "1px solid rgba(245,166,35,0.2)", padding: "16px 18px", marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: C.yellow, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                  💡 Инсайт Гипотезы
                </div>
                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, margin: 0 }}>{scene.insight}</p>
              </div>

              {/* Deltas */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                {[
                  { l: "ROMI", v: chosenOpt.delta.romi, s: "%" },
                  { l: "Бюджет", v: chosenOpt.delta.budget / 1000, s: "К" },
                  { l: "Конверсия", v: chosenOpt.delta.conv, s: "%" },
                  { l: "Очки", v: scoreAnim.val || chosenOpt.delta.score, s: "" },
                ].map(d => (
                  <div key={d.l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", padding: "12px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 500 }}>{d.l}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: d.v > 0 ? C.green : d.v < 0 ? C.red : C.muted }}>
                      {d.v > 0 ? "+" : ""}{d.v}{d.s}
                    </div>
                  </div>
                ))}
              </div>

              <button className="game-btn" style={{ width: "100%", fontSize: 16 }} onClick={next}>
                {isLast || lives <= 0 ? "▶ Завершить запуск" : `▶ Следующий день →`}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── END SCREEN ────────────────────────────────────────────────────────────
  const ending = romi > 150
    ? {
        key: "expert",
        headline: "Эксперт-запуск!",
        emoji: "🏆",
        sub: "ROMI выше 150% — ты в топ-5% CMO детского EdTech России",
        color: C.green,
        glowColor: "rgba(34,197,94,0.2)",
        ceoImg: IMGS.ceoHappy,
        cmoImg: IMGS.cmoConfident,
        rank: "🏆 Маркетинг-легенда",
        rankSub: "CEO удвоил бюджет. Тебя зовут на конференцию EdTech Russia 2026",
        insight: "Ты освоил ключевые инструменты детского EdTech: сегментацию родителей, OTO-воронки, Telegram-цепочки и защиту бюджета перед CEO. Именно так работают топовые запуски на российском рынке.",
        ctaTitle: "Хочешь такой ROMI в реальности?",
        ctaText: "Разберём твою воронку бесплатно за 30 минут. Покажем где теряются деньги прямо сейчас — на реальных цифрах.",
        ctaBtn: "▶ Разобрать мою воронку",
        btnClass: "green-btn",
      }
    : romi >= 50
    ? {
        key: "normal",
        headline: "Неплохой результат",
        emoji: "⭐",
        sub: "ROMI 50–150% — выше среднего по рынку, но есть куда расти",
        color: C.yellow,
        glowColor: "rgba(245,166,35,0.2)",
        ceoImg: IMGS.ceoNeutral,
        cmoImg: IMGS.cmoFocused,
        rank: "⭐⭐ Крепкий CMO",
        rankSub: "CEO доволен. Бюджет сохранён. Но конкуренты Учи.ру и Skysmart не спят",
        insight: "Ты принял несколько верных решений, но часть бюджета ушла впустую. В детском EdTech 2026 разница между 100% и 300% ROMI — в точности сегментации и тайминге оффера.",
        ctaTitle: "Хочешь вырасти до ROMI 200%+?",
        ctaText: "Покажем конкретные точки роста в твоей воронке. Бесплатный аудит за 30 минут — только реальные цифры, без воды.",
        ctaBtn: "▶ Получить аудит воронки",
        btnClass: "yellow-btn",
      }
    : {
        key: "fail",
        headline: "Провал запуска",
        emoji: "💀",
        sub: "ROMI ниже 50% — CEO урезал бюджет. Следующий квартал под угрозой",
        color: C.red,
        glowColor: "rgba(255,61,46,0.2)",
        ceoImg: IMGS.ceoAngry,
        cmoImg: IMGS.cmoWorried,
        rank: "💀 Стажёр маркетинга",
        rankSub: "Бюджет сожжён. CEO требует объяснений. Воронка дырявая",
        insight: "Главные ошибки: масштабирование без оптимизации воронки, ценовые войны с Учи.ру и игнорирование сегментации родителей. В детском EdTech каждый неверный шаг стоит 50–150К ₽.",
        ctaTitle: "Хочешь окупаемый запуск?",
        ctaText: "Покажем как делать запуски с ROMI 200%+. На реальных кейсах Гипотезы — без воды. Разберём твою воронку бесплатно.",
        ctaBtn: "▶ Спасти мою воронку",
        btnClass: "",
      };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 0%, ${ending.glowColor} 0%, transparent 50%), ${C.bg}`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "32px 16px", position: "relative", overflow: "hidden",
    }}>
      <style>{css}</style>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 680, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "introSlide 0.6s ease" }}>

        {/* Headline */}
        <div style={{ fontSize: "clamp(28px,7vw,52px)", fontWeight: 900, color: ending.color, marginBottom: 6, textAlign: "center", lineHeight: 1.1 }}>
          {ending.emoji} {ending.headline}
        </div>
        <div style={{ fontSize: 15, color: C.muted, marginBottom: 32, textAlign: "center", fontWeight: 500, maxWidth: 480, lineHeight: 1.65 }}>
          {ending.sub}
        </div>

        {/* Characters */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%", marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 11, color: C.yellow, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>CEO</div>
            <img src={ending.ceoImg} alt="CEO" style={{ width: "100%", borderRadius: 14, objectFit: "cover", aspectRatio: "3/4", border: `2px solid ${ending.color}44`, boxShadow: `0 0 32px ${ending.glowColor}` }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 11, color: C.red, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Вы — CMO</div>
            <img src={ending.cmoImg} alt="CMO" style={{ width: "100%", borderRadius: 14, objectFit: "cover", aspectRatio: "3/4", border: `2px solid ${ending.color}44`, boxShadow: `0 0 32px ${ending.glowColor}` }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, width: "100%", marginBottom: 16 }}>
          {[
            { l: "Итоговый ROMI", v: `${romi}%`, c: romi > 150 ? C.green : romi >= 50 ? C.yellow : C.red, i: "📈" },
            { l: "Остаток бюджета", v: `${(budget / 1000).toFixed(0)}К ₽`, c: C.yellow, i: "💰" },
            { l: "Конверсия", v: `${conv.toFixed(1)}%`, c: C.blue, i: "🎯" },
            { l: "Итоговый счёт", v: score.toLocaleString(), c: C.yellow, i: "⭐" },
          ].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.09)", padding: "18px", textAlign: "center" }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{s.i}</div>
              <div style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: s.c, marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Rank */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, border: `1.5px solid ${ending.color}44`, padding: "20px 22px", marginBottom: 14, width: "100%", textAlign: "center", boxShadow: `0 0 32px ${ending.glowColor}` }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Ранг CMO</div>
          <div style={{ fontSize: "clamp(18px,4vw,26px)", fontWeight: 800, color: ending.color, marginBottom: 8 }}>{ending.rank}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{ending.rankSub}</div>
        </div>

        {/* Insight */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.09)", padding: "18px 20px", marginBottom: 18, width: "100%" }}>
          <div style={{ fontSize: 11, color: ending.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Разбор результата</div>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.8, margin: 0 }}>{ending.insight}</p>
        </div>

        {/* Lead form */}
        {!formSent ? (
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, border: `1.5px solid ${ending.color}44`, padding: "22px", width: "100%", marginBottom: 16, boxShadow: `0 0 32px ${ending.glowColor}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: ending.color, marginBottom: 8 }}>{ending.ctaTitle}</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 18, lineHeight: 1.75 }}>{ending.ctaText}</div>
            <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input className="form-input" placeholder="Имя" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} required />
              <input className="form-input" placeholder="Телефон" type="tel" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} required />
              <input className="form-input" placeholder="Email" type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} required />
              <button className={`game-btn ${ending.btnClass}`} type="submit" style={{ marginTop: 4 }} disabled={formLoading}>
                {formLoading ? "Отправка..." : ending.ctaBtn}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: "rgba(34,197,94,0.07)", borderRadius: 14, border: "1.5px solid rgba(34,197,94,0.25)", padding: "28px", width: "100%", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.green, marginBottom: 8 }}>Заявка принята!</div>
            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>Свяжемся в течение 2 часов.<br />Готовься к разбору воронки.</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, width: "100%", flexWrap: "wrap" }}>
          <button className="game-btn" style={{ flex: 1 }} onClick={restart}>↺ Играть снова</button>
          <button className="game-btn secondary" style={{ flex: 1 }} onClick={() => window.location.href = "https://gipoteza-agency.ru/#cases"}>← Кейсы Гипотезы</button>
        </div>

        <div style={{ marginTop: 20, fontSize: 12, color: C.muted, textAlign: "center" }}>
          Powered by <span style={{ color: C.red, fontWeight: 700 }}>Гипотеза Agency</span>
        </div>
      </div>
    </div>
  );
}
