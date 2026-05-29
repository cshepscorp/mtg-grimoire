"use client";

import PrintingThumb from "./PrintingThumb";

export default function CardImage({ card, printings, activePrinting, onPrintingChange, onOpenArtist, onLightboxOpen, onRotateOpen, canRotate, hasFaces, flipTargetName, onFlipFace, isFavorite, onToggleFavorite, isArtistFavorite, onToggleFavoriteArtist }) {
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

      {canRotate && (
        <button
          onClick={onRotateOpen}
          style={{
            marginTop: 10, width: "100%",
            background: "rgba(201,185,154,0.06)", border: "0.5px solid rgba(201,185,154,0.25)",
            borderRadius: 8, padding: "10px 16px",
            color: "#c9b99a", fontSize: 13,
            cursor: "pointer", fontFamily: "Georgia, serif",
            letterSpacing: "0.05em", textAlign: "center",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.14)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,185,154,0.06)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.25)"; }}
        >
          ↻ Rotate to Read
        </button>
      )}

      {hasFaces && (
        <button
          onClick={onFlipFace}
          style={{
            marginTop: 10, width: "100%",
            background: "rgba(201,185,154,0.06)", border: "0.5px solid rgba(201,185,154,0.25)",
            borderRadius: 8, padding: "10px 16px",
            color: "#c9b99a", fontSize: 13,
            cursor: "pointer", fontFamily: "Georgia, serif",
            letterSpacing: "0.05em", textAlign: "center",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.14)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,185,154,0.06)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.25)"; }}
        >
          ↺ {flipTargetName}
        </button>
      )}

      <button
        onClick={onToggleFavorite}
        style={{
          marginTop: 10, width: "100%",
          background: isFavorite ? "rgba(232,162,124,0.1)" : "rgba(201,185,154,0.06)",
          border: `0.5px solid ${isFavorite ? "rgba(232,162,124,0.4)" : "rgba(201,185,154,0.25)"}`,
          borderRadius: 8, padding: "10px 16px",
          color: isFavorite ? "#e8a27c" : "#c9b99a", fontSize: 13,
          cursor: "pointer", fontFamily: "Georgia, serif",
          letterSpacing: "0.05em", textAlign: "center",
          transition: "background 0.15s, border-color 0.15s, color 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = isFavorite ? "rgba(232,162,124,0.18)" : "rgba(201,185,154,0.14)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = isFavorite ? "rgba(232,162,124,0.1)" : "rgba(201,185,154,0.06)"; }}
      >
        {isFavorite ? "♥ Saved" : "♡ Save to Favorites"}
      </button>

      {card?.artist && (
        <div style={{ marginTop: 10, fontSize: 11, color: "rgba(201,185,154,0.5)", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span>
            Art by{" "}
            <span onClick={() => onOpenArtist(card.artist)} style={{ color: "#c9b99a", cursor: "pointer", textDecoration: "underline", textDecorationColor: "rgba(201,185,154,0.3)" }}>
              {card.artist}
            </span>
          </span>
          <button
            onClick={() => onToggleFavoriteArtist(card.artist)}
            title={isArtistFavorite ? "Remove from favorites" : "Favorite this artist"}
            style={{
              background: "rgba(201,185,154,0.08)",
              border: `0.5px solid ${isArtistFavorite ? "rgba(232,162,124,0.4)" : "rgba(201,185,154,0.25)"}`,
              borderRadius: 4, cursor: "pointer", padding: "2px 6px",
              fontSize: 12, lineHeight: 1,
              color: isArtistFavorite ? "#e8a27c" : "rgba(201,185,154,0.6)",
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            {isArtistFavorite ? "♥" : "♡"}
          </button>
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
