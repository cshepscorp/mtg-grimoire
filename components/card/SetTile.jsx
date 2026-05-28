"use client";

import { useState, useEffect, useRef } from "react";

const CARD_W = 82;
const ROTATIONS = [-10, -2, 6];
const OFFSETS = [-22, -6, 10];

export default function SetTile({ set, onSelect }) {
  const [cardImages, setCardImages] = useState([]);
  const [fetched, setFetched] = useState(false);
  const tileRef = useRef(null);

  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        fetch(`https://api.scryfall.com/cards/search?q=e:${set.code}&order=edhrec&unique=cards`)
          .then(r => r.json())
          .then(data => {
            const imgs = (data.data ?? [])
              .slice(0, 3)
              .map(c => c.image_uris?.small || c.card_faces?.[0]?.image_uris?.small)
              .filter(Boolean);
            setCardImages(imgs);
          })
          .catch(() => {})
          .finally(() => setFetched(true));
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [set.code]);

  return (
    <div
      ref={tileRef}
      onClick={() => onSelect(set)}
      style={{
        cursor: "pointer",
        background: "rgba(201,185,154,0.04)",
        border: "0.5px solid rgba(201,185,154,0.15)",
        borderRadius: 10,
        padding: "1rem 1rem 0.875rem",
        display: "flex", flexDirection: "column", gap: 12,
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.09)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,185,154,0.04)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.15)"; }}
    >
      {/* Fan area */}
      <div style={{ position: "relative", height: 124, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        {fetched && cardImages.length > 0 ? (
          cardImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{
                position: "absolute",
                width: CARD_W,
                borderRadius: 5,
                boxShadow: "0 4px 16px rgba(0,0,0,0.65)",
                transform: `rotate(${ROTATIONS[i]}deg) translateX(${OFFSETS[i]}px)`,
                transformOrigin: "bottom center",
                bottom: 0,
                zIndex: i + 1,
              }}
            />
          ))
        ) : (
          <img
            src={set.icon_svg_uri}
            alt=""
            style={{ width: 40, height: 40, opacity: 0.18, filter: "invert(0.9) sepia(0.4)" }}
          />
        )}
      </div>

      {/* Set info */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#e8dcc8", lineHeight: 1.3, marginBottom: 3 }}>{set.name}</div>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.05em" }}>
          {set.released_at?.slice(0, 4)} · {set.card_count} cards
        </div>
      </div>
    </div>
  );
}
