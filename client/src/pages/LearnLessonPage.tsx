import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes popIn { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
.lesson-page { font-family:'Inter','Segoe UI',system-ui,sans-serif; background:#0a0805; color:#f0ede8; min-height:100vh; }
.lesson-nav { display:flex; align-items:center; gap:12px; padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.06); max-width:800px; margin:0 auto; }
.back-btn { background:none; border:none; color:rgba(240,237,232,0.5); cursor:pointer; font-size:14px; font-family:inherit; display:flex; align-items:center; gap:6px; transition:color 0.2s; padding:0; }
.back-btn:hover { color:#f0ede8; }
.lesson-num-badge { background:rgba(255,61,46,0.15); color:#ff3d2e; font-size:12px; font-weight:700; padding:4px 12px; border-radius:100px; }
.lesson-body { max-width:720px; margin:0 auto; padding:40px 24px 80px; animation:fadeUp 0.5s ease; }
.lesson-title { font-size:clamp(26px,5vw,44px); font-weight:900; line-height:1.15; margin-bottom:16px; }
.lesson-title span { color:#ff3d2e; }
.lesson-intro { font-size:17px; color:rgba(240,237,232,0.7); line-height:1.7; margin-bottom:40px; }
.lesson-section { margin-bottom:40px; }
.lesson-section h2 { font-size:22px; font-weight:800; margin-bottom:16px; color:#f0ede8; }
.lesson-section h3 { font-size:18px; font-weight:700; margin-bottom:12px; color:rgba(240,237,232,0.9); }
.lesson-section p { font-size:16px; line-height:1.75; color:rgba(240,237,232,0.75); margin-bottom:16px; }
.lesson-section ul { padding-left:20px; margin-bottom:16px; }
.lesson-section li { font-size:16px; line-height:1.75; color:rgba(240,237,232,0.75); margin-bottom:8px; }
.quote-block { background:rgba(255,61,46,0.08); border-left:3px solid #ff3d2e; padding:16px 20px; border-radius:0 12px 12px 0; margin:24px 0; font-style:italic; font-size:16px; color:rgba(240,237,232,0.85); }
.example-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:20px 24px; margin:20px 0; }
.example-card .tag { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#ff3d2e; margin-bottom:8px; }
.fun-fact { background:linear-gradient(135deg,rgba(255,200,0,0.08),rgba(255,150,0,0.04)); border:1px solid rgba(255,200,0,0.2); border-radius:16px; padding:20px 24px; margin:24px 0; }
.fun-fact .emoji { font-size:24px; margin-bottom:8px; display:block; }
.divider { height:1px; background:rgba(255,255,255,0.06); margin:40px 0; }

/* Task styles */
.task-block { background:rgba(255,255,255,0.03); border:1.5px solid rgba(255,61,46,0.2); border-radius:20px; padding:28px; margin-top:40px; }
.task-header { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
.task-icon { width:40px; height:40px; background:rgba(255,61,46,0.15); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.task-header h3 { font-size:18px; font-weight:800; }
.task-header p { font-size:13px; color:rgba(240,237,232,0.5); margin-top:2px; }
.task-question { font-size:16px; font-weight:600; margin-bottom:20px; line-height:1.5; }
.task-options { display:grid; gap:10px; }
.task-option { background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); border-radius:14px; padding:14px 18px; cursor:pointer; transition:all 0.2s; font-size:15px; font-family:inherit; color:#f0ede8; text-align:left; }
.task-option:hover:not(:disabled) { border-color:rgba(255,61,46,0.4); background:rgba(255,61,46,0.06); }
.task-option.correct { border-color:#22c55e; background:rgba(34,197,94,0.1); color:#22c55e; animation:popIn 0.4s ease; }
.task-option.wrong { border-color:#ef4444; background:rgba(239,68,68,0.1); color:#ef4444; animation:shake 0.4s ease; }
.task-option.dimmed { opacity:0.4; }
.task-option:disabled { cursor:default; }
.task-result { margin-top:20px; padding:16px 20px; border-radius:14px; font-size:15px; line-height:1.6; }
.task-result.success { background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.25); color:#86efac; }
.task-result.fail { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); color:#fca5a5; }

/* Drag task */
.drag-container { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px; }
.drag-item { background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.12); border-radius:10px; padding:10px 16px; cursor:grab; font-size:14px; font-weight:600; transition:all 0.2s; user-select:none; }
.drag-item:hover { border-color:rgba(255,61,46,0.4); background:rgba(255,61,46,0.08); }
.drag-item.placed { opacity:0.4; cursor:default; }
.drop-zones { display:grid; gap:10px; }
.drop-zone { background:rgba(255,255,255,0.02); border:1.5px dashed rgba(255,255,255,0.15); border-radius:12px; padding:12px 16px; min-height:48px; display:flex; align-items:center; gap:10px; transition:all 0.2s; }
.drop-zone.filled { border-style:solid; border-color:rgba(255,61,46,0.3); background:rgba(255,61,46,0.05); }
.drop-zone.correct-zone { border-color:#22c55e; background:rgba(34,197,94,0.08); }
.drop-zone.wrong-zone { border-color:#ef4444; background:rgba(239,68,68,0.08); }
.zone-label { font-size:13px; color:rgba(240,237,232,0.4); }
.zone-value { font-size:14px; font-weight:600; color:#f0ede8; }

/* Check task */
.check-options { display:grid; gap:10px; }
.check-option { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); border-radius:14px; padding:14px 18px; cursor:pointer; transition:all 0.2s; }
.check-option:hover:not(.disabled) { border-color:rgba(255,61,46,0.3); }
.check-option.selected { border-color:rgba(255,61,46,0.5); background:rgba(255,61,46,0.08); }
.check-option.disabled { cursor:default; }
.check-box { width:20px; height:20px; border-radius:6px; border:2px solid rgba(255,255,255,0.2); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
.check-option.selected .check-box { background:#ff3d2e; border-color:#ff3d2e; }
.check-option.correct-check { border-color:#22c55e; background:rgba(34,197,94,0.08); }
.check-option.wrong-check { border-color:#ef4444; background:rgba(239,68,68,0.08); }

.task-btn { background:#ff3d2e; color:#fff; border:none; border-radius:12px; font-family:inherit; font-weight:700; font-size:15px; padding:14px 28px; cursor:pointer; transition:all 0.2s; margin-top:16px; }
.task-btn:hover:not(:disabled) { background:#e8261a; transform:translateY(-1px); }
.task-btn:disabled { opacity:0.5; cursor:not-allowed; }
.task-btn-secondary { background:transparent; color:rgba(240,237,232,0.6); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; font-family:inherit; font-weight:600; font-size:14px; padding:12px 24px; cursor:pointer; transition:all 0.2s; margin-top:12px; margin-left:12px; }
.task-btn-secondary:hover { border-color:rgba(255,255,255,0.25); color:#f0ede8; }

.next-lesson-btn { display:block; width:100%; background:#ff3d2e; color:#fff; border:none; border-radius:16px; font-family:inherit; font-weight:800; font-size:17px; padding:20px; cursor:pointer; transition:all 0.2s; margin-top:32px; text-align:center; }
.next-lesson-btn:hover { background:#e8261a; transform:translateY(-2px); box-shadow:0 10px 32px rgba(255,61,46,0.4); }
.completion-badge { text-align:center; padding:32px; background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2); border-radius:20px; margin-top:32px; animation:popIn 0.5s ease; }
.completion-badge .big-emoji { font-size:48px; display:block; margin-bottom:12px; }
.completion-badge h3 { font-size:22px; font-weight:800; color:#22c55e; margin-bottom:8px; }
.completion-badge p { color:rgba(240,237,232,0.6); font-size:15px; }
`;

// ─── Lesson content ─────────────────────────────────────────────────────────

interface TaskOption { id: string; text: string; correct?: boolean; }
interface Task {
  type: "single" | "multi" | "sort";
  question: string;
  options: TaskOption[];
  explanation: string;
  zones?: string[];
}

interface LessonData {
  id: number;
  title: string;
  titleHighlight?: string;
  intro: string;
  sections: Array<{ type: "text" | "quote" | "example" | "funfact"; content: string; label?: string }>;
  task: Task;
}

const LESSONS_DATA: Record<number, LessonData> = {
  1: {
    id: 1,
    title: "Что такое маркетинг и почему все",
    titleHighlight: "делают это неправильно",
    intro: "Маркетинг — это не «красивые картинки в Instagram». Это система управления вниманием людей. И те, кто понял это первыми, изменили мир. Поехали разбираться.",
    sections: [
      { type: "text", content: "**Котлер** сказал: «Маркетинг — это искусство и наука выбора целевых рынков и удержания клиентов через создание, поставку и продвижение превосходной ценности». Звучит скучно? Это потому что он профессор. Но смысл золотой: маркетинг начинается с понимания, *кому* и *зачем* нужен ваш продукт." },
      { type: "quote", content: "«Хороший маркетинг делает продажи ненужными» — Питер Друкер" },
      { type: "text", content: "**Дэвид Огилви** — рекламщик, которого называют «отцом рекламы» — говорил проще: потребитель не идиот. Он ваша жена. Уважайте его интеллект. Огилви написал объявления, которые продавали Rolls-Royce, Dove и Hathaway. Его секрет? Он изучал людей, а не придумывал слоганы." },
      { type: "example", label: "Кейс", content: "**Apple 1984**: Один ролик на Суперкубке. Никакого продукта в кадре. Только метафора — «Мы против IBM». Результат: очередь на Macintosh на следующий день. Это маркетинг." },
      { type: "funfact", content: "🤯 Dollar Shave Club потратил $4500 на видео «Our Blades Are F***ing Great». Видео набрало 12 млн просмотров за 48 часов. Через 5 лет Unilever купил компанию за $1 млрд. Маркетинг, Карл." },
      { type: "text", content: "**Бернбах** из DDB придумал «Думай иначе» задолго до Apple. Его принцип: реклама должна удивлять. Если вы говорите то же самое что все — вас не слышат. Volkswagen Beetle в 1960-х продавали как «маленькую некрасивую машину» — и это сработало, потому что все продавали «большие красивые»." },
      { type: "text", content: "**Итог урока**: Маркетинг — это не бюджет. Это понимание людей + правильное сообщение + правильный момент. Котлер, Огилви, Бернбах — все трое начинали с вопроса «Кто мой клиент и что он хочет на самом деле?»" },
    ],
    task: {
      type: "single",
      question: "Компания продаёт онлайн-курсы по программированию. Какой подход — настоящий маркетинг?",
      options: [
        { id: "a", text: "Запустить рекламу «Лучшие курсы по Python! Скидка 50%!»", correct: false },
        { id: "b", text: "Выяснить, что целевая аудитория — люди 25–35 лет, которые хотят сменить профессию, и показать им истории успеха таких же людей", correct: true },
        { id: "c", text: "Сделать красивый сайт с анимациями и нанять SMM-щика", correct: false },
        { id: "d", text: "Снизить цену до минимума и обогнать конкурентов", correct: false },
      ],
      explanation: "Правильный ответ — Б. Настоящий маркетинг начинается с понимания аудитории: кто эти люди, чего они хотят, чего боятся. Только потом — сообщение и канал. Котлер называл это «ориентацией на потребителя».",
    },
  },
  2: {
    id: 2,
    title: "Контент-маркетинг:",
    titleHighlight: "смыслы и копирайтинг",
    intro: "Каждый день люди видят 6000–10000 рекламных сообщений. Ваш текст — один из них. Как сделать так, чтобы его не только заметили, но и прочитали до конца? Разбираемся.",
    sections: [
      { type: "text", content: "**Главный принцип**: Пиши как говоришь. Сокращай вдвое. Звучит просто — работает магически. Большинство корпоративных текстов написаны так, будто их создавал робот в пиджаке. «Осуществляем комплексный подход к реализации маркетинговых коммуникаций» — что это вообще значит?" },
      { type: "quote", content: "«Если бы у меня было больше времени, я написал бы более короткое письмо» — Блез Паскаль, 1657 год. Актуально до сих пор." },
      { type: "text", content: "**Смыслы важнее слов**. Прежде чем писать — ответьте на три вопроса: 1) Кто читает? 2) Что они хотят получить? 3) Почему должны верить именно вам? Без ответов на эти вопросы любой текст — это просто слова." },
      { type: "example", label: "До / После", content: "**ДО**: «Наша компания предоставляет высококачественные услуги в сфере digital-маркетинга с использованием передовых технологий»\n\n**ПОСЛЕ**: «Мы запускаем рекламу, которая окупается. Средний ROMI наших клиентов — 340%»\n\nЧувствуете разницу? Второй вариант говорит о результате, а не о себе." },
      { type: "text", content: "**Формула ПИШИ-СОКРАЩАЙ**: Напишите всё что хотите сказать → Уберите половину → Уберите ещё треть → Оставьте только то, без чего смысл теряется. Это больно. Но это работает." },
      { type: "funfact", content: "📊 Исследование Nielsen: люди читают в интернете F-образно. Первые строки — полностью. Потом — только начала абзацев. Потом — ничего. Вывод: самое важное — в первых двух предложениях." },
      { type: "text", content: "**Три типа контента, которые работают**: 1) Образовательный — учит чему-то полезному (как этот курс). 2) Развлекательный — вызывает эмоцию. 3) Вдохновляющий — показывает что возможно. Продающий контент работает только когда вы уже завоевали доверие первыми тремя." },
    ],
    task: {
      type: "multi",
      question: "Выберите ВСЕ признаки хорошего маркетингового текста:",
      options: [
        { id: "a", text: "Написан простым языком, без канцелярита", correct: true },
        { id: "b", text: "Содержит много профессиональных терминов — это показывает экспертность", correct: false },
        { id: "c", text: "Говорит о выгодах для читателя, а не о характеристиках продукта", correct: true },
        { id: "d", text: "Начинается с самого важного", correct: true },
        { id: "e", text: "Максимально длинный — чем больше информации, тем лучше", correct: false },
      ],
      explanation: "Хороший текст: простой язык (А), фокус на выгодах (В), важное — в начале (Г). Термины без объяснений отталкивают, а длина ради длины — убивает конверсию.",
    },
  },
  3: {
    id: 3,
    title: "Юнит-экономика:",
    titleHighlight: "считаем деньги любого проекта",
    intro: "Маркетинг без цифр — это искусство. Маркетинг с цифрами — это бизнес. Разбираемся с тремя метриками, которые должен знать каждый маркетолог наизусть.",
    sections: [
      { type: "text", content: "**CAC (Customer Acquisition Cost)** — стоимость привлечения одного клиента. Формула: всё что потратили на маркетинг ÷ количество новых клиентов. Если потратили 100 000₽ и получили 50 клиентов — CAC = 2000₽." },
      { type: "text", content: "**LTV (Lifetime Value)** — сколько денег клиент принесёт за всё время. Формула: средний чек × частота покупок × срок жизни клиента. Если клиент покупает раз в месяц на 1000₽ и остаётся с вами 2 года — LTV = 24 000₽." },
      { type: "quote", content: "«Если LTV > CAC — бизнес работает. Если CAC > LTV — бизнес умирает, просто ещё не знает об этом»" },
      { type: "example", label: "Пример расчёта", content: "**Онлайн-школа йоги**:\n• Стоимость рекламы в месяц: 50 000₽\n• Новых клиентов: 25\n• CAC = 50 000 / 25 = **2 000₽**\n\n• Абонемент: 3 000₽/мес\n• Средний клиент остаётся 8 месяцев\n• LTV = 3 000 × 8 = **24 000₽**\n\n• LTV/CAC = 12 — отличный показатель! (норма — от 3)" },
      { type: "text", content: "**ROMI (Return on Marketing Investment)** — возврат на маркетинговые инвестиции. Формула: (Прибыль от маркетинга − Затраты на маркетинг) / Затраты × 100%. Если вложили 100 000₽ и заработали 400 000₽ — ROMI = 300%." },
      { type: "funfact", content: "💡 По данным HubSpot, компании которые считают ROI маркетинга, в 1.6 раза чаще получают бюджет на следующий год. Цифры — это не скучно. Это власть." },
      { type: "text", content: "**Зачем маркетологу это знать?** Потому что без этих цифр вы не можете обосновать бюджет, доказать эффективность своей работы или принять решение — масштабировать канал или отключить. Маркетолог который умеет считать — стоит в 2–3 раза дороже того, кто только «делает контент»." },
    ],
    task: {
      type: "sort",
      question: "Расставьте формулы в правильные ячейки:",
      options: [
        { id: "cac", text: "Затраты на маркетинг ÷ Число клиентов" },
        { id: "ltv", text: "Чек × Частота × Срок жизни" },
        { id: "romi", text: "(Прибыль − Затраты) / Затраты × 100%" },
      ],
      zones: ["CAC", "LTV", "ROMI"],
      explanation: "CAC = Затраты ÷ Клиенты. LTV = Чек × Частота × Срок. ROMI = (Прибыль − Затраты) / Затраты × 100%. Эти три формулы — основа разговора с любым CEO или инвестором.",
    },
  },
  4: {
    id: 4,
    title: "Что хочет заказчик и",
    titleHighlight: "как стоить дорого",
    intro: "Почему одни маркетологи получают 50 000₽, а другие — 250 000₽ за одну и ту же работу? Дело не в навыках. Дело в понимании того, что на самом деле покупает заказчик.",
    sections: [
      { type: "text", content: "**Заказчик покупает не маркетинг — он покупает спокойствие**. Когда CEO нанимает маркетолога, он думает: 'Этот человек решит мою проблему и я не буду об этом думать'. Ваша задача — продавать именно это ощущение, а не часы работы или количество постов." },
      { type: "quote", content: "«Люди не покупают дрели. Они покупают дырки в стенах» — Теодор Левитт, Гарвардская школа бизнеса" },
      { type: "text", content: "**Три типа заказчиков**: 1) Хочет результат — говорите только цифрами: конверсия, CAC, ROMI. 2) Хочет процесс — показывайте как работаете: отчёты, встречи, прозрачность. 3) Хочет статус — покажите портфолио крутых клиентов, упоминания в СМИ. Определите тип — и говорите на его языке." },
      { type: "example", label: "Как поднять чек", content: "**Дешёвый вариант**: 'Я веду Instagram за 30 000₽ в месяц'\n\n**Дорогой вариант**: 'Я выстраиваю систему привлечения клиентов через контент. За 6 месяцев работы с похожим проектом мы снизили CAC с 1800₽ до 650₽. Стоимость — 90 000₽ в месяц'\n\nОдна и та же работа. Разный фрейм. Разный чек." },
      { type: "funfact", content: "💰 По данным исследования Hinge Marketing, специалисты которые умеют говорить о ROI своей работы, зарабатывают в среднем на 73% больше тех, кто описывает работу через процессы." },
      { type: "text", content: "**Формула дорогого предложения**: Проблема заказчика → Ваш метод решения → Доказательство что работает (кейс) → Результат в цифрах → Цена. Никогда не называйте цену раньше, чем покажете ценность." },
    ],
    task: {
      type: "single",
      question: "Заказчик говорит: 'Хочу больше подписчиков в Instagram'. Что на самом деле он хочет?",
      options: [
        { id: "a", text: "Именно подписчиков — надо запустить конкурс и гивэвей", correct: false },
        { id: "b", text: "Скорее всего — больше клиентов или узнаваемость бренда. Нужно уточнить цель", correct: true },
        { id: "c", text: "Красивый профиль с единым стилем", correct: false },
        { id: "d", text: "Он сам знает что хочет, просто делайте что говорят", correct: false },
      ],
      explanation: "Правильный ответ — Б. Подписчики — это инструмент, а не цель. Настоящая цель — клиенты, продажи, узнаваемость. Маркетолог который понимает это — задаёт правильные вопросы и предлагает правильные решения.",
    },
  },
  5: {
    id: 5,
    title: "Продающий лендинг",
    titleHighlight: "с нуля",
    intro: "Лендинг — это не сайт. Это продавец, который работает 24/7 без выходных и не просит повышения. Разбираем анатомию страницы, которая конвертирует.",
    sections: [
      { type: "text", content: "**Первый экран решает всё**. У вас есть 3–5 секунд чтобы ответить на вопрос посетителя: 'Это для меня? Это решит мою проблему?' Формула первого экрана: Заголовок (что вы делаете) + Подзаголовок (для кого и какой результат) + CTA (одно действие). Всё остальное — детали." },
      { type: "example", label: "Плохо vs Хорошо", content: "**ПЛОХО**: 'Добро пожаловать на наш сайт! Мы — команда профессионалов с 10-летним опытом'\n\n**ХОРОШО**: 'Запускаем вебинары которые окупаются. Средний ROMI клиентов — 340%. Оставьте заявку — разберём ваш проект бесплатно'" },
      { type: "text", content: "**Структура продающего лендинга** (формула AIDA на практике): 1) Боль/проблема — покажите что понимаете ситуацию клиента. 2) Решение — ваш продукт как ответ на эту боль. 3) Доказательства — кейсы, цифры, отзывы. 4) Оффер — что конкретно получит клиент. 5) CTA — одно чёткое действие." },
      { type: "quote", content: "«Если на лендинге два CTA — у пользователя паралич выбора. Один CTA — одно решение» — принцип Хика" },
      { type: "funfact", content: "📈 По данным Unbounce, лендинги с одним CTA конвертируют на 266% лучше, чем страницы с несколькими призывами к действию. Меньше — значит больше." },
      { type: "text", content: "**Социальное доказательство** — самый недооценённый элемент. Один реальный кейс с цифрами работает лучше, чем 10 красивых отзывов. Формат: Проблема клиента → Что сделали → Результат в цифрах за конкретный период." },
    ],
    task: {
      type: "multi",
      question: "Какие элементы ОБЯЗАТЕЛЬНО должны быть на первом экране лендинга?",
      options: [
        { id: "a", text: "Чёткий заголовок — что вы делаете", correct: true },
        { id: "b", text: "История компании с 2010 года", correct: false },
        { id: "c", text: "Один призыв к действию (CTA)", correct: true },
        { id: "d", text: "Для кого это и какой результат", correct: true },
        { id: "e", text: "Полный прайс-лист со всеми тарифами", correct: false },
      ],
      explanation: "Первый экран: заголовок (что делаете), подзаголовок (для кого и результат), один CTA. История компании и прайс — это для других блоков. Первый экран должен захватить внимание и дать одно действие.",
    },
  },
  6: {
    id: 6,
    title: "Лиды и квалификация:",
    titleHighlight: "работа с отделом продаж",
    intro: "Маркетолог привёл лиды — продажники говорят что они некачественные. Продажники закрыли сделки — маркетолог говорит что это его заслуга. Знакомо? Разбираемся как прекратить эту войну.",
    sections: [
      { type: "text", content: "**MQL vs SQL** — главное различие: MQL (Marketing Qualified Lead) — человек проявил интерес (скачал материал, подписался, оставил email). SQL (Sales Qualified Lead) — человек готов к разговору о покупке (запросил КП, задал вопрос о цене, записался на демо). Маркетинг отвечает за MQL, продажи — за конверсию MQL в SQL и дальше." },
      { type: "quote", content: "«Маркетинг и продажи должны договориться об одном: что такое 'хороший лид'. Без этого договора — вечная война» — Siriusdeckisions Research" },
      { type: "example", label: "SLA между маркетингом и продажами", content: "**Маркетинг обязуется**: передавать X лидов в месяц с CAC не выше Y₽, квалифицированных по критериям [должность, размер компании, бюджет]\n\n**Продажи обязуются**: обрабатывать каждый лид в течение 2 часов, давать обратную связь по качеству лидов еженедельно\n\nЭто называется SLA (Service Level Agreement) — и это меняет всё." },
      { type: "text", content: "**Лид-скоринг** — система оценки лидов по баллам. Посмотрел страницу цен — +10 баллов. Скачал кейс — +15. Открыл 3 письма подряд — +20. Набрал 50 баллов — передаём в продажи. Это автоматизирует квалификацию и убирает субъективность." },
      { type: "funfact", content: "⚡ По данным InsideSales, если перезвонить лиду в течение 5 минут — вероятность конверсии в 100 раз выше, чем если позвонить через 30 минут. Маркетолог который знает это — требует от продаж SLA по времени обработки." },
      { type: "text", content: "**Что ещё входит в зону ответственности маркетолога**: удержание клиентов (retention), реактивация ушедших клиентов, upsell через email-маркетинг, NPS-опросы. Маркетинг — это не только привлечение. Это весь жизненный цикл клиента." },
    ],
    task: {
      type: "sort",
      question: "Распределите действия по этапам воронки:",
      options: [
        { id: "mql", text: "Скачал бесплатный чеклист" },
        { id: "sql", text: "Запросил коммерческое предложение" },
        { id: "close", text: "Подписал договор и оплатил" },
      ],
      zones: ["MQL", "SQL", "CLOSE"],
      explanation: "MQL = проявил интерес (скачал материал). SQL = готов к покупке (запросил КП). CLOSE = стал клиентом. Маркетинг отвечает за MQL, продажи — за SQL→CLOSE. Вместе — за всю воронку.",
    },
  },
  7: {
    id: 7,
    title: "Вебинарная воронка:",
    titleHighlight: "от трафика до оплаты за 7 дней",
    intro: "Вебинар — это не просто онлайн-лекция. Это самый конвертирующий инструмент в EdTech и B2B. Разбираем схему которая работает в 2025 году.",
    sections: [
      { type: "text", content: "**Классическая вебинарная воронка**: Трафик (реклама/органика) → Лендинг регистрации → Серия прогревочных писем (3–5 дней) → Вебинар → Оффер на вебинаре → Серия дожимных писем → Продажа. Каждый этап имеет свою метрику и своё узкое место." },
      { type: "example", label: "Цифры нормальной воронки", content: "• Конверсия лендинга регистрации: 25–40%\n• Доходимость до вебинара: 20–35% от зарегистрировавшихся\n• Конверсия в покупку на вебинаре: 3–8%\n• Конверсия дожимной серии: +1–3%\n\nПример: 1000 кликов → 300 регистраций → 90 дошли → 5 купили на вебинаре + 3 после серии = 8 продаж" },
      { type: "text", content: "**Прогрев — это не спам**. Прогревочная серия писем должна давать ценность до вебинара: инсайт, кейс, провокационный вопрос. Цель — чтобы человек пришёл на вебинар уже 'тёплым', доверяющим вам. Письма которые только напоминают 'не забудьте прийти' — убивают доходимость." },
      { type: "quote", content: "«Продажа на вебинаре — это не продажа. Это логичное завершение трансформации которую вы начали в прогреве» — Рассел Брансон, ClickFunnels" },
      { type: "funfact", content: "🎯 По данным агентства Гипотеза: вебинары с интерактивными элементами (опросы, Q&A, задания) показывают доходимость на 40% выше и конверсию в продажу на 25% выше, чем монологовые форматы." },
      { type: "text", content: "**Автовебинар** — следующий уровень. Записанный вебинар который 'идёт' по расписанию. Позволяет масштабировать воронку без вашего присутствия. Минус: ниже конверсия (люди чувствуют запись). Плюс: работает 24/7. Оптимально — живые вебинары для запуска, автовебинар для постоянного потока." },
    ],
    task: {
      type: "single",
      question: "Из 500 человек зарегистрировалось на вебинар. Доходимость 30%, конверсия в покупку 5%. Сколько продаж?",
      options: [
        { id: "a", text: "25 продаж", correct: false },
        { id: "b", text: "7–8 продаж", correct: true },
        { id: "c", text: "15 продаж", correct: false },
        { id: "d", text: "150 продаж", correct: false },
      ],
      explanation: "500 × 30% = 150 дошли до вебинара. 150 × 5% = 7.5 продаж. Правильный ответ — 7–8. Именно поэтому важно работать над каждым этапом воронки: даже небольшое улучшение доходимости или конверсии даёт значительный прирост продаж.",
    },
  },
  8: {
    id: 8,
    title: "Стратегия в маркетинге:",
    titleHighlight: "как думать на год вперёд",
    intro: "Большинство маркетологов живут в режиме 'что делаем на этой неделе'. Стратег думает иначе: где мы хотим быть через год и какие действия туда ведут. Разбираем разницу.",
    sections: [
      { type: "text", content: "**Стратегия vs тактика**: Стратегия — это 'куда идём и почему'. Тактика — 'как именно идём'. Ошибка большинства: они отличные тактики (умеют запускать рекламу, писать посты) но не умеют связать это с бизнес-целью. Маркетолог-стратег начинает с вопроса: какой результат нужен бизнесу через 12 месяцев?" },
      { type: "example", label: "Структура маркетинговой стратегии", content: "1. **Цель**: +200 клиентов за год, выручка 24 млн₽\n2. **Аудитория**: кто наш идеальный клиент (ICP)\n3. **Позиционирование**: чем мы отличаемся от конкурентов\n4. **Каналы**: где живёт наша аудитория\n5. **Контент-план**: какие смыслы транслируем\n6. **Бюджет**: сколько тратим и на что\n7. **Метрики**: как измеряем успех" },
      { type: "text", content: "**ICP (Ideal Customer Profile)** — портрет идеального клиента. Не 'мужчины 25–45 лет', а конкретно: 'Основатель EdTech-компании, 30–45 лет, выручка 10–100 млн₽, уже пробовал запускать вебинары но не окупились, хочет систему а не разовую помощь'. Чем точнее ICP — тем эффективнее каждый рубль маркетинга." },
      { type: "quote", content: "«Стратегия без тактики — мечта. Тактика без стратегии — суета перед поражением» — Сунь Цзы (и это актуально для маркетинга)" },
      { type: "funfact", content: "📊 По данным CoSchedule, маркетологи которые документируют стратегию, в 313% раз чаще сообщают об успехе, чем те кто работает 'по наитию'. Записанная стратегия — не бюрократия. Это конкурентное преимущество." },
      { type: "text", content: "**Как строить стратегию**: 1) Аудит текущего состояния (что работает, что нет). 2) Анализ конкурентов (где они слабы). 3) Определение ICP. 4) Выбор 2–3 ключевых канала (не 10). 5) Контент-стратегия под каждый канал. 6) KPI на квартал. 7) Ревью каждые 30 дней. Стратегия — это живой документ, не манифест на стену." },
    ],
    task: {
      type: "multi",
      question: "Что входит в маркетинговую стратегию? Выберите все правильные варианты:",
      options: [
        { id: "a", text: "Портрет идеального клиента (ICP)", correct: true },
        { id: "b", text: "Список постов на следующую неделю", correct: false },
        { id: "c", text: "Позиционирование и отличие от конкурентов", correct: true },
        { id: "d", text: "Метрики успеха и KPI", correct: true },
        { id: "e", text: "Выбор каналов продвижения", correct: true },
      ],
      explanation: "Стратегия включает: ICP, позиционирование, метрики, каналы. Список постов — это тактика (контент-план), а не стратегия. Стратегия отвечает на 'что и почему', тактика — на 'как и когда'.",
    },
  },
  9: {
    id: 9,
    title: "Нейросети и вайб-кодинг",
    titleHighlight: "в маркетинге",
    intro: "2025 год. Маркетолог без AI — как дизайнер без Photoshop в 2010-м. Разбираем инструменты которые умножают вашу скорость в 10 раз и не требуют технического образования.",
    sections: [
      { type: "text", content: "**ChatGPT / Claude** — ваш первый помощник. Что умеет: писать тексты, генерировать идеи для контента, анализировать конкурентов, составлять стратегии, отвечать на возражения. Главный навык — промпт-инжиниринг: чем точнее задание, тем лучше результат. Правило: дайте контекст + роль + задачу + формат ответа." },
      { type: "example", label: "Пример промпта", content: "**Плохой промпт**: 'Напиши пост про маркетинг'\n\n**Хороший промпт**: 'Ты — маркетолог с 10-летним опытом в EdTech. Напиши пост для LinkedIn от лица основателя агентства. Тема: почему большинство вебинаров не окупаются. Тон: экспертный, с юмором. Длина: 150–200 слов. Закончи вопросом к аудитории'" },
      { type: "text", content: "**Midjourney / DALL-E** — генерация изображений. Создаёт обложки для статей, иллюстрации для презентаций, варианты баннеров за минуты. Раньше это стоило 5000–15000₽ за дизайнера. Теперь — включено в подписку." },
      { type: "text", content: "**Вайб-кодинг** — создание сайтов, лендингов и инструментов без знания кода. Cursor, Bolt, v0 — вы описываете что хотите на русском языке, AI пишет код. Маркетолог который умеет это — может за 2 часа создать лендинг, который раньше требовал разработчика на неделю." },
      { type: "funfact", content: "🚀 По данным McKinsey, маркетологи использующие AI-инструменты выполняют задачи на 40–60% быстрее. Это не замена маркетолога — это суперсила. Те кто освоит AI сейчас — будут стоить в 2–3 раза дороже через год." },
      { type: "text", content: "**Практический стек 2025**: ChatGPT/Claude (тексты и стратегия) + Midjourney (визуал) + Cursor/Bolt (лендинги без кода) + Make/n8n (автоматизация рутины) + Perplexity (исследования). Освоить базово — 2–4 недели. Окупается с первого проекта." },
    ],
    task: {
      type: "single",
      question: "Какой промпт даст лучший результат от ChatGPT?",
      options: [
        { id: "a", text: "'Напиши текст для рекламы'", correct: false },
        { id: "b", text: "'Ты — копирайтер с опытом в B2B SaaS. Напиши заголовок для лендинга CRM-системы для малого бизнеса. Главная боль клиента: теряет лиды из-за хаоса в Excel. Дай 5 вариантов заголовка'", correct: true },
        { id: "c", text: "'Помоги с маркетингом'", correct: false },
        { id: "d", text: "'Сделай хороший текст'", correct: false },
      ],
      explanation: "Правильный ответ — Б. Хороший промпт содержит: роль (копирайтер в B2B SaaS), задачу (заголовок лендинга), контекст (CRM для малого бизнеса, боль — хаос в Excel), формат (5 вариантов). Чем точнее промпт — тем полезнее ответ.",
    },
  },
  10: {
    id: 10,
    title: "Итоговый урок:",
    titleHighlight: "ты маркетолог или ещё нет?",
    intro: "Вы прошли 9 уроков. Котлер, юнит-экономика, лендинги, воронки, AI. Теперь финальный тест — проверим всё сразу. Без паники: это не экзамен, это зеркало.",
    sections: [
      { type: "text", content: "**Что вы узнали за этот курс**: Маркетинг — это система управления вниманием (урок 1). Тексты работают когда говорят о выгодах читателя (урок 2). Без цифр маркетинг — это просто мнение (урок 3). Заказчик покупает результат, а не процесс (урок 4). Лендинг — это продавец 24/7 (урок 5). Маркетинг и продажи — одна команда (урок 6). Вебинар — самый конвертирующий инструмент (урок 7). Стратегия — это не план, это система принятия решений (урок 8). AI — суперсила маркетолога 2025 года (урок 9)." },
      { type: "quote", content: "«Маркетинг — это не то что вы делаете с продуктом. Это то что вы делаете с умом потребителя» — Эл Райс" },
      { type: "funfact", content: "🎓 Вы прошли курс который большинство маркетологов не проходит никогда. Они учатся на ошибках клиентов. Вы — на опыте агентства которое запустило 200+ проектов. Это ваше конкурентное преимущество." },
      { type: "text", content: "**Что дальше**: 1) Примените одну вещь из курса на реальном проекте — сегодня. 2) Посчитайте юнит-экономику любого бизнеса вокруг вас. 3) Напишите один текст по формуле 'пиши как говоришь, сокращай вдвое'. 4) Попробуйте вайб-кодинг — создайте простой лендинг за вечер. Знания без действия — это просто информация." },
      { type: "text", content: "**Сертификат**: После прохождения финального теста вы получите сертификат от агентства Гипотеза. Это не просто бумажка — это подтверждение что вы понимаете маркетинг на уровне практиков, а не теоретиков. Добавьте в LinkedIn. Покажите на следующем собеседовании." },
    ],
    task: {
      type: "multi",
      question: "Финальный тест: выберите ВСЕ верные утверждения о маркетинге:",
      options: [
        { id: "a", text: "LTV должен быть больше CAC для прибыльного бизнеса", correct: true },
        { id: "b", text: "Больше CTA на лендинге = лучше конверсия", correct: false },
        { id: "c", text: "Маркетолог отвечает за MQL, продажи — за конверсию в сделку", correct: true },
        { id: "d", text: "Хороший промпт для AI содержит роль, задачу, контекст и формат", correct: true },
        { id: "e", text: "Стратегия — это список постов на месяц", correct: false },
      ],
      explanation: "Верно: LTV>CAC (А), разделение MQL/SQL (В), структура промпта (Г). Неверно: больше CTA снижает конверсию (паралич выбора), стратегия — это система решений, а не контент-план.",
    },
  },
};

// Fallback for paid lessons
function PaidLessonContent({ id }: { id: number }) {
  const titles: Record<number, string> = {
    4: "Что хочет заказчик и как стоить дорого",
    5: "Продающий лендинг с нуля",
    6: "Лиды и квалификация",
    7: "Вебинарная воронка",
    8: "Стратегия в маркетинге",
    9: "Нейросети и вайб-кодинг",
    10: "Итоговый урок",
  };
  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
      <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "12px" }}>Урок {id}: {titles[id]}</h2>
      <p style={{ color: "rgba(240,237,232,0.5)", marginBottom: "32px" }}>Этот урок доступен в полной версии курса</p>
      <a href="/learn" style={{ background: "#ff3d2e", color: "#fff", padding: "16px 32px", borderRadius: "14px", textDecoration: "none", fontWeight: 700, fontSize: "16px" }}>
        Открыть полный курс — 5 000 ₽
      </a>
    </div>
  );
}

// ─── Task components ─────────────────────────────────────────────────────────

function SingleChoiceTask({ task, onComplete }: { task: Task; onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(id: string) {
    if (revealed) return;
    setSelected(id);
  }

  function handleCheck() {
    if (!selected) return;
    setRevealed(true);
    const correct = task.options.find((o) => o.id === selected)?.correct;
    if (correct) onComplete();
  }

  return (
    <div>
      <p className="task-question">{task.question}</p>
      <div className="task-options">
        {task.options.map((opt) => {
          let cls = "task-option";
          if (revealed) {
            if (opt.correct) cls += " correct";
            else if (opt.id === selected && !opt.correct) cls += " wrong";
            else cls += " dimmed";
          } else if (opt.id === selected) {
            cls += " task-option--selected";
          }
          return (
            <button
              key={opt.id}
              className={cls}
              onClick={() => handleSelect(opt.id)}
              disabled={revealed}
              style={!revealed && opt.id === selected ? { borderColor: "rgba(255,61,46,0.5)", background: "rgba(255,61,46,0.08)" } : {}}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
      {!revealed && (
        <button className="task-btn" onClick={handleCheck} disabled={!selected}>
          Проверить ответ
        </button>
      )}
      {revealed && (
        <div className={`task-result ${task.options.find((o) => o.id === selected)?.correct ? "success" : "fail"}`}>
          {task.options.find((o) => o.id === selected)?.correct ? "✅ " : "❌ "}
          {task.explanation}
        </div>
      )}
    </div>
  );
}

function MultiChoiceTask({ task, onComplete }: { task: Task; onComplete: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  function toggle(id: string) {
    if (revealed) return;
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function handleCheck() {
    if (selected.length === 0) return;
    setRevealed(true);
    const correctIds = task.options.filter((o) => o.correct).map((o) => o.id);
    const allCorrect = correctIds.every((id) => selected.includes(id)) && selected.every((id) => correctIds.includes(id));
    if (allCorrect) onComplete();
  }

  return (
    <div>
      <p className="task-question">{task.question}</p>
      <div className="check-options">
        {task.options.map((opt) => {
          let cls = "check-option";
          if (selected.includes(opt.id)) cls += " selected";
          if (revealed) {
            cls += " disabled";
            if (opt.correct) cls += " correct-check";
            else if (selected.includes(opt.id)) cls += " wrong-check";
          }
          return (
            <div key={opt.id} className={cls} onClick={() => toggle(opt.id)}>
              <div className="check-box">
                {selected.includes(opt.id) && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
              </div>
              <span style={{ fontSize: "15px" }}>{opt.text}</span>
            </div>
          );
        })}
      </div>
      {!revealed && (
        <button className="task-btn" onClick={handleCheck} disabled={selected.length === 0}>
          Проверить ответ
        </button>
      )}
      {revealed && (
        <div className={`task-result ${task.options.filter((o) => o.correct).every((o) => selected.includes(o.id)) ? "success" : "fail"}`}>
          {task.explanation}
        </div>
      )}
    </div>
  );
}

function SortTask({ task, onComplete }: { task: Task; onComplete: () => void }) {
  const zones = task.zones || [];
  const [placements, setPlacements] = useState<Record<string, string | null>>(
    Object.fromEntries(zones.map((z) => [z, null]))
  );
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correctMap: Record<string, string> = {};
  task.options.forEach((opt) => { correctMap[opt.id] = opt.id.toUpperCase(); });

  function handleDrop(zone: string) {
    if (!dragItem || revealed) return;
    setPlacements((prev) => {
      const next = { ...prev };
      // Remove from other zones
      Object.keys(next).forEach((z) => { if (next[z] === dragItem) next[z] = null; });
      next[zone] = dragItem;
      return next;
    });
    setDragItem(null);
  }

  function handleCheck() {
    setRevealed(true);
    // Check: CAC→cac, LTV→ltv, ROMI→romi
    const correct = zones.every((z) => placements[z] === z.toLowerCase());
    if (correct) onComplete();
  }

  const placedItems = Object.values(placements).filter(Boolean) as string[];
  const allFilled = zones.every((z) => placements[z] !== null);

  return (
    <div>
      <p className="task-question">{task.question}</p>
      <div className="drag-container">
        {task.options.map((opt) => (
          <div
            key={opt.id}
            className={`drag-item${placedItems.includes(opt.id) ? " placed" : ""}`}
            draggable={!placedItems.includes(opt.id) && !revealed}
            onDragStart={() => setDragItem(opt.id)}
            onClick={() => {
              if (revealed || placedItems.includes(opt.id)) return;
              setDragItem(dragItem === opt.id ? null : opt.id);
            }}
            style={dragItem === opt.id ? { borderColor: "#ff3d2e", background: "rgba(255,61,46,0.12)" } : {}}
          >
            {opt.text}
          </div>
        ))}
      </div>
      <div className="drop-zones">
        {zones.map((zone) => {
          const placed = placements[zone];
          const placedOpt = task.options.find((o) => o.id === placed);
          let cls = "drop-zone";
          if (placed) cls += " filled";
          if (revealed && placed) {
            cls += placed === zone.toLowerCase() ? " correct-zone" : " wrong-zone";
          }
          return (
            <div
              key={zone}
              className={cls}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(zone)}
              onClick={() => {
                if (dragItem && !revealed) handleDrop(zone);
                else if (placed && !revealed) {
                  setPlacements((prev) => ({ ...prev, [zone]: null }));
                }
              }}
            >
              <span className="zone-label">{zone} =</span>
              {placedOpt && <span className="zone-value">{placedOpt.text}</span>}
              {!placedOpt && <span style={{ color: "rgba(240,237,232,0.2)", fontSize: "13px" }}>Перетащите формулу сюда</span>}
            </div>
          );
        })}
      </div>
      {!revealed && (
        <button className="task-btn" onClick={handleCheck} disabled={!allFilled}>
          Проверить
        </button>
      )}
      {revealed && (
        <div className={`task-result ${zones.every((z) => placements[z] === z.toLowerCase()) ? "success" : "fail"}`}>
          {task.explanation}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LearnLessonPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const lessonId = parseInt(params.id || "1");
  const [token] = useState(() => localStorage.getItem("course_token"));
  const [isPaid, setIsPaid] = useState(false);
  const [taskDone, setTaskDone] = useState(false);
  const [lessonDone, setLessonDone] = useState(false);

  useEffect(() => {
    if (!token) { setLocation("/learn"); return; }
    fetch(`/api/course/me?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) { setLocation("/learn"); return; }
        setIsPaid(data.student.isPaid);
        const prog = data.progress.find((p: { lessonId: number; completed: boolean }) => p.lessonId === lessonId);
        if (prog?.completed) setLessonDone(true);
        if (prog?.taskCompleted) setTaskDone(true);
      });
  }, [lessonId]);

  async function markComplete(withTask = false) {
    if (!token) return;
    await fetch("/api/course/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, lessonId, taskCompleted: withTask }),
    });
    setLessonDone(true);
    if (withTask) setTaskDone(true);
  }

  function handleTaskComplete() {
    markComplete(true);
  }

  const lesson = LESSONS_DATA[lessonId];
  const isLocked = lessonId > 3 && !isPaid;

  const nextId = lessonId < 10 ? lessonId + 1 : null;
  const canAccessNext = nextId ? (nextId <= 3 || isPaid) : false;

  return (
    <>
      <style>{CSS}</style>
      <div className="lesson-page">
        <div className="lesson-nav">
          <button className="back-btn" onClick={() => setLocation("/learn")}>
            ← Все уроки
          </button>
          <span className="lesson-num-badge">Урок {lessonId}</span>
        </div>

        <div className="lesson-body">
          {isLocked ? (
            <PaidLessonContent id={lessonId} />
          ) : !lesson ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "rgba(240,237,232,0.5)" }}>Урок в разработке</p>
            </div>
          ) : (
            <>
              <h1 className="lesson-title">
                {lesson.title} <span>{lesson.titleHighlight}</span>
              </h1>
              <p className="lesson-intro">{lesson.intro}</p>

              {lesson.sections.map((sec, i) => {
                if (sec.type === "quote") return (
                  <div key={i} className="quote-block">{sec.content}</div>
                );
                if (sec.type === "example") return (
                  <div key={i} className="example-card">
                    <div className="tag">{sec.label || "Пример"}</div>
                    <div style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(240,237,232,0.8)", whiteSpace: "pre-line" }}>
                      {sec.content.split("**").map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                      )}
                    </div>
                  </div>
                );
                if (sec.type === "funfact") return (
                  <div key={i} className="fun-fact">
                    <div style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(240,237,232,0.8)" }}>{sec.content}</div>
                  </div>
                );
                // text
                return (
                  <div key={i} className="lesson-section">
                    <p>
                      {sec.content.split("**").map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                      )}
                    </p>
                  </div>
                );
              })}

              <div className="divider" />

              {/* Task */}
              <div className="task-block">
                <div className="task-header">
                  <div className="task-icon">🎯</div>
                  <div>
                    <h3>Практическое задание</h3>
                    <p>{taskDone ? "Выполнено ✓" : "Проверьте понимание"}</p>
                  </div>
                </div>

                {lesson.task.type === "single" && (
                  <SingleChoiceTask task={lesson.task} onComplete={handleTaskComplete} />
                )}
                {lesson.task.type === "multi" && (
                  <MultiChoiceTask task={lesson.task} onComplete={handleTaskComplete} />
                )}
                {lesson.task.type === "sort" && (
                  <SortTask task={lesson.task} onComplete={handleTaskComplete} />
                )}
              </div>

              {/* Completion */}
              {lessonDone && (
                <div className="completion-badge">
                  <span className="big-emoji">🏆</span>
                  <h3>Урок пройден!</h3>
                  <p>{taskDone ? "И задание выполнено — вы молодец" : "Попробуйте выполнить задание выше"}</p>
                </div>
              )}

              {!lessonDone && (
                <button className="next-lesson-btn" onClick={() => markComplete(false)}>
                  Отметить урок как пройденный →
                </button>
              )}

              {lessonDone && nextId && (
                canAccessNext ? (
                  <button className="next-lesson-btn" onClick={() => setLocation(`/learn/lesson/${nextId}`)}>
                    Следующий урок: {nextId} →
                  </button>
                ) : (
                  <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <p style={{ color: "rgba(240,237,232,0.5)", marginBottom: "16px" }}>Следующие уроки — в полной версии</p>
                    <button className="next-lesson-btn" onClick={() => setLocation("/learn/pay")}>
                      Открыть все уроки — 5 000 ₽
                    </button>
                  </div>
                )
              )}

              {lessonDone && !nextId && (
                <div className="completion-badge" style={{ marginTop: "32px" }}>
                  <span className="big-emoji">🎓</span>
                  <h3>Курс завершён!</h3>
                  <p>Вы прошли все уроки. Вы — маркетолог.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
