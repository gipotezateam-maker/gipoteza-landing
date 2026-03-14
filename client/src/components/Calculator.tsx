// Calculator.tsx
// Design: Dark editorial, same language as main site
// Colors: #0A0A0A bg, #E8E0D0 text, #E63329 accent red, #22C55E green for potential
// Typography: Bebas Neue for numbers, Inter for labels
// Layout: Left sliders, Right live results, full-width chart below

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface SliderProps {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ label, hint, value, min, max, step, format, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-6">
      <div className="flex justify-between items-baseline mb-1">
        <span style={{ color: "#A09880", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
        <span style={{ color: "#E8E0D0", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.04em" }}>
          {format(value)}
        </span>
      </div>
      <div style={{ position: "relative", height: "4px", background: "#1E1E1E", borderRadius: "2px", marginBottom: "6px" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            background: "#E63329",
            borderRadius: "2px",
            transition: "width 0.1s",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute",
            top: "-8px",
            left: 0,
            width: "100%",
            height: "20px",
            opacity: 0,
            cursor: "pointer",
            margin: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${pct}%`,
            transform: "translate(-50%, -50%)",
            width: "14px",
            height: "14px",
            background: "#E63329",
            borderRadius: "50%",
            border: "2px solid #0A0A0A",
            boxShadow: "0 0 0 2px #E63329",
            pointerEvents: "none",
            transition: "left 0.1s",
          }}
        />
      </div>
      <p style={{ color: "#5A5040", fontSize: "0.72rem", margin: 0 }}>{hint}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  accent,
  large,
}: {
  label: string;
  value: string;
  delta?: string;
  accent?: string;
  large?: boolean;
}) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #1E1E1E",
        borderRadius: "8px",
        padding: large ? "20px" : "16px",
        flex: "1 1 calc(50% - 8px)",
        minWidth: "120px",
      }}
    >
      <div style={{ color: "#5A5040", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: large ? "2.4rem" : "1.6rem",
          letterSpacing: "0.04em",
          color: accent || "#E8E0D0",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {delta && (
        <div style={{ color: "#22C55E", fontSize: "0.72rem", marginTop: "4px" }}>
          {delta}
        </div>
      )}
    </div>
  );
}

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1).replace(".0", "")} млн ₽`
    : n >= 1_000
    ? `${Math.round(n / 1_000)} тыс ₽`
    : `${Math.round(n)} ₽`;

const fmtNum = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}K` : String(Math.round(n));

const fmtPct = (n: number) => `${Math.round(n)}%`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1A1A1A", border: "1px solid #333", borderRadius: "6px", padding: "10px 14px" }}>
        <p style={{ color: "#A09880", fontSize: "0.75rem", margin: "0 0 4px" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.fill, fontSize: "0.85rem", margin: "2px 0", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Calculator() {
  const [budget, setBudget] = useState(100_000);
  const [cpr, setCpr] = useState(200);
  const [c1, setC1] = useState(30);
  const [attendance, setAttendance] = useState(25);
  const [price, setPrice] = useState(50_000);
  const [conversion, setConversion] = useState(2);
  const [launches, setLaunches] = useState(2);
  const [upsell, setUpsell] = useState(0);

  const calc = useMemo(() => {
    // C1: конверсия из клика в регистрацию (заявку)
    const clicks = budget > 0 && cpr > 0 ? Math.round(budget / cpr) : 0;
    const registrations = Math.round(clicks * (c1 / 100));
    const participants = Math.round(registrations * launches);
    const watched = Math.round(participants * (attendance / 100));
    const bought = Math.round(watched * (conversion / 100));
    const revenue = bought * price + bought * upsell;
    // ROMI = (выручка - бюджет) / бюджет * 100 — корректная формула с учётом убытка
    const romi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;

    // Potential with Gipoteza
    const newC1 = Math.max(50, c1);
    const newAttendance = Math.max(50, attendance);
    const newConversion = Math.max(10, conversion);
    const newRegistrations = Math.round(clicks * (newC1 / 100));
    const newParticipants = Math.round(newRegistrations * launches);
    const newWatched = Math.round(newParticipants * (newAttendance / 100));
    const newBought = Math.round(newWatched * (newConversion / 100));
    const newRevenue = newBought * price + newBought * upsell;
    const newRomi = budget > 0 ? ((newRevenue - budget) / budget) * 100 : 0;

    const delta = newRevenue - revenue;
    const deltaRomi = newRomi - romi;

    let recommendation = "";
    let recColor = "#E8E0D0";
    if (romi < 0) {
      recommendation = "🔴 Убыток. Вебинар не окупает вложения. Каждый запуск — минус в бюджете. Нужна срочная перестройка воронки.";
      recColor = "#E63329";
    } else if (romi < 100) {
      recommendation = "⚠️ Вебинар окупается, но слабо. Вложения возвращаются, но прибыль минимальна. Есть серьёзный потенциал роста.";
      recColor = "#F59E0B";
    } else if (romi < 300) {
      recommendation = "⚡ Вебинар работает, но есть серьёзный потенциал роста. Оптимизация воронки даст x3–x5 к выручке.";
      recColor = "#F59E0B";
    } else {
      recommendation = "✅ Вебинар окупается хорошо — но мы можем увеличить выручку ещё на 300–500%.";
      recColor = "#22C55E";
    }

    return {
      clicks, registrations, participants, watched, bought, revenue, romi,
      newC1, newAttendance, newConversion, newRegistrations, newParticipants,
      newWatched, newBought, newRevenue, newRomi,
      delta, deltaRomi,
      recommendation, recColor,
    };
  }, [budget, cpr, c1, attendance, price, conversion, launches, upsell]);

  const chartData = [
    {
      name: "Доходимость",
      "Сейчас": attendance,
      "С Гипотезой": calc.newAttendance,
      unit: "%",
    },
    {
      name: "Конверсия",
      "Сейчас": conversion,
      "С Гипотезой": calc.newConversion,
      unit: "%",
    },
    {
      name: "Купили",
      "Сейчас": calc.bought,
      "С Гипотезой": calc.newBought,
      unit: " чел",
    },
  ];

  return (
    <section
      id="calculator"
      style={{ background: "#0A0A0A", padding: "100px 0", borderTop: "1px solid #1A1A1A" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "60px" }}>
          <div
            style={{
              display: "inline-block",
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "100px",
              padding: "6px 16px",
              marginBottom: "20px",
            }}
          >
            <span style={{ color: "#E63329", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Калькулятор
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 4.5rem)",
              letterSpacing: "-0.02em",
              color: "#F5F5F0",
              lineHeight: 1.05,
              fontWeight: 900,
              margin: "0 0 20px",
            }}
          >
            Рассчитайте потенциал<br />
            <span style={{ color: "#E63329" }}>вашего вебинара</span>
          </h2>
          <p style={{ color: "#6B6050", fontSize: "1.05rem", maxWidth: "560px", margin: 0, lineHeight: 1.6 }}>
            Введите ваши текущие цифры и узнайте, сколько денег вы теряете каждый месяц из-за неоптимизированной воронки
          </p>
        </div>

        {/* Main layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
          className="calc-grid"
        >
          {/* LEFT: Sliders */}
          <div>
            <Slider
              label="Бюджет на трафик"
              hint="Сколько вы тратите в месяц на привлечение людей на вебинар?"
              value={budget}
              min={10_000}
              max={10_000_000}
              step={10_000}
              format={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1).replace('.0', '')} млн ₽` : `${(v / 1000).toFixed(0)} тыс ₽`}
              onChange={setBudget}
            />
            <Slider
              label="Стоимость регистрации (CPR)"
              hint="Во сколько обходится одна регистрация (заявка) на вебинар?"
              value={cpr}
              min={50}
              max={10_000}
              step={50}
              format={(v) => v >= 1000 ? `${(v/1000).toFixed(1).replace('.0','')} тыс ₽` : `${v} ₽`}
              onChange={setCpr}
            />
            <Slider
              label="C1 — конверсия в заявку"
              hint="Какой % людей, увидевших лендинг, оставляют заявку на вебинар?"
              value={c1}
              min={1}
              max={80}
              step={1}
              format={(v) => `${v}%`}
              onChange={setC1}
            />
            <Slider
              label="Доходимость вебинара"
              hint="Холодная аудитория: 20–30%. Тёплая: 40–60%"
              value={attendance}
              min={5}
              max={80}
              step={1}
              format={fmtPct}
              onChange={setAttendance}
            />
            <Slider
              label="Цена продукта"
              hint="Сколько стоит ваш основной курс или программа?"
              value={price}
              min={1_000}
              max={500_000}
              step={1_000}
              format={(v) => fmt(v)}
              onChange={setPrice}
            />
            <Slider
              label="Конверсия в покупку"
              hint="Без оптимизации: 1–3%. С хорошей воронкой: 5–15%"
              value={conversion}
              min={0.5}
              max={20}
              step={0.5}
              format={(v) => `${v}%`}
              onChange={setConversion}
            />
            <Slider
              label="Запусков в месяц"
              hint="Сколько раз в месяц вы запускаете вебинар?"
              value={launches}
              min={1}
              max={8}
              step={1}
              format={(v) => `${v} раза`}
              onChange={setLaunches}
            />
            <Slider
              label="Доп. продажи (апсел)"
              hint="Средний чек на дополнительные услуги после основного курса"
              value={upsell}
              min={0}
              max={200_000}
              step={5_000}
              format={(v) => (v === 0 ? "нет" : fmt(v))}
              onChange={setUpsell}
            />
          </div>

          {/* RIGHT: Results */}
          <div>
            {/* Current results */}
            <div
              style={{
                background: "#111",
                border: "1px solid #1E1E1E",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "16px",
              }}
            >
              <div style={{ color: "#5A5040", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
                Ваши текущие результаты
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <StatCard label="Участников" value={fmtNum(calc.participants)} />
                <StatCard label="Досмотрели" value={fmtNum(calc.watched)} />
                <StatCard label="Купили" value={fmtNum(calc.bought)} />
                <StatCard label="Выручка" value={fmt(calc.revenue)} />
                <StatCard
                  label="ROMI"
                  value={`${calc.romi >= 0 ? '+' : ''}${Math.round(calc.romi)}%`}
                  accent={calc.romi < 0 ? "#E63329" : calc.romi < 100 ? "#F59E0B" : "#22C55E"}
                />
              </div>
            </div>

            {/* Potential */}
            <div
              style={{
                background: "#0D1A0D",
                border: "1px solid #1A3A1A",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "16px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <div style={{ color: "#22C55E", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "6px" }}>
                  Ваш вебинар с агентством Гипотеза
                </div>
                <div style={{ color: "#4A5040", fontSize: "0.78rem", lineHeight: 1.5 }}>
                  Мы оптимизируем C1, доходимость и конверсию — вот что получается у наших клиентов
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <StatCard large label="Участников" value={fmtNum(calc.newParticipants)} />
                <StatCard
                  large
                  label="Досмотрели"
                  value={fmtNum(calc.newWatched)}
                  delta={calc.newWatched > calc.watched ? `+${fmtNum(calc.newWatched - calc.watched)} чел` : undefined}
                />
                <StatCard
                  large
                  label="Купили"
                  value={fmtNum(calc.newBought)}
                  delta={calc.newBought > calc.bought ? `+${fmtNum(calc.newBought - calc.bought)} чел` : undefined}
                />
                <StatCard
                  large
                  label="Выручка"
                  value={fmt(calc.newRevenue)}
                  delta={calc.newRevenue > calc.revenue ? `+${fmt(calc.newRevenue - calc.revenue)}` : undefined}
                  accent="#22C55E"
                />
                <StatCard
                  large
                  label="ROMI"
                  value={`${calc.newRomi >= 0 ? '+' : ''}${Math.round(calc.newRomi)}%`}
                  accent="#22C55E"
                  delta={calc.deltaRomi > 0 ? `+${Math.round(calc.deltaRomi)} п.п.` : undefined}
                />
              </div>
            </div>

            {/* Delta */}
            {calc.delta > 0 && (
              <div
                style={{
                  background: "#1A0A0A",
                  border: "1px solid #3A1A1A",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#5A5040", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                  Ваша дополнительная прибыль в месяц
                </div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    color: "#E63329",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  +{fmt(calc.delta)}
                </div>
                <div style={{ color: "#5A5040", fontSize: "0.75rem", marginTop: "8px" }}>
                  Это деньги, которые вы оставляете на столе каждый месяц
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div
              style={{
                background: "#111",
                border: `1px solid ${calc.recColor}33`,
                borderRadius: "12px",
                padding: "16px 20px",
              }}
            >
              <p style={{ color: calc.recColor, fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>
                {calc.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div
          style={{
            background: "#111",
            border: "1px solid #1E1E1E",
            borderRadius: "12px",
            padding: "32px",
            marginTop: "48px",
          }}
        >
          <div style={{ color: "#5A5040", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "28px" }}>
            Сравнение показателей: До / После
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { label: "Доходимость", before: attendance, after: calc.newAttendance, max: 100, unit: "%", hint: "досмотрели вебинар" },
              { label: "C1 — конверсия", before: c1, after: calc.newC1, max: 100, unit: "%", hint: "заявок на вебинар" },
              { label: "Продажи с вебинара", before: conversion, after: calc.newConversion, max: 30, unit: "%", hint: "купили после эфира" },
              { label: "Купили (чел)", before: calc.bought, after: calc.newBought, max: Math.max(calc.newBought * 1.2, 1), unit: "", hint: "человек" },
              { label: "Выручка", before: calc.revenue, after: calc.newRevenue, max: Math.max(calc.newRevenue * 1.2, 1), unit: "₽", hint: "за запуск" },
            ].map(({ label, before, after, max, unit, hint }) => {
              const beforePct = Math.min((before / max) * 100, 100);
              const afterPct = Math.min((after / max) * 100, 100);
              const fmtVal = (v: number) => unit === "₽" ? fmt(v) : `${Math.round(v)}${unit}`;
              const improved = after > before;
              return (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#E8E0D0", fontSize: "0.85rem", fontWeight: 600 }}>{label}</span>
                      <span style={{ color: "#3A3020", fontSize: "0.72rem" }}>{hint}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ color: "#5A5040", fontSize: "0.85rem", textDecoration: "line-through" }}>{fmtVal(before)}</span>
                      <span style={{ color: improved ? "#22C55E" : "#E8E0D0", fontSize: "1rem", fontWeight: 700, fontFamily: "'Unbounded', sans-serif" }}>{fmtVal(after)}</span>
                      {improved && (
                        <span style={{ color: "#22C55E", fontSize: "0.72rem", background: "rgba(34,197,94,0.12)", padding: "2px 6px", borderRadius: "4px" }}>
                          +{unit === "₽" ? fmt(after - before) : `${Math.round(after - before)}${unit}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ position: "relative", height: "8px", background: "#1A1A1A", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${beforePct}%`, background: "#2E2E2E", borderRadius: "4px", transition: "width 0.5s ease" }} />
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${afterPct}%`, background: "linear-gradient(90deg, #16A34A, #22C55E)", borderRadius: "4px", transition: "width 0.5s ease", opacity: 0.85 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ color: "#6B6050", fontSize: "0.9rem", marginBottom: "24px" }}>
            Это не обещание — это результат, который мы видим в 90% кейсов
          </p>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              background: "#E63329",
              color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.1rem",
              letterSpacing: "0.12em",
              padding: "16px 40px",
              borderRadius: "4px",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
          >
            Обсудить результаты с экспертом →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .calc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
