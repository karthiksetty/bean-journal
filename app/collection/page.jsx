"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase-browser";
import { FAM, TAG_DOTS, processFamily } from "../lib/poster";


const INITIAL_BEANS = [
  { id: 1,  name: "Finca Milán",                    variety: ["Caturra"],                                        brand: "Pure Pastry",        myRating: 4,  aroma: ["Vanilla","Lime","Iced Tea"],                              region: ["Risaralda, Colombia"],                     process: "Co-fermented",          bean: "Arabica", producer: "",                          notes: "Can be strong, need to create the right recipe" },
  { id: 2,  name: "Washed Pink Bourbon",             variety: ["Pink Bourbon"],                                   brand: "Standout Coffee",    myRating: 0,  aroma: ["Rose","Jasmine","Mango","Pink Lemonade","Tangerines"],    region: ["San Agustin, Huila, Colombia"],            process: "Washed",                bean: "Arabica", producer: "Wilson Ortega",              notes: "" },
  { id: 3,  name: "CGLE Potosi Natural Cider",       variety: ["Sidra"],                                          brand: "TANAT",              myRating: 0,  aroma: ["Wild Cherry","Red Plum","Blackberry","Chocolate"],        region: ["Valle del Cauca, Colombia"],               process: "Natural",               bean: "Arabica", producer: "Café Granja La Esperanza",  notes: "" },
  { id: 4,  name: "Café Granja La Esperanza",        variety: ["Sidra"],                                          brand: "—",                  myRating: 0,  aroma: [],                                                        region: ["Valle del Cauca, Colombia"],               process: "Natural",               bean: "Arabica", producer: "Rigoberto Herrera",          notes: "SCA Score: 87" },
  { id: 5,  name: "BPM Blueberry Pie Magic",         variety: ["Caturra","Pache","Castillo"],                     brand: "People Possession",  myRating: 0,  aroma: ["Blueberry Pie","Raspberry Ripple Ice Cream","Vanilla"],   region: ["Peru","Colombia"],                         process: "Co-fermented",          bean: "Arabica", producer: "Blend by roaster",           notes: "" },
  { id: 6,  name: "WWE Wild Watermelon Experience",  variety: ["SL-28","SL-34","Ruiru 11","Batian","Castillo"],   brand: "People Possession",  myRating: 0,  aroma: ["Watermelon Candy","Yellow Melon","Guava"],                region: ["Kirinyaga, Kenya","Huila, Colombia"],      process: "Co-fermented",          bean: "Arabica", producer: "Gakuyu-ini Factory, Los Patios", notes: "" },
  { id: 7,  name: "Eloxochitlán",                    variety: ["Typica","Mundo Novo","Bourbon"],                  brand: "Brew",               myRating: 0,  aroma: ["Stone Fruit","Black Tea","Sweet Spices","Cranberries"],   region: ["Sierra Mazateca, Oaxaca, Mexico"],         process: "Washed",                bean: "Arabica", producer: "",                          notes: "Altitude: 1500–1650m. Roasted: 03.02.2026" },
  { id: 8,  name: "La Joya",                         variety: ["Caturra","Castillo","Colombia"],                  brand: "Brew",               myRating: 0,  aroma: ["Tropical Fruits","Strawberry","Blood Orange","Caramel"],  region: ["Nariño, Colombia"],                        process: "Natural",               bean: "Arabica", producer: "Jermy Pedraza",              notes: "Altitude: 2000m. Roasted: 28.01.2026" },
  { id: 9,  name: "Mundayo Aash WS",                 variety: ["Natural Regional Landrace"],                      brand: "Testi Coffee",       myRating: 0,  aroma: ["Blackberry","Apricot","Nutmeg","Orange Blossom","Nougat"],region: ["Werka, West Arsi, Ethiopia"],              process: "Washed",                bean: "Arabica", producer: "Faysel A. Yonis",            notes: "" },
  { id: 10, name: "Yellow Honeymoon",                variety: [],                                                 brand: "Gemi Roasters",      myRating: 0,  aroma: ["Apricot","Lychee","Vanilla","Tropical Sweet"],            region: ["Colombia"],                               process: "Osmotic Dehydration",   bean: "Arabica", producer: "",                          notes: "Body: 4/5 · Fruit: 5/5 · Intensity: 5/5" },
  { id: 11, name: "Ombligon",                        variety: ["Ombligon"],                                       brand: "RVTC",               myRating: 0,  aroma: ["Sour Cherry","Tonka Bean","Amaretto","Cocoa","Cherry Coke"],region: ["Huila, Acevedo, Las Flores, Colombia"],   process: "Natural & Thermal Shock",bean: "Arabica", producer: "Jhoan Vergara",             notes: "" },
  { id: 12, name: "Sakami Kenya",                    variety: ["SL-28","Ruiru 11","Batian"],                      brand: "Hoppenworth & Ploch",myRating: 0,  aroma: ["Sweet Cherry","Orange","Lime","Wine Gum"],                region: ["Kenya"],                                  process: "Natural",               bean: "Arabica", producer: "",                          notes: "Harvest: Sept–Dec 2024" },
];

const EMPTY_FORM = { name: "", variety: [], varietyInput: "", brand: "", myRating: 0, aroma: "", region: [], regionInput: "", process: "", bean: "Arabica", producer: "", website: "", notes: "", available: true };

function CupRating({ value, onChange, interactive = false }) {
  const [hovered, setHovered] = useState(null);
  const display = hovered !== null ? hovered : value;
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          onClick={interactive ? () => onChange(value === n ? 0 : n) : undefined}
          onMouseEnter={interactive ? () => setHovered(n) : undefined}
          onMouseLeave={interactive ? () => setHovered(null) : undefined}
          style={{
            fontSize: interactive ? "22px" : "16px",
            cursor: interactive ? "pointer" : "default",
            opacity: n <= display ? 1 : 0.2,
            transition: "opacity 0.1s, transform 0.1s",
            transform: interactive && hovered === n ? "scale(1.2)" : "scale(1)",
            display: "inline-block",
            userSelect: "none",
          }}
        >☕</span>
      ))}
      {!interactive && value === 0 && <span style={{ color: "#C4B99A", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>Not rated</span>}
    </div>
  );
}

const processColors = {
  "Washed":                   { bg: "#E8F0EC", text: "#3A6B52", dot: "#3A6B52" },  // sage green
  "Natural":                  { bg: "#F5EAD8", text: "#8B4F1E", dot: "#8B4F1E" },  // warm terracotta
  "Co-fermented":             { bg: "#EAE4F0", text: "#5C4A7A", dot: "#5C4A7A" },  // dusty lavender
  "Natural & Thermal Shock":  { bg: "#F0E8E0", text: "#7A4030", dot: "#7A4030" },  // deep clay
  "Osmotic Dehydration":      { bg: "#E6EEF5", text: "#2D5A7A", dot: "#2D5A7A" },  // muted slate blue
};


