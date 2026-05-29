import { VIEW_ARTIST } from "../../utils/constants";
import styles from "./ArtistSidebar.module.css";

export default function ArtistSidebar({ artists, selectedArtist, currentView, onSelectArtist, onRemoveArtist, onClear }) {
  return (
    <aside className={styles.sidebar} style={{
      width: 200, flexShrink: 0,
      borderRight: "0.5px solid rgba(201,185,154,0.15)",
      padding: "1.5rem 1rem", overflowY: "auto",
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Artists</div>
        {artists.length > 0 && (
          <button onClick={onClear} style={{
            background: "transparent", border: "none", color: "rgba(201,185,154,0.4)",
            fontSize: 10, cursor: "pointer", fontFamily: "inherit", padding: 0,
          }}>Clear</button>
        )}
      </div>
      {artists.length === 0 && (
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.35)", lineHeight: 1.6, fontStyle: "italic" }}>
          Click ♡ next to an artist's name to save them here.
        </div>
      )}
      {artists.map((a) => (
        <div key={a} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => onSelectArtist(a)} style={{
            flex: 1,
            background: (currentView === VIEW_ARTIST && selectedArtist === a) ? "rgba(201,185,154,0.12)" : "transparent",
            border: "0.5px solid " + ((currentView === VIEW_ARTIST && selectedArtist === a) ? "rgba(201,185,154,0.4)" : "rgba(201,185,154,0.15)"),
            borderRadius: 6, padding: "7px 10px",
            color: (currentView === VIEW_ARTIST && selectedArtist === a) ? "#c9b99a" : "rgba(201,185,154,0.75)",
            fontSize: 11, cursor: "pointer", fontFamily: "inherit",
            textAlign: "left",
            transition: "background 0.15s, border-color 0.15s, color 0.15s",
          }}>{a}</button>
          <button onClick={() => onRemoveArtist(a)} style={{
            background: "transparent", border: "none",
            color: "rgba(201,185,154,0.3)", fontSize: 14,
            cursor: "pointer", padding: "0 2px", lineHeight: 1,
            flexShrink: 0, transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.7)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.3)"}
          title="Remove from favorites"
          >×</button>
        </div>
      ))}
    </aside>
  );
}
