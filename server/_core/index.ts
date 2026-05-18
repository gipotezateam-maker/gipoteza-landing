import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { invokeLLM } from "./llm";
import { parsePresentationFromText, generatePresentationPDF } from "../marketos-pdf";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // MarketOS Presentation PDF endpoint
  app.post("/api/marketos/presentation", async (req, res) => {
    try {
      const { topic, details } = req.body;
      if (!topic) return res.status(400).json({ error: "topic required" });

      const systemPrompt = `Ты — Маркетос, профессиональный маркетинговый помощник.
Создай структурированную презентацию на тему: "${topic}".
Дополнительные детали: ${details || "нет"}

Формат ответа — СТРОГО следующий (6-8 слайдов):
Заголовок слайда:
- Пункт 1 (не более 80 символов)
- Пункт 2
- Пункт 3

Каждый слайд начинается с заголовка с двоеточием на конце.
После — 3-5 пунктов начиная с "- ".
Пиши на русском языке. Пункты — конкретные, ёмкие.`;

      const result = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Создай презентацию: ${topic}. ${details || ""}` },
        ],
        max_tokens: 3000,
      });

      const content = result.choices?.[0]?.message?.content;
      const text = typeof content === "string" ? content
        : Array.isArray(content) ? content.map((c: { type: string; text?: string }) => c.type === "text" ? c.text : "").join("")
        : "";

      const presentationData = parsePresentationFromText(text, topic);
      const pdfBuffer = await generatePresentationPDF(presentationData);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="marketos-presentation.pdf"`);
      res.setHeader("Content-Length", pdfBuffer.length);
      return res.send(pdfBuffer);
    } catch (err) {
      console.error("MarketOS PDF error:", err);
      return res.status(500).json({ error: String(err) });
    }
  });

  // MarketOS AI chat endpoint
  app.post("/api/marketos/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array required" });
      }
      const result = await invokeLLM({ messages, max_tokens: 4000 });
      const content = result.choices?.[0]?.message?.content;
      const text = typeof content === "string" ? content : Array.isArray(content) ? content.map((c: { type: string; text?: string }) => c.type === "text" ? c.text : "").join("") : "";
      return res.json({ text });
    } catch (err) {
      console.error("MarketOS API error:", err);
      return res.status(500).json({ error: String(err) });
    }
  });
  // MarketOS Pay-click counter endpoint
  const payClickFile = "/tmp/marketos_pay_clicks.json";
  const usersFile = "/tmp/marketos_users.json";
  const fs = await import("fs");

  function readPayClicks(): { total: number; clicks: { ts: string; ip: string }[] } {
    try {
      const raw = fs.readFileSync(payClickFile, "utf8");
      return JSON.parse(raw);
    } catch {
      return { total: 0, clicks: [] };
    }
  }

  function savePayClicks(data: { total: number; clicks: { ts: string; ip: string }[] }) {
    fs.writeFileSync(payClickFile, JSON.stringify(data, null, 2));
  }

  // Уникальные пользователи (sessionId + первый запрос)
  function readUsers(): { total: number; sessions: { id: string; ts: string; requests: number }[] } {
    try {
      const raw = fs.readFileSync(usersFile, "utf8");
      return JSON.parse(raw);
    } catch {
      return { total: 0, sessions: [] };
    }
  }

  function saveUsers(data: { total: number; sessions: { id: string; ts: string; requests: number }[] }) {
    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
  }

  // Пинг сессии — вызывается при каждом запросе пользователя
  app.post("/api/marketos/session-ping", (req, res) => {
    const { sessionId } = req.body as { sessionId?: string };
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });
    const data = readUsers();
    const existing = data.sessions.find((s) => s.id === sessionId);
    if (existing) {
      existing.requests += 1;
    } else {
      data.total += 1;
      data.sessions.push({ id: sessionId, ts: new Date().toISOString(), requests: 1 });
      // Храним последние 1000 сессий
      if (data.sessions.length > 1000) data.sessions = data.sessions.slice(-1000);
    }
    saveUsers(data);
    return res.json({ ok: true, isNew: !existing });
  });

  app.post("/api/marketos/pay-click", async (req, res) => {
    const data = readPayClicks();
    const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "").split(",")[0].trim();
    const { sessionId, requestsUsed } = req.body as { sessionId?: string; requestsUsed?: number };
    data.total += 1;
    data.clicks.push({ ts: new Date().toISOString(), ip });
    // Храним последние 200 кликов
    if (data.clicks.length > 200) data.clicks = data.clicks.slice(-200);
    savePayClicks(data);

    // Telegram уведомление
    const TG_BOT_TOKEN = "8148336028:AAFuOTIb-7YGDPmxBUqnzQwRCVTJjfQJGJg";
    const TG_CHAT_IDS = ["1342421992", "683646991"];
    const userData = readUsers();
    const userInfo = sessionId ? userData.sessions.find(s => s.id === sessionId) : null;
    const msg = [
      "\uD83D\uDCB3 <b>\u041A\u043B\u0438\u043A \"\u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C\" \u0432 MarketOS</b>",
      "",
      `\u2022 \u041A\u043B\u0438\u043A\u043E\u0432 \u0432\u0441\u0435\u0433\u043E: <b>${data.total}</b>`,
      `\u2022 \u0417\u0430\u043F\u0440\u043E\u0441\u043E\u0432 \u0441\u0434\u0435\u043B\u0430\u043D\u043E: <b>${requestsUsed ?? userInfo?.requests ?? "?"}</b>`,
      `\u2022 \u0423\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0445 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439: <b>${userData.total}</b>`,
      `\u2022 IP: <code>${ip || "?"}</code>`,
    ].join("\n");

    for (const chatId of TG_CHAT_IDS) {
      fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" }),
      }).catch(() => {});
    }

    return res.json({ ok: true, total: data.total });
  });

  app.get("/api/marketos/admin-stats", (req, res) => {
    const payData = readPayClicks();
    const userData = readUsers();
    // Группируем клики по дням
    const byDay: Record<string, number> = {};
    for (const c of payData.clicks) {
      const day = c.ts.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    }
    // Уникальные пользователи по дням
    const usersByDay: Record<string, number> = {};
    for (const s of userData.sessions) {
      const day = s.ts.slice(0, 10);
      usersByDay[day] = (usersByDay[day] || 0) + 1;
    }
    return res.json({
      totalPayClicks: payData.total,
      totalUsers: userData.total,
      byDay,
      usersByDay,
      recent: payData.clicks.slice(-10).reverse(),
      recentUsers: userData.sessions.slice(-5).reverse(),
    });
  });

  // Game leads endpoint
  const gameLeadsFile = "/tmp/game_leads.json";
  function readGameLeads(): { leads: { name: string; phone: string; telegram?: string; romi: number; score: number; ts: string }[] } {
    try {
      const raw = fs.readFileSync(gameLeadsFile, "utf8");
      return JSON.parse(raw);
    } catch {
      return { leads: [] };
    }
  }
  app.post("/api/game-leads", (req, res) => {
    try {
      const { name, phone, telegram, romi, score } = req.body as { name?: string; phone?: string; telegram?: string; romi?: number; score?: number };
      if (!name || (!phone && !telegram)) return res.status(400).json({ error: "name and contact required" });
      const data = readGameLeads();
      data.leads.push({ name, phone: phone || "", telegram: telegram || "", romi: romi || 0, score: score || 0, ts: new Date().toISOString() });
      fs.writeFileSync(gameLeadsFile, JSON.stringify(data, null, 2));
      // Telegram notification
      const TG_BOT_TOKEN = "8672812865:AAGt98zHZj_Q2r5DnSNXxMl_fNe_Ti9DPxw";
      const TG_CHAT_IDS = ["1342421992", "683646991"];
      const msg = [
        "🎮 <b>Новый лид — CMO игра</b>",
        "",
        `• Имя: <b>${name}</b>`,
        phone ? `• Телефон: <b>${phone}</b>` : null,
        telegram ? `• Telegram: <b>${telegram}</b>` : null,
        `• ROMI в игре: <b>${romi}%</b>`,
        `• Счёт: <b>${score}</b>`,
        "",
        `#CMO_игра #запуск`,
      ].filter(Boolean).join("\n");
      for (const chatId of TG_CHAT_IDS) {
        fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" }),
        }).catch(() => {});
      }
      console.log(`[GAME LEAD] ${name} | ${phone} | ROMI: ${romi}% | Score: ${score}`);
      return res.json({ success: true });
    } catch (err) {
      console.error("Game leads error:", err);
      return res.status(500).json({ error: String(err) });
    }
  });
  app.get("/api/game-leads", (_req, res) => {
    try {
      const data = readGameLeads();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: String(err) });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