// Aroma colour categories
const AROMA_CATEGORIES = [
  { keywords: ["berry","blueberry","raspberry","strawberry","cherry","blackberry","cranberry","redcurrant","wine gum","red plum","wild cherry","sour cherry","sweet cherry"], bg: "#FFE4E8", text: "#C0344D" },
  { keywords: ["citrus","orange","lime","lemon","grapefruit","tangerine","blood orange","yuzu","pink lemonade"], bg: "#FFF3CD", text: "#B45309" },
  { keywords: ["tropical","mango","guava","lychee","passion","pineapple","papaya","coconut","watermelon","melon","yellow melon","watermelon candy","tropical sweet","tropische","tropical fruits"], bg: "#D1FAE5", text: "#065F46" },
  { keywords: ["floral","rose","jasmine","blossom","orange blossom","hibiscus","lavender","elderflower"], bg: "#FCE7F3", text: "#9D174D" },
  { keywords: ["chocolate","cocoa","cacao","dark chocolate","milk chocolate","mocha"], bg: "#3D1C02", text: "#F5D0A9" },
  { keywords: ["caramel","toffee","brown sugar","molasses","honey","nougat","butterscotch","vanilla","cream","butter","cake","pie","biscuit","pastry","blueberry pie","raspberry ripple","ice cream"], bg: "#FEF3C7", text: "#92400E" },
  { keywords: ["spice","nutmeg","cinnamon","cardamom","clove","pepper","ginger","sweet spices"], bg: "#FDE68A", text: "#78350F" },
  { keywords: ["stone fruit","peach","apricot","plum","nectarine","steinobst"], bg: "#FFEDD5", text: "#C2410C" },
  { keywords: ["tea","black tea","green tea","oolong","iced tea","herbal"], bg: "#ECFDF5", text: "#047857" },
  { keywords: ["wine","winey","ferment","cider","amaretto","cherry coke","tonka"], bg: "#EDE9FE", text: "#5B21B6" },
  { keywords: ["nut","almond","hazelnut","walnut","peanut"], bg: "#F5F0E8", text: "#6B5039" },
];

function getAromaColor(aroma) {
  const lower = aroma.toLowerCase();
  for (const cat of AROMA_CATEGORIES) {
    if (cat.keywords.some(k => lower.includes(k))) return { bg: cat.bg, text: cat.text };
  }
  return { bg: "#F0F4FF", text: "#3730A3" }; // default blue for unknowns
}

function AromaTag({ label, small = false }) {
  const { bg, text } = getAromaColor(label);
  return (
    <span style={{ background: bg, color: text, padding: small ? "2px 8px" : "4px 12px", borderRadius: small ? "10px" : "12px", fontSize: small ? "11px" : "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}>
      {label}
    </span>
  );
}

function ProcessBadge({ process }) {
  const colors = processColors[process] || { bg: "#F5F0E8", text: "#6B5C45", dot: "#6B5C45" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: colors.bg, color: colors.text, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", fontFamily: "'DM Sans', sans-serif" }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: colors.dot, display: "inline-block" }} />
      {process || "Unknown"}
    </span>
  );
}

// Reusable tag input: value=array, onChange=fn, placeholder, inputVal, onInputChange
function TagInput({ value, onChange, placeholder, inputVal, onInputChange }) {
  const addTag = (raw) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    onInputChange("");
  };
  const handleKey = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault();
      addTag(inputVal);
    }
    if (e.key === "Backspace" && !inputVal && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "8px 12px", border: "1px solid #EDE5D8", borderRadius: "10px", background: "#FAF7F2", minHeight: "42px", alignItems: "center" }}
      onClick={e => e.currentTarget.querySelector("input")?.focus()}
    >
      {value.map(tag => (
        <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#E8DDD0", color: "#4A3728", padding: "2px 8px 2px 10px", borderRadius: "8px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}>
          {tag}
          <button onClick={() => onChange(value.filter(t => t !== tag))} style={{ background: "none", border: "none", cursor: "pointer", color: "#8C7A68", fontSize: "14px", lineHeight: 1, padding: "0 1px" }}>×</button>
        </span>
      ))}
      <input
        value={inputVal}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => inputVal.trim() && addTag(inputVal)}
        placeholder={value.length === 0 ? placeholder : ""}
        style={{ border: "none", outline: "none", background: "transparent", fontSize: "13px", color: "#2C1810", fontFamily: "'DM Sans', sans-serif", minWidth: "120px", flex: 1 }}
      />
    </div>
  );
}

