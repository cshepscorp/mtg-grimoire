"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGrimoire } from "../../contexts/GrimoireContext";
import { scryfallImageUrl, colorDotColor } from "../../utils/cardHelpers";

const cardImg = (card) => card.image_uri ?? scryfallImageUrl(card.id);

const VIEW_TOGGLE_BTN = (active) => ({
  background: active ? "rgba(201,185,154,0.12)" : "transparent",
  border: `0.5px solid ${active ? "rgba(201,185,154,0.4)" : "rgba(201,185,154,0.15)"}`,
  borderRadius: 5, padding: "5px 10px",
  color: active ? "#c9b99a" : "rgba(201,185,154,0.4)",
  fontSize: 11, cursor: "pointer", fontFamily: "inherit",
  transition: "all 0.15s",
});

export default function FavoritesTab() {
  const { favorites, removeFavorite } = useGrimoire();
  const router = useRouter();
  const [view, setView] = useState("grid");

  if (favorites.length === 0) {
    return (
      <p style={{ color: "rgba(201,185,154,0.35)", fontStyle: "italic", fontSize: 13, marginTop: "3rem", textAlign: "center" }}>
        No favorites yet. Heart a card to save it here.
      </p>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 12, color: "rgba(201,185,154,0.4)" }}>
          {favorites.length} card{favorites.length !== 1 ? "s" : ""}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={VIEW_TOGGLE_BTN(view === "grid")} onClick={() => setView("grid")}>⊞ Grid</button>
          <button style={VIEW_TOGGLE_BTN(view === "list")} onClick={() => setView("list")}>≡ List</button>
        </div>
      </div>

      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {favorites.map(card => (
            <div key={card.id} style={{ position: "relative" }}>
              <div
                onClick={() => router.push(`/explore?openCard=${card.id}`)}
                style={{ borderRadius: 8, overflow: "hidden", cursor: "pointer", border: "0.5px solid rgba(201,185,154,0.1)", background: "#1a1610", transition: "border-color 0.15s, transform 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.4)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.1)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <img
                  src={cardImg(card)}
                  alt={card.name}
                  style={{ width: "100%", display: "block", aspectRatio: "3/4", objectFit: "cover" }}
                  onError={e => { e.currentTarget.style.display = "none"; }}
                />
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: 12, color: "#c9b99a", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", marginTop: 2 }}>{card.set?.toUpperCase()}</div>
                </div>
              </div>
              <button
                onClick={() => removeFavorite(card.id)}
                title="Remove"
                style={{ position: "absolute", top: 6, right: 6, background: "rgba(14,12,9,0.85)", border: "0.5px solid rgba(201,185,154,0.2)", borderRadius: 4, color: "rgba(201,185,154,0.55)", fontSize: 13, cursor: "pointer", padding: "2px 7px", lineHeight: 1, fontFamily: "inherit", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#e8dcc8"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.55)"}
              >×</button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {favorites.map(card => (
            <div key={card.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "0.5px solid rgba(201,185,154,0.06)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: colorDotColor(card.colors, card.color_identity), display: "inline-block" }} />
              <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => router.push(`/explore?openCard=${card.id}`)}>
                <div style={{ fontSize: 13, color: "#c9b99a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</div>
                <div style={{ fontSize: 10, color: "rgba(201,185,154,0.35)", marginTop: 1 }}>{card.set_name} · {card.set?.toUpperCase()}</div>
              </div>
              <button
                onClick={() => removeFavorite(card.id)}
                style={{ background: "transparent", border: "none", color: "rgba(201,185,154,0.25)", fontSize: 16, cursor: "pointer", padding: "0 4px", fontFamily: "inherit", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.6)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.25)"}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
