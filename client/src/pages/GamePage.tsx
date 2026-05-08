import { useState, useEffect, useRef } from "react";

// ─── Pixel font via Google Fonts (Press Start 2P) ───────────────────────────
const PIXEL_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";

// ─── Color palette (brand) ───────────────────────────────────────────────────
const C = {
  bg: "#0a0a0a",
  card: "#1a1a1a",
  border: "#2a2a2a",
  red: "#ff2d20",
  redDark: "#c41f14",
  text: "#f5f5f0",
  muted: "rgba(245,245,240,0.45)",
  white: "#ffffff",
};

// ─── Game data ────────────────────────────────────────────────────────────────
interface Decision {
  day: number;
  situation: string;
  hint: string; // what Гипотеза would do
  options: { label: string; icon: string; delta: { romi: number; budget: number; conversion: number } }[];
  correctIndex: number; // index of best answer
  insight: string; // shown after choice
}

const DECISIONS: Decision[] = [
  {
    day: 3,
    situation: "Лендинг вебинара запущен. CR в регистрацию — 8%. Цель — 25%.",
    hint: "Гипотеза меняет оффер и заголовок лендинга",
    options: [
      { label: "Увеличить бюджет на трафик", icon: "💸", delta: { romi: -10, budget: -80000, conversion: 2 } },
      { label: "Переписать оффер лендинга", icon: "✏️", delta: { romi: 25, budget: -15000, conversion: 14 } },
      { label: "Подождать — само улучшится", icon: "⏳", delta: { romi: -20, budget: 0, conversion: -2 } },
    ],
    correctIndex: 1,
    insight: "Правильно! Оффер — это ядро воронки. Мы переписываем его первым делом. Конверсия выросла с 8% до 22%.",
  },
  {
    day: 8,
    situation: "Зарегистрировалось 500 человек. Доходимость на вебинар — 12%. Норма — 30%+.",
    hint: "Гипотеза запускает дожимную цепочку в мессенджерах",
    options: [
      { label: "Дожимная цепочка в мессенджерах", icon: "📲", delta: { romi: 35, budget: -20000, conversion: 18 } },
      { label: "Напомнить только по email", icon: "📧", delta: { romi: 5, budget: -5000, conversion: 5 } },
      { label: "Ничего не делать", icon: "🤷", delta: { romi: -15, budget: 0, conversion: -3 } },
    ],
    correctIndex: 0,
    insight: "Верно! Мессенджеры дают open rate 80%+ против 20% у email. Доходимость выросла до 34%.",
  },
  {
    day: 14,
    situation: "Вебинар прошёл. Конверсия в продажу — 1.5%. Хотим 8%+.",
    hint: "Гипотеза добавляет OTO сразу после вебинара",
    options: [
      { label: "Добавить OTO (дешёвый продукт)", icon: "🎁", delta: { romi: 45, budget: -10000, conversion: 20 } },
      { label: "Поднять цену флагмана", icon: "💰", delta: { romi: -25, budget: 0, conversion: -8 } },
      { label: "Запустить ретаргетинг", icon: "🎯", delta: { romi: 10, budget: -40000, conversion: 4 } },
    ],
    correctIndex: 0,
    insight: "Отлично! OTO окупает трафик и прогревает аудиторию к флагману. Конверсия в покупку выросла до 7.8%.",
  },
  {
    day: 20,
    situation: "Продажи идут, но 60% лидов говорят «подумаю». Дожим слабый.",
    hint: "Гипотеза строит автоворонку дожима с серией касаний",
    options: [
      { label: "Автоворонка: серия из 7 касаний", icon: "🔄", delta: { romi: 40, budget: -25000, conversion: 15 } },
      { label: "Скидка 30% всем «думающим»", icon: "🏷️", delta: { romi: -20, budget: -10000, conversion: 8 } },
      { label: "Позвонить каждому вручную", icon: "📞", delta: { romi: 5, budget: -50000, conversion: 6 } },
    ],
    correctIndex: 0,
    insight: "Правильно! Автоворонка работает 24/7 без затрат на команду. Ещё +15% к продажам без скидок.",
  },
  {
    day: 27,
    situation: "Запуск почти завершён. Нужно проанализировать результаты для CEO.",
    hint: "Гипотеза готовит дашборд с ключевыми метриками воронки",
    options: [
      { label: "Дашборд с метриками воронки", icon: "📊", delta: { romi: 20, budget: -5000, conversion: 5 } },
      { label: "Рассказать устно на встрече", icon: "🗣️", delta: { romi: -5, budget: 0, conversion: 0 } },
      { label: "Отправить таблицу Excel", icon: "📋", delta: { romi: 0, budget: 0, conversion: 2 } },
    ],
    correctIndex: 0,
    insight: "Данные — это язык CEO. Дашборд с ROMI, конверсиями и динамикой = доверие и следующий бюджет.",
  },
];

