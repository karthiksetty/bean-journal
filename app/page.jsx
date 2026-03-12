"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uumvzroswrgqmaeoqajc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXZ6cm9zd3JncW1hZW9xYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODAwMDksImV4cCI6MjA4ODY1NjAwOX0.IPfyrSTzVa8gVjAj1wk8KUwDd19_RzBonXOLXxofw0I"
);

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

const EMPTY_FORM = { name: "", variety: [], varietyInput: "", brand: "", myRating: 0, aroma: "", region: [], regionInput: "", process: "", bean: "Arabica", producer: "", notes: "", available: true };

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

const REGION_FILTERS = ["All", "Colombia", "Kenya", "Ethiopia", "Mexico", "Peru"];

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

function matchesRegionFilter(regions, filter) {
  if (filter === "All") return true;
  return regions.some(r => r.includes(filter));
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

function BeanCard({ bean, onClick }) {
  const accentColor = (processColors[bean.process] || { dot: "#C4A882" }).dot;
  const unavailable = bean.available === false;
  return (
    <div onClick={() => onClick(bean)}
      style={{ background: "#FEFCF8", border: "1px solid #EDE5D8", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden", opacity: unavailable ? 0.5 : 1, filter: unavailable ? "grayscale(70%)" : "none" }}
      onMouseEnter={e => { if (!unavailable) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(44,24,16,0.08)"; e.currentTarget.style.borderColor = "#C4A882"; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#EDE5D8"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: accentColor, borderRadius: "16px 16px 0 0" }} />
      {unavailable && (
        <div style={{ position: "absolute", top: "12px", right: "12px", background: "#EBEBEB", color: "#888", fontSize: "10px", fontWeight: "600", padding: "3px 8px", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ran out</div>
      )}
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#2C1810", fontFamily: "'Playfair Display', serif", lineHeight: "1.3", marginBottom: "4px" }}>{bean.name}</h3>
        <p style={{ margin: 0, fontSize: "12px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif" }}>
          {bean.brand && bean.brand !== "—" ? bean.brand : ""}{bean.brand && bean.brand !== "—" && bean.producer ? " · " : ""}{bean.producer}
        </p>
      </div>
      <div style={{ marginBottom: "10px" }}>
        {bean.region.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "4px" }}>
            <span style={{ fontSize: "12px", color: "#8C7A68", fontFamily: "'DM Sans', sans-serif", marginRight: "2px" }}>📍</span>
            {bean.region.map(r => <span key={r} style={{ fontSize: "12px", color: "#8C7A68", fontFamily: "'DM Sans', sans-serif" }}>{r}{bean.region.indexOf(r) < bean.region.length - 1 ? " ·" : ""} </span>)}
          </div>
        )}
        {bean.variety.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
            <span style={{ fontSize: "12px", color: "#8C7A68", fontFamily: "'DM Sans', sans-serif", marginRight: "2px" }}>🌱</span>
            {bean.variety.slice(0, 2).map(v => <span key={v} style={{ fontSize: "12px", color: "#8C7A68", fontFamily: "'DM Sans', sans-serif" }}>{v}{bean.variety.indexOf(v) < Math.min(bean.variety.length, 2) - 1 ? " ·" : ""} </span>)}
            {bean.variety.length > 2 && <span style={{ fontSize: "12px", color: "#A0896B", fontFamily: "'DM Sans', sans-serif" }}>+{bean.variety.length - 2} more</span>}
          </div>
        )}
      </div>
      {bean.aroma.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
          {bean.aroma.slice(0, 3).map(a => <AromaTag key={a} label={a} small />)}
          {bean.aroma.length > 3 && <span style={{ background: "#F5EFE6", color: "#A0896B", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontFamily: "'DM Sans', sans-serif" }}>+{bean.aroma.length - 3}</span>}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <ProcessBadge process={bean.process} />
        {bean.myRating > 0
          ? <CupRating value={bean.myRating} />
          : <span style={{ color: "#C4B99A", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>Not rated</span>}
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
  const [processFilter, setProcessFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [selectedBean, setSelectedBean] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editBean, setEditBean] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetchBeans();
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchBeans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("beans").select("*").order("created_at", { ascending: true });
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
    available: bean.available !== false,
  });

  const handleAdd = async (bean) => {
    const { data, error } = await supabase.from("beans").insert([beanToDb(bean)]).select().single();
    if (!error) setBeans(prev => [...prev, dbToBean(data)]);
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

  const allProcesses = ["All", ...new Set(beans.map(b => b.process).filter(Boolean))];

  const filtered = beans.filter(b => {
    const matchSearch = !search
      || b.name.toLowerCase().includes(search.toLowerCase())
      || (b.brand && b.brand.toLowerCase().includes(search.toLowerCase()))
      || b.region.some(r => r.toLowerCase().includes(search.toLowerCase()))
      || b.variety.some(v => v.toLowerCase().includes(search.toLowerCase()))
      || b.aroma.some(a => a.toLowerCase().includes(search.toLowerCase()));
    const matchProcess = processFilter === "All" || b.process === processFilter;
    const matchRegion = matchesRegionFilter(b.region, regionFilter);
    return matchSearch && matchProcess && matchRegion;
  });

  const uniqueCountries = new Set(beans.flatMap(b => b.region.map(r => {
    if (r.includes("Colombia")) return "Colombia";
    if (r.includes("Kenya")) return "Kenya";
    if (r.includes("Ethiopia")) return "Ethiopia";
    if (r.includes("Mexico")) return "Mexico";
    if (r.includes("Peru")) return "Peru";
    return r;
  })));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAF7F2; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D4C4B0; border-radius: 3px; }
        input:focus { border-color: #C4A882 !important; box-shadow: 0 0 0 3px rgba(196,168,130,0.15); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .filter-row { display: flex; gap: 6px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .header-wrap { padding: 14px 16px 12px !important; }
          .header-title { font-size: 20px !important; }
          .bean-count { display: none !important; }
          .find-btn { padding: 8px 10px !important; font-size: 12px !important; gap: 4px !important; }
          .signin-btn { padding: 8px 12px !important; font-size: 12px !important; }
          .add-btn { padding: 8px 12px !important; font-size: 12px !important; gap: 4px !important; }
          .signout-btn { padding: 8px 10px !important; font-size: 12px !important; }
          .filter-row { flex-wrap: nowrap !important; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 2px; }
          .filter-row::-webkit-scrollbar { display: none; }
          .filter-row button { white-space: nowrap; flex-shrink: 0; }
          .search-area { gap: 8px !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#FAF7F2" }}>
        {/* Header */}
        <div className="header-wrap" style={{ background: "#FEFCF8", borderBottom: "1px solid #EDE5D8", padding: "32px 40px 24px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                <h1 className="header-title" style={{ fontSize: "28px", fontWeight: "700", color: "#2C1810", fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}>Bean Journal</h1>
                <span className="bean-count" style={{ background: "#F5EFE6", color: "#A0896B", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", fontFamily: "'DM Sans', sans-serif" }}>{beans.length} beans</span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <a href="/recommend" className="find-btn"
                  style={{ padding: "10px 18px", background: "#F5EAD8", border: "none", borderRadius: "12px", color: "#8B4F1E", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#EDD8BB"}
                  onMouseLeave={e => e.currentTarget.style.background = "#F5EAD8"}
                >✨ Find My Bean</a>
                {session ? (
                  <>
                    <button onClick={() => setShowAddForm(true)} className="add-btn"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#2C1810", border: "none", borderRadius: "12px", color: "#FAF7F2", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    ><span style={{ fontSize: "16px" }}>+</span> Add Bean</button>
                    <button onClick={() => supabase.auth.signOut()} className="signout-btn"
                      style={{ padding: "10px 16px", background: "transparent", border: "1px solid #EDE5D8", borderRadius: "12px", color: "#A0896B", fontSize: "13px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#C4A882"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#EDE5D8"}
                    >Sign out</button>
                  </>
                ) : (
                  <a href="/login" className="signin-btn"
                    style={{ padding: "10px 20px", background: "transparent", border: "1px solid #EDE5D8", borderRadius: "12px", color: "#6B5039", fontSize: "13px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}
                  >Sign in</a>
                )}
              </div>
            </div>

            <div className="search-area" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search beans, regions, varieties, flavours…"
                style={{ width: "100%", padding: "10px 16px", border: "1px solid #EDE5D8", borderRadius: "12px", background: "#FAF7F2", fontSize: "13px", color: "#2C1810", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <div className="filter-row">
                {allProcesses.map(p => <button key={p} onClick={() => setProcessFilter(p)} style={{ padding: "8px 14px", borderRadius: "20px", border: "1px solid", borderColor: processFilter === p ? "#2C1810" : "#EDE5D8", background: processFilter === p ? "#2C1810" : "transparent", color: processFilter === p ? "#FAF7F2" : "#6B5039", fontSize: "12px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>{p}</button>)}
              </div>
              <div className="filter-row">
                {REGION_FILTERS.map(r => <button key={r} onClick={() => setRegionFilter(r)} style={{ padding: "8px 14px", borderRadius: "20px", border: "1px solid", borderColor: regionFilter === r ? "#C4A882" : "#EDE5D8", background: regionFilter === r ? "#C4A882" : "transparent", color: regionFilter === r ? "#FAF7F2" : "#6B5039", fontSize: "12px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>{r}</button>)}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 40px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#A0896B", fontFamily: "'DM Sans', sans-serif" }}>Loading your beans…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#A0896B", fontFamily: "'DM Sans', sans-serif" }}>
              {beans.length === 0 ? "No beans yet — add your first one!" : "No beans match your search"}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filtered.map(bean => <BeanCard key={bean.id} bean={bean} onClick={setSelectedBean} />)}
            </div>
          )}

          {beans.length > 0 && (
            <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #EDE5D8", display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {[
                { label: "Total Beans", value: beans.length },
                { label: "Countries", value: uniqueCountries.size },
                { label: "Process Types", value: new Set(beans.map(b => b.process).filter(Boolean)).size },
                { label: "Rated", value: beans.filter(b => b.myRating > 0).length },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: "11px", color: "#A0896B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
                  <p style={{ fontSize: "24px", fontWeight: "700", color: "#2C1810", fontFamily: "'Playfair Display', serif" }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DetailModal bean={selectedBean} onClose={() => setSelectedBean(null)} onEdit={bean => setEditBean(bean)} onDelete={handleDelete} onToggleAvailability={handleToggleAvailability} canEdit={!!session} />
      {(showAddForm || editBean) && (
        <AddBeanModal
          editBean={editBean}
          onClose={() => { setShowAddForm(false); setEditBean(null); }}
          onSave={bean => { if (editBean) handleEdit(bean); else handleAdd(bean); }}
        />
      )}
    </>
  );
}
