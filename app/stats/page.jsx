"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uumvzroswrgqmaeoqajc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXZ6cm9zd3JncW1hZW9xYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODAwMDksImV4cCI6MjA4ODY1NjAwOX0.IPfyrSTzVa8gVjAj1wk8KUwDd19_RzBonXOLXxofw0I"
);

function daysBetween(date) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(date); d.setHours(0,0,0,0);
  return Math.round((today - d) / 86400000);
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" });
}

function toLocalDateStr(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export default function StatsPage() {
  const [beans, setBeans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [range, setRange] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("beans").select("id, name, brand"),
      supabase.from("drink_logs").select("bean_id, logged_at").order("logged_at", { ascending: false }),
    ]).then(([{ data: beanData }, { data: logData }]) => {
      setBeans(beanData || []);
      setLogs(logData || []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAF7F2", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#A0896B" }}>
      Loading…
    </div>
  );

  const today = new Date(); today.setHours(0,0,0,0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Filter logs for range
  const filteredLogs = range === "month"
    ? logs.filter(l => new Date(l.logged_at) >= startOfMonth)
    : logs;

  // Cups this month
  const cupsThisMonth = logs.filter(l => new Date(l.logged_at) >= startOfMonth).length;

  // Beans tried this month
  const beansThisMonth = new Set(logs.filter(l => new Date(l.logged_at) >= startOfMonth).map(l => l.bean_id)).size;

  // Streak — consecutive days with at least one log up to today
  const logDays = new Set(logs.map(l => toLocalDateStr(l.logged_at)));
  let streak = 0;
  const check = new Date(today);
  while (true) {
    const key = `${check.getFullYear()}-${String(check.getMonth()+1).padStart(2,"0")}-${String(check.getDate()).padStart(2,"0")}`;
    if (!logDays.has(key)) break;
    streak++;
    check.setDate(check.getDate() - 1);
  }

  // Most drunk — count per bean in range
  const countMap = {};
  for (const l of filteredLogs) {
    countMap[l.bean_id] = (countMap[l.bean_id] || 0) + 1;
  }
  const beanMap = Object.fromEntries(beans.map(b => [b.id, b]));
  const ranked = Object.entries(countMap)
    .map(([id, count]) => ({ bean: beanMap[id], count }))
    .filter(x => x.bean)
    .sort((a, b) => b.count - a.count);
  const maxCount = ranked[0]?.count || 1;

  // Last drunk per bean (all time)
  const lastDrunkMap = {};
  for (const l of logs) {
    if (!lastDrunkMap[l.bean_id]) lastDrunkMap[l.bean_id] = l.logged_at;
  }

  // Neglected: beans that exist in DB but haven't been drunk in 7+ days (or never)
  const neglected = beans
    .map(b => ({ bean: b, lastDays: lastDrunkMap[b.id] ? daysBetween(lastDrunkMap[b.id]) : null }))
    .filter(x => x.lastDays === null || x.lastDays >= 7)
    .sort((a, b) => (b.lastDays ?? 999) - (a.lastDays ?? 999));

  // Recent days — last 7 days
  const recentDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toLocalDateStr(d);
    const dayLogs = logs.filter(l => toLocalDateStr(l.logged_at) === key);
    const beanNames = dayLogs.map(l => beanMap[l.bean_id]?.name).filter(Boolean);
    recentDays.push({ date: d, key, beans: beanNames });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAF7F2; }
      `}</style>
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAF7F2", minHeight: "100vh", color: "#2C1810" }}>

        {/* Header */}
        <div style={{ background: "#FEFCF8", borderBottom: "1px solid #EDE5D8", padding: "24px 40px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <a href="/" style={{ textDecoration: "none", color: "#A0896B", fontSize: 13, fontWeight: 500 }}>← Beans</a>
              <span style={{ color: "#EDE5D8" }}>|</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>Stats</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "28px 20px 60px" }}>

          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Cups this month", value: cupsThisMonth },
              { label: "Beans tried", value: `${beansThisMonth} of ${beans.length}` },
              { label: "Day streak", value: streak > 0 ? `${streak} 🔥` : "—" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "14px 10px", border: "1px solid #EDE5D8", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#A0896B", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Most drunk */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDE5D8", padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Most Drunk</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["month", "all time"].map(r => (
                  <button key={r} onClick={() => setRange(r)} style={{
                    padding: "3px 10px", borderRadius: 12, border: "1px solid #EDE5D8", cursor: "pointer",
                    background: range === r ? "#2C1810" : "transparent",
                    color: range === r ? "#fff" : "#A0896B", fontSize: 11, fontFamily: "'DM Sans', sans-serif"
                  }}>{r}</button>
                ))}
              </div>
            </div>
            {ranked.length === 0 ? (
              <div style={{ color: "#C4B99A", fontSize: 13, textAlign: "center", padding: "16px 0" }}>No cups logged {range === "month" ? "this month" : "yet"}</div>
            ) : ranked.map((row, i) => (
              <div key={row.bean.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 18, fontSize: 12, color: "#C4B99A", textAlign: "right", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.bean.name}</div>
                  <div style={{ fontSize: 11, color: "#A0896B" }}>{row.bean.brand}</div>
                </div>
                <div style={{ width: 80, height: 6, background: "#F0EAE0", borderRadius: 3, flexShrink: 0 }}>
                  <div style={{ width: `${(row.count / maxCount) * 100}%`, height: "100%", background: "#C4A882", borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 12, color: "#888", width: 24, textAlign: "right", flexShrink: 0 }}>{row.count}</div>
              </div>
            ))}
          </div>

          {/* Neglected beans */}
          {neglected.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDE5D8", padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Neglected Beans</div>
              {neglected.map(({ bean, lastDays }) => (
                <div key={bean.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{bean.name}</div>
                    <div style={{ fontSize: 11, color: "#A0896B" }}>{bean.brand}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#c0392b", background: "#fdf0ee", padding: "3px 10px", borderRadius: 12, flexShrink: 0 }}>
                    {lastDays === null ? "Never" : `${lastDays}d ago`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent days */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDE5D8", padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Recent Days</div>
            {recentDays.map(day => (
              <div key={day.key} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid #F5F0EA" }}>
                <div style={{ fontSize: 12, color: "#A0896B", width: 76, flexShrink: 0 }}>
                  {day.date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
                  {day.beans.length === 0
                    ? <span style={{ fontSize: 12, color: "#D4C4B0" }}>—</span>
                    : day.beans.map((name, i) => (
                      <span key={i} style={{ fontSize: 12, background: "#F5F0EA", color: "#2C1810", padding: "3px 10px", borderRadius: 12 }}>{name}</span>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
