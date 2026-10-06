import { FAM } from "../lib/poster";
import { PROCESS_INFO, PROCESS_ORDER } from "../lib/learn";
import HowBuilt from "../lib/HowBuilt";

export const metadata = {
  title: "Pour-over, explained · Setty's Bean Journal",
  description: "What a pour-over is, how to brew one, and how to read the roast and process on a bag of coffee beans.",
};

const STEPS = [
  { name: "Grind", color: "#D2483A", figure: "15 g coffee", text: "Grind the beans fresh, about as fine as coarse sand. Too fine and the cup turns bitter; too coarse and it tastes thin and sour." },
  { name: "Bloom", color: "#D9A441", figure: "45 g water · 40 seconds", text: "Wet the grounds with a little water and wait. The coffee swells and releases gas, which helps the rest of the water flow through evenly." },
  { name: "Pour", color: "#9DB0A8", figure: "250 g total · 93 °C", text: "Pour the rest slowly in small circles, in two or three stages. Aim to finish dripping at around three minutes." },
  { name: "Sip", color: "#A47B60", figure: "Then repeat", text: "Let it cool for a few minutes. Flavours open up as the cup cools, and a good coffee tastes different at every temperature." },
];

const ROASTS = [
  { name: "Light", tile: "#D9A441", cof: ["#E3B06A", "#B8763A"], best: "Pour-over and other filter brews", text: "Roasted the shortest, so the bean's own character stays in front: bright, fruity, floral, with a tea-like body." },
  { name: "Medium", tile: "#A47B60", cof: ["#B5713A", "#5E2E1A"], best: "Filter or espresso; the all-rounder", text: "A balance of bean and roast: caramel, chocolate and nuts, with some fruit left and a rounder body." },
  { name: "Dark", tile: "#5A2A22", cof: ["#6A3A22", "#1E0E08"], best: "Espresso and milk drinks", text: "The roast takes over: bittersweet, smoky, dark chocolate, with a heavy body and little acidity." },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Space+Grotesk:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .pe { min-height: 100vh; color: #161210; font-family: 'Space Grotesk', sans-serif; --tf: 'Righteous'; background: #E9E3D6 url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix values=%220 0 0 0 0.1 0 0 0 0 0.07 0 0 0 0 0.05 0 0 0 0.22 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E'); }
  .pe-top { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 max(20px, calc((100% - 1180px) / 2)); background: #161210; color: #F3ECDD; }
  .pe-top a { color: #F3ECDD; text-decoration: none; white-space: nowrap; font: 400 clamp(14px, 3.9vw, 28px)/1 var(--tf); letter-spacing: .06em; text-transform: uppercase; }
  .pe-top a:hover { color: #D9A441; }
  .pe-mono { font: 500 11px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pe-label { display: inline-block; align-self: flex-start; padding: 1px 5px; background: #161210; color: #F3ECDD; font: 500 9.5px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pe-wrap { max-width: 1180px; margin: 0 auto; padding: clamp(24px, 4vw, 48px) 20px 60px; }
  .pe h1 { font: 400 clamp(48px, 9.5vw, 124px)/0.86 var(--tf); letter-spacing: .03em; text-transform: uppercase; }
  .pe-lede { max-width: 640px; margin-top: 16px; font: 400 clamp(17px, 2vw, 21px)/1.5 'Space Grotesk', sans-serif; }
  .pe-jump { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
  .pe-jump a { padding: 9px 14px; border: 2px solid #161210; background: #F3ECDD; color: #161210; text-decoration: none; font: 700 14px 'Space Grotesk', sans-serif; }
  .pe-jump a:hover { background: #161210; color: #F3ECDD; }

  .pe-panel { margin-top: 34px; scroll-margin-top: 16px; background: #F3ECDD; border: 12px solid #161210; box-shadow: 0 18px 36px rgba(22,18,16,.18); padding: clamp(18px, 3vw, 30px); }
  .pe-head { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 2px solid #161210; }
  .pe h2 { font: 400 clamp(28px, 4.4vw, 52px)/0.95 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
  .pe p { font: 400 16px/1.6 'Space Grotesk', sans-serif; }

  .pe-what { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 28px; align-items: center; }
  .pe-what p + p { margin-top: 12px; }
  .pe-versus { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px; }
  .pe-versus div { padding: 12px 14px; border: 2.5px solid #161210; }
  .pe-versus b { display: block; margin-bottom: 4px; font: 400 20px/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
  .pe-versus small { font: 400 14px/1.45 'Space Grotesk', sans-serif; }
  .pe-art { position: relative; aspect-ratio: 1; overflow: hidden; background: #9DB0A8; }
  .pe-art svg { position: absolute; inset: 0; width: 100%; height: 100%; }

  .pe-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
  .pe-step { padding: 0 14px 16px; border: 2.5px solid #161210; }
  .pe-step i { display: block; height: 12px; margin: 0 -14px 12px; border-bottom: 2.5px solid #161210; }
  .pe-step span { font: 400 44px/0.9 var(--tf); }
  .pe-step b { display: block; margin: 6px 0 8px; font: 400 24px/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
  .pe-step p { font-size: 14.5px; line-height: 1.5; }
  .pe-step em { display: inline-block; margin-top: 10px; padding: 4px 8px; background: #161210; color: #F3ECDD; font: 500 11px 'DM Mono', monospace; font-style: normal; letter-spacing: .04em; }

  .pe-shout { margin-top: 34px; display: grid; grid-template-columns: minmax(0, 190px) minmax(0, 1.4fr) minmax(0, 1fr); gap: 28px; align-items: center; padding: clamp(20px, 3vw, 34px); background: #161210; color: #F3ECDD; box-shadow: 0 18px 36px rgba(22,18,16,.18); }
  .pe-machine { display: block; width: 100%; max-width: 190px; height: auto; }
  .pe-shout h2 { margin: 10px 0 12px; color: #D9A441; }
  .pe-shout p { max-width: 560px; }
  .pe-go { display: inline-flex; align-items: center; height: 50px; margin-top: 18px; padding: 0 20px; background: #D9A441; color: #161210; text-decoration: none; font: 700 16px 'Space Grotesk', sans-serif; }
  .pe-go:hover { background: #F3ECDD; }
  .pe-shout small { display: block; margin-top: 12px; font: 500 11px 'DM Mono', monospace; letter-spacing: .06em; }
  .pe-does { display: grid; gap: 8px; }
  .pe-does div { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; gap: 12px; padding: 10px 12px; border: 2px solid #F3ECDD; font: 400 22px/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
  .pe-does i { font-style: normal; color: #D9A441; }
  .pe-does em { font: 500 11px 'DM Mono', monospace; font-style: normal; letter-spacing: .1em; }
  .pe-does .you { background: #D9A441; border-color: #D9A441; color: #161210; }
  .pe-does .you i { color: #161210; }

  .pe-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 22px; }
  .pe-card { display: flex; flex-direction: column; border: 6px solid #161210; background: #F3ECDD; }
  .pe-tile { position: relative; aspect-ratio: 16 / 10; overflow: hidden; }
  .pe-tile-shadow { position: absolute; left: 50%; top: 29%; width: 110%; height: 42%; background: rgba(30,12,8,.22); transform-origin: 0 50%; transform: rotate(45deg); }
  .pe-cup { position: absolute; left: 50%; top: 50%; height: 62%; aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 50%; background: #F6F1E6; }
  .pe-cup::before { content: ""; position: absolute; right: -20%; top: 41%; width: 26%; height: 18%; border-radius: 6px; background: #F6F1E6; }
  .pe-cup div { position: absolute; inset: 11%; border-radius: 50%; }
  .pe-card-body { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px 18px; }
  .pe h3 { font: 400 28px/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
  .pe-card p { font-size: 14.5px; line-height: 1.5; }
  .pe-row { display: flex; flex-direction: column; gap: 3px; font: 700 14px/1.35 'Space Grotesk', sans-serif; }
  .pe-intro { max-width: 680px; margin-bottom: 20px; }

  .pe-foot { display: flex; justify-content: flex-end; align-items: baseline; flex-wrap: wrap; gap: 8px 24px; margin-top: 40px; }
  .pe-foot a { margin-right: auto; color: #161210; font: 500 12px 'DM Mono', monospace; letter-spacing: .06em; text-decoration: underline; text-underline-offset: 4px; }
  .pe-foot a:hover { color: #D2483A; }
  @media (max-width: 720px) {
    .pe-what, .pe-shout { grid-template-columns: minmax(0, 1fr); }
    .pe-machine { max-width: 150px; }
    .pe-art { order: -1; aspect-ratio: 16 / 11; }
  }
`;

// A flat drawing of the xBloom: water tank on the left, controls and brew bay on the right.
function Machine() {
  const dots = (cx, cy) => [-4, 0, 4].flatMap(dx => [-4, 0, 4].map(dy => <circle key={`${dx}${dy}`} cx={cx + dx} cy={cy + dy} r="1.1" fill="#F3ECDD" />));
  return (
    <svg className="pe-machine" viewBox="0 0 200 420" role="img" aria-label="Drawing of an xBloom coffee machine brewing into a glass">
      <rect x="20" y="20" width="160" height="380" fill="#9DB0A8" />
      <rect x="20" y="20" width="160" height="12" fill="#B4C4BB" />
      <rect x="20" y="254" width="82" height="118" fill="#8A9D94" />
      <rect x="102" y="204" width="78" height="168" fill="#7F938A" />
      <rect x="20" y="34" width="80" height="220" fill="#A9BBB1" />
      <rect x="60" y="36" width="40" height="12" fill="#C9D3CC" />
      <text x="24" y="249" fill="#C98B5E" style={{ font: "500 8px 'DM Mono', monospace", letterSpacing: ".04em" }}>xbloom</text>
      <rect x="36" y="264" width="80" height="10" rx="5" fill="#161210" />
      <rect x="104" y="46" width="76" height="158" fill="#B4C4BB" />
      {dots(118, 152)}{dots(142, 152)}{dots(166, 152)}
      <circle cx="118" cy="174" r="6" fill="#C98B5E" /><circle cx="142" cy="174" r="6" fill="#C98B5E" /><circle cx="166" cy="174" r="6" fill="#C98B5E" />
      <rect x="124" y="204" width="36" height="12" fill="#5E6F67" />
      {[130, 136, 142, 148, 154].map(x => <circle key={x} cx={x} cy="210" r="1.3" fill="#161210" />)}
      <rect x="141" y="222" width="2" height="18" fill="#6B2C1F" />
      <path d="M112 246 H172 L162 300 H122 Z" fill="#F3ECDD" />
      <rect x="110" y="264" width="64" height="13" rx="3" fill="#C98B5E" />
      <rect x="141" y="300" width="2" height="22" fill="#6B2C1F" />
      <rect x="112" y="318" width="60" height="54" rx="4" fill="#3A160E" stroke="#F3ECDD" strokeWidth="2" />
      <rect x="113" y="319" width="58" height="12" fill="#7F938A" />
      {[124, 136, 148, 160].map(x => <rect key={x} x={x} y="320" width="1" height="50" fill="#F3ECDD" opacity=".35" />)}
      <rect x="20" y="372" width="160" height="14" fill="#B4C4BB" />
      {Array.from({ length: 15 }, (_, i) => <rect key={i} x={28 + i * 10} y="374" width="1.5" height="10" fill="#7F938A" />)}
      <rect x="20" y="386" width="160" height="14" fill="#9DB0A8" />
    </svg>
  );
}

function Cup({ tile, cof }) {
  return (
    <div className="pe-tile" style={{ background: tile }}>
      <div className="pe-tile-shadow" />
      <div className="pe-cup"><div style={{ background: `radial-gradient(circle at 42% 38%,${cof[0]} 0 22%,${cof[1]} 75%)` }} /></div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <div className="pe">
      <style>{css}</style>
      <header className="pe-top"><a href="/">Setty's Bean Journal</a><span className="pe-mono">Learn</span></header>

      <div className="pe-wrap">
        <h1>Pour-over, explained</h1>
        <p className="pe-lede">Everything on this site is brewed as filter coffee. Here is what that means, how to make one, and how to read the words on a bag of beans.</p>
        <nav className="pe-jump" aria-label="Sections">
          <a href="#what">What it is</a>
          <a href="#brew">How to brew</a>
          <a href="#roasts">Roasts</a>
          <a href="#processes">Processes</a>
        </nav>

        <section className="pe-panel" id="what">
          <div className="pe-head"><h2>What is a pour-over?</h2><span className="pe-mono">01</span></div>
          <div className="pe-what">
            <div>
              <p>A pour-over is coffee made by pouring hot water by hand over ground coffee in a paper filter. Gravity pulls the water through, and the filter holds back the grounds and most of the oils.</p>
              <p>The result is a clean, light-bodied cup where you can taste what makes one coffee different from another. That is why it suits beans with fruity or floral character.</p>
              <div className="pe-versus">
                <div><b>Pour-over</b><small>Gravity, a paper filter, about three minutes. A large, clear cup you sip slowly.</small></div>
                <div><b>Espresso</b><small>High pressure, a metal basket, about thirty seconds. A small, thick, intense shot.</small></div>
              </div>
            </div>
            <div className="pe-art">
              <svg viewBox="0 0 200 200" aria-hidden="true">
                <rect x="118" y="-10" width="150" height="62" transform="rotate(45 118 20)" fill="rgba(30,12,8,.18)" />
                <path d="M52 44 H148 L118 104 H82 Z" fill="#F6F1E6" stroke="#161210" strokeWidth="4" strokeLinejoin="round" />
                <path d="M64 56 H136 L114 98 H86 Z" fill="#6B2C1F" />
                <rect x="72" y="104" width="56" height="8" fill="#161210" />
                <rect x="97" y="112" width="6" height="14" fill="#6B2C1F" />
                <path d="M66 128 H134 V160 a16 16 0 0 1 -16 16 H82 a16 16 0 0 1 -16 -16 Z" fill="#F6F1E6" stroke="#161210" strokeWidth="4" strokeLinejoin="round" />
                <path d="M70 150 H130 V160 a12 12 0 0 1 -12 12 H82 a12 12 0 0 1 -12 -12 Z" fill="#C27A3E" />
                <path d="M134 138 h10 a10 10 0 0 1 0 20 h-10" fill="none" stroke="#161210" strokeWidth="4" />
                <circle cx="100" cy="26" r="4" fill="#F6F1E6" /><circle cx="88" cy="16" r="3" fill="#F6F1E6" /><circle cx="113" cy="14" r="3" fill="#F6F1E6" />
              </svg>
            </div>
          </div>
        </section>

        <section className="pe-panel" id="brew">
          <div className="pe-head"><h2>How to brew one</h2><span className="pe-mono">02 · A starting recipe for one cup</span></div>
          <div className="pe-steps">
            {STEPS.map((step, i) => (
              <div className="pe-step" key={step.name}>
                <i style={{ background: step.color }} />
                <span>{i + 1}</span>
                <b>{step.name}</b>
                <p>{step.text}</p>
                <em>{step.figure}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="pe-shout">
          <Machine />
          <div>
            <span className="pe-mono">A shout-out · What I brew with</span>
            <h2>No time to master it? Meet the xBloom</h2>
            <p>I make most of my cups on an xBloom, a machine that brews pour-overs automatically. It grinds the beans and pours the water in stages, so every cup follows the recipe. If you don't have the time to master pouring by hand, this wonderful machine does the work for you.</p>
            <a className="pe-go" href="https://xbloom.com" target="_blank" rel="noopener noreferrer">Visit xbloom.com ↗</a>
            <small>Not sponsored. I just like it.</small>
          </div>
          <div className="pe-does">
            {STEPS.map((step, i) => (
              <div key={step.name} className={i === 3 ? "you" : ""}><i>{i + 1}</i>{step.name}<em>{i === 3 ? "Still yours" : "The machine"}</em></div>
            ))}
          </div>
        </section>

        <section className="pe-panel" id="roasts">
          <div className="pe-head"><h2>Roasts</h2><span className="pe-mono">03 · How long the beans were roasted</span></div>
          <div className="pe-tiles">
            {ROASTS.map(roast => (
              <div className="pe-card" key={roast.name}>
                <Cup tile={roast.tile} cof={roast.cof} />
                <div className="pe-card-body">
                  <h3>{roast.name}</h3>
                  <p>{roast.text}</p>
                  <div className="pe-row"><span className="pe-label">Best for</span>{roast.best}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pe-panel" id="processes">
          <div className="pe-head"><h2>Processes</h2><span className="pe-mono">04 · How the fruit was removed from the bean</span></div>
          <p className="pe-intro">Coffee beans are the seeds of a fruit called a coffee cherry. The process is how that fruit is taken off and the seed dried, and it changes the taste as much as the roast does. The colours match the tiles across this journal.</p>
          <div className="pe-tiles">
            {PROCESS_ORDER.map(key => (
              <div className="pe-card" key={key}>
                <Cup tile={FAM[key].tile} cof={FAM[key].cof} />
                <div className="pe-card-body">
                  <h3>{FAM[key].label}</h3>
                  <p>{PROCESS_INFO[key].text}</p>
                  <div className="pe-row"><span className="pe-label">Tastes like</span>{PROCESS_INFO[key].tastes}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="pe-foot"><a href="/">← Back to the journal</a><HowBuilt /></div>
      </div>
    </div>
  );
}
