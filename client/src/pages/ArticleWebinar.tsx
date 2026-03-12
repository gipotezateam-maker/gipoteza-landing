// Design: Dark editorial article page, Unbounded display font, red accents #FF2D20
// Long-form reading experience with checklists, pull quotes, and section images

import { Link } from "wouter";
import { useEffect } from "react";

const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/webinar-hero-mEiBs8KLnurfSUCxVSPAin.webp";
const STRUCTURE_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/webinar-structure-mVi9SSYYnoB9HayFUpfCZV.webp";
const CHECKLIST_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/webinar-checklist-GXzQCTf2SQgLaoNniRFTWo.webp";

export default function ArticleWebinar() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Из чего состоит запуск вебинара — Гипотеза";
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

      {/* Hero image */}
      <div style={{ paddingTop: "4.5rem" }}>
        <div style={{ position: "relative", width: "100%", maxHeight: "70vh", overflow: "hidden" }}>
          <img
            src={HERO_IMG}
            alt="Спикер на сцене вебинара"
            style={{ width: "100%", height: "70vh", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #0A0A0A 100%)" }} />
        </div>
      </div>

      {/* Article */}
      <article style={{ maxWidth: "720px", margin: "0 auto", padding: "0 1.5rem 8rem" }}>
        {/* Meta */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 600, color: "#FF2D20", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Практика
          </span>
          <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>Март 2026</span>
          <span style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>10 мин чтения</span>
        </div>

        {/* Title */}
        <h1 className="font-display" style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: "2rem", color: "#F5F5F0" }}>
          Из чего состоит<br />
          <span style={{ color: "#FF2D20" }}>запуск вебинара</span>
        </h1>

        {/* Lead */}
        <p style={{ ...bodyText, fontSize: "1.15rem", color: "rgba(255,255,255,0.65)", borderLeft: "3px solid #FF2D20", paddingLeft: "1.5rem", marginBottom: "3rem" }}>
          Не лекция, не интервью, не поток сознания. Продающий вебинар — это структура, энергия и система.
          Разбираем по частям: от продающей архитектуры до чек-листа перед эфиром.
        </p>

        {/* Section 1: Selling structure */}
        <h2 className="font-display" style={h2Style}>Продающая структура вебинара</h2>
        <p style={bodyText}>
          Это не вебинар «чтобы познакомиться». Это вебинар, чтобы конвертировать интерес в деньги
          или следующий шаг. Поэтому структура строится не вокруг темы, а вокруг действия.
        </p>

        {/* Flow steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0", margin: "2.5rem 0", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { step: "01", label: "Проблема", desc: "Называем боль аудитории — чётко, без воды. Слушатель должен кивнуть." },
            { step: "02", label: "Обещание", desc: "Что получит человек к концу вебинара. Конкретно, не «узнаете много нового»." },
            { step: "03", label: "Разбор ситуации", desc: "Погружение в контекст: почему проблема существует, что мешает её решить." },
            { step: "04", label: "Решение (оффер)", desc: "Ваш продукт как единственно логичный следующий шаг." },
            { step: "05", label: "Кейсы / доказательства", desc: "Истории реальных людей. Конкретика: было → стало → за сколько." },
            { step: "06", label: "Продажа или действие", desc: "Чёткий призыв. Без намёков — прямо и уверенно." },
          ].map((item, i) => (
            <div
              key={item.step}
              style={{
                display: "flex",
                gap: "1.5rem",
                padding: "1.25rem 1.5rem",
                borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none",
                background: i % 2 === 0 ? "#0A0A0A" : "#0f0f0f",
              }}
            >
              <span className="font-display" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#FF2D20", flexShrink: 0, paddingTop: "0.2rem", minWidth: "1.5rem" }}>
                {item.step}
              </span>
              <div>
                <div className="font-display" style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.3rem" }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Key principles */}
        <h2 className="font-display" style={h2Style}>Ключевые принципы живого вебинара</h2>

        {/* Principle 1 */}
        <div style={{ margin: "2rem 0", padding: "2rem", background: "#111", borderLeft: "4px solid #FF2D20" }}>
          <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#FF2D20", marginBottom: "0.75rem" }}>
            1. Энергия решает
          </div>
          <p style={{ ...bodyText, marginBottom: "0.75rem" }}>
            Не харизматичный спикер = упущенные деньги. Спикер должен продавать, вдохновлять и не быть скучным.
          </p>
          <p style={{ ...bodyText, marginBottom: 0 }}>
            Если ваш эксперт — аналитик, а не шоумен, пусть у руля будет ведущий. Он будет собирать реакцию,
            задавать темп, шутить и подогревать аудиторию.
          </p>
        </div>

        {/* Principle 2 */}
        <div style={{ margin: "2rem 0", padding: "2rem", background: "#111", borderLeft: "4px solid rgba(255,255,255,0.15)" }}>
          <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.75rem" }}>
            2. Удержание — всё
          </div>
          <p style={{ ...bodyText, marginBottom: "1rem" }}>
            Половина успеха — дотащить людей до конца. Для этого нужны три инструмента:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { title: "Подарки за досмотр", desc: "PDF, чек-лист, бонус, шаблон — но только в самом конце." },
              { title: "Анонс ключевого блока", desc: "«Самое важное расскажем в финале», «вот когда вы поймёте, как это делать»." },
              { title: "Театральная пауза", desc: "Выстраивайте драматургию — прогрессия, эмоции, развязка." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "#FF2D20", flexShrink: 0, marginTop: "0.1rem" }}>→</span>
                <div>
                  <span style={{ fontFamily: "Inter", fontSize: "0.875rem", fontWeight: 600, color: "#F5F5F0" }}>{item.title}: </span>
                  <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Principle 3 */}
        <div style={{ margin: "2rem 0", padding: "2rem", background: "#111", borderLeft: "4px solid rgba(255,255,255,0.15)" }}>
          <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#F5F5F0", marginBottom: "0.75rem" }}>
            3. Контент — не вода
          </div>
          <p style={{ ...bodyText, marginBottom: "1rem" }}>
            Это не YouTube из 2015-го. Тут надо давать по-настоящему ценные штуки:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              "Фишки из реальной работы (чтобы слушатель сказал: «Ого, это бесплатно?»)",
              "Структура: проблема → решение → результат",
              "Истории и конкретика, а не размышления о рынке",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "#FF2D20", flexShrink: 0 }}>—</span>
                <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pull quote */}
        <blockquote style={{ margin: "3rem 0", padding: "2rem 2.5rem", background: "#111", borderLeft: "4px solid #FF2D20" }}>
          <p className="font-display" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.2, letterSpacing: "-0.01em", margin: 0 }}>
            «Половина успеха — дотащить людей до конца. Остальное — продать тем, кто дошёл.»
          </p>
        </blockquote>

        {/* Image: Structure */}
        <figure style={{ margin: "3rem 0" }}>
          <img src={STRUCTURE_IMG} alt="Структура вебинара: три блока" style={{ width: "100%", display: "block", borderRadius: "2px" }} />
          <figcaption style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: "0.75rem", textAlign: "center" }}>
            Три блока вебинара: вступление → контент → вопросы и продажа
          </figcaption>
        </figure>

        {/* Section 3: Skeleton */}
        <h2 className="font-display" style={h2Style}>Каркас: из чего состоит вебинар</h2>

        {/* Block 1 */}
        <div style={{ margin: "2rem 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <span className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>01</span>
            <div>
              <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#F5F5F0" }}>Вступление</div>
              <div style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>7 минут</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "0.5rem" }}>
            {[
              "Приветствие + объяснить, как пользоваться веб-комнатой",
              "План вебинара: 3 буллита с тем, что сегодня будет",
              "Первое окно продаж: коротко, мягко — «если захочется глубже, есть бесплатная консультация»",
              "Первая продажа смысла — зачем это всё",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "#FF2D20", flexShrink: 0, fontSize: "0.75rem", paddingTop: "0.25rem" }}>✓</span>
                <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "1.5rem 0" }} />

        {/* Block 2 */}
        <div style={{ margin: "2rem 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <span className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>02</span>
            <div>
              <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#F5F5F0" }}>Контент + практика</div>
              <div style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>30 минут</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "0.5rem" }}>
            {[
              "Личный сторителлинг от спикера: «я тоже был на вашем месте»",
              "Фишка/приём из практики, который используют «топы»",
              "Разбор, как можно заработать этим навыком",
              "Демонстрация: «что будет, если пойти с нами дальше»",
              "Переход в формат диалога",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "#FF2D20", flexShrink: 0, fontSize: "0.75rem", paddingTop: "0.25rem" }}>✓</span>
                <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ ...bodyText, marginTop: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>
            Здесь готовим к основной продаже: создаём доверие, даём пользу, вызываем «вау».
          </p>
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "1.5rem 0" }} />

        {/* Block 3 */}
        <div style={{ margin: "2rem 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <span className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>03</span>
            <div>
              <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 900, color: "#F5F5F0" }}>Ответы на вопросы</div>
              <div style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>20 минут — это и есть продажа</div>
            </div>
          </div>
          <p style={bodyText}>
            На каждый вопрос у нас есть заготовленный смысл: портфолио, менторство, трудоустройство, проекты.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "0.5rem" }}>
            {[
              "Как найти работу после обучения?",
              "Можно ли учиться онлайн?",
              "Сколько времени займёт путь до Х?",
              "Как не слиться на старте?",
              "Можно ли сменить сферу?",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>→</span>
                <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image: Checklist */}
        <figure style={{ margin: "3rem 0" }}>
          <img src={CHECKLIST_IMG} alt="Чек-лист перед вебинаром" style={{ width: "100%", display: "block", borderRadius: "2px" }} />
          <figcaption style={{ fontFamily: "Inter", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: "0.75rem", textAlign: "center" }}>
            Техосмотр перед эфиром: даже если у вас пилот — Ганди, вебинар не полетит без подготовки
          </figcaption>
        </figure>

        {/* Section 4: Checklist */}
        <h2 className="font-display" style={h2Style}>Внутренний чек-лист к вебинару</h2>
        <p style={bodyText}>
          Это как техосмотр перед вылетом: даже если у вас пилот — Ганди, вебинар не полетит,
          если у него на слайде 10 строк текста калибром 11 pt.
        </p>

        {/* Checklist: Presentation */}
        <ChecklistBlock title="Презентация" items={[
          "Нет слайдов с простынями текста",
          "Нет шрифта мельче 16",
          "Есть иллюстрации, скриншоты, мемы — не только текст",
          "1 слайд = 1 мысль",
          "Правый нижний угол свободен (там будет лицо спикера)",
          "Все внешние скриншоты — в фирстиле, с источниками",
          "Графика крупная и понятная",
          "Всё смотрится хорошо с телефона — 60% заходят с мобилы",
        ]} />

        {/* Checklist: Intro */}
        <ChecklistBlock title="Вступление" items={[
          "Вставлено короткое видео с Продукт Хант (бренд-открытие)",
          "Инструкция по веб-комнате и что делать, если всё зависло",
          "Есть интерактив: мини-опрос в начале",
          "Чётко объяснено, что будет и зачем это человеку",
          "Объявлены бонусы за досмотр",
          "Первая продажа: подарок за регистрацию на курс (оффер в чат)",
          "Есть мини-блок про компанию (через историю или цифры)",
          "Представили спикера — коротко, без LinkedIn на 5 минут",
        ]} />

        {/* Checklist: Content */}
        <ChecklistBlock title="Контент: живое, простое, понятное" items={[
          "Спикер рассказал свою историю успеха: с эмоциями, честно, адаптировано под боли аудитории",
          "Весь вебинар — это не «рассказываем о профессии», а «продаём профессию»",
          "Без перегруза терминами и научных слов — контент для новичков",
          "К каждому теоретическому блоку есть живой пример, вызывающий реакцию",
          "Есть простая практика — показываем, как это применяется в жизни через кейс бизнеса",
          "Доп. материал: чек-лист, шаблон или полезность, которую участник может «унести с собой»",
          "Есть квизы или вопросы в зал, чтобы создать контакт (даже 1–2 — уже ок)",
        ]} />

        {/* Checklist: Sales */}
        <ChecklistBlock title="Продажа: мягкая, сильная, структурная" items={[
          "Есть плавный переход к продаже («что делать дальше?» / «два пути»)",
          "Продающая часть выстроена по структуре: от проблемы → до решения → оффер",
          "Продукт показан, а не просто назван: видео платформы, скриншоты, как устроено обучение",
          "Есть акцент на карьерные результаты: job guarantee / центр карьеры",
          "Цена не произносится, показывается только в чате и в конце",
          "Есть скидка",
          "Есть мини-кейс «отработка цены»",
          "Social proof: истории успеха с конкретикой, актуальные отзывы с фото, логотипы компаний",
          "Подарок за быструю регистрацию (например, гайд — только за 5 минут)",
          "Отработка возражений: «нет времени», «не получится», «дорого»",
          "Имитация дефицита: «осталось 10 мест → 5 → 3» (можно делать в чате)",
          "Демонстрация как оставить заявку — прямо пошагово",
          "Демонстрация живой таблицы с регистрациями — «уже присоединились: ...»",
        ]} />

        {/* CTA */}
        <div style={{ marginTop: "4rem", padding: "3rem", background: "#111", borderTop: "3px solid #FF2D20", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <p className="font-display" style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 900, color: "#F5F5F0", lineHeight: 1.1, margin: 0 }}>
            Хотите, чтобы мы выстроили такую систему под ваш продукт?
          </p>
          <p style={{ fontFamily: "Inter", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65, margin: 0 }}>
            Разберём вашу воронку бесплатно и покажем конкретные точки роста.
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
          {["Вебинары", "Продакшн", "Структура", "Продажи", "Автоворонки", "Запуски"].map((tag) => (
            <span key={tag} style={{ fontFamily: "Inter", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.3rem 0.75rem", letterSpacing: "0.05em" }}>
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* Floating TG */}
      <a href="https://t.me/+qTCI2A9QEOY3YzUy" target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000, display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
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

// Checklist block component
function ChecklistBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ margin: "2rem 0" }}>
      <div className="font-display" style={{ fontSize: "0.9rem", fontWeight: 900, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {items.map((item) => (
          <div key={item} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ width: "16px", height: "16px", border: "1.5px solid rgba(255,45,32,0.5)", borderRadius: "2px", flexShrink: 0, marginTop: "0.15rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ width: "8px", height: "8px", background: "#FF2D20", borderRadius: "1px", display: "block" }} />
            </span>
            <span style={{ fontFamily: "Inter", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
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
