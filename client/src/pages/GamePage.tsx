import { useState, useEffect, useRef, useCallback } from "react";

// ─── Music Engine (Web Audio API) ────────────────────────────────────────────
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
    gain.gain.setValueAtTime(0.08, t);
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
function useTypewriter(text: string, spd = 22) {
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

// ─── Animated Background ──────────────────────────────────────────────────────
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

    // Floating orbs
    const orbs = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 80 + Math.random() * 160,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      hue: crisis ? 0 : (i % 2 === 0 ? 0 : 220),
      alpha: 0.03 + Math.random() * 0.04,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = crisis ? "rgba(255,45,32,0.06)" : "rgba(255,255,255,0.025)";
      ctx.lineWidth = 1;
      const gs = 60;
      const off = (frame * 0.15) % gs;
      for (let x = -gs + off; x < canvas.width + gs; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = -gs + off; y < canvas.height + gs; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Orbs
      orbs.forEach(o => {
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        const color = crisis ? `rgba(255,45,32,${o.alpha})` : `rgba(255,45,32,${o.alpha * 0.6})`;
        grad.addColorStop(0, color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = canvas.width + o.r;
        if (o.x > canvas.width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = canvas.height + o.r;
        if (o.y > canvas.height + o.r) o.y = -o.r;
      });

      // Crisis scan line
      if (crisis) {
        const scanX = ((frame * 3) % (canvas.width + 300)) - 150;
        const grad = ctx.createLinearGradient(scanX - 80, 0, scanX + 80, 0);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.5, "rgba(255,45,32,0.06)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(scanX - 80, 0, 160, canvas.height);
      }

      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [crisis]);

  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
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
                position: "absolute",
                width: 6, height: 6,
                borderRadius: "50%",
                background: b.good ? "#22c55e" : "#ff2d20",
                boxShadow: `0 0 6px ${b.good ? "#22c55e" : "#ff2d20"}`,
                animation: "burstOut 0.6s ease-out forwards",
                "--tx": `${Math.cos(a) * d}px`,
                "--ty": `${Math.sin(a) * d}px`,
              } as React.CSSProperties} />
            );
          })}
        </div>
      ))}
    </>
  );
}

// ─── CMO Avatar (modern illustration style) ──────────────────────────────────
function CMOAvatar({ mood, size = 80 }: { mood: "idle" | "think" | "win" | "lose"; size?: number }) {
  const faceColor = mood === "win" ? "#22c55e" : mood === "lose" ? "#ff2d20" : "#ff2d20";
  const bgColor = mood === "win" ? "rgba(34,197,94,0.15)" : mood === "lose" ? "rgba(255,45,32,0.15)" : "rgba(255,45,32,0.1)";

  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: bgColor,
      border: `2px solid ${faceColor}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.5,
      boxShadow: `0 0 20px ${faceColor}33`,
      transition: "all 0.3s ease",
      flexShrink: 0,
    }}>
      {mood === "win" ? "🏆" : mood === "lose" ? "😰" : mood === "think" ? "🤔" : "💼"}
    </div>
  );
}

// ─── CEO Avatar ───────────────────────────────────────────────────────────────
function CEOAvatar({ angry, size = 80 }: { angry: boolean; size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: angry ? "rgba(255,45,32,0.2)" : "rgba(250,204,21,0.1)",
      border: `2px solid ${angry ? "#ff2d20" : "#facc15"}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.5,
      boxShadow: `0 0 20px ${angry ? "#ff2d20" : "#facc15"}33`,
      transition: "all 0.3s ease",
      flexShrink: 0,
    }}>
      {angry ? "😤" : "👔"}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function MetricBar({ val, max, color, label, icon }: { val: number; max: number; color: string; label: string; icon: string }) {
  const pct = Math.max(0, Math.min(100, (val / max) * 100));
  const low = pct < 20;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "rgba(245,245,240,0.5)", fontWeight: 500 }}>{icon} {label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: low ? "#ff2d20" : color }}>
          {val > 999 ? `${(val / 1000).toFixed(0)}K` : val}
        </span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 3,
          transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}

// ─── GAME DATA — Russian EdTech 2026 scenarios ────────────────────────────────
import { SCENES } from "./GameScenes";
import type { Scene } from "./GameScenes";

type Opt = Scene["options"][number];

