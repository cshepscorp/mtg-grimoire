"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGrimoire } from "../../contexts/GrimoireContext";

function ArtistCard({ name, onBrowse, onRemove }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.scryfall.com/cards/search?q=artist%3A"${encodeURIComponent(name)}"&order=edhrec&unique=art`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled || !data?.data?.[0]) return;
        const card = data.data[0];
        const url = card.image_uris?.art_crop ?? card.card_faces?.[0]?.image_uris?.art_crop;
        if (url) setImageUrl(url);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [name]);

  return (
    <div
      onClick={onBrowse}
      style={{
        position: "relative", borderRadius: 10, overflow: "hidden",
        cursor: "pointer", aspectRatio: "4/3",
        background: "rgba(201,185,154,0.05)",
        border: "0.5px solid rgba(201,185,154,0.12)",
        transition: "border-color 0.2s, transform 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          onLoad={() => setLoaded(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
      }} />

      {/* Bottom bar: name + remove */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "10px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
      }}>
        <span style={{ fontSize: 13, color: "#e8dcc8", fontWeight: 600, letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          title="Remove from favorites"
          style={{
            background: "transparent", border: "none", color: "rgba(255,255,255,0.35)",
            fontSize: 16, cursor: "pointer", padding: "0 2px", lineHeight: 1,
            flexShrink: 0, fontFamily: "inherit", transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
        >×</button>
      </div>
    </div>
  );
}

export default function ArtistsTab() {
  const { favoriteArtists, toggleFavoriteArtist } = useGrimoire();
  const router = useRouter();

  if (favoriteArtists.length === 0) {
    return (
      <p style={{ color: "rgba(201,185,154,0.35)", fontStyle: "italic", fontSize: 13, marginTop: "3rem", textAlign: "center" }}>
        No favorite artists yet. Click ♡ next to an artist's name to save them here.
      </p>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 12, color: "rgba(201,185,154,0.4)", marginBottom: "1.5rem" }}>
        {favoriteArtists.length} artist{favoriteArtists.length !== 1 ? "s" : ""}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {favoriteArtists.map(name => (
          <ArtistCard
            key={name}
            name={name}
            onBrowse={() => router.push(`/explore?openArtist=${encodeURIComponent(name)}`)}
            onRemove={() => toggleFavoriteArtist(name)}
          />
        ))}
      </div>
    </div>
  );
}
