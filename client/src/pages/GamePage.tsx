import { useState, useEffect, useRef, useCallback } from "react";

// ─── Google Pixel Font ────────────────────────────────────────────────────────
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";

// ─── Brand palette ────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0a",
  card: "#111111",
  border: "#1e1e1e",
  red: "#ff2d20",
  redDark: "#c41f14",
  redGlow: "rgba(255,45,32,0.35)",
  text: "#f5f5f0",
  muted: "rgba(245,245,240,0.5)",
  green: "#22c55e",
  yellow: "#facc15",
  blue: "#60a5fa",
  white: "#ffffff",
};

// ─── Neon glow helper ─────────────────────────────────────────────────────────
const glow = (color: string, size = 8) =>
  `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}44`;

// ─── GAME DATA — nонлинейные сценарии с ветвлением ───────────────────────────
interface Option {
  label: string;
  icon: string;
  consequence: string;
  delta: { romi: number; budget: number; conv: number; score: number };
  nextScenario?: number; // branching
  isOptimal: boolean;
}

interface Scenario {
  id: number;
  day: number;
  phase: string; // PREP / LAUNCH / LIVE / POST
  crisis?: boolean; // red alert mode
  situation: string;
  context: string; // extra detail
  options: Option[];
  gipotezaInsight: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 0,
    day: 2,
    phase: "PREP",
    situation: "Лендинг вебинара готов. CR в регистрацию — 6%. Цель: 25%+.",
    context: "Трафик идёт, но люди уходят с лендинга. Бюджет тает.",
    gipotezaInsight: "Гипотеза: A/B тест заголовка + оффера даёт +12–18% к CR за 48 часов",
    options: [
      {
        label: "A/B тест: 3 варианта оффера",
        icon: "🧪",
        consequence: "CR вырос до 23%. Данные показали что боль «не окупить трафик» работает лучше всего.",
        delta: { romi: 30, budget: -12000, conv: 17, score: 300 },
        isOptimal: true,
      },
      {
        label: "Залить больше трафика",
        icon: "💸",
        consequence: "Регистраций больше, но CR остался 6%. Бюджет сгорел на 120К.",
        delta: { romi: -15, budget: -120000, conv: 2, score: 50 },
        nextScenario: 1,
        isOptimal: false,
      },
      {
        label: "Сменить дизайн лендинга",
        icon: "🎨",
        consequence: "Дизайн стал красивее, но CR вырос только до 9%. Потеряли 2 дня.",
        delta: { romi: 5, budget: -30000, conv: 3, score: 100 },
        isOptimal: false,
      },
      {
        label: "Подождать — само пройдёт",
        icon: "⏳",
        consequence: "CR упал до 4%. Алгоритмы решили что оффер нерелевантен.",
        delta: { romi: -25, budget: 0, conv: -2, score: 0 },
        isOptimal: false,
      },
    ],
  },
  {
    id: 1,
    day: 5,
    phase: "PREP",
    crisis: true,
    situation: "КРИЗИС: Конкурент запустил похожий вебинар на ту же дату!",
    context: "Аудитория видит два похожих предложения. Нужно срочно отстроиться.",
    gipotezaInsight: "Гипотеза: Позиционирование через конкретный результат + гарантию отличает от конкурентов",
    options: [
      {
        label: "Добавить гарантию результата",
        icon: "🛡️",
        consequence: "«Гарантируем +20% к конверсии или вернём деньги» — регистрации выросли на 40%.",
        delta: { romi: 35, budget: -5000, conv: 12, score: 350 },
        isOptimal: true,
      },
      {
        label: "Снизить цену флагмана",
        icon: "🏷️",
        consequence: "Продажи выросли, но маржа упала. ROMI снизился.",
        delta: { romi: -20, budget: 0, conv: 5, score: 80 },
        isOptimal: false,
      },
      {
        label: "Атаковать конкурента в соцсетях",
        icon: "⚔️",
        consequence: "Скандал привлёк внимание, но репутация пострадала. Часть аудитории ушла.",
        delta: { romi: -10, budget: -20000, conv: -3, score: 30 },
        isOptimal: false,
      },
    ],
  },
  {
    id: 2,
    day: 9,
    phase: "LAUNCH",
    situation: "500 регистраций. Доходимость на вебинар — 11%. Норма: 30%+.",
    context: "Люди зарегистрировались, но не приходят. Воронка дырявая.",
    gipotezaInsight: "Гипотеза: Мессенджер-цепочка из 5 касаний поднимает доходимость до 35–45%",
    options: [
      {
        label: "Мессенджер-цепочка: 5 касаний",
        icon: "📲",
        consequence: "Open rate 78%. Доходимость выросла до 38%. Люди пришли прогретые.",
        delta: { romi: 40, budget: -18000, conv: 22, score: 400 },
        isOptimal: true,
      },
      {
        label: "Email-рассылка напоминание",
        icon: "📧",
        consequence: "Open rate 18%. Доходимость выросла до 17%. Слабо.",
        delta: { romi: 8, budget: -5000, conv: 6, score: 120 },
        isOptimal: false,
      },
      {
        label: "Звонки менеджеров всем 500",
        icon: "📞",
        consequence: "Дорого и медленно. Дозвонились до 120 человек. Доходимость 22%.",
        delta: { romi: 5, budget: -80000, conv: 11, score: 90 },
        isOptimal: false,
      },
      {
        label: "Ничего — кто хотел придёт",
        icon: "🤷",
        consequence: "Пришло 55 человек из 500. Деньги на трафик выброшены.",
        delta: { romi: -30, budget: 0, conv: -5, score: 0 },
        isOptimal: false,
      },
    ],
  },
  {
    id: 3,
    day: 13,
    phase: "LIVE",
    crisis: true,
    situation: "КРИЗИС: Вебинар идёт. Через 20 мин — технический сбой! Трансляция упала.",
    context: "300 человек онлайн. Паника в чате. Нужно решить за 60 секунд.",
    gipotezaInsight: "Гипотеза: Честность + быстрый переход в Telegram сохраняет 70% аудитории",
    options: [
      {
        label: "Telegram: «Переходим сюда сейчас!»",
        icon: "✈️",
        consequence: "240 человек перешли в Telegram. Вебинар продолжился. Аудитория оценила честность.",
        delta: { romi: 25, budget: -3000, conv: 8, score: 380 },
        isOptimal: true,
      },
      {
        label: "Молчать и чинить 30 минут",
        icon: "🔧",
        consequence: "Большинство ушло. Осталось 80 человек. Конверсия упала.",
        delta: { romi: -25, budget: -15000, conv: -10, score: 40 },
        isOptimal: false,
      },
      {
        label: "Перенести вебинар на завтра",
        icon: "📅",
        consequence: "Пришло только 120 из 300. Половина аудитории потеряна.",
        delta: { romi: -15, budget: -10000, conv: -5, score: 70 },
        isOptimal: false,
      },
    ],
  },
  {
    id: 4,
    day: 16,
    phase: "POST",
    situation: "Вебинар завершён. Конверсия в продажу — 1.8%. Цель: 8%+.",
    context: "Люди посмотрели, но не купили. Нужен дожим.",
    gipotezaInsight: "Гипотеза: OTO сразу после вебинара + автоворонка дожима = конверсия 7–12%",
    options: [
      {
        label: "OTO 990₽ + автоворонка 7 дней",
        icon: "🎁",
        consequence: "OTO купили 23%. Из них 18% дошли до флагмана. Конверсия 8.4%.",
        delta: { romi: 55, budget: -15000, conv: 25, score: 500 },
        isOptimal: true,
      },
      {
        label: "Скидка 40% на флагман 24 часа",
        icon: "⚡",
        consequence: "Продажи выросли, но маржа упала на 40%. ROMI почти не изменился.",
        delta: { romi: -10, budget: 0, conv: 8, score: 100 },
        isOptimal: false,
      },
      {
        label: "Запустить ретаргетинг на всех",
        icon: "🎯",
        consequence: "Потратили 60К на ретаргетинг. Конверсия 3.2%. Дорого.",
        delta: { romi: 5, budget: -60000, conv: 5, score: 120 },
        isOptimal: false,
      },
      {
        label: "Позвонить лично топ-лидам",
        icon: "🤝",
        consequence: "Закрыли 12 сделок вручную. Но масштаб нулевой.",
        delta: { romi: 10, budget: -30000, conv: 4, score: 150 },
        isOptimal: false,
      },
    ],
  },
  {
    id: 5,
    day: 22,
    phase: "POST",
    crisis: true,
    situation: "КРИЗИС: CEO требует отчёт. ROMI ниже плана. Бюджет на следующий квартал под угрозой.",
    context: "У тебя 1 час на подготовку. Как защищаешь маркетинг?",
    gipotezaInsight: "Гипотеза: Данные + план оптимизации = доверие CEO и новый бюджет",
    options: [
      {
        label: "Дашборд: данные + план роста",
        icon: "📊",
        consequence: "CEO увидел потенциал. Бюджет увеличен на 30%. Следующий запуск будет мощнее.",
        delta: { romi: 20, budget: 150000, conv: 5, score: 450 },
        isOptimal: true,
      },
      {
        label: "Объяснить устно — «всё под контролем»",
        icon: "🗣️",
        consequence: "CEO не убеждён. Бюджет урезан на 20%.",
        delta: { romi: -10, budget: -100000, conv: 0, score: 50 },
        isOptimal: false,
      },
      {
        label: "Переложить вину на продукт",
        icon: "😤",
        consequence: "Конфликт между отделами. Команда демотивирована. Следующий запуск провален.",
        delta: { romi: -30, budget: -50000, conv: -5, score: 0 },
        isOptimal: false,
      },
    ],
  },
  {
    id: 6,
    day: 28,
    phase: "POST",
    situation: "Финальный анализ. Как масштабировать следующий запуск?",
    context: "Первый запуск завершён. Нужно выбрать стратегию роста.",
    gipotezaInsight: "Гипотеза: Продуктовая линейка OTO→Флагман→Апселл = x3 к LTV клиента",
    options: [
      {
        label: "Строим продуктовую линейку",
        icon: "🏗️",
        consequence: "OTO + Флагман + Апселл. LTV вырос в 3 раза. Трафик окупается с первого касания.",
        delta: { romi: 60, budget: -20000, conv: 15, score: 600 },
        isOptimal: true,
      },
      {
        label: "Удваиваем бюджет на трафик",
        icon: "🚀",
        consequence: "Больше трафика в дырявую воронку. ROMI упал ещё ниже.",
        delta: { romi: -20, budget: -200000, conv: 3, score: 60 },
        isOptimal: false,
      },
      {
        label: "Нанимаем ещё одного маркетолога",
        icon: "👤",
        consequence: "ФОТ вырос, результат тот же. Проблема не в людях — в системе.",
        delta: { romi: 0, budget: -80000, conv: 2, score: 80 },
        isOptimal: false,
      },
    ],
  },
];

