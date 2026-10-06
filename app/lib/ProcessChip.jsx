"use client";
import { useState } from "react";
import { FAM, processFamily } from "./poster";
import { PROCESS_INFO, DARK_TILES } from "./learn";

const css = `
  .pc-chip { cursor: pointer; border: none; text-align: left; text-decoration: underline dotted; text-underline-offset: 3px; }
  .pc-chip:hover { background: #161210 !important; color: #F3ECDD !important; }
  .pc-overlay { position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(22,18,16,.6); backdrop-filter: blur(3px); }
  .pc { width: 100%; max-width: 440px; background: #F3ECDD; border: 10px solid #161210; box-shadow: 0 24px 60px rgba(22,18,16,.4); color: #161210; font-family: 'Space Grotesk', sans-serif; text-transform: none; letter-spacing: normal; }
  .pc-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; border-bottom: 3px solid #161210; }
  .pc-bar b { font: 400 26px/1 'Righteous', sans-serif; letter-spacing: .04em; text-transform: uppercase; }
  .pc-close { width: 34px; height: 34px; flex: none; border: none; cursor: pointer; background: #161210; color: #F3ECDD; font: 400 20px/1 'Space Grotesk', sans-serif; }
  .pc-close:hover { background: #F3ECDD; color: #161210; }
  .pc-body { display: flex; flex-direction: column; gap: 12px; padding: 16px; }
  .pc-body p { font: 400 15.5px/1.55 'Space Grotesk', sans-serif; }
  .pc-label { display: inline-block; padding: 1px 5px; background: #161210; color: #F3ECDD; font: 500 9.5px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pc-body strong { display: block; margin-top: 3px; font: 700 15px/1.35 'Space Grotesk', sans-serif; }
  .pc .pc-more { color: #161210; font: 700 14px 'Space Grotesk', sans-serif; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }
  .pc .pc-more:hover { color: #D2483A; }
`;

// A process label that opens a short explainer of its process family.
export default function ProcessChip({ process, className }) {
  const [open, setOpen] = useState(false);
  const key = processFamily(process);
  const fam = FAM[key];
  const info = PROCESS_INFO[key];
  const sameName = process.trim().toLowerCase() === fam.label.toLowerCase();

  return (
    <>
      <style>{css}</style>
      <button type="button" className={`${className} pc-chip`} aria-haspopup="dialog" onClick={() => setOpen(true)}>{process}</button>
      {open && (
        <div className="pc-overlay" onClick={() => setOpen(false)}>
          <div className="pc" role="dialog" aria-label={`${fam.label} process`} onClick={e => e.stopPropagation()}>
            <div className="pc-bar" style={{ background: fam.tile, color: DARK_TILES.includes(key) ? "#F3ECDD" : "#161210" }}>
              <b>{fam.label}</b>
              <button type="button" className="pc-close" aria-label="Close" onClick={() => setOpen(false)}>×</button>
            </div>
            <div className="pc-body">
              {!sameName && <div><span className="pc-label">This coffee</span><strong>{process}</strong></div>}
              <p>{info.text}</p>
              <div><span className="pc-label">Tastes like</span><strong>{info.tastes}</strong></div>
              <a className="pc-more" href="/learn#processes">Learn about all six processes →</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
