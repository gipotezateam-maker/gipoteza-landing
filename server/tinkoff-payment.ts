import crypto from "crypto";
import express from "express";

const router = express.Router();

// Т-Касса credentials — берём из env переменных
const TERMINAL_KEY = process.env.TINKOFF_TERMINAL_KEY || "1769529840925DEMO";
const SECRET_KEY = process.env.TINKOFF_SECRET_KEY || "_4ygoseBw8er34!P";
const IS_TEST = !process.env.TINKOFF_TERMINAL_KEY || TERMINAL_KEY.includes("DEMO");
const TINKOFF_API = "https://securepay.tinkoff.ru/v2";



/**
 * Генерирует подпись для запроса Т-Кассы
 * Алгоритм: сортируем ключи, конкатенируем значения, SHA-256
 */
function generateToken(params: Record<string, string | number | boolean>): string {
  const withPassword = { ...params, Password: SECRET_KEY };
  const sortedKeys = Object.keys(withPassword).sort();
  const concatenated = sortedKeys
    .filter(key => {
      const val = withPassword[key as keyof typeof withPassword];
      return typeof val !== "object" && typeof val !== "undefined";
    })
    .map(key => String(withPassword[key as keyof typeof withPassword]))
    .join("");
  return crypto.createHash("sha256").update(concatenated).digest("hex");
}



// POST /api/tinkoff/init — инициализация платежа
router.post("/init", async (req, res) => {
  try {
    const { name, email, phone, orderId: customOrderId } = req.body;

    const orderId = customOrderId || `order_${Date.now()}`;
    const amount = 99000; // 990 руб в копейках

    // Базовые поля — только они участвуют в подписи токена
    const baseParams: Record<string, string | number> = {
      TerminalKey: TERMINAL_KEY,
      Amount: amount,
      OrderId: orderId,
      Description: "Мини-курс «Запуск»: маркетинговый симулятор для EdTech",
      SuccessURL: `https://gipoteza-agency.ru/course?status=success`,
      FailURL: `https://gipoteza-agency.ru/course?status=fail`,
    };

    // Токен считается ТОЛЬКО из базовых полей (без Email/Phone/Name/Receipt)
    const token = generateToken(baseParams);

    const body: Record<string, unknown> = {
      ...baseParams,
      Token: token,
    };

    // Email, Phone, Receipt добавляем ПОСЛЕ токена — они не влияют на подпись
    if (email) body.Email = email;
    if (phone) body.Phone = phone;
    if (email || phone) {
      body.Receipt = {
        Email: email || "",
        Phone: phone || "",
        Taxation: "usn_income",
        Items: [
          {
            Name: "Мини-курс «Запуск»",
            Price: amount,
            Quantity: 1,
            Amount: amount,
            Tax: "none",
          },
        ],
      };
    }

    const response = await fetch(`${TINKOFF_API}/Init`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json() as {
      Success: boolean;
      PaymentURL?: string;
      Message?: string;
      Details?: string;
    };

    if (data.Success && data.PaymentURL) {
      console.log(`[Tinkoff] Payment initialized | OrderId: ${orderId} | Amount: ${amount} | Test: ${IS_TEST}`);
      res.json({ success: true, paymentUrl: data.PaymentURL, isTest: IS_TEST });
    } else {
      console.error("Tinkoff init error:", data);
      res.status(400).json({ success: false, message: data.Message || "Ошибка инициализации платежа" });
    }
  } catch (err) {
    console.error("Tinkoff payment error:", err);
    res.status(500).json({ success: false, message: "Внутренняя ошибка сервера" });
  }
});

// GET /api/tinkoff/webhook — ping/health check (Т-Касса может проверять доступность URL)
router.get("/webhook", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

// POST /api/tinkoff/webhook — вебхук от Т-Кассы (уведомления о статусе платежа)
// Т-Касса отправляет POST с Content-Type: application/json
// Ответ: HTTP 200, тело "OK" (заглавными, без тегов)
router.post("/webhook", (req, res) => {
  try {
    const notification = req.body;
    const { Status, OrderId, Amount, PaymentId } = notification || {};

    console.log(`[Tinkoff Webhook] Received | Status: ${Status} | OrderId: ${OrderId} | Amount: ${Amount} | PaymentId: ${PaymentId}`);
    console.log(`[Tinkoff Webhook] Full body:`, JSON.stringify(notification));

    // Обрабатываем успешный платёж
    if (Status === "CONFIRMED" || Status === "AUTHORIZED") {
      const amountRub = Math.round(Number(Amount) / 100);
      console.log(`[Tinkoff Webhook] Payment SUCCESS | OrderId: ${OrderId} | Amount: ${amountRub} ₽`);
    }

    // Обрабатываем отклонённый платёж
    if (Status === "REJECTED") {
      console.log(`[Tinkoff Webhook] Payment REJECTED | OrderId: ${OrderId}`);
    }

    // Обрабатываем возврат
    if (Status === "REFUNDED") {
      console.log(`[Tinkoff Webhook] Payment REFUNDED | OrderId: ${OrderId}`);
    }

    // Обязательный ответ для Т-Кассы:
    // HTTP CODE = 200, тело = OK (заглавными, без тегов, plain text)
    // Используем writeHead + end чтобы Express не добавлял charset
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  } catch (err) {
    console.error("[Tinkoff Webhook] Error:", err);
    // Даже при ошибке отвечаем OK чтобы Т-Касса не повторяла запрос
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  }
});

export default router;
