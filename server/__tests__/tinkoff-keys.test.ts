import { describe, it, expect } from "vitest";
import crypto from "crypto";

const TERMINAL_KEY = process.env.TINKOFF_TERMINAL_KEY;
const SECRET_KEY = process.env.TINKOFF_SECRET_KEY;
const TINKOFF_API = "https://securepay.tinkoff.ru/v2";

function generateToken(params: Record<string, string | number | boolean>): string {
  const withPassword = { ...params, Password: SECRET_KEY! };
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

describe("Tinkoff production keys validation", () => {
  it("should have TINKOFF_TERMINAL_KEY set", () => {
    expect(TERMINAL_KEY).toBeDefined();
    expect(TERMINAL_KEY).not.toBe("");
    expect(TERMINAL_KEY).not.toContain("DEMO");
  });

  it("should have TINKOFF_SECRET_KEY set", () => {
    expect(SECRET_KEY).toBeDefined();
    expect(SECRET_KEY).not.toBe("");
  });

  it("should successfully call Init with production keys (validates credentials)", async () => {
    if (!TERMINAL_KEY || !SECRET_KEY) {
      throw new Error("Keys not set");
    }

    const orderId = `test_validate_${Date.now()}`;
    const baseParams: Record<string, string | number> = {
      TerminalKey: TERMINAL_KEY,
      Amount: 10000, // 100 руб — минимум для теста
      OrderId: orderId,
      Description: "Validation test",
    };

    const token = generateToken(baseParams);

    const response = await fetch(`${TINKOFF_API}/Init`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...baseParams, Token: token }),
    });

    const data = await response.json() as {
      Success: boolean;
      ErrorCode?: string;
      Message?: string;
      PaymentURL?: string;
    };

    // Если ключи валидны, Init вернёт Success: true или ошибку не связанную с авторизацией
    // ErrorCode "0" = success, другие коды ≠ ошибка авторизации
    if (!data.Success) {
      // Ошибка авторизации — коды 9999 или сообщение о неверном терминале
      expect(data.ErrorCode).not.toBe("9999");
      expect(data.Message?.toLowerCase()).not.toContain("terminal");
      expect(data.Message?.toLowerCase()).not.toContain("unauthorized");
    } else {
      expect(data.PaymentURL).toBeDefined();
    }
  });
});
