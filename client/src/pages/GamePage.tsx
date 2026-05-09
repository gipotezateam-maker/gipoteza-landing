import { useState, useEffect, useRef, useCallback } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";

const C = {
  bg: "#0a0a0a",
  panel: "#0e0e0e",
  border: "#1a1a1a",
  red: "#ff2d20",
  redDark: "#a01a10",
  redGlow: "rgba(255,45,32,0.4)",
  redMid: "rgba(255,45,32,0.15)",
  text: "#f5f5f0",
  muted: "rgba(245,245,240,0.45)",
  green: "#22c55e",
  greenGlow: "rgba(34,197,94,0.35)",
  yellow: "#facc15",
  blue: "#60a5fa",
  purple: "#a78bfa",
  orange: "#fb923c",
};

// ─── Animated Canvas background ──────────────────────────────────────────────
function AnimatedBg({ crisis }: { crisis: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let frame = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Particles
    const pts = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.8 + 0.1),
      size: Math.ceil(Math.random() * 2) * 2,
      alpha: Math.random() * 0.5 + 0.05,
      color: crisis
        ? (Math.random() > 0.5 ? C.red : "#ff6b5b")
        : (Math.random() > 0.7 ? C.red : "#ffffff"),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scrolling grid
      const gs = 48;
      const off = (frame * 0.25) % gs;
      ctx.strokeStyle = crisis ? "rgba(255,45,32,0.09)" : "rgba(255,45,32,0.05)";
      ctx.lineWidth = 1;
      for (let x = -gs + off; x < canvas.width + gs; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = -gs + off; y < canvas.height + gs; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Diagonal scan line
      if (crisis) {
        const scanX = ((frame * 2) % (canvas.width + 200)) - 100;
        const grad = ctx.createLinearGradient(scanX - 60, 0, scanX + 60, 0);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.5, "rgba(255,45,32,0.08)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(scanX - 60, 0, 120, canvas.height);
      }

      // Floating pixels
      pts.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });
      ctx.globalAlpha = 1;

      // Corner decorations (pixel brackets)
      const drawBracket = (x: number, y: number, flipX: boolean, flipY: boolean) => {
        const sx = flipX ? -1 : 1; const sy = flipY ? -1 : 1;
        ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy);
        ctx.fillStyle = "rgba(255,45,32,0.25)";
        for (let i = 0; i < 3; i++) ctx.fillRect(i * 4, 0, 4, 4);
        ctx.fillRect(0, 4, 4, 12);
        ctx.restore();
      };
      drawBracket(20, 20, false, false);
      drawBracket(canvas.width - 20, 20, true, false);
      drawBracket(20, canvas.height - 20, false, true);
      drawBracket(canvas.width - 20, canvas.height - 20, true, true);

      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [crisis]);

  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── CRT overlay ──────────────────────────────────────────────────────────────
function CRT() {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 9997, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 9996, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
    </>
  );
}

// ─── Pixel explosion ──────────────────────────────────────────────────────────
interface Burst { id: number; x: number; y: number; good: boolean }
function Bursts({ list }: { list: Burst[] }) {
  return (
    <>
      {list.map((b) => (
        <div key={b.id} style={{ position: "fixed", left: b.x, top: b.y, pointerEvents: "none", zIndex: 9990 }}>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const d = 35 + Math.random() * 45;
            const size = Math.ceil(Math.random() * 3) * 2;
            return (
              <div key={i} style={{
                position: "absolute", width: size, height: size,
                background: b.good ? C.green : C.red,
                boxShadow: `0 0 4px ${b.good ? C.green : C.red}`,
                animation: "burstOut 0.65s ease-out forwards",
                "--tx": `${Math.cos(a) * d}px`, "--ty": `${Math.sin(a) * d}px`,
              } as React.CSSProperties} />
            );
          })}
        </div>
      ))}
    </>
  );
}

// ─── Blink ────────────────────────────────────────────────────────────────────
function Blink({ children, ms = 550 }: { children: React.ReactNode; ms?: number }) {
  const [v, setV] = useState(true);
  useEffect(() => { const t = setInterval(() => setV(x => !x), ms); return () => clearInterval(t); }, [ms]);
  return <span style={{ opacity: v ? 1 : 0 }}>{children}</span>;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function useTypewriter(text: string, spd = 20) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false);
    let i = 0;
    const t = setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) { clearInterval(t); setDone(true); } }, spd);
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

// ─── DETAILED PIXEL ART CHARACTERS ───────────────────────────────────────────

// CMO — detailed 24×32 pixel art
function CMOChar({ mood, scale = 1 }: { mood: "idle" | "think" | "win" | "lose" | "talk"; scale?: number }) {
  const W = 24 * scale, H = 32 * scale;
  const skin = "#c8956c", hair = "#1a0f05", suit = "#111", lapel = "#1c1c1c";
  const tie = C.red, pants = "#0d0d0d", shoe = "#080808", shirt = "#eee";
  const eyeC = mood === "lose" ? C.red : mood === "win" ? C.green : "#111";
  const mouthRow = mood === "lose" ? 8 : 7;
  const armY = mood === "win" ? 11 : 13;
  const glowColor = mood === "win" ? C.green : mood === "lose" ? C.red : "transparent";

  // pixel grid helper
  const px = (col: number, row: number, w = 1, h = 1, color: string) =>
    <rect key={`${col}-${row}`} x={col} y={row} width={w} height={h} fill={color} />;

  return (
    <svg width={W} height={H} viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", filter: glowColor !== "transparent" ? `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor}88)` : `drop-shadow(0 0 6px ${C.red}44)` }}>
      {/* === HEAD === */}
      {px(8, 0, 8, 1, hair)}
      {px(7, 1, 10, 1, hair)}
      {px(7, 2, 10, 7, skin)}
      {/* hair sides */}
      {px(7, 2, 1, 3, hair)}{px(16, 2, 1, 3, hair)}
      {/* ear */}
      {px(6, 4, 1, 2, skin)}{px(17, 4, 1, 2, skin)}
      {/* eyes */}
      {px(9, 4, 2, 2, eyeC)}{px(13, 4, 2, 2, eyeC)}
      {/* pupils */}
      {px(10, 5, 1, 1, "#fff")}{px(14, 5, 1, 1, "#fff")}
      {/* eyebrows */}
      {mood === "think" && <>{px(9, 3, 2, 1, hair)}{px(13, 3, 2, 1, hair)}</>}
      {mood === "lose" && <>{px(9, 3, 3, 1, hair)}{px(12, 3, 3, 1, hair)}</>}
      {/* nose */}
      {px(11, 6, 2, 1, "#b07050")}
      {/* mouth */}
      {mood === "win"
        ? <>{px(9, mouthRow, 6, 1, "#8b4513")}{px(9, mouthRow + 1, 1, 1, "#8b4513")}{px(14, mouthRow + 1, 1, 1, "#8b4513")}</>
        : mood === "lose"
        ? <>{px(10, mouthRow, 4, 1, "#8b4513")}{px(9, mouthRow + 1, 2, 1, "#8b4513")}{px(13, mouthRow + 1, 2, 1, "#8b4513")}</>
        : <>{px(10, mouthRow, 4, 1, "#8b4513")}</>}
      {/* === NECK === */}
      {px(10, 9, 4, 2, skin)}
      {/* === SHIRT COLLAR === */}
      {px(9, 10, 2, 1, shirt)}{px(13, 10, 2, 1, shirt)}
      {/* === SUIT BODY === */}
      {px(6, 11, 12, 9, suit)}
      {/* lapels */}
      {px(6, 11, 3, 5, lapel)}{px(15, 11, 3, 5, lapel)}
      {/* tie */}
      {px(11, 10, 2, 1, tie)}{px(11, 11, 2, 6, tie)}{px(10, 14, 4, 2, tie)}
      {/* suit buttons */}
      {px(11, 17, 2, 1, "#333")}{px(11, 19, 2, 1, "#333")}
      {/* pocket square */}
      {px(6, 12, 2, 2, "#ff6b5b")}
      {/* === ARMS === */}
      {px(3, armY, 3, 6, suit)}{px(18, armY, 3, 6, suit)}
      {/* cuffs */}
      {px(3, armY + 5, 3, 1, shirt)}{px(18, armY + 5, 3, 1, shirt)}
      {/* hands */}
      {px(3, armY + 6, 3, 2, skin)}{px(18, armY + 6, 3, 2, skin)}
      {/* win: raised arms */}
      {mood === "win" && <>{px(1, 8, 3, 5, suit)}{px(20, 8, 3, 5, suit)}{px(1, 13, 3, 2, skin)}{px(20, 13, 3, 2, skin)}</>}
      {/* === BELT === */}
      {px(6, 20, 12, 1, "#222")}{px(10, 20, 4, 1, "#444")}
      {/* === PANTS === */}
      {px(6, 21, 5, 7, pants)}{px(13, 21, 5, 7, pants)}
      {/* crease */}
      {px(8, 22, 1, 5, "#1a1a1a")}{px(15, 22, 1, 5, "#1a1a1a")}
      {/* === SHOES === */}
      {px(5, 28, 7, 3, shoe)}{px(13, 28, 7, 3, shoe)}
      {px(5, 30, 1, 1, "#222")}{px(12, 30, 1, 1, "#222")}
      {/* shadow */}
      <ellipse cx="12" cy="31.5" rx="6" ry="0.8" fill="rgba(0,0,0,0.4)" />
      {/* talk bubble */}
      {mood === "talk" && <>
        {px(17, 0, 6, 4, "#111")}{px(18, 1, 4, 2, C.red)}
        {px(17, 4, 2, 2, "#111")}
      </>}
    </svg>
  );
}

