"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase-browser";
import { FAM, processFamily, lastDrunkLabel } from "../lib/poster";
import HowBuilt from "../lib/HowBuilt";
import { dbToBean, beanToDb } from "../lib/beans";
import DetailModal from "../collection/DetailModal";
import AddBeanModal from "../collection/BeanForm";

const AROMA_CATEGORIES = [
  { label: "Berry & Cherry",   color: "#D2483A", keywords: ["berry","blueberry","raspberry","strawberry","cherry","blackberry","cranberry","redcurrant","wine gum","red plum","wild cherry","sour cherry","sweet cherry"] },
  { label: "Caramel & Sweet",  color: "#D9A441", keywords: ["caramel","toffee","brown sugar","molasses","honey","nougat","butterscotch","vanilla","cream","butter","cake","pie","biscuit","pastry","blueberry pie","raspberry ripple","ice cream"] },
  { label: "Tropical",         color: "#9DB0A8", keywords: ["tropical","mango","guava","lychee","passion","pineapple","papaya","coconut","watermelon","melon","yellow melon","watermelon candy","tropical sweet","tropical fruits"] },
  { label: "Stone Fruit",      color: "#A47B60", keywords: ["stone fruit","peach","apricot","plum","nectarine"] },
  { label: "Citrus",           color: "#D9A99B", keywords: ["citrus","orange","lime","lemon","grapefruit","tangerine","blood orange","yuzu","pink lemonade"] },
  { label: "Wine & Ferment",   color: "#5A2A22", keywords: ["wine","winey","ferment","cider","amaretto","cherry coke","tonka"] },
  { label: "Floral",           color: "#D2483A", keywords: ["floral","rose","jasmine","blossom","orange blossom","hibiscus","lavender","elderflower"] },
  { label: "Spice",            color: "#D9A441", keywords: ["spice","nutmeg","cinnamon","cardamom","clove","pepper","ginger","sweet spices"] },
  { label: "Tea & Herbal",     color: "#9DB0A8", keywords: ["tea","black tea","green tea","oolong","iced tea","herbal"] },
  { label: "Chocolate",        color: "#A47B60", keywords: ["chocolate","cocoa","cacao","dark chocolate","milk chocolate","mocha"] },
];

const HEAT = ["#F3ECDD", "#D9A99B", "#D2483A", "#5A2A22"];
const WEEKS = 26;
const TOP = 5;

function dayKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysSince(date) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  return Math.round((today - d) / 86400000);
}

function top(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, TOP);
}

function delta(diff, digits, versus) {
  if (diff === 0) return `Same as ${versus}`;
  return `${diff > 0 ? "▲" : "▼"} ${Math.abs(diff).toFixed(digits)} vs ${versus}`;
}

