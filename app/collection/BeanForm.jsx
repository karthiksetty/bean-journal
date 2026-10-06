"use client";
import { useState } from "react";

const EMPTY_FORM = { name: "", variety: [], varietyInput: "", brand: "", myRating: 0, aroma: "", region: [], regionInput: "", process: "", bean: "Arabica", producer: "", website: "", notes: "", available: true };

const css = `
  .pf-overlay { position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(22,18,16,.6); backdrop-filter: blur(3px); }
  .pf { width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; background: #F3ECDD; border: 12px solid #161210; box-shadow: 0 24px 60px rgba(22,18,16,.4); color: #161210; font-family: 'Space Grotesk', sans-serif; --tf: 'Righteous'; }
  .pf button { cursor: pointer; font-family: 'Space Grotesk', sans-serif; }
  .pf-head { position: sticky; top: 0; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px 14px 22px; background: #161210; color: #F3ECDD; }
  .pf-head h2 { font: 400 26px/1 var(--tf); letter-spacing: .05em; text-transform: uppercase; }
  .pf-close { width: 36px; height: 36px; border: none; background: #F3ECDD; color: #161210; font: 400 22px/1 'Space Grotesk', sans-serif; }
  .pf-close:hover { background: #D9A441; }
  .pf-body { display: grid; gap: 16px; padding: 22px; }
  .pf-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .pf-field { display: flex; flex-direction: column; gap: 6px; }
  .pf-label { align-self: flex-start; padding: 1px 5px; background: #161210; color: #F3ECDD; font: 500 9.5px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
  .pf-hint { font: 500 10px 'DM Mono', monospace; letter-spacing: .04em; }
  .pf-labelrow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .pf-input, .pf-tags { width: 100%; min-height: 46px; border: 2px solid #161210; background: #FBF7EE; color: #161210; font: 500 15px 'Space Grotesk', sans-serif; outline: none; }
  .pf-input { padding: 0 12px; }
  .pf .pf-input:focus, .pf-tags:focus-within { border-color: #161210 !important; box-shadow: 4px 4px 0 #D9A441; }
  .pf input::placeholder { color: #161210; opacity: .4; }
  .pf-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 10px; cursor: text; }
  .pf-tags input { flex: 1; min-width: 120px; height: 30px; border: none; outline: none; background: transparent; color: #161210; font: 500 15px 'Space Grotesk', sans-serif; }
  .pf .pf-tags input:focus { box-shadow: none; }
  .pf-tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 4px 3px 9px; background: #161210; color: #F3ECDD; font: 700 13px 'Space Grotesk', sans-serif; }
  .pf-tag button { border: none; background: none; color: #F3ECDD; font-size: 16px; line-height: 1; padding: 0 4px; }
  .pf-tag button:hover { color: #D9A441; }
  .pf-rate { display: flex; align-items: center; gap: 4px; min-height: 46px; }
  .pf-rate button { width: 34px; height: 38px; display: flex; align-items: center; justify-content: center; border: none; background: none; color: #161210; }
  .pf-rate button span { width: 18px; height: 24px; border: 2.5px solid currentColor; border-top: none; border-radius: 0 0 4px 4px; display: block; }
  .pf-rate button.on span { background: #D9A441; }
  .pf-rate button:hover span { background: #161210; }
  .pf-stock { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 12px 14px; border: 2.5px dashed #161210; }
  .pf-stock b { display: block; font: 700 15px 'Space Grotesk', sans-serif; }
  .pf-switch { width: 56px; height: 30px; flex: none; border: 2.5px solid #161210; border-radius: 999px; background: #F3ECDD; position: relative; padding: 0; }
  .pf-switch.on { background: #D9A441; }
  .pf-switch span { position: absolute; top: 2px; left: 2px; width: 21px; height: 21px; border-radius: 50%; background: #161210; display: block; transition: left .2s; }
  .pf-switch.on span { left: 28px; }
  .pf-actions { display: flex; gap: 10px; padding-top: 6px; }
  .pf-btn { flex: 1; height: 52px; border: 2px solid #161210; background: #F3ECDD; color: #161210; font: 700 16px 'Space Grotesk', sans-serif; }
  .pf-btn:hover { background: #161210; color: #F3ECDD; }
  .pf-btn.primary { flex: 2; background: #161210; color: #F3ECDD; }
  .pf-btn.primary:hover { background: #D2483A; border-color: #D2483A; }
  .pf-btn.primary:disabled { opacity: .4; cursor: not-allowed; background: #161210; border-color: #161210; }
  @media (max-width: 520px) { .pf-two { grid-template-columns: minmax(0, 1fr); } }
`;

