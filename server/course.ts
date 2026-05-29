import { Router } from "express";
import { getDb } from "./db.js";
import { courseStudents, courseProgress } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_IDS = ["1023689076", "5898622042"];
const UNISENDER_API_KEY = process.env.UNISENDER_API_KEY;
const UNISENDER_LIST_ID = "1"; // "Мой первый список"

async function addToUnisender(email: string, name: string | null, token: string) {
  if (!UNISENDER_API_KEY) return;
  try {
    // Добавляем контакт в список
    const subscribeParams = new URLSearchParams({
      api_key: UNISENDER_API_KEY,
      format: "json",
      list_ids: UNISENDER_LIST_ID,
      "fields[email]": email,
    });
    if (name) subscribeParams.set("fields[Name]", name);

    await fetch(`https://api.unisender.com/ru/api/subscribe?${subscribeParams.toString()}`, { method: "GET" });

    // Отправляем приветственное письмо
    const courseUrl = `https://gipoteza-agency.ru/learn?token=${token}`;
    const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px 32px; border-radius: 12px;">
  <div style="font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 16px;">Агентство Гипотеза</div>
  <h1 style="font-size: 32px; font-weight: 900; margin: 0 0 8px; color: #f5f5f0;">Трушный<br><span style="color: #ff3d2e;">Маркетинг</span></h1>
  <p style="color: #aaa; font-size: 16px; margin: 0 0 32px;">Привет${name ? ", " + name : ""}! Ты зарегистрировался на курс.</p>
  <p style="color: #ccc; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">Первые 3 урока уже открыты — заходи и начинай прямо сейчас.</p>
  <a href="${courseUrl}" style="display: inline-block; background: #ff3d2e; color: #fff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; letter-spacing: 0.5px;">Открыть курс →</a>
  <p style="color: #555; font-size: 13px; margin: 32px 0 0;">Если кнопка не работает, скопируй ссылку: ${courseUrl}</p>
</div>`;

    const emailParams = new URLSearchParams({
      api_key: UNISENDER_API_KEY,
      format: "json",
      email: email,
      sender_name: "Гипотеза — Трушный Маркетинг",
      sender_email: "noreply@gipoteza-agency.ru",
      subject: "Твой доступ к курсу Трушный Маркетинг",
      body: htmlBody,
      list_id: UNISENDER_LIST_ID,
    });

    await fetch(`https://api.unisender.com/ru/api/sendEmail?${emailParams.toString()}`, { method: "GET" });
  } catch (e) {
    console.error("Unisender error:", e);
  }
}

async function sendTelegram(msg: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  for (const chatId of TELEGRAM_CHAT_IDS) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" }),
      });
    } catch {}
  }
}

