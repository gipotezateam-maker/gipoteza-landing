// Design: Dark editorial — same style as Home.tsx
// Bebas Neue display, Inter body, #FF2D20 accent, #0A0A0A bg

import { useState } from "react";
import { Link, useRoute } from "wouter";

// ─── Case Data ────────────────────────────────────────────────────────────────

const casesData: Record<string, CaseData> = {
  "primekraft": {
    id: "primekraft",
    client: "Primekraft",
    tag: "D2C / FMCG",
    title: "AI-бот вместо CRM-специалиста",
    subtitle: "GPT-логика собрала микросегменты и подняла средний чек на 12%",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/case-primekraft-hero-6MQGReBzzYchEsvsKAcFAA.webp",
    results: [
      { value: "+12%", label: "Средний чек" },
    ],
    challenge: "Бренд спортивного питания Primekraft хотел увеличить средний чек и выстроить персонализированную коммуникацию — без раздутого штата CRM-специалистов.",
    solution: [
      "Разработали AI-бота с GPT-логикой: 3–5 вопросов → профиль пользователя → микросегмент",
      "Персональный оффер под каждый сегмент: набор массы, похудение, восстановление, энергия",
      "Встроили допродажи: бот предлагает сопутствующие продукты после добавления в корзину",
      "Настроили аналитику сегментов: какие офферы конвертируют лучше",
    ],
  },

  "school1-webinar": {
    id: "school1-webinar",
    client: "Онлайн-школа №1",
    tag: "EdTech / Живой вебинар",
    title: "Живой вебинар с нуля — CAC −44%",
    subtitle: "Создали формат живого мероприятия и снизили стоимость привлечения клиента вдвое",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/case-school1-webinar-hero-Q8KbBKxPLh2x4K2eFkY39d.webp",
    results: [
      { value: "−44%", label: "CAC (стоимость привлечения клиента)" },
    ],
    challenge: "Онлайн-школа №1 работала только с контентными воронками — живого формата не было. Нужно было создать мероприятие с нуля, которое греет холодную аудиторию и даёт стабильный поток заявок.",
    solution: [
      "Разработали структуру эфира под боли родителей и учеников: интерактивы, реальные кейсы",
      "Написали сценарий под 3 сегмента: родители младшеклассников, старшеклассники перед ЕГЭ, семейное обучение",
      "Настроили бот-сегментацию: каждый участник получал релевантный оффер после эфира",
      "Протестировали несколько связок «тема → аудитория → оффер», оставили лучшую",
    ],
  },

  "school1-traffic": {
    id: "school1-traffic",
    client: "Онлайн-школа №1",
    tag: "EdTech / Трафик ВК",
    title: "Перезапуск трафика ВКонтакте",
    subtitle: "20+ протестированных креативов, TOP-5 связок, стоимость лида −45%",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/case-school1-traffic-hero-JeMNfYWRNhUapS8u3PZsVg.webp",
    results: [
      { value: "−45%", label: "Стоимость квал-лида" },
      { value: "−44%", label: "Стоимость оплаты от плана" },
    ],
    challenge: "Предыдущие кампании ВКонтакте давали дорогие лиды с низкой конверсией в оплату. Нужно было найти рабочие связки и снизить стоимость целевого лида.",
    solution: [
      "Провели анализ целевых лидов: нашли паттерны заявок, которые реально конвертируются в оплату",
      "Протестировали 20+ креативов: видео, карусель, статика — разные боли и триггеры",
      "Выделили TOP-5 связок с самой высокой конверсией в квалифицированный лид",
      "Выстроили систему масштабирования: дубли кампаний + плавный рост бюджета без просадки CPL",
    ],
  },

  "eteri": {
    id: "eteri",
    client: "Этери Бериашвили",
    tag: "Онлайн-курс / Вокал",
    title: "Автоворонка под холодный трафик",
    subtitle: "Пересобрали механику, переписали коммуникацию — Tripwire +22%",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/case-eteri-hero-YcXvwfT3VMvr6jpBpG83Pb.webp",
    results: [
      { value: "−20%", label: "Стоимость регистрации" },
      { value: "+5%", label: "Конверсия в заявку" },
      { value: "+22%", label: "Конверсия в Tripwire" },
    ],
    challenge: "Автоворонка Этери Бериашвили работала на тёплую аудиторию. При запуске холодного трафика показатели падали — нужно было пересобрать воронку с нуля под новую аудиторию.",
    solution: [
      "Провели кастдев: выявили реальные мотивы (не «петь красиво», а «уверенность», «выступать без страха»)",
      "Переписали коммуникацию под эти мотивы: бот, письма, страницы, триггеры",
      "Обновили визуал: чистые экраны, единая стилистика, видео с живой подачей Этери",
      "Настроили A/B-тесты на ключевых этапах: регистрация, прогрев, Tripwire",
    ],
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ResultItem = { value: string; label: string };
type CaseData = {
  id: string;
  client: string;
  tag: string;
  title: string;
  subtitle: string;
  heroImage: string;
  results: ResultItem[];
  challenge: string;
  solution: string[];
};

// ─── Modal Form ───────────────────────────────────────────────────────────────

const TELEGRAM_BOT_TOKEN = "8672812865:AAGt98zHZj_Q2r5DnSNXxMl_fNe_Ti9DPxw";
const TELEGRAM_CHAT_ID = "1342421992";

function LeadModal({ caseTitle, onClose }: { caseTitle: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const text = `🎯 Заявка с кейса: ${caseTitle}\n\n👤 Имя: ${name}\n🏢 Ниша: ${niche}\n📱 Контакт: ${contact}`;
    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
      });
      if (!res.ok) throw new Error("Telegram error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111", border: "1px solid rgba(255,255,255,0.1)",
          padding: "2.5rem", maxWidth: "480px", width: "100%",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "none", border: "none", color: "rgba(255,255,255,0.4)",
            cursor: "pointer", fontSize: "1.5rem", lineHeight: 1,
          }}
        >
          ×
        </button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
            <h3 className="font-display" style={{ fontSize: "2rem", color: "#F5F5F0", marginBottom: "0.75rem" }}>
              ОТЛИЧНО!
            </h3>
            <p style={{ fontFamily: "Inter", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              Заявка принята. Свяжемся с вами в течение рабочего дня.
            </p>
          </div>
        ) : (
          <>
            <h3 className="font-display" style={{ fontSize: "1.8rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.5rem" }}>
              БЕСПЛАТНЫЙ РАЗБОР
            </h3>
            <p style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", marginBottom: "2rem" }}>
              Разберём вашу воронку и покажем, где теряются деньги
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                required
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#F5F5F0", padding: "0.875rem 1rem", fontFamily: "Inter", fontSize: "0.95rem",
                  outline: "none",
                }}
              />
              <input
                required
                placeholder="Ваша ниша / проект"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#F5F5F0", padding: "0.875rem 1rem", fontFamily: "Inter", fontSize: "0.95rem",
                  outline: "none",
                }}
              />
              <input
                required
                placeholder="Telegram или телефон"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#F5F5F0", padding: "0.875rem 1rem", fontFamily: "Inter", fontSize: "0.95rem",
                  outline: "none",
                }}
              />

              {status === "error" && (
                <p style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "#FF2D20" }}>
                  Ошибка отправки. Напишите нам напрямую: @gipoteza_agency
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  background: "#FF2D20", color: "#fff", border: "none",
                  padding: "1rem", cursor: status === "loading" ? "not-allowed" : "pointer",
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.1em",
                  opacity: status === "loading" ? 0.7 : 1,
                  transition: "background 0.2s",
                  marginTop: "0.5rem",
                }}
              >
                {status === "loading" ? "ОТПРАВЛЯЕМ..." : "ОТПРАВИТЬ ЗАЯВКУ →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CasePage ─────────────────────────────────────────────────────────────────

export default function CasePage() {
  const [, params] = useRoute("/cases/:id");
  const caseId = params?.id ?? "";
  const data = casesData[caseId];
  const [modalOpen, setModalOpen] = useState(false);

  if (!data) {
    return (
      <div style={{ background: "#0A0A0A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="font-display" style={{ fontSize: "4rem", fontWeight: 900, color: "#FF2D20" }}>404</div>
          <p style={{ fontFamily: "Inter", color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>Кейс не найден</p>
          <Link href="/#cases" style={{ color: "#fff", fontFamily: "Inter", fontSize: "0.9rem" }}>← Вернуться к кейсам</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F5F0" }}>
      {modalOpen && <LeadModal caseTitle={data.title} onClose={() => setModalOpen(false)} />}

      {/* Header nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "1rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="font-display" style={{ fontSize: "1.2rem", fontWeight: 900, color: "#F5F5F0", letterSpacing: "0.05em" }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
          </Link>
          <Link href="/#cases" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)",
            textDecoration: "none", transition: "color 0.2s",
          }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Все кейсы
          </Link>
        </div>
      </nav>

      {/* Hero with image */}
      <header style={{ position: "relative", overflow: "hidden" }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${data.heroImage})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.25,
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(10,10,10,0.95) 50%, rgba(10,10,10,0.4) 100%)",
        }} />

        <div className="container" style={{ position: "relative", padding: "6rem 0 4rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{
              display: "inline-block",
              fontFamily: "Inter", fontSize: "0.75rem", fontWeight: 500,
              color: "#FF2D20", letterSpacing: "0.15em", textTransform: "uppercase",
              border: "1px solid rgba(255,45,32,0.3)", padding: "4px 12px",
            }}>
              {data.tag}
            </span>
          </div>
          <h1 className="font-display" style={{
            fontSize: "clamp(2.5rem, 7vw, 6rem)", fontWeight: 900,
            lineHeight: 0.95, letterSpacing: "-0.02em",
            color: "#F5F5F0", marginBottom: "1.5rem", maxWidth: "800px",
          }}>
            {data.title}
          </h1>
          <p style={{
            fontFamily: "Inter", fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: "560px",
            marginBottom: "3rem",
          }}>
            {data.subtitle}
          </p>

          {/* Key results strip */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1px", background: "rgba(255,255,255,0.06)", maxWidth: "600px" }}>
            {data.results.map((r, i) => (
              <div key={i} style={{
                background: "rgba(10,10,10,0.9)", padding: "1.5rem 2.5rem",
                flex: "1 1 160px",
              }}>
                <div className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>
                  {r.value}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: "0.4rem" }}>
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content — two columns on desktop */}
      <main style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            maxWidth: "960px",
          }}
            className="case-grid"
          >
            {/* Challenge */}
            <div>
              <h2 className="font-display" style={{
                fontSize: "1.5rem", fontWeight: 900, color: "#F5F5F0",
                letterSpacing: "-0.01em", marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}>
                Задача
              </h2>
              <p style={{ fontFamily: "Inter", fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
                {data.challenge}
              </p>
            </div>

            {/* Solution */}
            <div>
              <h2 className="font-display" style={{
                fontSize: "1.5rem", fontWeight: 900, color: "#F5F5F0",
                letterSpacing: "-0.01em", marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}>
                Что сделали
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {data.solution.map((item, ii) => (
                  <li key={ii} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <span style={{ color: "#FF2D20", fontFamily: "Inter", fontSize: "0.75rem", fontWeight: 700, paddingTop: "0.3rem", flexShrink: 0 }}>
                      0{ii + 1}
                    </span>
                    <span style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results bar */}
          <div style={{ marginTop: "4rem", maxWidth: "960px" }}>
            <h2 className="font-display" style={{
              fontSize: "1.5rem", fontWeight: 900, color: "#F5F5F0",
              letterSpacing: "-0.01em", marginBottom: "1.5rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
              Результаты
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
              {data.results.map((r, ri) => (
                <div key={ri} style={{
                  background: "#111", padding: "2rem 2.5rem",
                  flex: "1 1 200px",
                  borderLeft: ri === 0 ? "3px solid #FF2D20" : "none",
                }}>
                  <div className="font-display" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>
                    {r.value}
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginTop: "0.5rem" }}>
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* CTA */}
      <section style={{ background: "#111", padding: "6rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{ maxWidth: "600px" }}>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, color: "#F5F5F0", lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
              ХОТИТЕ<br />ТАК ЖЕ?
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              Разберём вашу воронку бесплатно и покажем, где теряются деньги.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                background: "#FF2D20", color: "#fff", border: "none",
                padding: "1rem 2.5rem", cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.1em",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = "#cc2218")}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = "#FF2D20")}
            >
              ПОЛУЧИТЬ БЕСПЛАТНЫЙ РАЗБОР →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "2rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
            ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
          </span>
          <Link href="/#cases" style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
            ← Все кейсы
          </Link>
        </div>
      </footer>

      {/* Responsive grid fix */}
      <style>{`
        @media (max-width: 768px) {
          .case-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