// Old SCENES removed — now imported from GameScenes.ts
const _SCENES_PLACEHOLDER_UNUSED = [
  {
    id: 0, day: 3, phase: "ПОДГОТОВКА", difficulty: "HARD",
    title: "Воронка регистраций не конвертит",
    situation: "Запускаешь вебинар по онлайн-курсу «Профессия SMM-специалист» для физлиц. Лендинг готов, трафик идёт из Яндекс.Директ. CR в регистрацию: 3.2%. Средний CR по рынку B2C EdTech — 18–26%. Бюджет на трафик: 180К ₽. CAC текущий: 56 000 ₽. Целевой CAC: 8 000 ₽. Вебинар через 10 дней. Средний чек курса: 39 900 ₽.",
    metrics: "CR: 3.2% | CAC: 56 000 ₽ | Бюджет: 180К ₽ | Канал: Яндекс.Директ",
    insight: "Гипотеза: Оффер с конкретным результатом («зарабатывай от 80К ₽/мес уже через 3 месяца») + отзывы выпускников поднимают CR до 20–26% за 72 часа A/B теста",
    options: [
      {
        label: "A/B тест: 3 оффера + видео-лендинг 90 сек",
        icon: "🧪",
        detail: "Тест 3 офферов + VSL. Срок: 72 часа, бюджет теста: 18К ₽. Оффер «Зарабатывай от 80К ₽/мес как SMM-специалист» vs «Освой SMM с нуля за 3 месяца»",
        consequence: "CR вырос до 21.3%. CAC упал до 8 400 ₽. Оффер с конкретной цифрой дохода сработал лучше всего на аудиторию 25–35 лет, ищущую смену профессии.",
        delta: { romi: 38, budget: -28000, conv: 16, score: 440 }, isOptimal: true,
      },
      {
        label: "Масштабировать текущий трафик ×3",
        icon: "📈",
        detail: "Увеличить бюджет с 180К до 540К ₽ при CR 3.2%",
        consequence: "CAC вырос до 89 000 ₽. Потратили 360К дополнительно. Яндекс начал показывать рекламу нецелевой аудитории при резком росте бюджета. ROMI ушёл в минус.",
        delta: { romi: -30, budget: -560000, conv: 3, score: 25 }, isOptimal: false,
        trap: "Масштабирование дырявой воронки = сжигание бюджета",
      },
      {
        label: "Переключиться на ВКонтакте Ads",
        icon: "💙",
        detail: "Перенести весь бюджет в VK Ads на женщин 25–40 лет, интересующихся сменой профессии",
        consequence: "CR 9.1% — лучше, но аудитория в VK холоднее и нужно больше касаний до покупки. CAC 31 000 ₽. Не хватает регистраций для выполнения плана.",
        delta: { romi: 6, budget: -45000, conv: 4, score: 150 }, isOptimal: false,
      },
      {
        label: "Нанять UX-дизайнера для редизайна",
        icon: "🎨",
        detail: "Полный редизайн лендинга. Срок: 2 недели, стоимость: 70К ₽",
        consequence: "Потеряли 2 недели и 70К ₽. CR вырос до 4.8%. Дизайн не решает проблему оффера — человек не понимает зачем ему этот курс.",
        delta: { romi: -6, budget: -90000, conv: 1, score: 55 }, isOptimal: false,
        trap: "Красивый дизайн не заменяет сильный оффер",
      },
    ],
  },
  {
    id: 1, day: 7, phase: "ПОДГОТОВКА", difficulty: "EXPERT",
    title: "Доходимость 8% — катастрофа",
    situation: "520 регистраций на вебинар «Как стать дизайнером и зарабатывать удалённо». Исторические данные: доходимость 8%, конверсия в продажу 0.9%. Вебинар через 5 дней. Конкурент «Скиллбокс» объявил распродажу с скидкой 35% на курс по графическому дизайну. Твоя задача: поднять доходимость до 35%+ и удержать позиционирование без ценовой войны.",
    metrics: "Регистраций: 520 | Доходимость: 8% | Конверсия: 0.9% | Конкурент: Скиллбокс -35%",
    insight: "Гипотеза: Персонализированная цепочка в Telegram-боте с превью контента поднимает доходимость до 38–45%. Ценовая война разрушает маржу — лучше усилить уникальность оффера",
    options: [
      {
        label: "Telegram-бот: 6 касаний + pre-value контент",
        icon: "🤖",
        detail: "Автоматическая цепочка: день -5, -3, -1, -0.5, +1 час, напоминание. Контент: портфолио выпускников, мини-урок по дизайну, заработки учеников",
        consequence: "Доходимость 41%. Open rate бота 79%. Люди пришли прогретые — конверсия в продажу выросла до 4.8%. Скиллбокс не страшен: аудитория уже доверяет вашему контенту.",
        delta: { romi: 48, budget: -20000, conv: 19, score: 540 }, isOptimal: true,
      },
      {
        label: "Ответить скидкой 30% на флагман",
        icon: "🏷️",
        detail: "Объявить скидку 30% в ответ на Скиллбокс",
        consequence: "Продажи выросли на 14%, но маржа упала на 30%. Обесценили продукт. Следующий запуск будет сложнее продавать по полной цене — аудитория ждёт скидок.",
        delta: { romi: -20, budget: 0, conv: 5, score: 75 }, isOptimal: false,
        trap: "Ценовая война убивает LTV и позиционирование",
      },
      {
        label: "Email-рассылка: 3 стандартных письма",
        icon: "📧",
        detail: "Напоминания по email за 3 дня, 1 день и 1 час до вебинара",
        consequence: "Open rate 9%. Доходимость выросла до 13%. Недостаточно для выполнения плана. Email работает слабо — B2C аудитория давно переехала в Telegram и ВКонтакте.",
        delta: { romi: 7, budget: -6000, conv: 4, score: 120 }, isOptimal: false,
      },
      {
        label: "Добавить бонус «только для пришедших»",
        icon: "🎁",
        detail: "Анонсировать эксклюзивный бонус — разбор портфолио от практикующего дизайнера — только для участников вебинара",
        consequence: "Доходимость 24%. Хорошо, но не достигли цели 35%+. Часть аудитории всё равно не пришла — бонус без системы напоминаний не работает.",
        delta: { romi: 16, budget: -4000, conv: 9, score: 230 }, isOptimal: false,
      },
    ],
  },
  {
    id: 2, day: 11, phase: "ЗАПУСК", crisis: true, difficulty: "NIGHTMARE",
    title: "⚠ КРИЗИС: Конверсия вебинара 0.6%",
    situation: "Вебинар по курсу «Профессия дизайнер» прошёл. 210 участников. Продаж: 1 на сумму 39 900 ₽. Конверсия 0.6% при плане 5%. Анализ записи: 68% аудитории ушло на 35-й минуте. Оффер был на 75-й минуте. Средний чек курса: 39 900 ₽. Следующий запуск через 3 недели.",
    metrics: "Участников: 210 | Продаж: 1 | Конверсия: 0.6% | Ушли: 68% на 35 мин",
    insight: "Гипотеза: Оффер на 40–45 мин + дожимная автоворонка 7 дней = конверсия 5–8%. Проблема не в продукте — в структуре вебинара и тайминге оффера",
    options: [
      {
        label: "Реструктурировать вебинар + 7-дневный дожим",
        icon: "🔧",
        detail: "Перенести оффер на 42 мин, добавить автоворонку: Telegram-бот + email 7 дней по сегментам возражений",
        consequence: "Следующий вебинар: конверсия 5.4%. Дожимная воронка добрала ещё 11 продаж. Итого: 478К ₽ выручки с одного запуска. План перевыполнен.",
        delta: { romi: 58, budget: -32000, conv: 23, score: 600 }, isOptimal: true,
      },
      {
        label: "Повторить вебинар с той же структурой",
        icon: "🔄",
        detail: "Запустить ещё один вебинар без изменений через неделю",
        consequence: "Конверсия снова 0.7%. Потратили ещё 120К ₽ на трафик. Бюджет урезан на следующий квартал на 40%.",
        delta: { romi: -38, budget: -140000, conv: -3, score: 15 }, isOptimal: false,
        trap: "Повторять одну и ту же ошибку — определение безумия",
      },
      {
        label: "Обзвонить всех 210 участников",
        icon: "📞",
        detail: "Ручные звонки всем 210 участникам вебинара через отдел продаж",
        consequence: "Закрыли 4 сделки на 159 600 ₽. Но потратили 3 недели работы отдела продаж. Не масштабируется — следующий запуск снова будет провальным.",
        delta: { romi: 12, budget: -55000, conv: 7, score: 155 }, isOptimal: false,
      },
      {
        label: "Снизить цену флагмана до 12К ₽",
        icon: "💥",
        detail: "Экстренное снижение цены с 39 900 ₽ до 9 900 ₽ для спасения запуска",
        consequence: "Продали 18 курсов на 178 200 ₽. Но обесценили продукт. Аудитория теперь ждёт скидок. LTV упал на 50%.",
        delta: { romi: -12, budget: 0, conv: 4, score: 65 }, isOptimal: false,
        trap: "Паника + снижение цены = долгосрочный ущерб бренду",
      },
    ],
  },
  {
    id: 3, day: 15, phase: "ПРЯМОЙ ЭФИР", crisis: true, difficulty: "NIGHTMARE",
    title: "⚠ КРИЗИС: Технический сбой на вебинаре",
    situation: "Вебинар идёт. 360 человек онлайн в Bizon365. На 21-й минуте — сбой трансляции. Чат: «ничего не слышно», «экран завис», «хочу возврат». Технический отдел: починим за 25–40 минут. Ты ведущий и CMO одновременно. У тебя 90 секунд на решение.",
    metrics: "Онлайн: 360 | Платформа: Bizon365 | Сбой: 21 мин | Время починки: 25–40 мин",
    insight: "Гипотеза: Честность + немедленный переход в резервный канал (Telegram-трансляция) сохраняет 70–80% аудитории. Молчание и ожидание — теряешь всех",
    options: [
      {
        label: "Telegram-трансляция + честное объяснение",
        icon: "📱",
        detail: "Немедленно: «Технические проблемы — переходим в Telegram @channel, продолжаем там через 3 минуты»",
        consequence: "295 из 360 перешли в Telegram. Вебинар продолжился через 5 минут. Аудитория оценила честность — конверсия выросла до 6.4% (эффект сочувствия и доверия).",
        delta: { romi: 32, budget: -4000, conv: 13, score: 480 }, isOptimal: true,
      },
      {
        label: "Молчать, ждать починки 30 минут",
        icon: "⏳",
        detail: "Ничего не делать, ждать технарей без объяснений аудитории",
        consequence: "За 30 минут ушло 280 человек. Осталось 80. Конверсия 0.3%. Негативные отзывы в EdTech-сообществах ВКонтакте и Telegram.",
        delta: { romi: -32, budget: -18000, conv: -9, score: 10 }, isOptimal: false,
        trap: "Молчание в кризис = потеря доверия навсегда",
      },
      {
        label: "Перенести вебинар на следующий день",
        icon: "📅",
        detail: "Объявить перенос и попросить прийти завтра в то же время",
        consequence: "Пришло 130 из 360 на следующий день. Конверсия 1.9%. Потеряли 64% аудитории — у людей другие планы.",
        delta: { romi: -18, budget: -12000, conv: -4, score: 85 }, isOptimal: false,
      },
      {
        label: "Записать и отправить запись всем",
        icon: "🎬",
        detail: "Остановить вебинар, записать и прислать запись на email",
        consequence: "Запись посмотрели 38%. Конверсия с записи 0.5%. Потеряли живую энергию вебинара и срочность покупки.",
        delta: { romi: -8, budget: -6000, conv: 0, score: 100 }, isOptimal: false,
      },
    ],
  },
  {
    id: 4, day: 19, phase: "ДОЖИМ", difficulty: "EXPERT",
    title: "Дожим: 380 тёплых лидов ждут",
    situation: "Вебинар по курсу «Профессия SMM-специалист» завершён. 400 участников. Купили сразу: 20 человек (5%). Осталось 380 «тёплых» лидов. По данным российского B2C EdTech 2026: 45% решений принимается в течение 7 дней после вебинара. Бюджет на дожим: 40К ₽. Средний чек: 39 900 ₽.",
    metrics: "Лидов: 380 | Купили сразу: 5% | Бюджет дожима: 40К ₽ | Окно: 7 дней",
    insight: "Гипотеза: OTO за 1 490 ₽ + сегментированная автоворонка 7 дней по типу возражения = +5–9% к конверсии. Один оффер для всех — теряешь половину потенциала",
    options: [
      {
        label: "OTO 1 490 ₽ + сегментация по возражениям",
        icon: "🎯",
        detail: "OTO 1 490 ₽ сразу после вебинара. Автоворонка: сегменты «дорого», «не сейчас», «не уверен» — разные цепочки в Telegram-боте",
        consequence: "OTO купили 28% (106 чел). Из них 22% дошли до флагмана. Сегментированная цепочка добрала ещё 27 продаж. Итого конверсия: 11.2%. ROMI 310%.",
        delta: { romi: 68, budget: -32000, conv: 29, score: 640 }, isOptimal: true,
      },
      {
        label: "Ретаргетинг в Яндекс.Аудиториях",
        icon: "🔁",
        detail: "Запустить ретаргетинг в Яндекс.Директ на всех 349 лидов через загрузку базы",
        consequence: "Потратили 45К ₽ на ретаргетинг. Конверсия +1.6%. Лиды уже видели рекламу — баннерная слепота. Дорого и неэффективно для тёплой базы.",
        delta: { romi: 4, budget: -45000, conv: 3, score: 95 }, isOptimal: false,
        trap: "Ретаргетинг не заменяет персональную коммуникацию",
      },
      {
        label: "Скидка 30% на флагман на 48 часов",
        icon: "⚡",
        detail: "Дедлайн-оффер: скидка 30% только 48 часов для участников вебинара",
        consequence: "Продали 16 флагманов. Выручка выросла, но маржа упала на 30%. Аудитория теперь ждёт скидок на каждый следующий запуск.",
        delta: { romi: 9, budget: 0, conv: 7, score: 125 }, isOptimal: false,
      },
      {
        label: "Личные звонки топ-50 лидам",
        icon: "🤝",
        detail: "Отдел продаж звонит 50 самым активным участникам (смотрели 80%+ вебинара)",
        consequence: "Закрыли 13 сделок. Хороший результат, но не масштабируется. Остальные 299 лидов не охвачены — деньги остались на столе.",
        delta: { romi: 18, budget: -38000, conv: 5, score: 195 }, isOptimal: false,
      },
    ],
  },
  {
    id: 5, day: 23, phase: "ОТЧЁТНОСТЬ", crisis: true, difficulty: "NIGHTMARE",
    title: "⚠ CEO-митинг: защита маркетингового бюджета",
    situation: "Квартальный отчёт B2C онлайн-школы. ROMI запуска: 155% (план был 220%). CEO: «Почему не выполнили план? Предлагаю урезать маркетинговый бюджет на 40% и перевести деньги в отдел продаж». У тебя 2 минуты на ответ.",
    metrics: "ROMI факт: 155% | ROMI план: 220% | Под угрозой: 40% бюджета | Бенчмарк B2C EdTech: 130%",
    insight: "Гипотеза: Данные + конкретный план роста + бенчмарки российского B2C EdTech 2026 убеждают CEO лучше, чем эмоции. Unit-экономика и LTV/CAC — язык CEO",
    options: [
      {
        label: "Unit-экономика + конкретный план на 200%+ в Q2",
        icon: "📊",
        detail: "Показать: LTV/CAC = 3.8x (при CAC 56 000 ₽ и LTV 213 000 ₽), бенчмарк B2C EdTech 2026 = 130%, наш результат = 155%. Конкретный план: 3 оптимизации воронки → 220%+ в Q2",
        consequence: "CEO: «Убедил. Оставляем бюджет и добавляем 20% на тест новых каналов». Совет одобрил план. Следующий запуск с увеличенным бюджетом.",
        delta: { romi: 28, budget: 180000, conv: 6, score: 580 }, isOptimal: true,
      },
      {
        label: "Объяснить провалом внешних факторов",
        icon: "🌧️",
        detail: "«Конкурент демпинговал, рынок просел, сезонность в EdTech»",
        consequence: "CEO: «Маркетинг не контролирует результат — зачем нам такой маркетинг?» Бюджет урезан на 50%. Тебя предупредили.",
        delta: { romi: -22, budget: -200000, conv: -4, score: 18 }, isOptimal: false,
        trap: "Внешние факторы — признак отсутствия ответственности",
      },
      {
        label: "Согласиться с урезанием бюджета",
        icon: "😔",
        detail: "«Да, мы не справились, принимаем решение об урезании»",
        consequence: "Бюджет урезан на 40%. Следующий запуск провален из-за нехватки трафика. Через квартал тебя заменяют.",
        delta: { romi: -18, budget: -160000, conv: -6, score: 8 }, isOptimal: false,
      },
      {
        label: "Предложить перейти на CPA-модель",
        icon: "🎯",
        detail: "«Давайте перейдём на CPA-модель с агентством — платим только за результат»",
        consequence: "CEO заинтересован, но CPA-агентства берут 35–45% маржи. ROMI упал ещё ниже. Потеряли контроль над воронкой и данными.",
        delta: { romi: -10, budget: -75000, conv: 1, score: 70 }, isOptimal: false,
      },
    ],
  },
  {
    id: 6, day: 28, phase: "МАСШТАБ", difficulty: "EXPERT",
    title: "Стратегия масштабирования на 6 месяцев",
    situation: "Первый запуск B2C онлайн-школы завершён. ROMI 155–310% в зависимости от твоих решений. Теперь нужно выбрать стратегию на следующие 6 месяцев. Бюджет: 1.8М ₽. Команда: 5 человек. Цель: x3 к выручке. Российский B2C EdTech 2026: рост 32% год к году, средний чек курса для физлиц — 28–65К ₽.",
    metrics: "Бюджет: 1.8М ₽ | Команда: 5 чел | Цель: x3 выручка | B2C EdTech: +32% г/г",
    insight: "Гипотеза: Продуктовая линейка OTO→Флагман→Апселл + автоматизация воронки = окупаемость трафика с первого касания и x3 к LTV за 6 месяцев",
    options: [
      {
        label: "Продуктовая линейка + автоматизация воронки",
        icon: "🏗️",
        detail: "OTO 1 490 ₽ → Флагман 39 900 ₽ → Апселл 65 000 ₽ (менторство). Автоворонка на каждый этап. Трафик окупается с OTO.",
        consequence: "За 6 месяцев: LTV вырос в 3.6 раза. Трафик окупается с первого касания. ROMI 380%. Команда работает на автопилоте. CEO предлагает удвоить бюджет на Q3.",
        delta: { romi: 80, budget: -140000, conv: 32, score: 720 }, isOptimal: true,
      },
      {
        label: "Удвоить бюджет на Яндекс.Директ",
        icon: "🚀",
        detail: "Влить 1.8М ₽ в Яндекс.Директ на проверенную воронку без изменений",
        consequence: "При масштабировании CPM вырос в 2.2 раза. ROMI упал с 145% до 75%. Алгоритмы Яндекса не справляются с резким ростом бюджета без оптимизации.",
        delta: { romi: -28, budget: -1800000, conv: 4, score: 45 }, isOptimal: false,
        trap: "Масштабирование без оптимизации воронки = сжигание денег",
      },
      {
        label: "Нанять 3 новых маркетологов",
        icon: "👥",
        detail: "Расширить команду: таргетолог, контент-маркетолог, аналитик данных",
        consequence: "ФОТ вырос на 720К ₽/год. Результат через 3 месяца — +12% к выручке. Проблема не в людях, а в системе воронки и продуктовой линейке.",
        delta: { romi: 4, budget: -720000, conv: 7, score: 85 }, isOptimal: false,
      },
      {
        label: "Диверсификация: 5 новых каналов одновременно",
        icon: "🌐",
        detail: "Тестировать параллельно: YouTube, Яндекс.Дзен, TenChat, Telegram Ads, ВКонтакте",
        consequence: "Распылили бюджет по 5 каналам. Ни один не получил достаточно данных для оптимизации. Через 3 месяца — хаос в аналитике и нет результата.",
        delta: { romi: -6, budget: -480000, conv: 2, score: 75 }, isOptimal: false,
        trap: "Диверсификация без фокуса = диверсификация провала",
      },
    ],
  },
];

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
type Screen = "intro" | "game" | "end";

