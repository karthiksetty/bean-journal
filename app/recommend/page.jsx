"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase-browser";
import { FAM, TAG_DOTS, processFamily } from "../lib/poster";

const TILES = ["#D2483A", "#D9A441", "#9DB0A8", "#A47B60"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Space+Grotesk:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pr { min-height: 100vh; display: flex; flex-direction: column; color: #161210; font-family: 'Space Grotesk', sans-serif; --tf: 'Righteous'; background: #E9E3D6 url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix values=%220 0 0 0 0.1 0 0 0 0 0.07 0 0 0 0 0.05 0 0 0 0.22 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E'); }
  .pr button { cursor: pointer; font-family: 'Space Grotesk', sans-serif; }
  .pr-top { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 max(20px, calc((100% - 760px) / 2)); background: #161210; color: #F3ECDD; }
  .pr-top a { color: #F3ECDD; text-decoration: none; font: 400 clamp(20px, 5vw, 28px)/1 var(--tf); letter-spacing: .06em; text-transform: uppercase; }
  .pr-top a:hover { color: #D9A441; }
  .pr-mono { font: 500 11px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pr-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: clamp(24px, 5vw, 56px) 20px; }
  .pr-frame { width: 100%; max-width: 720px; background: #F3ECDD; border: 12px solid #161210; box-shadow: 0 24px 50px rgba(22,18,16,.22); padding: clamp(18px, 4vw, 32px); animation: fadeIn .25s ease; }
  .pr-progress { display: flex; align-items: center; gap: 6px; }
  .pr-progress i { width: 34px; height: 5px; display: block; background: #F3ECDD; outline: 1.5px solid #161210; }
  .pr-progress i.done { background: #161210; }
  .pr-progress i.now { background: #D2483A; outline-color: #D2483A; }
  .pr-progress span { margin-left: 8px; }
  .pr-q { margin-top: 18px; font: 400 clamp(34px, 7vw, 60px)/0.92 var(--tf); letter-spacing: .03em; text-transform: uppercase; text-wrap: balance; }
  .pr-sub { margin-top: 10px; font: 400 16px/1.4 'Space Grotesk', sans-serif; }
  .pr-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 2px solid #161210; }
  .pr-options.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .pr-opt { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 0 14px 14px; border: 2.5px solid #161210; background: #F3ECDD; color: #161210; text-align: left; }
  .pr-opt i { align-self: stretch; height: 10px; margin: 0 -14px 8px; display: block; border-bottom: 2.5px solid #161210; }
  .pr-opt b { font: 400 20px/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
  .pr-opt:hover, .pr-opt.on { background: #161210; color: #F3ECDD; }
  .pr-back { margin-top: 18px; border: none; background: none; color: #161210; font: 700 14px 'Space Grotesk', sans-serif; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 5px; }
  .pr-back:hover { color: #D2483A; }
  .pr-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .pr-chip { padding: 5px 9px; background: #161210; color: #F3ECDD; font: 500 10.5px/1.3 'DM Mono', monospace; letter-spacing: .04em; text-transform: uppercase; }
  .pr-loading { display: flex; align-items: center; gap: 12px; margin-top: 18px; padding: 20px; border: 2.5px dashed #161210; }
  .pr-spinner { width: 20px; height: 20px; border: 2.5px solid #161210; border-top-color: transparent; border-radius: 50%; animation: spin .8s linear infinite; }
  .pr-bean { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 20px; margin-top: 18px; padding-top: 18px; border-top: 2px solid #161210; animation: fadeIn .4s ease; }
  .pr-name { font: 400 clamp(30px, 6vw, 46px)/0.92 var(--tf); letter-spacing: .03em; text-transform: uppercase; text-wrap: balance; overflow-wrap: break-word; }
  .pr-by { margin-top: 8px; font: 400 17px/1.1 var(--tf); letter-spacing: .05em; text-transform: uppercase; }
  .pr-fields { display: grid; gap: 10px; margin-top: 16px; }
  .pr-field { display: flex; flex-direction: column; gap: 3px; font: 400 14.5px/1.35 'Space Grotesk', sans-serif; }
  .pr-label { align-self: flex-start; padding: 1px 5px; background: #161210; color: #F3ECDD; font: 500 9.5px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pr-notes { display: flex; flex-wrap: wrap; gap: 4px 16px; }
  .pr-note { display: flex; gap: 7px; align-items: baseline; font: 700 14.5px/1.3 'Space Grotesk', sans-serif; }
  .pr-note i { width: 8px; height: 8px; border-radius: 50%; flex: none; display: block; }
  .pr-tile { position: relative; aspect-ratio: 1; overflow: hidden; align-self: start; }
  .pr-tile-shadow { position: absolute; left: 50%; top: 27%; width: 110%; height: 46%; background: rgba(30,12,8,.22); transform-origin: 0 50%; transform: rotate(45deg); }
  .pr-tile-handle { position: absolute; left: 68%; top: 46%; width: 13%; height: 8%; border-radius: 6px; background: #F6F1E6; }
  .pr-tile-cup { position: absolute; left: 27%; top: 27%; width: 46%; height: 46%; border-radius: 50%; background: #F6F1E6; }
  .pr-tile-cup div { position: absolute; inset: 11%; border-radius: 50%; }
  .pr-tile-chips { position: absolute; left: 12px; top: 12px; right: 12px; display: flex; flex-wrap: wrap; gap: 6px; }
  .pr-tile-chips span { padding: 5px 9px; background: #F3ECDD; font: 500 10.5px/1.3 'DM Mono', monospace; letter-spacing: .04em; text-transform: uppercase; }
  .pr-tile-chips span.dark { background: #161210; color: #F3ECDD; }
  .pr-why { margin-top: 18px; padding: 16px 18px; border: 2.5px dashed #161210; animation: fadeIn .3s ease; }
  .pr-why p { margin-top: 10px; font: 400 16px/1.7 'Space Grotesk', sans-serif; white-space: pre-wrap; }
  .pr-caret { display: inline-block; width: 2px; height: 16px; margin-left: 2px; background: #161210; vertical-align: middle; animation: blink .8s step-end infinite; }
  .pr-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; animation: fadeIn .4s ease; }
  .pr-btn { height: 52px; padding: 0 22px; display: inline-flex; align-items: center; border: 2px solid #161210; background: #F3ECDD; color: #161210; font: 700 16px 'Space Grotesk', sans-serif; text-decoration: none; }
  .pr-btn:hover { background: #161210; color: #F3ECDD; }
  .pr-btn.primary { background: #161210; color: #F3ECDD; }
  .pr-btn.primary:hover { background: #D2483A; border-color: #D2483A; }
  @media (max-width: 600px) {
    .pr-options, .pr-options.three { grid-template-columns: minmax(0, 1fr); }
    .pr-bean { grid-template-columns: minmax(0, 1fr); }
    .pr-tile { order: -1; max-width: 300px; }
  }
`;

function RecommendedBean({ bean }) {
  const fam = FAM[processFamily(bean.process)];
  const brand = bean.brand && bean.brand !== "—" ? bean.brand : "";
  return (
    <div className="pr-bean">
      <div>
        <h2 className="pr-name">{bean.name}</h2>
        {brand && <div className="pr-by">by {brand}</div>}
        <div className="pr-fields">
          {bean.producer && <div className="pr-field"><span className="pr-label">Producer</span><span>{bean.producer}</span></div>}
          {bean.region?.length > 0 && <div className="pr-field"><span className="pr-label">Origin</span><span>{bean.region.join(" · ")}</span></div>}
          {bean.variety?.length > 0 && <div className="pr-field"><span className="pr-label">Variety</span><span>{bean.variety.join(" · ")}</span></div>}
          {bean.aroma?.length > 0 && (
            <div className="pr-field">
              <span className="pr-label">Flavours</span>
              <div className="pr-notes">{bean.aroma.map((a, i) => <span key={a} className="pr-note"><i style={{ background: TAG_DOTS[i % 4] }} />{a}</span>)}</div>
            </div>
          )}
          {bean.notes && <div className="pr-field"><span className="pr-label">Notes</span><span>{bean.notes}</span></div>}
        </div>
      </div>
      <div className="pr-tile" style={{ background: fam.tile }}>
        <div className="pr-tile-shadow" />
        <div className="pr-tile-handle" />
        <div className="pr-tile-cup"><div style={{ background: `radial-gradient(circle at 42% 38%,${fam.cof[0]} 0 22%,${fam.cof[1]} 74%)` }} /></div>
        <div className="pr-tile-chips">
          {bean.process && <span>{bean.process}</span>}
          {bean.my_rating > 0 && <span className="dark">★ {bean.my_rating}/5</span>}
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    id: "timeOfDay",
    question: "When are you brewing?",
    subtitle: "The time of day shapes everything.",
    options: [
      { value: "Early morning (before 9am)", label: "Early Morning", sub: "Before 9am" },
      { value: "Morning (9am–12pm)", label: "Morning", sub: "9am – 12pm" },
      { value: "Afternoon (12pm–5pm)", label: "Afternoon", sub: "12pm – 5pm" },
      { value: "Evening (after 5pm)", label: "Evening", sub: "After 5pm" },
    ],
  },
  {
    id: "flavorMood",
    question: "What's your flavor mood?",
    subtitle: "Trust your instincts right now.",
    options: [
      { value: "Fruity and bright — I want something lively and acidic", label: "Fruity & Bright", sub: "Lively, acidic, juicy" },
      { value: "Chocolatey and rich — deep, roasty warmth", label: "Chocolatey & Rich", sub: "Deep, warm, roasty" },
      { value: "Floral and delicate — something light and aromatic", label: "Floral & Delicate", sub: "Light, aromatic, tea-like" },
      { value: "Wild and funky — experimental, fermented, unusual", label: "Wild & Funky", sub: "Fermented, adventurous" },
    ],
  },
  {
    id: "intensity",
    question: "How intense?",
    subtitle: "How much of a kick are you after?",
    options: [
      { value: "Light and delicate — I want to taste every nuance", label: "Light & Nuanced", sub: "Every note, gently" },
      { value: "Medium and balanced — satisfying but not overwhelming", label: "Medium & Balanced", sub: "Solid, well-rounded" },
      { value: "Bold and intense — full extraction, strong flavors", label: "Bold & Intense", sub: "Full extraction, strong" },
    ],
  },
];

function defaultTimeOfDay() {
  const h = new Date().getHours();
  if (h < 9) return "Early morning (before 9am)";
  if (h < 12) return "Morning (9am–12pm)";
  if (h < 17) return "Afternoon (12pm–5pm)";
  return "Evening (after 5pm)";
}

export default function RecommendPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ timeOfDay: defaultTimeOfDay() });
  const [loading, setLoading] = useState(false);
  const [recommendedBean, setRecommendedBean] = useState(null);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  const currentStep = STEPS[step];

  function selectOption(value) {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);
    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 180);
    } else {
      fetchRecommendation(newAnswers);
    }
  }

  async function fetchRecommendation(finalAnswers) {
    setLoading(true);
    setRecommendedBean(null);
    setText("");
    setDone(false);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeOfDay: finalAnswers.timeOfDay,
          flavorMood: finalAnswers.flavorMood,
          intensity: finalAnswers.intensity,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let beanResolved = false;

      while (true) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;

        buffer += decoder.decode(value, { stream: true });

        if (!beanResolved) {
          const newlineIdx = buffer.indexOf("\n");
          if (newlineIdx !== -1) {
            const firstLine = buffer.slice(0, newlineIdx).trim();
            const rest = buffer.slice(newlineIdx + 1).trimStart();

            if (firstLine.startsWith("BEAN:")) {
              const beanName = firstLine.replace("BEAN:", "").trim();
              beanResolved = true;
              setLoading(false);
              buffer = rest;
              setText(rest);
              // Fetch bean details from Supabase
              supabase
                .from("beans")
                .select("*")
                .ilike("name", beanName)
                .single()
                .then(({ data }) => {
                  if (data) setRecommendedBean(data);
                });
            }
          }
        } else {
          setText(buffer);
        }
      }

      setDone(true);
    } catch {
      setLoading(false);
      setText("Something went wrong. Please try again.");
      setDone(true);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setRecommendedBean(null);
    setText("");
    setLoading(false);
    setDone(false);
  }

  const isResultView = loading || text || recommendedBean;

  return (
    <div className="pr">
      <style>{css}</style>
      <header className="pr-top">
        <Link href="/collection">Bean Journal</Link>
        <span className="pr-mono">Find my bean</span>
      </header>
      <main className="pr-main">
        {isResultView ? (
          <ResultView loading={loading} bean={recommendedBean} text={text} done={done} answers={answers} onRestart={restart} />
        ) : (
          <QuizStep
            key={step}
            step={step}
            totalSteps={STEPS.length}
            currentStep={currentStep}
            selected={answers[currentStep.id]}
            onSelect={selectOption}
            onBack={step > 0 ? () => setStep(step - 1) : null}
          />
        )}
      </main>
    </div>
  );
}

function QuizStep({ step, totalSteps, currentStep, selected, onSelect, onBack }) {
  return (
    <div className="pr-frame">
      <div className="pr-progress">
        {Array.from({ length: totalSteps }).map((_, i) => <i key={i} className={i < step ? "done" : i === step ? "now" : ""} />)}
        <span className="pr-mono">Step {step + 1} of {totalSteps}</span>
      </div>
      <h1 className="pr-q">{currentStep.question}</h1>
      <p className="pr-sub">{currentStep.subtitle}</p>
      <div className={`pr-options${currentStep.options.length === 3 ? " three" : ""}`}>
        {currentStep.options.map((opt, i) => (
          <button type="button" key={opt.value} className={`pr-opt${selected === opt.value ? " on" : ""}`} aria-pressed={selected === opt.value} onClick={() => onSelect(opt.value)}>
            <i style={{ background: TILES[i % 4] }} />
            <b>{opt.label}</b>
            <span className="pr-mono">{opt.sub}</span>
          </button>
        ))}
      </div>
      {onBack && <button type="button" className="pr-back" onClick={onBack}>← Back</button>}
    </div>
  );
}

function ResultView({ loading, bean, text, done, answers, onRestart }) {
  const moodLabel = answers.flavorMood?.split("—")[0]?.trim() || "";
  const intensityLabel = answers.intensity?.split("—")[0]?.trim() || "";

  return (
    <div className="pr-frame">
      <div className="pr-chips">
        {[answers.timeOfDay, moodLabel, intensityLabel].map((tag, i) => tag && <span key={i} className="pr-chip">{tag}</span>)}
      </div>

      {loading && !bean && <div className="pr-loading"><span className="pr-spinner" /><span className="pr-mono">Finding your bean…</span></div>}

      {bean && <RecommendedBean bean={bean} />}

      {text && (
        <div className="pr-why">
          <span className="pr-label">Why this bean</span>
          <p>{text}{!done && <span className="pr-caret" />}</p>
        </div>
      )}

      {done && (
        <div className="pr-actions">
          <button type="button" className="pr-btn primary" onClick={onRestart}>Try again</button>
          <Link href="/collection" className="pr-btn">Back to collection</Link>
        </div>
      )}
    </div>
  );
}
