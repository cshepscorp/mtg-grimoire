"use client";

import { useState, useEffect, useRef } from "react";
import { useGrimoire } from "../../contexts/GrimoireContext";
import { colorDotColor } from "../../utils/cardHelpers";
import styles from "./DeckEditor.module.css";

const FORMATS = ["Standard", "Modern", "Legacy", "Vintage", "Commander", "Pioneer", "Pauper"];

function guessCategory(card) {
  const t = card.type_line ?? "";
  if (t.includes("Creature")) return "Creatures";
  if (t.includes("Land")) return "Lands";
  if (t.includes("Artifact")) return "Artifacts";
  if (t.includes("Enchantment")) return "Enchantments";
  if (t.includes("Planeswalker")) return "Planeswalkers";
  return "Spells";
}

function LegalityBadge({ card, format }) {
  if (!format || !card.legalities) return null;
  const status = card.legalities[format.toLowerCase()];
  if (status === "legal") return null;
  const label = status === "not_legal" ? "Not Legal" : status === "banned" ? "Banned" : status === "restricted" ? "Restricted" : null;
  if (!label) return null;
  return (
    <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "rgba(220,80,80,0.15)", border: "0.5px solid rgba(220,80,80,0.3)", color: "rgba(220,120,100,0.9)", flexShrink: 0 }}>
      {label}
    </span>
  );
}

