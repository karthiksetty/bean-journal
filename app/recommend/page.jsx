"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uumvzroswrgqmaeoqajc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXZ6cm9zd3JncW1hZW9xYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODAwMDksImV4cCI6MjA4ODY1NjAwOX0.IPfyrSTzVa8gVjAj1wk8KUwDd19_RzBonXOLXxofw0I"
);

const processColors = {
  "Washed":                   { bg: "#E8F0EC", text: "#3A6B52", dot: "#3A6B52" },
  "Natural":                  { bg: "#F5EAD8", text: "#8B4F1E", dot: "#8B4F1E" },
  "Co-fermented":             { bg: "#EAE4F0", text: "#5C4A7A", dot: "#5C4A7A" },
  "Natural & Thermal Shock":  { bg: "#F0E8E0", text: "#7A4030", dot: "#7A4030" },
  "Osmotic Dehydration":      { bg: "#E6EEF5", text: "#2D5A7A", dot: "#2D5A7A" },
};

const AROMA_CATEGORIES = [
  { keywords: ["berry","blueberry","raspberry","strawberry","cherry","blackberry","cranberry","redcurrant","wine gum","red plum","wild cherry","sour cherry","sweet cherry"], bg: "#FFE4E8", text: "#C0344D" },
  { keywords: ["citrus","orange","lime","lemon","grapefruit","tangerine","blood orange","yuzu","pink lemonade"], bg: "#FFF3CD", text: "#B45309" },
  { keywords: ["tropical","mango","guava","lychee","passion","pineapple","papaya","coconut","watermelon","melon","yellow melon","watermelon candy","tropical sweet","tropical fruits"], bg: "#D1FAE5", text: "#065F46" },
  { keywords: ["floral","rose","jasmine","blossom","orange blossom","hibiscus","lavender","elderflower"], bg: "#FCE7F3", text: "#9D174D" },
  { keywords: ["chocolate","cocoa","cacao","dark chocolate","milk chocolate","mocha"], bg: "#3D1C02", text: "#F5D0A9" },
  { keywords: ["caramel","toffee","brown sugar","molasses","honey","nougat","butterscotch","vanilla","cream","butter","cake","pie","biscuit","pastry","blueberry pie","raspberry ripple","ice cream"], bg: "#FEF3C7", text: "#92400E" },
  { keywords: ["spice","nutmeg","cinnamon","cardamom","clove","pepper","ginger","sweet spices"], bg: "#FDE68A", text: "#78350F" },
  { keywords: ["stone fruit","peach","apricot","plum","nectarine"], bg: "#FFEDD5", text: "#C2410C" },
  { keywords: ["tea","black tea","green tea","oolong","iced tea","herbal"], bg: "#ECFDF5", text: "#047857" },
  { keywords: ["wine","winey","ferment","cider","amaretto","cherry coke","tonka"], bg: "#EDE9FE", text: "#5B21B6" },
  { keywords: ["nut","almond","hazelnut","walnut","peanut"], bg: "#F5F0E8", text: "#6B5039" },
];

function getAromaColor(aroma) {
  const lower = aroma.toLowerCase();
  for (const cat of AROMA_CATEGORIES) {
    if (cat.keywords.some((k) => lower.includes(k))) return cat;
  }
  return { bg: "#F5EFE6", text: "#8C7A68" };
}

function AromaTag({ label }) {
  const { bg, text } = getAromaColor(label);
  return (
    <span style={{ background: bg, color: text, padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function ProcessBadge({ process }) {
  const colors = processColors[process] || { bg: "#F5EFE6", text: "#8C7A68", dot: "#C4A882" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: colors.bg, color: colors.text, padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em" }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: colors.dot, flexShrink: 0 }} />
      {process}
    </span>
  );
}

function CupRating({ value }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ fontSize: "14px", opacity: n <= value ? 1 : 0.2 }}>☕</span>
      ))}
    </div>
  );
}

