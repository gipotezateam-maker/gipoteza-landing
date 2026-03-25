import { useEffect, useState } from "react";

interface Stats {
  total: number;
  byDay: Record<string, number>;
  recent: { ts: string; ip: string }[];
}

export default function MarketosAdmin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/marketos/admin-stats");
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      setError("Не удалось загрузить статистику");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // обновляем каждые 30 сек
    return () => clearInterval(interval);
  }, []);

  const sortedDays = stats
    ? Object.entries(stats.byDay).sort(([a], [b]) => b.localeCompare(a)).slice(0, 14)
    : [];

  const maxDayCount = sortedDays.length > 0 ? Math.max(...sortedDays.map(([, v]) => v)) : 1;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#F5F5F0",
      fontFamily: "Inter, sans-serif",
      padding: "2rem 1rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Unbounded:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
          <div style={{
            width: 44, height: 44,
            background: "#FF2D20",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 900, fontSize: "1.1rem", color: "#fff",
          }}>М</div>
          <div>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              МАРКЕТ<span style={{ color: "#FF2D20" }}>ОС</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginLeft: "0.75rem" }}>ADMIN</span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.15rem" }}>
              Статистика нажатий на оплату
            </div>
          </div>
          <button
            onClick={fetchStats}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
              padding: "0.5rem 1rem",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.75rem",
              cursor: "pointer",
              letterSpacing: "0.05em",
            }}
          >↻ Обновить</button>
        </div>

        {loading && !stats && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "4rem" }}>
            Загрузка...
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", color: "#FF2D20", padding: "4rem" }}>{error}</div>
        )}

        {stats && (
          <>
            {/* Главный счётчик */}
            <div style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "2.5rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  — Всего нажали "Оплатить"
                </div>
                <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(3rem, 10vw, 5rem)", fontWeight: 900, color: "#FF2D20", lineHeight: 1 }}>
                  {stats.total}
                </div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                  Сегодня
                </div>
                <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "2rem", fontWeight: 900, color: "#F5F5F0" }}>
                  {stats.byDay[new Date().toISOString().slice(0, 10)] || 0}
                </div>
              </div>
            </div>

            {/* График по дням */}
            {sortedDays.length > 0 && (
              <div style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "2rem",
                marginBottom: "1.5rem",
              }}>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  — По дням (последние 14 дней)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {sortedDays.map(([day, count]) => (
                    <div key={day} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: 90, fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
                        {new Date(day + "T12:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                      </div>
                      <div style={{ flex: 1, height: 24, background: "rgba(255,255,255,0.04)", position: "relative" }}>
                        <div style={{
                          height: "100%",
                          width: `${(count / maxDayCount) * 100}%`,
                          background: "#FF2D20",
                          transition: "width 0.4s ease",
                          minWidth: count > 0 ? 4 : 0,
                        }} />
                      </div>
                      <div style={{ width: 28, textAlign: "right", fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#F5F5F0", flexShrink: 0 }}>
                        {count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Последние клики */}
            {stats.recent.length > 0 && (
              <div style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "2rem",
              }}>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  — Последние 10 нажатий
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {stats.recent.map((click, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem 0",
                      borderBottom: i < stats.recent.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div style={{ width: 8, height: 8, background: "#FF2D20", flexShrink: 0 }} />
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                        {new Date(click.ts).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div style={{ marginLeft: "auto", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
                        {click.ip ? click.ip.replace(/(\d+\.\d+)\.\d+\.\d+/, "$1.*.*") : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.total === 0 && (
              <div style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "3rem",
                textAlign: "center",
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.875rem",
              }}>
                Пока никто не нажал на кнопку "Оплатить".<br />
                Данные появятся здесь автоматически.
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: "2rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", textAlign: "center" }}>
          Обновляется автоматически каждые 30 секунд · <a href="/marketos" style={{ color: "rgba(255,45,32,0.5)", textDecoration: "none" }}>← Вернуться в MarketOS</a>
        </div>
      </div>
    </div>
  );
}
