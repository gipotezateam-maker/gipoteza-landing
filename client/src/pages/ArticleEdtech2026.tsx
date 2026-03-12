// Design: Dark editorial article page, Unbounded display font, red accents #FF2D20
// Long-form reading experience with pull quotes, images, and section dividers

import { Link } from "wouter";
import { useEffect } from "react";

const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/article-hero-YqwjNYyRnGFgMQtKMm7E9b.webp";
const CHART_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/article-chart-hoMinFRwizni9BmLnsNwEh.webp";
const SURVIVOR_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/article-survivor-MfgQHTnkrNcmHusJizCwUy.webp";

export default function ArticleEdtech2026() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "EdTech 2026: Кончилось детство. Кто выживет? — Гипотеза";
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
        <div
          className="container"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Link href="/">
            <span
              className="font-display"
              style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.06em", color: "#F5F5F0", cursor: "pointer" }}
            >
              ГИПОТ<span style={{ color: "#FF2D20" }}>Е</span>ЗА
            </span>
          </Link>
          <Link href="/blog">
            <span
              style={{
                fontFamily: "Inter",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              ← Все статьи
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero image */}
      <div style={{ paddingTop: "4.5rem", position: "relative" }}>
        <div style={{ position: "relative", width: "100%", maxHeight: "70vh", overflow: "hidden" }}>
          <img
            src={HERO_IMG}
            alt="EdTech 2026 — цифровое здание рассыпается"
            style={{ width: "100%", height: "70vh", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 40%, #0A0A0A 100%)",
            }}
          />
        </div>
      </div>

      {/* Article content */}
      <article style={{ maxWidth: "720px", margin: "0 auto", padding: "0 1.5rem 8rem" }}>
        {/* Meta */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "Inter",
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "#FF2D20",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Аналитика
          </span>
          <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
            Март 2026
          </span>
          <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
            7 мин чтения
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            marginBottom: "2rem",
            color: "#F5F5F0",
          }}
        >
          EdTech 2026:<br />
          Кончилось детство.<br />
          <span style={{ color: "#FF2D20" }}>Кто выживет?</span>
        </h1>

        {/* Lead */}
        <p
          style={{
            fontFamily: "Inter",
            fontSize: "1.15rem",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.75,
            marginBottom: "3rem",
            fontWeight: 300,
            borderLeft: "3px solid #FF2D20",
            paddingLeft: "1.5rem",
          }}
        >
          EdTech больше не растёт на вере. Закончились дешёвые деньги, хайп пандемии и курсы «на коленке».
          Наступила взрослая жизнь — и не все к ней готовы.
        </p>

        {/* Section 1 */}
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#F5F5F0",
            marginBottom: "1rem",
            marginTop: "3rem",
          }}
        >
          Рост на инерции закончился
        </h2>
        <p style={bodyText}>
          2020–2023 был пузырём. Пандемия загнала людей домой, деньги стоили дёшево, а онлайн-образование
          казалось волшебной таблеткой. Автоворонки продавали всё подряд — от курсов по рисованию до
          «профессий будущего» с туманными перспективами.
        </p>
        <p style={bodyText}>
          Сейчас картина другая: стоимость привлечения клиента выросла в 2–4 раза, цикл принятия решения
          растянулся, а аудитория стала умнее. Она уже купила три курса, которые не прошла до конца.
          Продать четвёртый — задача принципиально другого уровня.
        </p>
        <p style={bodyText}>
          Воронки, которые работали в 2021-м, сегодня не работают. Не потому что плохо сделаны —
          просто рынок повзрослел вместе с аудиторией.
        </p>

        {/* Pull quote */}
        <blockquote
          style={{
            margin: "3rem 0",
            padding: "2rem 2.5rem",
            background: "#111",
            borderLeft: "4px solid #FF2D20",
          }}
        >
          <p
            className="font-display"
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
              fontWeight: 900,
              color: "#F5F5F0",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            «Воронки, которые работали в 2021-м, сегодня не работают. Рынок повзрослел вместе с аудиторией.»
          </p>
        </blockquote>

        {/* Image 2 */}
        <figure style={{ margin: "3rem 0" }}>
          <img
            src={CHART_IMG}
            alt="Воронка продаж с утечками — иллюстрация"
            style={{ width: "100%", display: "block", borderRadius: "2px" }}
          />
          <figcaption
            style={{
              fontFamily: "Inter",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.25)",
              marginTop: "0.75rem",
              textAlign: "center",
            }}
          >
            Типичная воронка EdTech-проекта 2024–2025: деньги уходят на каждом этапе
          </figcaption>
        </figure>

        {/* Section 2 */}
        <h2 className="font-display" style={h2Style}>
          LTV мёртв. Или в коме.
        </h2>
        <p style={bodyText}>
          У 70% проектов — один курс и никакой продуктовой стратегии. Нет апселов, нет ретенции,
          нет повторных продаж. Только надежда на то, что следующий поток окупит предыдущий.
        </p>
        <p style={bodyText}>
          Это не бизнес — это лотерея. Когда единственный источник дохода — новые клиенты, вы
          навсегда зависите от трафика. Стоимость трафика растёт. Маржа падает. Круг замыкается.
        </p>
        <p style={bodyText}>
          Проекты с продуктовой линейкой — апсел, даунсел, сопровождение, клуб, консультации —
          зарабатывают в 3–5 раз больше с того же трафика. Это не теория: это цифры из реальных
          запусков, которые мы видим изнутри.
        </p>

        {/* Stats block */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.08)",
            margin: "3rem 0",
          }}
        >
          {[
            { n: "70%", label: "проектов без апселов и повторных продаж" },
            { n: "×3–5", label: "разница в выручке при наличии продуктовой линейки" },
            { n: "2–4×", label: "рост стоимости привлечения за 2 года" },
          ].map((s) => (
            <div key={s.n} style={{ background: "#0A0A0A", padding: "2rem 1.5rem" }}>
              <div
                className="font-display"
                style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.5,
                  marginTop: "0.5rem",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Section 3 */}
        <h2 className="font-display" style={h2Style}>
          Владельцы мечтают, команды поддакивают
        </h2>
        <p style={bodyText}>
          Хотят ×10 — не считая юнита. Цифры рисуют под хотелки. Проекты сгорают изнутри.
        </p>
        <p style={bodyText}>
          Это системная проблема: когда основатель не хочет слышать «нет», команда перестаёт
          говорить правду. Маркетолог рисует оптимистичный прогноз. Продюсер соглашается с
          нереальными сроками. Аналитик подгоняет цифры под желаемый ROMI.
        </p>
        <p style={bodyText}>
          Результат — запуск на эмоциях, слитый бюджет и разочарование. Потом ищут виноватых
          среди подрядчиков.
        </p>

        {/* Section 4 */}
        <h2 className="font-display" style={h2Style}>
          Нет цифр — нет бизнеса
        </h2>
        <p style={bodyText}>
          Юнит-экономика «на салфетке». CAC не считают. ROMI не видят. Решения принимают
          на ощущениях: «кажется, хорошо зашло» или «что-то пошло не так».
        </p>
        <p style={bodyText}>
          Без цифр невозможно масштабировать. Можно случайно вырасти — но нельзя вырасти
          осознанно. Каждый следующий запуск — снова лотерея.
        </p>

        {/* Highlight box */}
        <div
          style={{
            background: "#111",
            border: "1px solid rgba(255,45,32,0.3)",
            padding: "2rem 2.5rem",
            margin: "3rem 0",
          }}
        >
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#FF2D20",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Тревожный симптом
          </p>
          <p
            className="font-display"
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              fontWeight: 900,
              color: "#F5F5F0",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            ФОТ выше 50% выручки — это не «мы инвестируем в команду». Это перегрев.
          </p>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.65,
              marginTop: "1rem",
              marginBottom: 0,
            }}
          >
            Здоровый показатель — до 30%. Когда фонд оплаты труда съедает больше половины выручки,
            бизнес работает на зарплаты, а не на рост. Первый же провальный запуск — и кассовый разрыв.
          </p>
        </div>

        {/* Image 3 */}
        <figure style={{ margin: "3rem 0" }}>
          <img
            src={SURVIVOR_IMG}
            alt="Выживший в EdTech стоит на горе сломанных устройств с растущим графиком"
            style={{ width: "100%", display: "block", borderRadius: "2px" }}
          />
          <figcaption
            style={{
              fontFamily: "Inter",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.25)",
              marginTop: "0.75rem",
              textAlign: "center",
            }}
          >
            Выживут те, кто считает и строит системы — а не те, кто громче кричит о росте
          </figcaption>
        </figure>

        {/* Section 5: Who survives */}
        <h2 className="font-display" style={{ ...h2Style, color: "#FF2D20" }}>
          Кто выживет?
        </h2>
        <p style={bodyText}>
          Взрослый рынок — это не катастрофа. Это фильтр. Те, кто строил бизнес, а не хайп,
          сейчас получают конкурентное преимущество: слабые уходят, освобождая аудиторию и
          рекламные аукционы.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: "2.5rem 0" }}>
          {[
            {
              n: "01",
              title: "Те, кто считают",
              desc: "Юнит-экономика, ROMI, LTV — не слова из учебника, а ежедневный инструмент. Знают цену каждого лида и каждой продажи.",
            },
            {
              n: "02",
              title: "Те, кто строят продуктовую линейку",
              desc: "Апсел, даунсел, клуб, сопровождение. Один клиент — несколько продаж. LTV растёт, зависимость от трафика падает.",
            },
            {
              n: "03",
              title: "Те, кто автоматизируют без потери ценности",
              desc: "Автоворонки, боты, триггерные рассылки — но с человеческим голосом. Не роботы, а системы, которые звучат как люди.",
            },
            {
              n: "04",
              title: "Те, кто тестируют быстро и системно",
              desc: "Не «запустим и посмотрим», а гипотеза → тест → вывод → следующий тест. Скорость обучения важнее скорости запуска.",
            },
            {
              n: "05",
              title: "Те, кто сокращают, когда нужно",
              desc: "Умение остановить убыточный проект — это не слабость. Это зрелость. Лучший запуск — тот, который не сжёг компанию.",
            },
          ].map((item) => (
            <div
              key={item.n}
              style={{
                display: "flex",
                gap: "1.5rem",
                padding: "1.5rem",
                background: "#111",
                borderLeft: "3px solid rgba(255,45,32,0.3)",
              }}
            >
              <span
                className="font-display"
                style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FF2D20", flexShrink: 0, paddingTop: "0.15rem" }}
              >
                {item.n}
              </span>
              <div>
                <div
                  className="font-display"
                  style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.4rem" }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: "Inter",
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.4)",
                    lineHeight: 1.65,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <h2 className="font-display" style={h2Style}>
          Что дальше?
        </h2>
        <p style={bodyText}>
          EdTech 2026 — это не конец рынка. Это конец лёгких денег. Те, кто воспринимает это
          как трагедию, скорее всего, уйдут. Те, кто видит в этом возможность — построят
          бизнес, который переживёт следующий кризис.
        </p>
        <p style={bodyText}>
          Вебинарная воронка в этой реальности — не «попробуем и посмотрим». Это инструмент
          с измеримым результатом: конверсия, ROMI, стоимость продажи. Либо работает — либо
          нет. Третьего не дано.
        </p>
        <p style={bodyText}>
          Мы в Гипотезе работаем именно так: считаем до старта, строим систему, измеряем
          результат. Если хотите разобраться, где у вашей воронки течёт — напишите нам.
        </p>

        {/* CTA */}
        <div
          style={{
            marginTop: "4rem",
            padding: "3rem",
            background: "#111",
            borderTop: "3px solid #FF2D20",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <p
            className="font-display"
            style={{
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
              fontWeight: 900,
              color: "#F5F5F0",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Хотите узнать, где ваша воронка теряет деньги?
          </p>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Разберём вашу воронку бесплатно и покажем конкретные точки роста.
          </p>
          <Link href="/#contact">
            <button
              style={{
                background: "#FF2D20",
                color: "#fff",
                border: "none",
                padding: "1rem 2rem",
                fontFamily: "Unbounded, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                cursor: "pointer",
                alignSelf: "flex-start",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Получить разбор бесплатно →
            </button>
          </Link>
        </div>

        {/* Tags */}
        <div style={{ marginTop: "3rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["EdTech", "Вебинары", "Автоворонки", "Запуски", "Юнит-экономика", "ROMI"].map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "Inter",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "0.3rem 0.75rem",
                letterSpacing: "0.05em",
              }}
            >
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
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontFamily: "Inter",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.7)",
            whiteSpace: "nowrap",
          }}
        >
          Подпишись на наш Telegram-канал
        </span>
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            background: "#FF2D20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "transform 0.2s",
          }}
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

// Shared styles
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
