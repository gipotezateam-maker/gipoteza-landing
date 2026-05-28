import { describe, it, expect } from "vitest";

const BASE = "http://localhost:3000";

describe("Course API", () => {
  let token: string;

  it("POST /api/course/register — регистрирует студента по email", { timeout: 15000 }, async () => {
    const email = `test_${Date.now()}@example.com`;
    const res = await fetch(`${BASE}/api/course/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.token).toBeTruthy();
    token = data.token;
  });

  it("GET /api/course/me — возвращает данные студента по токену", { timeout: 15000 }, async () => {
    if (!token) return;
    const res = await fetch(`${BASE}/api/course/me?token=${token}`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.student).toBeTruthy();
    expect(data.student.isPaid).toBe(false);
    expect(Array.isArray(data.progress)).toBe(true);
  });

  it("POST /api/course/progress — сохраняет прогресс урока", { timeout: 15000 }, async () => {
    if (!token) return;
    const res = await fetch(`${BASE}/api/course/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, lessonId: 1, taskCompleted: true }),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("GET /api/course/me — прогресс урока 1 сохранился", { timeout: 15000 }, async () => {
    if (!token) return;
    const res = await fetch(`${BASE}/api/course/me?token=${token}`);
    const data = await res.json();
    const lesson1 = data.progress.find((p: { lessonId: number }) => p.lessonId === 1);
    expect(lesson1).toBeTruthy();
    expect(lesson1.completed).toBe(true);
    expect(lesson1.taskCompleted).toBe(true);
  });

  it("GET /api/course/me — неверный токен возвращает ошибку", { timeout: 15000 }, async () => {
    const res = await fetch(`${BASE}/api/course/me?token=invalid_token_123`);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("GET /api/course/lessons — возвращает список уроков", { timeout: 15000 }, async () => {
    const res = await fetch(`${BASE}/api/course/lessons`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.lessons)).toBe(true);
    expect(data.lessons.length).toBe(10);
  });
});
