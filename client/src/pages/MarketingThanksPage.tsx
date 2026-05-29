import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

// Звёздочка декоративная
function Star({ size = 24, color = "#B5F23D", rotate = 0 }: { size?: number; color?: string; rotate?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rotate}deg)`, display: "inline-block" }}>
      <path d="M12 2 L13.8 8.2 L20 8.2 L15 12 L16.8 18.2 L12 14.5 L7.2 18.2 L9 12 L4 8.2 L10.2 8.2 Z" fill={color} />
    </svg>
  );
}

// Анимация появления
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const t = setTimeout(() => {
      el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return <div ref={ref}>{children}</div>;
}

// Большой SVG сапог
function BigBoot({ color = "#ff3d2e", sole = "#cc2d20" }: { color?: string; sole?: string }) {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 64, height: "auto" }}>
      <path d="M26 0 L26 80 L16 80 L16 92 Q16 106 28 106 L68 106 Q76 106 76 98 L76 90 Q76 82 68 82 L52 82 L52 0 Z" fill={color} />
      <rect x="30" y="6" width="8" height="68" rx="4" fill="rgba(255,255,255,0.12)" />
      <rect x="12" y="104" width="66" height="10" rx="5" fill={sole} />
      <ellipse cx="45" cy="117" rx="30" ry="4" fill="rgba(255,61,46,0.15)" />
    </svg>
  );
}

export default function MarketingThanksPage() {
  const [, setLocation] = useLocation();
  const token = typeof window !== "undefined" ? localStorage.getItem("course_token") : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#F5F5F0",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Декоративные звёздочки */}
      <div style={{ position: "absolute", top: 60, left: "8%", opacity: 0.5 }}>
        <Star size={32} color="#B5F23D" rotate={12} />
      </div>
      <div style={{ position: "absolute", top: 120, right: "10%", opacity: 0.4 }}>
        <Star size={20} color="#ff3d2e" rotate={-20} />
      </div>
      <div style={{ position: "absolute", bottom: 80, left: "15%", opacity: 0.3 }}>
        <Star size={16} color="#B5F23D" rotate={45} />
      </div>
      <div style={{ position: "absolute", bottom: 120, right: "8%", opacity: 0.4 }}>
        <Star size={28} color="#ff3d2e" rotate={30} />
      </div>

      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        {/* Логотип */}
        <FadeUp delay={0}>
          <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <BigBoot color="#ff3d2e" sole="#cc2d20" />
            <BigBoot color="#F5F5F0" sole="#bbb" />
          </div>
        </FadeUp>

        {/* Заголовок */}
        <FadeUp delay={0.1}>
          <div style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "#888", marginBottom: 16 }}>
            Курс от агентства Гипотеза
          </div>
          <h1 style={{
            fontFamily: "Unbounded, sans-serif",
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 900,
            lineHeight: 1.1,
            margin: "0 0 24px",
          }}>
            <span style={{ color: "#F5F5F0" }}>Готово!</span>{" "}
            <Star size={28} color="#B5F23D" rotate={15} />
          </h1>
        </FadeUp>

        {/* Основной текст */}
        <FadeUp delay={0.2}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "32px 28px",
            marginBottom: 32,
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F5F5F0", marginBottom: 12, lineHeight: 1.3 }}>
              Курс ждёт тебя на почте
            </div>
            <div style={{ fontSize: 16, color: "#aaa", lineHeight: 1.7 }}>
              Мы отправили письмо с персональной ссылкой на курс. Проверь входящие — и сразу начинай.
            </div>
            <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(181,242,61,0.08)", borderRadius: 8, border: "1px solid rgba(181,242,61,0.2)", fontSize: 14, color: "#B5F23D" }}>
              📬 Не нашёл письмо? Проверь папку «Спам»
            </div>
          </div>
        </FadeUp>

        {/* Кнопки */}
        <FadeUp delay={0.3}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {token && (
              <button
                onClick={() => setLocation(`/learn?token=${token}`)}
                style={{
                  background: "#ff3d2e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "16px 32px",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: 0.3,
                }}
              >
                Открыть курс прямо сейчас →
              </button>
            )}
            <button
              onClick={() => setLocation("/marketing")}
              style={{
                background: "transparent",
                color: "#666",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "14px 32px",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              ← Вернуться на страницу курса
            </button>
          </div>
        </FadeUp>

        {/* Подпись */}
        <FadeUp delay={0.4}>
          <div style={{ marginTop: 40, fontSize: 13, color: "#444", lineHeight: 1.6 }}>
            Трушный Маркетинг — курс от агентства Гипотеза.<br />
            Не из учебника. Из рабочего процесса.
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