// ─── Canvas animated background ──────────────────────────────────────────────
function AnimatedBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Pixel grid particles
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    const COLORS = ["#ff2d20", "#c41f14", "#ff6b5b", "#ffffff"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.floor(Math.random() * 3 + 1) * 2,
        alpha: Math.random() * 0.4 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    // Grid lines
    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Moving grid
      const gridSize = 40;
      const offset = (frame * 0.3) % gridSize;
      ctx.strokeStyle = "rgba(255,45,32,0.06)";
      ctx.lineWidth = 1;
      for (let x = -gridSize + offset; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = -gridSize + offset; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Particles
      particles.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });

      ctx.globalAlpha = 1;
      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

// ─── Scanlines ────────────────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998,
      background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)",
    }} />
  );
}

// ─── CRT vignette ─────────────────────────────────────────────────────────────
function Vignette() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9997,
      background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)",
    }} />
  );
}

// ─── Pixel explosion particles ────────────────────────────────────────────────
interface Burst { id: number; x: number; y: number; color: string }
function BurstEffect({ bursts }: { bursts: Burst[] }) {
  return (
    <>
      {bursts.map((b) => (
        <div key={b.id} style={{ position: "fixed", left: b.x, top: b.y, pointerEvents: "none", zIndex: 9990 }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const dist = 40 + Math.random() * 30;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 6, height: 6,
                  background: b.color,
                  animation: `burst${b.id % 3} 0.6s ease-out forwards`,
                  "--dx": `${Math.cos(angle) * dist}px`,
                  "--dy": `${Math.sin(angle) * dist}px`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

// ─── Animated CMO character (CSS pixel art) ───────────────────────────────────
function CMOSprite({ state, size = 1 }: { state: "idle" | "win" | "lose" | "think"; size?: number }) {
  const scale = size;
  const px = (n: number) => n * 4 * scale;

  const faceColor = "#c8956c";
  const hairColor = "#2a1a0a";
  const suitColor = "#1a1a1a";
  const lapelColor = "#252525";
  const tieColor = C.red;
  const pantsColor = "#222";
  const shoeColor = "#111";

  const eyeColor = state === "lose" ? C.red : state === "win" ? C.green : "#111";
  const mouthY = state === "lose" ? 5 : 4;
  const armOffset = state === "win" ? -3 : 0;

  return (
    <svg
      width={px(16)} height={px(22)}
      viewBox="0 0 16 22"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", filter: state === "win" ? `drop-shadow(0 0 8px ${C.green})` : state === "lose" ? `drop-shadow(0 0 8px ${C.red})` : `drop-shadow(0 0 4px ${C.red}44)` }}
    >
      {/* head */}
      <rect x="5" y="0" width="6" height="6" fill={faceColor} />
      {/* hair */}
      <rect x="5" y="0" width="6" height="1" fill={hairColor} />
      <rect x="5" y="1" width="1" height="1" fill={hairColor} />
      <rect x="10" y="1" width="1" height="1" fill={hairColor} />
      {/* eyes */}
      <rect x="6" y="2" width="1" height="1" fill={eyeColor} />
      <rect x="9" y="2" width="1" height="1" fill={eyeColor} />
      {/* thinking eyebrow */}
      {state === "think" && <><rect x="6" y="1" width="2" height="1" fill={hairColor} /><rect x="9" y="1" width="2" height="1" fill={hairColor} /></>}
      {/* mouth */}
      {state === "lose"
        ? <><rect x="6" y={mouthY} width="1" height="1" fill="#8b4513" /><rect x="9" y={mouthY} width="1" height="1" fill="#8b4513" /><rect x="7" y={mouthY + 1} width="2" height="1" fill="#8b4513" /></>
        : state === "win"
        ? <><rect x="6" y={mouthY} width="4" height="1" fill="#8b4513" /><rect x="6" y={mouthY - 1} width="1" height="1" fill="#8b4513" /><rect x="9" y={mouthY - 1} width="1" height="1" fill="#8b4513" /></>
        : <rect x="7" y={mouthY} width="2" height="1" fill="#8b4513" />}
      {/* neck */}
      <rect x="7" y="6" width="2" height="1" fill={faceColor} />
      {/* suit body */}
      <rect x="4" y="7" width="8" height="7" fill={suitColor} />
      {/* lapels */}
      <rect x="4" y="7" width="2" height="4" fill={lapelColor} />
      <rect x="10" y="7" width="2" height="4" fill={lapelColor} />
      {/* tie */}
      <rect x="7" y="7" width="2" height="5" fill={tieColor} />
      {/* arms */}
      <rect x="2" y={7 + armOffset} width="2" height="5" fill={suitColor} />
      <rect x="12" y={7 + armOffset} width="2" height="5" fill={suitColor} />
      {/* hands */}
      <rect x="2" y={12 + armOffset} width="2" height="2" fill={faceColor} />
      <rect x="12" y={12 + armOffset} width="2" height="2" fill={faceColor} />
      {/* win trophy */}
      {state === "win" && <><rect x="1" y="3" width="2" height="3" fill="#facc15" /><rect x="13" y="3" width="2" height="3" fill="#facc15" /></>}
      {/* legs */}
      <rect x="5" y="14" width="3" height="5" fill={pantsColor} />
      <rect x="8" y="14" width="3" height="5" fill={pantsColor} />
      {/* shoes */}
      <rect x="4" y="18" width="4" height="2" fill={shoeColor} />
      <rect x="8" y="18" width="4" height="2" fill={shoeColor} />
      {/* shadow */}
      <ellipse cx="8" cy="21" rx="4" ry="1" fill="rgba(0,0,0,0.3)" />
    </svg>
  );
}

// ─── CEO boss character ───────────────────────────────────────────────────────
function CEOSprite({ angry }: { angry: boolean }) {
  return (
    <svg width={64} height={80} viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", filter: angry ? `drop-shadow(0 0 6px ${C.red})` : "none" }}>
      {/* head */}
      <rect x="5" y="0" width="6" height="6" fill="#d4a574" />
      {/* grey hair */}
      <rect x="4" y="0" width="8" height="2" fill="#888" />
      <rect x="4" y="0" width="1" height="4" fill="#888" />
      <rect x="11" y="0" width="1" height="4" fill="#888" />
      {/* eyes */}
      <rect x="6" y="2" width="1" height="1" fill={angry ? C.red : "#333"} />
      <rect x="9" y="2" width="1" height="1" fill={angry ? C.red : "#333"} />
      {/* angry brows */}
      {angry && <><rect x="5" y="1" width="3" height="1" fill="#333" /><rect x="8" y="1" width="3" height="1" fill="#333" /></>}
      {/* mouth */}
      {angry
        ? <><rect x="6" y="5" width="4" height="1" fill="#8b4513" /><rect x="6" y="4" width="1" height="1" fill="#8b4513" /><rect x="9" y="4" width="1" height="1" fill="#8b4513" /></>
        : <rect x="7" y="4" width="2" height="1" fill="#8b4513" />}
      {/* suit — dark blue for CEO */}
      <rect x="4" y="7" width="8" height="7" fill="#1a2040" />
      <rect x="4" y="7" width="2" height="4" fill="#252a50" />
      <rect x="10" y="7" width="2" height="4" fill="#252a50" />
      {/* gold tie */}
      <rect x="7" y="7" width="2" height="5" fill="#facc15" />
      <rect x="2" y="7" width="2" height="5" fill="#1a2040" />
      <rect x="12" y="7" width="2" height="5" fill="#1a2040" />
      <rect x="2" y="12" width="2" height="2" fill="#d4a574" />
      <rect x="12" y="12" width="2" height="2" fill="#d4a574" />
      <rect x="5" y="14" width="3" height="5" fill="#111" />
      <rect x="8" y="14" width="3" height="5" fill="#111" />
      <rect x="4" y="18" width="4" height="2" fill="#0a0a0a" />
      <rect x="8" y="18" width="4" height="2" fill="#0a0a0a" />
    </svg>
  );
}

// ─── Blinking cursor ──────────────────────────────────────────────────────────
function Blink({ children, speed = 600 }: { children: React.ReactNode; speed?: number }) {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVis((v) => !v), speed);
    return () => clearInterval(t);
  }, [speed]);
  return <span style={{ opacity: vis ? 1 : 0 }}>{children}</span>;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return { displayed, done };
}

// ─── Countdown timer ──────────────────────────────────────────────────────────
function useCountdown(seconds: number, active: boolean, onExpire: () => void) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);
  useEffect(() => {
    if (!active) return;
    if (left <= 0) { onExpire(); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, active, onExpire]);
  return left;
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function PixelBar({ value, max, color, label, icon }: { value: number; max: number; color: string; label: string; icon: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const isLow = pct < 25;
  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 7, color: C.muted }}>{icon} {label}</span>
        <span style={{ fontSize: 7, color: isLow ? C.red : color }}>{value > 1000 ? `${(value / 1000).toFixed(0)}K` : value}</span>
      </div>
      <div style={{ height: 10, background: "#0a0a0a", border: `2px solid ${color}44`, position: "relative", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: color,
          boxShadow: `0 0 6px ${color}`,
          transition: "width 0.6s steps(20)",
          animation: isLow ? "barPulse 0.5s steps(2) infinite" : "none",
        }} />
        {/* pixel segments */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${i * 5}%`, top: 0, width: 1, height: "100%", background: "#0a0a0a44" }} />
        ))}
      </div>
    </div>
  );
}

// ─── Floating score popup ─────────────────────────────────────────────────────
function ScorePopup({ value, visible }: { value: number; visible: boolean }) {
  return (
    <div style={{
      position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)",
      fontFamily: "'Press Start 2P', monospace", fontSize: 12,
      color: value > 0 ? C.green : C.red,
      textShadow: glow(value > 0 ? C.green : C.red),
      opacity: visible ? 1 : 0,
      animation: visible ? "floatUp 1s ease-out forwards" : "none",
      pointerEvents: "none", zIndex: 100,
    }}>
      {value > 0 ? `+${value}` : value}
    </div>
  );
}

// ─── MAIN GAME COMPONENT ──────────────────────────────────────────────────────
type Screen = "intro" | "playing" | "result";

export default function GamePage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [budget, setBudget] = useState(500000);
  const [romi, setRomi] = useState(0);
  const [conv, setConv] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [scorePopup, setScorePopup] = useState({ value: 0, visible: false });
  const [timerActive, setTimerActive] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [formSent, setFormSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const burstId = useRef(0);

  const currentScenario = SCENARIOS[Math.min(scenarioIdx, SCENARIOS.length - 1)];
  const isCrisis = currentScenario?.crisis ?? false;
  const isLastScenario = scenarioIdx >= SCENARIOS.length - 1;

  const { displayed: typeText, done: typeDone } = useTypewriter(
    screen === "playing" ? currentScenario.situation : "",
    22
  );

  const handleTimerExpire = useCallback(() => {
    if (chosen !== null) return;
    // Auto-pick worst option
    const worstIdx = currentScenario.options.reduce((wi, o, i) =>
      o.delta.score < currentScenario.options[wi].delta.score ? i : wi, 0);
    handleChoice(worstIdx, true);
  }, [chosen, currentScenario]);

  const timerSeconds = isCrisis ? 20 : 45;
  const timeLeft = useCountdown(timerSeconds, timerActive && screen === "playing" && chosen === null, handleTimerExpire);

  useEffect(() => {
    if (screen === "playing" && typeDone && chosen === null) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [screen, typeDone, chosen]);

  // Reset timer when scenario changes
  useEffect(() => {
    setTimerActive(false);
  }, [scenarioIdx]);

  function spawnBurst(x: number, y: number, color: string) {
    const id = burstId.current++;
    setBursts((b) => [...b, { id, x, y, color }]);
    setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 700);
  }

  function handleChoice(idx: number, forced = false) {
    if (chosen !== null) return;
    setChosen(idx);
    setTimerActive(false);

    const opt = currentScenario.options[idx];
    const isOptimal = opt.isOptimal;
    const comboMult = isOptimal ? Math.min(combo + 1, 5) : 1;
    const earnedScore = isOptimal ? opt.delta.score * comboMult : Math.floor(opt.delta.score * 0.3);

    setBudget((b) => Math.max(0, b + opt.delta.budget));
    setRomi((r) => Math.max(-100, r + opt.delta.romi));
    setConv((c) => Math.max(0, c + opt.delta.conv));
    setScore((s) => s + earnedScore);

    if (isOptimal) {
      setCombo((c) => c + 1);
    } else {
      setCombo(0);
      if (!forced) setLives((l) => Math.max(0, l - 1));
    }

    setScorePopup({ value: earnedScore, visible: true });
    setTimeout(() => setScorePopup((p) => ({ ...p, visible: false })), 1200);

    setShowResult(true);
  }

  function handleNext() {
    if (isLastScenario || lives <= 0) {
      setScreen("result");
      return;
    }
    setScenarioIdx((i) => i + 1);
    setChosen(null);
    setShowResult(false);
  }

  function handleRestart() {
    setScreen("intro");
    setScenarioIdx(0);
    setBudget(500000);
    setRomi(0);
    setConv(0);
    setScore(0);
    setLives(3);
    setCombo(0);
    setChosen(null);
    setShowResult(false);
    setFormSent(false);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    try {
      await fetch("/api/game-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, score, romi, budget }),
      });
      setFormSent(true);
    } catch {
      setFormSent(true);
    }
    setFormLoading(false);
  }

  const isWin = romi >= 80 && lives > 0;
  const progress = ((scenarioIdx) / SCENARIOS.length) * 100;
  const timerPct = (timeLeft / timerSeconds) * 100;
  const timerColor = timeLeft <= 5 ? C.red : timeLeft <= 10 ? C.yellow : C.green;

  // ── CSS ────────────────────────────────────────────────────────────────────
  const globalCSS = `
    @import url('${FONT_LINK}');
    * { box-sizing: border-box; }
    body { margin: 0; background: ${C.bg}; }
    @keyframes pixelFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
    @keyframes pixelBob { 0%,100% { transform: translateY(0) scaleX(1); } 25% { transform: translateY(-4px) scaleX(0.95); } 75% { transform: translateY(2px) scaleX(1.05); } }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideInLeft { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
    @keyframes slideInRight { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
    @keyframes floatUp { 0% { opacity:1; transform:translateX(-50%) translateY(0); } 100% { opacity:0; transform:translateX(-50%) translateY(-50px); } }
    @keyframes barPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes shake { 0%,100% { transform:translateX(0); } 20%,60% { transform:translateX(-6px); } 40%,80% { transform:translateX(6px); } }
    @keyframes glitch { 0%,100% { clip-path:inset(0 0 0 0); transform:skewX(0); } 20% { clip-path:inset(20% 0 30% 0); transform:skewX(-3deg); } 40% { clip-path:inset(60% 0 10% 0); transform:skewX(2deg); } 60% { clip-path:inset(40% 0 50% 0); transform:skewX(-1deg); } }
    @keyframes crisisFlash { 0%,100% { border-color: ${C.red}; box-shadow: 0 0 20px ${C.redGlow}; } 50% { border-color: #ff6b5b; box-shadow: 0 0 40px rgba(255,45,32,0.6); } }
    @keyframes comboGrow { 0% { transform:scale(0.5); opacity:0; } 60% { transform:scale(1.3); } 100% { transform:scale(1); opacity:1; } }
    @keyframes timerPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.1); } }
    @keyframes scanMove { from { background-position: 0 0; } to { background-position: 0 100%; } }
    @keyframes introGlow { 0%,100% { text-shadow: 0 0 10px ${C.red}, 0 0 20px ${C.red}44; } 50% { text-shadow: 0 0 20px ${C.red}, 0 0 40px ${C.red}, 0 0 60px ${C.red}44; } }
    @keyframes burst0 { to { transform: translate(var(--dx), var(--dy)) scale(0); opacity:0; } }
    @keyframes burst1 { to { transform: translate(var(--dx), var(--dy)) scale(0); opacity:0; } }
    @keyframes burst2 { to { transform: translate(var(--dx), var(--dy)) scale(0); opacity:0; } }

    .pixel-btn {
      font-family: 'Press Start 2P', monospace;
      background: ${C.red};
      color: ${C.white};
      border: 3px solid ${C.redDark};
      box-shadow: 4px 4px 0 ${C.redDark}, 0 0 12px ${C.redGlow};
      cursor: pointer;
      transition: transform 0.08s, box-shadow 0.08s;
      image-rendering: pixelated;
    }
    .pixel-btn:hover {
      transform: translate(2px,2px);
      box-shadow: 2px 2px 0 ${C.redDark}, 0 0 20px ${C.redGlow};
    }
    .pixel-btn:active { transform: translate(4px,4px); box-shadow: 0 0 0 ${C.redDark}; }

    .option-card {
      font-family: 'Press Start 2P', monospace;
      background: #0d0d0d;
      color: ${C.text};
      border: 2px solid #222;
      box-shadow: 3px 3px 0 #111;
      cursor: pointer;
      transition: all 0.1s;
      text-align: left;
      width: 100%;
      position: relative;
      overflow: hidden;
    }
    .option-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent 40%, rgba(255,45,32,0.05) 100%);
      pointer-events: none;
    }
    .option-card:not(.disabled):hover {
      border-color: ${C.red};
      box-shadow: 3px 3px 0 ${C.redDark}, 0 0 10px ${C.redGlow};
      transform: translate(-2px,-2px);
      background: #150505;
    }
    .option-card.correct {
      border-color: ${C.green} !important;
      box-shadow: 3px 3px 0 #166534, 0 0 15px rgba(34,197,94,0.4) !important;
      background: #051a0a !important;
      color: ${C.green} !important;
      animation: none;
    }
    .option-card.wrong {
      border-color: ${C.red} !important;
      box-shadow: 3px 3px 0 ${C.redDark} !important;
      background: #1a0505 !important;
      animation: shake 0.4s ease;
    }
    .option-card.disabled { opacity: 0.35; cursor: not-allowed; }

    .pixel-input {
      font-family: 'Press Start 2P', monospace;
      font-size: 8px;
      background: #0d0d0d;
      color: ${C.text};
      border: 2px solid #333;
      padding: 12px;
      width: 100%;
      outline: none;
      transition: border-color 0.2s;
    }
    .pixel-input:focus { border-color: ${C.red}; box-shadow: 0 0 8px ${C.redGlow}; }
    .pixel-input::placeholder { color: #444; }
  `;

  // ── INTRO SCREEN ───────────────────────────────────────────────────────────
  if (screen === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>
        <style>{globalCSS}</style>
        <AnimatedBg />
        <Scanlines />
        <Vignette />

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 600, width: "100%" }}>

          {/* Logo */}
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(8px, 3vw, 11px)", color: C.muted, letterSpacing: 4, marginBottom: 16, textAlign: "center" }}>
            ГИПОТЕЗА AGENCY PRESENTS
          </div>

          {/* Title */}
          <div style={{ position: "relative", marginBottom: 8, textAlign: "center" }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(24px, 8vw, 48px)", color: C.red, animation: "introGlow 2s ease-in-out infinite", letterSpacing: 2, lineHeight: 1.2 }}>
              ВЕБИНАР
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(24px, 8vw, 48px)", color: C.white, letterSpacing: 2, lineHeight: 1.2 }}>
              РАШ
            </div>
            {/* Glitch copy */}
            <div style={{ position: "absolute", inset: 0, fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(24px, 8vw, 48px)", color: C.red, animation: "glitch 4s steps(1) infinite", opacity: 0.3, pointerEvents: "none", letterSpacing: 2, lineHeight: 1.2 }}>
              ВЕБИНАР
            </div>
          </div>

          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(7px, 2vw, 9px)", color: C.muted, letterSpacing: 3, marginBottom: 40, textAlign: "center" }}>
            МАРКЕТИНГОВЫЙ СИМУЛЯТОР v2.0
          </div>

          {/* Characters */}
          <div style={{ display: "flex", gap: 32, alignItems: "flex-end", marginBottom: 32, animation: "pixelBob 2s ease-in-out infinite" }}>
            <CMOSprite state="idle" size={1.5} />
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: C.red, textAlign: "center", animation: "pixelFloat 1.5s ease-in-out infinite" }}>
              VS
            </div>
            <CEOSprite angry={false} />
          </div>

          {/* Description box */}
          <div style={{ border: `2px solid ${C.red}`, boxShadow: `0 0 20px ${C.redGlow}, 4px 4px 0 ${C.redDark}`, background: "#0d0d0d", padding: "20px 24px", marginBottom: 28, width: "100%", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: 16, background: C.bg, padding: "0 8px", fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.red }}>
              БРИФИНГ
            </div>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(7px, 2vw, 8px)", color: C.text, lineHeight: 2.4, margin: 0 }}>
              Ты — CMO онлайн-школы.<br />
              30 дней. 500 000 ₽. 7 кризисных ситуаций.<br />
              <br />
              <span style={{ color: C.red }}>Каждое решение меняет ROMI.</span><br />
              Таймер давит. CEO злится.<br />
              Сделай правильный выбор — или потеряй всё.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32, width: "100%" }}>
            {[
              { label: "БЮДЖЕТ", value: "500K ₽", icon: "💰", color: C.yellow },
              { label: "СЦЕНАРИЕВ", value: "7", icon: "⚡", color: C.red },
              { label: "ЖИЗНИ", value: "♥♥♥", icon: "", color: C.red },
            ].map((s) => (
              <div key={s.label} style={{ border: `2px solid ${s.color}44`, background: "#0d0d0d", padding: "12px 8px", textAlign: "center", boxShadow: `0 0 8px ${s.color}22` }}>
                <div style={{ fontSize: 16, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: s.color, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>

          <button className="pixel-btn" style={{ fontSize: "clamp(10px, 3vw, 13px)", padding: "18px 48px", marginBottom: 16 }} onClick={() => setScreen("playing")}>
            <Blink>▶ НАЧАТЬ ИГРУ</Blink>
          </button>

          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.muted, textAlign: "center" }}>
            Powered by ГИПОТЕЗА agency
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING SCREEN ─────────────────────────────────────────────────────────
  if (screen === "playing") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <style>{globalCSS}</style>
        <AnimatedBg />
        <Scanlines />
        <Vignette />
        <BurstEffect bursts={bursts} />

        {/* ── TOP HUD ── */}
        <div style={{
          background: "#080808",
          borderBottom: `3px solid ${isCrisis ? C.red : "#1e1e1e"}`,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          position: "relative",
          zIndex: 10,
          boxShadow: isCrisis ? `0 0 20px ${C.redGlow}` : "none",
          animation: isCrisis ? "crisisFlash 1s ease-in-out infinite" : "none",
        }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: C.red, letterSpacing: 2, textShadow: glow(C.red) }}>
            ВЕБИНАР РАШ
          </div>

          {/* Progress */}
          <div style={{ flex: 1, minWidth: 80 }}>
            <div style={{ height: 8, background: "#111", border: `1px solid #222`, overflow: "hidden", position: "relative" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: C.red, boxShadow: `0 0 6px ${C.red}`, transition: "width 0.5s steps(14)" }} />
            </div>
          </div>

          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.text }}>
            ДЕНЬ {currentScenario.day}/30
          </div>

          {/* Lives */}
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ fontSize: 14, color: C.red, opacity: i < lives ? 1 : 0.15, textShadow: i < lives ? glow(C.red) : "none", transition: "opacity 0.3s" }}>♥</span>
            ))}
          </div>

          {/* Combo */}
          {combo >= 2 && (
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.yellow, textShadow: glow(C.yellow), animation: "comboGrow 0.3s ease" }}>
              x{combo} COMBO!
            </div>
          )}

          {/* Score */}
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.yellow }}>
            {score.toLocaleString()}
          </div>

          {/* Phase badge */}
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.bg, background: isCrisis ? C.red : C.muted, padding: "3px 8px" }}>
            {isCrisis ? "⚠ КРИЗИС" : currentScenario.phase}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 760, margin: "0 auto", width: "100%", padding: "16px", gap: 14, position: "relative", zIndex: 10 }}>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <PixelBar label="БЮДЖЕТ" value={budget} max={500000} color={budget < 100000 ? C.red : C.yellow} icon="💰" />
            <PixelBar label="ROMI" value={Math.max(0, romi)} max={200} color={romi >= 100 ? C.green : romi >= 50 ? C.yellow : C.red} icon="📈" />
            <PixelBar label="КОНВЕРСИЯ" value={conv} max={40} color={C.blue} icon="🎯" />
          </div>

          {/* Timer bar */}
          {chosen === null && typeDone && (
            <div style={{ animation: "fadeInUp 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.muted }}>
                  {isCrisis ? "⚠ КРИЗИС — ВРЕМЕНИ МАЛО" : "⏱ ВРЕМЯ НА РЕШЕНИЕ"}
                </span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: timerColor, textShadow: timeLeft <= 5 ? glow(C.red) : "none", animation: timeLeft <= 5 ? "timerPulse 0.5s steps(2) infinite" : "none" }}>
                  {timeLeft}s
                </span>
              </div>
              <div style={{ height: 8, background: "#111", border: `2px solid ${timerColor}44`, overflow: "hidden" }}>
                <div style={{ width: `${timerPct}%`, height: "100%", background: timerColor, boxShadow: `0 0 8px ${timerColor}`, transition: "width 1s linear, background 0.3s" }} />
              </div>
            </div>
          )}

          {/* Scene: characters + situation */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {/* CMO */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ animation: showResult ? "none" : "pixelBob 1.8s ease-in-out infinite" }}>
                <CMOSprite
                  state={showResult ? (chosen === currentScenario.options.findIndex(o => o.isOptimal) ? "win" : "lose") : "think"}
                  size={1.2}
                />
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: C.muted, textAlign: "center" }}>CMO</div>
            </div>

            {/* Dialogue box */}
            <div style={{
              flex: 1,
              border: `2px solid ${isCrisis ? C.red : "#2a2a2a"}`,
              boxShadow: isCrisis ? `0 0 16px ${C.redGlow}, 3px 3px 0 ${C.redDark}` : `3px 3px 0 #111`,
              background: "#0d0d0d",
              padding: "14px 16px",
              position: "relative",
              animation: "slideInRight 0.4s ease",
            }}>
              {/* Speech bubble tail */}
              <div style={{ position: "absolute", left: -10, top: 16, width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: `10px solid ${isCrisis ? C.red : "#2a2a2a"}` }} />

              {isCrisis && (
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.red, marginBottom: 8, textShadow: glow(C.red), animation: "barPulse 0.5s steps(2) infinite" }}>
                  ⚠ КРИЗИСНАЯ СИТУАЦИЯ
                </div>
              )}
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(7px, 2vw, 9px)", color: C.text, lineHeight: 2.2 }}>
                {typeText}
                {!typeDone && <Blink speed={400}>█</Blink>}
              </div>
              {typeDone && (
                <div style={{ marginTop: 10, fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.muted, borderTop: `1px solid #1e1e1e`, paddingTop: 8, animation: "fadeInUp 0.4s ease" }}>
                  {currentScenario.context}
                </div>
              )}
            </div>

            {/* CEO */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ animation: "pixelFloat 2.2s ease-in-out infinite" }}>
                <CEOSprite angry={isCrisis || (showResult && chosen !== currentScenario.options.findIndex(o => o.isOptimal))} />
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: C.muted, textAlign: "center" }}>CEO</div>
            </div>
          </div>

          {/* Options */}
          {!showResult && typeDone && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "slideInLeft 0.4s ease" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.muted, marginBottom: 2 }}>
                ▶ ВЫБЕРИТЕ ДЕЙСТВИЕ:
              </div>
              {currentScenario.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                  <button
                    key={i}
                    className="option-card"
                    style={{ padding: "12px 14px", fontSize: "clamp(7px, 2vw, 8px)", lineHeight: 1.9 }}
                    onClick={(e) => {
                      spawnBurst(e.clientX, e.clientY, opt.isOptimal ? C.green : C.red);
                      handleChoice(i);
                    }}
                    disabled={chosen !== null}
                  >
                    <span style={{ color: C.red, marginRight: 10 }}>{letter}.</span>
                    <span style={{ fontSize: 14, marginRight: 8 }}>{opt.icon}</span>
                    {opt.label}
                    <span style={{ float: "right", color: C.muted, fontSize: 7 }}>
                      {opt.delta.budget < 0 ? `${(opt.delta.budget / 1000).toFixed(0)}K ₽` : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* After choice: result */}
          {showResult && (
            <div style={{ animation: "fadeInUp 0.4s ease", position: "relative" }}>
              <ScorePopup value={scorePopup.value} visible={scorePopup.visible} />

              {/* Chosen option highlight */}
              {chosen !== null && (
                <div style={{ marginBottom: 10 }}>
                  {currentScenario.options.map((opt, i) => {
                    if (chosen === null) return null;
                    const isChosen = i === chosen;
                    const isOptimal = opt.isOptimal;
                    if (!isChosen && !isOptimal) return null;
                    return (
                      <div
                        key={i}
                        className={`option-card ${isOptimal ? "correct" : "wrong"}`}
                        style={{ padding: "10px 14px", fontSize: "clamp(7px, 2vw, 8px)", marginBottom: 6, cursor: "default" }}
                      >
                        <span style={{ marginRight: 8 }}>{opt.icon}</span>
                        {opt.label}
                        <span style={{ float: "right", fontSize: 9 }}>
                          {isOptimal ? "✓ ОПТИМАЛЬНО" : "✗ ОШИБКА"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Consequence */}
              <div style={{
                border: `2px solid ${chosen === currentScenario.options.findIndex(o => o.isOptimal) ? C.green : C.red}`,
                boxShadow: `0 0 12px ${chosen === currentScenario.options.findIndex(o => o.isOptimal) ? "rgba(34,197,94,0.3)" : C.redGlow}`,
                background: "#0a0a0a",
                padding: "14px 16px",
                marginBottom: 10,
              }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.muted, marginBottom: 8 }}>
                  {chosen === currentScenario.options.findIndex(o => o.isOptimal) ? "✓ РЕЗУЛЬТАТ:" : "✗ ПОСЛЕДСТВИЯ:"}
                </div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(7px, 2vw, 8px)", color: C.text, lineHeight: 2.2 }}>
                  {chosen !== null && currentScenario.options[chosen].consequence}
                </div>
                <div style={{ marginTop: 10, padding: "8px 12px", background: "#0d0d0d", border: `1px solid ${C.red}33`, fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.red, lineHeight: 2 }}>
                  💡 {currentScenario.gipotezaInsight}
                </div>
              </div>

              {/* Delta stats */}
              {chosen !== null && (
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "ROMI", value: currentScenario.options[chosen].delta.romi, suffix: "%" },
                    { label: "БЮДЖЕТ", value: currentScenario.options[chosen].delta.budget / 1000, suffix: "K" },
                    { label: "КОНВЕРСИЯ", value: currentScenario.options[chosen].delta.conv, suffix: "%" },
                  ].map((d) => (
                    <div key={d.label} style={{ flex: 1, minWidth: 80, border: `1px solid #222`, background: "#0d0d0d", padding: "8px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: C.muted, marginBottom: 4 }}>{d.label}</div>
                      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: d.value >= 0 ? C.green : C.red }}>
                        {d.value >= 0 ? "+" : ""}{d.value.toFixed(0)}{d.suffix}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="pixel-btn"
                style={{ fontSize: 9, padding: "14px 24px", width: "100%" }}
                onClick={handleNext}
              >
                {isLastScenario || lives <= 0 ? "▶ ЗАВЕРШИТЬ ЗАПУСК" : `▶ ДЕНЬ ${SCENARIOS[Math.min(scenarioIdx + 1, SCENARIOS.length - 1)]?.day || 30} →`}
              </button>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `2px solid #1a1a1a`, padding: "8px 16px", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 10, background: "#080808" }}>
          {[
            { label: "БЮДЖЕТ", value: `${(budget / 1000).toFixed(0)}K ₽`, color: budget < 100000 ? C.red : C.yellow },
            { label: "ROMI", value: `${romi}%`, color: romi >= 100 ? C.green : romi >= 0 ? C.yellow : C.red },
            { label: "КОНВЕРСИЯ", value: `${conv.toFixed(1)}%`, color: C.blue },
            { label: "ОЧКИ", value: score.toLocaleString(), color: C.yellow },
            { label: "COMBO", value: combo >= 2 ? `x${combo}` : "-", color: C.yellow },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: C.muted }}>{s.label}</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>
      <style>{globalCSS}</style>
      <AnimatedBg />
      <Scanlines />
      <Vignette />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 640, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Result title */}
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(14px, 5vw, 24px)", color: isWin ? C.green : C.red, textShadow: glow(isWin ? C.green : C.red, 12), marginBottom: 8, textAlign: "center", animation: "introGlow 2s ease-in-out infinite" }}>
          {isWin ? "ЗАПУСК УДАЛСЯ!" : "ПРОВАЛ ЗАПУСКА"}
        </div>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(7px, 2vw, 9px)", color: C.muted, marginBottom: 24, textAlign: "center" }}>
          {isWin ? "Ты доказал CEO что маркетинг работает" : "CEO урезал бюджет. Следующий квартал под угрозой."}
        </div>

        {/* Character */}
        <div style={{ marginBottom: 24, animation: "pixelBob 1.5s ease-in-out infinite" }}>
          <CMOSprite state={isWin ? "win" : "lose"} size={2} />
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, width: "100%", marginBottom: 20 }}>
          {[
            { label: "ИТОГОВЫЙ ROMI", value: `${romi}%`, color: romi >= 100 ? C.green : romi >= 50 ? C.yellow : C.red, icon: "📈" },
            { label: "ОСТАТОК БЮДЖЕТА", value: `${(budget / 1000).toFixed(0)}K ₽`, color: C.yellow, icon: "💰" },
            { label: "КОНВЕРСИЯ", value: `${conv.toFixed(1)}%`, color: C.blue, icon: "🎯" },
            { label: "ИТОГОВЫЙ СЧЁТ", value: score.toLocaleString(), color: C.yellow, icon: "⭐" },
          ].map((s) => (
            <div key={s.label} style={{ border: `2px solid ${s.color}44`, background: "#0d0d0d", padding: "14px", textAlign: "center", boxShadow: `0 0 10px ${s.color}22` }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(10px, 3vw, 14px)", color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: C.muted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Rank */}
        <div style={{ border: `2px solid ${C.red}`, background: "#0d0d0d", padding: "12px 20px", marginBottom: 20, width: "100%", textAlign: "center", boxShadow: `0 0 16px ${C.redGlow}` }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.muted, marginBottom: 8 }}>РАНГ CMO</div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(9px, 3vw, 12px)", color: C.red }}>
            {score >= 2000 ? "⭐⭐⭐ МАРКЕТИНГ-ЛЕГЕНДА" :
             score >= 1200 ? "⭐⭐ СИЛЬНЫЙ CMO" :
             score >= 600 ? "⭐ РАСТУЩИЙ CMO" : "💀 СТАЖЁР МАРКЕТИНГА"}
          </div>
        </div>

        {/* Lead form */}
        {!formSent ? (
          <div style={{ border: `2px solid ${C.red}`, background: "#0d0d0d", padding: "20px", width: "100%", marginBottom: 16, boxShadow: `0 0 20px ${C.redGlow}` }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.red, marginBottom: 6, textShadow: glow(C.red) }}>
              ХОЧЕШЬ ТАКОЙ ROMI В РЕАЛЬНОСТИ?
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.muted, marginBottom: 16, lineHeight: 2 }}>
              Разберём твою воронку бесплатно за 30 минут.
            </div>
            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="pixel-input" placeholder="ИМЯ" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} required />
              <input className="pixel-input" placeholder="ТЕЛЕФОН" type="tel" value={formData.phone} onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))} required />
              <input className="pixel-input" placeholder="EMAIL" type="email" value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))} required />
              <button className="pixel-btn" type="submit" style={{ fontSize: 9, padding: "14px", marginTop: 4 }} disabled={formLoading}>
                {formLoading ? <Blink>ОТПРАВКА...</Blink> : "▶ РАЗОБРАТЬ МОЮ ВОРОНКУ"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ border: `2px solid ${C.green}`, background: "#051a0a", padding: "20px", width: "100%", marginBottom: 16, textAlign: "center", boxShadow: `0 0 16px rgba(34,197,94,0.3)` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: C.green, marginBottom: 8 }}>ЗАЯВКА ПРИНЯТА!</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.muted, lineHeight: 2 }}>
              Свяжемся в течение 2 часов.<br />Готовься к разбору воронки.
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, width: "100%", flexWrap: "wrap" }}>
          <button className="pixel-btn" style={{ flex: 1, fontSize: 8, padding: "12px" }} onClick={handleRestart}>
            ↺ ИГРАТЬ СНОВА
          </button>
          <button
            className="pixel-btn"
            style={{ flex: 1, fontSize: 8, padding: "12px", background: "#111", border: `2px solid ${C.red}`, boxShadow: `2px 2px 0 ${C.redDark}` }}
            onClick={() => window.location.href = "/"}
          >
            ← НА САЙТ
          </button>
        </div>

        <div style={{ marginTop: 20, fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: C.muted, textAlign: "center" }}>
          Powered by ГИПОТЕЗА agency
        </div>
      </div>
    </div>
  );
}
