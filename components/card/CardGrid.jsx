export default function CardGrid({ cards, label, sublabel, loading, loadingText, onSelectCard, onBack, headerAction }) {
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#e8dcc8" }}>{sublabel}</div>
          </div>
          {headerAction}
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