function lastDrunkLabel(days) {
  if (days === null) return null;
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function beanCountries(bean) {
  return bean.region.map(r => r.split(",").at(-1).trim()).filter(Boolean);
}

function PosterCard({ bean, index, onClick, drinkLog, onLog }) {
  const fam = FAM[processFamily(bean.process)];
  const out = bean.available === false;
  const lastDays = drinkLog?.lastDays ?? null;
  const cups = drinkLog?.count ?? 0;
  const brand = bean.brand && bean.brand !== "—" ? bean.brand : "";
  const roasterLine = [brand, bean.producer].filter(Boolean).join(" · ");
  const variety = bean.variety.slice(0, 2).join(" · ") + (bean.variety.length > 2 ? ` +${bean.variety.length - 2} more` : "");
  const cupWord = `${cups} cup${cups === 1 ? "" : "s"}`;
  const logLine = out ? `Ran out · ${cupWord}` : lastDays === null ? "Never logged" : `${lastDrunkLabel(lastDays)} · ${cupWord}`;

  return (
    <div className="pj-card" onClick={() => onClick(bean)} style={{ "--op": out ? 0.55 : 1 }}>
      <div className="pj-card-head">
        <h3 className="pj-card-name">{bean.name}</h3>
        <div className="pj-card-no">
          <span>Nº{String(index + 1).padStart(2, "0")}</span>
          <div className="pj-swatches"><i style={{ background: fam.tile }} /><i style={{ background: "#161210" }} /><i style={{ background: fam.accent }} /></div>
        </div>
      </div>
      <div className="pj-tile" style={{ background: fam.tile }}>
        <div className="pj-tile-shadow" />
        <div className="pj-tile-cup">
          <div className="pj-cup-handle" />
          <div className="pj-cup-body"><div style={{ background: `radial-gradient(circle at 42% 38%,${fam.cof[0]} 0 22%,${fam.cof[1]} 74%)` }} /></div>
        </div>
        <span className="pj-tile-proc">{bean.process || "Unknown"}</span>
        <span className="pj-tile-rating">{bean.myRating > 0 ? `★ ${bean.myRating}/5` : "NOT RATED"}</span>
      </div>
      <div className="pj-card-info">
        <div className="pj-fields">
          {roasterLine && <div className="pj-field"><span className="pj-label">ROASTER</span><b>{roasterLine}</b></div>}
          {bean.region.length > 0 && <div className="pj-field"><span className="pj-label">ORIGIN</span><span>{bean.region.join(" · ")}</span></div>}
          {variety && <div className="pj-field"><span className="pj-label">VARIETY</span><span>{variety}</span></div>}
        </div>
        <div className="pj-notes">
          <span className="pj-label">NOTES</span>
          {bean.aroma.slice(0, 4).map((a, j) => <span key={a} className="pj-note"><i style={{ background: TAG_DOTS[j % 4] }} />{a}</span>)}
          {bean.aroma.length > 4 && <span className="pj-more">+{bean.aroma.length - 4} more</span>}
        </div>
      </div>
      <div className="pj-card-foot">
        <span className="pj-log" style={{ color: !out && lastDays === 0 ? "#B23A2E" : "#161210" }}>{logLine}</span>
        <button type="button" className="pj-log-btn" title="Log a cup" onClick={e => { e.stopPropagation(); onLog(bean.id); }}>
          <span className="pj-mug"><span style={{ height: `${Math.min(100, Math.round(cups / 15 * 100))}%`, background: fam.tile }} /></span>+1 cup
        </button>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "11px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #EDE5D8", borderRadius: "10px", background: "#FAF7F2", fontSize: "13px", color: "#2C1810", fontFamily: "'DM Sans', sans-serif", outline: "none" };

function AddBeanModal({ onClose, onSave, editBean }) {
  const [form, setForm] = useState(editBean
    ? { ...editBean, aroma: editBean.aroma.join(", "), myRating: editBean.myRating ?? 0, varietyInput: "", regionInput: "", available: editBean.available !== false }
    : EMPTY_FORM
  );
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    // Flush any pending tag inputs
    const finalVariety = form.varietyInput.trim() ? [...form.variety, form.varietyInput.trim()] : form.variety;
    const finalRegion  = form.regionInput.trim()  ? [...form.region,  form.regionInput.trim()]  : form.region;
    onSave({
      id: editBean ? editBean.id : Date.now(),
      name: form.name, brand: form.brand, producer: form.producer,
      region: finalRegion, variety: finalVariety,
      process: form.process, bean: form.bean,
      aroma: form.aroma ? form.aroma.split(",").map(s => s.trim()).filter(Boolean) : [],
      myRating: form.myRating ?? 0,
      notes: form.notes,
      website: (form.website || "").trim(),
      available: form.available !== false,
    });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(44,24,16,0.4)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FEFCF8", borderRadius: "24px", width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto", padding: "36px", position: "relative", boxShadow: "0 24px 80px rgba(44,24,16,0.2)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#C4A882", borderRadius: "24px 24px 0 0" }} />
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", background: "#F5EFE6", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px", color: "#6B5039" }}>×</button>
        <h2 style={{ margin: "0 0 24px", fontSize: "22px", fontWeight: "700", color: "#2C1810", fontFamily: "'Playfair Display', serif" }}>{editBean ? "Edit Bean" : "Add New Bean"}</h2>

        <div style={{ display: "grid", gap: "16px" }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. La Joya" style={inputStyle} />
          </div>

          {/* Brand + Producer */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Brand / Roaster</label>
              <input value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="e.g. Brew" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Producer</label>
              <input value={form.producer} onChange={e => set("producer", e.target.value)} placeholder="e.g. Jermy Pedraza" style={inputStyle} />
            </div>
          </div>

          {/* Region — tag input */}
          <div>
            <label style={labelStyle}>Region <span style={{ textTransform: "none", fontSize: "10px", opacity: 0.7 }}>(press Enter or comma to add)</span></label>
            <TagInput
              value={form.region}
              onChange={v => set("region", v)}
              placeholder="e.g. Nariño, Colombia — add multiple for blends"
              inputVal={form.regionInput}
              onInputChange={v => set("regionInput", v)}
            />
          </div>

          {/* Variety — tag input */}
          <div>
            <label style={labelStyle}>Variety <span style={{ textTransform: "none", fontSize: "10px", opacity: 0.7 }}>(press Enter or comma to add)</span></label>
            <TagInput
              value={form.variety}
              onChange={v => set("variety", v)}
              placeholder="e.g. Sidra — add multiple varieties"
              inputVal={form.varietyInput}
              onInputChange={v => set("varietyInput", v)}
            />
          </div>

          {/* Process + Bean */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Process</label>
              <input value={form.process} onChange={e => set("process", e.target.value)} placeholder="e.g. Natural, Washed…" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Bean Type</label>
              <input value={form.bean} onChange={e => set("bean", e.target.value)} placeholder="e.g. Arabica" style={inputStyle} />
            </div>
          </div>

          {/* Aroma */}
          <div>
            <label style={labelStyle}>Aroma & Flavour <span style={{ textTransform: "none", fontSize: "10px", opacity: 0.7 }}>(comma separated)</span></label>
            <input value={form.aroma} onChange={e => set("aroma", e.target.value)} placeholder="e.g. Blueberry, Caramel, Jasmine" style={inputStyle} />
          </div>

          {/* Rating + Notes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>My Rating</label>
              <div style={{ padding: "8px 12px", border: "1px solid #EDE5D8", borderRadius: "10px", background: "#FAF7F2", display: "flex", alignItems: "center" }}>
                <CupRating value={form.myRating ?? 0} onChange={v => set("myRating", v)} interactive />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Website</label>
              <input type="url" value={form.website || ""} onChange={e => set("website", e.target.value)} placeholder="https://roaster.com/this-coffee" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <input value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Any personal notes…" style={inputStyle} />
            </div>
          </div>
        </div>

          {/* Availability */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", border: "1px solid #EDE5D8", borderRadius: "10px", background: "#FAF7F2" }}>
            <div>
              <p style={{ margin: 0, fontSize: "13px", color: "#2C1810", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}>In my collection</p>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif" }}>Toggle off if you've run out</p>
            </div>
            <button type="button" onClick={() => set("available", !form.available)}
              style={{ width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer", background: form.available ? "#2C1810" : "#D1D5DB", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
            >
              <span style={{ position: "absolute", top: "2px", left: form.available ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "50%", background: "white", transition: "left 0.2s", display: "block" }} />
            </button>
          </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", border: "1px solid #EDE5D8", borderRadius: "12px", background: "transparent", color: "#6B5039", fontSize: "14px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
          <button onClick={handleSave} style={{ flex: 2, padding: "12px", border: "none", borderRadius: "12px", background: "#2C1810", color: "#FAF7F2", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{editBean ? "Save Changes" : "Add Bean"}</button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ bean, onClose, onEdit, onDelete, onToggleAvailability, canEdit }) {
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
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(44,24,16,0.4)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FEFCF8", borderRadius: "24px", width: "100%", maxWidth: "520px", maxHeight: "85vh", overflowY: "auto", padding: "36px", position: "relative", boxShadow: "0 24px 80px rgba(44,24,16,0.2)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: (processColors[bean.process] || { dot: "#C4A882" }).dot, borderRadius: "24px 24px 0 0" }} />
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", background: "#F5EFE6", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px", color: "#6B5039" }}>×</button>

        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#2C1810", fontFamily: "'Playfair Display', serif", marginBottom: "4px", paddingRight: "40px" }}>{bean.name}</h2>
        {(bean.brand && bean.brand !== "—" || bean.producer) && (
          <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif" }}>
            {bean.brand && bean.brand !== "—" ? bean.brand : ""}{bean.brand && bean.brand !== "—" && bean.producer ? " · " : ""}{bean.producer}
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <ProcessBadge process={bean.process} />
          {bean.myRating > 0 && <CupRating value={bean.myRating} />}
          {bean.available === false && (
            <span style={{ background: "#EBEBEB", color: "#777", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ran out</span>
          )}
        </div>

        {/* Region */}
        {bean.region.length > 0 && (
          <div style={{ background: "#F9F4EC", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>📍 Region</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {bean.region.map(r => <span key={r} style={{ background: "#E8DDD0", color: "#4A3728", padding: "3px 10px", borderRadius: "8px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}>{r}</span>)}
            </div>
          </div>
        )}

        {/* Variety */}
        {bean.variety.length > 0 && (
          <div style={{ background: "#F9F4EC", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>🌱 Variety</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {bean.variety.map(v => <span key={v} style={{ background: "#E8DDD0", color: "#4A3728", padding: "3px 10px", borderRadius: "8px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}>{v}</span>)}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          {[{ label: "Bean", value: bean.bean, icon: "☕" }, { label: "Brand", value: bean.brand !== "—" ? bean.brand : "—", icon: "🏷️" }].map(({ label, value, icon }) => (
            <div key={label} style={{ background: "#F9F4EC", borderRadius: "12px", padding: "14px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{icon} {label}</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#2C1810", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}>{value || "—"}</p>
            </div>
          ))}
        </div>

        {bean.aroma.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>☁️ Aroma & Flavour</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {bean.aroma.map(a => <AromaTag key={a} label={a} />)}
            </div>
          </div>
        )}

        {bean.notes && (
          <div style={{ background: "#F5EFE6", borderRadius: "12px", padding: "14px", marginBottom: "20px" }}>
            <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>📝 Notes</p>
            <p style={{ margin: 0, fontSize: "13px", color: "#4A3728", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.5" }}>{bean.notes}</p>
          </div>
        )}

        {/* Bean Facts */}
        <div style={{ borderTop: "1px solid #EDE5D8", paddingTop: "20px", marginBottom: canEdit ? "16px" : "0" }}>
          {!facts && !factsLoading && (
            <button onClick={fetchFacts}
              style={{ width: "100%", padding: "11px", background: "#F5EAD8", border: "none", borderRadius: "12px", color: "#8B4F1E", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#EDD8BB"}
              onMouseLeave={e => e.currentTarget.style.background = "#F5EAD8"}
            >✨ Discover Facts</button>
          )}
          {factsLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#A0896B", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", padding: "4px 0" }}>
              <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid #EDE5D8", borderTopColor: "#C4A882", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
              Looking up facts…
            </div>
          )}
          {facts && (
            <div style={{ background: "#F9F4EC", borderRadius: "12px", padding: "16px" }}>
              <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>✨ Bean Facts</p>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.75, color: "#2C1810", fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap" }}>
                {facts}
                {!factsDone && <span style={{ display: "inline-block", width: "2px", height: "13px", background: "#C4A882", marginLeft: "2px", verticalAlign: "middle", animation: "blink 0.8s step-end infinite" }} />}
              </p>
            </div>
          )}
        </div>

        {canEdit && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #EDE5D8", paddingTop: "16px" }}>
            <button
              onClick={() => onToggleAvailability(bean)}
              style={{ width: "100%", padding: "10px", border: "1px solid", borderColor: bean.available === false ? "#BBF7D0" : "#EDE5D8", borderRadius: "10px", background: bean.available === false ? "#F0FDF4" : "transparent", color: bean.available === false ? "#166534" : "#6B5039", fontSize: "13px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
            >{bean.available === false ? "✅ Back in Stock" : "☕ Mark as Ran Out"}</button>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => { onEdit(bean); onClose(); }} style={{ flex: 1, padding: "10px", border: "1px solid #EDE5D8", borderRadius: "10px", background: "transparent", color: "#6B5039", fontSize: "13px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✏️ Edit</button>
              <button onClick={() => { if (confirm(`Delete "${bean.name}"?`)) onDelete(bean.id); }} style={{ flex: 1, padding: "10px", border: "1px solid #FECACA", borderRadius: "10px", background: "transparent", color: "#DC2626", fontSize: "13px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🗑️ Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BeanDatabase() {
  const [beans, setBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [procFilter, setProcFilter] = useState([]);
  const [ctryFilter, setCtryFilter] = useState([]);
  const [selectedBean, setSelectedBean] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editBean, setEditBean] = useState(null);
  const [session, setSession] = useState(null);

  const [showHow, setShowHow] = useState(false);
  const [drinkLogs, setDrinkLogs] = useState({}); // { beanId: { count, lastDays } }
  const [lastCup, setLastCup] = useState(null); // { beanId, days }
  const [hideUnavailable, setHideUnavailable] = useState(true);

  const toggleHideUnavailable = () => {
    setHideUnavailable(prev => {
      const next = !prev;
      localStorage.setItem("bj_hideUnavailable", String(next));
      return next;
    });
  };

  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleFiltersOpen = () => {
    setFiltersOpen(prev => {
      const next = !prev;
      localStorage.setItem("bj_filtersOpen", String(next));
      return next;
    });
  };

  useEffect(() => {
    // Saved toggles are read after mount so the first render matches the server's.
    setHideUnavailable(localStorage.getItem("bj_hideUnavailable") !== "false");
    setFiltersOpen(localStorage.getItem("bj_filtersOpen") === "true");
    fetchBeans();
    fetchDrinkLogs();
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchDrinkLogs = async () => {
    const { data, error } = await supabase.from("drink_logs").select("bean_id, logged_at").order("logged_at", { ascending: false });
    if (error || !data) return;
    const map = {};
    const today = new Date(); today.setHours(0,0,0,0);
    for (const row of data) {
      const id = row.bean_id;
      if (!map[id]) {
        const d = new Date(row.logged_at); d.setHours(0,0,0,0);
        const days = Math.round((today - d) / 86400000);
        map[id] = { count: 0, lastDays: days };
      }
      map[id].count++;
    }
    setDrinkLogs(map);
    if (data[0]) setLastCup({ beanId: data[0].bean_id, days: map[data[0].bean_id].lastDays });
  };

  const logCup = async (beanId) => {
    const { error } = await supabase.from("drink_logs").insert({ bean_id: beanId });
    if (error) return;
    setLastCup({ beanId, days: 0 });
    setDrinkLogs(prev => {
      const existing = prev[beanId];
      return { ...prev, [beanId]: { count: (existing?.count ?? 0) + 1, lastDays: 0 } };
    });
  };

  const fetchBeans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("beans").select("*").order("created_at", { ascending: false });
    if (!error) setBeans(data.map(dbToBean));
    setLoading(false);
  };

  // Convert DB row (snake_case) to app bean (camelCase)
  const dbToBean = (row) => ({
    id: row.id,
    name: row.name,
    brand: row.brand || "",
    producer: row.producer || "",
    region: row.region || [],
    variety: row.variety || [],
    process: row.process || "",
    bean: row.bean || "Arabica",
    aroma: row.aroma || [],
    myRating: row.my_rating || 0,
    notes: row.notes || "",
    website: row.website || "",
    available: row.available !== false,
  });

  // Convert app bean to DB row
  const beanToDb = (bean) => ({
    name: bean.name,
    brand: bean.brand,
    producer: bean.producer,
    region: bean.region,
    variety: bean.variety,
    process: bean.process,
    bean: bean.bean,
    aroma: bean.aroma,
    my_rating: bean.myRating,
    notes: bean.notes,
    website: bean.website || null,
    available: bean.available !== false,
  });

  const handleAdd = async (bean) => {
    const { data, error } = await supabase.from("beans").insert([beanToDb(bean)]).select().single();
    if (!error) setBeans(prev => [dbToBean(data), ...prev]);
  };

  const handleEdit = async (bean) => {
    const { error } = await supabase.from("beans").update(beanToDb(bean)).eq("id", bean.id);
    if (!error) setBeans(prev => prev.map(b => b.id === bean.id ? bean : b));
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("beans").delete().eq("id", id);
    if (!error) {
      setBeans(prev => prev.filter(b => b.id !== id));
      setSelectedBean(null);
    }
  };

  const handleToggleAvailability = async (bean) => {
    const newAvailable = bean.available === false;
    const { error } = await supabase.from("beans").update({ available: newAvailable }).eq("id", bean.id);
    if (!error) {
      const updated = { ...bean, available: newAvailable };
      setBeans(prev => prev.map(b => b.id === bean.id ? updated : b));
      setSelectedBean(updated);
    }
  };

  const toggleIn = (arr, v) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  const allCountries = [...new Set(beans.flatMap(beanCountries))].sort();
  const activeFilterCount = procFilter.length + ctryFilter.length;
  const availableCount = beans.filter(b => b.available !== false).length;
  const ranOutCount = beans.length - availableCount;

  const q = search.trim().toLowerCase();
  const filtered = beans.filter(b => {
    if (hideUnavailable && b.available === false) return false;
    if (procFilter.length && !procFilter.includes(processFamily(b.process))) return false;
    if (ctryFilter.length && !beanCountries(b).some(c => ctryFilter.includes(c))) return false;
    return !q || [b.name, b.brand, b.producer, b.process, ...b.region, ...b.variety, ...b.aroma].join(" ").toLowerCase().includes(q);
  });

  const lastCupBean = lastCup ? beans.find(b => b.id === lastCup.beanId) : null;
  const lastCupText = lastCupBean ? `${lastCupBean.name} · ${lastDrunkLabel(lastCup.days)}` : "No cups yet";

  // The hero banner takes the colours of the last cup's process family.
  const heroFamKey = lastCupBean ? processFamily(lastCupBean.process) : "natural";
  const heroFam = FAM[heroFamKey];
  const artStyle = {
    "--art-bg": heroFam.tile,
    "--art-ink": ["honey", "washed", "coferment"].includes(heroFamKey) ? "#161210" : "#F3ECDD",
    "--cof-a": heroFam.cof[0],
    "--cof-b": heroFam.cof[1],
    "--cof-ink": heroFamKey === "coferment" ? "#161210" : "#F3ECDD",
  };

  const marqueeTags = [...new Set(filtered.flatMap(b => b.aroma))].slice(0, 30).join("  ✦  ");
  const marquee = marqueeTags && `${marqueeTags}  ✦  ${marqueeTags}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Space+Grotesk:wght@400;500;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #E9E3D6; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D4C4B0; border-radius: 3px; }
        input:focus { border-color: #C4A882 !important; box-shadow: 0 0 0 3px rgba(196,168,130,0.15); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .how-drawer { position: fixed; bottom: 0; left: 0; right: 0; height: 92vh; background: #FEFCF8; border-radius: 20px 20px 0 0; box-shadow: 0 -8px 40px rgba(44,24,16,0.15); z-index: 300; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32,0.72,0,1); overflow-y: auto; }
        .how-drawer.open { transform: translateY(0); }
        .how-overlay { position: fixed; inset: 0; background: rgba(44,24,16,0.4); backdrop-filter: blur(2px); z-index: 299; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .how-overlay.open { opacity: 1; pointer-events: all; }
        @media (min-width: 641px) {
          .how-drawer { top: 0; left: auto; right: 0; bottom: 0; width: 480px; height: 100vh; border-radius: 0; transform: translateX(100%); }
          .how-drawer.open { transform: translateX(0); }
        }

        .pj { min-height: 100vh; overflow-x: clip; color: #161210; font-family: 'Space Grotesk', sans-serif; --tf: 'Righteous'; --fw: 12px; background: #E9E3D6 url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix values=%220 0 0 0 0.1 0 0 0 0 0.07 0 0 0 0 0.05 0 0 0 0.22 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E'); }
        .pj button { cursor: pointer; }
        .pj input::placeholder { color: #161210; opacity: .5; }

        .pj-bar { position: sticky; top: 0; z-index: 20; height: 64px; margin-bottom: -64px; background: #161210; color: #F3ECDD; display: none; align-items: center; gap: 16px; padding: 0 max(20px, calc((100% - 1180px) / 2)); }
        .pj-bar-title { font: 800 30px/1 var(--tf); letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
        .pj-bar-count { font: 500 12px 'DM Mono', monospace; border: 1.5px solid #F3ECDD; padding: 4px 8px; white-space: nowrap; }
        .pj-bar-add { height: 44px; padding: 0 18px; border: none; background: #D9A441; color: #161210; font: 700 15px 'Space Grotesk', sans-serif; white-space: nowrap; }
        .pj-bar-progress { position: absolute; left: 0; right: 0; bottom: 0; height: 5px; background: linear-gradient(90deg, #D2483A 0 17%, #D9A441 0 34%, #9DB0A8 0 51%, #A47B60 0 68%, #D9A99B 0 85%, #5A2A22 0); transform-origin: left; }

        .pj-wrap { max-width: 1180px; margin: 0 auto; padding: clamp(24px, 5vw, 56px) 20px 0; }
        .pj-hero { background: #F3ECDD; border: var(--fw, 14px) solid #161210; box-shadow: 0 24px 50px rgba(22,18,16,.22); padding: clamp(18px, 3vw, 34px); }
        .pj-hero-top { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 28px; transform-origin: left bottom; }
        .pj-title { font: 900 clamp(64px, 11vw, 148px)/0.84 var(--tf); letter-spacing: .03em; text-transform: uppercase; }
        .pj-count { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; padding-bottom: 6px; }
        .pj-count-num { font: 800 clamp(34px, 4vw, 52px)/0.9 var(--tf); }
        .pj-count-num span { opacity: .45; }
        .pj-count-bars { display: flex; gap: 4px; }
        .pj-count-bars i { width: 34px; height: 5px; display: block; background: #D2483A; }
        .pj-count-bars i:nth-child(2) { background: #F3ECDD; outline: 1.5px solid #161210; }
        .pj-count-bars i:nth-child(3) { background: #9DB0A8; }
        .pj-count-label { font: 500 11px 'DM Mono', monospace; letter-spacing: .12em; }

        .pj-art { --h: clamp(230px, 24vw, 290px); --ring: calc(var(--h) - 24px); --cup: calc(var(--ring) * 0.6); --cy: 50%; position: relative; margin-top: 18px; background: var(--art-bg, #D2483A); height: var(--h); overflow: hidden; }
        .pj-art-shadow { position: absolute; left: 68%; top: calc(var(--cy) - var(--cup) / 2); width: 110%; height: var(--cup); background: rgba(40,12,8,.24); transform-origin: 0 50%; transform: rotate(45deg); }
        .pj-ring-anchor { position: absolute; left: 68%; top: var(--cy); width: 0; height: 0; }
        .pj-ring { position: absolute; left: calc(var(--ring) / -2); top: calc(var(--ring) / -2); width: var(--ring); height: var(--ring); }
        .pj-ring svg { width: 100%; height: 100%; overflow: visible; }
        .pj-ring text { fill: var(--art-ink, #F3ECDD); font-family: 'DM Mono', monospace; font-weight: 500; font-size: 10.5px; }
        .pj-hero-cup { position: absolute; left: 68%; top: var(--cy); width: var(--cup); aspect-ratio: 1; transform: translate(-50%, -50%); }
        .pj-hero-handle { position: absolute; right: -18%; top: 42%; width: 24%; height: 16%; border-radius: 10px; background: #F6F1E6; }
        .pj-hero-saucer { position: absolute; inset: 0; border-radius: 50%; background: #F6F1E6; display: flex; align-items: center; justify-content: center; }
        .pj-hero-coffee { width: 78%; height: 78%; border-radius: 50%; background: radial-gradient(circle at 42% 38%, var(--cof-a, #C27A3E) 0 22%, var(--cof-b, #6B2C1F) 72%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--cof-ink, #F3ECDD); }
        .pj-hero-num { font: 900 calc(var(--cup) * 0.34)/0.85 var(--tf); }
        .pj-hero-left { font: 500 max(8px, calc(var(--cup) * 0.055)) 'DM Mono', monospace; letter-spacing: .14em; }
        .pj-last { position: absolute; left: clamp(16px, 3vw, 32px); bottom: clamp(16px, 3vw, 28px); display: flex; flex-direction: column; gap: 4px; color: var(--art-ink, #F3ECDD); }
        .pj-last span { font: 500 11px 'DM Mono', monospace; letter-spacing: .14em; }
        .pj-last b { font: 800 clamp(26px, 3.4vw, 44px)/0.95 var(--tf); text-transform: uppercase; max-width: 9em; }

        .pj-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 18px; padding-top: 16px; border-top: 2px solid #161210; }
        .pj-btn { height: 52px; padding: 0 22px; display: inline-flex; align-items: center; border: 2px solid #161210; color: #161210; font: 700 16px 'Space Grotesk', sans-serif; text-decoration: none; }
        .pj-btn-dark { padding: 0 24px; border: none; background: #161210; color: #F3ECDD; }
        .pj-btn-dark:hover { background: #D2483A; }
        .pj-btn-gold { background: #D9A441; }
        .pj-btn-sage { background: #9DB0A8; }
        .pj-link { height: 52px; padding: 0 6px; display: inline-flex; align-items: center; border: none; background: none; color: #161210; font: 700 15px 'Space Grotesk', sans-serif; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 5px; }
        .pj-link:hover { color: #D2483A; }

        .pj-controls { display: flex; flex-direction: column; gap: 16px; margin-top: 36px; }
        .pj-search { display: flex; align-items: center; gap: 14px; background: #F3ECDD; border: 3px solid #161210; padding: 0 22px; }
        .pj-search span { font: 800 22px var(--tf); letter-spacing: .06em; }
        .pj-search input { flex: 1; min-width: 0; height: 64px; border: none; outline: none; background: transparent; color: #161210; font: 500 20px 'Space Grotesk', sans-serif; }
        .pj-search input:focus { box-shadow: none; }
        .pj-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 24px; }
        .pj-filter-btn { height: 46px; padding: 0 18px; border: 2.5px solid #161210; background: #F3ECDD; color: #161210; font: 700 15px 'Space Grotesk', sans-serif; }
        .pj-filter-btn.on { background: #161210; color: #F3ECDD; }
        .pj-switch { display: flex; align-items: center; gap: 12px; background: none; border: none; padding: 0; color: #161210; font: 700 15px 'Space Grotesk', sans-serif; }
        .pj-switch-track { width: 56px; height: 30px; border: 2.5px solid #161210; border-radius: 999px; background: #F3ECDD; position: relative; display: block; }
        .pj-switch-track.on { background: #D9A441; }
        .pj-switch-track span { position: absolute; top: 2px; left: 2px; width: 21px; height: 21px; border-radius: 50%; background: #161210; display: block; transition: left .2s; }
        .pj-switch-track.on span { left: 28px; }
        .pj-showing { margin-left: auto; font: 500 13px 'DM Mono', monospace; }
        .pj-filters { display: grid; grid-template-columns: minmax(80px, 110px) minmax(0, 1fr); row-gap: 14px; padding: 22px 24px; background: #F3ECDD; border: 2.5px dashed #161210; }
        .pj-filters-label { font: 800 22px/38px var(--tf); letter-spacing: .04em; }
        .pj-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .pj-chip { height: 38px; padding: 0 14px; border: 2px solid #161210; background: #F3ECDD; color: #161210; font: 700 14px 'Space Grotesk', sans-serif; display: flex; align-items: center; gap: 8px; }
        .pj-chip.on { background: #161210; color: #F3ECDD; }
        .pj-chip i { width: 12px; height: 12px; border: 1.5px solid #161210; display: block; }

        .pj-marquee { overflow: hidden; background: #161210; margin: 48px -20px 52px; padding: 14px 0 16px; transform: rotate(-1.5deg); }
        .pj-marquee div { white-space: nowrap; font: 800 clamp(28px, 4vw, 46px)/1 var(--tf); letter-spacing: .06em; text-transform: uppercase; color: #D9A441; }

        .pj-grid { max-width: 1180px; margin: 0 auto; padding: 0 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 36px 32px; }
        .pj-empty { max-width: 1180px; margin: 0 auto; padding: 40px 20px; text-align: center; font: 800 clamp(26px, 4vw, 44px)/1 var(--tf); letter-spacing: .04em; text-transform: uppercase; }
        .pj-empty button { margin-left: 12px; }
        .pj-card { background: #F3ECDD; border: var(--fw, 12px) solid #161210; box-shadow: 0 18px 36px rgba(22,18,16,.2); padding: 18px 18px 16px; display: flex; flex-direction: column; opacity: var(--op, 1); cursor: pointer; }
        .pj-card-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; }
        .pj-card-name { min-width: 0; overflow-wrap: break-word; font: 800 32px/0.9 var(--tf); letter-spacing: .03em; text-transform: uppercase; text-wrap: balance; }
        .pj-card-no { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex: none; }
        .pj-card-no > span { font: 800 22px/1 var(--tf); }
        .pj-swatches { display: flex; gap: 3px; }
        .pj-swatches i { width: 16px; height: 4px; display: block; }
        .pj-tile { position: relative; margin-top: 12px; aspect-ratio: 1; overflow: hidden; }
        .pj-tile-shadow { position: absolute; left: 50%; top: 27%; width: 110%; height: 46%; background: rgba(30,12,8,.22); transform-origin: 0 50%; transform: rotate(45deg); }
        .pj-tile-cup { position: absolute; inset: 0; }
        .pj-cup-handle { position: absolute; left: 68%; top: 46%; width: 13%; height: 8%; border-radius: 6px; background: #F6F1E6; }
        .pj-cup-body { position: absolute; left: 27%; top: 27%; width: 46%; height: 46%; border-radius: 50%; background: #F6F1E6; box-shadow: inset 0 0 0 2px rgba(0,0,0,.04); }
        .pj-cup-body > div { position: absolute; inset: 11%; border-radius: 50%; }
        .pj-tile-proc { position: absolute; left: 12px; top: 12px; max-width: 58%; padding: 5px 9px; background: #F3ECDD; color: #161210; font: 500 10.5px/1.3 'DM Mono', monospace; letter-spacing: .04em; text-transform: uppercase; }
        .pj-tile-rating { position: absolute; right: 12px; top: 12px; padding: 5px 9px; background: #161210; color: #F3ECDD; font: 500 10.5px/1.3 'DM Mono', monospace; letter-spacing: .04em; }
        .pj-card-info { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 14px; padding: 14px 0; }
        .pj-fields { display: flex; flex-direction: column; gap: 8px; }
        .pj-field { display: flex; flex-direction: column; gap: 2px; font: 400 13.5px/1.35 'Space Grotesk', sans-serif; }
        .pj-field b { font-weight: 700; }
        .pj-label { align-self: flex-start; padding: 1px 5px; background: #161210; color: #F3ECDD; font: 500 9.5px 'DM Mono', monospace; letter-spacing: .12em; }
        .pj-notes { display: flex; flex-direction: column; gap: 5px; }
        .pj-note { font: 700 13.5px/1.25 'Space Grotesk', sans-serif; display: flex; gap: 7px; align-items: baseline; }
        .pj-note i { width: 8px; height: 8px; border-radius: 50%; flex: none; display: block; }
        .pj-more { font: 500 11px 'DM Mono', monospace; }
        .pj-card-foot { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: auto; padding-top: 12px; border-top: 2px solid #161210; }
        .pj-log { font: 500 12px/1.35 'DM Mono', monospace; }
        .pj-log-btn { height: 48px; padding: 0 14px 0 12px; border: 2px solid #161210; background: #F3ECDD; color: #161210; font: 700 14px 'Space Grotesk', sans-serif; display: flex; align-items: center; gap: 9px; flex: none; }
        .pj-log-btn:hover { background: #161210; color: #F3ECDD; }
        .pj-mug { width: 18px; height: 24px; border: 2.5px solid currentColor; border-top: none; border-radius: 0 0 4px 4px; position: relative; overflow: hidden; display: block; }
        .pj-mug > span { position: absolute; left: 0; right: 0; bottom: 0; display: block; transition: height .4s cubic-bezier(.3,1.6,.5,1); }

        .pj-stats { max-width: 1180px; margin: 0 auto; padding: 88px 20px 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 28px 22px; }
        .pj-stat { display: flex; flex-direction: column; gap: 10px; }
        .pj-stat-tile { position: relative; aspect-ratio: 1; overflow: hidden; border: 6px solid #161210; }
        .pj-stat-shadow { position: absolute; left: 50%; top: 22%; width: 110%; height: 56%; background: rgba(30,12,8,.22); transform-origin: 0 50%; transform: rotate(45deg); }
        .pj-stat-saucer { position: absolute; left: 22%; top: 22%; width: 56%; height: 56%; border-radius: 50%; background: #F6F1E6; display: flex; align-items: center; justify-content: center; }
        .pj-stat-saucer div { width: 80%; height: 80%; border-radius: 50%; background: radial-gradient(circle at 42% 38%, #A8662B 0 18%, #3E1F14 75%); display: flex; align-items: center; justify-content: center; color: #F3ECDD; font: 900 clamp(34px, 4vw, 50px)/1 var(--tf); }
        .pj-stat-label { font: 800 22px/1 var(--tf); letter-spacing: .05em; text-transform: uppercase; }
        .pj-foot { max-width: 1180px; margin: 0 auto; padding: 0 20px 100px; display: flex; justify-content: flex-end; }
        .pj-foot button { border: none; background: none; color: #161210; font: 500 12px 'DM Mono', monospace; letter-spacing: .06em; text-decoration: underline; text-underline-offset: 4px; }
        .pj-foot button:hover { color: #D2483A; }

        @media (max-width: 480px) {
          .pj-art { --ring: calc(var(--h) - 90px); --cy: 38%; }
          .pj-title { font-size: 15vw; }
          .pj-bar-title { font-size: 22px; }
          .pj-bar:has(.pj-bar-add) .pj-bar-count { display: none; }
          .pj-stats { grid-template-columns: 1fr 1fr; }
        }

        @keyframes bjspin { to { transform: rotate(360deg); } }
        @keyframes bjrise { from { opacity: 0; transform: translateY(110px) rotate(-3deg) scale(.94); } to { opacity: var(--op, 1); transform: none; } }
        @keyframes bjbar { from { opacity: 0; transform: translateY(-100%); visibility: hidden; } to { opacity: 1; transform: none; visibility: visible; } }
        @keyframes bjfill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes bjpar { to { transform: translateY(-40px) scale(.9); opacity: 0; } }
        @keyframes bjslide { from { transform: translateX(0); } to { transform: translateX(-45%); } }
        @keyframes bjpop { from { opacity: 0; transform: scale(.4) rotate(-25deg); } to { opacity: 1; transform: none; } }
        @keyframes bjshadow { from { transform: rotate(45deg) scaleX(0); } to { transform: rotate(45deg) scaleX(1); } }
        @keyframes bjcup { from { transform: rotate(-120deg) scale(.7); } to { transform: none; } }
        @media (prefers-reduced-motion: no-preference) {
          @supports (animation-timeline: view()) {
            .pj-bar { display: flex; animation: bjbar linear both; animation-timeline: scroll(root); animation-range: 420px 520px; }
            .pj-bar-progress { animation: bjfill linear both; animation-timeline: scroll(root); }
            .pj-hero-top { animation: bjpar linear both; animation-timeline: scroll(root); animation-range: 0 360px; }
            .pj-ring { animation: bjspin linear both; animation-timeline: scroll(root); }
            .pj-marquee div { animation: bjslide linear both; animation-timeline: scroll(root); }
            .pj-card { animation: bjrise linear both; animation-timeline: view(); animation-range: entry 0% cover 30%; }
            .pj-tile-shadow { animation: bjshadow linear both; animation-timeline: view(); animation-range: entry 20% cover 50%; }
            .pj-tile-cup { animation: bjcup linear both; animation-timeline: view(); animation-range: entry 10% cover 45%; }
            .pj-stat { animation: bjpop linear both; animation-timeline: view(); animation-range: entry 0% entry 100%; }
          }
        }
      `}</style>

      <div className="pj">
        <div className="pj-bar">
          <span className="pj-bar-title">Bean Journal</span>
          <span className="pj-bar-count">{availableCount} / {beans.length}</span>
          <span style={{ flex: 1 }} />
          {session && <button type="button" className="pj-bar-add" onClick={() => setShowAddForm(true)}>+ Add Bean</button>}
          <div className="pj-bar-progress" />
        </div>

        <div className="pj-wrap">
          <div className="pj-hero">
            <div className="pj-hero-top">
              <h1 className="pj-title">Bean Journal</h1>
              <div className="pj-count">
                <span className="pj-count-num">{availableCount}<span>/{beans.length}</span></span>
                <div className="pj-count-bars"><i /><i /><i /></div>
                <span className="pj-count-label">AVAILABLE · TOTAL</span>
              </div>
            </div>
            <div className="pj-art" style={artStyle}>
              <div className="pj-art-shadow" />
              <div className="pj-ring-anchor">
                <div className="pj-ring">
                  <svg viewBox="0 0 200 200" aria-hidden="true">
                    <path id="heroRing" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" fill="none" />
                    <text><textPath href="#heroRing" textLength="575" lengthAdjust="spacing">✦ BEAN JOURNAL ✦ FRESH ROASTS ✦ CUP AFTER CUP ✦ GOOD BEANS ONLY </textPath></text>
                  </svg>
                </div>
              </div>
              <div className="pj-hero-cup">
                <div className="pj-hero-handle" />
                <div className="pj-hero-saucer">
                  <div className="pj-hero-coffee">
                    <span className="pj-hero-num">{availableCount}</span>
                    <span className="pj-hero-left">BEANS LEFT</span>
                  </div>
                </div>
              </div>
              <div className="pj-last">
                <span>LAST CUP</span>
                <b>{lastCupText}</b>
              </div>
            </div>
            <div className="pj-actions">
              {session && <button type="button" className="pj-btn pj-btn-dark" onClick={() => setShowAddForm(true)}>+ Add Bean</button>}
              <a href="/stats" className="pj-btn pj-btn-gold">Stats</a>
              <a href="/recommend" className="pj-btn pj-btn-sage">Find My Bean</a>
              <span style={{ flex: 1 }} />
              {session
                ? <button type="button" className="pj-link" onClick={() => supabase.auth.signOut().then(() => { window.location.href = "/"; })}>Sign out</button>
                : <a href="/login" className="pj-link">Sign in</a>}
            </div>
          </div>

          <div className="pj-controls">
            <label className="pj-search">
              <span>SEARCH</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="beans, regions, varieties, flavours…" />
            </label>
            <div className="pj-toolbar">
              <button type="button" className={`pj-filter-btn${filtersOpen ? " on" : ""}`} onClick={toggleFiltersOpen} aria-expanded={filtersOpen}>
                Filters {activeFilterCount > 0 ? `(${activeFilterCount}) ` : ""}{filtersOpen ? "–" : "+"}
              </button>
              <button type="button" className="pj-switch" role="switch" aria-checked={hideUnavailable} onClick={toggleHideUnavailable}>
                <span className={`pj-switch-track${hideUnavailable ? " on" : ""}`}><span /></span>
                Hide ran out{ranOutCount > 0 ? ` (${ranOutCount})` : ""}
              </button>
              <span className="pj-showing">SHOWING {String(filtered.length).padStart(2, "0")}</span>
            </div>
            {filtersOpen && (
              <div className="pj-filters">
                <span className="pj-filters-label">PROCESS</span>
                <div className="pj-chips">
                  {Object.entries(FAM).map(([key, fam]) => (
                    <button type="button" key={key} className={`pj-chip${procFilter.includes(key) ? " on" : ""}`} onClick={() => setProcFilter(toggleIn(procFilter, key))}>
                      <i style={{ background: fam.tile }} />{fam.label}
                    </button>
                  ))}
                </div>
                <span className="pj-filters-label">COUNTRY</span>
                <div className="pj-chips">
                  {allCountries.map(c => (
                    <button type="button" key={c} className={`pj-chip${ctryFilter.includes(c) ? " on" : ""}`} onClick={() => setCtryFilter(toggleIn(ctryFilter, c))}>{c}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pj-marquee"><div>{marquee || "Bean Journal  ✦  Good beans only  ✦  Bean Journal  ✦  Good beans only"}</div></div>

        {loading ? (
          <div className="pj-empty">Loading your beans…</div>
        ) : filtered.length === 0 ? (
          <div className="pj-empty">
            {beans.length === 0
              ? "No beans yet. Add your first one!"
              : hideUnavailable && beans.every(b => b.available === false)
              ? <>All beans have run out.<button type="button" className="pj-link" onClick={toggleHideUnavailable}>Show them</button></>
              : "No beans match your search"}
          </div>
        ) : (
          <div className="pj-grid">
            {filtered.map((bean, i) => <PosterCard key={bean.id} bean={bean} index={i} onClick={setSelectedBean} drinkLog={drinkLogs[bean.id]} onLog={logCup} />)}
          </div>
        )}

        {beans.length > 0 && (
          <>
            <div className="pj-stats">
              {[
                { label: "Total beans", value: beans.length, tile: "#D2483A" },
                { label: "Available", value: availableCount, tile: "#D9A441" },
                { label: "Countries", value: allCountries.length, tile: "#9DB0A8" },
                { label: "Process types", value: new Set(beans.map(b => b.process).filter(Boolean)).size, tile: "#D9A99B" },
                { label: "Rated", value: beans.filter(b => b.myRating > 0).length, tile: "#A47B60" },
              ].map(({ label, value, tile }) => (
                <div key={label} className="pj-stat">
                  <div className="pj-stat-tile" style={{ background: tile }}>
                    <div className="pj-stat-shadow" />
                    <div className="pj-stat-saucer"><div>{value}</div></div>
                  </div>
                  <span className="pj-stat-label">{label}</span>
                </div>
              ))}
            </div>
            <div className="pj-foot"><button type="button" onClick={() => setShowHow(true)}>How this is built →</button></div>
          </>
        )}
      </div>

      <DetailModal bean={selectedBean} onClose={() => setSelectedBean(null)} onEdit={bean => setEditBean(bean)} onDelete={handleDelete} onToggleAvailability={handleToggleAvailability} canEdit={!!session} />
      {(showAddForm || editBean) && (
        <AddBeanModal
          editBean={editBean}
          onClose={() => { setShowAddForm(false); setEditBean(null); }}
          onSave={bean => { if (editBean) handleEdit(bean); else handleAdd(bean); }}
        />
      )}

      {/* How this is built drawer */}
      <div className={`how-overlay${showHow ? " open" : ""}`} onClick={() => setShowHow(false)} />
      <div className={`how-drawer${showHow ? " open" : ""}`}>
        {/* Handle bar (mobile) */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#EDE5D8" }} />
        </div>
        {/* Drawer header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 28px 16px", borderBottom: "1px solid #EDE5D8" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#2C1810", fontFamily: "'Playfair Display', serif" }}>How this is built</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif" }}>A personal coffee bean journal</p>
          </div>
          <button onClick={() => setShowHow(false)} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F5EFE6", border: "none", cursor: "pointer", fontSize: "18px", color: "#6B5039", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
        </div>
        {/* Sections */}
        <div style={{ padding: "24px 28px 48px" }}>
          {[
            { icon: "🤖", bg: "#EDE9FE", title: "Built with Claude", body: "This entire app (frontend, backend, database schema, and AI features) was designed and built through conversations with Claude (Anthropic). No boilerplate, no templates; every component and query was written iteratively in response to real feature requests." },
            { icon: "🗄️", bg: "#FEF3C7", title: "Database: Supabase", body: "Bean data, drink logs, and user accounts live in PostgreSQL via Supabase. Row-level security keeps each user's collection private. The anon key powers read access in the browser; a service-role key is used server-side for trusted writes." },
            { icon: "⚛️", bg: "#E0F2FE", title: "Frontend: Next.js + React", body: "The UI is built with Next.js 16 and React 18. No CSS framework; all styling uses inline styles with a warm editorial design system. Playfair Display for headings, DM Sans for body text, cream-and-terracotta palette throughout." },
            { icon: "✨", bg: "#FEF9C3", title: "AI Features: Claude API", body: "Two AI features powered by Anthropic's Claude: \"Discover Facts\" streams 3 specific facts about any bean covering terroir, genetics, and processing. \"Find My Bean\" recommends a bean from your collection based on mood and time of day." },
            { icon: "📸", bg: "#DCFCE7", title: "Add Bean from Photo", body: "A Claude Code skill lets you photograph any coffee bag and add it directly to the database. Claude's vision extracts the name, origin, variety, process, and tasting notes from the label. You review and confirm before it hits Supabase." },
            { icon: "🚀", bg: "#FFE4E6", title: "Deployed on Vercel", body: "The Next.js app is deployed on Vercel and served at beans.setty.in. Every push to the main branch triggers an automatic deployment. Environment variables keep the Supabase service role key secure on the server side." },
          ].map((s, i, arr) => (
            <div key={i} style={{ display: "flex", gap: "16px", paddingBottom: "24px", marginBottom: "24px", borderBottom: i < arr.length - 1 ? "1px solid #F0EAE0" : "none" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ margin: "0 0 5px", fontSize: "14px", fontWeight: "600", color: "#2C1810", fontFamily: "'DM Sans', sans-serif" }}>{s.title}</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#6B5039", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.65" }}>{s.body}</p>
              </div>
            </div>
          ))}
          {/* Stack pills */}
          <div>
            <p style={{ fontSize: "11px", color: "#A0896B", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px", fontWeight: "600" }}>Stack</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {["Next.js 16","React 18","Supabase","PostgreSQL","Claude API","Anthropic SDK","Vercel","Playfair Display","DM Sans"].map(t => (
                <span key={t} style={{ background: "#F5EFE6", color: "#6B5039", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", fontFamily: "'DM Sans', sans-serif", border: "1px solid #EDE5D8" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
