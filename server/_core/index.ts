import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
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

  app.post("/api/marketos/pay-click", (req, res) => {
    const data = readPayClicks();
    const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "").split(",")[0].trim();
    data.total += 1;
    data.clicks.push({ ts: new Date().toISOString(), ip });
    // Храним последние 200 кликов
    if (data.clicks.length > 200) data.clicks = data.clicks.slice(-200);
    savePayClicks(data);
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