function CardPreviewPanel({ card, deckCount, onAddToDeck, onClose }) {
  const { addToCollection } = useGrimoire();
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [printings, setPrintings] = useState([]);
  const [printingsLoading, setPrintingsLoading] = useState(false);
  const [printingIdx, setPrintingIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [collectionSaved, setCollectionSaved] = useState(false);

  useEffect(() => {
    setCollectionOpen(false);
    setCollectionSaved(false);
    setPrintings([]);
    setPrintingIdx(0);
    setQty(1);
  }, [card?.id]);

  const openCollection = async () => {
    setCollectionOpen(true);
    if (printings.length > 0) return;
    setPrintingsLoading(true);
    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?order=released&q=!"${encodeURIComponent(card.name)}"&unique=prints`
      );
      if (res.ok) {
        const data = await res.json();
        setPrintings(data.data?.filter(p => p.image_uris || p.card_faces?.some(f => f.image_uris)) ?? []);
      }
    } catch {}
    setPrintingsLoading(false);
  };

  const handleAddToCollection = () => {
    const p = printings[printingIdx] ?? card;
    addToCollection(p, qty);
    setCollectionSaved(true);
    setTimeout(() => setCollectionSaved(false), 2500);
  };

  const imageUrl = card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "1rem" }}>
      {onClose && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(201,185,154,0.5)", fontSize: 18, cursor: "pointer", padding: 0, lineHeight: 1 }}>✕</button>
        </div>
      )}

      {imageUrl && (
        <img src={imageUrl} alt={card.name} style={{ width: "100%", borderRadius: 8, display: "block" }} />
      )}

      <div>
        <div style={{ fontSize: 13, color: "#c9b99a", fontWeight: 600 }}>{card.name}</div>
        {card.mana_cost && <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", marginTop: 2 }}>{card.mana_cost}</div>}
        {card.type_line && <div style={{ fontSize: 11, color: "rgba(201,185,154,0.45)", marginTop: 2 }}>{card.type_line}</div>}
        {card.oracle_text && (
          <div style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", marginTop: 6, lineHeight: 1.6, fontStyle: "italic" }}>
            {card.oracle_text.slice(0, 150)}{card.oracle_text.length > 150 ? "…" : ""}
          </div>
        )}
      </div>

      {/* Add to Deck */}
      <button
        onClick={() => onAddToDeck(card)}
        style={{
          width: "100%", background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.3)",
          borderRadius: 6, padding: "8px", color: "#c9b99a", fontSize: 12,
          cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(201,185,154,0.15)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(201,185,154,0.08)"}
      >
        {deckCount > 0 ? `+ Add to Deck (${deckCount} already)` : "+ Add to Deck"}
      </button>

      {/* Add to Collection */}
      {!collectionOpen ? (
        <button
          onClick={openCollection}
          style={{
            width: "100%", background: "transparent", border: "0.5px solid rgba(80,160,120,0.3)",
            borderRadius: 6, padding: "8px", color: "rgba(100,190,150,0.7)", fontSize: 12,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(80,160,120,0.08)"; e.currentTarget.style.color = "rgba(100,190,150,0.95)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(100,190,150,0.7)"; }}
        >+ Add to Collection</button>
      ) : (
        <div style={{ background: "rgba(80,160,120,0.06)", border: "0.5px solid rgba(80,160,120,0.2)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 10, color: "rgba(100,190,150,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Add to Collection</div>

          {/* Printing selector */}
          {printingsLoading ? (
            <div style={{ fontSize: 11, color: "rgba(201,185,154,0.35)", fontStyle: "italic" }}>Loading printings…</div>
          ) : printings.length > 0 ? (
            <select
              value={printingIdx}
              onChange={e => setPrintingIdx(Number(e.target.value))}
              style={{ background: "#0e0c09", border: "0.5px solid rgba(201,185,154,0.25)", borderRadius: 5, padding: "6px 8px", color: "#c9b99a", fontSize: 11, fontFamily: "Georgia, serif", cursor: "pointer", outline: "none", width: "100%" }}
            >
              {printings.map((p, i) => (
                <option key={p.id} value={i}>
                  {p.set_name} ({p.set?.toUpperCase()}) #{p.collector_number}
                </option>
              ))}
            </select>
          ) : null}

          {/* Quantity */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", flex: 1 }}>Quantity</span>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.2)", borderRadius: 3, width: 24, height: 24, color: "#c9b99a", fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ fontSize: 13, color: "#e8dcc8", minWidth: 16, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{ background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.2)", borderRadius: 3, width: 24, height: 24, color: "#c9b99a", fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setCollectionOpen(false)} style={{ flex: 1, background: "transparent", border: "0.5px solid rgba(201,185,154,0.15)", borderRadius: 5, padding: "6px", color: "rgba(201,185,154,0.4)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button
              onClick={handleAddToCollection}
              style={{ flex: 2, background: collectionSaved ? "rgba(80,160,120,0.2)" : "rgba(80,160,120,0.12)", border: `0.5px solid ${collectionSaved ? "rgba(80,160,120,0.5)" : "rgba(80,160,120,0.3)"}`, borderRadius: 5, padding: "6px", color: collectionSaved ? "rgba(100,190,150,0.95)" : "rgba(100,190,150,0.8)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
            >{collectionSaved ? "✓ Added" : "Add to Collection"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CardSearchPanel({ onAddCard, existingCards, format, onFormatChange }) {
  const { collection } = useGrimoire();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const abortRef = useRef(null);
  const inputRef = useRef(null);


  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.scryfall.com/cards/search?q=name:"${encodeURIComponent(query.trim())}"&unique=cards&order=name`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.data?.slice(0, 20) ?? []);
        }
      } catch (e) {
        if (e.name !== "AbortError") setResults([]);
      }
      setLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [query]);

  const deckCountMap = existingCards.reduce((acc, c) => { acc[c.cardId] = c.quantity; return acc; }, {});
  const defaultPreviewItem = collection.find(item => item.imageUri);

  const collectionMatches = collection.filter(item =>
    query.trim().length >= 2
      ? item.cardName.toLowerCase().includes(query.toLowerCase())
      : true
  );

  const handleAddToDeck = (card) => {
    onAddCard({ ...card, category: guessCategory(card) });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Search header */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "0.5px solid rgba(201,185,154,0.1)", flexShrink: 0, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for a card to add..."
            style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(201,185,154,0.25)", borderRadius: 6, padding: "8px 12px", color: "#e8dcc8", fontSize: 13, fontFamily: "Georgia, serif", outline: "none" }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "rgba(201,185,154,0.4)", fontSize: 14, cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
          )}
        </div>
        <select
          value={format}
          onChange={e => onFormatChange(e.target.value)}
          style={{ background: "#0e0c09", border: "0.5px solid rgba(201,185,154,0.25)", borderRadius: 6, padding: "8px 10px", color: format ? "#c9b99a" : "rgba(201,185,154,0.4)", fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer", outline: "none", flexShrink: 0 }}
        >
          <option value="">Any format</option>
          {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Results + preview */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }} onMouseLeave={() => setHoveredCard(null)}>
        {/* Results list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && <div style={{ padding: "1.5rem", fontSize: 12, color: "rgba(201,185,154,0.3)", fontStyle: "italic" }}>Searching…</div>}

          {!loading && results.length > 0 && (
            <div>
              <div style={{ padding: "0.75rem 1.25rem 0.25rem", fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Results</div>
              {results.map(card => (
                <ResultRow
                  key={card.id}
                  card={card}
                  deckCount={deckCountMap[card.id] ?? 0}
                  format={format}
                  onAdd={() => handleAddToDeck(card)}
                  onHover={() => setHoveredCard(card)}
                  onSelect={() => setSelectedCard(c => c?.id === card.id ? null : card)}
                  selected={selectedCard?.id === card.id}
                />
              ))}
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div style={{ padding: "1.5rem 1.25rem", fontSize: 12, color: "rgba(201,185,154,0.3)", fontStyle: "italic" }}>No cards found.</div>
          )}

          {collectionMatches.length > 0 && (
            <div>
              <div style={{ padding: "0.75rem 1.25rem 0.25rem", fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                From your collection <span style={{ color: "rgba(201,185,154,0.25)" }}>({collectionMatches.length})</span>
              </div>
              {collectionMatches.map(item => (
                <CollectionRow
                  key={item.id}
                  item={item}
                  deckCount={deckCountMap[item.cardId] ?? 0}
                  onAdd={() => handleAddToDeck({ id: item.cardId, name: item.cardName, colors: item.colors ?? [], color_identity: item.colorIdentity ?? [], mana_cost: "", type_line: "" })}
                  onHover={() => setHoveredCard(item.imageUri ? { name: item.cardName, image_uris: { normal: item.imageUri }, colors: item.colors } : null)}
                  onSelect={() => setSelectedCard(item.imageUri ? { id: item.cardId, name: item.cardName, image_uris: { normal: item.imageUri }, colors: item.colors } : null)}
                />
              ))}
            </div>
          )}

          {query.trim().length < 2 && collectionMatches.length === 0 && (
            <div style={{ padding: "1.5rem 1.25rem", fontSize: 12, color: "rgba(201,185,154,0.3)", fontStyle: "italic" }}>
              Start typing to search for cards.
            </div>
          )}
        </div>

        {/* Desktop preview panel */}
        <div style={{ width: 220, flexShrink: 0, borderLeft: "0.5px solid rgba(201,185,154,0.1)", overflowY: "auto" }}>
          {selectedCard ? (
            <CardPreviewPanel
              card={selectedCard}
              deckCount={deckCountMap[selectedCard.id] ?? 0}
              onAddToDeck={handleAddToDeck}
              onClose={() => setSelectedCard(null)}
            />
          ) : (hoveredCard?.image_uris?.normal ?? hoveredCard?.card_faces?.[0]?.image_uris?.normal) ? (
            <div style={{ padding: "1rem" }}>
              <img
                src={hoveredCard.image_uris?.normal ?? hoveredCard.card_faces?.[0]?.image_uris?.normal}
                alt={hoveredCard.name}
                style={{ width: "100%", borderRadius: 8, display: "block" }}
              />
            </div>
          ) : defaultPreviewItem ? (
            <div style={{ padding: "1rem" }}>
              <img
                src={defaultPreviewItem.imageUri}
                alt={defaultPreviewItem.cardName}
                style={{ width: "100%", borderRadius: 8, display: "block", opacity: 0.6 }}
              />
              <div style={{ fontSize: 10, color: "rgba(201,185,154,0.35)", textAlign: "center", marginTop: 10, fontStyle: "italic", lineHeight: 1.5 }}>
                Hover or click a card to preview it
              </div>
            </div>
          ) : (
            <div style={{ padding: "1.5rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{
                width: "100%", aspectRatio: "5/7", borderRadius: 10,
                background: "linear-gradient(145deg, #1a2a4a 0%, #0d1a30 50%, #1a2a4a 100%)",
                border: "0.5px solid rgba(100,140,200,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: "60%", aspectRatio: "1", borderRadius: "50%",
                  border: "1.5px solid rgba(100,140,200,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, color: "rgba(100,140,200,0.3)",
                }}>✦</div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(201,185,154,0.3)", textAlign: "center", lineHeight: 1.6, fontStyle: "italic" }}>
                Search for cards above to start building your deck
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {selectedCard && (
        <div className={styles.mobileSheet}>
          <div style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "#16140f", overflowY: "auto",
          }}>
            <CardPreviewPanel
              card={selectedCard}
              deckCount={deckCountMap[selectedCard.id] ?? 0}
              onAddToDeck={handleAddToDeck}
              onClose={() => setSelectedCard(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ResultRow({ card, deckCount, format, onAdd, onHover, onSelect, selected }) {
  const dot = colorDotColor(card.colors ?? [], card.color_identity ?? []);
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 1.25rem", borderBottom: "0.5px solid rgba(201,185,154,0.05)", cursor: "pointer", transition: "background 0.1s", background: selected ? "rgba(201,185,154,0.06)" : "transparent" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.04)"; onHover(); }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
      onClick={onSelect}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0, display: "inline-block" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#c9b99a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</div>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.35)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.type_line}</div>
      </div>
      {card.mana_cost && <span style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", flexShrink: 0 }}>{card.mana_cost}</span>}
      <LegalityBadge card={card} format={format} />
      <button
        onClick={e => { e.stopPropagation(); onAdd(); }}
        style={{ background: deckCount > 0 ? "rgba(201,185,154,0.12)" : "rgba(201,185,154,0.06)", border: `0.5px solid ${deckCount > 0 ? "rgba(201,185,154,0.35)" : "rgba(201,185,154,0.2)"}`, borderRadius: 4, padding: "3px 8px", color: deckCount > 0 ? "#c9b99a" : "rgba(201,185,154,0.5)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, transition: "all 0.15s" }}
      >{deckCount > 0 ? `+1 (${deckCount})` : "+ Add"}</button>
    </div>
  );
}

function CollectionRow({ item, deckCount, onAdd, onHover, onSelect }) {
  const dot = colorDotColor(item.colors ?? [], item.colorIdentity ?? []);
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 1.25rem", borderBottom: "0.5px solid rgba(201,185,154,0.05)", cursor: "pointer", transition: "background 0.1s" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.04)"; onHover(); }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      onClick={onSelect}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0, display: "inline-block" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#c9b99a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.cardName}</div>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.35)", marginTop: 1 }}>{item.setCode} · Owned ×{item.quantityOwned}</div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onAdd(); }}
        style={{ background: deckCount > 0 ? "rgba(201,185,154,0.12)" : "rgba(201,185,154,0.06)", border: `0.5px solid ${deckCount > 0 ? "rgba(201,185,154,0.35)" : "rgba(201,185,154,0.2)"}`, borderRadius: 4, padding: "3px 8px", color: deckCount > 0 ? "#c9b99a" : "rgba(201,185,154,0.5)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
      >{deckCount > 0 ? `+1 (${deckCount})` : "+ Add"}</button>
    </div>
  );
}
