"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGrimoire } from "../../contexts/GrimoireContext";
import DeckListPanel from "./DeckListPanel";
import CardSearchPanel from "./CardSearchPanel";
import styles from "./DeckEditor.module.css";

function guessCategory(card) {
  const t = card.type_line ?? "";
  if (t.includes("Creature")) return "Creatures";
  if (t.includes("Land")) return "Lands";
  if (t.includes("Artifact")) return "Artifacts";
  if (t.includes("Enchantment")) return "Enchantments";
  if (t.includes("Planeswalker")) return "Planeswalkers";
  return "Spells";
}

export default function DeckEditorPage({ deckId }) {
  const { decks, saveDeck } = useGrimoire();
  const router = useRouter();

  const existing = deckId !== "new" ? decks.find(d => d.id === deckId) : null;

  const [name, setName] = useState(existing?.name ?? "New Deck");
  const [editingName, setEditingName] = useState(false);
  const [format, setFormat] = useState(existing?.format ?? "");
  const [cards, setCards] = useState(existing?.cards ?? []);
  const [isDirty, setIsDirty] = useState(false);
  const [mobileTab, setMobileTab] = useState("list");
  const [savedFlash, setSavedFlash] = useState(false);

  const addCard = (card) => {
    setCards(prev => {
      const existing = prev.find(c => c.cardId === card.id);
      if (existing) {
        return prev.map(c => c.cardId === card.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, {
        cardId: card.id,
        cardName: card.name,
        quantity: 1,
        category: card.category ?? guessCategory(card),
        manaCost: card.mana_cost ?? "",
        colors: card.colors ?? [],
      }];
    });
    setIsDirty(true);
  };

  const removeCard = (cardId) => {
    setCards(prev => prev.filter(c => c.cardId !== cardId));
    setIsDirty(true);
  };

  const updateQuantity = (cardId, quantity) => {
    if (quantity <= 0) { removeCard(cardId); return; }
    setCards(prev => prev.map(c => c.cardId === cardId ? { ...c, quantity } : c));
    setIsDirty(true);
  };

  const handleSave = () => {
    const id = existing?.id ?? crypto.randomUUID();
    saveDeck({
      id,
      name,
      format,
      cards,
      description: existing?.description,
      sourceCard: existing?.sourceCard,
    });
    setIsDirty(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    if (deckId === "new") router.replace(`/deck/${id}`);
  };

  const MOBILE_TAB_BTN = (active) => ({
    flex: 1, background: "transparent", border: "none",
    borderBottom: active ? "2px solid #c9b99a" : "2px solid transparent",
    padding: "12px", color: active ? "#c9b99a" : "rgba(201,185,154,0.4)",
    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
    letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.15s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0e0c09", color: "#e8dcc8", fontFamily: "Georgia, 'Times New Roman', serif", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ borderBottom: "0.5px solid rgba(201,185,154,0.15)", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, height: 64, gap: 16 }}>
        <Link href="/my-grimoire?tab=decks" style={{ textDecoration: "none", color: "rgba(201,185,154,0.5)", fontSize: 12, flexShrink: 0, transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#c9b99a"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.5)"}
        >← My Grimoire</Link>

        {/* Editable deck name */}
        {editingName ? (
          <input
            autoFocus
            value={name}
            onChange={e => { setName(e.target.value); setIsDirty(true); }}
            onBlur={() => setEditingName(false)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditingName(false); }}
            style={{
              flex: 1, background: "transparent", border: "none",
              borderBottom: "1px solid rgba(201,185,154,0.4)",
              color: "#e8dcc8", fontSize: 18, fontWeight: 700,
              fontFamily: "Georgia, serif", outline: "none",
              letterSpacing: "0.04em", textAlign: "center",
            }}
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            title="Click to rename"
            style={{ flex: 1, background: "transparent", border: "none", cursor: "text", fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "#e8dcc8", letterSpacing: "0.04em", textAlign: "center", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#c9b99a"}
            onMouseLeave={e => e.currentTarget.style.color = "#e8dcc8"}
          >{name} ✎</button>
        )}

        <button
          onClick={handleSave}
          disabled={!isDirty}
          style={{
            background: savedFlash ? "rgba(80,160,120,0.15)" : isDirty ? "rgba(201,185,154,0.1)" : "transparent",
            border: `0.5px solid ${savedFlash ? "rgba(80,160,120,0.4)" : isDirty ? "rgba(201,185,154,0.35)" : "rgba(201,185,154,0.15)"}`,
            borderRadius: 6, padding: "7px 18px",
            color: savedFlash ? "rgba(100,190,150,0.9)" : isDirty ? "#c9b99a" : "rgba(201,185,154,0.3)",
            fontSize: 12, cursor: isDirty ? "pointer" : "default",
            fontFamily: "inherit", flexShrink: 0, transition: "all 0.2s",
          }}
        >{savedFlash ? "✓ Saved" : "Save"}</button>
      </header>

      {/* Mobile tab switcher */}
      <div className={styles.mobileTabs}>
        <button style={MOBILE_TAB_BTN(mobileTab === "list")} onClick={() => setMobileTab("list")}>Deck List</button>
        <button style={MOBILE_TAB_BTN(mobileTab === "search")} onClick={() => setMobileTab("search")}>Add Cards</button>
      </div>

      {/* Body */}
      <div className={styles.layout}>
        <div className={`${styles.listPanel} ${mobileTab === "list" ? styles.mobileActive : ""}`}>
          <DeckListPanel cards={cards} onUpdateQuantity={updateQuantity} onRemoveCard={removeCard} />
        </div>
        <div className={`${styles.searchPanel} ${mobileTab === "search" ? styles.mobileActive : ""}`}>
          <CardSearchPanel onAddCard={addCard} existingCards={cards} format={format} onFormatChange={setFormat} />
        </div>
      </div>
    </div>
  );
}
