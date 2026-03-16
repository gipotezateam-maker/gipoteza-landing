// Design: Dark editorial — same style as Home.tsx
// Bebas Neue display, Inter body, #FF2D20 accent, #0A0A0A bg

import { Link, useRoute } from "wouter";

// ─── Case Data ────────────────────────────────────────────────────────────────

const casesData: Record<string, CaseData> = {
  "primekraft": {
    id: "primekraft",
    client: "Primekraft",
    tag: "D2C / FMCG",
    title: "AI-бот вместо CRM-специалиста",
    subtitle: "Как GPT-логика собрала микросегменты и подняла средний чек на 12%",
    results: [
      { value: "+12%", label: "Средний чек" },
    ],
    sections: [
      {
        heading: "Клиент",
        text: "Primekraft — бренд спортивного питания. Продажи через маркетплейсы и собственный сайт. Задача: увеличить средний чек и выстроить персонализированную коммуникацию без раздутого штата.",
      },
      {
        heading: "Задача",
        text: "Запустить AI-бота на GPT-логике, который сам проводит мини-кастдев и собирает десятки микросегментов вместо CRM-специалиста. На основе сегментации — формировать персональные офферы и рекомендации, вести пользователя до корзины и допродаж.",
      },
      {
        heading: "Что сделали",
        items: [
          "Разработали архитектуру AI-бота: диалоговые сценарии, ветки под разные цели (набор массы, похудение, восстановление, энергия).",
          "Бот проводит мини-кастдев: 3–5 вопросов → формирует профиль пользователя → присваивает микросегмент.",
          "На основе сегмента — персональный оффер с конкретными продуктами и скидкой под запрос.",
          "Встроили допродажи: бот предлагает сопутствующие продукты после добавления в корзину.",
          "Настроили аналитику: какие сегменты конвертируют лучше, какие офферы работают.",
        ],
      },
      {
        heading: "Результаты",
        results: [
          { value: "+12%", label: "Средний чек вырос на 12%" },
        ],
      },
    ],
  },

  "school1-webinar": {
    id: "school1-webinar",
    client: "Онлайн-школа №1",
    tag: "EdTech / Живой вебинар",
    title: "Живой вебинар с нуля — стабильный поток заявок",
    subtitle: "Как мы создали формат живого мероприятия и снизили CAC на 44%",
    results: [
      { value: "−44%", label: "CAC (стоимость привлечения клиента)" },
    ],
    sections: [
      {
        heading: "Клиент",
        text: "Онлайн-школа №1 — школа для учеников 1–11 классов. Дистанционное обучение, аттестации, подготовка к ЕГЭ и ОГЭ.",
      },
      {
        heading: "Задача",
        text: "Создать формат живого мероприятия с нуля, чтобы греть холодную аудиторию и получать стабильные заявки. До этого школа работала только с контентными воронками — живого формата не было.",
      },
      {
        heading: "Что сделали",
        items: [
          "Разработали структуру эфира: боли родителей и учеников, интерактивы, реальные кейсы учеников школы.",
          "Написали сценарий под разные сегменты аудитории: родители младшеклассников, старшеклассники перед ЕГЭ, семьи на семейном обучении.",
          "Настроили сегментацию и сценарии в боте под разные запросы — каждый получал релевантный оффер.",
          "Протестировали несколько связок «тема эфира → аудитория → оффер».",
          "Финализировали формат, который приносит стабильный поток заявок каждую неделю.",
        ],
      },
      {
        heading: "Результаты",
        results: [
          { value: "−44%", label: "Снизили CAC на 44%" },
        ],
      },
    ],
  },

  "school1-traffic": {
    id: "school1-traffic",
    client: "Онлайн-школа №1",
    tag: "EdTech / Трафик ВК",
    title: "Перезапуск трафика ВКонтакте",
    subtitle: "20+ протестированных креативов, TOP-5 связок и стоимость лида −45%",
    results: [
      { value: "−45%", label: "Стоимость квал-лида" },
      { value: "−44%", label: "Стоимость оплаты от плана" },
    ],
    sections: [
      {
        heading: "Клиент",
        text: "Онлайн-школа №1 — школа для учеников 1–11 классов. Дистанционное обучение, аттестации, подготовка к ЕГЭ и ОГЭ.",
      },
      {
        heading: "Задача",
        text: "Перезапустить трафик ВКонтакте, найти рабочие связки «креатив → аудитория → заявка» и снизить стоимость целевого лида и продажи. Предыдущие кампании давали дорогие лиды с низкой конверсией в оплату.",
      },
      {
        heading: "Что сделали",
        items: [
          "Провели анализ целевых лидов: разобрали, какие заявки реально конвертируются в оплату, нашли паттерны.",
          "Выделили рабочие связки «аудитория + оффер + посадочная страница», которые дают продажи.",
          "Протестировали 20+ креативов: разные форматы (видео, карусель, статика), разные боли и триггеры.",
          "Выделили TOP-5 креативов с самой высокой конверсией в квалифицированный лид.",
          "Выстроили систему масштабирования: дубли кампаний + плавное увеличение бюджета без просадки CPL.",
        ],
      },
      {
        heading: "Результаты",
        results: [
          { value: "−45%", label: "Стоимость квал-лида снижена на 45%" },
          { value: "−44%", label: "Стоимость оплаты — −44% от плана" },
        ],
      },
    ],
  },

  "eteri": {
    id: "eteri",
    client: "Этери Бериашвили",
    tag: "Онлайн-курс / Вокал",
    title: "Оптимизация автоворонки под холодный трафик",
    subtitle: "Пересобрали механику, переписали коммуникацию — конверсия в Tripwire выросла на 22%",
    results: [
      { value: "−20%", label: "Стоимость регистрации" },
      { value: "+5%", label: "Конверсия в заявку" },
      { value: "+22%", label: "Конверсия в Tripwire" },
    ],
    sections: [
      {
        heading: "Клиент",
        text: "Этери Бериашвили — известная певица и педагог по вокалу. Онлайн-курс по вокалу для взрослых: от новичков до продвинутых.",
      },
      {
        heading: "Задача",
        text: "Пересобрать автоворонку под холодный трафик и повысить конверсии на ключевых этапах. Существующая воронка работала на тёплую аудиторию — при запуске холодного трафика показатели падали.",
      },
      {
        heading: "Что сделали",
        items: [
          "Полностью пересобрали механику и логику автоворонки: бот, письма, страницы, триггеры — всё с нуля под холодную аудиторию.",
          "Провели кастдев: выявили актуальные мотивы аудитории (не «петь красиво», а «уверенность», «выступать без страха», «петь для себя»).",
          "Переписали коммуникацию под эти мотивы, усилили эмоциональные триггеры и персонализацию.",
          "Обновили визуал: чистые экраны, единая стилистика, видео с живой подачей Этери.",
          "Настроили A/B-тесты на ключевых этапах воронки — регистрация, прогрев, Tripwire.",
        ],
      },
      {
        heading: "Результаты",
        results: [
          { value: "−20%", label: "Стоимость регистрации снизилась на 20%" },
          { value: "+5%", label: "Конверсия в заявку выросла на 5%" },
          { value: "+22%", label: "Конверсия в Tripwire выросла на 22%" },
        ],
      },
    ],
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ResultItem = { value: string; label: string };
type Section = {
  heading: string;
  text?: string;
  items?: string[];
  results?: ResultItem[];
};
type CaseData = {
  id: string;
  client: string;
  tag: string;
  title: string;
  subtitle: string;
  results: ResultItem[];
  sections: Section[];
};

// ─── CasePage ─────────────────────────────────────────────────────────────────

export default function CasePage() {
  const [, params] = useRoute("/cases/:id");
  const caseId = params?.id ?? "";
  const data = casesData[caseId];

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

      {/* Hero */}
      <header style={{ padding: "6rem 0 4rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
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
            color: "#F5F5F0", marginBottom: "1.5rem", maxWidth: "900px",
          }}>
            {data.title}
          </h1>
          <p style={{
            fontFamily: "Inter", fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "600px",
            marginBottom: "3rem",
          }}>
            {data.subtitle}
          </p>

          {/* Key results strip */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {data.results.map((r, i) => (
              <div key={i} style={{
                background: "#0A0A0A", padding: "1.5rem 2.5rem",
                flex: "1 1 160px",
              }}>
                <div className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>
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

      {/* Content */}
      <main style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ maxWidth: "720px" }}>
            {data.sections.map((section, si) => (
              <div key={si} style={{ marginBottom: "4rem" }}>
                <h2 className="font-display" style={{
                  fontSize: "1.8rem", fontWeight: 900, color: "#F5F5F0",
                  letterSpacing: "-0.01em", marginBottom: "1.25rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}>
                  {section.heading}
                </h2>

                {section.text && (
                  <p style={{ fontFamily: "Inter", fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
                    {section.text}
                  </p>
                )}

                {section.items && (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {section.items.map((item, ii) => (
                      <li key={ii} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <span style={{ color: "#FF2D20", fontFamily: "Inter", fontSize: "0.75rem", fontWeight: 700, paddingTop: "0.3rem", flexShrink: 0 }}>
                          0{ii + 1}
                        </span>
                        <span style={{ fontFamily: "Inter", fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.results && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {section.results.map((r, ri) => (
                      <div key={ri} style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", padding: "1.25rem 1.5rem", background: "#111", borderLeft: "3px solid #FF2D20" }}>
                        <span className="font-display" style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1, flexShrink: 0 }}>
                          {r.value}
                        </span>
                        <span style={{ fontFamily: "Inter", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)" }}>
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
            <Link href="/#contact">
              <button style={{
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
            </Link>
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
    </div>
  );
}
