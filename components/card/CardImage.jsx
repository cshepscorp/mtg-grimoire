"use client";

import { useState } from "react";
import PrintingThumb from "./PrintingThumb";

export default function CardImage({ card, printings, activePrinting, onPrintingChange, onOpenArtist, onLightboxOpen, onRotateOpen, canRotate, hasFaces, flipTargetName, onFlipFace, isFavorite, onToggleFavorite, isArtistFavorite, onToggleFavoriteArtist, isOwned, getOwnedQuantity, onAddToCollection, onUpdateQuantity }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPrintingIdx, setPopoverPrintingIdx] = useState(0);
  const [popoverQty, setPopoverQty] = useState(1);

  const popoverCard = printings[popoverPrintingIdx] ?? card;
  const popoverExistingQty = getOwnedQuantity?.(popoverCard?.id) ?? 0;
  const popoverAlreadyOwned = popoverExistingQty > 0;

  const openPopover = () => {
    const idx = activePrinting;
    const existingQty = getOwnedQuantity?.(printings[idx]?.id ?? card?.id) ?? 0;
    setPopoverPrintingIdx(idx);
    setPopoverQty(existingQty > 0 ? existingQty : 1);
    setPopoverOpen(true);
  };

  const handlePopoverPrintingChange = (idx) => {
    const existingQty = getOwnedQuantity?.(printings[idx]?.id ?? card?.id) ?? 0;
    setPopoverPrintingIdx(idx);
    setPopoverQty(existingQty > 0 ? existingQty : 1);
  };

  const confirmAdd = () => {
    const selectedCard = printings[popoverPrintingIdx] ?? card;
    if (popoverAlreadyOwned) {
      onUpdateQuantity?.(selectedCard.id, popoverQty);
    } else {
      onAddToCollection?.(selectedCard, popoverQty);
    }
    setPopoverOpen(false);
  };

  const currentPrintingId = printings[activePrinting]?.id ?? card?.id;
  const owned = isOwned?.(currentPrintingId);
  const ownedQuantity = getOwnedQuantity?.(currentPrintingId) ?? 0;
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

      {owned ? (
        <div style={{
          marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(80,160,120,0.08)", border: "0.5px solid rgba(80,160,120,0.3)",
          borderRadius: 8, padding: "8px 14px",
        }}>
          <span style={{ fontSize: 12, color: "rgba(100,190,150,0.85)", letterSpacing: "0.04em" }}>◎ In collection</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => onUpdateQuantity?.(currentPrintingId, Math.max(0, ownedQuantity - 1))}
              style={{ background: "transparent", border: "none", color: "rgba(100,190,150,0.7)", fontSize: 16, cursor: "pointer", padding: 0, lineHeight: 1, fontFamily: "inherit" }}
            >−</button>
            <span style={{ fontSize: 13, color: "#e8dcc8", minWidth: 14, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{ownedQuantity}</span>
            <button
              onClick={() => onUpdateQuantity?.(currentPrintingId, ownedQuantity + 1)}
              style={{ background: "transparent", border: "none", color: "rgba(100,190,150,0.7)", fontSize: 16, cursor: "pointer", padding: 0, lineHeight: 1, fontFamily: "inherit" }}
            >+</button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, position: "relative" }}>
          <button
            onClick={openPopover}
            style={{
              width: "100%",
              background: "rgba(201,185,154,0.06)", border: "0.5px solid rgba(201,185,154,0.25)",
              borderRadius: popoverOpen ? "8px 8px 0 0" : 8, padding: "10px 16px",
              color: "#c9b99a", fontSize: 13,
              cursor: "pointer", fontFamily: "Georgia, serif",
              letterSpacing: "0.05em", textAlign: "center",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => { if (!popoverOpen) { e.currentTarget.style.background = "rgba(201,185,154,0.14)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.45)"; }}}
            onMouseLeave={e => { if (!popoverOpen) { e.currentTarget.style.background = "rgba(201,185,154,0.06)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.25)"; }}}
          >+ Add to Collection</button>

          {popoverOpen && (
            <div style={{
              background: "#16140f",
              border: "0.5px solid rgba(201,185,154,0.25)", borderTop: "none",
              borderRadius: "0 0 8px 8px",
              padding: "14px",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(201,185,154,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Printing</div>
                <select
                  value={popoverPrintingIdx}
                  onChange={e => handlePopoverPrintingChange(Number(e.target.value))}
                  style={{
                    width: "100%", background: "#0e0c09",
                    border: "0.5px solid rgba(201,185,154,0.25)", borderRadius: 6,
                    padding: "7px 10px", color: "#c9b99a", fontSize: 12,
                    fontFamily: "Georgia, serif", cursor: "pointer", outline: "none",
                  }}
                >
                  {printings.map((p, i) => (
                    <option key={p.id} value={i}>
                      {p.set_name} ({p.set?.toUpperCase()}) #{p.collector_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ fontSize: 10, color: "rgba(201,185,154,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Quantity</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={() => setPopoverQty(q => Math.max(1, q - 1))}
                    style={{ background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.2)", borderRadius: 4, width: 28, height: 28, color: "#c9b99a", fontSize: 16, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >−</button>
                  <span style={{ fontSize: 15, color: "#e8dcc8", minWidth: 20, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{popoverQty}</span>
                  <button
                    onClick={() => setPopoverQty(q => q + 1)}
                    style={{ background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.2)", borderRadius: 4, width: 28, height: 28, color: "#c9b99a", fontSize: 16, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >+</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setPopoverOpen(false)}
                  style={{
                    flex: 1, background: "transparent", border: "0.5px solid rgba(201,185,154,0.18)",
                    borderRadius: 6, padding: "8px", color: "rgba(201,185,154,0.5)",
                    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  }}
                >Cancel</button>
                <button
                  onClick={confirmAdd}
                  style={{
                    flex: 2, background: "rgba(80,160,120,0.12)", border: "0.5px solid rgba(80,160,120,0.35)",
                    borderRadius: 6, padding: "8px",
                    color: "rgba(100,190,150,0.9)", fontSize: 12,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >{popoverAlreadyOwned ? "Update Quantity" : "Add to Collection"}</button>
              </div>
            </div>
          )}
        </div>
      )}

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
