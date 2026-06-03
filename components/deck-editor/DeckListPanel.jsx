"use client";

import { useState, useCallback, useEffect } from "react";
import { colorDotColor, scryfallImageUrl, isScryfallId } from "../../utils/cardHelpers";

const CATEGORY_ORDER = ["Creatures", "Spells", "Artifacts", "Enchantments", "Planeswalkers", "Lands"];

const QTY_BTN = {
  background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.18)",
  borderRadius: 3, width: 22, height: 22, color: "#c9b99a", fontSize: 13,
  cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
};

function DeckCardImage({ cardId, cardName, style }) {
  const [src, setSrc] = useState(isScryfallId(cardId) ? scryfallImageUrl(cardId) : null);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  const fetchByName = useCallback(() => {
    if (fetchedOnce) return;
    setFetchedOnce(true);
    fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const url = data?.image_uris?.normal ?? data?.card_faces?.[0]?.image_uris?.normal;
        if (url) setSrc(url);
      })
      .catch(() => {});
  }, [cardName, fetchedOnce]);

  useEffect(() => {
    if (!src) fetchByName();
  }, []);

  if (!src) return <div style={{ ...style, background: "rgba(201,185,154,0.05)" }} />;
  return <img src={src} alt={cardName} style={style} onError={fetchByName} />;
}

