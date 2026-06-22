// TeamSection.tsx — переиспользуемый раздел «Команда» для посадочных страниц

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  );
}

const MEMBERS = [
  {
    id: "01", codename: "СТРАТЕГ", name: "Денис Зюлин", role: "Основатель",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/denis_30d9c6b7.jpg",
    accent: "#FF2D20",
    quote: "Вебинар — это не шоу. Это система, которая либо работает, либо нет. Мы строим те, которые работают.",
    focus: "Стратегия воронок и продуктовый маркетинг",
    background: ["5 лет в вебинарах", "40+ запусков", "EdTech и онлайн-школы"],
  },
  {
    id: "02", codename: "ПРОДЮСЕР", name: "Алла Захарова", role: "Партнёр, контент",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/alla_c7f64f85.jpg",
    accent: "#B5F23D",
    quote: "Хороший сценарий — это когда зритель не замечает, что его ведут. Он просто хочет купить.",
    focus: "Сценарии, смыслы и структура контента",
    background: ["Skyeng", "Skillbox", "SkillFactory"],
  },
  {
    id: "03", codename: "ТРАФИК", name: "Алексей Пономарёв", role: "Основатель",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/alexey_68167dc3.jpg",
    accent: "#FF2D20",
    quote: "Холодный трафик не прощает слабых офферов. Мы делаем воронки, которые окупаются с первого касания.",
    focus: "Холодный трафик, боты и автоворонки",
    background: ["Таргет и контекст", "Чат-боты", "Автоматизация"],
  },
  {
    id: "04", codename: "МАРКЕТОЛОГ", name: "Дмитрий Лебедев", role: "Операционный маркетолог",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663424748900/eknd3zddgH462fMJnj9dCN/dima-photo_0a8d9f28.jpg",
    accent: "#B5F23D",
    quote: "Маркетинг без операционки — это идеи без результата. Я слежу за тем, чтобы всё работало как надо.",
    focus: "Операционный маркетинг и процессы",
    background: ["Аналитика", "CRM и воронки", "Управление проектами"],
  },
];

export default function TeamSection() {
  const [active, setActive] = useState(0);
  const m = MEMBERS[active];

  return (
    <section style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>

      {/* Заголовок */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3.5rem 1.25rem 2rem" }}>
        <FadeUp>
          <p style={{ fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1rem" }}>
            КОМАНДА
          </p>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 7vw, 4rem)", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.03em", lineHeight: 0.95, margin: 0 }}>
            Лига вебинарных<br /><span style={{ color: "#FF2D20" }}>воронок.</span>
          </h2>
        </FadeUp>
      </div>

      {/* Слайдер */}
      <div className="ts-slider" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "480px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Левая — цитата + инфо */}
        <div style={{ padding: "clamp(2rem, 5vw, 4rem)", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div className="font-display" style={{ fontSize: "4rem", lineHeight: 0.8, color: m.accent, marginBottom: "1.25rem", fontWeight: 900 }}>«</div>
            <p className="font-display" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.7rem)", fontWeight: 700, color: "#F5F5F0", lineHeight: 1.25, letterSpacing: "-0.02em", margin: "0 0 2rem" }}>
              {m.quote}
            </p>
          </div>
          <div>
            <div style={{ fontFamily: "Inter", fontSize: "0.68rem", color: m.accent, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.6rem" }}>
              ФОКУС: {m.focus}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
              {m.background.map(tag => (
                <span key={tag} style={{ fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.12)", padding: "0.25rem 0.6rem" }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "2px", height: "2.5rem", background: m.accent, flexShrink: 0 }} />
              <div>
                <div className="font-display" style={{ fontSize: "1.2rem", fontWeight: 900, color: "#F5F5F0", letterSpacing: "-0.02em", lineHeight: 1 }}>{m.name}</div>
                <div style={{ fontFamily: "Inter", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "0.2rem" }}>{m.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая — фото */}
        <div style={{ position: "relative", overflow: "hidden", background: "#111" }}>
          <img key={m.id} src={m.photo} alt={m.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          />
          <div style={{ position: "absolute", top: "1.25rem", left: "1.25rem", background: m.accent, padding: "0.3rem 0.7rem" }}>
            <span className="font-display" style={{ fontSize: "0.65rem", fontWeight: 900, color: m.accent === "#B5F23D" ? "#0A0A0A" : "#fff", letterSpacing: "0.2em" }}>
              {m.codename}
            </span>
          </div>
          <div className="font-display" style={{ position: "absolute", bottom: "1.25rem", right: "1.25rem", fontSize: "5rem", fontWeight: 900, color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.12)", lineHeight: 1, letterSpacing: "-0.04em" }}>
            {m.id}
          </div>
        </div>
      </div>

      {/* Навигация */}
      <div className="ts-nav" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {MEMBERS.map((mem, i) => (
          <button key={mem.id} onClick={() => setActive(i)}
            style={{
              background: i === active ? "rgba(255,255,255,0.04)" : "transparent",
              border: "none",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              borderBottom: i === active ? `2px solid ${mem.accent}` : "2px solid transparent",
              padding: "1.1rem 1.25rem",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.2s",
            }}
          >
            <div className="font-display" style={{ fontSize: "0.85rem", fontWeight: 900, color: i === active ? "#F5F5F0" : "rgba(255,255,255,0.3)", letterSpacing: "-0.01em", lineHeight: 1.1, transition: "color 0.2s" }}>
              {mem.name.split(" ")[0]}
            </div>
            <div style={{ fontFamily: "Inter", fontSize: "0.52rem", color: i === active ? mem.accent : "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.2rem", transition: "color 0.2s" }}>
              {mem.codename}
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ts-slider { grid-template-columns: 1fr !important; }
          .ts-slider > div:last-child { min-height: 300px; }
          .ts-nav { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
