export const FAM = {
  natural:   { label: "Natural",    tile: "#D2483A", accent: "#D9A441", cof: ["#C27A3E", "#6B2C1F"] },
  honey:     { label: "Honey",      tile: "#D9A441", accent: "#D2483A", cof: ["#E0A65A", "#8A4E22"] },
  washed:    { label: "Washed",     tile: "#9DB0A8", accent: "#A47B60", cof: ["#B98552", "#4A2E1C"] },
  anaerobic: { label: "Anaerobic",  tile: "#A47B60", accent: "#9DB0A8", cof: ["#9C5A33", "#2E160E"] },
  coferment: { label: "Co-ferment", tile: "#D9A99B", accent: "#5A2A22", cof: ["#F3E6D2", "#C9A27E"] },
  carbonic:  { label: "Carbonic",   tile: "#5A2A22", accent: "#D9A99B", cof: ["#D08B4E", "#3A160E"] },
};
export const TAG_DOTS = ["#D2483A", "#D9A441", "#9DB0A8", "#A47B60"];

// Free-text process names are grouped into the six colour families of the poster design.
export function processFamily(process) {
  const p = (process || "").toLowerCase();
  if (p.includes("carbonic")) return "carbonic";
  if (/co-?\s?ferment/.test(p)) return "coferment";
  if (p.includes("anaerobic")) return "anaerobic";
  if (p.includes("honey")) return "honey";
  if (p.includes("washed")) return "washed";
  return "natural";
}

export function lastDrunkLabel(days) {
  if (days === null) return null;
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