// CEO — detailed 24×32 pixel art, intimidating boss
function CEOChar({ angry, scale = 1 }: { angry: boolean; scale?: number }) {
  const W = 24 * scale, H = 32 * scale;
  const skin = "#d4a574", hair = "#555", suit = "#0f1520", lapel = "#161e30";
  const tie = "#facc15", pants = "#0a0f18", shoe = "#050a10";

  return (
    <svg width={W} height={H} viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", filter: angry ? `drop-shadow(0 0 10px ${C.red}) drop-shadow(0 0 20px ${C.red}66)` : `drop-shadow(0 0 4px #facc1544)` }}>
      {/* head */}
      <rect x="7" y="1" width="10" height="8" fill={skin} />
      {/* grey hair */}
      <rect x="6" y="0" width="12" height="3" fill={hair} />
      <rect x="6" y="0" width="2" height="6" fill={hair} />
      <rect x="16" y="0" width="2" height="6" fill={hair} />
      {/* glasses */}
      <rect x="8" y="3" width="3" height="3" fill="none" stroke="#888" strokeWidth="0.5" />
      <rect x="13" y="3" width="3" height="3" fill="none" stroke="#888" strokeWidth="0.5" />
      <rect x="11" y="4" width="2" height="1" fill="#888" />
      {/* eyes behind glasses */}
      <rect x="9" y="4" width="1" height="1" fill={angry ? C.red : "#333"} />
      <rect x="14" y="4" width="1" height="1" fill={angry ? C.red : "#333"} />
      {/* angry brows */}
      {angry && <><rect x="8" y="2" width="4" height="1" fill="#333" /><rect x="12" y="2" width="4" height="1" fill="#333" /></>}
      {/* nose */}
      <rect x="11" y="6" width="2" height="1" fill="#b07050" />
      {/* mouth */}
      {angry
        ? <><rect x="9" y="8" width="6" height="1" fill="#8b4513" /><rect x="8" y="7" width="2" height="1" fill="#8b4513" /><rect x="14" y="7" width="2" height="1" fill="#8b4513" /></>
        : <rect x="10" y="8" width="4" height="1" fill="#8b4513" />}
      {/* neck */}
      <rect x="10" y="9" width="4" height="2" fill={skin} />
      {/* suit */}
      <rect x="5" y="11" width="14" height="9" fill={suit} />
      <rect x="5" y="11" width="4" height="6" fill={lapel} />
      <rect x="15" y="11" width="4" height="6" fill={lapel} />
      {/* gold tie */}
      <rect x="11" y="10" width="2" height="1" fill={tie} />
      <rect x="11" y="11" width="2" height="6" fill={tie} />
      <rect x="10" y="14" width="4" height="2" fill={tie} />
      {/* medal/badge */}
      <rect x="16" y="12" width="2" height="2" fill="#facc15" />
      <rect x="16" y="14" width="2" height="1" fill="#f59e0b" />
      {/* arms */}
      <rect x="2" y="13" width="3" height="6" fill={suit} />
      <rect x="19" y="13" width="3" height="6" fill={suit} />
      <rect x="2" y="19" width="3" height="1" fill="#eee" />
      <rect x="19" y="19" width="3" height="1" fill="#eee" />
      <rect x="2" y="20" width="3" height="2" fill={skin} />
      <rect x="19" y="20" width="3" height="2" fill={skin} />
      {/* belt */}
      <rect x="5" y="20" width="14" height="1" fill="#111" />
      <rect x="10" y="20" width="4" height="1" fill="#333" />
      {/* pants */}
      <rect x="5" y="21" width="6" height="7" fill={pants} />
      <rect x="13" y="21" width="6" height="7" fill={pants} />
      {/* shoes */}
      <rect x="4" y="28" width="8" height="3" fill={shoe} />
      <rect x="13" y="28" width="8" height="3" fill={shoe} />
      <ellipse cx="12" cy="31.5" rx="6" ry="0.8" fill="rgba(0,0,0,0.4)" />
      {/* angry steam */}
      {angry && <>
        <rect x="5" y="0" width="2" height="3" fill={C.red} opacity="0.7" />
        <rect x="17" y="0" width="2" height="3" fill={C.red} opacity="0.7" />
      </>}
    </svg>
  );
}

// ─── Pixel bar ────────────────────────────────────────────────────────────────
function Bar({ val, max, color, label, icon }: { val: number; max: number; color: string; label: string; icon: string }) {
  const pct = Math.max(0, Math.min(100, (val / max) * 100));
  const low = pct < 20;
  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 6, color: C.muted }}>{icon} {label}</span>
        <span style={{ fontSize: 7, color: low ? C.red : color, animation: low ? "blink 0.4s steps(1) infinite" : "none" }}>
          {val > 999 ? `${(val / 1000).toFixed(0)}K` : val}
        </span>
      </div>
      <div style={{ height: 12, background: "#080808", border: `2px solid ${color}33`, position: "relative", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${color}cc, ${color})`, boxShadow: `0 0 8px ${color}`, transition: "width 0.7s steps(24)" }} />
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${(i + 1) * (100 / 24)}%`, top: 0, width: 1, height: "100%", background: "#0a0a0a66" }} />
        ))}
      </div>
    </div>
  );
}

// ─── GAME DATA — hard CMO scenarios ──────────────────────────────────────────
interface Opt {
  label: string; icon: string; detail: string; consequence: string;
  delta: { romi: number; budget: number; conv: number; score: number };
  isOptimal: boolean; trap?: string;
}
interface Scene {
  id: number; day: number; phase: string; crisis?: boolean;
  title: string; situation: string; metrics: string;
  options: Opt[]; insight: string; difficulty: "HARD" | "EXPERT" | "NIGHTMARE";
}

