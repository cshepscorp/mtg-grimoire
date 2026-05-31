"use client";

import { useRouter } from "next/navigation";
import { useGrimoire } from "../../contexts/GrimoireContext";

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
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {favoriteArtists.map(name => (
          <div
            key={name}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "0.5px solid rgba(201,185,154,0.06)" }}
          >
            <div
              style={{ flex: 1, fontSize: 14, color: "#c9b99a", cursor: "pointer", transition: "color 0.15s" }}
              onClick={() => router.push(`/?openArtist=${encodeURIComponent(name)}`)}
              onMouseEnter={e => e.currentTarget.style.color = "#e8dcc8"}
              onMouseLeave={e => e.currentTarget.style.color = "#c9b99a"}
            >
              {name}
            </div>
            <button
              onClick={() => router.push(`/?openArtist=${encodeURIComponent(name)}`)}
              style={{
                background: "transparent", border: "0.5px solid rgba(201,185,154,0.2)",
                borderRadius: 5, padding: "5px 12px", color: "rgba(201,185,154,0.5)",
                fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.45)"; e.currentTarget.style.color = "#c9b99a"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.2)"; e.currentTarget.style.color = "rgba(201,185,154,0.5)"; }}
            >Browse cards →</button>
            <button
              onClick={() => toggleFavoriteArtist(name)}
              title="Remove from favorites"
              style={{ background: "transparent", border: "none", color: "rgba(201,185,154,0.25)", fontSize: 16, cursor: "pointer", padding: "0 4px", fontFamily: "inherit", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.6)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.25)"}
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
