"use client";
import { useState } from "react";

const SECTIONS = [
  { color: "#D2483A", title: "Built with Claude", body: "The whole app was built through conversations with Claude Code: the pages, the database and the AI features. Nothing started from a template. Every screen exists because of a real request." },
  { color: "#D9A441", title: "Designed in Claude Design", body: "The poster look began as a Claude Design exploration: framed tiles, a cup for every coffee and one colour for each process family. Claude Code then built that design into the app and carried it across every screen." },
  { color: "#9DB0A8", title: "A public page, a private collection", body: "The front page shows the most recent cups, at home and in cafés. The full collection, the stats and the bean finder sit behind a sign-in that only the owner can use." },
  { color: "#A47B60", title: "Database: Supabase", body: "Beans, cup logs and café cups live in PostgreSQL on Supabase. Row-level security keeps the tables private, and a single database view shares just the recent cups with the public page." },
  { color: "#D9A99B", title: "Frontend: Next.js and React", body: "The interface runs on Next.js 16 and React 18 with no CSS framework. Type is set in Righteous, Space Grotesk and DM Mono, and the scroll animations are plain CSS." },
  { color: "#5A2A22", title: "AI features: Claude API", body: "Two features call Anthropic's Claude. Discover facts writes three specific facts about a bean, covering terroir, genetics and processing. Find my bean picks a coffee from the collection to match the time of day and mood." },
  { color: "#D2483A", title: "Added from a photo", body: "New beans come from a photo of the bag, and café cups from the café's link and a photo of the menu or box. Claude reads the label, shows what it found, and saves only after a yes." },
  { color: "#D9A441", title: "Deployed on Vercel", body: "The app is hosted on Vercel at beans.setty.in. Every push to the main branch goes live automatically." },
];

const STACK = ["Next.js 16", "React 18", "Supabase", "PostgreSQL", "Claude API", "Claude Code", "Claude Design", "Vercel"];

const css = `
  .hb-trigger { border: none; background: none; cursor: pointer; color: #161210; font: 500 12px 'DM Mono', monospace; letter-spacing: .06em; text-decoration: underline; text-underline-offset: 4px; }
  .hb-trigger:hover { color: #D2483A; }
  .hb-overlay { position: fixed; inset: 0; z-index: 299; background: rgba(22,18,16,.6); backdrop-filter: blur(3px); opacity: 0; pointer-events: none; transition: opacity .3s; }
  .hb-overlay.open { opacity: 1; pointer-events: all; }
  .hb { position: fixed; z-index: 300; left: 0; right: 0; bottom: 0; height: 92vh; overflow-y: auto; background: #F3ECDD; border-top: 12px solid #161210; color: #161210; font-family: 'Space Grotesk', sans-serif; transform: translateY(100%); visibility: hidden; transition: transform .35s cubic-bezier(.32,.72,0,1), visibility 0s .35s; }
  .hb.open { transform: none; visibility: visible; transition: transform .35s cubic-bezier(.32,.72,0,1); }
  @media (min-width: 641px) {
    .hb { top: 0; left: auto; width: 500px; height: 100vh; border-top: none; border-left: 12px solid #161210; transform: translateX(100%); }
  }
  .hb-head { position: sticky; top: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 16px 16px 22px; background: #161210; color: #F3ECDD; }
  .hb-head h2 { font: 400 26px/1 'Righteous', sans-serif; letter-spacing: .05em; text-transform: uppercase; }
  .hb-close { width: 36px; height: 36px; flex: none; border: none; background: #F3ECDD; color: #161210; cursor: pointer; font: 400 22px/1 'Space Grotesk', sans-serif; }
  .hb-close:hover { background: #D9A441; }
  .hb-body { padding: 8px 22px 40px; }
  .hb-item { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 14px; padding: 18px 0; border-bottom: 1.5px dashed #161210; }
  .hb-num { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border: 2.5px solid #161210; font: 400 18px/1 'Righteous', sans-serif; }
  .hb-num.light { color: #F3ECDD; }
  .hb-item h3 { font: 700 16px/1.25 'Space Grotesk', sans-serif; }
  .hb-item p { margin-top: 5px; font: 400 14px/1.6 'Space Grotesk', sans-serif; }
  .hb-label { display: inline-block; margin: 22px 0 10px; padding: 1px 5px; background: #161210; color: #F3ECDD; font: 500 9.5px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .hb-stack { display: flex; flex-wrap: wrap; gap: 6px; }
  .hb-stack span { padding: 5px 10px; border: 2px solid #161210; font: 700 13px 'Space Grotesk', sans-serif; }
`;

export default function HowBuilt() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <style>{css}</style>
      <button type="button" className="hb-trigger" onClick={() => setOpen(true)}>How this is built →</button>
      <div className={`hb-overlay${open ? " open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`hb${open ? " open" : ""}`} aria-hidden={!open} aria-label="How this is built">
        <div className="hb-head">
          <h2>How this is built</h2>
          <button type="button" className="hb-close" aria-label="Close" onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="hb-body">
          {SECTIONS.map((s, i) => (
            <div className="hb-item" key={s.title}>
              <span className={`hb-num${["#D2483A", "#5A2A22"].includes(s.color) ? " light" : ""}`} style={{ background: s.color }}>{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{s.title}</h3><p>{s.body}</p></div>
            </div>
          ))}
          <span className="hb-label">Stack</span>
          <div className="hb-stack">{STACK.map(t => <span key={t}>{t}</span>)}</div>
        </div>
      </aside>
    </>
  );
}
