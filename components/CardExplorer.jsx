"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import DeckChat from "./DeckChat";

const MANA_COLORS = {
  W: { bg: "#f9f6d2", color: "#7a6a00" },
  U: { bg: "#b3ceea", color: "#1a3e6e" },
  B: { bg: "#4a3f42", color: "#f0e8e8" },
  R: { bg: "#e8a27c", color: "#7a2200" },
  G: { bg: "#a9c9a7", color: "#1a4a1a" },
};

const SIDEBAR_WIDTH = 200;
const ARTISTS_KEY = "grimoire_artists";

const VIEW_CARD = "card";
const VIEW_SEARCH = "search";
const VIEW_ARTIST = "artist";
const VIEW_FILTER = "filter";

function ManaPip({ symbol }) {
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

function parseMana(cost) {
  if (!cost) return null;
  const pips = [...cost.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
      {pips.map((p, i) => <ManaPip key={i} symbol={p} />)}
    </div>
  );
}

function replaceSymbols(text) {
  if (!text) return null;
  return text.split(/(\{[^}]+\})/g).map((part, i) => {
    const m = part.match(/^\{([^}]+)\}$/);
    return m ? <ManaPip key={i} symbol={m[1]} /> : <span key={i}>{part}</span>;
  });
}

function ClickableBadge({ children, onClick }) {
  return (
    <span onClick={onClick} style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 99,
      background: "rgba(255,255,255,0.06)", color: "#c9b99a",
      border: "0.5px solid rgba(201,185,154,0.2)",
      textTransform: "capitalize", letterSpacing: "0.03em",
      cursor: "pointer", transition: "background 0.15s, border-color 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.15)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.2)"; }}
    >{children}</span>
  );
}

function PrintingThumb({ card, active, onClick }) {
  const thumb = card.image_uris?.small;
  if (!thumb) return null;
  return (
    <div onClick={onClick} style={{
      flexShrink: 0, width: 52, borderRadius: 4, overflow: "hidden",
      cursor: "pointer",
      border: active ? "2px solid #c9b99a" : "2px solid transparent",
      opacity: active ? 1 : 0.55,
      transition: "opacity 0.15s, border-color 0.15s",
    }}>
      <img src={thumb} alt={card.set_name} style={{ width: "100%", display: "block" }} />
    </div>
  );
}

