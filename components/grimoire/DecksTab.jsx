"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGrimoire } from "../../contexts/GrimoireContext";

export default function DecksTab() {
  const { decks, deleteDeck } = useGrimoire();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 12, color: "rgba(201,185,154,0.4)" }}>
          {decks.length} deck{decks.length !== 1 ? "s" : ""}
        </div>
        <button
          onClick={() => router.push("/deck/new")}
          style={{
            background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.3)",
            borderRadius: 6, padding: "8px 16px", color: "#c9b99a",
            fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.15)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,185,154,0.08)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.3)"; }}
        >+ New Deck</button>
      </div>

      {decks.length === 0 ? (
        <p style={{ color: "rgba(201,185,154,0.35)", fontStyle: "italic", fontSize: 13, textAlign: "center", padding: "2rem 0" }}>
          No decks yet. Save a generated deck or build one from scratch.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {decks.map(deck => (
            <div
              key={deck.id}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "0.5px solid rgba(201,185,154,0.06)" }}
            >
              <div
                style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                onClick={() => router.push(`/deck/${deck.id}`)}
              >
                <div style={{ fontSize: 14, color: "#c9b99a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {deck.name}
                </div>
                <div style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", marginTop: 3, display: "flex", gap: 10 }}>
                  {deck.format && <span>{deck.format}</span>}
                  {deck.cards?.length > 0 && <span>{deck.cards.reduce((s, c) => s + (c.quantity || 1), 0)} cards</span>}
                  {deck.sourceCard && <span>Around {deck.sourceCard}</span>}
                </div>
              </div>

              <button
                onClick={() => router.push(`/deck/${deck.id}`)}
                style={{
                  background: "transparent", border: "0.5px solid rgba(201,185,154,0.2)",
                  borderRadius: 5, padding: "5px 12px", color: "rgba(201,185,154,0.5)",
                  fontSize: 11, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.45)"; e.currentTarget.style.color = "#c9b99a"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,185,154,0.2)"; e.currentTarget.style.color = "rgba(201,185,154,0.5)"; }}
              >Edit →</button>

              {confirmDelete === deck.id ? (
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "rgba(201,185,154,0.5)" }}>Delete?</span>
                  <button
                    onClick={() => { deleteDeck(deck.id); setConfirmDelete(null); }}
                    style={{ background: "rgba(220,100,80,0.15)", border: "0.5px solid rgba(220,100,80,0.3)", borderRadius: 4, padding: "3px 8px", color: "rgba(220,120,100,0.9)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
                  >Yes</button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    style={{ background: "transparent", border: "0.5px solid rgba(201,185,154,0.2)", borderRadius: 4, padding: "3px 8px", color: "rgba(201,185,154,0.5)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
                  >No</button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(deck.id)}
                  style={{ background: "transparent", border: "none", color: "rgba(201,185,154,0.25)", fontSize: 16, cursor: "pointer", padding: "0 4px", fontFamily: "inherit", flexShrink: 0, transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(201,185,154,0.6)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(201,185,154,0.25)"}
                >×</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
