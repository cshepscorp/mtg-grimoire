"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { VIEW_ARTIST } from "../../utils/constants";
import styles from "./SavedSidebar.module.css";

const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 220;
const MAX_WIDTH = 400;
const COLLAPSE_THRESHOLD = 5;
const WIDTH_KEY = "grimoire_sidebar_width";
const SECTIONS_KEY = "grimoire_sidebar_sections";

const COLOR_MAP = { W: "#e0d8be", U: "#4a7fb5", B: "#8a8a9a", R: "#c94040", G: "#3d8a4a" };

function cardColorDot(card) {
  const c = card?.colors ?? card?.color_identity ?? [];
  if (!c.length) return "#777";
  if (c.length > 1) return "#c9a227";
  return COLOR_MAP[c[0]] ?? "#777";
}

export default function SavedSidebar({
  favoriteArtists = [],
  onSelectArtist,
  onRemoveArtist,
  selectedArtist,
  currentView,
  favorites = [],
  onSelectFavorite,
  onRemoveFavorite,
  collection = [],
  onSelectCollectionCard,
  onRemoveFromCollection,
  decks = [],
  onSelectDeck,
  onRemoveDeck,
  mobileOpen = false,
  onClose,
  onWidthChange,
}) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [sections, setSections] = useState({ artists: null, cards: null, collection: null, decks: null });
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    try {
      const w = localStorage.getItem(WIDTH_KEY);
      if (w) {
        const parsed = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parseInt(w)));
        setWidth(parsed);
        onWidthChange?.(parsed);
      }
      const s = localStorage.getItem(SECTIONS_KEY);
      if (s) setSections(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  useEffect(() => {
    const onMove = (e) => {
      if (!isResizing.current) return;
      const next = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current + e.clientX - startX.current));
      setWidth(next);
      onWidthChange?.(next);
    };
    const onUp = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      setWidth(w => {
        try { localStorage.setItem(WIDTH_KEY, String(w)); } catch {}
        onWidthChange?.(w);
        return w;
      });
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onDragStart = (e) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    e.preventDefault();
  };

  const isOpen = (key, count) => sections[key] !== null ? sections[key] : count <= COLLAPSE_THRESHOLD;

  const toggleSection = (key, count) => {
    setSections(prev => {
      const wasOpen = prev[key] !== null ? prev[key] : count <= COLLAPSE_THRESHOLD;
      const next = { ...prev, [key]: !wasOpen };
      try { localStorage.setItem(SECTIONS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const act = (fn) => (...args) => {
    fn?.(...args);
    if (mobileOpen) onClose?.();
  };

  const btnBase = {
    background: "transparent", border: "none", cursor: "pointer",
    fontFamily: "inherit", padding: 0, outline: "none",
  };

  const renderSection = ({ key, label, count, items, renderItem, emptyText, tabLink }) => {
    const open = isOpen(key, count);
    return (
      <div key={key}>
        <div style={{ borderTop: "0.5px solid rgba(201,185,154,0.08)", margin: "8px 0 0" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              onClick={() => toggleSection(key, count)}
              style={{ ...btnBase, color: "rgba(201,185,154,0.5)", fontSize: 10, transition: "color 0.15s", padding: "0 2px" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.8)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.5)"}
            >{open ? "▾" : "▸"}</button>
            <Link
              href={tabLink}
              style={{ color: "rgba(201,185,154,0.5)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.8)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.5)"}
            >{label}</Link>
          </div>
          <Link
            href={tabLink}
            style={{ color: "rgba(201,185,154,0.3)", fontSize: 10, textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.6)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.3)"}
          >({count})</Link>
        </div>

        {open && (
          <div style={{ marginBottom: 4 }}>
            {count === 0
              ? (
                <p style={{
                  fontSize: 11, color: "rgba(201,185,154,0.3)", fontStyle: "italic",
                  lineHeight: 1.6, margin: "2px 0 8px", padding: 0,
                }}>{emptyText}</p>
              )
              : items.map(renderItem)
            }
          </div>
        )}
      </div>
    );
  };

  const renderArtistItem = (a) => (
    <div key={a} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
      <button
        onClick={act(() => onSelectArtist?.(a))}
        title={a}
        style={{
          ...btnBase,
          flex: 1, minWidth: 0,
          background: currentView === VIEW_ARTIST && selectedArtist === a
            ? "rgba(201,185,154,0.12)" : "transparent",
          border: "0.5px solid " + (currentView === VIEW_ARTIST && selectedArtist === a
            ? "rgba(201,185,154,0.35)" : "rgba(201,185,154,0.12)"),
          borderRadius: 5, padding: "6px 8px",
          color: currentView === VIEW_ARTIST && selectedArtist === a
            ? "#c9b99a" : "rgba(201,185,154,0.7)",
          fontSize: 11, textAlign: "left",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          transition: "background 0.15s, color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={e => {
          if (!(currentView === VIEW_ARTIST && selectedArtist === a)) {
            e.currentTarget.style.background = "rgba(201,185,154,0.08)";
            e.currentTarget.style.color = "#c9b99a";
          }
        }}
        onMouseLeave={e => {
          if (!(currentView === VIEW_ARTIST && selectedArtist === a)) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(201,185,154,0.7)";
          }
        }}
      >{a}</button>
      <RemoveBtn onClick={() => onRemoveArtist?.(a)} />
    </div>
  );

  const renderCardItem = (card) => (
    <div key={card.id} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
      <ItemBtn onClick={act(() => onSelectFavorite?.(card))} title={`${card.name} (${card.set?.toUpperCase() ?? "?"})`}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: cardColorDot(card), flexShrink: 0, display: "inline-block" }} />
        <span style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</span>
          {card.set && (
            <span style={{ fontSize: 9, color: "rgba(201,185,154,0.35)", letterSpacing: "0.06em" }}>{card.set.toUpperCase()}</span>
          )}
        </span>
      </ItemBtn>
      <RemoveBtn onClick={() => onRemoveFavorite?.(card.id)} />
    </div>
  );

  const renderCollectionItem = (item) => (
    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
      <ItemBtn onClick={act(() => onSelectCollectionCard?.(item))} title={`${item.cardName} (${item.setCode ?? "?"})`}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: cardColorDot({ colors: item.colors, color_identity: item.colorIdentity }), flexShrink: 0, display: "inline-block" }} />
        <span style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.cardName}</span>
          {item.setCode && (
            <span style={{ fontSize: 9, color: "rgba(201,185,154,0.35)", letterSpacing: "0.06em" }}>{item.setCode}</span>
          )}
        </span>
        <span style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", flexShrink: 0 }}>×{item.quantityOwned}</span>
      </ItemBtn>
      <RemoveBtn onClick={() => onRemoveFromCollection?.(item.cardId)} />
    </div>
  );

  const renderDeckItem = (deck) => (
    <div key={deck.id} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
      <ItemBtn onClick={act(() => onSelectDeck?.(deck))} title={deck.name}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deck.name}</span>
      </ItemBtn>
      <RemoveBtn onClick={() => onRemoveDeck?.(deck.id)} />
    </div>
  );

  const sectionDefs = [
    { key: "artists",    label: "Artists",    count: favoriteArtists.length, items: favoriteArtists, renderItem: renderArtistItem,     emptyText: "Favorite an artist to save them here.",            tabLink: "/my-grimoire?tab=artists" },
    { key: "cards",      label: "Cards",      count: favorites.length,       items: favorites,       renderItem: renderCardItem,       emptyText: "Heart a card to save it here.",                    tabLink: "/my-grimoire?tab=favorites" },
    { key: "collection", label: "Collection", count: collection.length,      items: collection,      renderItem: renderCollectionItem, emptyText: "Add cards you own to track your collection.",       tabLink: "/my-grimoire?tab=collection" },
    { key: "decks",      label: "Decks",      count: decks.length,           items: decks,           renderItem: renderDeckItem,       emptyText: "Save a generated deck or build one from scratch.",  tabLink: "/my-grimoire?tab=decks" },
  ];

  return (
    <aside
      className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}
      style={mobileOpen ? undefined : { width }}
    >
      <div style={{ padding: "1.25rem 1rem 2rem", display: "flex", flexDirection: "column", flex: 1 }}>

        {mobileOpen ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Saved</span>
            <button
              onClick={onClose}
              style={{ ...btnBase, color: "rgba(201,185,154,0.5)", fontSize: 13, transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.85)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.5)"}
            >✕ Close</button>
          </div>
        ) : (
          <div style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Saved
          </div>
        )}

        {sectionDefs.map(renderSection)}
      </div>

      {!mobileOpen && <div className={styles.dragHandle} onMouseDown={onDragStart} />}
    </aside>
  );
}

function ItemBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        flex: 1, minWidth: 0,
        background: "transparent",
        border: "0.5px solid rgba(201,185,154,0.12)",
        borderRadius: 5, padding: "6px 8px",
        color: "rgba(201,185,154,0.7)",
        fontSize: 11, cursor: "pointer", fontFamily: "inherit",
        textAlign: "left", display: "flex", alignItems: "center", gap: 6,
        overflow: "hidden",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        outline: "none",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(201,185,154,0.08)";
        e.currentTarget.style.color = "#c9b99a";
        e.currentTarget.style.borderColor = "rgba(201,185,154,0.25)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "rgba(201,185,154,0.7)";
        e.currentTarget.style.borderColor = "rgba(201,185,154,0.12)";
      }}
    >{children}</button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Remove"
      style={{
        background: "transparent", border: "none", outline: "none",
        color: "rgba(201,185,154,0.3)", fontSize: 14,
        cursor: "pointer", padding: "0 2px", lineHeight: 1,
        flexShrink: 0, fontFamily: "inherit",
        transition: "color 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.7)"}
      onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.3)"}
    >×</button>
  );
}