function TagInput({ value, onChange, placeholder, inputVal, onInputChange, commaAdds = true }) {
  const addTag = (raw) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    onInputChange("");
  };
  const handleKey = (e) => {
    if ((e.key === "Enter" || (commaAdds && e.key === ",")) && inputVal.trim()) {
      e.preventDefault();
      addTag(inputVal);
    }
    if (e.key === "Backspace" && !inputVal && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };
  return (
    <div className="pf-tags" onClick={e => e.currentTarget.querySelector("input")?.focus()}>
      {value.map(tag => (
        <span key={tag} className="pf-tag">
          {tag}
          <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter(t => t !== tag))}>×</button>
        </span>
      ))}
      <input
        value={inputVal}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => inputVal.trim() && addTag(inputVal)}
        placeholder={value.length === 0 ? placeholder : ""}
      />
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="pf-field">
      <div className="pf-labelrow"><span className="pf-label">{label}</span>{hint && <span className="pf-hint">{hint}</span>}</div>
      {children}
    </div>
  );
}

export default function AddBeanModal({ onClose, onSave, editBean }) {
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

  const rating = form.myRating ?? 0;

  return (
    <div className="pf-overlay" onClick={onClose}>
      <style>{css}</style>
      <div className="pf" onClick={e => e.stopPropagation()}>
        <div className="pf-head">
          <h2>{editBean ? "Edit bean" : "Add bean"}</h2>
          <button type="button" className="pf-close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <div className="pf-body">
          <Field label="Name *">
            <input className="pf-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="La Joya" />
          </Field>

          <div className="pf-two">
            <Field label="Roaster">
              <input className="pf-input" value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="Brew" />
            </Field>
            <Field label="Producer">
              <input className="pf-input" value={form.producer} onChange={e => set("producer", e.target.value)} placeholder="Jermy Pedraza" />
            </Field>
          </div>

          <Field label="Origin" hint="Region, Country · Enter to add">
            <TagInput commaAdds={false} value={form.region} onChange={v => set("region", v)} placeholder="Nariño, Colombia" inputVal={form.regionInput} onInputChange={v => set("regionInput", v)} />
          </Field>

          <Field label="Variety" hint="Enter or comma to add">
            <TagInput value={form.variety} onChange={v => set("variety", v)} placeholder="Sidra" inputVal={form.varietyInput} onInputChange={v => set("varietyInput", v)} />
          </Field>

          <div className="pf-two">
            <Field label="Process">
              <input className="pf-input" value={form.process} onChange={e => set("process", e.target.value)} placeholder="Natural" />
            </Field>
            <Field label="Bean type">
              <input className="pf-input" value={form.bean} onChange={e => set("bean", e.target.value)} placeholder="Arabica" />
            </Field>
          </div>

          <Field label="Flavours" hint="Comma separated">
            <input className="pf-input" value={form.aroma} onChange={e => set("aroma", e.target.value)} placeholder="Blueberry, Caramel, Jasmine" />
          </Field>

          <Field label="Website">
            <input className="pf-input" type="url" value={form.website || ""} onChange={e => set("website", e.target.value)} placeholder="https://roaster.com/this-coffee" />
          </Field>

          <Field label="Notes">
            <input className="pf-input" value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Roast date, price, brew thoughts" />
          </Field>

          <Field label="Your rating">
            <div className="pf-rate">
              {[1, 2, 3, 4, 5].map(n => (
                <button type="button" key={n} className={n <= rating ? "on" : ""} aria-label={`Rate ${n} of 5`} aria-pressed={n === rating} onClick={() => set("myRating", n === rating ? 0 : n)}><span /></button>
              ))}
            </div>
          </Field>

          <div className="pf-stock">
            <div><b>In my collection</b><span className="pf-hint">Switch off if you've run out</span></div>
            <button type="button" role="switch" aria-checked={form.available} aria-label="In my collection" className={`pf-switch${form.available ? " on" : ""}`} onClick={() => set("available", !form.available)}><span /></button>
          </div>

          <div className="pf-actions">
            <button type="button" className="pf-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="pf-btn primary" disabled={!form.name.trim()} onClick={handleSave}>{editBean ? "Save changes" : "Add bean"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
