"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./SearchHeader.module.css";

export default function SearchHeader({ query, setQuery, searchMode, setSearchMode, onSearch, onRandom, onOpenSets, onOpenColors, onOpenFavorites, favoritesCount, isLoading, onLogoClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const suppressBlurRef = useRef(false);
  const suppressNextFetchRef = useRef(false);
  const artistNamesRef = useRef([]);
  const artistNamesFetchedRef = useRef(false);

  // Pre-fetch artist names when switching to artist mode
  useEffect(() => {
    if (searchMode !== "artist" || artistNamesFetchedRef.current) return;
    artistNamesFetchedRef.current = true;
    fetch("https://api.scryfall.com/catalog/artist-names")
      .then(r => r.json())
      .then(data => { artistNamesRef.current = data.data ?? []; })
      .catch(() => {});
  }, [searchMode]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchMode === "artist") {
      if (suppressNextFetchRef.current) { suppressNextFetchRef.current = false; return; }
      const q = query.trim().toLowerCase();
      const matches = artistNamesRef.current
        .filter(n => n.toLowerCase().includes(q))
        .slice(0, 20);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setSelectedIdx(-1);
      return;
    }

    const timer = setTimeout(async () => {
      if (suppressNextFetchRef.current) { suppressNextFetchRef.current = false; return; }
      try {
        const res = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        const results = data.data ?? [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSelectedIdx(-1);
      } catch {}
    }, 280);
    return () => clearTimeout(timer);
  }, [query, searchMode]);

  const selectSuggestion = (name) => {
    suppressNextFetchRef.current = true;
    setQuery(name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIdx(-1);
    onSearch(name, searchMode);
  };

  const handleInputKeyDown = (e) => {
    if (!showSuggestions || !suggestions.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && selectedIdx >= 0) { e.preventDefault(); selectSuggestion(suggestions[selectedIdx]); }
    else if (e.key === "Escape") { setShowSuggestions(false); setSelectedIdx(-1); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    onSearch(query, searchMode);
  };

  const handleOpenSets = () => { onOpenSets(); setMenuOpen(false); };
  const handleOpenColors = () => { onOpenColors(); setMenuOpen(false); };
  const handleOpenFavorites = () => { onOpenFavorites(); setMenuOpen(false); };

  return (
    <header className={styles.header} style={{
      borderBottom: "0.5px solid rgba(201,185,154,0.15)",
      padding: "1.25rem 2rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "1rem", flexShrink: 0, height: 72,
    }}>
      <div className={styles.headerTop}>
        <div style={{ cursor: "pointer" }} onClick={onLogoClick}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.14em", color: "#c9b99a", textTransform: "uppercase" }}>Grimoire</div>
          <div className={styles.headerSubtitle} style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>Magic: The Gathering Explorer</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" onClick={onRandom} disabled={isLoading} className={styles.randomBtn} style={{
            background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "8px 16px", color: "rgba(201,185,154,0.5)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.5 : 1,
          }}>Random</button>
          <button type="button" onClick={() => setMenuOpen(o => !o)} className={styles.hamburger} style={{
            background: menuOpen ? "rgba(201,185,154,0.1)" : "transparent",
            border: "0.5px solid rgba(201,185,154,0.2)",
            borderRadius: 6, padding: "6px 10px", color: "rgba(201,185,154,0.6)", fontSize: 16,
            cursor: "pointer", fontFamily: "inherit", lineHeight: 1,
          }}>≡</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.headerForm} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            value={query}
            onChange={(e) => { suppressNextFetchRef.current = false; setQuery(e.target.value); }}
            onKeyDown={handleInputKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => { if (!suppressBlurRef.current) { setShowSuggestions(false); setSelectedIdx(-1); } }}
            placeholder={searchMode === "artist" ? "Search for an artist..." : "Search for a card..."}
            style={{
              background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(201,185,154,0.25)",
              borderRadius: showSuggestions ? "6px 6px 0 0" : 6,
              padding: "8px 14px", color: "#e8dcc8", fontSize: 16,
              width: 220, fontFamily: "inherit",
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 200,
              background: "#16140f",
              border: "0.5px solid rgba(201,185,154,0.3)",
              borderTop: "none",
              borderRadius: "0 0 6px 6px",
              maxHeight: 260, overflowY: "auto",
            }}>
              {suggestions.map((name, i) => (
                <div
                  key={name}
                  onMouseDown={() => { suppressBlurRef.current = true; }}
                  onClick={() => { suppressBlurRef.current = false; selectSuggestion(name); }}
                  style={{
                    padding: "8px 14px", cursor: "pointer", fontSize: 13,
                    color: i === selectedIdx ? "#e8dcc8" : "rgba(201,185,154,0.8)",
                    background: i === selectedIdx ? "rgba(201,185,154,0.12)" : "transparent",
                    borderBottom: i < suggestions.length - 1 ? "0.5px solid rgba(201,185,154,0.07)" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (i !== selectedIdx) e.currentTarget.style.background = "rgba(201,185,154,0.07)"; }}
                  onMouseLeave={e => { if (i !== selectedIdx) e.currentTarget.style.background = "transparent"; }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.toggle} style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "0.5px solid rgba(201,185,154,0.2)", flexShrink: 0 }}>
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
          <button type="submit" disabled={isLoading} className={styles.searchBtn} style={{
            background: "rgba(201,185,154,0.1)", border: "0.5px solid rgba(201,185,154,0.35)",
            borderRadius: 6, padding: "8px 16px", color: "#c9b99a", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.5 : 1,
          }}>Search</button>
          <button type="button" onClick={onRandom} disabled={isLoading} className={styles.randomDesktop} style={{
            background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "8px 16px", color: "rgba(201,185,154,0.5)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.5 : 1,
          }}>Random</button>
          <button type="button" onClick={handleOpenSets} className={styles.setsBtn} style={{
            background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "8px 16px", color: "rgba(201,185,154,0.5)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}>Sets</button>
          <button type="button" onClick={handleOpenColors} className={styles.setsBtn} style={{
            background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "8px 16px", color: "rgba(201,185,154,0.5)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}>Colors</button>
          <button type="button" onClick={handleOpenFavorites} className={styles.setsBtn} style={{
            background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "8px 16px", color: favoritesCount > 0 ? "#e8a27c" : "rgba(201,185,154,0.5)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}>{favoritesCount > 0 ? `♥ ${favoritesCount}` : "♡ Saved"}</button>
        </div>
      </form>

      {menuOpen && (
        <div className={styles.mobileDropdown}>
          <button onClick={handleOpenSets} style={{
            background: "transparent", border: "0.5px solid rgba(201,185,154,0.18)",
            borderRadius: 6, padding: "10px 14px", color: "rgba(201,185,154,0.75)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%",
          }}>Browse Sets</button>
          <button onClick={handleOpenColors} style={{
            background: "transparent", border: "0.5px solid rgba(201,185,154,0.18)",
            borderRadius: 6, padding: "10px 14px", color: "rgba(201,185,154,0.75)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%",
          }}>Browse Colors</button>
          <button onClick={handleOpenFavorites} style={{
            background: "transparent", border: "0.5px solid rgba(201,185,154,0.18)",
            borderRadius: 6, padding: "10px 14px", color: favoritesCount > 0 ? "#e8a27c" : "rgba(201,185,154,0.75)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%",
          }}>{favoritesCount > 0 ? `♥ Saved (${favoritesCount})` : "♡ Saved"}</button>
        </div>
      )}
    </header>
  );
}
