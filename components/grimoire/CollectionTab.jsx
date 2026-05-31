"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGrimoire } from "../../contexts/GrimoireContext";
import { colorDotColor, scryfallImageUrl } from "../../utils/cardHelpers";

const cardImg = (item) => item.imageUri ?? scryfallImageUrl(item.cardId);

const COLOR_CHIPS = [
  { code: "W", label: "W", color: "#e0d8be" },
  { code: "U", label: "U", color: "#4a7fb5" },
  { code: "B", label: "B", color: "#8a8a9a" },
  { code: "R", label: "R", color: "#c94040" },
  { code: "G", label: "G", color: "#3d8a4a" },
  { code: "MULTI", label: "M", color: "#c9a227" },
  { code: "C", label: "C", color: "#888" },
];

const QTY_BTN = {
  background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.2)",
  borderRadius: 4, width: 24, height: 24, color: "#c9b99a",
  fontSize: 14, cursor: "pointer", fontFamily: "inherit",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const VIEW_TOGGLE_BTN = (active) => ({
  background: active ? "rgba(201,185,154,0.12)" : "transparent",
  border: `0.5px solid ${active ? "rgba(201,185,154,0.4)" : "rgba(201,185,154,0.15)"}`,
  borderRadius: 5, padding: "5px 10px",
  color: active ? "#c9b99a" : "rgba(201,185,154,0.4)",
  fontSize: 11, cursor: "pointer", fontFamily: "inherit",
  transition: "all 0.15s",
});

