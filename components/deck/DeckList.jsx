"use client";

import { useState } from "react";
import { deduplicateDeck } from "../../utils/deckUtils";

const CATEGORY_ORDER = ["Creatures", "Spells", "Artifacts", "Enchantments", "Planeswalkers", "Lands"];

export default function DeckList({ deckData, onCopy, copied, onSaveDeck }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveDeck?.(deckData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const deduped = deduplicateDeck(deckData.cards);
  const categories = [...new Set(deduped.map(c => c.category))];
  const sorted = CATEGORY_ORDER.filter(c => categories.includes(c));
  const total = deduped.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div style={{
      margin: "12px 0", borderRadius: 10,
      border: "0.5px solid rgba(201,185,154,0.2)",
      background: "rgba(201,185,154,0.04)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "12px 16px", borderBottom: "0.5px solid rgba(201,185,154,0.15)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e8dcc8" }}>{deckData.deckName}</div>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", marginTop: 4 }}>{deckData.description}</div>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", marginTop: 4 }}>{total} cards</div>
      </div>

      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {sorted.map(cat => {
          const cards = deduped.filter(c => c.category === cat);
          const catTotal = cards.reduce((s, c) => s + c.quantity, 0);
          return (
            <div key={cat}>
              <div style={{ fontSize: 10, color: "rgba(201,185,154,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                {cat} ({catTotal})
              </div>
              {cards.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: "0.5px solid rgba(201,185,154,0.06)" }}>
                  <span style={{ fontSize: 12, color: "#c9b99a" }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", fontVariantNumeric: "tabular-nums" }}>×{c.quantity}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "10px 16px", borderTop: "0.5px solid rgba(201,185,154,0.15)", display: "flex", gap: 8 }}>
        <button onClick={handleSave} style={{
          flex: 1, padding: "8px", borderRadius: 6,
          background: saved ? "rgba(80,160,120,0.15)" : "rgba(201,185,154,0.08)",
          border: "0.5px solid " + (saved ? "rgba(80,160,120,0.4)" : "rgba(201,185,154,0.2)"),
          color: saved ? "rgba(100,190,150,0.9)" : "rgba(201,185,154,0.6)",
          fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.2s",
        }}>
          {saved ? "✓ Saved to My Grimoire" : "Save to My Grimoire"}
        </button>
        <button onClick={onCopy} style={{
          flex: 1, padding: "8px", borderRadius: 6,
          background: copied ? "rgba(100,180,100,0.15)" : "rgba(201,185,154,0.08)",
          border: "0.5px solid " + (copied ? "rgba(100,180,100,0.4)" : "rgba(201,185,154,0.2)"),
          color: copied ? "rgba(100,200,100,0.9)" : "rgba(201,185,154,0.6)",
          fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.2s",
        }}>
          {copied ? "✓ Copied" : "Copy list"}
        </button>
      </div>
    </div>
  );
}
