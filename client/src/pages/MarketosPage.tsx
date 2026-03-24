/**
 * MarketosPage — скрытая страница /marketos
 * Дизайн: тёмный, акцент #ef4444 (красный), шрифт Unbounded/Inter
 * Чат-интерфейс в стиле мессенджера с 6 сценариями MarketOS
 * Интеграция с Manus Forge API (VITE_FRONTEND_FORGE_API_KEY)
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
    userPrompt: "Отлично! Давай проанализируем сайт конкурента.\n\nПожалуйста, укажи:",
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
    userPrompt: "Супер! Создадим крутую презентацию для тебя.\n\nРасскажи мне:",
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
    label: "Написать копи",
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
    userPrompt: "Отлично! Разберёмся с цифрами.\n\nЗагрузи или расскажи:",
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

const WELCOME_TEXT = `👋 Привет! Я Маркетос — твой маркетинговый помощник!

Я помогаю маркетологам, предпринимателям и владельцам бизнеса делать сложную работу за пару кликов.

Анализирую конкурентов, создаю презентации, пишу копи, разбираюсь в данных — и всё это прямо здесь, без лишних переходов.

Что ты хочешь сделать сегодня? Выбери один из сценариев ниже 👇`;

// ─── Компонент ────────────────────────────────────────────────────────────────

type Stage =
  | { type: "idle" }
  | { type: "collecting"; scenario: Scenario; fieldIndex: number; collected: Record<string, string> }
  | { type: "processing" }
  | { type: "done" };

export default function MarketosPage() {
  const [messages, setMessages] = useState<Message[]>([botMsg(WELCOME_TEXT, SCENARIO_BUTTONS)]);
  const [stage, setStage] = useState<Stage>({ type: "idle" });
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev.filter((m) => !m.isTyping), msg]);
  }, []);

  const addTyping = useCallback(() => {
    setMessages((prev) => [...prev.filter((m) => !m.isTyping), typingMsg()]);
  }, []);

  const removeTyping = useCallback(() => {
    setMessages((prev) => prev.filter((m) => !m.isTyping));
  }, []);

  // ── Выбор сценария ──────────────────────────────────────────────────────────
  const handleScenarioSelect = useCallback(
    (scenarioId: string) => {
      const scenario = SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario) return;

      addMessage(userMsg(`${scenario.emoji} ${scenario.label}`));

      setTimeout(() => {
        addTyping();
        setTimeout(() => {
          removeTyping();
          const firstField = scenario.fields[0];
          const promptText = `${scenario.userPrompt}\n\n1️⃣ ${firstField.label}${firstField.required ? "" : " (опционально)"}:`;
          addMessage(botMsg(promptText));
          setStage({ type: "collecting", scenario, fieldIndex: 0, collected: {} });
          setFormData({});
          setInputValue("");
          scrollToBottom();
        }, 800);
      }, 200);
    },
    [addMessage, addTyping, removeTyping, scrollToBottom]
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
        // Следующее поле
        setTimeout(() => {
          addTyping();
          setTimeout(() => {
            removeTyping();
            const nextField = scenario.fields[nextIndex];
            addMessage(
              botMsg(
                `${nextIndex + 1}️⃣ ${nextField.label}${nextField.required ? "" : " (опционально)"}:`
              )
            );
            setStage({ type: "collecting", scenario, fieldIndex: nextIndex, collected: newCollected });
            scrollToBottom();
          }, 600);
        }, 200);
      } else {
        // Все поля собраны — отправляем в API
        setStage({ type: "processing" });
        runManus(scenario, newCollected);
      }
    },
    [stage, addMessage, addTyping, removeTyping, scrollToBottom]
  );

  // ── Вызов Manus API ──────────────────────────────────────────────────────────
  const runManus = useCallback(
    async (scenario: Scenario, data: Record<string, string>) => {
      const prompt = scenario.buildPrompt(data);

      addTyping();
      addMessage(
        botMsg(
          `⏳ Работаю над этим...\n\nМаркетос анализирует данные и готовит результат для тебя.\nОбычно это занимает 1-2 минуты.\n\nПодожди немного... 🤖`
        )
      );

      try {
        const apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
        const apiBase = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
        const apiUrl = `${apiBase}/v1/chat/completions`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "claude-3-7-sonnet-20250219",
            messages: [
              {
                role: "system",
                content:
                  "Ты — Маркетос, профессиональный маркетинговый помощник. Ты помогаешь маркетологам и предпринимателям решать задачи: анализировать конкурентов, создавать контент, строить стратегии. Отвечай структурированно, конкретно и по делу. Используй эмодзи для структурирования. Пиши на русском языке.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 4000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        const answer =
          result.choices?.[0]?.message?.content ||
          result.content ||
          "Получил результат, но не смог его обработать. Попробуй ещё раз.";

        removeTyping();
        addMessage(botMsg(`✅ Готово! Вот результат:\n\n${answer}`));
        addMessage(
          botMsg(
            `Нужны ещё какие-то изменения? Напиши мне! 📝\n\nИли выбери новый сценарий:`,
            SCENARIO_BUTTONS
          )
        );
        setStage({ type: "done" });
      } catch (err) {
        console.error("Manus API error:", err);
        removeTyping();
        addMessage(
          botMsg(
            `😔 Что-то пошло не так при обработке запроса.\n\nПопробуй ещё раз или выбери другой сценарий:`,
            SCENARIO_BUTTONS
          )
        );
        setStage({ type: "done" });
      }
    },
    [addMessage, addTyping, removeTyping]
  );

  // ── Обработка ввода ──────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (stage.type === "collecting") {
      handleFieldSubmit(inputValue);
    }
  }, [stage, inputValue, handleFieldSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const isInputActive = stage.type === "collecting";
  const currentField =
    stage.type === "collecting" ? stage.scenario.fields[stage.fieldIndex] : null;

  // ─── Рендер ────────────────────────────────────────────────────────────────

  return (
    <div className="marketos-root">
      {/* Header */}
      <header className="marketos-header">
        <div className="marketos-avatar">🤖</div>
        <div>
          <div className="marketos-name">Маркетос</div>
          <div className="marketos-status">
            <span className="marketos-dot" />
            онлайн
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="marketos-messages">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            onScenarioSelect={handleScenarioSelect}
          />
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <footer className="marketos-footer">
        {isInputActive && currentField ? (
          <div className="marketos-input-wrap">
            <div className="marketos-field-hint">
              {currentField.label}
              {!currentField.required && <span className="marketos-optional"> (опционально)</span>}
            </div>
            <div className="marketos-input-row">
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                className="marketos-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentField.placeholder}
                autoFocus
              />
              <button
                className="marketos-send-btn"
                onClick={handleSend}
                disabled={currentField.required && !inputValue.trim()}
              >
                ➤
              </button>
            </div>
            {!currentField.required && (
              <button
                className="marketos-skip-btn"
                onClick={() => handleFieldSubmit("")}
              >
                Пропустить →
              </button>
            )}
          </div>
        ) : (
          <div className="marketos-footer-idle">
            {stage.type === "processing"
              ? "⏳ Обрабатываю запрос..."
              : "Выбери сценарий выше, чтобы начать 👆"}
          </div>
        )}
      </footer>

      <style>{STYLES}</style>
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
  if (msg.isTyping) {
    return (
      <div className="marketos-bubble-row bot">
        <div className="marketos-bubble bot typing">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    );
  }

  return (
    <div className={`marketos-bubble-row ${msg.role}`}>
      {msg.role === "bot" && <div className="marketos-bubble-avatar">🤖</div>}
      <div className="marketos-bubble-content">
        <div className={`marketos-bubble ${msg.role}`}>
          <MessageText text={msg.text} />
        </div>
        {msg.buttons && (
          <div className="marketos-buttons">
            {msg.buttons.map((btn) => (
              <button
                key={btn.id}
                className="marketos-scenario-btn"
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

// ─── MessageText — рендер текста с переносами и markdown-lite ─────────────────

function MessageText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="marketos-text">
      {lines.map((line, i) => {
        // Простой bold: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </div>
  );
}

// ─── Стили ────────────────────────────────────────────────────────────────────

const STYLES = `
  .marketos-root {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-width: 720px;
    margin: 0 auto;
    background: #0a0a0a;
    font-family: 'Inter', sans-serif;
    color: #f5f5f5;
    position: relative;
  }

  /* Header */
  .marketos-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: #111;
    border-bottom: 1px solid #222;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .marketos-avatar {
    font-size: 28px;
    width: 44px;
    height: 44px;
    background: #1a1a1a;
    border: 2px solid #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .marketos-name {
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #fff;
    letter-spacing: 0.02em;
  }
  .marketos-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #888;
    margin-top: 2px;
  }
  .marketos-dot {
    width: 7px;
    height: 7px;
    background: #22c55e;
    border-radius: 50%;
    display: inline-block;
  }

  /* Messages */
  .marketos-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;
  }
  .marketos-messages::-webkit-scrollbar {
    width: 4px;
  }
  .marketos-messages::-webkit-scrollbar-track {
    background: transparent;
  }
  .marketos-messages::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 2px;
  }

  /* Bubble rows */
  .marketos-bubble-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }
  .marketos-bubble-row.user {
    flex-direction: row-reverse;
  }
  .marketos-bubble-avatar {
    font-size: 20px;
    width: 32px;
    height: 32px;
    background: #1a1a1a;
    border: 1.5px solid #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-bottom: 2px;
  }
  .marketos-bubble-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 82%;
  }
  .marketos-bubble-row.user .marketos-bubble-content {
    align-items: flex-end;
  }

  /* Bubbles */
  .marketos-bubble {
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.6;
    word-break: break-word;
  }
  .marketos-bubble.bot {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-bottom-left-radius: 4px;
    color: #f0f0f0;
  }
  .marketos-bubble.user {
    background: #ef4444;
    border-bottom-right-radius: 4px;
    color: #fff;
  }

  /* Typing indicator */
  .marketos-bubble.typing {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 14px 18px;
  }
  .marketos-bubble.typing .dot {
    width: 7px;
    height: 7px;
    background: #555;
    border-radius: 50%;
    animation: typing-bounce 1.2s infinite;
  }
  .marketos-bubble.typing .dot:nth-child(2) { animation-delay: 0.2s; }
  .marketos-bubble.typing .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing-bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* Text */
  .marketos-text {
    white-space: pre-wrap;
  }

  /* Scenario buttons */
  .marketos-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
  }
  .marketos-scenario-btn {
    background: #1a1a1a;
    border: 1.5px solid #333;
    color: #f0f0f0;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
  }
  .marketos-scenario-btn:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
    transform: translateY(-1px);
  }
  .marketos-scenario-btn:active {
    transform: translateY(0);
  }

  /* Footer */
  .marketos-footer {
    padding: 12px 16px 20px;
    background: #0f0f0f;
    border-top: 1px solid #1e1e1e;
  }
  .marketos-footer-idle {
    text-align: center;
    color: #555;
    font-size: 13px;
    padding: 8px 0;
  }
  .marketos-input-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .marketos-field-hint {
    font-size: 12px;
    color: #888;
    padding-left: 4px;
  }
  .marketos-optional {
    color: #555;
  }
  .marketos-input-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .marketos-input {
    flex: 1;
    background: #1a1a1a;
    border: 1.5px solid #333;
    color: #f0f0f0;
    padding: 12px 16px;
    border-radius: 24px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.18s;
  }
  .marketos-input:focus {
    border-color: #ef4444;
  }
  .marketos-input::placeholder {
    color: #444;
  }
  .marketos-send-btn {
    width: 44px;
    height: 44px;
    background: #ef4444;
    border: none;
    border-radius: 50%;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.18s, transform 0.1s;
  }
  .marketos-send-btn:hover:not(:disabled) {
    background: #dc2626;
    transform: scale(1.05);
  }
  .marketos-send-btn:disabled {
    background: #333;
    cursor: not-allowed;
    color: #555;
  }
  .marketos-skip-btn {
    background: none;
    border: none;
    color: #555;
    font-size: 12px;
    cursor: pointer;
    text-align: left;
    padding: 0 4px;
    transition: color 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .marketos-skip-btn:hover {
    color: #888;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .marketos-bubble-content {
      max-width: 90%;
    }
    .marketos-scenario-btn {
      font-size: 12px;
      padding: 7px 12px;
    }
  }
`;
