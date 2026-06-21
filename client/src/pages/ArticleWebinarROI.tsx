// Design: Dark editorial article page, Unbounded display font, red accents #FF2D20
// Same visual language as ArticleWebinar — inline SVG illustrations, no external images

import { Link } from "wouter";
import { useEffect } from "react";

export default function ArticleWebinarROI() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Окупаемость вебинаров для онлайн-школы — Гипотеза";
  }, []);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F5F0" }}>
      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1.25rem 0",
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/">
            <span className="font-display" style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.06em", color: "#F5F5F0", cursor: "pointer" }}>
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
          </Link>
          <Link href="/blog">
            <span style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              ← Все статьи
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero SVG */}
      <div style={{ paddingTop: "4.5rem" }}>
        <div style={{ position: "relative", width: "100%", height: "70vh", overflow: "hidden", background: "#0A0A0A" }}>
          <svg
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <rect width="1200" height="700" fill="#0A0A0A" />
            {/* Subtle grid */}
            <line x1="0" y1="350" x2="1200" y2="350" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="600" y1="0" x2="600" y2="700" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            {/* Funnel silhouette */}
            <polygon points="160,110 1040,110 760,340 440,340" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <polygon points="440,348 760,348 680,460 520,460" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <polygon points="520,468 680,468 648,540 552,540" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
            {/* Big ROI */}
            <text
              x="600"
              y="410"
              fontFamily="'Unbounded','Arial Black',sans-serif"
              fontSize="300"
              fontWeight="900"
              fill="#FF2D20"
              textAnchor="middle"
              letterSpacing="-12"
              opacity="0.88"
            >
              ROI
            </text>
            {/* Leak drop */}
            <circle cx="880" cy="250" r="9" fill="#FF2D20" />
            <line x1="880" y1="259" x2="880" y2="338" stroke="#FF2D20" strokeWidth="2" strokeDasharray="5,4" opacity="0.7" />
            <circle cx="880" cy="345" r="4" fill="#FF2D20" opacity="0.4" />
            <text x="900" y="255" fontFamily="Inter,sans-serif" fontSize="13" fill="rgba(255,45,32,0.65)" letterSpacing="0.08em">утечка бюджета</text>
            {/* Bottom label */}
            <text x="600" y="660" fontFamily="Inter,sans-serif" fontSize="13" fill="rgba(255,255,255,0.15)" textAnchor="middle" letterSpacing="0.2em">
              ОКУПАЕМОСТЬ ВЕБИНАРОВ — ГИПОТЕЗА
            </text>
          </svg>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, #0A0A0A 100%)" }} />
        </div>
      </div>

      {/* Article */}
      <article style={{ maxWidth: "720px", margin: "0 auto", padding: "0 1.5rem 8rem" }}>
        {/* Meta */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 600, color: "#FF2D20", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Экономика
          </span>
          <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>Июнь 2026</span>
          <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>9 мин чтения</span>
        </div>

        {/* H1 */}
        <h1 className="font-display" style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: "2rem", color: "#F5F5F0" }}>
          Окупается ли ваш вебинар.<br />
          <span style={{ color: "#FF2D20" }}>Считаем по цифрам</span>
        </h1>

        {/* Lead */}
        <p style={{ ...bodyText, fontSize: "1.15rem", color: "rgba(255,255,255,0.65)", borderLeft: "3px solid #FF2D20", paddingLeft: "1.5rem", marginBottom: "3rem" }}>
          Вебинар умеет приносить деньги и сжигать их одновременно. Оплаты на эфире есть, а к концу месяца счёт пустой. Так бывает, когда школа смотрит на выручку с вебинара, но не считает, во что обошлась каждая регистрация.
          {" "}Разберём окупаемость на цифрах. Без «вебинары — мощный инструмент роста». Формула, пять метрик и точки, где утекают деньги.
        </p>

        {/* Section 1 */}
        <h2 className="font-display" style={h2Style}>Что такое окупаемость вебинара</h2>
        <p style={bodyText}>
          Окупаемость показывает, сколько вы получили на каждый вложенный рубль.
        </p>

        {/* Formula */}
        <div style={{ margin: "1.5rem 0 2rem", padding: "1.5rem 2rem", background: "#111", border: "1px solid rgba(255,45,32,0.25)", borderLeft: "4px solid #FF2D20" }}>
          <p className="font-display" style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", fontWeight: 900, color: "#FF2D20", letterSpacing: "-0.01em", margin: 0, lineHeight: 1.4 }}>
            ROI = (выручка − расходы) / расходы × 100%
          </p>
        </div>

        <p style={bodyText}>
          Выручку школы считают легко. Расходы — почти всегда недосчитывают. В расход идёт не только реклама: бюджет на регистрации; работа продюсера и техспеца; платформа для эфира и рассылок; прогрев и дожим (контент, письма, звонки отдела продаж); комиссия эквайринга и возвраты.
        </p>
        <p style={bodyText}>
          Посчитаете только рекламу — окупаемость нарисуется красивой. На счёте её не будет.
        </p>

        {/* Section 2 */}
        <h2 className="font-display" style={h2Style}>Пять метрик, которые решают окупаемость</h2>
        <p style={bodyText}>Выручка — это цепочка. Рвётся в любом звене.</p>

        {/* SVG: Metrics chain */}
        <figure style={{ margin: "2rem 0 2.5rem" }}>
          <div style={{ overflowX: "auto", borderRadius: "2px" }}>
            <svg
              viewBox="0 0 860 160"
              style={{ display: "block", width: "100%", minWidth: "600px", height: "auto" }}
            >
              <rect width="860" height="160" fill="#111" />
              {/* Block 1: CPL */}
              <rect x="15" y="38" width="140" height="84" rx="2" fill="#0A0A0A" stroke="rgba(255,45,32,0.45)" strokeWidth="1.5" />
              <text x="85" y="72" fontFamily="'Unbounded','Arial Black',sans-serif" fontSize="12" fontWeight="900" fill="#FF2D20" textAnchor="middle">CPL</text>
              <text x="85" y="90" fontFamily="Inter,sans-serif" fontSize="9.5" fill="rgba(255,255,255,0.35)" textAnchor="middle">Цена регистрации</text>
              {/* Arrow */}
              <line x1="155" y1="80" x2="188" y2="80" stroke="#FF2D20" strokeWidth="1.5" />
              <polygon points="188,74 200,80 188,86" fill="#FF2D20" />
              {/* Block 2 */}
              <rect x="200" y="38" width="140" height="84" rx="2" fill="#0A0A0A" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              <text x="270" y="70" fontFamily="'Unbounded','Arial Black',sans-serif" fontSize="9" fontWeight="900" fill="#F5F5F0" textAnchor="middle">ДОХОДИ-</text>
              <text x="270" y="83" fontFamily="'Unbounded','Arial Black',sans-serif" fontSize="9" fontWeight="900" fill="#F5F5F0" textAnchor="middle">МОСТЬ</text>
              <text x="270" y="102" fontFamily="Inter,sans-serif" fontSize="9.5" fill="rgba(255,255,255,0.3)" textAnchor="middle">от 40%</text>
              {/* Arrow */}
              <line x1="340" y1="80" x2="373" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <polygon points="373,74 385,80 373,86" fill="rgba(255,255,255,0.2)" />
              {/* Block 3 */}
              <rect x="385" y="38" width="140" height="84" rx="2" fill="#0A0A0A" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              <text x="455" y="70" fontFamily="'Unbounded','Arial Black',sans-serif" fontSize="9" fontWeight="900" fill="#F5F5F0" textAnchor="middle">КОН-</text>
              <text x="455" y="83" fontFamily="'Unbounded','Arial Black',sans-serif" fontSize="9" fontWeight="900" fill="#F5F5F0" textAnchor="middle">ВЕРСИЯ</text>
              <text x="455" y="102" fontFamily="Inter,sans-serif" fontSize="9.5" fill="rgba(255,255,255,0.3)" textAnchor="middle">3–5% зрителей</text>
              {/* Arrow */}
              <line x1="525" y1="80" x2="558" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <polygon points="558,74 570,80 558,86" fill="rgba(255,255,255,0.2)" />
              {/* Block 4 */}
              <rect x="570" y="38" width="130" height="84" rx="2" fill="#0A0A0A" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              <text x="635" y="76" fontFamily="'Unbounded','Arial Black',sans-serif" fontSize="12" fontWeight="900" fill="#F5F5F0" textAnchor="middle">ЧЕК</text>
              <text x="635" y="96" fontFamily="Inter,sans-serif" fontSize="9.5" fill="rgba(255,255,255,0.3)" textAnchor="middle">средний чек</text>
              {/* Arrow */}
              <line x1="700" y1="80" x2="733" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <polygon points="733,74 745,80 733,86" fill="rgba(255,255,255,0.2)" />
              {/* Block 5 */}
              <rect x="745" y="38" width="100" height="84" rx="2" fill="#0A0A0A" stroke="rgba(255,45,32,0.25)" strokeWidth="1.5" />
              <text x="795" y="70" fontFamily="'Unbounded','Arial Black',sans-serif" fontSize="8" fontWeight="900" fill="#F5F5F0" textAnchor="middle">ВОЗ-</text>
              <text x="795" y="83" fontFamily="'Unbounded','Arial Black',sans-serif" fontSize="8" fontWeight="900" fill="#F5F5F0" textAnchor="middle">ВРАТЫ</text>
              <text x="795" y="102" fontFamily="Inter,sans-serif" fontSize="9.5" fill="rgba(255,45,32,0.6)" textAnchor="middle">−выручка</text>
            </svg>
          </div>
          <figcaption style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", marginTop: "0.75rem", textAlign: "center" }}>
            Цепочка метрик: рвётся в любом звене
          </figcaption>
        </figure>

        {/* Numbered metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0", margin: "1rem 0 2.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            {
              n: "1",
              label: "Цена регистрации (CPL)",
              desc: "Сколько стоит один зарегистрировавшийся. По рынку разброс большой: в кейсе онлайн-школы дизайна — 455 ₽ за регистрацию из Яндекс.Директа. Чем холоднее трафик, тем дороже.",
            },
            {
              n: "2",
              label: "Доходимость",
              desc: "Сколько из зарегистрированных пришли на эфир. Рыночный ориентир — от 40%. С прогревом и чат-ботом доходит до 40–70%. Минус 10 пунктов доходимости умножают цену каждого зрителя.",
            },
            {
              n: "3",
              label: "Конверсия в оплату",
              desc: "Сколько зрителей купили. Средний коридор — 3–5% от пришедших. У новичка 1–2%.",
            },
            {
              n: "4",
              label: "Средний чек",
              desc: "Один и тот же вебинар с чеком 15 000 и 45 000 ₽ — разная экономика. Высокий чек прощает дорогой трафик.",
            },
            {
              n: "5",
              label: "Возвраты",
              desc: "Деньги, которые пришли и ушли. На дорогих продуктах съедают окупаемость тихо.",
            },
          ].map((item, i) => (
            <div
              key={item.n}
              style={{
                display: "flex",
                gap: "1.5rem",
                padding: "1.25rem 1.5rem",
                borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none",
                background: i % 2 === 0 ? "#0A0A0A" : "#0f0f0f",
              }}
            >
              <span className="font-display" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FF2D20", flexShrink: 0, paddingTop: "0.15rem", minWidth: "1rem" }}>
                {item.n}
              </span>
              <div>
                <div className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.3rem" }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={bodyText}>
          Перемножьте цепочку — получите выручку. Сравните с полным расходом — получите правду про ROI.
        </p>

        {/* Section 3 */}
        <h2 className="font-display" style={h2Style}>Где чаще всего сливается окупаемость</h2>
        <p style={bodyText}>
          За 100+ запусков вижу четыре повторяющиеся дыры. Деньги теряются не на эфире, а вокруг него.
        </p>

        {/* SVG: Funnel with 4 leak points */}
        <figure style={{ margin: "2rem 0 2.5rem" }}>
          <svg viewBox="0 0 860 300" style={{ display: "block", width: "100%", height: "auto" }}>
            <rect width="860" height="300" fill="#111" />
            {/* Funnel layers */}
            <polygon points="60,30 800,30 630,110 230,110" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
            <polygon points="230,118 630,118 570,185 290,185" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <polygon points="290,193 570,193 535,245 325,245" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <polygon points="325,253 535,253 512,280 348,280" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
            {/* Leak 1: Трафик */}
            <circle cx="740" cy="52" r="7" fill="#FF2D20" />
            <line x1="740" y1="59" x2="740" y2="108" stroke="#FF2D20" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
            <text x="755" y="50" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill="#FF2D20">Трафик</text>
            <text x="755" y="66" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(255,255,255,0.3)">без сегмента</text>
            {/* Leak 2: Прогрев */}
            <circle cx="620" cy="138" r="7" fill="#FF2D20" />
            <line x1="620" y1="145" x2="620" y2="183" stroke="#FF2D20" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
            <text x="635" y="138" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill="#FF2D20">Прогрев</text>
            <text x="635" y="154" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(255,255,255,0.3)">рег. → эфир</text>
            {/* Leak 3: Структура эфира */}
            <circle cx="555" cy="208" r="7" fill="#FF2D20" />
            <line x1="555" y1="215" x2="555" y2="243" stroke="#FF2D20" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
            <text x="568" y="208" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill="#FF2D20">Структура эфира</text>
            <text x="568" y="224" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(255,255,255,0.3)">оффер скомкан</text>
            {/* Leak 4: Дожим */}
            <circle cx="440" cy="265" r="7" fill="#FF2D20" />
            <line x1="440" y1="272" x2="440" y2="290" stroke="#FF2D20" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
            <text x="455" y="265" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill="#FF2D20">Дожим</text>
            <text x="455" y="281" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(255,255,255,0.3)">нет серии писем</text>
            {/* Left labels */}
            <text x="48" y="28" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(255,255,255,0.25)">1000 рег.</text>
            <text x="218" y="116" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(255,255,255,0.25)">400 зрит.</text>
            <text x="278" y="183" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(255,255,255,0.25)">12–20 покуп.</text>
            <text x="312" y="253" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(255,255,255,0.2)">+50% дожим</text>
          </svg>
          <figcaption style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", marginTop: "0.75rem", textAlign: "center" }}>
            Четыре точки утечки: где деньги уходят до того, как попадают на счёт
          </figcaption>
        </figure>

        {/* 4 leak descriptions */}
        {[
          {
            title: "Трафик без сегмента",
            text: "Льют на широкую аудиторию: регистрации дешёвые, но не целевые. Доходимость и конверсия проваливаются. Дешёвая регистрация дороже дорогой, если она не покупает.",
            accent: true,
          },
          {
            title: "Слабый прогрев между регистрацией и эфиром",
            text: "Человек зарегистрировался и забыл. Без цепочки касаний доходимость падает к нижней границе. Здесь теряется первая половина бюджета.",
            accent: false,
          },
          {
            title: "Эфир без структуры продажи",
            text: "Контент сильный, оффер скомкан в конце. Зрители благодарят и уходят думать. Продажа держится на драматургии, заложенной с первой минуты.",
            accent: false,
          },
          {
            title: "Нет дожима",
            text: "На эфире покупают 3–5%. Ещё столько же — в следующие 3–7 дней, если есть серия дожима. Без неё школа отдаёт половину выручки.",
            accent: false,
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              margin: "1.5rem 0",
              padding: "1.75rem 2rem",
              background: "#111",
              borderLeft: `4px solid ${item.accent ? "#FF2D20" : "rgba(255,255,255,0.12)"}`,
            }}
          >
            <div className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: item.accent ? "#FF2D20" : "#F5F5F0", marginBottom: "0.6rem" }}>
              {item.title}
            </div>
            <p style={{ ...bodyText, marginBottom: 0 }}>{item.text}</p>
          </div>
        ))}

        {/* Section 4: Benchmarks */}
        <h2 className="font-display" style={h2Style}>Какие цифры считать нормой</h2>
        <p style={bodyText}>
          Ориентиры по рынку, чтобы свериться со своими:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", margin: "1.5rem 0 2rem" }}>
          {[
            { metric: "Доходимость до эфира", val: "от 40%, хороший показатель 50%+" },
            { metric: "Конверсия зрителя в оплату", val: "3–5%, для холодной аудитории 1–2%" },
            { metric: "Сквозная конверсия «трафик → заявка»", val: "около 1,5% в онлайн-образовании" },
          ].map((row) => (
            <div key={row.metric} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ color: "#FF2D20", flexShrink: 0, marginTop: "0.1rem" }}>→</span>
              <div>
                <span style={{ fontFamily: "Inter", fontSize: "0.875rem", fontWeight: 600, color: "#F5F5F0" }}>{row.metric}: </span>
                <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{row.val}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...bodyText, fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>
          Это средние по рынку. Ваши реальные цифры по нишам важнее любого бенчмарка — считайте свои.
        </p>

        {/* Section 5: When it won't work */}
        <h2 className="font-display" style={h2Style}>Когда вебинары не окупятся — честно</h2>
        <p style={bodyText}>Вебинар подходит не всем. Не окупится, если:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", margin: "1rem 0 1.5rem", paddingLeft: "0.25rem" }}>
          {[
            "продукт дешевле 5 000 ₽ и нет апселла",
            "некому делать дожим",
            "эфиры раз в квартал (окупаемость набирается на регулярности)",
          ].map((item) => (
            <div key={item} style={{ display: "flex", gap: "0.75rem" }}>
              <span style={{ color: "#FF2D20", flexShrink: 0 }}>—</span>
              <span style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={bodyText}>
          Если все три пункта про вас, деньги лучше пустить в другой канал. Честнее сказать это сразу, чем продать вебинар, который не вернёт вложения.
        </p>

        {/* Pull quote */}
        <blockquote style={{ margin: "3rem 0", padding: "2rem 2.5rem", background: "#111", borderLeft: "4px solid #FF2D20" }}>
          <p className="font-display" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.55rem)", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.2, letterSpacing: "-0.01em", margin: 0 }}>
            «Дешёвая регистрация дороже дорогой, если она не покупает.»
          </p>
        </blockquote>

        {/* Section 6: Checklist */}
        <h2 className="font-display" style={h2Style}>Посчитайте свой вебинар за 10 минут</h2>
        <p style={bodyText}>Возьмите последний запуск:</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0", margin: "1.5rem 0 2rem", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { n: "1", label: "Полный расход", desc: "трафик + люди + платформы + дожим + комиссии" },
            { n: "2", label: "Цена регистрации", desc: "= расход на трафик / число регистраций" },
            { n: "3", label: "Доходимость", desc: "= пришли / зарегистрировались" },
            { n: "4", label: "Конверсия", desc: "= купили / пришли" },
            { n: "5", label: "Выручка", desc: "= купили × средний чек − возвраты" },
            { n: "6", label: "ROI", desc: "= (выручка − полный расход) / полный расход × 100%" },
          ].map((item, i) => (
            <div
              key={item.n}
              style={{
                display: "flex",
                gap: "1.5rem",
                padding: "1.1rem 1.5rem",
                borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none",
                background: i % 2 === 0 ? "#0A0A0A" : "#0f0f0f",
                alignItems: "center",
              }}
            >
              <span className="font-display" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FF2D20", flexShrink: 0, minWidth: "1rem" }}>
                {item.n}
              </span>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "baseline" }}>
                <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 900, color: "#F5F5F0" }}>{item.label}</span>
                <span style={{ fontFamily: "Inter", fontSize: "0.85rem", color: "rgba(255,255,255,0.35)" }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ ...bodyText, borderLeft: "3px solid rgba(255,45,32,0.35)", paddingLeft: "1.25rem" }}>
          Отрицательный ROI — ищите дыру по разделу выше. Чаще всего она в прогреве и дожиме, а не в трафике.
        </p>

        {/* CTA */}
        <div style={{ marginTop: "4rem", padding: "3rem", background: "#111", borderTop: "3px solid #FF2D20", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <p className="font-display" style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.1, margin: 0 }}>
            Считаете, а вебинар не сходится по деньгам?
          </p>
          <p style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65, margin: 0 }}>
            Разберём вашу воронку бесплатно и покажем, где теряется окупаемость — от прогрева до дожима.
          </p>
          <Link href="/#contact">
            <button
              style={{ background: "#FF2D20", color: "#fff", border: "none", padding: "1rem 2rem", fontFamily: "Unbounded, sans-serif", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer", alignSelf: "flex-start", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Получить разбор бесплатно →
            </button>
          </Link>
        </div>

        {/* Tags */}
        <div style={{ marginTop: "3rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["Вебинары", "Окупаемость", "ROI", "Онлайн-школы", "Воронка", "Метрики"].map((tag) => (
            <span key={tag} style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.3rem 0.75rem", letterSpacing: "0.05em" }}>
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* Floating TG */}
      <a
        href="https://t.me/+qTCI2A9QEOY3YzUy"
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000, display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
      >
        <span style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>
          Подпишись на наш Telegram-канал
        </span>
        <div
          style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "#FF2D20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L12 2M12 2H4M12 2V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </a>
    </div>
  );
}

const bodyText: React.CSSProperties = {
  fontFamily: "Inter",
  fontSize: "1rem",
  color: "rgba(255,255,255,0.55)",
  lineHeight: 1.8,
  marginBottom: "1.25rem",
  fontWeight: 300,
};

const h2Style: React.CSSProperties = {
  fontSize: "clamp(1.4rem, 3vw, 2rem)",
  fontWeight: 900,
  letterSpacing: "-0.02em",
  color: "#F5F5F0",
  marginBottom: "1rem",
  marginTop: "3.5rem",
};