export default function DeckListPanel({ cards, onUpdateQuantity, onRemoveCard, onCardHover }) {
  const [viewMode, setViewMode] = useState("list"); // "list" | "visual"
  const [hoveredTile, setHoveredTile] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null); // mobile tap-to-expand

  const total = cards.reduce((s, c) => s + c.quantity, 0);

  const byCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    const catCards = cards.filter(c => c.category === cat);
    if (catCards.length) acc[cat] = catCards;
    return acc;
  }, {});
  const uncategorized = cards.filter(c => !CATEGORY_ORDER.includes(c.category));
  if (uncategorized.length) byCategory["Other"] = uncategorized;

  const showTooltip = useCallback((card) => {
    if (window.innerWidth <= 768) return;
    onCardHover?.({ cardId: card.cardId, cardName: card.cardName, colors: card.colors ?? [] });
  }, [onCardHover]);

  const hideTooltip = useCallback(() => onCardHover?.(null), [onCardHover]);

  const toggleExpanded = useCallback((cardId) => {
    if (window.innerWidth > 768) return;
    setExpandedCardId(prev => prev === cardId ? null : cardId);
  }, []);

  const TOGGLE_BTN = (active) => ({
    background: active ? "rgba(201,185,154,0.12)" : "transparent",
    border: `0.5px solid ${active ? "rgba(201,185,154,0.3)" : "rgba(201,185,154,0.15)"}`,
    borderRadius: 4, padding: "3px 7px",
    color: active ? "#c9b99a" : "rgba(201,185,154,0.35)",
    fontSize: 13, cursor: "pointer", fontFamily: "inherit",
    lineHeight: 1, transition: "all 0.15s",
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Panel header */}
        <div style={{ padding: "1rem 1.25rem", borderBottom: "0.5px solid rgba(201,185,154,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Deck</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <button style={TOGGLE_BTN(viewMode === "list")} onClick={() => setViewMode("list")} title="List view">≡</button>
            <button style={TOGGLE_BTN(viewMode === "visual")} onClick={() => setViewMode("visual")} title="Visual view">⊞</button>
          </div>
          <span style={{ fontSize: 12, color: "rgba(201,185,154,0.4)", fontVariantNumeric: "tabular-nums" }}>{total} cards</span>
        </div>

        {/* Card list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1.25rem" }}>
          {cards.length === 0 ? (
            <p style={{ color: "rgba(201,185,154,0.3)", fontStyle: "italic", fontSize: 12, textAlign: "center", marginTop: "3rem" }}>
              Search for cards on the right to start building.
            </p>
          ) : viewMode === "list" ? (
            // ── List view ──
            Object.entries(byCategory).map(([cat, catCards]) => {
              const catTotal = catCards.reduce((s, c) => s + c.quantity, 0);
              return (
                <div key={cat} style={{ marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                    {cat} ({catTotal})
                  </div>
                  {catCards.map(card => {
                    const isExpanded = expandedCardId === card.cardId;
                    return (
                      <div key={card.cardId} style={{ borderBottom: "0.5px solid rgba(201,185,154,0.05)" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", cursor: "default" }}
                          onMouseEnter={() => showTooltip(card)}
                          onMouseLeave={hideTooltip}
                          onClick={() => toggleExpanded(card.cardId)}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: colorDotColor(card.colors ?? [], []), flexShrink: 0, display: "inline-block" }} />
                          <span style={{ flex: 1, fontSize: 12, color: "#c9b99a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.cardName}</span>
                          {card.manaCost && (
                            <span style={{ fontSize: 10, color: "rgba(201,185,154,0.35)", flexShrink: 0 }}>{card.manaCost}</span>
                          )}
                          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                            <button style={QTY_BTN} onClick={() => onUpdateQuantity(card.cardId, card.quantity - 1)}>−</button>
                            <span style={{ fontSize: 12, color: "#e8dcc8", minWidth: 16, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{card.quantity}</span>
                            <button style={QTY_BTN} onClick={() => onUpdateQuantity(card.cardId, card.quantity + 1)}>+</button>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); onRemoveCard(card.cardId); }}
                            style={{ background: "transparent", border: "none", color: "rgba(201,185,154,0.2)", fontSize: 14, cursor: "pointer", padding: "0 2px", fontFamily: "inherit", flexShrink: 0, transition: "color 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.6)"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.2)"}
                          >✕</button>
                        </div>
                        {/* Mobile inline image expansion */}
                        {isExpanded && (
                          <div style={{ padding: "8px 0 10px", display: "flex", justifyContent: "center" }}>
                            <DeckCardImage
                              cardId={card.cardId}
                              cardName={card.cardName}
                              style={{ width: "55%", borderRadius: 8, display: "block" }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            // ── Visual view ──
            Object.entries(byCategory).map(([cat, catCards]) => {
              const catTotal = catCards.reduce((s, c) => s + c.quantity, 0);
              return (
                <div key={cat} style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                    {cat} ({catTotal})
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {catCards.map(card => {
                      const isHovered = hoveredTile === card.cardId;
                      return (
                        <div
                          key={card.cardId}
                          style={{ position: "relative", borderRadius: 6, overflow: "hidden", aspectRatio: "5/7", background: "rgba(201,185,154,0.05)", cursor: "default" }}
                          onMouseEnter={() => setHoveredTile(card.cardId)}
                          onMouseLeave={() => setHoveredTile(null)}
                        >
                          <DeckCardImage
                            cardId={card.cardId}
                            cardName={card.cardName}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                          {/* Hover overlay */}
                          {isHovered && (
                            <div style={{
                              position: "absolute", inset: 0,
                              background: "rgba(0,0,0,0.72)",
                              display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "center", gap: 6,
                              padding: "6px",
                            }}>
                              <span style={{ fontSize: 10, color: "#e8dcc8", textAlign: "center", lineHeight: 1.3, fontWeight: 600 }}>{card.cardName}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <button style={{ ...QTY_BTN, width: 20, height: 20, fontSize: 12 }} onClick={() => onUpdateQuantity(card.cardId, card.quantity - 1)}>−</button>
                                <span style={{ fontSize: 12, color: "#e8dcc8", minWidth: 14, textAlign: "center" }}>{card.quantity}</span>
                                <button style={{ ...QTY_BTN, width: 20, height: 20, fontSize: 12 }} onClick={() => onUpdateQuantity(card.cardId, card.quantity + 1)}>+</button>
                              </div>
                              <button
                                onClick={() => onRemoveCard(card.cardId)}
                                style={{ background: "transparent", border: "0.5px solid rgba(201,185,154,0.2)", borderRadius: 3, color: "rgba(201,185,154,0.5)", fontSize: 9, cursor: "pointer", padding: "2px 6px", fontFamily: "inherit", letterSpacing: "0.06em" }}
                              >remove</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </>
  );
}