// ─── 8-bit pixel art CMO character (SVG) ─────────────────────────────────────
const CMO_IDLE = `
<svg width="64" height="80" viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- head -->
  <rect x="5" y="0" width="6" height="6" fill="#c8956c"/>
  <!-- hair -->
  <rect x="5" y="0" width="6" height="1" fill="#3a2a1a"/>
  <rect x="5" y="1" width="1" height="1" fill="#3a2a1a"/>
  <rect x="10" y="1" width="1" height="1" fill="#3a2a1a"/>
  <!-- eyes -->
  <rect x="6" y="2" width="1" height="1" fill="#1a1a1a"/>
  <rect x="9" y="2" width="1" height="1" fill="#1a1a1a"/>
  <!-- mouth -->
  <rect x="7" y="4" width="2" height="1" fill="#8b4513"/>
  <!-- neck -->
  <rect x="7" y="6" width="2" height="1" fill="#c8956c"/>
  <!-- shirt / suit body -->
  <rect x="4" y="7" width="8" height="7" fill="#1a1a1a"/>
  <!-- suit lapels -->
  <rect x="4" y="7" width="2" height="4" fill="#2a2a2a"/>
  <rect x="10" y="7" width="2" height="4" fill="#2a2a2a"/>
  <!-- tie -->
  <rect x="7" y="7" width="2" height="5" fill="#ff2d20"/>
  <!-- arms -->
  <rect x="2" y="7" width="2" height="5" fill="#1a1a1a"/>
  <rect x="12" y="7" width="2" height="5" fill="#1a1a1a"/>
  <!-- hands -->
  <rect x="2" y="12" width="2" height="2" fill="#c8956c"/>
  <rect x="12" y="12" width="2" height="2" fill="#c8956c"/>
  <!-- legs -->
  <rect x="5" y="14" width="3" height="5" fill="#2a2a2a"/>
  <rect x="8" y="14" width="3" height="5" fill="#2a2a2a"/>
  <!-- shoes -->
  <rect x="4" y="18" width="4" height="2" fill="#1a1a1a"/>
  <rect x="8" y="18" width="4" height="2" fill="#1a1a1a"/>
</svg>`;

const CMO_WIN = `
<svg width="64" height="80" viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- head -->
  <rect x="5" y="0" width="6" height="6" fill="#c8956c"/>
  <!-- hair -->
  <rect x="5" y="0" width="6" height="1" fill="#3a2a1a"/>
  <!-- eyes happy -->
  <rect x="6" y="2" width="1" height="1" fill="#1a1a1a"/>
  <rect x="9" y="2" width="1" height="1" fill="#1a1a1a"/>
  <!-- smile -->
  <rect x="6" y="4" width="1" height="1" fill="#8b4513"/>
  <rect x="9" y="4" width="1" height="1" fill="#8b4513"/>
  <rect x="7" y="5" width="2" height="1" fill="#8b4513"/>
  <!-- neck -->
  <rect x="7" y="6" width="2" height="1" fill="#c8956c"/>
  <!-- suit -->
  <rect x="4" y="7" width="8" height="7" fill="#1a1a1a"/>
  <rect x="4" y="7" width="2" height="4" fill="#2a2a2a"/>
  <rect x="10" y="7" width="2" height="4" fill="#2a2a2a"/>
  <rect x="7" y="7" width="2" height="5" fill="#ff2d20"/>
  <!-- arms raised -->
  <rect x="1" y="5" width="2" height="5" fill="#1a1a1a"/>
  <rect x="13" y="5" width="2" height="5" fill="#1a1a1a"/>
  <rect x="1" y="4" width="2" height="2" fill="#c8956c"/>
  <rect x="13" y="4" width="2" height="2" fill="#c8956c"/>
  <!-- legs -->
  <rect x="5" y="14" width="3" height="5" fill="#2a2a2a"/>
  <rect x="8" y="14" width="3" height="5" fill="#2a2a2a"/>
  <rect x="4" y="18" width="4" height="2" fill="#1a1a1a"/>
  <rect x="8" y="18" width="4" height="2" fill="#1a1a1a"/>
</svg>`;

