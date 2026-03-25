/**
 * MarketosPage — скрытая страница /marketos
 * Дизайн: в стиле основного сайта gipoteza.agency
 * Тёмный (#111), красный акцент (#FF2D20), Inter + display-шрифт
 * Лимит: 3 бесплатных запроса, затем форма подключения тарифа
 */

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Типы ────────────────────────────────────────────────────────────────────

type Role = "bot" | "user";

interface Message {
  id: string;
  role: Role;
  text: string;
  buttons?: ScenarioButton[];
  isTyping?: boolean;
}

interface ScenarioButton {
  id: string;
  label: string;
  emoji: string;
}

interface Scenario {
  id: string;
  emoji: string;
  label: string;
  userPrompt: string;
  fields: { key: string; label: string; placeholder: string; required: boolean }[];
  buildPrompt: (data: Record<string, string>) => string;
}

// ─── Сценарии ─────────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: "site_analysis",
    emoji: "📊",
    label: "Анализ сайта",
    userPrompt: "Отлично! Давай проанализируем сайт.\n\nПожалуйста, укажи:",
    fields: [
      { key: "url", label: "URL сайта", placeholder: "https://example.com", required: true },
      { key: "focus", label: "Что хочешь узнать?", placeholder: "структура, UX, SEO, дизайн, копирайтинг", required: true },
      { key: "audience", label: "Целевой клиент (опционально)", placeholder: "например: малый бизнес, B2B", required: false },
    ],
    buildPrompt: (d) => `Проанализируй сайт ${d.url}. Дай детальный анализ по следующим критериям:
- Структура и навигация
- UX/UI дизайн
- SEO оптимизация
- Копирайтинг и CTA
${d.audience ? `- Целевая аудитория: ${d.audience}` : ""}
- Фокус анализа: ${d.focus}
- Сильные стороны и слабые места
- Рекомендации по улучшению

Формат: структурированный отчёт с конкретными примерами и советами. Пиши на русском языке.`,
  },
  {
    id: "presentation",
    emoji: "🎨",
    label: "Создать презентацию",
    userPrompt: "Супер! Создадим крутую презентацию.\n\nРасскажи мне:",
    fields: [
      { key: "topic", label: "О чём презентация?", placeholder: "продукт, услуга, идея, отчёт", required: true },
      { key: "audience", label: "Для кого?", placeholder: "инвесторы, клиенты, команда, партнёры", required: true },
      { key: "slides", label: "Сколько слайдов?", placeholder: "10-20", required: false },
      { key: "keypoints", label: "Ключевые моменты", placeholder: "что обязательно должно быть", required: true },
    ],
    buildPrompt: (d) => `Создай профессиональную презентацию на тему: ${d.topic}

Параметры:
- Целевая аудитория: ${d.audience}
- Количество слайдов: ${d.slides || "10-15"}
- Ключевые моменты: ${d.keypoints}
- Стиль: современный, минималистичный, с данными и примерами
- Включи: титульный слайд, проблему, решение, преимущества, CTA

Формат: структурированный контент для каждого слайда с заголовком, основными тезисами и рекомендациями по дизайну. Пиши на русском языке.`,
  },
  {
    id: "competitors",
    emoji: "🎯",
    label: "Анализ конкурентов",
    userPrompt: "Отличный выбор! Разберёмся с конкурентами.\n\nУкажи:",
    fields: [
      { key: "niche", label: "Твоя ниша/индустрия", placeholder: "SaaS, e-commerce, консалтинг...", required: true },
      { key: "competitors", label: "2-3 основных конкурента", placeholder: "или оставь пустым — найду сам", required: false },
      { key: "focus", label: "Что интересует?", placeholder: "цены, маркетинг, позиционирование, аудитория", required: true },
    ],
    buildPrompt: (d) => `Проведи конкурентный анализ для ниши: ${d.niche}
${d.competitors ? `Конкуренты: ${d.competitors}` : "Найди 3-5 ключевых конкурентов самостоятельно."}

Проанализируй:
- Позиционирование и USP каждого
- Целевая аудитория
- Ценовая стратегия
- Каналы маркетинга (социальные сети, реклама, контент)
- Сильные и слабые стороны
- Фокус: ${d.focus}
- Возможности для дифференциации

Создай матрицу позиционирования и рекомендации для выделения на рынке. Пиши на русском языке.`,
  },
  {
    id: "copywriting",
    emoji: "✍️",
    label: "Написать тексты",
    userPrompt: "Давай напишем убедительный текст!\n\nРасскажи:",
    fields: [
      { key: "product", label: "Что продаёшь?", placeholder: "продукт, услугу, идею", required: true },
      { key: "audience", label: "Для кого?", placeholder: "целевая аудитория", required: true },
      { key: "format", label: "Какой формат?", placeholder: "заголовок, описание, письмо, лендинг, пост", required: true },
      { key: "tone", label: "Тон голоса?", placeholder: "дружественный, профессиональный, креативный", required: false },
    ],
    buildPrompt: (d) => `Напиши убедительный копирайтинг для: ${d.product}

Параметры:
- Целевая аудитория: ${d.audience}
- Формат: ${d.format}
- Тон: ${d.tone || "профессиональный, но дружественный"}

Требования:
- Эмоциональное обращение + логические аргументы
- Ясная структура (проблема → решение → результат)
- Убедительные примеры или статистика
- Сильный call-to-action

Создай 2-3 варианта на выбор. Пиши на русском языке.`,
  },
  {
    id: "data_analysis",
    emoji: "📉",
    label: "Анализ данных",
    userPrompt: "Отлично! Разберёмся с цифрами.\n\nОпиши:",
    fields: [
      { key: "data", label: "Какие данные анализировать?", placeholder: "продажи, трафик, аудитория, конверсии...", required: true },
      { key: "period", label: "Период анализа?", placeholder: "месяц, квартал, год", required: true },
      { key: "goal", label: "Какие выводы нужны?", placeholder: "тренды, проблемы, возможности", required: true },
    ],
    buildPrompt: (d) => `Проведи анализ данных: ${d.data}

Параметры:
- Период: ${d.period}
- Целевой результат: ${d.goal}

Создай:
- Обзор ключевых метрик
- Тренды и паттерны
- Аномалии и проблемы
- Рекомендации по оптимизации
- Описание визуализаций (какие графики стоит построить)

Формат: структурированный отчёт, понятный для руководителя. Пиши на русском языке.`,
  },
  {
    id: "strategy",
    emoji: "🗺️",
    label: "Маркетинг-стратегия",
    userPrompt: "Создадим твою маркетинг-стратегию!\n\nПоделись:",
    fields: [
      { key: "product", label: "Что продаёшь?", placeholder: "продукт/услугу", required: true },
      { key: "audience", label: "Кто твой клиент?", placeholder: "описание целевой аудитории", required: true },
      { key: "goal", label: "Какая цель?", placeholder: "увеличить продажи, узнаваемость, лиды", required: true },
      { key: "budget", label: "Бюджет?", placeholder: "если есть — укажи", required: false },
    ],
    buildPrompt: (d) => `Разработай маркетинг-стратегию для: ${d.product}

Параметры:
- Целевая аудитория: ${d.audience}
- Бизнес-цель: ${d.goal}
${d.budget ? `- Бюджет: ${d.budget}` : ""}

Включи:
1. Анализ рынка и конкурентов
2. Позиционирование и USP
3. Каналы маркетинга (приоритизированные)
4. Контент-план (примеры)
5. Метрики успеха и KPI
6. Бюджет по каналам
7. График реализации

Формат: готовый к презентации документ с конкретными действиями. Пиши на русском языке.`,
  },
];