function RecommendedBeanCard({ bean }) {
  const accentColor = (processColors[bean.process] || { dot: "#C4A882" }).dot;
  return (
    <div style={{ background: "#FEFCF8", border: "1.5px solid #EDE5D8", borderRadius: "18px", padding: "24px", position: "relative", overflow: "hidden", marginBottom: "20px" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: accentColor, borderRadius: "18px 18px 0 0" }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: "#2C1810", fontFamily: "'Playfair Display', serif", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
            {bean.name}
          </h2>
          {(bean.brand && bean.brand !== "—") || bean.producer ? (
            <p style={{ margin: 0, fontSize: "13px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif" }}>
              {bean.brand && bean.brand !== "—" ? bean.brand : ""}
              {bean.brand && bean.brand !== "—" && bean.producer ? " · " : ""}
              {bean.producer}
            </p>
          ) : null}
        </div>
        {bean.my_rating > 0 && <CupRating value={bean.my_rating} />}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
        {bean.region?.length > 0 && (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#8C7A68", fontFamily: "'DM Sans', sans-serif" }}>📍</span>
            <span style={{ fontSize: "13px", color: "#8C7A68", fontFamily: "'DM Sans', sans-serif" }}>{bean.region.join(" · ")}</span>
          </div>
        )}
        {bean.variety?.length > 0 && (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#8C7A68", fontFamily: "'DM Sans', sans-serif" }}>🌱</span>
            <span style={{ fontSize: "13px", color: "#8C7A68", fontFamily: "'DM Sans', sans-serif" }}>{bean.variety.join(" · ")}</span>
          </div>
        )}
      </div>

      {bean.aroma?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
          {bean.aroma.map(a => <AromaTag key={a} label={a} />)}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {bean.process && <ProcessBadge process={bean.process} />}
        {bean.notes ? (
          <span style={{ fontSize: "12px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", maxWidth: "60%", textAlign: "right" }}>{bean.notes}</span>
        ) : null}
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
      { value: "Early morning (before 9am)", label: "Early Morning", icon: "🌅", sub: "Before 9am" },
      { value: "Morning (9am–12pm)", label: "Morning", icon: "☀️", sub: "9am – 12pm" },
      { value: "Afternoon (12pm–5pm)", label: "Afternoon", icon: "🌤", sub: "12pm – 5pm" },
      { value: "Evening (after 5pm)", label: "Evening", icon: "🌙", sub: "After 5pm" },
    ],
  },
  {
    id: "flavorMood",
    question: "What's your flavor mood?",
    subtitle: "Trust your instincts right now.",
    options: [
      { value: "Fruity and bright — I want something lively and acidic", label: "Fruity & Bright", icon: "🍓", sub: "Lively, acidic, juicy" },
      { value: "Chocolatey and rich — deep, roasty warmth", label: "Chocolatey & Rich", icon: "🍫", sub: "Deep, warm, roasty" },
      { value: "Floral and delicate — something light and aromatic", label: "Floral & Delicate", icon: "🌸", sub: "Light, aromatic, tea-like" },
      { value: "Wild and funky — experimental, fermented, unusual", label: "Wild & Funky", icon: "🧪", sub: "Fermented, adventurous" },
    ],
  },
  {
    id: "intensity",
    question: "How intense?",
    subtitle: "How much of a kick are you after?",
    options: [
      { value: "Light and delicate — I want to taste every nuance", label: "Light & Nuanced", icon: "🪶", sub: "Every note, gently" },
      { value: "Medium and balanced — satisfying but not overwhelming", label: "Medium & Balanced", icon: "⚖️", sub: "Solid, well-rounded" },
      { value: "Bold and intense — full extraction, strong flavors", label: "Bold & Intense", icon: "🔥", sub: "Full extraction, strong" },
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
    <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <header style={{ padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EDE5D8", background: "#FEFCF8" }}>
        <Link href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: "#2C1810", textDecoration: "none", letterSpacing: "-0.3px" }}>
          Bean Journal
        </Link>
        <span style={{ fontSize: "12px", color: "#9B8B7A", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
          Bean Finder
        </span>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: "600px" }}>
          {isResultView ? (
            <ResultView
              loading={loading}
              bean={recommendedBean}
              text={text}
              done={done}
              answers={answers}
              onRestart={restart}
            />
          ) : (
            <QuizStep
              step={step}
              totalSteps={STEPS.length}
              currentStep={currentStep}
              onSelect={selectOption}
              onBack={step > 0 ? () => setStep(step - 1) : null}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function QuizStep({ step, totalSteps, currentStep, onSelect, onBack }) {
  return (
    <div style={{ animation: "fadeIn 0.25s ease" }}>
      {/* Step dots */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "36px", justifyContent: "center" }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{ width: i === step ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i < step ? "#C4A882" : i === step ? "#2C1810" : "#EDE5D8", transition: "all 0.3s ease" }} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, color: "#2C1810", margin: "0 0 8px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
          {currentStep.question}
        </h1>
        <p style={{ fontSize: "15px", color: "#9B8B7A", margin: 0 }}>{currentStep.subtitle}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: currentStep.options.length === 3 ? "1fr 1fr 1fr" : "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
        {currentStep.options.map(opt => (
          <button key={opt.value} onClick={() => onSelect(opt.value)}
            style={{ background: "#FEFCF8", border: "1.5px solid #EDE5D8", borderRadius: "16px", padding: "20px 16px", cursor: "pointer", textAlign: "center", transition: "all 0.15s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C4A882"; e.currentTarget.style.background = "#FDF8F0"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(44,24,16,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#EDE5D8"; e.currentTarget.style.background = "#FEFCF8"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span style={{ fontSize: "28px", lineHeight: 1 }}>{opt.icon}</span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#2C1810", lineHeight: 1.2 }}>{opt.label}</span>
            <span style={{ fontSize: "12px", color: "#9B8B7A", lineHeight: 1.3 }}>{opt.sub}</span>
          </button>
        ))}
      </div>

      {onBack && (
        <div style={{ textAlign: "center" }}>
          <button onClick={onBack}
            style={{ background: "none", border: "none", color: "#9B8B7A", fontSize: "14px", cursor: "pointer", padding: "8px 16px" }}
            onMouseEnter={e => e.currentTarget.style.color = "#2C1810"}
            onMouseLeave={e => e.currentTarget.style.color = "#9B8B7A"}
          >← Back</button>
        </div>
      )}
    </div>
  );
}

function ResultView({ loading, bean, text, done, answers, onRestart }) {
  const moodLabel = answers.flavorMood?.split("—")[0]?.trim() || "";
  const intensityLabel = answers.intensity?.split("—")[0]?.trim() || "";

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Preference chips */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "28px" }}>
        {[answers.timeOfDay, moodLabel, intensityLabel].map((tag, i) =>
          tag && (
            <span key={i} style={{ background: "#F5EAD8", color: "#8B4F1E", fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px" }}>
              {tag}
            </span>
          )
        )}
      </div>

      {/* Loading state */}
      {loading && !bean && (
        <div style={{ background: "#FEFCF8", border: "1.5px solid #EDE5D8", borderRadius: "18px", padding: "32px", textAlign: "center" }}>
          <BrewingSpinner />
          <p style={{ marginTop: "14px", color: "#9B8B7A", fontSize: "15px" }}>Finding your perfect bean…</p>
        </div>
      )}

      {/* Bean card */}
      {bean && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <RecommendedBeanCard bean={bean} />
        </div>
      )}

      {/* Recommendation text */}
      {text && (
        <div style={{ background: "#FEFCF8", border: "1.5px solid #EDE5D8", borderRadius: "18px", padding: "28px", marginBottom: "24px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", fontWeight: 600, color: "#C4A882", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px" }}>
            Why this bean
          </div>
          <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#2C1810", margin: 0, whiteSpace: "pre-wrap" }}>
            {text}
            {!done && (
              <span style={{ display: "inline-block", width: "2px", height: "15px", background: "#C4A882", marginLeft: "2px", verticalAlign: "middle", animation: "blink 0.8s step-end infinite" }} />
            )}
          </p>
        </div>
      )}

      {/* Actions */}
      {done && (
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", animation: "fadeIn 0.4s ease" }}>
          <button onClick={onRestart}
            style={{ background: "#2C1810", color: "#FAF7F2", border: "none", borderRadius: "12px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Try Again</button>
          <Link href="/"
            style={{ background: "transparent", color: "#2C1810", border: "1.5px solid #EDE5D8", borderRadius: "12px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", display: "inline-block", transition: "border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#C4A882"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#EDE5D8"}
          >Back to Collection</Link>
        </div>
      )}
    </div>
  );
}

function BrewingSpinner() {
  return (
    <span style={{ display: "inline-block", width: "24px", height: "24px", border: "2px solid #EDE5D8", borderTopColor: "#C4A882", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  );
}
