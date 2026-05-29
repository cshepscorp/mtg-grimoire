"use client";

export default function FavoriteButton({ isFavorite, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      style={{
        background: "transparent", border: "none",
        cursor: "pointer", padding: "2px 4px",
        fontSize: 24, lineHeight: 1, flexShrink: 0,
        color: isFavorite ? "#e8a27c" : "rgba(201,185,154,0.25)",
        transition: "color 0.15s, transform 0.1s",
        transform: isFavorite ? "scale(1.1)" : "scale(1)",
      }}
      onMouseEnter={e => { if (!isFavorite) e.currentTarget.style.color = "rgba(201,185,154,0.55)"; }}
      onMouseLeave={e => { if (!isFavorite) e.currentTarget.style.color = "rgba(201,185,154,0.25)"; }}
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}