// ─── Утилиты ──────────────────────────────────────────────────────────────────

const FREE_LIMIT = 100;
const STORAGE_KEY = "marketos_requests_used";
const SESSION_KEY = "marketos_session_id";

function getOrCreateSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

function uid() {
  return Math.random().toString(36).slice(2);
}

function botMsg(text: string, buttons?: ScenarioButton[]): Message {
  return { id: uid(), role: "bot", text, buttons };
}

function userMsg(text: string): Message {
  return { id: uid(), role: "user", text };
}

function typingMsg(): Message {
  return { id: "typing", role: "bot", text: "", isTyping: true };
}

const SCENARIO_BUTTONS: ScenarioButton[] = SCENARIOS.map((s) => ({
  id: s.id,
  label: s.label,
  emoji: s.emoji,
}));

const WELCOME_TEXT = `Привет! Я Маркетос — твой маркетинговый помощник.

Помогаю маркетологам, предпринимателям и владельцам бизнеса делать сложную работу за пару кликов.

Анализирую конкурентов, создаю презентации, пишу тексты, разбираюсь в данных — и всё это прямо здесь.

Что хочешь сделать сегодня?`;

const TG_BOT_TOKEN = "8672812865:AAGt98zHZj_Q2r5DnSNXxMl_fNe_Ti9DPxw";
const TG_CHAT_ID = "1342421992";

