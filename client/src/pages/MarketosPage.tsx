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
  | { type: "chat" }  // свободный диалог после ответа
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
      const isPresentation = scenario.id === "presentation";

      addTyping();
      addMessage(
        botMsg(
          isPresentation
            ? `⏳ Генерирую презентацию...\n\nМаркетос создаёт структуру и оформляет слайды.\nОбычно это занимает 1-2 минуты.\n\nПодожди немного... 🎨`
            : `⏳ Работаю над этим...\n\nМаркетос анализирует данные и готовит результат для тебя.\nОбычно это занимает 1-2 минуты.\n\nПодожди немного... 🤖`
        )
      );

      try {
        if (isPresentation) {
          // ── PDF презентация ──────────────────────────────────────────────────
          const response = await fetch("/api/marketos/presentation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic: data.topic || data.keypoints || "Маркетинговая презентация",
              details: `Аудитория: ${data.audience || ""}, Ключевые моменты: ${data.keypoints || ""}, Слайдов: ${data.slides || "10"}`,
            }),
          });

          if (!response.ok) throw new Error(`API error: ${response.status}`);

          // Скачиваем PDF
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
          addMessage(
            botMsg(
              `✅ Презентация готова! PDF-файл скачивается на твой компьютер.\n\n📄 Файл содержит титульный слайд, ${data.slides || "8"} слайдов с контентом и финальный слайд.\n\nХочешь что-то изменить или создать ещё одну?`,
              SCENARIO_BUTTONS
            )
          );
        } else {
          // ── Текстовый ответ ──────────────────────────────────────────────────
          const prompt = scenario.buildPrompt(data);
          const response = await fetch("/api/marketos/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                {
                  role: "system",
                  content: "Ты — Маркетос, профессиональный маркетинговый помощник. Ты помогаешь маркетологам и предпринимателям решать задачи: анализировать конкурентов, создавать контент, строить стратегии. Отвечай структурированно, конкретно и по делу. Используй эмодзи для структурирования. Пиши на русском языке.",
                },
                { role: "user", content: prompt },
              ],
            }),
          });

          if (!response.ok) throw new Error(`API error: ${response.status}`);

          const result = await response.json();
          const answer = result.text || "Получил результат, но не смог его обработать. Попробуй ещё раз.";

          removeTyping();
          addMessage(botMsg(`✅ Готово! Вот результат:\n\n${answer}`));
          addMessage(
            botMsg(`Нужны уточнения или изменения? Напиши мне прямо сейчас — или выбери новый сценарий:`, SCENARIO_BUTTONS)
          );
          setStage({ type: "chat" });
        }
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

  // ── Свободный чат после ответа ────────────────────────────────────────────
  const handleChatSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      addMessage(userMsg(text.trim()));
      setInputValue("");
      setStage({ type: "processing" });
      addTyping();

      try {
        const response = await fetch("/api/marketos/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: "Ты — Маркетос, профессиональный маркетинговый помощник. Отвечай конкретно, структурированно и по делу. Пиши на русском языке.",
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
        addMessage(botMsg("Ещё вопросы? Напиши мне — или выбери новый сценарий:", SCENARIO_BUTTONS));
        setStage({ type: "chat" });
      } catch (err) {
        console.error("Chat error:", err);
        removeTyping();
        addMessage(botMsg("Что-то пошло не так. Попробуй ещё раз:", SCENARIO_BUTTONS));
        setStage({ type: "chat" });
      }
    },
    [addMessage, addTyping, removeTyping]
  );

  // ── Обработка ввода ──────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (stage.type === "collecting") {
      handleFieldSubmit(inputValue);
    } else if (stage.type === "chat") {
      handleChatSend(inputValue);
    }
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
  const currentField =
    stage.type === "collecting" ? stage.scenario.fields[stage.fieldIndex] : null;

  // ─── Рендер ────────────────────────────────────────────────────────────────

  return (
    <div className="marketos-root">
      {/* Header */}
      <header className="marketos-header">
        <div className="marketos-avatar">🤖</div>
        <div className="marketos-header-text">
          <div className="marketos-name">Маркет<span className="accent">ОС</span></div>
          <div className="marketos-status">
            <span className="marketos-dot" />
            онлайн • маркетинговый помощник
          </div>
        </div>
        <div className="marketos-header-badge">✨ AI-помощник</div>
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
        {isChatMode ? (
          <div className="marketos-input-wrap">
            <div className="marketos-field-hint">Уточни или задай новый вопрос:</div>
            <div className="marketos-input-row">
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                className="marketos-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Например: сделай короче, добавь примеры..."
                autoFocus
              />
              <button
                className="marketos-send-btn"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                ➤
              </button>
            </div>
          </div>
        ) : isInputActive && currentField ? (
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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Unbounded:wght@700;800;900&display=swap');

  * { box-sizing: border-box; }

  .marketos-root {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-width: 800px;
    margin: 0 auto;
    background: #f5f5f5;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1a1a1a;
    position: relative;
  }

  /* Header */
  .marketos-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 24px;
    background: #ffffff;
    border-bottom: 1px solid #ebebeb;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  }
  .marketos-avatar {
    width: 46px;
    height: 46px;
    background: linear-gradient(135deg, #fa876b 0%, #ff6b4a 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 24px;
    box-shadow: 0 3px 10px rgba(250,135,107,0.4);
  }
  .marketos-name {
    font-family: 'Unbounded', sans-serif;
    font-weight: 800;
    font-size: 15px;
    color: #1a1a1a;
    letter-spacing: -0.01em;
  }
  .marketos-name .accent {
    color: #fa876b;
  }
  .marketos-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #999;
    margin-top: 2px;
    font-weight: 500;
  }
  .marketos-dot {
    width: 7px;
    height: 7px;
    background: #22c55e;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 0 2px rgba(34,197,94,0.2);
  }
  .marketos-header-badge {
    margin-left: auto;
    background: #fff5f2;
    border: 1px solid #fdd5c8;
    color: #fa876b;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
  }

  /* Messages */
  .marketos-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scroll-behavior: smooth;
  }
  .marketos-messages::-webkit-scrollbar { width: 4px; }
  .marketos-messages::-webkit-scrollbar-track { background: transparent; }
  .marketos-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

  /* Bubble rows */
  .marketos-bubble-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
  }
  .marketos-bubble-row.user { flex-direction: row-reverse; }
  .marketos-bubble-avatar {
    width: 34px;
    height: 34px;
    background: linear-gradient(135deg, #fa876b 0%, #ff6b4a 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-bottom: 2px;
    font-size: 18px;
    box-shadow: 0 2px 6px rgba(250,135,107,0.3);
  }
  .marketos-bubble-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 80%;
  }
  .marketos-bubble-row.user .marketos-bubble-content { align-items: flex-end; }

  /* Bubbles */
  .marketos-bubble {
    padding: 13px 17px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.65;
    word-break: break-word;
  }
  .marketos-bubble.bot {
    background: #ffffff;
    border: 1px solid #ebebeb;
    border-bottom-left-radius: 5px;
    color: #1a1a1a;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .marketos-bubble.user {
    background: linear-gradient(135deg, #fa876b 0%, #ff6b4a 100%);
    border-bottom-right-radius: 5px;
    color: #fff;
    box-shadow: 0 3px 10px rgba(250,135,107,0.35);
  }

  /* Typing */
  .marketos-bubble.typing {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 16px 20px;
  }
  .marketos-bubble.typing .dot {
    width: 7px;
    height: 7px;
    background: #ccc;
    border-radius: 50%;
    animation: typing-bounce 1.2s infinite;
  }
  .marketos-bubble.typing .dot:nth-child(2) { animation-delay: 0.2s; }
  .marketos-bubble.typing .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing-bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  .marketos-text { white-space: pre-wrap; }

  /* Scenario buttons */
  .marketos-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }
  .marketos-scenario-btn {
    background: #ffffff;
    border: 1.5px solid #e8e8e8;
    color: #333;
    padding: 9px 16px;
    border-radius: 24px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .marketos-scenario-btn:hover {
    border-color: #fa876b;
    color: #fa876b;
    background: #fff8f5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(250,135,107,0.2);
  }
  .marketos-scenario-btn:active { transform: translateY(0); }

  /* Footer */
  .marketos-footer {
    padding: 14px 20px 22px;
    background: #ffffff;
    border-top: 1px solid #ebebeb;
    box-shadow: 0 -2px 12px rgba(0,0,0,0.05);
  }
  .marketos-footer-idle {
    text-align: center;
    color: #bbb;
    font-size: 13px;
    padding: 8px 0;
    font-weight: 500;
  }
  .marketos-input-wrap { display: flex; flex-direction: column; gap: 8px; }
  .marketos-field-hint {
    font-size: 12px;
    color: #999;
    padding-left: 4px;
    font-weight: 500;
  }
  .marketos-optional { color: #ccc; }
  .marketos-input-row { display: flex; gap: 8px; align-items: center; }
  .marketos-input {
    flex: 1;
    background: #f7f7f7;
    border: 1.5px solid #e8e8e8;
    color: #1a1a1a;
    padding: 13px 18px;
    border-radius: 28px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .marketos-input:focus {
    border-color: #fa876b;
    box-shadow: 0 0 0 3px rgba(250,135,107,0.12);
    background: #fff;
  }
  .marketos-input::placeholder { color: #bbb; }
  .marketos-send-btn {
    width: 46px;
    height: 46px;
    background: linear-gradient(135deg, #fa876b 0%, #ff6b4a 100%);
    border: none;
    border-radius: 50%;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 3px 10px rgba(250,135,107,0.4);
  }
  .marketos-send-btn:hover:not(:disabled) {
    transform: scale(1.08);
    box-shadow: 0 5px 16px rgba(250,135,107,0.5);
  }
  .marketos-send-btn:disabled {
    background: #e8e8e8;
    cursor: not-allowed;
    color: #bbb;
    box-shadow: none;
  }
  .marketos-skip-btn {
    background: none;
    border: none;
    color: #bbb;
    font-size: 12px;
    cursor: pointer;
    text-align: left;
    padding: 0 4px;
    transition: color 0.15s;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  }
  .marketos-skip-btn:hover { color: #fa876b; }

  /* Responsive */
  @media (max-width: 480px) {
    .marketos-root { max-width: 100%; }
    .marketos-bubble-content { max-width: 88%; }
    .marketos-scenario-btn { font-size: 12px; padding: 8px 12px; }
    .marketos-header { padding: 12px 16px; }
    .marketos-messages { padding: 16px 14px; }
    .marketos-footer { padding: 12px 14px 18px; }
    .marketos-header-badge { display: none; }
  }
`;