const C = {
  bg: "#0a0a0a",
  card: "#111111",
  cardBorder: "#1e1e1e",
  red: "#ff2d20",
  redGlow: "rgba(255,45,32,0.25)",
  text: "#f5f5f0",
  muted: "rgba(245,245,240,0.5)",
  green: "#22c55e",
  yellow: "#facc15",
  blue: "#60a5fa",
  orange: "#fb923c",
};

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
  const { playing: musicPlaying, toggle: toggleMusic } = useGameMusic();

  const scene = SCENES[Math.min(idx, SCENES.length - 1)];
  const isCrisis = scene?.crisis ?? false;
  const isLast = idx >= SCENES.length - 1;
  const progress = (idx / SCENES.length) * 100;

  const { out: typeOut, done: typeDone } = useTypewriter(
    screen === "game" ? scene.situation : "", 20
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
    const isGood = opt.isOptimal;
    const comboMult = isGood ? Math.max(1, combo) : 1;
    const pts = Math.round(opt.delta.score * (isGood ? comboMult : 1));

    setBudget(b => b + opt.delta.budget);
    setRomi(r => r + opt.delta.romi);
    setConv(c => c + opt.delta.conv);
    setScore(s => s + pts);
    setScoreAnim({ val: pts, show: true });
    setTimeout(() => setScoreAnim(a => ({ ...a, show: false })), 1200);

    if (isGood) {
      setCombo(c => c + 1);
    } else {
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
    } catch {
      setFormSent(true);
    }
    setFormLoading(false);
  }

  const isWin = romi >= 80 && lives > 0;
  const timerPct = (timeLeft / timerSecs) * 100;
  const timerColor = timeLeft <= 5 ? C.red : timeLeft <= 12 ? C.yellow : C.green;
  const diffColor: Record<string, string> = { HARD: C.yellow, EXPERT: C.orange, NIGHTMARE: C.red };

  const css = `
    * { box-sizing: border-box; }
    body { margin: 0; background: ${C.bg}; overflow-x: hidden; font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; }

    @keyframes burstOut { to { transform: translate(var(--tx),var(--ty)) scale(0); opacity:0; } }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideL { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideR { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes crisisBorder { 0%,100%{border-color:${C.red}} 50%{border-color:#ff6b5b} }
    @keyframes scoreFloat { 0%{opacity:1;transform:translateX(-50%) translateY(0)} 100%{opacity:0;transform:translateX(-50%) translateY(-50px)} }
    @keyframes introSlide { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes avatarBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes glow { 0%,100%{box-shadow:0 0 20px ${C.redGlow}} 50%{box-shadow:0 0 40px rgba(255,45,32,0.4)} }

    .game-btn {
      background: ${C.red};
      color: #fff;
      border: none;
      border-radius: 8px;
      font-family: inherit;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 28px;
      cursor: pointer;
      transition: all 0.15s ease;
      letter-spacing: 0.5px;
    }
    .game-btn:hover { background: #e8261a; transform: translateY(-1px); box-shadow: 0 4px 20px ${C.redGlow}; }
    .game-btn:active { transform: translateY(0); }
    .game-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .game-btn.secondary {
      background: transparent;
      border: 1.5px solid ${C.cardBorder};
      color: ${C.text};
    }
    .game-btn.secondary:hover { border-color: ${C.red}; color: ${C.red}; background: rgba(255,45,32,0.05); }

    .opt-btn {
      background: ${C.card};
      border: 1.5px solid ${C.cardBorder};
      border-radius: 10px;
      color: ${C.text};
      font-family: inherit;
      font-size: 14px;
      text-align: left;
      width: 100%;
      padding: 14px 16px;
      cursor: pointer;
      transition: all 0.15s ease;
      position: relative;
      overflow: hidden;
    }
    .opt-btn:not(.disabled):hover {
      border-color: ${C.red};
      background: rgba(255,45,32,0.06);
      transform: translateX(3px);
    }
    .opt-btn.correct {
      border-color: ${C.green} !important;
      background: rgba(34,197,94,0.08) !important;
    }
    .opt-btn.wrong {
      border-color: ${C.red} !important;
      background: rgba(255,45,32,0.08) !important;
      animation: shake 0.4s ease;
    }
    .opt-btn.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .form-input {
      background: ${C.card};
      border: 1.5px solid ${C.cardBorder};
      border-radius: 8px;
      color: ${C.text};
      font-family: inherit;
      font-size: 15px;
      padding: 12px 14px;
      width: 100%;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus { border-color: ${C.red}; }
    .form-input::placeholder { color: rgba(245,245,240,0.25); }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.bg}; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  `;

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (screen === "intro") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <AnimatedBg crisis={false} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 600, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "introSlide 0.6s ease" }}>

        {/* Agency label */}
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 4, marginBottom: 24, textTransform: "uppercase", fontWeight: 600 }}>
          Гипотеза Agency · EdTech Simulator
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: "clamp(36px,9vw,64px)", fontWeight: 900, color: C.red, lineHeight: 1, letterSpacing: -1 }}>
            ВЕБИНАР
          </div>
          <div style={{ fontSize: "clamp(36px,9vw,64px)", fontWeight: 900, color: C.text, lineHeight: 1, letterSpacing: -1 }}>
            РАШ
          </div>
        </div>

        <div style={{ fontSize: 13, color: C.muted, letterSpacing: 3, marginBottom: 40, textTransform: "uppercase", fontWeight: 500 }}>
          CMO Simulator · EdTech Russia 2026
        </div>

        {/* Characters */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 36, padding: "24px 40px", background: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: 1 }}>
            <div style={{ animation: "avatarBob 2s ease-in-out infinite" }}>
              <CMOAvatar mood="idle" size={72} />
            </div>
            <div style={{ fontSize: 12, color: C.red, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Вы — CMO</div>
          </div>

          <div style={{ fontSize: 24, fontWeight: 900, color: C.red }}>VS</div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: 1 }}>
            <div style={{ animation: "avatarBob 2.5s ease-in-out infinite 0.5s" }}>
              <CEOAvatar angry={false} size={72} />
            </div>
            <div style={{ fontSize: 12, color: C.yellow, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>CEO-Босс</div>
          </div>
        </div>

        {/* Brief */}
        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.cardBorder}`, padding: "20px 24px", marginBottom: 24, width: "100%" }}>
          <div style={{ fontSize: 11, color: C.red, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Брифинг</div>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, margin: 0 }}>
            Ты — CMO детской онлайн-школы. Родители — твоя аудитория. CAC сейчас 56 000 ₽ — это провал.<br />
            <span style={{ color: C.red, fontWeight: 700 }}>30 дней. 500К ₽ бюджета. 7 реальных ситуаций.</span><br /><br />
            Каждое решение — реальный кейс российского рынка 2026 года.
            Таймер давит. CEO злится. Один неверный выбор — теряешь жизнь.
          </p>
          <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(255,45,32,0.06)", borderRadius: 8, border: `1px solid rgba(255,45,32,0.2)` }}>
            <span style={{ fontSize: 13, color: C.yellow, fontWeight: 600 }}>⚡ Сложность: EXPERT / NIGHTMARE</span>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28, width: "100%" }}>
          {[
            { icon: "💰", val: "500К ₽", lbl: "Бюджет", c: C.yellow },
            { icon: "⚡", val: "7", lbl: "Сценариев", c: C.red },
            { icon: "❤️", val: "3", lbl: "Жизни", c: C.red },
            { icon: "🔥", val: "×6", lbl: "Макс комбо", c: C.orange },
          ].map(s => (
            <div key={s.lbl} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.cardBorder}`, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: s.c, marginBottom: 2 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        <button className="game-btn" style={{ fontSize: 17, padding: "16px 56px", marginBottom: 12, width: "100%" }} onClick={() => setScreen("game")}>
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

    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <style>{css}</style>
        <AnimatedBg crisis={isCrisis} />
        <Bursts list={bursts} />

        {/* Score float */}
        {scoreAnim.show && (
          <div style={{
            position: "fixed", top: "20%", left: "50%", zIndex: 9999,
            fontSize: 28, fontWeight: 900,
            color: scoreAnim.val > 0 ? C.green : C.red,
            animation: "scoreFloat 1.2s ease-out forwards",
            pointerEvents: "none",
            textShadow: `0 0 20px ${scoreAnim.val > 0 ? C.green : C.red}`,
          }}>
            {scoreAnim.val > 0 ? `+${scoreAnim.val}` : scoreAnim.val}
          </div>
        )}

        {/* ── TOP BAR ── */}
        <div style={{
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${isCrisis ? C.red : C.cardBorder}`,
          padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          position: "sticky", top: 0, zIndex: 100,
          animation: isCrisis ? "crisisBorder 1.2s ease-in-out infinite" : "none",
        }}>
          {/* Logo */}
          <div style={{ fontSize: 14, fontWeight: 800, color: C.red, letterSpacing: 1 }}>
            ВЕБИНАР РАШ
          </div>

          {/* Progress */}
          <div style={{ flex: 1, minWidth: 60, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: C.red, borderRadius: 2, transition: "width 0.5s ease", boxShadow: `0 0 8px ${C.red}` }} />
          </div>

          {/* Day */}
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>День {scene.day}/30</div>

          {/* Lives */}
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ fontSize: 14, opacity: i < lives ? 1 : 0.15, transition: "opacity 0.3s" }}>❤️</span>
            ))}
          </div>

          {/* Combo */}
          {combo >= 2 && (
            <div style={{ fontSize: 13, fontWeight: 800, color: C.yellow, padding: "2px 8px", background: "rgba(250,204,21,0.1)", borderRadius: 6, border: `1px solid rgba(250,204,21,0.3)` }}>
              ×{combo} 🔥
            </div>
          )}

          {/* Score */}
          <div style={{ fontSize: 14, fontWeight: 800, color: C.yellow }}>
            {score.toLocaleString()} очков
          </div>

          {/* Difficulty badge */}
          <div style={{ fontSize: 10, fontWeight: 700, color: "#000", background: diffColor[scene.difficulty], padding: "3px 8px", borderRadius: 4, letterSpacing: 0.5 }}>
            {scene.difficulty}
          </div>

          {/* Phase */}
          <div style={{ fontSize: 11, fontWeight: 600, color: isCrisis ? C.red : C.muted, padding: "2px 8px", border: `1px solid ${isCrisis ? C.red : C.cardBorder}`, borderRadius: 4, animation: isCrisis ? "pulse 1s ease-in-out infinite" : "none" }}>
            {isCrisis ? "⚠ КРИЗИС" : scene.phase}
          </div>

          {/* Music toggle */}
          <button
            onClick={toggleMusic}
            style={{
              background: musicPlaying ? "rgba(250,204,21,0.1)" : "transparent",
              border: `1px solid ${musicPlaying ? "rgba(250,204,21,0.4)" : C.cardBorder}`,
              borderRadius: 6,
              color: musicPlaying ? C.yellow : C.muted,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: 14,
              transition: "all 0.2s",
              lineHeight: 1,
            }}
            title={musicPlaying ? "Выключить музыку" : "Включить музыку"}
          >
            {musicPlaying ? "🎵" : "🔇"}
          </button>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 10 }}>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, background: C.card, borderRadius: 10, border: `1px solid ${C.cardBorder}`, padding: "14px 16px" }}>
            <MetricBar val={budget} max={500000} color={budget < 80000 ? C.red : C.yellow} label="Бюджет" icon="💰" />
            <MetricBar val={Math.max(0, romi)} max={200} color={romi >= 100 ? C.green : romi >= 50 ? C.yellow : C.red} label="ROMI %" icon="📈" />
            <MetricBar val={conv} max={40} color={C.blue} label="Конверсия" icon="🎯" />
          </div>

          {/* Timer */}
          {chosen === null && typeDone && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: isCrisis ? C.red : C.muted, fontWeight: 600 }}>
                  {isCrisis ? "⚠ КРИЗИС — РЕШАЙ БЫСТРО" : "⏱ Время на решение"}
                </span>
                <span style={{ fontSize: 18, fontWeight: 900, color: timerColor, animation: timeLeft <= 5 ? "pulse 0.4s steps(1) infinite" : "none" }}>
                  {timeLeft}с
                </span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${timerPct}%`, height: "100%", background: timerColor, borderRadius: 3, transition: "width 1s linear", boxShadow: `0 0 8px ${timerColor}66` }} />
              </div>
            </div>
          )}

          {/* Scene title */}
          <div style={{ fontSize: "clamp(16px,3vw,20px)", fontWeight: 800, color: isCrisis ? C.red : C.text, animation: "fadeUp 0.3s ease", lineHeight: 1.3 }}>
            {scene.title}
          </div>

          {/* Characters + Dialogue */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", animation: "fadeUp 0.4s ease" }}>
            {/* CMO */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ animation: showRes ? "none" : "avatarBob 2s ease-in-out infinite" }}>
                <CMOAvatar mood={showRes ? (isGood ? "win" : "lose") : "think"} size={56} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>CMO</div>
            </div>

            {/* Dialogue box */}
            <div style={{
              flex: 1,
              background: C.card,
              borderRadius: 12,
              border: `1.5px solid ${isCrisis ? C.red : C.cardBorder}`,
              padding: "16px 18px",
              boxShadow: isCrisis ? `0 0 24px ${C.redGlow}` : "none",
              animation: isCrisis ? "crisisBorder 1.5s ease-in-out infinite" : "none",
              position: "relative",
            }}>
              {/* Speech bubble tail */}
              <div style={{ position: "absolute", left: -8, top: 18, width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderRight: `8px solid ${isCrisis ? C.red : C.cardBorder}` }} />

              {isCrisis && (
                <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 10, animation: "pulse 0.8s ease-in-out infinite", letterSpacing: 1 }}>
                  ⚠ КРИЗИСНАЯ СИТУАЦИЯ
                </div>
              )}

              <div style={{ fontSize: "clamp(13px,2vw,15px)", color: C.text, lineHeight: 1.75, fontWeight: 400 }}>
                {typeOut}
                {!typeDone && <span style={{ animation: "pulse 0.6s steps(1) infinite" }}>|</span>}
              </div>

              {typeDone && (
                <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, fontSize: 12, color: C.muted, lineHeight: 1.7, animation: "fadeUp 0.4s ease", fontWeight: 500 }}>
                  📊 {scene.metrics}
                </div>
              )}
            </div>

            {/* CEO */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ animation: "avatarBob 2.5s ease-in-out infinite 0.5s" }}>
                <CEOAvatar angry={isCrisis || (showRes && !isGood)} size={56} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>CEO</div>
            </div>
          </div>

          {/* Options */}
          {!showRes && typeDone && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "slideL 0.4s ease" }}>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                ▶ Выберите стратегию:
              </div>
              {scene.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                  <button
                    key={i}
                    className={`opt-btn${chosen !== null ? " disabled" : ""}`}
                    onClick={(e) => { spawnBurst(e.clientX, e.clientY, opt.isOptimal ?? false); pick(i); }}
                    disabled={chosen !== null}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,45,32,0.1)", border: `1px solid rgba(255,45,32,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 800, color: C.red }}>
                        {letter}
                      </div>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{opt.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: C.text }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{opt.detail}</div>
                      </div>
                      {opt.delta.budget !== 0 && (
                        <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: opt.delta.budget < 0 ? C.red : C.green, padding: "2px 8px", background: opt.delta.budget < 0 ? "rgba(255,45,32,0.1)" : "rgba(34,197,94,0.1)", borderRadius: 4 }}>
                          {opt.delta.budget > 0 ? "+" : ""}{(opt.delta.budget / 1000).toFixed(0)}К
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Result */}
          {showRes && chosenOpt && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              {/* Chosen option highlight */}
              <div className={`opt-btn ${isGood ? "correct" : "wrong"}`} style={{ marginBottom: 12, cursor: "default" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{isGood ? "✅" : "❌"}</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{chosenOpt.label}</span>
                  {combo >= 2 && isGood && (
                    <span style={{ fontSize: 12, color: C.yellow, fontWeight: 700, padding: "2px 8px", background: "rgba(250,204,21,0.1)", borderRadius: 4 }}>
                      КОМБО ×{combo}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: 0 }}>{chosenOpt.consequence}</p>
                {chosenOpt.trap && (
                  <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(255,45,32,0.08)", borderRadius: 6, border: `1px solid rgba(255,45,32,0.2)`, fontSize: 12, color: C.red, fontWeight: 600 }}>
                    ⚠ {chosenOpt.trap}
                  </div>
                )}
              </div>

              {/* Insight */}
              <div style={{ background: "rgba(255,45,32,0.05)", borderRadius: 10, border: `1px solid rgba(255,45,32,0.2)`, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: C.red, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                  💡 Инсайт Гипотезы
                </div>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>{scene.insight}</p>
              </div>

              {/* Deltas */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  { l: "ROMI", v: chosenOpt.delta.romi, s: "%" },
                  { l: "Бюджет", v: chosenOpt.delta.budget / 1000, s: "К" },
                  { l: "Конверсия", v: chosenOpt.delta.conv, s: "%" },
                  { l: "Очки", v: scoreAnim.val || chosenOpt.delta.score, s: "" },
                ].map(d => (
                  <div key={d.l} style={{ background: C.card, borderRadius: 8, border: `1px solid ${C.cardBorder}`, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 500 }}>{d.l}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: d.v > 0 ? C.green : d.v < 0 ? C.red : C.muted }}>
                      {d.v > 0 ? "+" : ""}{d.v}{d.s}
                    </div>
                  </div>
                ))}
              </div>

              <button className="game-btn" style={{ width: "100%" }} onClick={next}>
                {isLast || lives <= 0 ? "▶ Завершить запуск" : `▶ День ${SCENES[Math.min(idx + 1, SCENES.length - 1)]?.day || 30} →`}
              </button>
            </div>
          )}
        </div>

        {/* Bottom status */}
        <div style={{ borderTop: `1px solid ${C.cardBorder}`, padding: "8px 16px", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "sticky", bottom: 0, zIndex: 100, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)" }}>
          {[
            { l: "Бюджет", v: `${(budget / 1000).toFixed(0)}К ₽`, c: budget < 80000 ? C.red : C.yellow },
            { l: "ROMI", v: `${romi}%`, c: romi >= 100 ? C.green : romi >= 0 ? C.yellow : C.red },
            { l: "Конверсия", v: `${conv.toFixed(1)}%`, c: C.blue },
            { l: "Очки", v: score.toLocaleString(), c: C.yellow },
            { l: "Комбо", v: combo >= 2 ? `×${combo} 🔥` : "—", c: C.orange },
          ].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>{s.l}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── END SCREEN ────────────────────────────────────────────────────────────
  const isNegative = score < 900;
  const rank =
    score >= 2800 ? { title: "🏆 Маркетинг-легенда", sub: "Ты переиграл CEO и рынок", c: C.green } :
    score >= 1800 ? { title: "⭐⭐ Сильный CMO", sub: "CEO доволен. Бюджет сохранён", c: C.yellow } :
    score >= 900  ? { title: "⭐ Растущий CMO", sub: "Есть потенциал, но воронка дырявая", c: C.orange } :
                    { title: "💀 Стажёр маркетинга", sub: "CEO урезал бюджет. Ищи новую работу", c: C.red };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <AnimatedBg crisis={!isWin} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 600, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "introSlide 0.5s ease" }}>

        <div style={{ fontSize: "clamp(24px,6vw,40px)", fontWeight: 900, color: isWin ? C.green : C.red, marginBottom: 6, textAlign: "center" }}>
          {isWin ? "Запуск удался! 🎉" : "Провал запуска 💀"}
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 28, textAlign: "center", fontWeight: 500 }}>
          {isWin ? "Ты доказал CEO что маркетинг работает" : "CEO урезал бюджет. Следующий квартал под угрозой"}
        </div>

        {/* Final avatar */}
        <div style={{ marginBottom: 24, animation: "avatarBob 1.5s ease-in-out infinite" }}>
          <CMOAvatar mood={isWin ? "win" : "lose"} size={96} />
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, width: "100%", marginBottom: 16 }}>
          {[
            { l: "Итоговый ROMI", v: `${romi}%`, c: romi >= 100 ? C.green : romi >= 50 ? C.yellow : C.red, i: "📈" },
            { l: "Остаток бюджета", v: `${(budget / 1000).toFixed(0)}К ₽`, c: C.yellow, i: "💰" },
            { l: "Конверсия", v: `${conv.toFixed(1)}%`, c: C.blue, i: "🎯" },
            { l: "Итоговый счёт", v: score.toLocaleString(), c: C.yellow, i: "⭐" },
          ].map(s => (
            <div key={s.l} style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.cardBorder}`, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div>
              <div style={{ fontSize: "clamp(18px,4vw,24px)", fontWeight: 900, color: s.c, marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Rank */}
        <div style={{ background: C.card, borderRadius: 12, border: `1.5px solid ${rank.c}44`, padding: "16px 20px", marginBottom: 16, width: "100%", textAlign: "center", boxShadow: `0 0 24px ${rank.c}22` }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Ранг CMO</div>
          <div style={{ fontSize: "clamp(16px,3.5vw,22px)", fontWeight: 800, color: rank.c, marginBottom: 6 }}>{rank.title}</div>
          <div style={{ fontSize: 13, color: C.muted }}>{rank.sub}</div>
        </div>

        {/* Lead form */}
        {!formSent ? (
          <div style={{ background: C.card, borderRadius: 12, border: `1.5px solid ${C.red}44`, padding: "20px", width: "100%", marginBottom: 14, boxShadow: `0 0 28px ${C.redGlow}` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.red, marginBottom: 6 }}>
              {isNegative ? "Хочешь окупаемый запуск?" : "Хочешь такой ROMI в реальности?"}
            </div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.7 }}>
              {isNegative
                ? "Покажем как делать запуски с ROMI 200%+. На реальных кейсах Гипотезы — без воды."
                : "Разберём твою воронку бесплатно за 30 минут. Покажем где теряются деньги прямо сейчас."
              }
            </div>
            <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="form-input" placeholder="Имя" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} required />
              <input className="form-input" placeholder="Телефон" type="tel" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} required />
              <input className="form-input" placeholder="Email" type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} required />
              <button className="game-btn" type="submit" style={{ marginTop: 4 }} disabled={formLoading}>
                {formLoading ? "Отправка..." : "▶ Разобрать мою воронку"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: "rgba(34,197,94,0.08)", borderRadius: 12, border: `1.5px solid rgba(34,197,94,0.3)`, padding: "24px", width: "100%", marginBottom: 14, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.green, marginBottom: 8 }}>Заявка принята!</div>
            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
              Свяжемся в течение 2 часов.<br />Готовься к разбору воронки.
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, width: "100%", flexWrap: "wrap" }}>
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
