"use client";
import { useState, useEffect } from "react";
import { FAM, TAG_DOTS, processFamily, lastDrunkLabel } from "../lib/poster";
import Arrow from "../lib/Arrow";

const css = `
  .pd-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(22,18,16,.6); backdrop-filter: blur(3px); }
  .pd { position: relative; width: 100%; max-width: 560px; max-height: 88vh; overflow-y: auto; background: #F3ECDD; border: 12px solid #161210; box-shadow: 0 24px 60px rgba(22,18,16,.4); color: #161210; font-family: 'Space Grotesk', sans-serif; --tf: 'Righteous'; }
  .pd button { cursor: pointer; font-family: 'Space Grotesk', sans-serif; }
  .pd-art { position: relative; height: 170px; overflow: hidden; }
  .pd-art-shadow { position: absolute; left: 70%; top: calc(50% - 56px); width: 110%; height: 112px; background: rgba(30,12,8,.22); transform-origin: 0 50%; transform: rotate(45deg); }
  .pd-cup { position: absolute; left: 70%; top: 50%; width: 112px; height: 112px; transform: translate(-50%, -50%); }
  .pd-cup-handle { position: absolute; right: -18%; top: 42%; width: 24%; height: 16%; border-radius: 6px; background: #F6F1E6; }
  .pd-cup-body { position: absolute; inset: 0; border-radius: 50%; background: #F6F1E6; }
  .pd-cup-body div { position: absolute; inset: 11%; border-radius: 50%; }
  .pd-chips { position: absolute; left: 14px; top: 14px; right: 62px; display: flex; flex-wrap: wrap; gap: 6px; }
  .pd-chip { padding: 5px 9px; background: #F3ECDD; color: #161210; font: 500 10.5px/1.3 'DM Mono', monospace; letter-spacing: .04em; text-transform: uppercase; }
  .pd-chip.dark { background: #161210; color: #F3ECDD; }
  .pd-close { position: absolute; right: 14px; top: 14px; width: 36px; height: 36px; border: none; background: #161210; color: #F3ECDD; font: 400 22px/1 'Space Grotesk', sans-serif; }
  .pd-close:hover { background: #D2483A; }
  .pd-body { padding: 22px 22px 20px; }
  .pd-name { font: 400 clamp(30px, 6vw, 42px)/0.92 var(--tf); letter-spacing: .03em; text-transform: uppercase; text-wrap: balance; overflow-wrap: break-word; }
  .pd-by { margin-top: 8px; font: 400 17px/1.1 var(--tf); letter-spacing: .05em; text-transform: uppercase; }
  .pd-log { margin-top: 12px; font: 500 12px 'DM Mono', monospace; }
  .pd-rate { display: flex; align-items: center; gap: 4px; margin-top: 14px; }
  .pd-rate .pd-label { align-self: center; margin-right: 8px; }
  .pd-rate button { width: 34px; height: 38px; display: flex; align-items: center; justify-content: center; border: none; background: none; color: #161210; }
  .pd-rate button span { width: 18px; height: 24px; border: 2.5px solid currentColor; border-top: none; border-radius: 0 0 4px 4px; display: block; }
  .pd-rate button.on span { background: #D9A441; }
  .pd-rate button:hover span { background: #161210; }
  .pd-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 18px; margin-top: 18px; padding-top: 16px; border-top: 2px solid #161210; }
  .pd-field { display: flex; flex-direction: column; gap: 4px; font: 400 14.5px/1.35 'Space Grotesk', sans-serif; }
  .pd-field.wide { grid-column: 1 / -1; }
  .pd-label { align-self: flex-start; padding: 1px 5px; background: #161210; color: #F3ECDD; font: 500 9.5px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pd-notes { display: flex; flex-wrap: wrap; gap: 6px 18px; }
  .pd-note { display: flex; gap: 7px; align-items: baseline; font: 700 14.5px/1.3 'Space Grotesk', sans-serif; }
  .pd-note i { width: 8px; height: 8px; border-radius: 50%; flex: none; display: block; }
  .pd-link { color: #161210; font-weight: 700; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; overflow-wrap: anywhere; }
  .pd-link:hover { color: #D2483A; }
  .pd-section { margin-top: 18px; padding-top: 16px; border-top: 2px solid #161210; }
  .pd-btn { width: 100%; height: 48px; padding: 0 16px; border: 2px solid #161210; background: #F3ECDD; color: #161210; font: 700 15px 'Space Grotesk', sans-serif; }
  .pd-btn:hover { background: #161210; color: #F3ECDD; }
  .pd-btn.gold { background: #D9A441; }
  .pd-btn.sage { background: #9DB0A8; }
  .pd-btn.gold:hover, .pd-btn.sage:hover { background: #161210; color: #F3ECDD; }
  .pd-btn.danger { border-color: #D2483A; color: #B23A2E; }
  .pd-btn.danger:hover { background: #D2483A; color: #F3ECDD; }
  .pd-actions { display: flex; flex-direction: column; gap: 8px; }
  .pd-actions div { display: flex; gap: 8px; }
  .pd-facts { padding: 14px 16px; border: 2.5px dashed #161210; }
  .pd-facts p { margin-top: 8px; font: 400 14px/1.7 'Space Grotesk', sans-serif; white-space: pre-wrap; }
  .pd-loading { display: flex; align-items: center; gap: 10px; font: 500 12px 'DM Mono', monospace; }
  .pd-spinner { width: 16px; height: 16px; border: 2.5px solid #161210; border-top-color: transparent; border-radius: 50%; animation: spin .8s linear infinite; }
  .pd-caret { display: inline-block; width: 2px; height: 14px; margin-left: 2px; background: #161210; vertical-align: middle; animation: blink .8s step-end infinite; }
`;

