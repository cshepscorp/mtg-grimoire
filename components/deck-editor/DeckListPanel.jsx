"use client";

import { colorDotColor } from "../../utils/cardHelpers";

const CATEGORY_ORDER = ["Creatures", "Spells", "Artifacts", "Enchantments", "Planeswalkers", "Lands"];

const QTY_BTN = {
  background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.18)",
  borderRadius: 3, width: 22, height: 22, color: "#c9b99a", fontSize: 13,
  cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
};

export default function DeckListPanel({ cards, onUpdateQuantity, onRemoveCard }) {
  const total = cards.reduce((s, c) => s + c.quantity, 0);

  const byCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    const catCards = cards.filter(c => c.category === cat);
    if (catCards.length) acc[cat] = catCards;
    return acc;
  }, {});

  const uncategorized = cards.filter(c => !CATEGORY_ORDER.includes(c.category));
  if (uncategorized.length) byCategory["Other"] = uncategorized;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Panel header */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "0.5px solid rgba(201,185,154,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Deck</span>
        <span style={{ fontSize: 12, color: "rgba(201,185,154,0.4)", fontVariantNumeric: "tabular-nums" }}>{total} cards</span>
      </div>

      {/* Card list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1.25rem" }}>
        {cards.length === 0 ? (
          <p style={{ color: "rgba(201,185,154,0.3)", fontStyle: "italic", fontSize: 12, textAlign: "center", marginTop: "3rem" }}>
            Search for cards on the right to start building.
          </p>
        ) : (
          Object.entries(byCategory).map(([cat, catCards]) => {
            const catTotal = catCards.reduce((s, c) => s + c.quantity, 0);
            return (
              <div key={cat} style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                  {cat} ({catTotal})
                </div>
                {catCards.map(card => (
                  <div key={card.cardId} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: "0.5px solid rgba(201,185,154,0.05)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: colorDotColor(card.colors ?? [], []), flexShrink: 0, display: "inline-block" }} />
                    <span style={{ flex: 1, fontSize: 12, color: "#c9b99a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.cardName}</span>
                    {card.manaCost && (
                      <span style={{ fontSize: 10, color: "rgba(201,185,154,0.35)", flexShrink: 0 }}>{card.manaCost}</span>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <button style={QTY_BTN} onClick={() => onUpdateQuantity(card.cardId, card.quantity - 1)}>−</button>
                      <span style={{ fontSize: 12, color: "#e8dcc8", minWidth: 16, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{card.quantity}</span>
                      <button style={QTY_BTN} onClick={() => onUpdateQuantity(card.cardId, card.quantity + 1)}>+</button>
                    </div>
                    <button
                      onClick={() => onRemoveCard(card.cardId)}
                      style={{ background: "transparent", border: "none", color: "rgba(201,185,154,0.2)", fontSize: 14, cursor: "pointer", padding: "0 2px", fontFamily: "inherit", flexShrink: 0, transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.6)"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.2)"}
                    >✕</button>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