const SCENES: Scene[] = [
  {
    id: 0, day: 3, phase: "PREP", difficulty: "HARD",
    title: "ВОРОНКА РЕГИСТРАЦИЙ",
    situation: "Запускаешь вебинар по EdTech B2B. Лендинг готов: CR в регистрацию 5.2%. Средний CR по рынку — 22–28%. Бюджет на трафик: 300К. CAC текущий: 4 200 ₽. Целевой CAC: 800 ₽. Трафик: Facebook Ads, холодная аудитория.",
    metrics: "CR: 5.2% | CAC: 4200₽ | Бюджет: 300К",
    insight: "Гипотеза: Смена оффера с «узнай как» на «получи конкретный результат» + социальное доказательство поднимают CR до 18–24% за 72 часа A/B теста",
    options: [
      {
        label: "A/B тест: оффер + VSL 90 сек",
        icon: "🧪", detail: "Тест 3 офферов + видео-лендинг. Срок: 72 часа, бюджет теста: 30К",
        consequence: "CR вырос до 21%. CAC упал до 1 100 ₽. Нашли оффер «+40% к конверсии вебинара за 14 дней» — работает лучше всего на холодную аудиторию B2B.",
        delta: { romi: 35, budget: -30000, conv: 16, score: 420 }, isOptimal: true,
      },
      {
        label: "Масштабировать текущий трафик x3",
        icon: "📈", detail: "Увеличить бюджет с 300К до 900К при CR 5.2%",
        consequence: "CAC вырос до 5 800 ₽. Потратили 600К дополнительно. ROMI ушёл в минус. Facebook начал показывать рекламу нецелевой аудитории при масштабировании.",
        delta: { romi: -28, budget: -600000, conv: 4, score: 30 }, isOptimal: false,
        trap: "Масштабирование дырявой воронки = сжигание бюджета",
      },
      {
        label: "Переключиться на Telegram Ads",
        icon: "✈️", detail: "Перенести весь бюджет в Telegram Ads",
        consequence: "CR 8.1% — лучше, но аудитория меньше. CAC 2 400 ₽. Не хватает объёма для выполнения плана по регистрациям.",
        delta: { romi: 5, budget: -50000, conv: 3, score: 140 }, isOptimal: false,
      },
      {
        label: "Нанять UX-дизайнера для редизайна",
        icon: "🎨", detail: "Полный редизайн лендинга. Срок: 2 недели",
        consequence: "Потеряли 2 недели и 80К. CR вырос до 7.4%. Дизайн не решает проблему оффера — люди не понимают ценность продукта.",
        delta: { romi: -5, budget: -80000, conv: 2, score: 60 }, isOptimal: false,
        trap: "Красивый дизайн не заменяет сильный оффер",
      },
    ],
  },
  {
    id: 1, day: 7, phase: "PREP", difficulty: "EXPERT",
    title: "ДОХОДИМОСТЬ: КРИЗИС ВОРОНКИ",
    situation: "500 регистраций собрано. Исторические данные: доходимость 9%, конверсия в продажу 1.2%. Вебинар через 5 дней. Конкурент объявил скидку 50% на аналогичный курс. Твоя задача: поднять доходимость до 35%+ и удержать позиционирование без ценовой войны.",
    metrics: "Регистраций: 500 | Доходимость: 9% | Конверсия: 1.2%",
    insight: "Гипотеза: Персонализированная мессенджер-цепочка с предварительным контентом поднимает доходимость до 38–45%. Ценовая война разрушает маржу — лучше усилить уникальность",
    options: [
      {
        label: "Мессенджер-бот: 6 касаний + pre-value",
        icon: "🤖", detail: "Автоматическая цепочка: день -5, -3, -1, -0.5, +1 час, напоминание. Контент: мини-уроки, кейсы, Q&A",
        consequence: "Доходимость 41%. Open rate бота 84%. Люди пришли прогретые — конверсия в продажу выросла до 4.8%. Конкурент не страшен: аудитория уже лояльна.",
        delta: { romi: 45, budget: -22000, conv: 18, score: 520 }, isOptimal: true,
      },
      {
        label: "Ответить скидкой 30% на флагман",
        icon: "🏷️", detail: "Объявить скидку 30% в ответ на конкурента",
        consequence: "Продажи выросли на 15%, но маржа упала на 30%. Обесценили продукт в глазах аудитории. Следующий запуск будет сложнее продавать по полной цене.",
        delta: { romi: -18, budget: 0, conv: 6, score: 80 }, isOptimal: false,
        trap: "Ценовая война убивает LTV и позиционирование",
      },
      {
        label: "Email-рассылка: 3 письма",
        icon: "📧", detail: "Стандартные напоминания по email",
        consequence: "Open rate 14%. Доходимость выросла до 16%. Недостаточно для выполнения плана. Email работает плохо для вебинарных воронок в 2025.",
        delta: { romi: 8, budget: -8000, conv: 5, score: 130 }, isOptimal: false,
      },
      {
        label: "Добавить бонус «только для пришедших»",
        icon: "🎁", detail: "Анонсировать эксклюзивный бонус только для участников вебинара",
        consequence: "Доходимость 28%. Хорошо, но не достигли цели 35%+. Часть аудитории всё равно не пришла — нет системы напоминаний.",
        delta: { romi: 18, budget: -5000, conv: 10, score: 240 }, isOptimal: false,
      },
    ],
  },
  {
    id: 2, day: 11, phase: "LAUNCH", crisis: true, difficulty: "NIGHTMARE",
    title: "⚠ КРИЗИС: КОНВЕРСИЯ ВЕБИНАРА 0.8%",
    situation: "Вебинар прошёл. 210 участников. Продаж: 2 на сумму 120К. Конверсия 0.8% при плане 6%. CEO требует объяснений. Анализ записи: 60% аудитории ушло на 40-й минуте. Оффер был на 75-й минуте. Средний чек: 60К. Следующий запуск через 3 недели.",
    metrics: "Участников: 210 | Продаж: 2 | Конверсия: 0.8% | Ушли: 60% на 40 мин",
    insight: "Гипотеза: Оффер на 45–50 мин + дожимная автоворонка на 7 дней = конверсия 5–9%. Проблема не в продукте — в структуре вебинара",
    options: [
      {
        label: "Реструктурировать вебинар + 7-дневный дожим",
        icon: "🔧", detail: "Перенести оффер на 45 мин, добавить автоворонку: email + мессенджер 7 дней",
        consequence: "Следующий вебинар: конверсия 5.2%. Дожимная воронка добрала ещё 8 продаж. Итого: 180К выручки с одного запуска. CEO доволен.",
        delta: { romi: 55, budget: -35000, conv: 22, score: 580 }, isOptimal: true,
      },
      {
        label: "Повторить вебинар с той же структурой",
        icon: "🔄", detail: "Запустить ещё один вебинар без изменений",
        consequence: "Конверсия снова 0.9%. Потратили ещё 150К на трафик. CEO урезал бюджет на следующий квартал.",
        delta: { romi: -35, budget: -150000, conv: -2, score: 20 }, isOptimal: false,
        trap: "Повторять одну и ту же ошибку — определение безумия",
      },
      {
        label: "Обзвонить всех 210 участников",
        icon: "📞", detail: "Ручные продажи всем участникам вебинара",
        consequence: "Закрыли 6 сделок. Выручка 360К. Но потратили 3 недели работы отдела продаж. Не масштабируется.",
        delta: { romi: 15, budget: -60000, conv: 8, score: 160 }, isOptimal: false,
      },
      {
        label: "Снизить цену флагмана до 15К",
        icon: "💥", detail: "Экстренное снижение цены с 60К до 15К",
        consequence: "Продали 12 штук на 180К. Но обесценили продукт. Аудитория теперь ждёт скидок. LTV упал на 40%.",
        delta: { romi: -10, budget: 0, conv: 5, score: 70 }, isOptimal: false,
        trap: "Паника + снижение цены = долгосрочный ущерб бренду",
      },
    ],
  },
  {
    id: 3, day: 15, phase: "LIVE", crisis: true, difficulty: "NIGHTMARE",
    title: "⚠ КРИЗИС: ТЕХНИЧЕСКИЙ СБОЙ НА ВЕБИНАРЕ",
    situation: "Вебинар идёт. 380 человек онлайн. На 23-й минуте — сбой стриминга. Чат: 'ничего не слышно', 'экран завис', 'возврат денег'. Технический отдел говорит: починим за 20–40 минут. Ты ведущий и CMO одновременно. Таймер: 90 секунд на решение.",
    metrics: "Онлайн: 380 | Сбой: 23 мин | Время до починки: 20–40 мин",
    insight: "Гипотеза: Честность + немедленный переход в резервный канал сохраняет 70–80% аудитории. Молчание и ожидание — теряешь всех",
    options: [
      {
        label: "Telegram-трансляция + честное объяснение",
        icon: "✈️", detail: "Немедленно: «Переходим в Telegram @channel — продолжаем там»",
        consequence: "310 из 380 перешли в Telegram. Вебинар продолжился через 4 минуты. Аудитория оценила честность — конверсия выросла до 6.1% (эффект сочувствия).",
        delta: { romi: 30, budget: -5000, conv: 12, score: 460 }, isOptimal: true,
      },
      {
        label: "Молчать, ждать починки 30 минут",
        icon: "⏳", detail: "Ничего не делать, ждать технарей",
        consequence: "За 30 минут ушло 290 человек. Осталось 90. Конверсия 0.4%. Репутационный ущерб в соцсетях.",
        delta: { romi: -30, budget: -20000, conv: -8, score: 15 }, isOptimal: false,
        trap: "Молчание в кризис = потеря доверия",
      },
      {
        label: "Перенести вебинар на следующий день",
        icon: "📅", detail: "Объявить перенос и попросить прийти завтра",
        consequence: "Пришло 140 из 380 на следующий день. Конверсия 2.1%. Потеряли 60% аудитории.",
        delta: { romi: -15, budget: -15000, conv: -3, score: 90 }, isOptimal: false,
      },
      {
        label: "Записать и отправить запись всем",
        icon: "🎬", detail: "Остановить вебинар, прислать запись позже",
        consequence: "Запись посмотрели 45%. Конверсия с записи 0.6%. Потеряли живую энергию вебинара.",
        delta: { romi: -5, budget: -8000, conv: 1, score: 110 }, isOptimal: false,
      },
    ],
  },
  {
    id: 4, day: 19, phase: "POST", difficulty: "EXPERT",
    title: "ДОЖИМ: АВТОВОРОНКА ПОСЛЕ ВЕБИНАРА",
    situation: "Вебинар завершён. 380 участников. Купили сразу: 12 человек (3.2%). Осталось 368 «тёплых» лидов. Исторически: 40% решений принимается в течение 7 дней после вебинара. Бюджет на дожим: 50К. Задача: максимизировать конверсию из оставшихся лидов.",
    metrics: "Лидов: 368 | Купили сразу: 3.2% | Бюджет дожима: 50К",
    insight: "Гипотеза: OTO 990₽ + сегментированная автоворонка 7 дней по типу возражения = +5–8% к конверсии. Один оффер для всех — теряешь половину потенциала",
    options: [
      {
        label: "OTO 990₽ + сегментация по возражениям",
        icon: "🎯", detail: "OTO сразу после вебинара. Автоворонка: сегменты «дорого», «не сейчас», «не уверен» — разные цепочки",
        consequence: "OTO купили 28% (103 чел). Из них 19% дошли до флагмана. Сегментированная цепочка добрала ещё 22 продажи. Итого конверсия: 9.4%. ROMI 280%.",
        delta: { romi: 65, budget: -35000, conv: 28, score: 620 }, isOptimal: true,
      },
      {
        label: "Ретаргетинг на всех участников",
        icon: "🔁", detail: "Запустить ретаргетинг в Facebook/VK на всех 368 лидов",
        consequence: "Потратили 50К на ретаргетинг. Конверсия +1.8%. Лиды уже видели рекламу — баннерная слепота. Дорого и неэффективно.",
        delta: { romi: 5, budget: -50000, conv: 4, score: 100 }, isOptimal: false,
        trap: "Ретаргетинг не заменяет персональную коммуникацию",
      },
      {
        label: "Скидка 35% на флагман 48 часов",
        icon: "⚡", detail: "Дедлайн-оффер: скидка 35% только 48 часов",
        consequence: "Продали 18 флагманов. Выручка выросла, но маржа упала на 35%. Аудитория теперь ждёт скидок на каждый запуск.",
        delta: { romi: 10, budget: 0, conv: 8, score: 130 }, isOptimal: false,
      },
      {
        label: "Личные звонки топ-50 лидам",
        icon: "🤝", detail: "Отдел продаж звонит 50 самым активным участникам",
        consequence: "Закрыли 14 сделок. Хороший результат, но не масштабируется. Остальные 318 лидов не охвачены.",
        delta: { romi: 20, budget: -40000, conv: 6, score: 200 }, isOptimal: false,
      },
    ],
  },
  {
    id: 5, day: 23, phase: "POST", crisis: true, difficulty: "NIGHTMARE",
    title: "⚠ CEO-МИТИНГ: ЗАЩИТА БЮДЖЕТА",
    situation: "Квартальный отчёт. ROMI запуска: 140% (план был 200%). CEO: «Почему не выполнили план? Предлагаю урезать маркетинговый бюджет на 40% и перевести деньги в продажи». Совет директоров смотрит на тебя. У тебя 2 минуты на ответ.",
    metrics: "ROMI факт: 140% | ROMI план: 200% | Под угрозой: 40% бюджета",
    insight: "Гипотеза: Данные + конкретный план роста + бенчмарки рынка убеждают CEO лучше, чем эмоции. Атрибуция и unit-экономика — язык CEO",
    options: [
      {
        label: "Unit-экономика + план на 200%+ в Q2",
        icon: "📊", detail: "Показать: LTV/CAC = 4.2x, бенчмарк рынка 120%, наш результат 140%. Конкретный план: 3 оптимизации → 200%+ в Q2",
        consequence: "CEO: «Убедил. Оставляем бюджет и добавляем 20% на тест новых каналов». Совет одобрил план. Следующий запуск с увеличенным бюджетом.",
        delta: { romi: 25, budget: 200000, conv: 5, score: 560 }, isOptimal: true,
      },
      {
        label: "Объяснить провалом внешних факторов",
        icon: "🌧️", detail: "«Конкурент демпинговал, рынок просел, сезонность»",
        consequence: "CEO: «Маркетинг не контролирует результат — зачем нам такой маркетинг?» Бюджет урезан на 50%.",
        delta: { romi: -20, budget: -200000, conv: -3, score: 20 }, isOptimal: false,
        trap: "Внешние факторы — признак отсутствия ответственности",
      },
      {
        label: "Согласиться с урезанием бюджета",
        icon: "😔", detail: "«Да, мы не справились, принимаем решение»",
        consequence: "Бюджет урезан на 40%. Следующий запуск провален из-за нехватки трафика. Тебя заменяют через квартал.",
        delta: { romi: -15, budget: -160000, conv: -5, score: 10 }, isOptimal: false,
      },
      {
        label: "Предложить перевести всё в performance",
        icon: "🎯", detail: "«Давайте перейдём на CPA-модель, платим только за результат»",
        consequence: "CEO заинтересован, но CPA-агентства берут 40% маржи. ROMI упал ещё ниже. Потеряли контроль над воронкой.",
        delta: { romi: -8, budget: -80000, conv: 2, score: 75 }, isOptimal: false,
      },
    ],
  },
  {
    id: 6, day: 28, phase: "SCALE", difficulty: "EXPERT",
    title: "СТРАТЕГИЯ МАСШТАБИРОВАНИЯ",
    situation: "Первый запуск завершён. ROMI 140–280% в зависимости от твоих решений. CEO доволен (или нет). Теперь нужно выбрать стратегию на следующие 6 месяцев. Бюджет: 2М ₽. Команда: 5 человек. Цель: x3 к выручке.",
    metrics: "Бюджет: 2М | Команда: 5 чел | Цель: x3 выручка",
    insight: "Гипотеза: Продуктовая линейка OTO→Флагман→Апселл + автоматизация воронки = окупаемость трафика с первого касания и x3 к LTV",
    options: [
      {
        label: "Продуктовая линейка + автоматизация",
        icon: "🏗️", detail: "OTO 990₽ → Флагман 60К → Апселл 120К. Автоворонка на каждый этап. Трафик окупается с OTO.",
        consequence: "За 6 месяцев: LTV вырос в 3.2 раза. Трафик окупается с первого касания. ROMI 340%. Команда работает на автопилоте. CEO предлагает удвоить бюджет.",
        delta: { romi: 75, budget: -150000, conv: 30, score: 700 }, isOptimal: true,
      },
      {
        label: "Удвоить бюджет на текущий канал",
        icon: "🚀", detail: "Влить 2М в Facebook Ads на проверенную воронку",
        consequence: "При масштабировании CPM вырос в 2.4 раза. ROMI упал с 140% до 80%. Алгоритмы Facebook не справляются с резким ростом бюджета.",
        delta: { romi: -25, budget: -2000000, conv: 5, score: 50 }, isOptimal: false,
        trap: "Масштабирование без оптимизации воронки = сжигание денег",
      },
      {
        label: "Нанять 3 новых маркетологов",
        icon: "👥", detail: "Расширить команду: таргетолог, контент, аналитик",
        consequence: "ФОТ вырос на 600К/год. Результат через 3 месяца — +15% к выручке. Проблема не в людях, а в системе воронки.",
        delta: { romi: 5, budget: -600000, conv: 8, score: 90 }, isOptimal: false,
      },
      {
        label: "Диверсификация: 5 новых каналов",
        icon: "🌐", detail: "Тестировать: YouTube, Яндекс, TikTok, Telegram, SEO одновременно",
        consequence: "Распылили бюджет по 5 каналам. Ни один не получил достаточно данных для оптимизации. Через 3 месяца — хаос и нет результата.",
        delta: { romi: -5, budget: -500000, conv: 3, score: 80 }, isOptimal: false,
        trap: "Диверсификация без фокуса = диверсификация провала",
      },
    ],
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
type Screen = "intro" | "game" | "end";

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
  const burstId = useRef(0);

  const scene = SCENES[Math.min(idx, SCENES.length - 1)];
  const isCrisis = scene?.crisis ?? false;
  const isLast = idx >= SCENES.length - 1;
  const progress = (idx / SCENES.length) * 100;

  const { out: typeOut, done: typeDone } = useTypewriter(
    screen === "game" ? scene.situation : "", 18
  );

  const timerSecs = isCrisis ? 18 : 40;
  const handleTimerEnd = useCallback(() => {
    if (chosen !== null) return;
    const worst = scene.options.reduce((wi, o, i) =>
      o.delta.score < scene.options[wi].delta.score ? i : wi, 0);
    pick(worst, true);
  }, [chosen, scene]);

  const timeLeft = useCountdown(timerSecs, timerOn && screen === "game" && chosen === null, handleTimerEnd);

  useEffect(() => {
    if (screen === "game" && typeDone && chosen === null) setTimerOn(true);
    else setTimerOn(false);
  }, [screen, typeDone, chosen]);

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
    const isOk = opt.isOptimal;
    const mult = isOk ? Math.min(combo + 1, 6) : 1;
    const earned = isOk ? opt.delta.score * mult : Math.floor(opt.delta.score * 0.25);
    setBudget(b => Math.max(0, b + opt.delta.budget));
    setRomi(r => Math.max(-100, r + opt.delta.romi));
    setConv(c => Math.max(0, c + opt.delta.conv));
    setScore(s => s + earned);
    if (isOk) setCombo(c => c + 1);
    else { setCombo(0); if (!forced) setLives(l => Math.max(0, l - 1)); }
    setScoreAnim({ val: earned, show: true });
    setTimeout(() => setScoreAnim(a => ({ ...a, show: false })), 1400);
    setShowRes(true);
  }

  function next() {
    if (isLast || lives <= 0) { setScreen("end"); return; }
    setIdx(i => i + 1);
    setChosen(null);
    setShowRes(false);
  }

  function restart() {
    setScreen("intro"); setIdx(0); setBudget(500000); setRomi(0); setConv(0);
    setScore(0); setLives(3); setCombo(0); setChosen(null); setShowRes(false); setFormSent(false);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    try {
      await fetch("/api/game-leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, score, romi, budget }),
      });
    } catch { /* ignore */ }
    setFormSent(true);
    setFormLoading(false);
  }

  const isWin = romi >= 80 && lives > 0;
  const timerPct = (timeLeft / timerSecs) * 100;
  const timerColor = timeLeft <= 5 ? C.red : timeLeft <= 12 ? C.yellow : C.green;
  const diffColor = { HARD: C.yellow, EXPERT: C.orange, NIGHTMARE: C.red };

  const css = `
    @import url('${FONT_URL}');
    * { box-sizing: border-box; }
    body { margin: 0; background: ${C.bg}; overflow-x: hidden; }

    @keyframes burstOut { to { transform: translate(var(--tx),var(--ty)) scale(0); opacity:0; } }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes floatUp { 0%{opacity:1;transform:translateX(-50%) translateY(0)} 100%{opacity:0;transform:translateX(-50%) translateY(-60px)} }
    @keyframes introGlow { 0%,100%{text-shadow:0 0 12px ${C.red},0 0 24px ${C.red}44} 50%{text-shadow:0 0 24px ${C.red},0 0 48px ${C.red},0 0 72px ${C.red}44} }
    @keyframes pixelBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes pixelFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-8px) rotate(-2deg)} 66%{transform:translateY(-4px) rotate(2deg)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideL { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideR { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
    @keyframes crisisPulse { 0%,100%{box-shadow:0 0 20px ${C.redGlow},inset 0 0 20px ${C.redMid}} 50%{box-shadow:0 0 40px rgba(255,45,32,0.6),inset 0 0 40px rgba(255,45,32,0.2)} }
    @keyframes comboAnim { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.4)} 100%{transform:scale(1);opacity:1} }
    @keyframes glitch { 0%,90%,100%{clip-path:none;transform:none} 91%{clip-path:inset(20% 0 40% 0);transform:skewX(-4deg)} 93%{clip-path:inset(60% 0 10% 0);transform:skewX(3deg)} 95%{clip-path:inset(40% 0 55% 0);transform:skewX(-2deg)} }
    @keyframes scanH { from{top:-100%} to{top:200%} }
    @keyframes borderMarch { 0%{border-color:${C.red}} 50%{border-color:#ff6b5b} 100%{border-color:${C.red}} }
    @keyframes charIdle { 0%,100%{transform:translateY(0) scaleX(1)} 25%{transform:translateY(-3px) scaleX(0.97)} 75%{transform:translateY(1px) scaleX(1.03)} }

    .pbtn {
      font-family:'Press Start 2P',monospace;
      background:${C.red};
      color:#fff;
      border:none;
      outline:none;
      box-shadow:4px 4px 0 ${C.redDark},0 0 16px ${C.redGlow};
      cursor:pointer;
      transition:transform .08s,box-shadow .08s;
      image-rendering:pixelated;
    }
    .pbtn:hover { transform:translate(2px,2px); box-shadow:2px 2px 0 ${C.redDark},0 0 24px ${C.redGlow}; }
    .pbtn:active { transform:translate(4px,4px); box-shadow:none; }
    .pbtn:disabled { opacity:.5; cursor:not-allowed; transform:none; }

    .opt {
      font-family:'Press Start 2P',monospace;
      background:#0c0c0c;
      color:${C.text};
      border:2px solid #1e1e1e;
      box-shadow:3px 3px 0 #0a0a0a;
      cursor:pointer;
      text-align:left;
      width:100%;
      transition:all .1s;
      position:relative;
      overflow:hidden;
    }
    .opt::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,transparent 50%,rgba(255,45,32,0.04)); pointer-events:none; }
    .opt:not(.dis):hover { border-color:${C.red}; box-shadow:3px 3px 0 ${C.redDark},0 0 12px ${C.redGlow}; transform:translate(-2px,-2px); background:#120505; }
    .opt.ok { border-color:${C.green}!important; box-shadow:3px 3px 0 #166534,0 0 16px ${C.greenGlow}!important; background:#040f07!important; }
    .opt.bad { border-color:${C.red}!important; background:#0f0404!important; animation:shake .4s ease; }
    .opt.dis { opacity:.3; cursor:not-allowed; }

    .inp {
      font-family:'Press Start 2P',monospace;
      font-size:8px;
      background:#0c0c0c;
      color:${C.text};
      border:2px solid #222;
      padding:12px;
      width:100%;
      outline:none;
      transition:border-color .2s,box-shadow .2s;
    }
    .inp:focus { border-color:${C.red}; box-shadow:0 0 10px ${C.redGlow}; }
    .inp::placeholder { color:#333; }
  `;

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (screen === "intro") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <AnimatedBg crisis={false} />
      <CRT />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 640, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Studio label */}
        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(6px,1.5vw,8px)", color: C.muted, letterSpacing: 5, marginBottom: 20, textAlign: "center" }}>
          ГИПОТЕЗА AGENCY PRESENTS
        </div>

        {/* Title with glitch */}
        <div style={{ position: "relative", textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(28px,9vw,56px)", color: C.red, animation: "introGlow 2s ease-in-out infinite, glitch 6s steps(1) infinite", lineHeight: 1.1, letterSpacing: 2 }}>
            ВЕБИНАР
          </div>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(28px,9vw,56px)", color: C.text, lineHeight: 1.1, letterSpacing: 2 }}>
            РАШ
          </div>
        </div>

        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(6px,1.8vw,8px)", color: C.muted, letterSpacing: 4, marginBottom: 36, textAlign: "center" }}>
          CMO SIMULATOR v3.0
        </div>

        {/* Characters stage */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginBottom: 32, padding: "20px 32px", background: "#080808", border: `2px solid #1a1a1a`, boxShadow: `0 0 30px ${C.redMid}`, position: "relative", overflow: "hidden" }}>
          {/* Stage floor */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${C.red}44, transparent)` }} />
          {/* Spotlight CMO */}
          <div style={{ position: "absolute", left: "20%", top: 0, width: 80, height: "100%", background: "radial-gradient(ellipse at 50% 0%, rgba(255,45,32,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          {/* Spotlight CEO */}
          <div style={{ position: "absolute", right: "20%", top: 0, width: 80, height: "100%", background: "radial-gradient(ellipse at 50% 0%, rgba(250,204,21,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ animation: "charIdle 2s ease-in-out infinite" }}>
              <CMOChar mood="idle" scale={2.5} />
            </div>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.red }}>ВЫ — CMO</div>
          </div>

          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 14, color: C.red, textShadow: `0 0 12px ${C.red}`, animation: "blink 1s steps(1) infinite", alignSelf: "center" }}>VS</div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ animation: "pixelFloat 3s ease-in-out infinite" }}>
              <CEOChar angry={false} scale={2.5} />
            </div>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.yellow }}>CEO-БОСС</div>
          </div>
        </div>

        {/* Brief */}
        <div style={{ border: `2px solid ${C.red}`, boxShadow: `0 0 24px ${C.redGlow}, 4px 4px 0 ${C.redDark}`, background: "#0c0c0c", padding: "18px 20px", marginBottom: 24, width: "100%", position: "relative" }}>
          <div style={{ position: "absolute", top: -10, left: 16, background: C.bg, padding: "0 8px", fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: C.red }}>БРИФИНГ</div>
          {/* scan line effect */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.red}22, transparent)`, animation: "scanH 3s linear infinite" }} />
          </div>
          <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(7px,2vw,8px)", color: C.text, lineHeight: 2.5, margin: 0, position: "relative" }}>
            Ты — CMO онлайн-школы.<br />
            <span style={{ color: C.red }}>30 дней. 500K бюджета. 7 кризисов.</span><br /><br />
            Каждое решение — реальная ситуация.<br />
            Таймер давит. CEO злится.<br />
            Один неверный выбор — теряешь жизнь.<br /><br />
            <span style={{ color: C.yellow }}>Сложность: EXPERT / NIGHTMARE</span>
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 28, width: "100%" }}>
          {[
            { icon: "💰", val: "500K ₽", lbl: "БЮДЖЕТ", c: C.yellow },
            { icon: "⚡", val: "7", lbl: "СЦЕН.", c: C.red },
            { icon: "♥", val: "3", lbl: "ЖИЗНИ", c: C.red },
            { icon: "🔥", val: "x6", lbl: "МАКС COMBO", c: C.orange },
          ].map(s => (
            <div key={s.lbl} style={{ border: `2px solid ${s.c}33`, background: "#0c0c0c", padding: "10px 6px", textAlign: "center", boxShadow: `0 0 8px ${s.c}22` }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 10, color: s.c, marginBottom: 3 }}>{s.val}</div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: C.muted }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        <button className="pbtn" style={{ fontSize: "clamp(10px,3vw,12px)", padding: "18px 52px", marginBottom: 14 }} onClick={() => setScreen("game")}>
          <Blink>▶ НАЧАТЬ ИГРУ</Blink>
        </button>

        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted, textAlign: "center" }}>
          Powered by ГИПОТЕЗА agency
        </div>
      </div>
    </div>
  );

  // ── GAME ──────────────────────────────────────────────────────────────────
  if (screen === "game") {
    const optIdx = scene.options.findIndex(o => o.isOptimal);
    const chosenOpt = chosen !== null ? scene.options[chosen] : null;
    const isGood = chosen === optIdx;

    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <style>{css}</style>
        <AnimatedBg crisis={isCrisis} />
        <CRT />
        <Bursts list={bursts} />

        {/* ── HUD TOP ── */}
        <div style={{
          background: "#080808", borderBottom: `3px solid ${isCrisis ? C.red : "#1a1a1a"}`,
          padding: "8px 14px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          position: "relative", zIndex: 10,
          animation: isCrisis ? "crisisPulse 1.2s ease-in-out infinite" : "none",
        }}>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: C.red, textShadow: `0 0 8px ${C.red}`, letterSpacing: 2 }}>
            ВЕБИНАР РАШ
          </div>

          {/* progress */}
          <div style={{ flex: 1, minWidth: 60, height: 8, background: "#111", border: `1px solid #1e1e1e`, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: C.red, boxShadow: `0 0 6px ${C.red}`, transition: "width .5s steps(14)" }} />
          </div>

          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: C.text }}>
            ДЕНЬ {scene.day}/30
          </div>

          {/* lives */}
          <div style={{ display: "flex", gap: 2 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ fontSize: 13, color: C.red, opacity: i < lives ? 1 : 0.12, textShadow: i < lives ? `0 0 8px ${C.red}` : "none", transition: "opacity .3s" }}>♥</span>
            ))}
          </div>

          {/* combo */}
          {combo >= 2 && (
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: C.yellow, textShadow: `0 0 8px ${C.yellow}`, animation: "comboAnim .3s ease" }}>
              x{combo}🔥
            </div>
          )}

          {/* score */}
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: C.yellow }}>
            {score.toLocaleString()}
          </div>

          {/* difficulty */}
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.bg, background: diffColor[scene.difficulty], padding: "3px 7px" }}>
            {scene.difficulty}
          </div>

          {/* phase */}
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: isCrisis ? C.red : C.muted, border: `1px solid ${isCrisis ? C.red : "#222"}`, padding: "3px 7px", animation: isCrisis ? "borderMarch 1s ease-in-out infinite" : "none" }}>
            {isCrisis ? "⚠ КРИЗИС" : scene.phase}
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 800, margin: "0 auto", width: "100%", padding: "12px 14px", gap: 12, position: "relative", zIndex: 10 }}>

          {/* Stat bars */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            <Bar val={budget} max={500000} color={budget < 80000 ? C.red : C.yellow} label="БЮДЖЕТ" icon="💰" />
            <Bar val={Math.max(0, romi)} max={200} color={romi >= 100 ? C.green : romi >= 50 ? C.yellow : C.red} label="ROMI %" icon="📈" />
            <Bar val={conv} max={40} color={C.blue} label="КОНВЕРСИЯ" icon="🎯" />
          </div>

          {/* Timer */}
          {chosen === null && typeDone && (
            <div style={{ animation: "fadeUp .3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted }}>
                  {isCrisis ? "⚠ КРИЗИС — РЕШАЙ БЫСТРО" : "⏱ ВРЕМЯ НА РЕШЕНИЕ"}
                </span>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 10, color: timerColor, textShadow: timeLeft <= 5 ? `0 0 8px ${C.red}` : "none", animation: timeLeft <= 5 ? "blink .4s steps(1) infinite" : "none" }}>
                  {timeLeft}s
                </span>
              </div>
              <div style={{ height: 10, background: "#080808", border: `2px solid ${timerColor}33`, overflow: "hidden" }}>
                <div style={{ width: `${timerPct}%`, height: "100%", background: timerColor, boxShadow: `0 0 8px ${timerColor}`, transition: "width 1s linear, background .3s" }} />
              </div>
            </div>
          )}

          {/* Scene title */}
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(7px,2vw,9px)", color: isCrisis ? C.red : C.yellow, textShadow: isCrisis ? `0 0 8px ${C.red}` : "none", animation: "fadeUp .3s ease" }}>
            {scene.title}
          </div>

          {/* Characters + dialogue */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", animation: "fadeUp .4s ease" }}>
            {/* CMO */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ animation: showRes ? "none" : "charIdle 2s ease-in-out infinite" }}>
                <CMOChar mood={showRes ? (isGood ? "win" : "lose") : "think"} scale={1.8} />
              </div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: C.muted }}>CMO</div>
            </div>

            {/* Dialogue box */}
            <div style={{
              flex: 1, border: `2px solid ${isCrisis ? C.red : "#252525"}`,
              boxShadow: isCrisis ? `0 0 20px ${C.redGlow}, 3px 3px 0 ${C.redDark}` : `3px 3px 0 #111`,
              background: "#0c0c0c", padding: "12px 14px", position: "relative", overflow: "hidden",
              animation: isCrisis ? "crisisPulse 1.5s ease-in-out infinite" : "none",
            }}>
              {/* bubble tail */}
              <div style={{ position: "absolute", left: -8, top: 14, width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderRight: `8px solid ${isCrisis ? C.red : "#252525"}` }} />
              {/* scan line */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.red}18,transparent)`, animation: "scanH 4s linear infinite" }} />
              </div>
              {isCrisis && (
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: C.red, marginBottom: 8, textShadow: `0 0 8px ${C.red}`, animation: "blink .5s steps(1) infinite" }}>
                  ⚠ КРИЗИСНАЯ СИТУАЦИЯ
                </div>
              )}
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(6px,1.8vw,8px)", color: C.text, lineHeight: 2.4, position: "relative" }}>
                {typeOut}
                {!typeDone && <Blink ms={350}>█</Blink>}
              </div>
              {typeDone && (
                <div style={{ marginTop: 10, padding: "8px 10px", background: "#080808", border: `1px solid #1a1a1a`, fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted, lineHeight: 2.2, animation: "fadeUp .4s ease" }}>
                  📊 {scene.metrics}
                </div>
              )}
            </div>

            {/* CEO */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ animation: "pixelFloat 2.5s ease-in-out infinite" }}>
                <CEOChar angry={isCrisis || (showRes && !isGood)} scale={1.8} />
              </div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: C.muted }}>CEO</div>
            </div>
          </div>

          {/* Options */}
          {!showRes && typeDone && (
            <div style={{ display: "flex", flexDirection: "column", gap: 7, animation: "slideL .4s ease" }}>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted }}>▶ ВЫБЕРИТЕ СТРАТЕГИЮ:</div>
              {scene.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                  <button key={i} className={`opt${chosen !== null ? " dis" : ""}`}
                    style={{ padding: "10px 12px", fontSize: "clamp(6px,1.8vw,7px)", lineHeight: 2 }}
                    onClick={(e) => { spawnBurst(e.clientX, e.clientY, opt.isOptimal); pick(i); }}
                    disabled={chosen !== null}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: C.red, flexShrink: 0 }}>{letter}.</span>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{opt.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 3 }}>{opt.label}</div>
                        <div style={{ fontSize: 6, color: C.muted, lineHeight: 1.8 }}>{opt.detail}</div>
                      </div>
                      <span style={{ flexShrink: 0, fontSize: 6, color: opt.delta.budget < 0 ? C.red : C.muted }}>
                        {opt.delta.budget !== 0 ? `${opt.delta.budget > 0 ? "+" : ""}${(opt.delta.budget / 1000).toFixed(0)}K` : ""}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Result */}
          {showRes && chosenOpt && (
            <div style={{ animation: "fadeUp .4s ease", position: "relative" }}>
              {/* Score popup */}
              {scoreAnim.show && (
                <div style={{ position: "absolute", top: -36, left: "50%", fontFamily: "'Press Start 2P',monospace", fontSize: 13, color: isGood ? C.green : C.red, textShadow: `0 0 10px ${isGood ? C.green : C.red}`, animation: "floatUp 1.2s ease-out forwards", pointerEvents: "none", zIndex: 100 }}>
                  {scoreAnim.val > 0 ? `+${scoreAnim.val}` : scoreAnim.val}
                </div>
              )}

              {/* Chosen + optimal highlight */}
              <div style={{ marginBottom: 8, display: "flex", flexDirection: "column", gap: 5 }}>
                {scene.options.map((opt, i) => {
                  const isChosen = i === chosen;
                  const isOpt = opt.isOptimal;
                  if (!isChosen && !isOpt) return null;
                  return (
                    <div key={i} className={`opt ${isOpt ? "ok" : "bad"}`} style={{ padding: "8px 12px", fontSize: 7, cursor: "default" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{opt.icon} {opt.label}</span>
                        <span style={{ fontSize: 8, color: isOpt ? C.green : C.red }}>{isOpt ? "✓ ОПТИМАЛЬНО" : "✗ ОШИБКА"}</span>
                      </div>
                      {opt.trap && !isOpt && (
                        <div style={{ marginTop: 5, fontSize: 6, color: C.red, opacity: 0.8 }}>⚠ {opt.trap}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Consequence */}
              <div style={{ border: `2px solid ${isGood ? C.green : C.red}`, boxShadow: `0 0 14px ${isGood ? C.greenGlow : C.redGlow}`, background: "#0a0a0a", padding: "12px 14px", marginBottom: 8 }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted, marginBottom: 7 }}>
                  {isGood ? "✓ РЕЗУЛЬТАТ:" : "✗ ПОСЛЕДСТВИЯ:"}
                </div>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(6px,1.8vw,7px)", color: C.text, lineHeight: 2.4, marginBottom: 10 }}>
                  {chosenOpt.consequence}
                </div>
                <div style={{ padding: "8px 10px", background: "#0c0c0c", border: `1px solid ${C.red}33`, fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.red, lineHeight: 2.2 }}>
                  💡 {scene.insight}
                </div>
              </div>

              {/* Delta */}
              <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
                {[
                  { l: "ROMI", v: chosenOpt.delta.romi, s: "%" },
                  { l: "БЮДЖЕТ", v: chosenOpt.delta.budget / 1000, s: "K" },
                  { l: "КОНВЕРС.", v: chosenOpt.delta.conv, s: "%" },
                  { l: "ОЧКИ", v: scoreAnim.val, s: "" },
                ].map(d => (
                  <div key={d.l} style={{ flex: 1, minWidth: 70, border: `1px solid #1a1a1a`, background: "#0c0c0c", padding: "7px 5px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: C.muted, marginBottom: 4 }}>{d.l}</div>
                    <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 10, color: d.v >= 0 ? C.green : C.red }}>
                      {d.v >= 0 ? "+" : ""}{d.v.toFixed(0)}{d.s}
                    </div>
                  </div>
                ))}
              </div>

              <button className="pbtn" style={{ fontSize: 8, padding: "13px 20px", width: "100%" }} onClick={next}>
                {isLast || lives <= 0 ? "▶ ЗАВЕРШИТЬ ЗАПУСК" : `▶ ДЕНЬ ${SCENES[Math.min(idx + 1, SCENES.length - 1)]?.day || 30} →`}
              </button>
            </div>
          )}
        </div>

        {/* Bottom status bar */}
        <div style={{ borderTop: `2px solid #141414`, padding: "7px 14px", display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 10, background: "#060606" }}>
          {[
            { l: "БЮДЖЕТ", v: `${(budget / 1000).toFixed(0)}K ₽`, c: budget < 80000 ? C.red : C.yellow },
            { l: "ROMI", v: `${romi}%`, c: romi >= 100 ? C.green : romi >= 0 ? C.yellow : C.red },
            { l: "КОНВЕРСИЯ", v: `${conv.toFixed(1)}%`, c: C.blue },
            { l: "ОЧКИ", v: score.toLocaleString(), c: C.yellow },
            { l: "COMBO", v: combo >= 2 ? `x${combo}🔥` : "—", c: C.orange },
          ].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: C.muted }}>{s.l}</div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── END SCREEN ────────────────────────────────────────────────────────────
  const rank =
    score >= 2800 ? { title: "⭐⭐⭐ МАРКЕТИНГ-ЛЕГЕНДА", sub: "Ты переиграл CEO и рынок", c: C.green } :
    score >= 1800 ? { title: "⭐⭐ СИЛЬНЫЙ CMO", sub: "CEO доволен. Бюджет сохранён", c: C.yellow } :
    score >= 900  ? { title: "⭐ РАСТУЩИЙ CMO", sub: "Есть потенциал, но воронка дырявая", c: C.orange } :
                    { title: "💀 СТАЖЁР МАРКЕТИНГА", sub: "CEO урезал бюджет. Ищи новую работу", c: C.red };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <AnimatedBg crisis={!isWin} />
      <CRT />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 640, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(13px,4.5vw,22px)", color: isWin ? C.green : C.red, textShadow: `0 0 16px ${isWin ? C.green : C.red}`, marginBottom: 6, textAlign: "center", animation: "introGlow 2s ease-in-out infinite" }}>
          {isWin ? "ЗАПУСК УДАЛСЯ!" : "ПРОВАЛ ЗАПУСКА"}
        </div>
        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: C.muted, marginBottom: 24, textAlign: "center" }}>
          {isWin ? "Ты доказал CEO что маркетинг работает" : "CEO урезал бюджет. Следующий квартал под угрозой"}
        </div>

        {/* Final character */}
        <div style={{ marginBottom: 20, animation: "charIdle 1.5s ease-in-out infinite" }}>
          <CMOChar mood={isWin ? "win" : "lose"} scale={3} />
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, width: "100%", marginBottom: 16 }}>
          {[
            { l: "ИТОГОВЫЙ ROMI", v: `${romi}%`, c: romi >= 100 ? C.green : romi >= 50 ? C.yellow : C.red, i: "📈" },
            { l: "ОСТАТОК БЮДЖЕТА", v: `${(budget / 1000).toFixed(0)}K ₽`, c: C.yellow, i: "💰" },
            { l: "КОНВЕРСИЯ", v: `${conv.toFixed(1)}%`, c: C.blue, i: "🎯" },
            { l: "ИТОГОВЫЙ СЧЁТ", v: score.toLocaleString(), c: C.yellow, i: "⭐" },
          ].map(s => (
            <div key={s.l} style={{ border: `2px solid ${s.c}44`, background: "#0c0c0c", padding: "14px", textAlign: "center", boxShadow: `0 0 12px ${s.c}22` }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.i}</div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(10px,3vw,14px)", color: s.c, marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: C.muted }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Rank */}
        <div style={{ border: `2px solid ${rank.c}`, background: "#0c0c0c", padding: "14px 20px", marginBottom: 16, width: "100%", textAlign: "center", boxShadow: `0 0 20px ${rank.c}44` }}>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted, marginBottom: 8 }}>РАНГ CMO</div>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(8px,2.5vw,11px)", color: rank.c, marginBottom: 6 }}>{rank.title}</div>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted }}>{rank.sub}</div>
        </div>

        {/* Lead form */}
        {!formSent ? (
          <div style={{ border: `2px solid ${C.red}`, background: "#0c0c0c", padding: "18px", width: "100%", marginBottom: 14, boxShadow: `0 0 24px ${C.redGlow}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
              <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.red}22,transparent)`, animation: "scanH 3s linear infinite" }} />
            </div>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: C.red, marginBottom: 6, textShadow: `0 0 8px ${C.red}`, position: "relative" }}>
              ХОЧЕШЬ ТАКОЙ ROMI В РЕАЛЬНОСТИ?
            </div>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted, marginBottom: 14, lineHeight: 2.2, position: "relative" }}>
              Разберём твою воронку бесплатно за 30 минут.<br />
              Покажем где теряются деньги прямо сейчас.
            </div>
            <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: 9, position: "relative" }}>
              <input className="inp" placeholder="ИМЯ" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} required />
              <input className="inp" placeholder="ТЕЛЕФОН" type="tel" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} required />
              <input className="inp" placeholder="EMAIL" type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} required />
              <button className="pbtn" type="submit" style={{ fontSize: 8, padding: "13px", marginTop: 3 }} disabled={formLoading}>
                {formLoading ? <Blink>ОТПРАВКА...</Blink> : "▶ РАЗОБРАТЬ МОЮ ВОРОНКУ"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ border: `2px solid ${C.green}`, background: "#040f07", padding: "18px", width: "100%", marginBottom: 14, textAlign: "center", boxShadow: `0 0 20px ${C.greenGlow}` }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>✓</div>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: C.green, marginBottom: 8 }}>ЗАЯВКА ПРИНЯТА!</div>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted, lineHeight: 2.2 }}>
              Свяжемся в течение 2 часов.<br />Готовься к разбору воронки.
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, width: "100%", flexWrap: "wrap" }}>
          <button className="pbtn" style={{ flex: 1, fontSize: 7, padding: "12px" }} onClick={restart}>↺ ИГРАТЬ СНОВА</button>
          <button className="pbtn" style={{ flex: 1, fontSize: 7, padding: "12px", background: "#0c0c0c", boxShadow: `2px 2px 0 ${C.redDark}` }} onClick={() => window.location.href = "/"}>← НА САЙТ</button>
        </div>

        <div style={{ marginTop: 18, fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: C.muted, textAlign: "center" }}>
          Powered by ГИПОТЕЗА agency
        </div>
      </div>
    </div>
  );
}
