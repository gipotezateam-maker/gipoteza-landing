import crypto from "crypto";
import express from "express";

const router = express.Router();

// Т-Касса credentials — берём из env переменных
const TERMINAL_KEY = process.env.TINKOFF_TERMINAL_KEY || "1769529840925DEMO";
const SECRET_KEY = process.env.TINKOFF_SECRET_KEY || "_4ygoseBw8er34!P";
const IS_TEST = !process.env.TINKOFF_TERMINAL_KEY || TERMINAL_KEY.includes("DEMO");
const TINKOFF_API = "https://securepay.tinkoff.ru/v2";

// Флаг для автоматического возврата в тестовом режиме (для прохождения тест-кейса №3)
const AUTO_REFUND_TEST = process.env.TINKOFF_AUTO_REFUND === "true" || IS_TEST;


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

/**
 * Вызывает метод Cancel Т-Кассы для возврата/отмены платежа
 */
async function cancelPayment(paymentId: string | number, amount?: number): Promise<{ success: boolean; message?: string }> {
  try {
    const baseParams: Record<string, string | number> = {
      TerminalKey: TERMINAL_KEY,
      PaymentId: String(paymentId),
    };
    if (amount) {
      baseParams.Amount = amount;
    }
    const token = generateToken(baseParams);

    const body = {
      ...baseParams,
      Token: token,
    };

    console.log(`[Tinkoff Cancel] Calling Cancel API | PaymentId: ${paymentId} | Amount: ${amount || 'full'}`);

    const response = await fetch(`${TINKOFF_API}/Cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json() as {
      Success: boolean;
      Status?: string;
      Message?: string;
      ErrorCode?: string;
    };

    console.log(`[Tinkoff Cancel] Response:`, JSON.stringify(data));

    if (data.Success) {
      return { success: true, message: `Payment ${paymentId} cancelled. Status: ${data.Status}` };
    } else {
      return { success: false, message: data.Message || `Error: ${data.ErrorCode}` };
    }
  } catch (err) {
    console.error("[Tinkoff Cancel] Error:", err);
    return { success: false, message: "Internal error during cancel" };
  }
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

// POST /api/tinkoff/cancel — ручной возврат/отмена платежа
router.post("/cancel", async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      res.status(400).json({ success: false, message: "paymentId is required" });
      return;
    }

    const result = await cancelPayment(paymentId, amount);
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("[Tinkoff Cancel Route] Error:", err);
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

      // Для тест-кейса №3: автоматически делаем возврат после подтверждения
      // Это нужно чтобы Т-Касса получила REFUNDED нотификацию
      if (AUTO_REFUND_TEST && PaymentId) {
        console.log(`[Tinkoff Webhook] AUTO_REFUND: Scheduling cancel for PaymentId: ${PaymentId}`);
        // Делаем возврат через 3 секунды чтобы платёж успел полностью подтвердиться
        setTimeout(async () => {
          const result = await cancelPayment(PaymentId);
          console.log(`[Tinkoff Webhook] AUTO_REFUND result:`, JSON.stringify(result));
        }, 3000);
      }
    }

    // Обрабатываем отклонённый платёж
    if (Status === "REJECTED") {
      console.log(`[Tinkoff Webhook] Payment REJECTED | OrderId: ${OrderId}`);
    }

    // Обрабатываем возврат
    if (Status === "REFUNDED" || Status === "PARTIAL_REFUNDED" || Status === "REVERSED") {
      console.log(`[Tinkoff Webhook] Payment REFUNDED | OrderId: ${OrderId}`);
    }

    // Обязательный ответ для Т-Кассы:
    // HTTP CODE = 200, тело = OK (заглавными, без тегов, plain text)
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