// ─── Компонент ────────────────────────────────────────────────────────────────

type Stage =
  | { type: "idle" }
  | { type: "collecting"; scenario: Scenario; fieldIndex: number; collected: Record<string, string> }
  | { type: "processing" }
  | { type: "chat" }
  | { type: "limit_reached" }
  | { type: "done" };

// ─── Модальное окно оплаты ────────────────────────────────────────────────────

function PaymentModal({ onClose }: { onClose: () => void }) {
  const handlePay = async () => {
    // Фиксируем клик в базе
    try {
      await fetch("/api/marketos/pay-click", { method: "POST" });
    } catch {}
    // Показываем заглушку
    alert("Функционал оплаты в разработке. Скоро здесь появится оплата тарифа MarketOS!");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#111",
        border: "1px solid rgba(255,255,255,0.08)",
        maxWidth: 440, width: "100%",
        padding: "2.5rem",
        position: "relative",
        textAlign: "center",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1.25rem", right: "1.25rem",
            background: "none", border: "none", color: "rgba(255,255,255,0.3)",
            fontSize: "1.25rem", cursor: "pointer", lineHeight: 1,
          }}
        >✕</button>

        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#FF2D20", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
          — Безлимитный доступ
        </div>
        <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1rem" }}>
          МАРКЕТОС<br /><span style={{ color: "#FF2D20" }}>PRO</span>
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2rem" }}>
          Безлимитные запросы, приоритетная обработка,<br />все сценарии без ограничений.
        </p>

        <button
          onClick={handlePay}
          style={{
            background: "#FF2D20",
            color: "#fff",
            border: "none",
            padding: "1rem 2.5rem",
            fontFamily: "'Unbounded', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "opacity 0.2s",
            width: "100%",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          Оплатить →
        </button>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", marginTop: "1rem" }}>
          Безопасная оплата. Доступ сразу после оплаты.
        </p>
      </div>
    </div>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  onScenarioSelect,
}: {
  msg: Message;
  onScenarioSelect: (id: string) => void;
}) {
  const isBot = msg.role === "bot";

  if (msg.isTyping) {
    return (
      <div className="mk-row mk-row-bot">
        <div className="mk-avatar">М</div>
        <div className="mk-bubble mk-bubble-bot">
          <span className="mk-dot" />
          <span className="mk-dot" />
          <span className="mk-dot" />
        </div>
      </div>
    );
  }

  return (
    <div className={`mk-row ${isBot ? "mk-row-bot" : "mk-row-user"}`}>
      {isBot && <div className="mk-avatar">М</div>}
      <div className="mk-bubble-wrap">
        <div className={`mk-bubble ${isBot ? "mk-bubble-bot" : "mk-bubble-user"}`}>
          <span className="mk-text">{msg.text}</span>
        </div>
        {msg.buttons && msg.buttons.length > 0 && (
          <div className="mk-btns">
            {msg.buttons.map((btn) => (
              <button
                key={btn.id}
                className="mk-scenario-btn"
                onClick={() => onScenarioSelect(btn.id)}
              >
                {btn.emoji} {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function MarketosPage() {
  const [messages, setMessages] = useState<Message[]>([botMsg(WELCOME_TEXT, SCENARIO_BUTTONS)]);
  const [stage, setStage] = useState<Stage>({ type: "idle" });
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [requestsUsed, setRequestsUsed] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10); } catch { return 0; }
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev.filter((m) => !m.isTyping), msg]);
  }, []);

  const addTyping = useCallback(() => {
    setMessages((prev) => [...prev.filter((m) => !m.isTyping), typingMsg()]);
  }, []);

  const removeTyping = useCallback(() => {
    setMessages((prev) => prev.filter((m) => !m.isTyping));
  }, []);

  const incrementRequests = useCallback(() => {
    const next = requestsUsed + 1;
    setRequestsUsed(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
    // Пингуем сессию для трекинга уникальных пользователей
    const sessionId = getOrCreateSessionId();
    fetch("/api/marketos/session-ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }).catch(() => {});
    return next;
  }, [requestsUsed]);

  const checkLimit = useCallback(() => {
    if (requestsUsed >= FREE_LIMIT) {
      setShowModal(true);
      return false;
    }
    return true;
  }, [requestsUsed]);

  // ── Выбор сценария ──────────────────────────────────────────────────────────
  const handleScenarioSelect = useCallback(
    (scenarioId: string) => {
      if (!checkLimit()) return;
      const scenario = SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario) return;

      addMessage(userMsg(`${scenario.emoji} ${scenario.label}`));
      setTimeout(() => {
        addTyping();
        setTimeout(() => {
          removeTyping();
          const firstField = scenario.fields[0];
          addMessage(botMsg(`${scenario.userPrompt}\n\n${firstField.label}${firstField.required ? "" : " (опционально)"}:`));
          setStage({ type: "collecting", scenario, fieldIndex: 0, collected: {} });
          setInputValue("");
          scrollToBottom();
        }, 800);
      }, 200);
    },
    [checkLimit, addMessage, addTyping, removeTyping, scrollToBottom]
  );

  // ── Отправка поля формы ──────────────────────────────────────────────────────
  const handleFieldSubmit = useCallback(
    (value: string) => {
      if (stage.type !== "collecting") return;
      const { scenario, fieldIndex, collected } = stage;
      const currentField = scenario.fields[fieldIndex];
      if (!value.trim() && currentField.required) return;

      const newCollected = { ...collected, [currentField.key]: value.trim() };
      addMessage(userMsg(value.trim() || "(пропущено)"));
      setInputValue("");

      const nextIndex = fieldIndex + 1;
      if (nextIndex < scenario.fields.length) {
        setTimeout(() => {
          addTyping();
          setTimeout(() => {
            removeTyping();
            const nextField = scenario.fields[nextIndex];
            addMessage(botMsg(`${nextField.label}${nextField.required ? "" : " (опционально)"}:`));
            setStage({ type: "collecting", scenario, fieldIndex: nextIndex, collected: newCollected });
            scrollToBottom();
          }, 600);
        }, 200);
      } else {
        setStage({ type: "processing" });
        runManus(scenario, newCollected);
      }
    },
    [stage, addMessage, addTyping, removeTyping, scrollToBottom]
  );

  // ── Вызов Manus API ──────────────────────────────────────────────────────────
  const runManus = useCallback(
    async (scenario: Scenario, data: Record<string, string>) => {
      const isPresentation = scenario.id === "presentation";
      const used = incrementRequests();

      addTyping();
      addMessage(botMsg(
        isPresentation
          ? `Генерирую презентацию...\n\nМаркетос создаёт структуру и оформляет слайды. Обычно это занимает 1-2 минуты.`
          : `Работаю над этим...\n\nМаркетос анализирует данные и готовит результат. Обычно это занимает 1-2 минуты.`
      ));

      try {
        if (isPresentation) {
          const response = await fetch("/api/marketos/presentation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic: data.topic || data.keypoints || "Маркетинговая презентация",
              details: `Аудитория: ${data.audience || ""}, Ключевые моменты: ${data.keypoints || ""}, Слайдов: ${data.slides || "10"}`,
            }),
          });
          if (!response.ok) throw new Error(`API error: ${response.status}`);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `marketos-${(data.topic || "presentation").replace(/\s+/g, "-").toLowerCase()}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          removeTyping();
          addMessage(botMsg(
            `✅ Презентация готова! PDF-файл скачивается на твой компьютер.\n\nФайл содержит титульный слайд, ${data.slides || "8"} слайдов с контентом и финальный слайд.\n\nХочешь что-то изменить или создать ещё одну?`,
            used < FREE_LIMIT ? SCENARIO_BUTTONS : undefined
          ));
        } else {
          const prompt = scenario.buildPrompt(data);
          const response = await fetch("/api/marketos/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                {
                  role: "system",
                  content: "Ты — Маркетос, профессиональный маркетинговый помощник агентства Гипотеза. Помогаешь маркетологам и предпринимателям решать задачи. Отвечай структурированно, конкретно и по делу. Пиши на русском языке.",
                },
                { role: "user", content: prompt },
              ],
            }),
          });
          if (!response.ok) throw new Error(`API error: ${response.status}`);
          const result = await response.json();
          const answer = result.text || "Получил результат, но не смог его обработать. Попробуй ещё раз.";
          removeTyping();
          addMessage(botMsg(`${answer}`));

          if (used >= FREE_LIMIT) {
            // Лимит исчерпан
            addMessage(botMsg(
              `Вы использовали все ${FREE_LIMIT} запросов.\n\nЧтобы продолжить работу с Маркетос — подключите платный тариф.`
            ));
            setStage({ type: "limit_reached" });
          } else {
            addMessage(botMsg(
              `Нужны уточнения или изменения? Напишите прямо сейчас — или выберите новый сценарий:`,
              SCENARIO_BUTTONS
            ));
            setStage({ type: "chat" });
          }
        }
      } catch (err) {
        console.error("Manus API error:", err);
        removeTyping();
        addMessage(botMsg(
          `Что-то пошло не так при обработке запроса.\n\nПопробуй ещё раз или выбери другой сценарий:`,
          SCENARIO_BUTTONS
        ));
        setStage({ type: "done" });
      }
    },
    [addMessage, addTyping, removeTyping, incrementRequests]
  );

  // ── Свободный чат после ответа ────────────────────────────────────────────
  const handleChatSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      if (!checkLimit()) return;

      addMessage(userMsg(text.trim()));
      setInputValue("");
      setStage({ type: "processing" });
      addTyping();

      const used = incrementRequests();

      try {
        const response = await fetch("/api/marketos/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: "Ты — Маркетос, профессиональный маркетинговый помощник агентства Гипотеза. Отвечай конкретно, структурированно и по делу. Пиши на русском языке.",
              },
              { role: "user", content: text.trim() },
            ],
          }),
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const result = await response.json();
        const answer = result.text || "Не смог обработать ответ. Попробуй ещё раз.";
        removeTyping();
        addMessage(botMsg(answer));

        if (used >= FREE_LIMIT) {
          addMessage(botMsg(
            `Вы использовали все ${FREE_LIMIT} запросов.\n\nЧтобы продолжить — подключите платный тариф.`
          ));
          setStage({ type: "limit_reached" });
        } else {
          addMessage(botMsg("Ещё вопросы? Напишите — или выберите новый сценарий:", SCENARIO_BUTTONS));
          setStage({ type: "chat" });
        }
      } catch (err) {
        console.error("Chat error:", err);
        removeTyping();
        addMessage(botMsg("Что-то пошло не так. Попробуй ещё раз:", SCENARIO_BUTTONS));
        setStage({ type: "chat" });
      }
    },
    [checkLimit, addMessage, addTyping, removeTyping, incrementRequests]
  );

  // ── Обработка ввода ──────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (stage.type === "collecting") handleFieldSubmit(inputValue);
    else if (stage.type === "chat") handleChatSend(inputValue);
  }, [stage, inputValue, handleFieldSubmit, handleChatSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const isInputActive = stage.type === "collecting" || stage.type === "chat";
  const isChatMode = stage.type === "chat";
  const currentField = stage.type === "collecting" ? stage.scenario.fields[stage.fieldIndex] : null;
  const remaining = Math.max(0, FREE_LIMIT - requestsUsed);

  // ─── Рендер ────────────────────────────────────────────────────────────────

  return (
    <div className="mk-root">
      {/* Header */}
      <header className="mk-header">
        <div className="mk-header-inner">
          <div className="mk-logo">
            <span className="mk-logo-m">М</span>
            <div>
              <div className="mk-logo-name">МАРКЕТ<span className="mk-red">ОС</span></div>
              <div className="mk-logo-sub">● онлайн · маркетинговый помощник</div>
            </div>
          </div>
          <div className="mk-counter">
            {remaining > 0
              ? <><span className="mk-counter-num">{remaining}</span> / {FREE_LIMIT} запросов</>
              : <span className="mk-counter-empty" onClick={() => setShowModal(true)}>Оплатить →</span>
            }
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="mk-messages">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} onScenarioSelect={handleScenarioSelect} />
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Footer */}
      <footer className="mk-footer">
        {stage.type === "limit_reached" ? (
          <div className="mk-limit-bar">
            <span className="mk-limit-text">Бесплатные запросы исчерпаны</span>
            <button className="mk-tariff-btn" onClick={() => setShowModal(true)}>
              Оплатить →
            </button>
          </div>
        ) : isChatMode ? (
          <div className="mk-input-wrap">
            <div className="mk-input-label">Уточни или задай новый вопрос</div>
            <div className="mk-input-row">
              <input
                ref={inputRef}
                className="mk-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Например: сделай короче, добавь примеры..."
                autoFocus
              />
              <button className="mk-send-btn" onClick={handleSend} disabled={!inputValue.trim()}>→</button>
            </div>
          </div>
        ) : isInputActive && currentField ? (
          <div className="mk-input-wrap">
            <div className="mk-input-label">
              {currentField.label}
              {!currentField.required && <span className="mk-optional"> — необязательно</span>}
            </div>
            <div className="mk-input-row">
              <input
                ref={inputRef}
                className="mk-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentField.placeholder}
                autoFocus
              />
              <button
                className="mk-send-btn"
                onClick={handleSend}
                disabled={currentField.required && !inputValue.trim()}
              >→</button>
            </div>
            {!currentField.required && (
              <button className="mk-skip-btn" onClick={() => handleFieldSubmit("")}>Пропустить →</button>
            )}
          </div>
        ) : (
          <div className="mk-footer-idle">
            {stage.type === "processing"
              ? "Обрабатываю запрос..."
              : "Выбери сценарий выше, чтобы начать"}
          </div>
        )}
      </footer>

      {/* Модальное окно оплаты */}
      {showModal && <PaymentModal onClose={() => setShowModal(false)} />}

      <style>{STYLES}</style>
    </div>
  );
}

// ─── Стили ────────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Unbounded:wght@700;800;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .mk-root {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-width: 760px;
    margin: 0 auto;
    background: #0d0d0d;
    font-family: 'Inter', -apple-system, sans-serif;
    color: #F5F5F0;
  }

  /* ── Header ── */
  .mk-header {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: #111;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .mk-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
  }
  .mk-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .mk-logo-m {
    width: 38px;
    height: 38px;
    background: #FF2D20;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Unbounded', sans-serif;
    font-weight: 900;
    font-size: 1rem;
    color: #fff;
    flex-shrink: 0;
  }
  .mk-logo-name {
    font-family: 'Unbounded', sans-serif;
    font-weight: 900;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    color: #F5F5F0;
  }
  .mk-red { color: #FF2D20; }
  .mk-logo-sub {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.05em;
    margin-top: 2px;
    font-weight: 500;
  }
  .mk-counter {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.05em;
  }
  .mk-counter-num {
    color: #FF2D20;
    font-weight: 700;
    font-size: 0.85rem;
  }
  .mk-counter-empty {
    color: #FF2D20;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: opacity 0.2s;
  }
  .mk-counter-empty:hover { opacity: 0.75; }

  /* ── Messages ── */
  .mk-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    scroll-behavior: smooth;
  }
  .mk-messages::-webkit-scrollbar { width: 3px; }
  .mk-messages::-webkit-scrollbar-track { background: transparent; }
  .mk-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

  /* ── Rows ── */
  .mk-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .mk-row-user { flex-direction: row-reverse; }
  .mk-avatar {
    width: 32px;
    height: 32px;
    background: #FF2D20;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Unbounded', sans-serif;
    font-weight: 900;
    font-size: 0.75rem;
    color: #fff;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .mk-bubble-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    max-width: 78%;
  }
  .mk-row-user .mk-bubble-wrap { align-items: flex-end; }

  /* ── Bubbles ── */
  .mk-bubble {
    padding: 0.875rem 1.1rem;
    font-size: 0.875rem;
    line-height: 1.7;
    word-break: break-word;
  }
  .mk-bubble-bot {
    background: #1a1a1a;
    border: 1px solid rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.85);
  }
  .mk-bubble-user {
    background: #FF2D20;
    color: #fff;
  }
  .mk-text { white-space: pre-wrap; }

  /* Typing */
  .mk-bubble-bot.mk-bubble {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .mk-dot {
    width: 6px;
    height: 6px;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    animation: mk-bounce 1.2s infinite;
    display: inline-block;
  }
  .mk-dot:nth-child(2) { animation-delay: 0.2s; }
  .mk-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes mk-bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
    30% { transform: translateY(-5px); opacity: 1; }
  }

  /* ── Scenario buttons ── */
  .mk-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .mk-scenario-btn {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.6);
    padding: 0.5rem 0.875rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.775rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    letter-spacing: 0.01em;
  }
  .mk-scenario-btn:hover {
    border-color: #FF2D20;
    color: #FF2D20;
    background: rgba(255,45,32,0.05);
  }

  /* ── Footer ── */
  .mk-footer {
    border-top: 1px solid rgba(255,255,255,0.06);
    background: #111;
    padding: 1rem 1.5rem 1.25rem;
  }
  .mk-footer-idle {
    text-align: center;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.2);
    letter-spacing: 0.05em;
    padding: 0.5rem 0;
    text-transform: uppercase;
  }
  .mk-input-wrap { display: flex; flex-direction: column; gap: 0.5rem; }
  .mk-input-label {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .mk-optional { color: rgba(255,255,255,0.2); }
  .mk-input-row { display: flex; gap: 0.75rem; align-items: center; }
  .mk-input {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    color: #F5F5F0;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    padding: 0.6rem 0;
    outline: none;
    transition: border-color 0.2s;
  }
  .mk-input:focus { border-bottom-color: rgba(255,255,255,0.5); }
  .mk-input::placeholder { color: rgba(255,255,255,0.2); }
  .mk-send-btn {
    background: #FF2D20;
    border: none;
    color: #fff;
    width: 38px;
    height: 38px;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: opacity 0.2s;
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
  }
  .mk-send-btn:hover:not(:disabled) { opacity: 0.85; }
  .mk-send-btn:disabled { background: rgba(255,255,255,0.1); cursor: not-allowed; color: rgba(255,255,255,0.2); }
  .mk-skip-btn {
    background: none;
    border: none;
    color: rgba(255,255,255,0.25);
    font-size: 0.7rem;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.05em;
    transition: color 0.2s;
    text-align: left;
  }
  .mk-skip-btn:hover { color: rgba(255,255,255,0.5); }

  /* ── Limit bar ── */
  .mk-limit-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .mk-limit-text {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .mk-tariff-btn {
    background: #FF2D20;
    border: none;
    color: #fff;
    padding: 0.6rem 1.25rem;
    font-family: 'Unbounded', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s;
    white-space: nowrap;
  }
  .mk-tariff-btn:hover { opacity: 0.85; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .mk-root { max-width: 100%; }
    .mk-bubble-wrap { max-width: 88%; }
    .mk-header-inner { padding: 0.875rem 1rem; }
    .mk-messages { padding: 1rem; }
    .mk-footer { padding: 0.875rem 1rem 1rem; }
    .mk-scenario-btn { font-size: 0.725rem; padding: 0.45rem 0.75rem; }
  }
`;
