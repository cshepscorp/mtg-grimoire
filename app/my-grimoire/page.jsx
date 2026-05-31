"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import FavoritesTab from "../../components/grimoire/FavoritesTab";
import CollectionTab from "../../components/grimoire/CollectionTab";
import ArtistsTab from "../../components/grimoire/ArtistsTab";
import DecksTab from "../../components/grimoire/DecksTab";

const TABS = [
  { id: "favorites",  label: "Favorites" },
  { id: "collection", label: "Collection" },
  { id: "artists",    label: "Artists" },
  { id: "decks",      label: "Decks" },
];

export default function MyGrimoirePage() {
  return (
    <Suspense>
      <MyGrimoireContent />
    </Suspense>
  );
}

function MyGrimoireContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") ?? "favorites";

  return (
    <div style={{ minHeight: "100vh", background: "#0e0c09", color: "#e8dcc8", fontFamily: "Georgia, 'Times New Roman', serif", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{
        borderBottom: "0.5px solid rgba(201,185,154,0.15)",
        padding: "1.25rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, height: 72,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.14em", color: "#c9b99a", textTransform: "uppercase" }}>Grimoire</div>
            <div style={{ fontSize: 10, color: "rgba(201,185,154,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>Magic: The Gathering Explorer</div>
          </Link>
          <div style={{ fontSize: 10, color: "rgba(201,185,154,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>/ My Grimoire</div>
        </div>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            background: "rgba(201,185,154,0.06)", border: "0.5px solid rgba(201,185,154,0.25)",
            borderRadius: 6, padding: "8px 16px",
            color: "rgba(201,185,154,0.7)", fontSize: 12,
            fontFamily: "Georgia, serif", letterSpacing: "0.05em",
            transition: "background 0.15s, border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.12)"; e.currentTarget.style.color = "#c9b99a"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,185,154,0.06)"; e.currentTarget.style.color = "rgba(201,185,154,0.7)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.25)"; }}
        >← Explorer</Link>
      </header>

      {/* Tab bar */}
      <div style={{ borderBottom: "0.5px solid rgba(201,185,154,0.12)", padding: "0 2rem", display: "flex", flexShrink: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => router.push(`/my-grimoire?tab=${tab.id}`, { scroll: false })}
            style={{
              background: "transparent", border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #c9b99a" : "2px solid transparent",
              padding: "14px 20px",
              color: activeTab === tab.id ? "#c9b99a" : "rgba(201,185,154,0.4)",
              fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              letterSpacing: "0.1em", textTransform: "uppercase",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = "rgba(201,185,154,0.7)"; }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = "rgba(201,185,154,0.4)"; }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "2.5rem 2rem", maxWidth: 1100, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {activeTab === "favorites"  && <FavoritesTab />}
        {activeTab === "collection" && <CollectionTab />}
        {activeTab === "artists"    && <ArtistsTab />}
        {activeTab === "decks"      && <DecksTab />}
      </main>
    </div>
  );
}
