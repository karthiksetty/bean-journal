"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uumvzroswrgqmaeoqajc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXZ6cm9zd3JncW1hZW9xYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODAwMDksImV4cCI6MjA4ODY1NjAwOX0.IPfyrSTzVa8gVjAj1wk8KUwDd19_RzBonXOLXxofw0I"
);

const PROCESS_COLORS = {
  "Washed":                  "#3A6B52",
  "Natural":                 "#8B4F1E",
  "Co-fermented":            "#5C4A7A",
  "Natural & Thermal Shock": "#7A4030",
  "Osmotic Dehydration":     "#2D5A7A",
};

const AROMA_CATEGORIES = [
  { label: "Berry & Cherry",   color: "#C0344D", keywords: ["berry","blueberry","raspberry","strawberry","cherry","blackberry","cranberry","redcurrant","wine gum","red plum","wild cherry","sour cherry","sweet cherry"] },
  { label: "Caramel & Sweet",  color: "#92400E", keywords: ["caramel","toffee","brown sugar","molasses","honey","nougat","butterscotch","vanilla","cream","butter","cake","pie","biscuit","pastry","blueberry pie","raspberry ripple","ice cream"] },
  { label: "Tropical",         color: "#065F46", keywords: ["tropical","mango","guava","lychee","passion","pineapple","papaya","coconut","watermelon","melon","yellow melon","watermelon candy","tropical sweet","tropical fruits"] },
  { label: "Stone Fruit",      color: "#C2410C", keywords: ["stone fruit","peach","apricot","plum","nectarine"] },
  { label: "Citrus",           color: "#B45309", keywords: ["citrus","orange","lime","lemon","grapefruit","tangerine","blood orange","yuzu","pink lemonade"] },
  { label: "Wine & Ferment",   color: "#5B21B6", keywords: ["wine","winey","ferment","cider","amaretto","cherry coke","tonka"] },
  { label: "Floral",           color: "#9D174D", keywords: ["floral","rose","jasmine","blossom","orange blossom","hibiscus","lavender","elderflower"] },
  { label: "Spice",            color: "#78350F", keywords: ["spice","nutmeg","cinnamon","cardamom","clove","pepper","ginger","sweet spices"] },
  { label: "Tea & Herbal",     color: "#047857", keywords: ["tea","black tea","green tea","oolong","iced tea","herbal"] },
  { label: "Chocolate",        color: "#3D1C02", keywords: ["chocolate","cocoa","cacao","dark chocolate","milk chocolate","mocha"] },
];

const COUNTRY_FLAGS = {
  "Colombia": "🇨🇴", "Ethiopia": "🇪🇹", "Kenya": "🇰🇪", "Mexico": "🇲🇽",
  "Peru": "🇵🇪", "Guatemala": "🇬🇹", "Brazil": "🇧🇷", "Rwanda": "🇷🇼",
  "Tanzania": "🇹🇿", "Yemen": "🇾🇪", "India": "🇮🇳", "Honduras": "🇭🇳",
  "Costa Rica": "🇨🇷", "Panama": "🇵🇦", "Bolivia": "🇧🇴", "Nicaragua": "🇳🇮",
  "El Salvador": "🇸🇻", "Indonesia": "🇮🇩", "Ecuador": "🇪🇨",
};

function toLocalDateStr(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function daysBetween(date) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(date); d.setHours(0,0,0,0);
  return Math.round((today - d) / 86400000);
}

function cupColor(cups) {
  if (cups === 0) return "#F0EAE0";
  if (cups === 1) return "#C4A882";
  if (cups === 2) return "#6B4226";
  return "#2C1810";
}

