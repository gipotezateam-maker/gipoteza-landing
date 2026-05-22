import crypto from "crypto";
import express from "express";

const router = express.Router();

// Т-Касса credentials (DEMO / TEST)
const TERMINAL_KEY = process.env.TINKOFF_TERMINAL_KEY || "1769529840925DEMO";
const SECRET_KEY = process.env.TINKOFF_SECRET_KEY || "_4ygoseBw8er34!P";
const TINKOFF_API = "https://securepay.tinkoff.ru/v2";

/**
 * Генерирует подпись для запроса Т-Кассы
 * Алгоритм: сортируем ключи, конкатенируем значения, SHA-256
 */
function generateToken(params: Record<string, string | number | boolean>): string {
  const withPassword = { ...params, Password: SECRET_KEY };
  const sorted = Object.keys(withPassword)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      const val = withPassword[key as keyof typeof withPassword];
      if (typeof val !== "object" && typeof val !== "undefined") {
        acc[key] = String(val);
      }
      return acc;
    }, {});

  const concatenated = Object.values(sorted).join("");
  return crypto.createHash("sha256").update(concatenated).digest("hex");
}

// POST /api/tinkoff/init — инициализация платежа
router.post("/init", async (req, res) => {
  try {
    const { name, email, phone, orderId: customOrderId } = req.body;

    const orderId = customOrderId || `order_${Date.now()}`;
    const amount = 99000; // 990 руб в копейках

    const params: Record<string, string | number> = {
      TerminalKey: TERMINAL_KEY,
      Amount: amount,
      OrderId: orderId,
      Description: "Мини-курс «Запуск»: маркетинговый симулятор для EdTech",
      SuccessURL: `${req.protocol}://${req.get("host")}/course?status=success`,
      FailURL: `${req.protocol}://${req.get("host")}/course?status=fail`,
    };

    // Добавляем данные покупателя если есть
    if (email) params.Email = email;
    if (phone) params.Phone = phone;
    if (name) params.Name = name;

    const token = generateToken(params);

    const body = {
      ...params,
      Token: token,
      ...(email || phone || name
        ? {
            Receipt: {
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
            },
          }
        : {}),
    };

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
      res.json({ success: true, paymentUrl: data.PaymentURL });
    } else {
      console.error("Tinkoff init error:", data);
      res.status(400).json({ success: false, message: data.Message || "Ошибка инициализации платежа" });
    }
  } catch (err) {
    console.error("Tinkoff payment error:", err);
    res.status(500).json({ success: false, message: "Внутренняя ошибка сервера" });
  }
});

export default router;