const CMO_LOSE = `
<svg width="64" height="80" viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- head -->
  <rect x="5" y="1" width="6" height="6" fill="#c8956c"/>
  <!-- hair -->
  <rect x="5" y="1" width="6" height="1" fill="#3a2a1a"/>
  <!-- eyes X -->
  <rect x="6" y="3" width="1" height="1" fill="#ff2d20"/>
  <rect x="9" y="3" width="1" height="1" fill="#ff2d20"/>
  <!-- frown -->
  <rect x="7" y="6" width="2" height="1" fill="#8b4513"/>
  <rect x="6" y="5" width="1" height="1" fill="#8b4513"/>
  <rect x="9" y="5" width="1" height="1" fill="#8b4513"/>
  <!-- neck -->
  <rect x="7" y="7" width="2" height="1" fill="#c8956c"/>
  <!-- suit -->
  <rect x="4" y="8" width="8" height="7" fill="#1a1a1a"/>
  <rect x="4" y="8" width="2" height="4" fill="#2a2a2a"/>
  <rect x="10" y="8" width="2" height="4" fill="#2a2a2a"/>
  <rect x="7" y="8" width="2" height="5" fill="#ff2d20"/>
  <!-- arms down -->
  <rect x="2" y="8" width="2" height="5" fill="#1a1a1a"/>
  <rect x="12" y="8" width="2" height="5" fill="#1a1a1a"/>
  <rect x="2" y="13" width="2" height="2" fill="#c8956c"/>
  <rect x="12" y="13" width="2" height="2" fill="#c8956c"/>
  <!-- legs -->
  <rect x="5" y="15" width="3" height="4" fill="#2a2a2a"/>
  <rect x="8" y="15" width="3" height="4" fill="#2a2a2a"/>
  <rect x="4" y="18" width="4" height="2" fill="#1a1a1a"/>
  <rect x="8" y="18" width="4" height="2" fill="#1a1a1a"/>
</svg>`;

// ─── Scanline overlay component ───────────────────────────────────────────────
function Scanlines() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }}
    />
  );
}

