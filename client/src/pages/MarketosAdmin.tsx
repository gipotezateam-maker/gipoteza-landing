import { useEffect, useState } from "react";

interface Stats {
  totalPayClicks: number;
  totalUsers: number;
  byDay: Record<string, number>;
  usersByDay: Record<string, number>;
  recent: { ts: string; ip: string }[];
  recentUsers: { id: string; ts: string; requests: number }[];
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
    } catch {
      setError("Не удалось загрузить статистику");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Объединяем дни из кликов и пользователей
  const allDays = stats
    ? Array.from(new Set([...Object.keys(stats.byDay), ...Object.keys(stats.usersByDay)]))
        .sort((a, b) => b.localeCompare(a))
        .slice(0, 14)
    : [];

  const maxUsers = allDays.length > 0 ? Math.max(...allDays.map((d) => stats?.usersByDay[d] || 0), 1) : 1;
  const maxClicks = allDays.length > 0 ? Math.max(...allDays.map((d) => stats?.byDay[d] || 0), 1) : 1;

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
        .mk-card { background: #111; border: 1px solid rgba(255,255,255,0.06); padding: 2rem; margin-bottom: 1.5rem; }
        .mk-label { font-size: 0.7rem; color: rgba(255,255,255,0.3); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem; }
        .mk-big { font-family: 'Unbounded', sans-serif; font-weight: 900; color: #FF2D20; line-height: 1; }
        .mk-divider { width: 1px; background: rgba(255,255,255,0.08); align-self: stretch; margin: 0 2rem; }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
          <div style={{
            width: 44, height: 44, background: "#FF2D20",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#fff",
          }}>М</div>
          <div>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              МАРКЕТ<span style={{ color: "#FF2D20" }}>ОС</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginLeft: "0.75rem" }}>ADMIN</span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.15rem" }}>
              Статистика MarketOS
            </div>
          </div>
          <button onClick={fetchStats} style={{
            marginLeft: "auto", background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)",
            padding: "0.5rem 1rem", fontFamily: "Inter, sans-serif", fontSize: "0.75rem",
            cursor: "pointer", letterSpacing: "0.05em",
          }}>↻ Обновить</button>
        </div>

        {loading && !stats && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "4rem" }}>Загрузка...</div>
        )}
        {error && (
          <div style={{ textAlign: "center", color: "#FF2D20", padding: "4rem" }}>{error}</div>
        )}

        {stats && (
          <>
            {/* Главные метрики — 2 карточки в ряд */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              {/* Уникальные пользователи */}
              <div className="mk-card">
                <div className="mk-label">— Уникальных пользователей</div>
                <div className="mk-big" style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)" }}>
                  {stats.totalUsers}
                </div>
                <div style={{ marginTop: "1rem", display: "flex", gap: "2rem" }}>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Сегодня</div>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#F5F5F0" }}>
                      {stats.usersByDay[new Date().toISOString().slice(0, 10)] || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Вчера</div>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#F5F5F0" }}>
                      {(() => {
                        const y = new Date(); y.setDate(y.getDate() - 1);
                        return stats.usersByDay[y.toISOString().slice(0, 10)] || 0;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Нажали Оплатить */}
              <div className="mk-card">
                <div className="mk-label">— Нажали "Оплатить"</div>
                <div className="mk-big" style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)" }}>
                  {stats.totalPayClicks}
                </div>
                <div style={{ marginTop: "1rem", display: "flex", gap: "2rem" }}>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Сегодня</div>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#F5F5F0" }}>
                      {stats.byDay[new Date().toISOString().slice(0, 10)] || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Конверсия</div>
                    <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: stats.totalUsers > 0 && stats.totalPayClicks > 0 ? "#FF2D20" : "#F5F5F0" }}>
                      {stats.totalUsers > 0 ? `${Math.round((stats.totalPayClicks / stats.totalUsers) * 100)}%` : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* График по дням */}
            {allDays.length > 0 && (
              <div className="mk-card">
                <div className="mk-label" style={{ marginBottom: "1.5rem" }}>— Активность по дням (последние 14 дней)</div>
                {/* Легенда */}
                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                    <div style={{ width: 10, height: 10, background: "#FF2D20" }} />
                    Пользователи
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                    <div style={{ width: 10, height: 10, background: "rgba(255,45,32,0.3)" }} />
                    Клики "Оплатить"
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {allDays.map((day) => {
                    const users = stats.usersByDay[day] || 0;
                    const clicks = stats.byDay[day] || 0;
                    return (
                      <div key={day} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: 80, fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                          {new Date(day + "T12:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
                          {/* Пользователи */}
                          <div style={{ height: 14, background: "rgba(255,255,255,0.04)", position: "relative" }}>
                            <div style={{
                              height: "100%",
                              width: `${(users / maxUsers) * 100}%`,
                              background: "#FF2D20",
                              minWidth: users > 0 ? 3 : 0,
                            }} />
                          </div>
                          {/* Клики оплаты */}
                          {clicks > 0 && (
                            <div style={{ height: 8, background: "rgba(255,255,255,0.04)", position: "relative" }}>
                              <div style={{
                                height: "100%",
                                width: `${(clicks / maxClicks) * 100}%`,
                                background: "rgba(255,45,32,0.4)",
                                minWidth: 3,
                              }} />
                            </div>
                          )}
                        </div>
                        <div style={{ width: 50, textAlign: "right", flexShrink: 0 }}>
                          <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#F5F5F0" }}>{users}</span>
                          {clicks > 0 && <span style={{ fontSize: "0.65rem", color: "rgba(255,45,32,0.7)", marginLeft: "4px" }}>/ {clicks}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Последние пользователи */}
            {stats.recentUsers.length > 0 && (
              <div className="mk-card">
                <div className="mk-label" style={{ marginBottom: "1.5rem" }}>— Последние 5 пользователей</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {stats.recentUsers.map((u, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "0.75rem 0",
                      borderBottom: i < stats.recentUsers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div style={{ width: 8, height: 8, background: "#FF2D20", flexShrink: 0 }} />
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                        {new Date(u.ts).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Запросов</div>
                          <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F5F5F0" }}>{u.requests}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Последние клики оплаты */}
            {stats.recent.length > 0 && (
              <div className="mk-card">
                <div className="mk-label" style={{ marginBottom: "1.5rem" }}>— Последние 10 нажатий "Оплатить"</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {stats.recent.map((click, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "0.65rem 0",
                      borderBottom: i < stats.recent.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div style={{ width: 6, height: 6, background: "rgba(255,45,32,0.6)", flexShrink: 0 }} />
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                        {new Date(click.ts).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div style={{ marginLeft: "auto", fontSize: "0.68rem", color: "rgba(255,255,255,0.15)", fontFamily: "monospace" }}>
                        {click.ip ? click.ip.replace(/(\d+\.\d+)\.\d+\.\d+/, "$1.*.*") : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.totalUsers === 0 && stats.totalPayClicks === 0 && (
              <div className="mk-card" style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.875rem", padding: "3rem" }}>
                Данные появятся здесь как только кто-то воспользуется MarketOS.
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: "2rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", textAlign: "center" }}>
          Обновляется автоматически каждые 30 секунд ·{" "}
          <a href="/marketos" style={{ color: "rgba(255,45,32,0.5)", textDecoration: "none" }}>← Вернуться в MarketOS</a>
        </div>
      </div>
    </div>
  );
}