// POST /api/course/register
router.post("/register", async (req, res) => {
  const { email, name } = req.body as { email?: string; name?: string };
  if (!email || !email.includes("@")) {
    return res.json({ success: false, message: "Укажите корректный email" });
  }

  const db = await getDb();
  if (!db) return res.json({ success: false, message: "База данных недоступна" });

  try {
    const existing = await db
      .select()
      .from(courseStudents)
      .where(eq(courseStudents.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      return res.json({ success: true, token: existing[0].accessToken, isNew: false });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await db.insert(courseStudents).values({
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      accessToken: token,
      isPaid: 0,
    });

    await sendTelegram(
      `📚 <b>Новая регистрация на курс</b>\n👤 ${name || "—"}\n📧 ${email}`
    );

    // Добавляем в Unisender и отправляем приветственное письмо
    addToUnisender(email.toLowerCase().trim(), name?.trim() || null, token).catch(() => {});

    return res.json({ success: true, token, isNew: true });
  } catch (e: any) {
    console.error("Course register error:", e);
    return res.json({ success: false, message: "Ошибка сервера" });
  }
});

// GET /api/course/me?token=xxx
router.get("/me", async (req, res) => {
  const { token } = req.query as { token?: string };
  if (!token) return res.json({ success: false, message: "Нет токена" });

  const db = await getDb();
  if (!db) return res.json({ success: false, message: "База данных недоступна" });

  try {
    const student = await db
      .select()
      .from(courseStudents)
      .where(eq(courseStudents.accessToken, token))
      .limit(1);

    if (!student.length) return res.json({ success: false, message: "Токен не найден" });

    const progress = await db
      .select()
      .from(courseProgress)
      .where(eq(courseProgress.studentId, student[0].id));

    return res.json({
      success: true,
      student: {
        id: student[0].id,
        email: student[0].email,
        name: student[0].name,
        isPaid: student[0].isPaid === 1,
      },
      progress: progress.map((p: typeof courseProgress.$inferSelect) => ({
        lessonId: p.lessonId,
        completed: p.completed === 1,
        taskCompleted: p.taskCompleted === 1,
      })),
    });
  } catch (e) {
    return res.json({ success: false, message: "Ошибка сервера" });
  }
});

// POST /api/course/progress
router.post("/progress", async (req, res) => {
  const { token, lessonId, taskCompleted } = req.body as {
    token?: string;
    lessonId?: number;
    taskCompleted?: boolean;
  };

  if (!token || !lessonId) return res.json({ success: false });

  const db = await getDb();
  if (!db) return res.json({ success: false });

  try {
    const student = await db
      .select()
      .from(courseStudents)
      .where(eq(courseStudents.accessToken, token))
      .limit(1);

    if (!student.length) return res.json({ success: false });

    const isPaid = student[0].isPaid === 1;
    if (lessonId > 3 && !isPaid) {
      return res.json({ success: false, message: "Требуется оплата" });
    }

    const existing = await db
      .select()
      .from(courseProgress)
      .where(
        and(
          eq(courseProgress.studentId, student[0].id),
          eq(courseProgress.lessonId, lessonId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(courseProgress)
        .set({
          completed: 1,
          taskCompleted: taskCompleted ? 1 : existing[0].taskCompleted,
          completedAt: new Date(),
        })
        .where(eq(courseProgress.id, existing[0].id));
    } else {
      await db.insert(courseProgress).values({
        studentId: student[0].id,
        lessonId,
        completed: 1,
        taskCompleted: taskCompleted ? 1 : 0,
        completedAt: new Date(),
      });
    }

    return res.json({ success: true });
  } catch (e) {
    return res.json({ success: false });
  }
});

// POST /api/course/pay
router.post("/pay", async (req, res) => {
  const { token } = req.body as { token?: string };
  if (!token) return res.json({ success: false });

  const db = await getDb();
  if (!db) return res.json({ success: false });

  try {
    const student = await db
      .select()
      .from(courseStudents)
      .where(eq(courseStudents.accessToken, token))
      .limit(1);

    if (!student.length) return res.json({ success: false });
    if (student[0].isPaid === 1) return res.json({ success: true, alreadyPaid: true });

    const TERMINAL_KEY = process.env.TINKOFF_TERMINAL_KEY || "";
    const SECRET_KEY = process.env.TINKOFF_SECRET_KEY || "";
    const IS_TEST = !TERMINAL_KEY || TERMINAL_KEY.includes("DEMO");

    const orderId = `course_${student[0].id}_${Date.now()}`;
    const amount = 500000;

    const params: Record<string, string | number> = {
      TerminalKey: TERMINAL_KEY,
      Amount: amount,
      OrderId: orderId,
      Password: SECRET_KEY,
    };
    const sortedKeys = Object.keys(params).sort();
    const tokenStr = sortedKeys.map((k) => params[k]).join("");
    const payToken = crypto.createHash("sha256").update(tokenStr).digest("hex");

    const body: Record<string, unknown> = {
      TerminalKey: TERMINAL_KEY,
      Amount: amount,
      OrderId: orderId,
      Description: "Курс «Маркетинг: инструкция по применению» — полный доступ",
      Token: payToken,
      SuccessURL: `https://gipoteza-agency.ru/learn/success?token=${token}`,
      FailURL: `https://gipoteza-agency.ru/learn/pay?token=${token}&status=fail`,
      DATA: { Email: student[0].email, courseStudentId: String(student[0].id) },
      Receipt: {
        Email: student[0].email,
        Taxation: "usn_income",
        Items: [
          {
            Name: "Курс «Маркетинг: инструкция по применению»",
            Price: amount,
            Quantity: 1,
            Amount: amount,
            Tax: "none",
            PaymentMethod: "full_payment",
            PaymentObject: "service",
          },
        ],
      },
    };

    const apiUrl = IS_TEST
      ? "https://rest-api-test.tinkoff.ru/v2/Init"
      : "https://securepay.tinkoff.ru/v2/Init";

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await resp.json()) as { Success?: boolean; PaymentURL?: string; Message?: string };

    if (data.Success) {
      return res.json({ success: true, paymentUrl: data.PaymentURL, isTest: IS_TEST });
    } else {
      return res.json({ success: false, message: data.Message || "Ошибка оплаты" });
    }
  } catch (e: any) {
    console.error("Course pay error:", e);
    return res.json({ success: false, message: "Ошибка сервера" });
  }
});

// POST /api/course/webhook
router.post("/webhook", async (req, res) => {
  const { Status, OrderId, PaymentId } = req.body || {};

  if (Status === "CONFIRMED" && typeof OrderId === "string" && OrderId.startsWith("course_")) {
    const db = await getDb();
    if (db) {
      try {
        const parts = (OrderId as string).split("_");
        const studentId = parseInt(parts[1]);

        if (!isNaN(studentId)) {
          await db
            .update(courseStudents)
            .set({ isPaid: 1, paymentId: String(PaymentId) })
            .where(eq(courseStudents.id, studentId));

          const student = await db
            .select()
            .from(courseStudents)
            .where(eq(courseStudents.id, studentId))
            .limit(1);

          if (student.length) {
            await sendTelegram(
              `💰 <b>Оплата курса!</b>\n👤 ${student[0].name || "—"}\n📧 ${student[0].email}\n💵 5 000 ₽`
            );
          }
        }
      } catch (e) {
        console.error("Course webhook error:", e);
      }
    }
  }

  res.setHeader("Content-Type", "text/plain");
  res.end("OK");
});

// GET /lessons — список всех уроков
router.get("/lessons", (_req, res) => {
  const lessons = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: [
      "Что такое маркетинг",
      "Контент-маркетинг и копирайтинг",
      "Юнит-экономика",
      "Что хочет заказчик",
      "Продающий лендинг",
      "Лиды и квалификация",
      "Вебинарная воронка",
      "Стратегия в маркетинге",
      "Нейросети и вайб-кодинг",
      "Итоговый урок",
    ][i],
    isFree: i < 3,
  }));
  res.json({ success: true, lessons });
});

export default router;