export default function CollectionTab() {
  const { collection, updateQuantity, removeFromCollection } = useGrimoire();
  const router = useRouter();
  const [nameFilter, setNameFilter] = useState("");
  const [colorFilter, setColorFilter] = useState([]);
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState("list");

  const filtered = useMemo(() => {
    let result = [...collection];
    if (nameFilter.trim()) {
      const q = nameFilter.toLowerCase();
      result = result.filter(i => i.cardName.toLowerCase().includes(q));
    }
    if (colorFilter.length > 0) {
      result = result.filter(item => {
        const c = item.colors ?? [];
        return colorFilter.some(f => {
          if (f === "MULTI") return c.length > 1;
          if (f === "C") return c.length === 0;
          return c.includes(f);
        });
      });
    }
    if (sort === "az") result.sort((a, b) => a.cardName.localeCompare(b.cardName));
    else if (sort === "za") result.sort((a, b) => b.cardName.localeCompare(a.cardName));
    return result;
  }, [collection, nameFilter, colorFilter, sort]);

  const totalCopies = collection.reduce((s, i) => s + i.quantityOwned, 0);
  const uniqueSets = new Set(collection.map(i => i.setCode)).size;

  const toggleColor = (code) =>
    setColorFilter(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);

  if (collection.length === 0) {
    return (
      <p style={{ color: "rgba(201,185,154,0.35)", fontStyle: "italic", fontSize: 13, marginTop: "3rem", textAlign: "center" }}>
        No cards in your collection yet.
      </p>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(201,185,154,0.45)", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <span>{collection.length} unique card{collection.length !== 1 ? "s" : ""}</span>
        <span style={{ color: "rgba(201,185,154,0.2)" }}>·</span>
        <span>{uniqueSets} set{uniqueSets !== 1 ? "s" : ""}</span>
        <span style={{ color: "rgba(201,185,154,0.2)" }}>·</span>
        <span>{totalCopies} total cop{totalCopies !== 1 ? "ies" : "y"}</span>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          placeholder="Filter by name..."
          style={{
            background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(201,185,154,0.25)",
            borderRadius: 6, padding: "7px 12px", color: "#e8dcc8",
            fontSize: 13, fontFamily: "Georgia, serif", width: 200, outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {COLOR_CHIPS.map(f => (
            <button
              key={f.code}
              onClick={() => toggleColor(f.code)}
              style={{
                width: 28, height: 28, borderRadius: "50%", cursor: "pointer",
                background: colorFilter.includes(f.code) ? f.color : "rgba(201,185,154,0.08)",
                border: `1.5px solid ${colorFilter.includes(f.code) ? f.color : "rgba(201,185,154,0.2)"}`,
                color: colorFilter.includes(f.code) ? "#0e0c09" : f.color,
                fontSize: 10, fontWeight: 700, fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >{f.label}</button>
          ))}
          {colorFilter.length > 0 && (
            <button
              onClick={() => setColorFilter([])}
              style={{ background: "transparent", border: "none", color: "rgba(201,185,154,0.4)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
            >Clear</button>
          )}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{
            background: "#0e0c09", border: "0.5px solid rgba(201,185,154,0.25)",
            borderRadius: 6, padding: "7px 10px", color: "#c9b99a",
            fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer", outline: "none",
          }}
        >
          <option value="recent">Recently Added</option>
          <option value="az">Name A–Z</option>
          <option value="za">Name Z–A</option>
        </select>
      </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button style={VIEW_TOGGLE_BTN(view === "list")} onClick={() => setView("list")}>≡ List</button>
          <button style={VIEW_TOGGLE_BTN(view === "grid")} onClick={() => setView("grid")}>⊞ Grid</button>
        </div>
      </div>

      {/* Results count */}
      {nameFilter || colorFilter.length > 0 ? (
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.35)", marginBottom: "1rem" }}>
          {filtered.length} of {collection.length} cards
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p style={{ color: "rgba(201,185,154,0.35)", fontStyle: "italic", fontSize: 13, textAlign: "center", padding: "2rem 0" }}>
          No cards match your filters.
        </p>
      ) : view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ position: "relative" }}>
              <div
                onClick={() => router.push(`/?openCard=${item.cardId}`)}
                style={{ borderRadius: 8, overflow: "hidden", cursor: "pointer", border: "0.5px solid rgba(201,185,154,0.1)", background: "#1a1610", transition: "border-color 0.15s, transform 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.4)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.1)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <img src={cardImg(item)} alt={item.cardName} style={{ width: "100%", display: "block", aspectRatio: "3/4", objectFit: "cover" }} onError={e => { e.currentTarget.style.display = "none"; }} />
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: 12, color: "#c9b99a", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.cardName}</div>
                  <div style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                    <span>{item.setCode}</span>
                    <span>×{item.quantityOwned}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => removeFromCollection(item.cardId)} title="Remove" style={{ position: "absolute", top: 6, right: 6, background: "rgba(14,12,9,0.85)", border: "0.5px solid rgba(201,185,154,0.2)", borderRadius: 4, color: "rgba(201,185,154,0.55)", fontSize: 13, cursor: "pointer", padding: "2px 7px", lineHeight: 1, fontFamily: "inherit" }}>×</button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {filtered.map(item => (
            <div
              key={item.id}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "0.5px solid rgba(201,185,154,0.06)" }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: colorDotColor(item.colors, item.colorIdentity),
                display: "inline-block",
              }} />
              <div
                style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                onClick={() => router.push(`/?openCard=${item.cardId}`)}
              >
                <div style={{ fontSize: 13, color: "#c9b99a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.cardName}
                </div>
                <div style={{ fontSize: 10, color: "rgba(201,185,154,0.35)", marginTop: 1 }}>
                  {item.setName} · #{item.collectorNumber}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button onClick={() => updateQuantity(item.cardId, item.quantityOwned - 1)} style={QTY_BTN}>−</button>
                <span style={{ fontSize: 13, color: "#e8dcc8", minWidth: 20, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                  {item.quantityOwned}
                </span>
                <button onClick={() => updateQuantity(item.cardId, item.quantityOwned + 1)} style={QTY_BTN}>+</button>
              </div>
              <button
                onClick={() => removeFromCollection(item.cardId)}
                style={{ background: "transparent", border: "none", color: "rgba(201,185,154,0.25)", fontSize: 16, cursor: "pointer", padding: "0 4px", fontFamily: "inherit", flexShrink: 0, transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.6)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.25)"}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
