const MANA_COLORS = {
  W: { bg: "#f9f6d2", color: "#7a6a00" },
  U: { bg: "#b3ceea", color: "#1a3e6e" },
  B: { bg: "#4a3f42", color: "#f0e8e8" },
  R: { bg: "#e8a27c", color: "#7a2200" },
  G: { bg: "#a9c9a7", color: "#1a4a1a" },
};

export default function ManaPip({ symbol }) {
  const style = MANA_COLORS[symbol];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 22, height: 22, borderRadius: "50%",
      background: style?.bg ?? "#ccc8c0",
      color: style?.color ?? "#3a3634",
      fontSize: 10, fontWeight: 700,
      border: "1px solid rgba(0,0,0,0.2)",
      flexShrink: 0,
    }}>{symbol}</span>
  );
}

export function parseMana(cost) {
  if (!cost) return null;
  const pips = [...cost.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
      {pips.map((p, i) => <ManaPip key={i} symbol={p} />)}
    </div>
  );
}

export function replaceSymbols(text) {
  if (!text) return null;
  return text.split(/(\{[^}]+\})/g).map((part, i) => {
    const m = part.match(/^\{([^}]+)\}$/);
    return m ? <ManaPip key={i} symbol={m[1]} /> : <span key={i}>{part}</span>;
  });
}