// ─── Pixel border box ─────────────────────────────────────────────────────────
function PixelBox({
  children,
  color = C.red,
  style = {},
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        border: `3px solid ${color}`,
        boxShadow: `4px 4px 0 ${color}44, inset 0 0 0 1px ${color}22`,
        background: C.card,
        imageRendering: "pixelated",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── HUD bar ──────────────────────────────────────────────────────────────────
function HudBar({
  label,
  value,
  max,
  color,
  icon,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9 }}>
      <div style={{ color: C.muted, marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div
        style={{
          height: 12,
          background: "#111",
          border: `2px solid ${color}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            transition: "width 0.6s steps(20)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Blinking text ────────────────────────────────────────────────────────────
function Blink({ children, speed = 800 }: { children: React.ReactNode; speed?: number }) {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVis((v) => !v), speed);
    return () => clearInterval(t);
  }, [speed]);
  return <span style={{ opacity: vis ? 1 : 0, transition: "none" }}>{children}</span>;
}

// ─── Pixel star particle ──────────────────────────────────────────────────────
function Particles({ active }: { active: boolean }) {
  if (!active) return null;
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() > 0.5 ? 6 : 4,
    delay: Math.random() * 1,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: C.red,
            animation: `pixelFloat 2s ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Game Component ──────────────────────────────────────────────────────
type Screen = "intro" | "playing" | "result" | "lead";

export default function GamePage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [decisionIdx, setDecisionIdx] = useState(0);
  const [romi, setRomi] = useState(0);
  const [budget, setBudget] = useState(500000);
  const [conversion, setConversion] = useState(2);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [typeText, setTypeText] = useState("");
  const typeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inject pixel font
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = PIXEL_FONT_URL;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Typewriter effect for situation text
  useEffect(() => {
    if (screen !== "playing") return;
    const text = DECISIONS[decisionIdx]?.situation || "";
    setTypeText("");
    let i = 0;
    if (typeRef.current) clearInterval(typeRef.current);
    typeRef.current = setInterval(() => {
      i++;
      setTypeText(text.slice(0, i));
      if (i >= text.length && typeRef.current) clearInterval(typeRef.current);
    }, 35);
    return () => { if (typeRef.current) clearInterval(typeRef.current); };
  }, [screen, decisionIdx]);

  const currentDecision = DECISIONS[decisionIdx];
  const isLastDecision = decisionIdx >= DECISIONS.length - 1;

  function handleChoice(idx: number) {
    if (chosen !== null) return;
    setChosen(idx);
    const opt = currentDecision.options[idx];
    const isCorrect = idx === currentDecision.correctIndex;

    setRomi((r) => Math.min(200, Math.max(-50, r + opt.delta.romi)));
    setBudget((b) => Math.max(0, b + opt.delta.budget));
    setConversion((c) => Math.min(30, Math.max(0, c + opt.delta.conversion)));
    if (!isCorrect) setLives((l) => Math.max(0, l - 1));
    if (isCorrect) setScore((s) => s + 100);

    setShowInsight(true);
  }

  function handleNext() {
    setChosen(null);
    setShowInsight(false);
    if (isLastDecision || lives <= 0) {
      setScreen("result");
    } else {
      setDecisionIdx((i) => i + 1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitLoading(true);
    try {
      await fetch("/api/game-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, romi, score }),
      });
    } catch (_) {}
    setSubmitLoading(false);
    setSubmitted(true);
  }

  const isWin = romi >= 80 && lives > 0;

  // ── INTRO SCREEN ─────────────────────────────────────────────────────────────
  if (screen === "intro") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Press Start 2P', monospace",
          padding: "24px 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Scanlines />
        <style>{`
          @keyframes pixelFloat { from { transform: translateY(0); } to { transform: translateY(-8px); } }
          @keyframes glitch {
            0%,100% { transform: translate(0); }
            20% { transform: translate(-2px, 1px); }
            40% { transform: translate(2px, -1px); }
            60% { transform: translate(-1px, 2px); }
            80% { transform: translate(1px, -2px); }
          }
          @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          .pixel-btn {
            font-family: 'Press Start 2P', monospace;
            background: ${C.red};
            color: ${C.white};
            border: 3px solid ${C.redDark};
            box-shadow: 4px 4px 0 ${C.redDark};
            cursor: pointer;
            transition: transform 0.1s, box-shadow 0.1s;
            image-rendering: pixelated;
          }
          .pixel-btn:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 ${C.redDark}; }
          .pixel-btn:active { transform: translate(4px,4px); box-shadow: 0 0 0 ${C.redDark}; }
          .pixel-btn-outline {
            font-family: 'Press Start 2P', monospace;
            background: transparent;
            color: ${C.red};
            border: 3px solid ${C.red};
            box-shadow: 4px 4px 0 ${C.redDark};
            cursor: pointer;
            transition: transform 0.1s, box-shadow 0.1s;
          }
          .pixel-btn-outline:hover { background: ${C.red}22; transform: translate(2px,2px); box-shadow: 2px 2px 0 ${C.redDark}; }
          .option-btn {
            font-family: 'Press Start 2P', monospace;
            background: ${C.card};
            color: ${C.text};
            border: 3px solid ${C.border};
            box-shadow: 4px 4px 0 #111;
            cursor: pointer;
            transition: all 0.1s;
            text-align: left;
          }
          .option-btn:hover { border-color: ${C.red}; box-shadow: 4px 4px 0 ${C.redDark}; transform: translate(-1px,-1px); }
          .option-btn.correct { border-color: #4ade80; box-shadow: 4px 4px 0 #166534; background: #052e16; }
          .option-btn.wrong { border-color: ${C.red}; box-shadow: 4px 4px 0 ${C.redDark}; background: #1a0000; }
          .option-btn.disabled { opacity: 0.5; cursor: not-allowed; }
          input.pixel-input {
            font-family: 'Press Start 2P', monospace;
            font-size: 10px;
            background: #111;
            color: ${C.text};
            border: 3px solid ${C.border};
            padding: 12px;
            width: 100%;
            box-sizing: border-box;
            outline: none;
          }
          input.pixel-input:focus { border-color: ${C.red}; }
        `}</style>

        {/* Decorative corner pixels */}
        <div style={{ position: "absolute", top: 16, left: 16, width: 20, height: 20, border: `3px solid ${C.red}`, borderRight: "none", borderBottom: "none" }} />
        <div style={{ position: "absolute", top: 16, right: 16, width: 20, height: 20, border: `3px solid ${C.red}`, borderLeft: "none", borderBottom: "none" }} />
        <div style={{ position: "absolute", bottom: 16, left: 16, width: 20, height: 20, border: `3px solid ${C.red}`, borderRight: "none", borderTop: "none" }} />
        <div style={{ position: "absolute", bottom: 16, right: 16, width: 20, height: 20, border: `3px solid ${C.red}`, borderLeft: "none", borderTop: "none" }} />

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeInUp 0.6s ease" }}>
          <div style={{ color: C.red, fontSize: "clamp(18px, 5vw, 36px)", letterSpacing: 4, marginBottom: 8, animation: "glitch 4s infinite" }}>
            ВЕБИНАР РАШ
          </div>
          <div style={{ color: C.muted, fontSize: "clamp(7px, 2vw, 10px)", letterSpacing: 2, marginTop: 8 }}>
            МАРКЕТИНГОВЫЙ СИМУЛЯТОР
          </div>
        </div>

        {/* Character */}
        <div
          style={{ marginBottom: 32, animation: "pixelFloat 2s ease-in-out infinite alternate" }}
          dangerouslySetInnerHTML={{ __html: CMO_IDLE.replace('width="64"', 'width="96"').replace('height="80"', 'height="120"') }}
        />

        {/* Description */}
        <PixelBox style={{ maxWidth: 480, width: "100%", padding: "20px 24px", marginBottom: 32, textAlign: "center" }}>
          <p style={{ color: C.text, fontSize: "clamp(7px, 2vw, 9px)", lineHeight: 2.2, margin: 0 }}>
            Ты — CMO онлайн-школы.<br />
            У тебя 30 дней и 500 000 ₽<br />
            чтобы запустить вебинарную воронку.<br />
            <br />
            <span style={{ color: C.red }}>Каждое решение меняет ROMI.</span><br />
            Сделай правильный выбор — или потеряй бюджет.
          </p>
        </PixelBox>

        {/* Stats preview */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "БЮДЖЕТ", value: "500K ₽", icon: "💰" },
            { label: "ДНЕЙ", value: "30", icon: "📅" },
            { label: "ЖИЗНИ", value: "♥♥♥", icon: "" },
          ].map((s) => (
            <PixelBox key={s.label} style={{ padding: "12px 20px", textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ color: C.red, fontSize: 11, fontFamily: "'Press Start 2P', monospace", marginBottom: 4 }}>{s.value}</div>
              <div style={{ color: C.muted, fontSize: 7, fontFamily: "'Press Start 2P', monospace" }}>{s.label}</div>
            </PixelBox>
          ))}
        </div>

        <button
          className="pixel-btn"
          style={{ fontSize: "clamp(10px, 3vw, 14px)", padding: "16px 40px" }}
          onClick={() => setScreen("playing")}
        >
          <Blink>▶ НАЧАТЬ ИГРУ</Blink>
        </button>

        <div style={{ marginTop: 24, color: C.muted, fontSize: 7, fontFamily: "'Press Start 2P', monospace", textAlign: "center" }}>
          Powered by ГИПОТЕЗА agency
        </div>
      </div>
    );
  }

  // ── PLAYING SCREEN ────────────────────────────────────────────────────────────
  if (screen === "playing") {
    const progress = ((decisionIdx) / DECISIONS.length) * 100;
    const dayLabel = currentDecision.day;

    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          fontFamily: "'Press Start 2P', monospace",
          display: "flex",
          flexDirection: "column",
          padding: "0 0 24px",
          position: "relative",
        }}
      >
        <Scanlines />
        <style>{`
          @keyframes pixelFloat { from { transform: translateY(0); } to { transform: translateY(-6px); } }
          @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
          .pixel-btn { font-family: 'Press Start 2P', monospace; background: ${C.red}; color: ${C.white}; border: 3px solid ${C.redDark}; box-shadow: 4px 4px 0 ${C.redDark}; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; }
          .pixel-btn:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 ${C.redDark}; }
          .pixel-btn:active { transform: translate(4px,4px); box-shadow: 0 0 0 ${C.redDark}; }
          .option-btn { font-family: 'Press Start 2P', monospace; background: ${C.card}; color: ${C.text}; border: 3px solid ${C.border}; box-shadow: 4px 4px 0 #111; cursor: pointer; transition: all 0.1s; text-align: left; width: 100%; }
          .option-btn:not(.disabled):hover { border-color: ${C.red}; box-shadow: 4px 4px 0 ${C.redDark}; transform: translate(-1px,-1px); }
          .option-btn.correct { border-color: #4ade80 !important; box-shadow: 4px 4px 0 #166534 !important; background: #052e16 !important; color: #4ade80 !important; }
          .option-btn.wrong { border-color: ${C.red} !important; box-shadow: 4px 4px 0 ${C.redDark} !important; background: #1a0000 !important; }
          .option-btn.disabled { opacity: 0.5; cursor: not-allowed; }
        `}</style>

        {/* TOP HUD */}
        <div
          style={{
            background: "#111",
            borderBottom: `3px solid ${C.red}`,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: C.red, fontSize: 10, letterSpacing: 2 }}>ВЕБИНАР РАШ</div>
          <div style={{ flex: 1, height: 8, background: "#222", border: `2px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: C.red, transition: "width 0.5s steps(10)" }} />
          </div>
          <div style={{ color: C.text, fontSize: 9 }}>ДЕНЬ {dayLabel}/30</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ fontSize: 14, opacity: i < lives ? 1 : 0.2 }}>♥</span>
            ))}
          </div>
          <div style={{ color: C.red, fontSize: 9 }}>ROMI: {romi}%</div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 720, margin: "0 auto", width: "100%", padding: "24px 16px", gap: 20 }}>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <HudBar label="БЮДЖЕТ" value={budget} max={500000} color={C.red} icon="💰" />
            <HudBar label="ROMI" value={Math.max(0, romi)} max={200} color={romi >= 100 ? "#4ade80" : romi >= 50 ? "#facc15" : C.red} icon="📈" />
            <HudBar label="КОНВЕРСИЯ" value={conversion} max={30} color="#60a5fa" icon="🎯" />
          </div>

          {/* Character + situation */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, animation: "pixelFloat 2s ease-in-out infinite alternate" }}
              dangerouslySetInnerHTML={{ __html: CMO_IDLE }} />
            <PixelBox style={{ flex: 1, padding: "16px 20px", position: "relative" }}>
              <div style={{ color: C.muted, fontSize: 7, marginBottom: 8 }}>СИТУАЦИЯ:</div>
              <div style={{ color: C.text, fontSize: "clamp(7px, 2vw, 9px)", lineHeight: 2.2 }}>
                {typeText}
                <Blink speed={500}>_</Blink>
              </div>
            </PixelBox>
          </div>

          {/* Options */}
          {!showInsight && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "slideIn 0.4s ease" }}>
              <div style={{ color: C.muted, fontSize: 7, marginBottom: 4 }}>▶ ВЫБЕРИТЕ ДЕЙСТВИЕ:</div>
              {currentDecision.options.map((opt, i) => {
                const isChosen = chosen === i;
                const isCorrect = i === currentDecision.correctIndex;
                const cls = chosen !== null
                  ? isCorrect ? "option-btn correct" : isChosen ? "option-btn wrong" : "option-btn disabled"
                  : "option-btn";
                return (
                  <button
                    key={i}
                    className={cls}
                    style={{ padding: "14px 16px", fontSize: "clamp(7px, 2vw, 9px)", lineHeight: 1.8 }}
                    onClick={() => handleChoice(i)}
                    disabled={chosen !== null}
                  >
                    <span style={{ marginRight: 10 }}>{opt.icon}</span>
                    {String.fromCharCode(65 + i)}. {opt.label}
                    {chosen !== null && isCorrect && <span style={{ float: "right", color: "#4ade80" }}>✓ ВЕРНО</span>}
                    {chosen !== null && isChosen && !isCorrect && <span style={{ float: "right", color: C.red }}>✗ ОШИБКА</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Insight panel */}
          {showInsight && (
            <div style={{ animation: "fadeInUp 0.4s ease" }}>
              <PixelBox
                color={chosen === currentDecision.correctIndex ? "#4ade80" : C.red}
                style={{ padding: "16px 20px", marginBottom: 12 }}
              >
                <div style={{ color: C.muted, fontSize: 7, marginBottom: 8 }}>
                  {chosen === currentDecision.correctIndex ? "✓ ПРАВИЛЬНЫЙ ВЫБОР" : "✗ ОШИБКА — ЖИЗНЬ ПОТЕРЯНА"}
                </div>
                <div style={{ color: C.text, fontSize: "clamp(7px, 2vw, 9px)", lineHeight: 2.2 }}>
                  {currentDecision.insight}
                </div>
                <div style={{ marginTop: 12, color: C.muted, fontSize: 7, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
                  💡 ЧТО ДЕЛАЕТ ГИПОТЕЗА: {currentDecision.hint}
                </div>
              </PixelBox>
              <button
                className="pixel-btn"
                style={{ fontSize: 9, padding: "12px 24px", width: "100%" }}
                onClick={handleNext}
              >
                {isLastDecision || lives <= 0 ? "▶ ЗАВЕРШИТЬ ЗАПУСК" : "▶ СЛЕДУЮЩИЙ ДЕНЬ →"}
              </button>
            </div>
          )}
        </div>

        {/* Bottom stats */}
        <div style={{ borderTop: `2px solid ${C.border}`, padding: "8px 20px", display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "БЮДЖЕТ", value: `${(budget / 1000).toFixed(0)}K ₽` },
            { label: "ROMI", value: `${romi}%` },
            { label: "КОНВЕРСИЯ", value: `${conversion.toFixed(1)}%` },
            { label: "СЧЁТ", value: score },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ color: C.muted, fontSize: 6 }}>{s.label}</div>
              <div style={{ color: C.red, fontSize: 9 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ─────────────────────────────────────────────────────────────
  if (screen === "result") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          fontFamily: "'Press Start 2P', monospace",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Scanlines />
        <Particles active={isWin} />
        <style>{`
          @keyframes pixelFloat { from { transform: translateY(0); } to { transform: translateY(-8px); } }
          @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes pixelPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          .pixel-btn { font-family: 'Press Start 2P', monospace; background: ${C.red}; color: ${C.white}; border: 3px solid ${C.redDark}; box-shadow: 4px 4px 0 ${C.redDark}; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; }
          .pixel-btn:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 ${C.redDark}; }
        `}</style>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeInUp 0.5s ease" }}>
          <div style={{
            color: isWin ? "#4ade80" : C.red,
            fontSize: "clamp(14px, 4vw, 24px)",
            letterSpacing: 3,
            animation: "pixelPulse 1.5s infinite",
          }}>
            {isWin ? "ЗАПУСК ЗАВЕРШЁН!" : "ЗАПУСК ПРОВАЛЕН"}
          </div>
          <div style={{ color: C.muted, fontSize: 8, marginTop: 8 }}>
            {isWin ? "Ты справился с запуском!" : "Бюджет слит, CEO недоволен..."}
          </div>
        </div>

        {/* Character */}
        <div
          style={{ marginBottom: 24, animation: "pixelFloat 2s ease-in-out infinite alternate" }}
          dangerouslySetInnerHTML={{ __html: (isWin ? CMO_WIN : CMO_LOSE).replace('width="64"', 'width="96"').replace('height="80"', 'height="120"') }}
        />

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, maxWidth: 400, width: "100%", marginBottom: 24 }}>
          {[
            { label: "ROMI", value: `${romi}%`, good: romi >= 100 },
            { label: "БЮДЖЕТ", value: `${(budget / 1000).toFixed(0)}K ₽`, good: budget > 200000 },
            { label: "КОНВЕРСИЯ", value: `${conversion.toFixed(1)}%`, good: conversion >= 8 },
            { label: "СЧЁТ", value: score, good: score >= 300 },
          ].map((s) => (
            <PixelBox key={s.label} color={s.good ? "#4ade80" : C.red} style={{ padding: "12px 16px", textAlign: "center" }}>
              <div style={{ color: C.muted, fontSize: 7, marginBottom: 6 }}>{s.label}</div>
              <div style={{ color: s.good ? "#4ade80" : C.red, fontSize: 13 }}>{s.value}</div>
            </PixelBox>
          ))}
        </div>

        {/* CTA */}
        <PixelBox style={{ maxWidth: 480, width: "100%", padding: "16px 20px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ color: C.text, fontSize: "clamp(7px, 2vw, 9px)", lineHeight: 2.2 }}>
            {isWin
              ? "Ты знаешь как строить воронки.\nГипотеза делает это в реальности — с гарантией результата."
              : "Воронки — это сложно. Именно поэтому существует Гипотеза. Мы берём это на себя."}
          </div>
        </PixelBox>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            className="pixel-btn"
            style={{ fontSize: 9, padding: "14px 24px" }}
            onClick={() => setScreen("lead")}
          >
            РАЗОБРАТЬ МОЮ ВОРОНКУ →
          </button>
          <button
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              padding: "14px 24px",
              background: "transparent",
              color: C.muted,
              border: `2px solid ${C.border}`,
              cursor: "pointer",
            }}
            onClick={() => {
              setScreen("intro");
              setDecisionIdx(0);
              setRomi(0);
              setBudget(500000);
              setConversion(2);
              setLives(3);
              setScore(0);
              setChosen(null);
              setShowInsight(false);
            }}
          >
            ↺ ИГРАТЬ СНОВА
          </button>
        </div>
      </div>
    );
  }

  // ── LEAD SCREEN ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Press Start 2P', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
      }}
    >
      <Scanlines />
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .pixel-btn { font-family: 'Press Start 2P', monospace; background: ${C.red}; color: ${C.white}; border: 3px solid ${C.redDark}; box-shadow: 4px 4px 0 ${C.redDark}; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; }
        .pixel-btn:hover { transform: translate(2px,2px); box-shadow: 2px 2px 0 ${C.redDark}; }
        .pixel-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        input.pixel-input { font-family: 'Press Start 2P', monospace; font-size: 9px; background: #111; color: ${C.text}; border: 3px solid ${C.border}; padding: 14px 12px; width: 100%; box-sizing: border-box; outline: none; }
        input.pixel-input:focus { border-color: ${C.red}; }
      `}</style>

      {submitted ? (
        <div style={{ textAlign: "center", animation: "fadeInUp 0.5s ease" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
          <div style={{ color: "#4ade80", fontSize: "clamp(10px, 3vw, 16px)", marginBottom: 12 }}>ЗАЯВКА ПРИНЯТА!</div>
          <div style={{ color: C.muted, fontSize: 8, lineHeight: 2.2 }}>
            Команда Гипотезы свяжется<br />с тобой в течение 24 часов.
          </div>
          <div style={{ marginTop: 24, color: C.muted, fontSize: 7 }}>Powered by ГИПОТЕЗА agency</div>
        </div>
      ) : (
        <div style={{ maxWidth: 480, width: "100%", animation: "fadeInUp 0.5s ease" }}>
          {/* Terminal header */}
          <div style={{ background: C.red, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, background: "#ff6b6b" }} />
            <div style={{ width: 10, height: 10, background: "#ffd93d" }} />
            <div style={{ width: 10, height: 10, background: "#6bcb77" }} />
            <span style={{ color: C.white, fontSize: 8, marginLeft: 8 }}>TERMINAL.EXE</span>
          </div>

          <PixelBox color={C.red} style={{ padding: "24px 20px", borderTop: "none" }}>
            <div style={{ color: C.red, fontSize: "clamp(9px, 2.5vw, 12px)", marginBottom: 8 }}>
              ХОЧЕШЬ ТАК В РЕАЛЬНОСТИ?_
            </div>
            <div style={{ color: C.muted, fontSize: 7, lineHeight: 2, marginBottom: 20 }}>
              Разберём твою воронку бесплатно за 30 минут.<br />
              Найдём где ты теряешь деньги — и как это исправить.
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ color: C.muted, fontSize: 7, marginBottom: 6 }}>{'>'} ИМЯ:</div>
                <input
                  className="pixel-input"
                  type="text"
                  placeholder="Твоё имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: 7, marginBottom: 6 }}>{'>'} ТЕЛЕФОН / TELEGRAM:</div>
                <input
                  className="pixel-input"
                  type="text"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: 8, padding: "10px 12px", background: "#111", border: `1px solid ${C.border}`, fontSize: 7, color: C.muted, lineHeight: 1.8 }}>
                <span style={{ color: "#4ade80" }}>✓</span> Твой результат: ROMI {romi}%, счёт {score}<br />
                <span style={{ color: C.red }}>→</span> Реальный ROMI клиентов Гипотезы: 160%+
              </div>

              <button
                className="pixel-btn"
                type="submit"
                disabled={submitLoading}
                style={{ fontSize: 9, padding: "14px", marginTop: 4 }}
              >
                {submitLoading ? "ОТПРАВКА..." : "▶ РАЗОБРАТЬ МОЮ ВОРОНКУ"}
              </button>
            </form>
          </PixelBox>

          <div style={{ textAlign: "center", marginTop: 16, color: C.muted, fontSize: 7 }}>
            Powered by ГИПОТЕЗА agency
          </div>
        </div>
      )}
    </div>
  );
}