function CardGrid({ cards, label, sublabel, loading, loadingText, onSelectCard, onBack }) {
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#e8dcc8" }}>{sublabel}</div>
        </div>
        <button onClick={onBack} style={{
          background: "transparent", border: "0.5px solid rgba(201,185,154,0.3)",
          borderRadius: 6, padding: "6px 14px", color: "rgba(201,185,154,0.7)",
          fontSize: 12, cursor: "pointer", fontFamily: "inherit",
        }}>← Back</button>
      </div>

      {loading && <div style={{ textAlign: "center", padding: "4rem", color: "rgba(201,185,154,0.3)", fontSize: 13 }}>{loadingText}</div>}
      {!loading && cards.length === 0 && <div style={{ textAlign: "center", padding: "4rem", color: "rgba(201,185,154,0.3)", fontSize: 13 }}>No results found.</div>}

      {!loading && cards.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {cards.map((c, i) => {
            const art = c.image_uris?.art_crop || c.image_uris?.normal;
            if (!art) return null;
            return (
              <div key={i} onClick={() => onSelectCard(c, i)} style={{
                cursor: "pointer", borderRadius: 8, overflow: "hidden",
                border: "0.5px solid rgba(201,185,154,0.1)", background: "#1a1610",
                transition: "border-color 0.15s, transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.4)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.1)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <img src={art} alt={c.name} style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: 12, color: "#c9b99a", fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", marginTop: 2 }}>{c.set_name}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Desktop nav arrow — fixed to viewport edges, hidden on mobile via media query
function NavArrow({ direction, onClick, visible, sidebarWidth }) {
  const [hovered, setHovered] = useState(false);
  if (!visible) return null;
  return (
    <>
      <style>{`@media (max-width: 640px) { .grimoire-nav-arrow { display: none !important; } }`}</style>
      <button
        className="grimoire-nav-arrow"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={direction === "prev" ? "Previous card" : "Next card"}
        style={{
          position: "fixed",
          top: "50%",
          transform: "translateY(-50%)",
          [direction === "prev" ? "left" : "right"]: direction === "prev" ? sidebarWidth + 12 : 12,
          width: 40, height: 40,
          borderRadius: "50%",
          background: hovered ? "rgba(201,185,154,0.15)" : "rgba(201,185,154,0.05)",
          border: "0.5px solid " + (hovered ? "rgba(201,185,154,0.5)" : "rgba(201,185,154,0.2)"),
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s, border-color 0.2s",
          zIndex: 20,
        }}
      >
        <span style={{
          fontSize: 22,
          color: hovered ? "#c9b99a" : "rgba(201,185,154,0.4)",
          transition: "color 0.2s",
          userSelect: "none",
          lineHeight: 1,
        }}>
          {direction === "prev" ? "‹" : "›"}
        </span>
      </button>
    </>
  );
}

// Mobile nav row — prev/next buttons shown below card on small screens
function MobileNav({ onPrev, onNext, canPrev, canNext, index, total }) {
  if (!canPrev && !canNext) return null;
  return (
    <>
      <style>{`@media (min-width: 641px) { .grimoire-mobile-nav { display: none !important; } }`}</style>
      <div className="grimoire-mobile-nav" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 24, gap: 12,
      }}>
        <button onClick={onPrev} disabled={!canPrev} style={{
          flex: 1, padding: "10px", borderRadius: 8,
          background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.2)",
          color: canPrev ? "#c9b99a" : "rgba(201,185,154,0.2)",
          fontSize: 13, cursor: canPrev ? "pointer" : "default", fontFamily: "inherit",
        }}>‹ Prev</button>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", whiteSpace: "nowrap" }}>
          {index + 1} / {total}
        </div>
        <button onClick={onNext} disabled={!canNext} style={{
          flex: 1, padding: "10px", borderRadius: 8,
          background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.2)",
          color: canNext ? "#c9b99a" : "rgba(201,185,154,0.2)",
          fontSize: 13, cursor: canNext ? "pointer" : "default", fontFamily: "inherit",
        }}>Next ›</button>
      </div>
    </>
  );
}

export default function CardExplorer() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("name");
  const [card, setCard] = useState(null);
  const [printings, setPrintings] = useState([]);
  const [activePrinting, setActivePrinting] = useState(0);
  const [lore, setLore] = useState("");
  const [loreLoading, setLoreLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [error, setError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [deckChatOpen, setDeckChatOpen] = useState(false);

  const [view, setView] = useState(VIEW_CARD);

  // Artist gallery
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistCards, setArtistCards] = useState([]);
  const [artistLoading, setArtistLoading] = useState(false);

  // Search results
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Filter gallery (set, rarity, CMC)
  const [filterLabel, setFilterLabel] = useState("");
  const [filterSublabel, setFilterSublabel] = useState("");
  const [filterCards, setFilterCards] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  // Gallery navigation context — which list and index we came from
  const [galleryContext, setGalleryContext] = useState(null); // { cards, index, label }

  // Sidebar artist history
  const [artists, setArtists] = useState([]);

  // Touch tracking for swipe
  const touchStartX = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ARTISTS_KEY);
      if (saved) setArtists(JSON.parse(saved));
    } catch {}
  }, []);

  const addArtist = useCallback((artistName) => {
    if (!artistName) return;
    setArtists((prev) => {
      if (prev.includes(artistName)) return prev;
      const updated = [artistName, ...prev];
      try { localStorage.setItem(ARTISTS_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clearArtists = () => {
    setArtists([]);
    try { localStorage.removeItem(ARTISTS_KEY); } catch {}
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (view === VIEW_CARD && galleryContext && !lightboxOpen) {
        if (e.key === "ArrowLeft") navigateGallery(-1);
        if (e.key === "ArrowRight") navigateGallery(1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, galleryContext, lightboxOpen]);

  const fetchLore = useCallback(async (cardData) => {
    setLoreLoading(true);
    setLore("");
    try {
      const res = await fetch("/api/lore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card: cardData }),
      });
      const data = await res.json();
      setLore(data.lore || "The archives are silent on this matter.");
    } catch {
      setLore("The archives are currently inaccessible.");
    }
    setLoreLoading(false);
  }, []);

  const loadCard = useCallback(async (cardData, galleryIndex = null, galleryCards = null, galleryLabel = null) => {
    setCard(cardData);
    setActivePrinting(0);
    setError("");
    setView(VIEW_CARD);
    if (cardData.artist) addArtist(cardData.artist);

    // Set gallery context if we came from a grid
    if (galleryIndex !== null && galleryCards !== null) {
      setGalleryContext({ cards: galleryCards, index: galleryIndex, label: galleryLabel });
    }

    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?order=released&q=!"${encodeURIComponent(cardData.name)}"&unique=prints`
      );
      const data = await res.json();
      setPrintings(data.data?.filter((p) => p.image_uris) ?? [cardData]);
    } catch {
      setPrintings([cardData]);
    }
    fetchLore(cardData);
  }, [fetchLore, addArtist]);

  const navigateGallery = useCallback((delta) => {
    if (!galleryContext) return;
    const { cards, index, label } = galleryContext;
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= cards.length) return;
    const nextCard = cards[newIndex];
    loadCard(nextCard, newIndex, cards, label);
  }, [galleryContext, loadCard]);

  const goBackToGallery = useCallback(() => {
    if (!galleryContext) return;
    const { label } = galleryContext;
    if (label === VIEW_ARTIST) setView(VIEW_ARTIST);
    else if (label === VIEW_SEARCH) setView(VIEW_SEARCH);
    else if (label === VIEW_FILTER) setView(VIEW_FILTER);
    else setView(VIEW_CARD);
    setGalleryContext(null);
  }, [galleryContext]);

  const doRandom = useCallback(async () => {
    setRandomLoading(true);
    setError("");
    setGalleryContext(null);
    try {
      const res = await fetch("https://api.scryfall.com/cards/random");
      const data = await res.json();
      await loadCard(data);
    } catch { setError("Could not fetch a random card."); }
    setRandomLoading(false);
  }, [loadCard]);

  const doSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setError("");
    setSearchLoading(true);
    setSearchQuery(query.trim());

    if (searchMode === "artist") {
      await openArtist(query.trim());
      setSearchLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=name:"${encodeURIComponent(query.trim())}"&unique=cards&order=name`
      );
      const data = await res.json();

      if (data.object === "error" || !data.data?.length) {
        const fuzzyRes = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(query.trim())}`);
        const fuzzyData = await fuzzyRes.json();
        if (fuzzyData.object === "error") {
          setError("No cards found. Try a different search.");
          setSearchLoading(false);
          return;
        }
        await loadCard(fuzzyData);
        setSearchLoading(false);
        return;
      }

      if (data.data.length === 1) {
        await loadCard(data.data[0], 0, data.data, VIEW_SEARCH);
        setSearchLoading(false);
        return;
      }

      setSearchResults(data.data);
      setView(VIEW_SEARCH);
    } catch {
      setError("Search failed. Check your connection.");
    }
    setSearchLoading(false);
  };

  const openArtist = useCallback(async (artistName) => {
    setSelectedArtist(artistName);
    setView(VIEW_ARTIST);
    setArtistLoading(true);
    setArtistCards([]);
    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=a:"${encodeURIComponent(artistName)}"&unique=art&order=name`
      );
      const data = await res.json();
      const cards = data.data?.filter((c) => c.image_uris?.art_crop) ?? [];
      setArtistCards(cards);
    } catch {}
    setArtistLoading(false);
  }, []);

  const openFilter = useCallback(async (label, sublabel, scryfallQuery) => {
    setFilterLabel(label);
    setFilterSublabel(sublabel);
    setView(VIEW_FILTER);
    setFilterLoading(true);
    setFilterCards([]);
    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=${scryfallQuery}&unique=cards&order=name`
      );
      const data = await res.json();
      setFilterCards(data.data?.filter((c) => c.image_uris) ?? []);
    } catch {}
    setFilterLoading(false);
  }, []);

  useEffect(() => { doRandom(); }, []);

  // Swipe handling
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60 && view === VIEW_CARD && galleryContext) {
      navigateGallery(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  const activeCard = printings[activePrinting] || card;
  const cardImageUrl = activeCard?.image_uris?.normal;
  const lightboxImageUrl = activeCard?.image_uris?.png || activeCard?.image_uris?.large || cardImageUrl;
  const isLoading = randomLoading || searchLoading || artistLoading || filterLoading;
  const hasGalleryNav = view === VIEW_CARD && galleryContext && galleryContext.cards.length > 1;
  const canGoPrev = hasGalleryNav && galleryContext.index > 0;
  const canGoNext = hasGalleryNav && galleryContext.index < galleryContext.cards.length - 1;

  return (
    <div
      style={{ minHeight: "100vh", background: "#0e0c09", color: "#e8dcc8", fontFamily: "Georgia, 'Times New Roman', serif", display: "flex", flexDirection: "column" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Global mobile styles */}
      <style>{`
        @media (max-width: 640px) {
          .grimoire-sidebar { display: none !important; }
          .grimoire-header { flex-direction: column !important; align-items: stretch !important; height: auto !important; padding: 0.75rem 1rem !important; gap: 8px !important; }
          .grimoire-header-top { display: flex; align-items: center; justify-content: space-between; }
          .grimoire-header-subtitle { display: none !important; }
          .grimoire-header-form { flex-direction: column !important; gap: 6px !important; }
          .grimoire-header-form input { width: 100% !important; }
          .grimoire-form-row { display: flex; gap: 6px; width: 100%; }
          .grimoire-toggle { flex: 0 0 auto; }
          .grimoire-search-btn { flex: 1; margin-left: auto; }
          .grimoire-card-grid { grid-template-columns: 1fr !important; }
          .grimoire-card-view { padding: 1rem !important; }
          .grimoire-nav-arrow { display: none !important; }
        }
        @media (min-width: 641px) {
          .grimoire-header-top { display: contents; }
          .grimoire-form-row { display: contents; }
          .grimoire-random-btn { display: none !important; }
        }
        @media (max-width: 640px) {
          .grimoire-random-desktop { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className="grimoire-header" style={{
        borderBottom: "0.5px solid rgba(201,185,154,0.15)",
        padding: "1.25rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem", flexShrink: 0, height: 72,
      }}>
        <div className="grimoire-header-top">
          <div style={{ cursor: "pointer" }} onClick={() => { setView(VIEW_CARD); setGalleryContext(null); }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.14em", color: "#c9b99a", textTransform: "uppercase" }}>Grimoire</div>
            <div className="grimoire-header-subtitle" style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>Magic: The Gathering Explorer</div>
          </div>
          {/* Random button visible in header-top on mobile only */}
          <button type="button" onClick={doRandom} disabled={isLoading} className="grimoire-random-btn" style={{
            background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "8px 16px", color: "rgba(201,185,154,0.5)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.5 : 1,
          }}>Random</button>
        </div>
        <form onSubmit={doSearch} className="grimoire-header-form" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchMode === "artist" ? "Search for an artist..." : "Search for a card..."}
            style={{
              background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(201,185,154,0.25)",
              borderRadius: 6, padding: "8px 14px", color: "#e8dcc8", fontSize: 16,
              width: 220, fontFamily: "inherit",
            }}
          />
          <div className="grimoire-form-row">
            <div className="grimoire-toggle" style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "0.5px solid rgba(201,185,154,0.2)", flexShrink: 0 }}>
              {["name", "artist"].map((mode) => (
                <button key={mode} type="button" onClick={() => setSearchMode(mode)} style={{
                  padding: "8px 12px", fontSize: 11, fontFamily: "inherit",
                  cursor: "pointer", border: "none",
                  background: searchMode === mode ? "rgba(201,185,154,0.15)" : "transparent",
                  color: searchMode === mode ? "#c9b99a" : "rgba(201,185,154,0.35)",
                  letterSpacing: "0.06em", textTransform: "capitalize",
                  transition: "background 0.15s, color 0.15s",
                }}>{mode}</button>
              ))}
            </div>
            <button type="submit" disabled={isLoading} className="grimoire-search-btn" style={{
              background: "rgba(201,185,154,0.1)", border: "0.5px solid rgba(201,185,154,0.35)",
              borderRadius: 6, padding: "8px 16px", color: "#c9b99a", fontSize: 13,
              cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.5 : 1,
            }}>Search</button>
            <button type="button" onClick={doRandom} disabled={isLoading} className="grimoire-random-desktop" style={{
              background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 6, padding: "8px 16px", color: "rgba(201,185,154,0.5)", fontSize: 13,
              cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.5 : 1,
            }}>Random</button>
          </div>
        </form>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <aside className="grimoire-sidebar" style={{
          width: SIDEBAR_WIDTH, flexShrink: 0,
          borderRight: "0.5px solid rgba(201,185,154,0.15)",
          padding: "1.5rem 1rem", overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: "rgba(201,185,154,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Artists</div>
            {artists.length > 0 && (
              <button onClick={clearArtists} style={{
                background: "transparent", border: "none", color: "rgba(201,185,154,0.4)",
                fontSize: 10, cursor: "pointer", fontFamily: "inherit", padding: 0,
              }}>Clear</button>
            )}
          </div>
          {artists.length === 0 && (
            <div style={{ fontSize: 11, color: "rgba(201,185,154,0.35)", lineHeight: 1.6, fontStyle: "italic" }}>
              Artists appear here as you explore cards.
            </div>
          )}
          {artists.map((a) => (
            <button key={a} onClick={() => openArtist(a)} style={{
              background: (view === VIEW_ARTIST && selectedArtist === a) ? "rgba(201,185,154,0.12)" : "transparent",
              border: "0.5px solid " + ((view === VIEW_ARTIST && selectedArtist === a) ? "rgba(201,185,154,0.4)" : "rgba(201,185,154,0.15)"),
              borderRadius: 6, padding: "7px 10px",
              color: (view === VIEW_ARTIST && selectedArtist === a) ? "#c9b99a" : "rgba(201,185,154,0.75)",
              fontSize: 11, cursor: "pointer", fontFamily: "inherit",
              textAlign: "left", width: "100%",
              transition: "background 0.15s, border-color 0.15s, color 0.15s",
            }}>{a}</button>
          ))}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto" }}>

          {view === VIEW_SEARCH && (
            <CardGrid
              cards={searchResults} label="Search results" sublabel={`"${searchQuery}"`}
              loading={searchLoading} loadingText="Searching the archives..."
              onSelectCard={(c, i) => loadCard(c, i, searchResults, VIEW_SEARCH)}
              onBack={() => setView(VIEW_SEARCH)}
            />
          )}

          {view === VIEW_ARTIST && (
            <CardGrid
              cards={artistCards} label="Artist" sublabel={selectedArtist}
              loading={artistLoading} loadingText="Gathering works..."
              onSelectCard={(c, i) => loadCard(c, i, artistCards, VIEW_ARTIST)}
              onBack={() => setView(VIEW_ARTIST)}
            />
          )}

          {view === VIEW_FILTER && (
            <CardGrid
              cards={filterCards} label={filterLabel} sublabel={filterSublabel}
              loading={filterLoading} loadingText="Browsing the collection..."
              onSelectCard={(c, i) => loadCard(c, i, filterCards, VIEW_FILTER)}
              onBack={() => setView(VIEW_FILTER)}
            />
          )}

          {view === VIEW_CARD && (
            <>
              <style>{`
                @media (max-width: 640px) {
                  .grimoire-card-grid { grid-template-columns: 1fr !important; }
                  .grimoire-card-view { padding: 1.25rem !important; }
                }
              `}</style>
              <div className="grimoire-card-view" style={{ padding: "2.5rem 4rem", maxWidth: 860, margin: "0 auto" }}>

              {/* Back to gallery + position indicator */}
              {galleryContext && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <button onClick={goBackToGallery} style={{
                    background: "transparent", border: "0.5px solid rgba(201,185,154,0.3)",
                    borderRadius: 6, padding: "6px 14px", color: "rgba(201,185,154,0.7)",
                    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  }}>← Back to {galleryContext.label === VIEW_ARTIST ? "Artist" : galleryContext.label === VIEW_SEARCH ? "Search Results" : "Gallery"}</button>
                  <div style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", letterSpacing: "0.06em" }}>
                    {galleryContext.index + 1} / {galleryContext.cards.length}
                  </div>
                </div>
              )}

              {randomLoading && (
                <div style={{ textAlign: "center", padding: "5rem", color: "rgba(201,185,154,0.35)", fontSize: 13, letterSpacing: "0.12em" }}>
                  Consulting the archives...
                </div>
              )}
              {error && <div style={{ color: "#e8a27c", fontSize: 13, padding: "1rem 0" }}>{error}</div>}

              {!randomLoading && activeCard && (
                <div className="grimoire-card-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2.5rem", alignItems: "start" }}>

                  {/* Left */}
                  <div>
                    <div
                      onClick={() => cardImageUrl && setLightboxOpen(true)}
                      style={{
                        borderRadius: 10, overflow: "hidden",
                        border: "0.5px solid rgba(201,185,154,0.15)",
                        background: "#1a1610", aspectRatio: "3/4",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: cardImageUrl ? "zoom-in" : "default",
                        transition: "border-color 0.15s",
                      }}
                      onMouseEnter={e => { if (cardImageUrl) e.currentTarget.style.borderColor = "rgba(201,185,154,0.4)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.15)"; }}
                    >
                      {cardImageUrl
                        ? <img src={cardImageUrl} alt={activeCard.name} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                        : <span style={{ color: "rgba(201,185,154,0.25)", fontSize: 13 }}>No image</span>
                      }
                    </div>

                    {activeCard.artist && (
                      <div style={{ marginTop: 10, fontSize: 11, color: "rgba(201,185,154,0.5)", letterSpacing: "0.06em", textAlign: "center" }}>
                        Art by{" "}
                        <span onClick={() => openArtist(activeCard.artist)} style={{ color: "#c9b99a", cursor: "pointer", textDecoration: "underline", textDecorationColor: "rgba(201,185,154,0.3)" }}>
                          {activeCard.artist}
                        </span>
                      </div>
                    )}

                    {printings.length > 1 && (
                      <div style={{ marginTop: 24 }}>
                        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                          Printings ({printings.length})
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {printings.slice(0, 18).map((p, i) => (
                            <PrintingThumb key={i} card={p} active={i === activePrinting} onClick={() => setActivePrinting(i)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mobile prev/next */}
                    {galleryContext && (
                      <MobileNav
                        onPrev={() => navigateGallery(-1)}
                        onNext={() => navigateGallery(1)}
                        canPrev={canGoPrev}
                        canNext={canGoNext}
                        index={galleryContext.index}
                        total={galleryContext.cards.length}
                      />
                    )}
                  </div>

                  {/* Right */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: "#e8dcc8", lineHeight: 1.2 }}>{activeCard.name}</div>
                      <div style={{ fontSize: 13, color: "rgba(201,185,154,0.55)", marginTop: 6, letterSpacing: "0.04em" }}>{activeCard.type_line}</div>
                    </div>

                    {activeCard.mana_cost && (
                      <div>
                        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Mana Cost</div>
                        {parseMana(activeCard.mana_cost)}
                      </div>
                    )}

                    {activeCard.oracle_text && (
                      <div style={{ borderLeft: "2px solid rgba(201,185,154,0.2)", paddingLeft: 16 }}>
                        {activeCard.oracle_text.split("\n").map((line, i, arr) => (
                          <div key={i} style={{ fontSize: 13, color: "#c9b99a", lineHeight: 1.8, marginBottom: i < arr.length - 1 ? 8 : 0 }}>
                            {replaceSymbols(line)}
                          </div>
                        ))}
                      </div>
                    )}

                    {activeCard.flavor_text && (
                      <div style={{ fontSize: 12, color: "rgba(201,185,154,0.55)", fontStyle: "italic", lineHeight: 1.8 }}>
                        "{activeCard.flavor_text}"
                      </div>
                    )}

                    {activeCard.power && (
                      <div style={{
                        display: "inline-flex", alignItems: "center",
                        fontSize: 17, fontWeight: 700, color: "#e8dcc8",
                        background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.25)",
                        borderRadius: 6, padding: "4px 14px", alignSelf: "flex-start",
                      }}>{activeCard.power}/{activeCard.toughness}</div>
                    )}

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {activeCard.set_name && (
                        <ClickableBadge onClick={() => openFilter("Set", activeCard.set_name, `e:${activeCard.set}`)}>
                          {activeCard.set_name}
                        </ClickableBadge>
                      )}
                      {activeCard.rarity && (
                        <ClickableBadge onClick={() => openFilter("Rarity", activeCard.rarity, `r:${activeCard.rarity}`)}>
                          {activeCard.rarity}
                        </ClickableBadge>
                      )}
                      {activeCard.cmc > 0 && (
                        <ClickableBadge onClick={() => openFilter("Mana Value", `CMC ${activeCard.cmc}`, `cmc:${activeCard.cmc}`)}>
                          CMC {activeCard.cmc}
                        </ClickableBadge>
                      )}
                    </div>

                    <div style={{ borderTop: "0.5px solid rgba(201,185,154,0.12)", paddingTop: 20 }}>
                      <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Codex Entry</div>
                      <div style={{ fontSize: 13, lineHeight: 1.8, fontStyle: "italic", color: loreLoading ? "rgba(201,185,154,0.25)" : "rgba(201,185,154,0.75)" }}>
                        {loreLoading ? "Consulting the archives..." : lore}
                      </div>
                    </div>

                    {/* Build a Deck button */}
                    <button
                      onClick={() => setDeckChatOpen(true)}
                      style={{
                        marginTop: 8, padding: "10px 16px", borderRadius: 8, width: "100%",
                        background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.25)",
                        color: "#c9b99a", fontSize: 13, cursor: "pointer",
                        fontFamily: "Georgia, serif", letterSpacing: "0.05em",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.15)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.45)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,185,154,0.08)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.25)"; }}
                    >
                      ✦ Build a Deck Around This Card
                    </button>
                  </div>
                </div>
              )}
            </div>
            </>
          )}
        </main>
      </div>

      {/* Desktop gallery nav arrows */}
      <NavArrow direction="prev" onClick={() => navigateGallery(-1)} visible={canGoPrev} sidebarWidth={SIDEBAR_WIDTH} />
      <NavArrow direction="next" onClick={() => navigateGallery(1)} visible={canGoNext} sidebarWidth={0} />

      {/* Lightbox */}
      {lightboxOpen && lightboxImageUrl && (
        <div onClick={() => setLightboxOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "zoom-out", backdropFilter: "blur(4px)",
        }}>
          <img src={lightboxImageUrl} alt={activeCard?.name} onClick={e => e.stopPropagation()} style={{
            maxHeight: "90vh", maxWidth: "90vw",
            borderRadius: 16, boxShadow: "0 32px 80px rgba(0,0,0,0.8)", cursor: "default",
          }} />
          <button onClick={() => setLightboxOpen(false)} style={{
            position: "fixed", top: 24, right: 24,
            background: "rgba(201,185,154,0.1)", border: "0.5px solid rgba(201,185,154,0.25)",
            borderRadius: 6, padding: "6px 14px", color: "rgba(201,185,154,0.6)",
            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          }}>✕ Close</button>
        </div>
      )}

      {/* Deck Builder chat panel */}
      <DeckChat
        card={activeCard}
        isOpen={deckChatOpen}
        onClose={() => setDeckChatOpen(false)}
      />
    </div>
  );
}