export default function DetailModal({ bean, drinkLog, onClose, onEdit, onDelete, onToggleAvailability, onRate, canEdit }) {
  const [facts, setFacts] = useState("");
  const [factsLoading, setFactsLoading] = useState(false);
  const [factsDone, setFactsDone] = useState(false);

  useEffect(() => {
    setFacts("");
    setFactsLoading(false);
    setFactsDone(false);
  }, [bean?.id]);

  async function fetchFacts() {
    if (factsLoading || facts) return;
    setFactsLoading(true);
    setFacts("");
    setFactsDone(false);
    try {
      const res = await fetch("/api/bean-facts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bean }),
      });
      if (!res.ok) throw new Error("Request failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setFactsLoading(false);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setFacts(prev => prev + decoder.decode(value, { stream: true }));
      }
      setFactsDone(true);
    } catch {
      setFactsLoading(false);
      setFacts("Couldn't load facts. Try again.");
      setFactsDone(true);
    }
  }

  if (!bean) return null;

  const fam = FAM[processFamily(bean.process)];
  const out = bean.available === false;
  const brand = bean.brand && bean.brand !== "—" ? bean.brand : "";
  const cups = drinkLog?.count ?? 0;
  const lastDays = drinkLog?.lastDays ?? null;
  const logLine = lastDays === null ? "Never logged" : `Last cup ${lastDrunkLabel(lastDays).toLowerCase()} · ${cups} cup${cups === 1 ? "" : "s"}`;
  const hasWebsite = /^https?:\/\//i.test(bean.website || "");

  return (
    <div className="pd-overlay" onClick={onClose}>
      <style>{css}</style>
      <div className="pd" onClick={e => e.stopPropagation()}>
        <div className="pd-art" style={{ background: fam.tile }}>
          <div className="pd-art-shadow" />
          <div className="pd-cup">
            <div className="pd-cup-handle" />
            <div className="pd-cup-body"><div style={{ background: `radial-gradient(circle at 42% 38%,${fam.cof[0]} 0 22%,${fam.cof[1]} 74%)` }} /></div>
          </div>
          <div className="pd-chips">
            <span className="pd-chip">{bean.process || "Unknown process"}</span>
            <span className="pd-chip dark">{bean.myRating > 0 ? `★ ${bean.myRating}/5` : "Not rated"}</span>
            {out && <span className="pd-chip dark">Ran out</span>}
          </div>
          <button type="button" className="pd-close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <div className="pd-body">
          <h2 className="pd-name">{bean.name}</h2>
          {brand && <div className="pd-by">by {brand}</div>}
          <div className="pd-log">{logLine}</div>
          {canEdit && (
            <div className="pd-rate">
              <span className="pd-label">Your rating</span>
              {[1, 2, 3, 4, 5].map(n => (
                <button type="button" key={n} className={n <= bean.myRating ? "on" : ""} aria-label={`Rate ${n} of 5`} aria-pressed={n === bean.myRating} onClick={() => onRate(bean, n === bean.myRating ? 0 : n)}><span /></button>
              ))}
            </div>
          )}

          <div className="pd-grid">
            {bean.producer && <div className="pd-field"><span className="pd-label">Producer</span><span>{bean.producer}</span></div>}
            <div className="pd-field"><span className="pd-label">Bean</span><span>{bean.bean || "Arabica"}</span></div>
            {bean.region.length > 0 && <div className="pd-field"><span className="pd-label">Origin</span><span>{bean.region.join(" · ")}</span></div>}
            {bean.variety.length > 0 && <div className="pd-field"><span className="pd-label">Variety</span><span>{bean.variety.join(" · ")}</span></div>}
            {bean.aroma.length > 0 && (
              <div className="pd-field wide">
                <span className="pd-label">Flavours</span>
                <div className="pd-notes">
                  {bean.aroma.map((a, i) => <span key={a} className="pd-note"><i style={{ background: TAG_DOTS[i % 4] }} />{a}</span>)}
                </div>
              </div>
            )}
            {bean.notes && <div className="pd-field wide"><span className="pd-label">Notes</span><span>{bean.notes}</span></div>}
            {hasWebsite && (
              <div className="pd-field wide">
                <span className="pd-label">Website</span>
                <a className="pd-link" href={bean.website} target="_blank" rel="noopener noreferrer">{bean.website.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "")}<Arrow /></a>
              </div>
            )}
          </div>

          <div className="pd-section">
            {!facts && !factsLoading && <button type="button" className="pd-btn gold" onClick={fetchFacts}>Discover facts</button>}
            {factsLoading && <div className="pd-loading"><span className="pd-spinner" />Looking up facts…</div>}
            {facts && (
              <div className="pd-facts">
                <span className="pd-label">Bean facts</span>
                <p>{facts}{!factsDone && <span className="pd-caret" />}</p>
              </div>
            )}
          </div>

          {canEdit && (
            <div className="pd-section pd-actions">
              <button type="button" className={`pd-btn${out ? " sage" : ""}`} onClick={() => onToggleAvailability(bean)}>{out ? "Back in stock" : "Mark as ran out"}</button>
              <div>
                <button type="button" className="pd-btn" onClick={() => { onEdit(bean); onClose(); }}>Edit</button>
                <button type="button" className="pd-btn danger" onClick={() => { if (confirm(`Delete "${bean.name}"?`)) onDelete(bean.id); }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
