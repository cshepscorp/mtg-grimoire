"use client";

import { useState } from "react";
import SetTile from "./SetTile";

const MAIN_TYPES = new Set(["core", "expansion", "masters", "draft_innovation", "commander", "funny"]);

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "expansion", label: "Expansion" },
  { key: "core", label: "Core" },
  { key: "commander", label: "Commander" },
  { key: "masters", label: "Masters" },
];

export default function SetBrowser({ sets, loading, onSelectSet }) {
  const [activeType, setActiveType] = useState("all");

  const visible = sets
    .filter(s => MAIN_TYPES.has(s.set_type))
    .filter(s => activeType === "all" || s.set_type === activeType)
    .sort((a, b) => new Date(b.released_at) - new Date(a.released_at));

  return (
    <div style={{ padding: "2.5rem 4rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#e8dcc8", marginBottom: 4 }}>Sets</div>
        <div style={{ fontSize: 12, color: "rgba(201,185,154,0.45)" }}>Browse cards by set</div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: "1.75rem", flexWrap: "wrap" }}>
        {FILTER_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveType(tab.key)} style={{
            padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 11,
            letterSpacing: "0.06em", textTransform: "uppercase",
            background: activeType === tab.key ? "rgba(201,185,154,0.15)" : "transparent",
            border: "0.5px solid " + (activeType === tab.key ? "rgba(201,185,154,0.4)" : "rgba(201,185,154,0.18)"),
            color: activeType === tab.key ? "#c9b99a" : "rgba(201,185,154,0.45)",
            transition: "all 0.15s",
          }}>{tab.label}</button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "5rem", color: "rgba(201,185,154,0.35)", fontSize: 13, letterSpacing: "0.12em" }}>
          Cataloguing the multiverse...
        </div>
      )}

      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
          {visible.map(set => (
            <SetTile key={set.code} set={set} onSelect={onSelectSet} />
          ))}
        </div>
      )}
    </div>
  );
}
