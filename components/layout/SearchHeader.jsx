import styles from "./SearchHeader.module.css";

export default function SearchHeader({ query, setQuery, searchMode, setSearchMode, onSearch, onRandom, isLoading, onLogoClick }) {
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
        <button type="button" onClick={onRandom} disabled={isLoading} className={styles.randomBtn} style={{
          background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 6, padding: "8px 16px", color: "rgba(201,185,154,0.5)", fontSize: 13,
          cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.5 : 1,
        }}>Random</button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSearch(query, searchMode); }} className={styles.headerForm} style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
        </div>
      </form>
    </header>
  );
}
