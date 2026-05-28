export default function SearchHeader({ query, setQuery, searchMode, setSearchMode, onSearch, onRandom, isLoading, onLogoClick }) {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .grimoire-header { flex-direction: column !important; align-items: stretch !important; height: auto !important; padding: 0.75rem 1rem !important; gap: 8px !important; }
          .grimoire-header-top { display: flex; align-items: center; justify-content: space-between; }
          .grimoire-header-subtitle { display: none !important; }
          .grimoire-header-form { flex-direction: column !important; gap: 6px !important; }
          .grimoire-header-form input { width: 100% !important; }
          .grimoire-form-row { display: flex; gap: 6px; width: 100%; }
          .grimoire-toggle { flex: 0 0 auto; }
          .grimoire-search-btn { flex: 1; margin-left: auto; }
          .grimoire-random-desktop { display: none !important; }
        }
        @media (min-width: 641px) {
          .grimoire-header-top { display: contents; }
          .grimoire-form-row { display: contents; }
          .grimoire-random-btn { display: none !important; }
        }
      `}</style>
      <header className="grimoire-header" style={{
        borderBottom: "0.5px solid rgba(201,185,154,0.15)",
        padding: "1.25rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem", flexShrink: 0, height: 72,
      }}>
        <div className="grimoire-header-top">
          <div style={{ cursor: "pointer" }} onClick={onLogoClick}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.14em", color: "#c9b99a", textTransform: "uppercase" }}>Grimoire</div>
            <div className="grimoire-header-subtitle" style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>Magic: The Gathering Explorer</div>
          </div>
          <button type="button" onClick={onRandom} disabled={isLoading} className="grimoire-random-btn" style={{
            background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "8px 16px", color: "rgba(201,185,154,0.5)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.5 : 1,
          }}>Random</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSearch(query, searchMode); }} className="grimoire-header-form" style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
            <button type="button" onClick={onRandom} disabled={isLoading} className="grimoire-random-desktop" style={{
              background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 6, padding: "8px 16px", color: "rgba(201,185,154,0.5)", fontSize: 13,
              cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.5 : 1,
            }}>Random</button>
          </div>
        </form>
      </header>
    </>
  );
}
