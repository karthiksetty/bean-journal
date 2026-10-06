import { createClient } from "@supabase/supabase-js";
import { FAM, TAG_DOTS, processFamily } from "./lib/poster";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./lib/supabase-config";

export const dynamic = "force-dynamic";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TIME_ZONE = "Europe/Berlin";
const NEUTRAL = { tile: "#B9B2A3", cof: ["#B98552", "#4A2E1C"] };

function dayLabel(iso) {
  const day = d => Date.parse(new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(d));
  const days = Math.round((day(new Date()) - day(new Date(iso))) / 86400000);
  return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`;
}

function ExtLink({ href, className, children }) {
  if (!/^https?:\/\//i.test(href || "")) return <span className={className}>{children}</span>;
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>;
}

function Tile({ cup }) {
  const fam = cup.process ? FAM[processFamily(cup.process)] : NEUTRAL;
  return (
    <div className="pp-tile" style={{ background: fam.tile }}>
      <div className="pp-tile-shadow" />
      <div className="pp-tile-handle" />
      <div className="pp-tile-cup"><div style={{ background: `radial-gradient(circle at 42% 38%,${fam.cof[0]} 0 22%,${fam.cof[1]} 74%)` }} /></div>
      <span className="pp-tile-proc">{cup.process || "Process not noted"}</span>
    </div>
  );
}

function Flavours({ cup }) {
  if (!cup.flavours?.length) return null;
  return (
    <div className="pp-field">
      <span className="pp-label">FLAVOURS</span>
      {cup.flavours.slice(0, 4).map((f, i) => <span key={f} className="pp-note"><i style={{ background: TAG_DOTS[i % 4] }} />{f}</span>)}
    </div>
  );
}

function Hero({ cup }) {
  const atCafe = cup.place === "cafe";
  return (
    <div className="pp-hero">
      <div className="pp-hero-main">
        <span className="pp-chip">Last cup · {dayLabel(cup.drunk_at)}</span>
        <h2 className="pp-hero-name" style={{ "--w": Math.max(...cup.coffee_name.split(/\s+/).map(w => w.length)) }}><ExtLink href={cup.coffee_website}>{cup.coffee_name}</ExtLink></h2>
        {cup.roaster && <div className="pp-hero-by">by {cup.roaster}</div>}
        {atCafe ? (
          <div className="pp-place">
            <span className="pp-mono">DRUNK AT</span>
            <b><ExtLink href={cup.cafe_website}>{cup.cafe_name}</ExtLink></b>
            {cup.cafe_city && <span className="pp-mono">{cup.cafe_city}</span>}
          </div>
        ) : (
          <div className="pp-place home"><span className="pp-mono">DRUNK</span><b>At home</b></div>
        )}
        <div className="pp-hero-fields">
          {cup.roaster && <div className="pp-field"><span className="pp-label">ROASTER</span><b>{cup.roaster}</b></div>}
          {cup.origin?.length > 0 && <div className="pp-field"><span className="pp-label">ORIGIN</span><span>{cup.origin.join(" · ")}</span></div>}
          {cup.process && <div className="pp-field"><span className="pp-label">PROCESS</span><span>{cup.process}</span></div>}
          <Flavours cup={cup} />
        </div>
      </div>
      <Tile cup={cup} />
    </div>
  );
}

function Card({ cup }) {
  const atCafe = cup.place === "cafe";
  return (
    <div className="pp-card">
      {atCafe ? (
        <div className="pp-where">
          <ExtLink href={cup.cafe_website}>{cup.cafe_name}</ExtLink>
          {cup.cafe_city && <small>{cup.cafe_city}</small>}
        </div>
      ) : null}
      <h3><ExtLink href={cup.coffee_website}>{cup.coffee_name}</ExtLink></h3>
      <Tile cup={cup} />
      <div className="pp-info">
        {cup.roaster && <div className="pp-field"><span className="pp-label">ROASTER</span><b>{cup.roaster}</b></div>}
        {cup.origin?.length > 0 && <div className="pp-field"><span className="pp-label">ORIGIN</span><span>{cup.origin.join(" · ")}</span></div>}
        <Flavours cup={cup} />
      </div>
      <div className="pp-foot">{dayLabel(cup.drunk_at)}</div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Space+Grotesk:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .pp { min-height: 100vh; overflow-x: clip; color: #161210; font-family: 'Space Grotesk', sans-serif; --tf: 'Righteous'; background: #E9E3D6 url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix values=%220 0 0 0 0.1 0 0 0 0 0.07 0 0 0 0 0.05 0 0 0 0.22 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E'); }
  .pp a { color: inherit; text-decoration: none; }
  .pp a:hover { color: #D2483A; }
  .pp-wrap { max-width: 1180px; margin: 0 auto; padding: clamp(20px, 4vw, 48px) 20px 80px; }
  .pp-mono { font: 500 11px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pp-label { align-self: flex-start; padding: 1px 5px; background: #161210; color: #F3ECDD; font: 500 9.5px 'DM Mono', monospace; letter-spacing: .12em; }

  .pp-top { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; }
  .pp-top h1 { flex: 1; font: 400 clamp(26px, 4vw, 40px)/1 var(--tf); letter-spacing: .05em; text-transform: uppercase; }
  .pp-top a { font: 700 15px 'Space Grotesk', sans-serif; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 5px; }

  .pp-hero { background: #F3ECDD; border: 12px solid #161210; box-shadow: 0 24px 50px rgba(22,18,16,.22); padding: clamp(18px, 3vw, 34px); display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: clamp(18px, 3vw, 36px); align-items: start; }
  .pp-chip { display: inline-block; padding: 6px 10px; background: #161210; color: #F3ECDD; font: 500 11px 'DM Mono', monospace; letter-spacing: .1em; text-transform: uppercase; }
  .pp-hero-main { container-type: inline-size; }
  .pp-hero-name { margin-top: 18px; font: 400 clamp(44px, 7.5vw, 112px)/0.88 var(--tf); font-size: max(30px, min(clamp(44px, 7.5vw, 112px), calc(100cqi / (var(--w, 8) * 0.76)))); letter-spacing: .03em; text-transform: uppercase; overflow-wrap: break-word; text-wrap: balance; }
  .pp-hero-by { margin-top: 10px; font: 400 clamp(20px, 2.4vw, 30px)/1 var(--tf); letter-spacing: .05em; text-transform: uppercase; }
  .pp-place { display: flex; flex-direction: column; gap: 6px; margin-top: 22px; padding: 16px 18px; border: 3px solid #161210; background: #D9A441; }
  .pp-place b { font: 400 clamp(30px, 4.6vw, 60px)/0.9 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
  .pp-place.home { background: #F3ECDD; }
  .pp-hero-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 20px; margin-top: 26px; padding-top: 18px; border-top: 2px solid #161210; }
  .pp-field { display: flex; flex-direction: column; gap: 4px; font: 400 16px/1.35 'Space Grotesk', sans-serif; }
  .pp-field b { font-weight: 700; }
  .pp-note { display: flex; gap: 8px; align-items: baseline; font: 700 16px/1.3 'Space Grotesk', sans-serif; }
  .pp-note i { width: 9px; height: 9px; border-radius: 50%; flex: none; display: block; }

  .pp-tile { position: relative; aspect-ratio: 1; overflow: hidden; }
  .pp-tile-shadow { position: absolute; left: 50%; top: 27%; width: 110%; height: 46%; background: rgba(30,12,8,.22); transform-origin: 0 50%; transform: rotate(45deg); }
  .pp-tile-handle { position: absolute; left: 68%; top: 46%; width: 13%; height: 8%; border-radius: 6px; background: #F6F1E6; }
  .pp-tile-cup { position: absolute; left: 27%; top: 27%; width: 46%; height: 46%; border-radius: 50%; background: #F6F1E6; }
  .pp-tile-cup div { position: absolute; inset: 11%; border-radius: 50%; }
  .pp-tile-proc { position: absolute; left: 12px; top: 12px; max-width: 80%; padding: 5px 9px; background: #F3ECDD; font: 500 10.5px/1.3 'DM Mono', monospace; letter-spacing: .04em; text-transform: uppercase; }

  .pp-section { display: flex; align-items: center; gap: 14px; margin: 44px 0 22px; }
  .pp-section h2 { font: 400 clamp(30px, 4vw, 46px)/1 var(--tf); letter-spacing: .05em; text-transform: uppercase; }
  .pp-section div { flex: 1; height: 3px; background: #161210; }

  .pp-row { display: flex; gap: 26px; overflow-x: auto; scroll-snap-type: x mandatory; margin: 0 -20px; padding: 6px 20px 30px; scrollbar-width: thin; scrollbar-color: #161210 transparent; }
  .pp-card { flex: 0 0 min(78vw, 280px); scroll-snap-align: start; scroll-margin-left: 20px; background: #F3ECDD; border: 10px solid #161210; box-shadow: 0 18px 36px rgba(22,18,16,.2); padding: 14px 14px 12px; display: flex; flex-direction: column; }
  .pp-where { margin: -14px -14px 12px; padding: 9px 14px; border-bottom: 3px solid #161210; background: #D9A441; font: 400 19px/1 var(--tf); letter-spacing: .05em; text-transform: uppercase; }
  .pp-where small { display: block; margin-top: 4px; font: 500 10px 'DM Mono', monospace; letter-spacing: .12em; }
    .pp-card h3 { font: 400 25px/0.92 var(--tf); letter-spacing: .03em; text-transform: uppercase; text-wrap: balance; overflow-wrap: break-word; }
  .pp-card .pp-tile { margin-top: 10px; }
  .pp-info { display: flex; flex-direction: column; gap: 7px; padding: 12px 0; }
  .pp-card .pp-field, .pp-card .pp-note { font-size: 13px; }
  .pp-foot { margin-top: auto; padding-top: 10px; border-top: 2px solid #161210; font: 500 11.5px 'DM Mono', monospace; }
  .pp-empty { padding: 60px 0; text-align: center; font: 400 clamp(26px, 4vw, 44px)/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; }

  @media (max-width: 760px) {
    .pp-hero { grid-template-columns: minmax(0, 1fr); }
    .pp-hero .pp-tile { order: -1; }
  }
`;

export default async function PublicPage() {
  const { data } = await supabase.from("recent_cups").select("*").order("drunk_at", { ascending: false });
  const [last, ...rest] = data || [];
  const rows = [
    { title: "At cafés", cups: rest.filter(cup => cup.place === "cafe") },
    { title: "At home", cups: rest.filter(cup => cup.place !== "cafe") },
  ].filter(row => row.cups.length > 0);

  return (
    <>
      <style>{css}</style>
      <div className="pp">
        <div className="pp-wrap">
          <div className="pp-top">
            <h1>Bean Journal</h1>
            <a href="/collection">My collection</a>
          </div>
          {!last ? (
            <div className="pp-empty">No cups logged yet</div>
          ) : (
            <>
              <Hero cup={last} />
              {rows.map(row => (
                <section key={row.title}>
                  <div className="pp-section"><h2>{row.title}</h2><div />{row.cups.length > 4 && <span className="pp-mono">Scroll →</span>}</div>
                  <div className="pp-row">
                    {row.cups.map(cup => <Card key={`${cup.cafe_name || ""}-${cup.coffee_name}`} cup={cup} />)}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
