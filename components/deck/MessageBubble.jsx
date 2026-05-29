"use client";

import { parseDeckJson } from "../../utils/deckUtils";
import DeckList from "./DeckList";

export default function MessageBubble({ msg, onCopy, copied, onSaveDeck }) {
  const deckData = msg.role === "assistant" ? parseDeckJson(msg.content) : null;

  // Strip the json block from prose if deck was parsed
  const prose = deckData
    ? msg.content.replace(/```json\n[\s\S]*?\n```/, "").trim()
    : msg.content;

  return (
    <div style={{ marginBottom: 16 }}>
      {msg.role === "user" ? (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            maxWidth: "80%", padding: "8px 12px", borderRadius: "12px 12px 2px 12px",
            background: "rgba(201,185,154,0.12)", border: "0.5px solid rgba(201,185,154,0.2)",
            fontSize: 13, color: "#e8dcc8", lineHeight: 1.6,
          }}>{msg.content}</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 10, color: "rgba(201,185,154,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            Grimoire
          </div>
          {prose && (
            <div style={{ fontSize: 13, color: "rgba(201,185,154,0.8)", lineHeight: 1.8 }}>
              {prose}
            </div>
          )}
          {deckData && <DeckList deckData={deckData} onCopy={onCopy} copied={copied} onSaveDeck={onSaveDeck} />}
        </div>
      )}
    </div>
  );
}