// Lets a tile shrink its type so the longest word of a bean name fits on one line.
const longest = name => ({ "--w": Math.max(...(name || "None").split(/\s+/).map(w => w.length)) });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Space+Grotesk:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .ps { min-height: 100vh; color: #161210; font-family: 'Space Grotesk', sans-serif; --tf: 'Righteous'; background: #E9E3D6 url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix values=%220 0 0 0 0.1 0 0 0 0 0.07 0 0 0 0 0.05 0 0 0 0.22 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E'); }
  .ps button { cursor: pointer; font-family: 'Space Grotesk', sans-serif; }
  .ps-top { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 max(20px, calc((100% - 1180px) / 2)); background: #161210; color: #F3ECDD; }
  .ps-top a { color: #F3ECDD; text-decoration: none; font: 400 clamp(20px, 5vw, 28px)/1 var(--tf); letter-spacing: .06em; text-transform: uppercase; }
  .ps-top a:hover { color: #D9A441; }
  .ps-mono { font: 500 11px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .ps-wrap { max-width: 1180px; margin: 0 auto; padding: clamp(24px, 4vw, 48px) 20px 80px; }
  .ps-wrap > h1 { font: 400 clamp(56px, 10vw, 120px)/0.86 var(--tf); letter-spacing: .03em; text-transform: uppercase; }
  .ps-msg { padding: 80px 20px; text-align: center; font: 400 clamp(26px, 4vw, 40px)/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; }

  .ps-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-top: 28px; }
  .ps-tile { display: flex; flex-direction: column; gap: 8px; min-height: 170px; padding: 16px 16px 18px; border: 6px solid #161210; }
  .ps-tile.light { color: #F3ECDD; }
  .ps-big { margin-top: auto; font: 400 clamp(44px, 6vw, 68px)/0.9 var(--tf); letter-spacing: .02em; text-transform: uppercase; overflow-wrap: break-word; }
  .ps-tile { container-type: inline-size; }
  .ps-big.name { font-size: max(18px, min(34px, calc(100cqi / (var(--w, 8) * 0.76)))); }
  .ps-delta { align-self: flex-start; padding: 4px 8px; background: #161210; color: #F3ECDD; font: 500 11px 'DM Mono', monospace; letter-spacing: .06em; }
  .ps-tile.light .ps-delta { background: #F3ECDD; color: #161210; }

  .ps-panel { margin-top: 30px; padding: 20px 22px 22px; background: #F3ECDD; border: 10px solid #161210; box-shadow: 0 18px 36px rgba(22,18,16,.18); }
  .ps-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 2px solid #161210; }
  .ps-head h2 { font: 400 clamp(24px, 3vw, 34px)/1 var(--tf); letter-spacing: .05em; text-transform: uppercase; }
  .ps-two { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: 0 30px; align-items: start; }
  .ps-foot { display: flex; justify-content: flex-end; margin-top: 36px; }
  .ps-none { font: 500 12px 'DM Mono', monospace; }
  .ps-toggle { display: flex; }
  .ps-toggle button { padding: 8px 14px; border: 2px solid #161210; background: #F3ECDD; color: #161210; font: 700 13px 'Space Grotesk', sans-serif; }
  .ps-toggle button + button { border-left: none; }
  .ps-toggle button.on { background: #161210; color: #F3ECDD; }

  .ps-heat { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; }
  .ps-days { display: grid; grid-template-rows: repeat(7, 18px); gap: 4px; padding-top: 22px; }
  .ps-days span, .ps-weeks em { font: 500 10px/18px 'DM Mono', monospace; font-style: normal; }
  .ps-weeks { display: grid; grid-auto-flow: column; grid-template-rows: 18px repeat(7, 18px); gap: 4px; }
  .ps-weeks em { width: 18px; white-space: nowrap; }
  .ps-weeks i { width: 18px; height: 18px; display: block; outline: 1.5px solid #161210; outline-offset: -1.5px; }
  .ps-weeks i.future { outline: none; background: none; }
  .ps-legend { display: flex; align-items: center; gap: 6px; margin-top: 12px; }
  .ps-legend i { width: 14px; height: 14px; display: block; outline: 1.5px solid #161210; outline-offset: -1.5px; }

  .ps-bar { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr) 44px; align-items: center; gap: 12px; padding: 7px 0; }
  .ps-bar b { font: 700 14px/1.2 'Space Grotesk', sans-serif; overflow-wrap: anywhere; }
  .ps-track { height: 22px; border: 2px solid #161210; background: #FBF7EE; }
  .ps-fill { height: 100%; border-right: 2px solid #161210; }
  .ps-n { font: 500 12px 'DM Mono', monospace; text-align: right; }

  .ps-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1.5px dashed #161210; }
  .ps-row:last-child { border-bottom: none; }
  .ps-row b { font: 700 15px/1.25 'Space Grotesk', sans-serif; }
  .ps-row small { display: block; margin-top: 2px; font: 500 11px 'DM Mono', monospace; }
  .ps-chip { flex: none; padding: 5px 9px; background: #161210; color: #F3ECDD; font: 500 11px 'DM Mono', monospace; letter-spacing: .04em; }
  .ps-rate { flex: none; display: flex; }
  .ps-rate button { width: 30px; height: 36px; display: flex; align-items: center; justify-content: center; border: none; background: none; color: #161210; }
  .ps-rate button span { width: 16px; height: 22px; border: 2.5px solid currentColor; border-top: none; border-radius: 0 0 4px 4px; display: block; }
  .ps-rate button:hover span, .ps-rate button:has(~ button:hover) span { background: #D9A441; }

  .ps-next { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; }
  .ps-next button { display: block; padding: 0 12px 12px; border: 2.5px solid #161210; background: none; color: #161210; text-align: left; }
  .ps-next button:hover { background: #161210; color: #F3ECDD; }
  .ps-next i { display: block; height: 10px; margin: 0 -12px 10px; border-bottom: 2.5px solid #161210; }
  .ps-next b { display: block; font: 400 18px/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; overflow-wrap: break-word; }
  .ps-next small { display: block; margin-top: 6px; font: 500 11px 'DM Mono', monospace; }
  @media (max-width: 480px) { .ps-bar { grid-template-columns: minmax(0, 104px) minmax(0, 1fr) 38px; gap: 8px; } }
`;

function Bars({ rows, unit = "" }) {
  if (rows.length === 0) return <p className="ps-none">Nothing logged yet</p>;
  const max = Math.max(...rows.map(r => r.value));
  return rows.map(r => (
    <div className="ps-bar" key={r.label}>
      <b>{r.label}</b>
      <div className="ps-track"><div className="ps-fill" style={{ width: `${Math.round(r.value / max * 100)}%`, background: r.color || "#161210" }} /></div>
      <span className="ps-n">{r.value}{unit}</span>
    </div>
  ));
}

export default function StatsPage() {
  const [beans, setBeans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [range, setRange] = useState("month");
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [editBean, setEditBean] = useState(null);

  useEffect(() => {
    Promise.all([
      supabase.from("beans").select("*"),
      supabase.from("drink_logs").select("bean_id, logged_at").order("logged_at", { ascending: false }),
    ]).then(([{ data: beanData }, { data: logData }]) => {
      setBeans((beanData || []).map(dbToBean));
      setLogs(logData || []);
      setLoading(false);
    });
  }, []);

  const patchBean = (id, changes) => setBeans(prev => prev.map(b => b.id === id ? { ...b, ...changes } : b));

  const rate = async (bean, rating) => {
    const { error } = await supabase.from("beans").update({ my_rating: rating }).eq("id", bean.id);
    if (!error) patchBean(bean.id, { myRating: rating });
  };

  const toggleAvailability = async (bean) => {
    const available = bean.available === false;
    const { error } = await supabase.from("beans").update({ available }).eq("id", bean.id);
    if (!error) patchBean(bean.id, { available });
  };

  const saveEdit = async (bean) => {
    const { error } = await supabase.from("beans").update(beanToDb(bean)).eq("id", bean.id);
    if (!error) patchBean(bean.id, bean);
  };

  const deleteBean = async (id) => {
    const { error } = await supabase.from("beans").delete().eq("id", id);
    if (!error) {
      setBeans(prev => prev.filter(b => b.id !== id));
      setOpenId(null);
    }
  };

  const frame = content => (
    <div className="ps">
      <style>{css}</style>
      <header className="ps-top"><a href="/collection">Bean Journal</a><span className="ps-mono">Stats</span></header>
      {content}
    </div>
  );

  if (loading) return frame(<div className="ps-msg">Loading…</div>);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const beanMap = Object.fromEntries(beans.map(b => [b.id, b]));
  const famOf = bean => FAM[processFamily(bean.process)];
  const roasterOf = bean => bean.brand && bean.brand !== "—" ? bean.brand : "";

  // This month against last month
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastName = lastStart.toLocaleDateString("en-GB", { month: "short" });
  const dayOfMonth = today.getDate();
  const monthLogs = logs.filter(l => new Date(l.logged_at) >= monthStart);
  const lastLogs = logs.filter(l => { const d = new Date(l.logged_at); return d >= lastStart && d < monthStart; });
  const lastSamePoint = lastLogs.filter(l => new Date(l.logged_at).getDate() <= dayOfMonth).length;
  const perDay = monthLogs.length / dayOfMonth;
  const lastPerDay = lastLogs.length / new Date(today.getFullYear(), today.getMonth(), 0).getDate();

  const cupCount = list => { const m = {}; for (const l of list) m[l.bean_id] = (m[l.bean_id] || 0) + 1; return m; };
  const allCups = cupCount(logs);
  const monthCups = cupCount(monthLogs);
  const favourite = counts => {
    const [id, cups] = Object.entries(counts).filter(([id]) => beanMap[id]).sort((a, b) => b[1] - a[1])[0] || [];
    return id ? { name: beanMap[id].name, cups } : null;
  };
  const monthFav = favourite(monthCups);
  const allFav = favourite(allCups);

  // Heatmap: the last 26 weeks, Monday first
  const perDayCups = {};
  for (const l of logs) { const k = dayKey(l.logged_at); perDayCups[k] = (perDayCups[k] || 0) + 1; }
  const gridStart = new Date(today);
  gridStart.setDate(today.getDate() - ((today.getDay() + 6) % 7) - (WEEKS - 1) * 7);
  const weeks = [];
  let shownMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + w * 7 + d);
      days.push({ date, cups: perDayCups[dayKey(date)] || 0, future: date > today });
    }
    const month = days[0].date.getMonth();
    weeks.push({ days, label: month !== shownMonth ? days[0].date.toLocaleDateString("en-GB", { month: "short" }) : "" });
    shownMonth = month;
  }

  // Bar charts
  const mostDrunk = top(range === "month" ? monthCups : allCups)
    .filter(([id]) => beanMap[id])
    .map(([id, value]) => ({ label: beanMap[id].name, value, color: famOf(beanMap[id]).tile }));

  const famCups = {}, roasterCups = {}, countryCups = {}, flavourCups = {};
  let counted = 0;
  for (const l of logs) {
    const bean = beanMap[l.bean_id];
    if (!bean) continue;
    counted++;
    const fam = processFamily(bean.process);
    famCups[fam] = (famCups[fam] || 0) + 1;
    const roaster = roasterOf(bean);
    if (roaster) roasterCups[roaster] = (roasterCups[roaster] || 0) + 1;
    for (const c of new Set((bean.region || []).map(r => r.split(",").at(-1).trim()).filter(Boolean))) countryCups[c] = (countryCups[c] || 0) + 1;
    const lower = (bean.aroma || []).map(a => a.toLowerCase());
    for (const cat of AROMA_CATEGORIES) {
      if (lower.some(a => cat.keywords.some(k => a.includes(k)))) flavourCups[cat.label] = (flavourCups[cat.label] || 0) + 1;
    }
  }
  const processRows = Object.entries(famCups).sort((a, b) => b[1] - a[1])
    .map(([fam, n]) => ({ label: FAM[fam].label, value: Math.round(n / counted * 100), color: FAM[fam].tile }));
  const plain = counts => top(counts).map(([label, value]) => ({ label, value }));
  const flavourRows = top(flavourCups).map(([label, value]) => ({ label, value, color: AROMA_CATEGORIES.find(c => c.label === label).color }));

  // Ratings
  const withCups = beans.map(b => ({ bean: b, cups: allCups[b.id] || 0 }));
  const rated = withCups.filter(x => x.bean.myRating > 0);
  const topRated = [...rated].sort((a, b) => b.bean.my_rating - a.bean.my_rating || b.cups - a.cups).slice(0, TOP);
  const toRate = withCups.filter(x => !(x.bean.myRating > 0) && x.cups > 0).sort((a, b) => b.cups - a.cups).slice(0, TOP);
  const sub = x => [roasterOf(x.bean), `${x.cups} cup${x.cups === 1 ? "" : "s"}`].filter(Boolean).join(" · ");

  // Drink next: in stock and not drunk for a week or more, never-logged first
  const lastDrunk = {};
  for (const l of logs) if (!lastDrunk[l.bean_id]) lastDrunk[l.bean_id] = l.logged_at;
  const openBean = beans.find(b => b.id === openId) || null;
  const drinkNext = beans
    .filter(b => b.available !== false)
    .map(b => ({ bean: b, days: lastDrunk[b.id] ? daysSince(lastDrunk[b.id]) : null }))
    .filter(x => x.days === null || x.days >= 7)
    .sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity));

  return frame(
    <div className="ps-wrap">
      <h1>Stats</h1>

      <div className="ps-tiles">
        <div className="ps-tile light" style={{ background: "#D2483A" }}>
          <span className="ps-mono">Cups this month</span>
          <span className="ps-big">{monthLogs.length}</span>
          <span className="ps-delta">{delta(monthLogs.length - lastSamePoint, 0, `same days in ${lastName}`)}</span>
        </div>
        <div className="ps-tile" style={{ background: "#D9A441" }}>
          <span className="ps-mono">Per day this month</span>
          <span className="ps-big">{perDay.toFixed(1)}</span>
          <span className="ps-delta">{delta(Number((perDay - lastPerDay).toFixed(1)), 1, lastName)}</span>
        </div>
        <div className="ps-tile" style={{ background: "#9DB0A8" }}>
          <span className="ps-mono">Favourite this month</span>
          <span className="ps-big name" style={longest(monthFav?.name)}>{monthFav ? monthFav.name : "None yet"}</span>
          {monthFav && <span className="ps-delta">{monthFav.cups} cup{monthFav.cups === 1 ? "" : "s"}</span>}
        </div>
        <div className="ps-tile light" style={{ background: "#5A2A22" }}>
          <span className="ps-mono">All-time favourite</span>
          <span className="ps-big name" style={longest(allFav?.name)}>{allFav ? allFav.name : "None yet"}</span>
          {allFav && <span className="ps-delta">{allFav.cups} cup{allFav.cups === 1 ? "" : "s"}</span>}
        </div>
      </div>

      <div className="ps-panel">
        <div className="ps-head"><h2>Activity</h2><span className="ps-mono">Last 6 months</span></div>
        <div className="ps-heat">
          <div className="ps-days">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
          <div className="ps-weeks">
            {weeks.map((week, w) => [
              <em key={`m${w}`}>{week.label}</em>,
              ...week.days.map((day, d) => day.future
                ? <i key={`${w}-${d}`} className="future" />
                : <i key={`${w}-${d}`} style={{ background: HEAT[Math.min(day.cups, 3)] }} title={`${day.date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}: ${day.cups} cup${day.cups === 1 ? "" : "s"}`} />),
            ])}
          </div>
        </div>
        <div className="ps-legend"><span className="ps-mono">0</span>{HEAT.map(c => <i key={c} style={{ background: c }} />)}<span className="ps-mono">3+ cups</span></div>
      </div>

      <div className="ps-panel">
        <div className="ps-head">
          <h2>Most drunk</h2>
          <div className="ps-toggle">
            <button type="button" className={range === "month" ? "on" : ""} aria-pressed={range === "month"} onClick={() => setRange("month")}>This month</button>
            <button type="button" className={range === "all" ? "on" : ""} aria-pressed={range === "all"} onClick={() => setRange("all")}>All time</button>
          </div>
        </div>
        <Bars rows={mostDrunk} />
      </div>

      <div className="ps-two">
        <div className="ps-panel"><div className="ps-head"><h2>By process</h2><span className="ps-mono">Share of cups</span></div><Bars rows={processRows} unit="%" /></div>
        <div className="ps-panel"><div className="ps-head"><h2>By roaster</h2><span className="ps-mono">Cups</span></div><Bars rows={plain(roasterCups)} /></div>
        <div className="ps-panel"><div className="ps-head"><h2>By origin</h2><span className="ps-mono">Cups</span></div><Bars rows={plain(countryCups)} /></div>
        <div className="ps-panel"><div className="ps-head"><h2>By flavour</h2><span className="ps-mono">Cups</span></div><Bars rows={flavourRows} /></div>
      </div>

      <div className="ps-two">
        <div className="ps-panel">
          <div className="ps-head"><h2>Top rated</h2><span className="ps-mono">{rated.length} of {beans.length} rated</span></div>
          {topRated.length === 0 ? <p className="ps-none">No beans rated yet</p> : topRated.map(x => (
            <div className="ps-row" key={x.bean.id}>
              <div><b>{x.bean.name}</b><small>{sub(x)}</small></div>
              <span className="ps-chip">★ {x.bean.myRating}/5</span>
            </div>
          ))}
        </div>
        <div className="ps-panel">
          <div className="ps-head"><h2>Rate these</h2><span className="ps-mono">Most drunk, not rated</span></div>
          {toRate.length === 0 ? <p className="ps-none">Every bean you've drunk is rated</p> : toRate.map(x => (
            <div className="ps-row" key={x.bean.id}>
              <div><b>{x.bean.name}</b><small>{sub(x)}</small></div>
              <div className="ps-rate">
                {[1, 2, 3, 4, 5].map(n => <button type="button" key={n} aria-label={`Rate ${x.bean.name} ${n} of 5`} onClick={() => rate(x.bean, n)}><span /></button>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ps-panel">
        <div className="ps-head"><h2>Drink next</h2><span className="ps-mono">In stock, not drunk for a week or more</span></div>
        {drinkNext.length === 0 ? <p className="ps-none">You're on top of everything in stock</p> : (
          <div className="ps-next">
            {drinkNext.map(x => (
              <button type="button" key={x.bean.id} onClick={() => setOpenId(x.bean.id)}>
                <i style={{ background: famOf(x.bean).tile }} />
                <b>{x.bean.name}</b>
                <small>{x.days === null ? "Never logged" : `Last cup ${lastDrunkLabel(x.days).toLowerCase()}`}</small>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ps-foot"><HowBuilt /></div>

      <DetailModal
        bean={openBean}
        drinkLog={openBean ? { count: allCups[openBean.id] || 0, lastDays: lastDrunk[openBean.id] ? daysSince(lastDrunk[openBean.id]) : null } : null}
        canEdit
        onClose={() => setOpenId(null)}
        onEdit={setEditBean}
        onDelete={deleteBean}
        onToggleAvailability={toggleAvailability}
        onRate={rate}
      />
      {editBean && <AddBeanModal editBean={editBean} onClose={() => setEditBean(null)} onSave={saveEdit} />}
    </div>
  );
}
