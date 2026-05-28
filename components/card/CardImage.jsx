import PrintingThumb from "./PrintingThumb";

export default function CardImage({ card, printings, activePrinting, onPrintingChange, onOpenArtist, onLightboxOpen }) {
  const cardImageUrl = card?.image_uris?.normal;

  return (
    <div>
      <div
        onClick={() => cardImageUrl && onLightboxOpen()}
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
          ? <img src={cardImageUrl} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          : <span style={{ color: "rgba(201,185,154,0.25)", fontSize: 13 }}>No image</span>
        }
      </div>

      {card?.artist && (
        <div style={{ marginTop: 10, fontSize: 11, color: "rgba(201,185,154,0.5)", letterSpacing: "0.06em", textAlign: "center" }}>
          Art by{" "}
          <span onClick={() => onOpenArtist(card.artist)} style={{ color: "#c9b99a", cursor: "pointer", textDecoration: "underline", textDecorationColor: "rgba(201,185,154,0.3)" }}>
            {card.artist}
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
              <PrintingThumb key={i} card={p} active={i === activePrinting} onClick={() => onPrintingChange(i)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