export default function StatsPage() {
  const [beans, setBeans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [range, setRange] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("beans").select("id, name, brand, process, region, aroma, available"),
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
  const beanMap = Object.fromEntries(beans.map(b => [b.id, b]));

  // ── Summary ────────────────────────────────────────────────────────────────
  const cupsThisMonth = logs.filter(l => new Date(l.logged_at) >= startOfMonth).length;
  const daysElapsed = Math.max(1, today.getDate());
  const avgPerDay = (cupsThisMonth / daysElapsed).toFixed(1);

  // Favourite bean (all-time most logged)
  const allCountMap = {};
  for (const l of logs) allCountMap[l.bean_id] = (allCountMap[l.bean_id] || 0) + 1;
  const favEntry = Object.entries(allCountMap).sort((a, b) => b[1] - a[1])[0];
  const favBeanName = favEntry ? (beanMap[favEntry[0]]?.name ?? "—") : "—";
  // Shorten long names for the tile
  const favShort = favBeanName.length > 16 ? favBeanName.split(" ").slice(0, 2).join(" ") : favBeanName;

  // ── Heatmap ────────────────────────────────────────────────────────────────
  const WEEKS = 14;
  // Build cups-per-day map
  const cupsPerDay = {};
  for (const l of logs) {
    const k = toLocalDateStr(l.logged_at);
    cupsPerDay[k] = (cupsPerDay[k] || 0) + 1;
  }
  // Build grid: 14 complete Mon–Sun weeks, last week = current week
  const todayDow = (today.getDay() + 6) % 7; // 0=Mon, 6=Sun
  const gridStart = new Date(today);
  gridStart.setDate(today.getDate() - todayDow - (WEEKS - 1) * 7);

  const grid = []; // array of columns (weeks), each column has 7 day objects
  let monthLabels = []; // { col, label }
  let lastMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + w * 7 + d);
      const key = toLocalDateStr(date);
      const cups = cupsPerDay[key] || 0;
      const isFuture = date > today;
      col.push({ date, key, cups, isFuture });
      if (d === 0 && date.getMonth() !== lastMonth) {
        monthLabels.push({ col: w, label: date.toLocaleDateString("en-GB", { month: "short" }) });
        lastMonth = date.getMonth();
      }
    }
    grid.push(col);
  }

  // ── Most drunk ─────────────────────────────────────────────────────────────
  const filteredLogs = range === "month"
    ? logs.filter(l => new Date(l.logged_at) >= startOfMonth)
    : logs;
  const countMap = {};
  for (const l of filteredLogs) countMap[l.bean_id] = (countMap[l.bean_id] || 0) + 1;
  const ranked = Object.entries(countMap)
    .map(([id, count]) => ({ bean: beanMap[id], count }))
    .filter(x => x.bean)
    .sort((a, b) => b.count - a.count);
  const maxCount = ranked[0]?.count || 1;

  // ── Process breakdown ──────────────────────────────────────────────────────
  const processCups = {};
  for (const l of logs) {
    const proc = beanMap[l.bean_id]?.process;
    if (proc) processCups[proc] = (processCups[proc] || 0) + 1;
  }
  const totalProcessCups = Object.values(processCups).reduce((s, v) => s + v, 0) || 1;
  const processRanked = Object.entries(processCups)
    .map(([proc, count]) => ({ proc, count, pct: Math.round((count / totalProcessCups) * 100) }))
    .sort((a, b) => b.count - a.count);

  // ── Origin breakdown ───────────────────────────────────────────────────────
  const countryCups = {};
  for (const l of logs) {
    const regions = beanMap[l.bean_id]?.region || [];
    const countries = [...new Set(regions.map(r => r.split(",").at(-1).trim()))];
    for (const c of countries) {
      if (c) countryCups[c] = (countryCups[c] || 0) + 1;
    }
  }
  const originRanked = Object.entries(countryCups)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  // ── Flavour profile ────────────────────────────────────────────────────────
  const flavourCounts = {};
  for (const l of logs) {
    const aromas = beanMap[l.bean_id]?.aroma || [];
    const matched = new Set();
    for (const aroma of aromas) {
      const lower = aroma.toLowerCase();
      for (const cat of AROMA_CATEGORIES) {
        if (!matched.has(cat.label) && cat.keywords.some(k => lower.includes(k))) {
          flavourCounts[cat.label] = (flavourCounts[cat.label] || 0) + 1;
          matched.add(cat.label);
        }
      }
    }
  }
  const flavourRanked = AROMA_CATEGORIES
    .map(cat => ({ ...cat, count: flavourCounts[cat.label] || 0 }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxFlavour = flavourRanked[0]?.count || 1;

  // ── Neglected ──────────────────────────────────────────────────────────────
  const lastDrunkMap = {};
  for (const l of logs) {
    if (!lastDrunkMap[l.bean_id]) lastDrunkMap[l.bean_id] = l.logged_at;
  }
  const neglected = beans
    .filter(b => b.available !== false)
    .map(b => ({ bean: b, lastDays: lastDrunkMap[b.id] ? daysBetween(lastDrunkMap[b.id]) : null }))
    .filter(x => x.lastDays === null || x.lastDays >= 7)
    .sort((a, b) => (b.lastDays ?? 999) - (a.lastDays ?? 999));

  // ── Recent days ────────────────────────────────────────────────────────────
  const recentDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toLocalDateStr(d);
    const dayLogs = logs.filter(l => toLocalDateStr(l.logged_at) === key);
    const beanNames = dayLogs.map(l => beanMap[l.bean_id]?.name).filter(Boolean);
    recentDays.push({ date: d, key, beans: beanNames });
  }

  const card = { background: "#fff", borderRadius: 16, border: "1px solid #EDE5D8", padding: 16, marginBottom: 16 };
  const cardTitle = { fontWeight: 600, fontSize: 15, marginBottom: 14 };

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
          <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" style={{ textDecoration: "none", color: "#A0896B", fontSize: 13, fontWeight: 500 }}>← Beans</a>
            <span style={{ color: "#EDE5D8" }}>|</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>Stats</span>
          </div>
        </div>

        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "28px 20px 60px" }}>

          {/* ── Summary tiles ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              {
                label: "Cups this month", value: cupsThisMonth,
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>,
              },
              {
                label: "Avg / day", value: avgPerDay,
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
              },
              {
                label: "Favourite", value: favShort,
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
              },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "14px 10px", border: "1px solid #EDE5D8", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: s.label === "Favourite" ? 13 : 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", lineHeight: 1.2, wordBreak: "break-word" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#A0896B", marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Activity Heatmap ── */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={cardTitle}>Activity</div>
              <span style={{ fontSize: 11, color: "#A0896B" }}>Last {WEEKS} weeks</span>
            </div>

            <div style={{ display: "flex" }}>
              {/* Day labels */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 6, paddingTop: 20 }}>
                {["M", "", "W", "", "F", "", ""].map((d, i) => (
                  <div key={i} style={{ fontSize: 10, color: "#A0896B", height: 13, lineHeight: "13px", width: 10, textAlign: "right" }}>{d}</div>
                ))}
              </div>

              <div style={{ flex: 1, overflow: "hidden" }}>
                {/* Month labels */}
                <div style={{ display: "flex", marginBottom: 4, height: 16, position: "relative" }}>
                  {monthLabels.map(({ col, label }) => (
                    <div key={label} style={{ position: "absolute", left: col * 16, fontSize: 10, color: "#A0896B" }}>{label}</div>
                  ))}
                </div>

                {/* Grid */}
                <div style={{ display: "flex", gap: 3 }}>
                  {grid.map((col, w) => (
                    <div key={w} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {col.map((cell, d) => (
                        <div
                          key={d}
                          title={cell.isFuture ? "" : `${cell.date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}: ${cell.cups} cup${cell.cups !== 1 ? "s" : ""}`}
                          style={{ width: 13, height: 13, borderRadius: 2, background: cell.isFuture ? "transparent" : cupColor(cell.cups), flexShrink: 0 }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, justifyContent: "flex-end" }}>
              <span style={{ fontSize: 10, color: "#A0896B" }}>0</span>
              {["#F0EAE0", "#C4A882", "#6B4226", "#2C1810"].map((bg, i) => (
                <div key={i} style={{ width: 13, height: 13, borderRadius: 2, background: bg }} />
              ))}
              <span style={{ fontSize: 10, color: "#A0896B" }}>3+</span>
            </div>
          </div>

          {/* ── Process Breakdown ── */}
          {processRanked.length > 0 && (
            <div style={card}>
              <div style={cardTitle}>Process Breakdown</div>
              {processRanked.map((row, i) => {
                const color = PROCESS_COLORS[row.proc] || "#C4A882";
                return (
                  <div key={row.proc} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < processRanked.length - 1 ? 10 : 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, fontWeight: 500, width: 160, flexShrink: 0 }}>{row.proc}</div>
                    <div style={{ flex: 1, height: 6, background: "#F0EAE0", borderRadius: 3 }}>
                      <div style={{ width: `${row.pct}%`, height: "100%", borderRadius: 3, background: color }} />
                    </div>
                    <div style={{ fontSize: 12, color: "#888", width: 32, textAlign: "right", flexShrink: 0 }}>{row.pct}%</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Origin Breakdown ── */}
          {originRanked.length > 0 && (
            <div style={card}>
              <div style={cardTitle}>Origin Breakdown</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {originRanked.map(({ country, count }) => (
                  <div key={country} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F5EFE6", padding: "6px 12px", borderRadius: 20 }}>
                    <span style={{ fontSize: 16 }}>{COUNTRY_FLAGS[country] || "🌍"}</span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{country}</span>
                    <span style={{ fontSize: 11, color: "#A0896B", background: "#EDE5D8", padding: "1px 7px", borderRadius: 10 }}>{count} cup{count !== 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Flavour Profile ── */}
          {flavourRanked.length > 0 && (
            <div style={card}>
              <div style={cardTitle}>Flavour Profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {flavourRanked.map(({ label, color, count }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, flex: 1 }}>{label}</div>
                    <div style={{ width: 55, height: 5, background: "#F0EAE0", borderRadius: 3, flexShrink: 0 }}>
                      <div style={{ width: `${(count / maxFlavour) * 100}%`, height: "100%", borderRadius: 3, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #F0EAE0", fontSize: 11, color: "#A0896B" }}>
                Based on aroma tags across all logged cups
              </div>
            </div>
          )}

          {/* ── Most Drunk ── */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={cardTitle}>Most Drunk</div>
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
              <div key={row.bean.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < ranked.length - 1 ? 10 : 0 }}>
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

          {/* ── Neglected Beans ── */}
          {neglected.length > 0 && (
            <div style={card}>
              <div style={cardTitle}>Neglected Beans</div>
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

          {/* ── Recent Days ── */}
          <div style={{ ...card, marginBottom: 0 }}>
            <div style={cardTitle}>Recent Days</div>
            {recentDays.map((day, i) => (
              <div key={day.key} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, marginBottom: i < recentDays.length - 1 ? 10 : 0, borderBottom: i < recentDays.length - 1 ? "1px solid #F5F0EA" : "none" }}>
                <div style={{ fontSize: 12, color: "#A0896B", width: 76, flexShrink: 0 }}>
                  {day.date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
                  {day.beans.length === 0
                    ? <span style={{ fontSize: 12, color: "#D4C4B0" }}>—</span>
                    : day.beans.map((name, j) => (
                      <span key={j} style={{ fontSize: 12, background: "#F5F0EA", color: "#2C1810", padding: "3px 10px", borderRadius: 12 }}>{name}</span>
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
