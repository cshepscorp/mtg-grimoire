"use client";

import { FORMATS, RARITIES, BUDGETS, PLAYSTYLES } from "../../utils/deckUtils";

export default function ConfigPanel({ config, onChange, card, onStart }) {
  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto", flex: 1 }}>
      <div>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
          Building around
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e8dcc8" }}>{card.name}</div>
        <div style={{ fontSize: 12, color: "rgba(201,185,154,0.5)", marginTop: 2 }}>{card.type_line}</div>
      </div>

      {/* Commander toggle */}
      <div>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
          Mode
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[false, true].map((isCmd) => (
            <button key={String(isCmd)} type="button" onClick={() => onChange({ ...config, isCommander: isCmd, format: isCmd ? "Commander" : config.format === "Commander" ? "Modern" : config.format })} style={{
              flex: 1, padding: "8px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 12,
              background: config.isCommander === isCmd ? "rgba(201,185,154,0.15)" : "transparent",
              border: "0.5px solid " + (config.isCommander === isCmd ? "rgba(201,185,154,0.5)" : "rgba(201,185,154,0.15)"),
              color: config.isCommander === isCmd ? "#c9b99a" : "rgba(201,185,154,0.5)",
              transition: "all 0.15s",
            }}>
              {isCmd ? "Commander (99)" : "Constructed (60)"}
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      {!config.isCommander && (
        <div>
          <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
            Format
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FORMATS.filter(f => f !== "Commander").map((f) => (
              <button key={f} type="button" onClick={() => onChange({ ...config, format: f })} style={{
                padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 12,
                background: config.format === f ? "rgba(201,185,154,0.15)" : "transparent",
                border: "0.5px solid " + (config.format === f ? "rgba(201,185,154,0.5)" : "rgba(201,185,154,0.15)"),
                color: config.format === f ? "#c9b99a" : "rgba(201,185,154,0.5)",
                transition: "all 0.15s",
              }}>{f}</button>
            ))}
          </div>
        </div>
      )}

      {/* Rarities */}
      <div>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
          Allowed Rarities
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {RARITIES.map((r) => {
            const active = config.rarities.includes(r);
            return (
              <button key={r} type="button" onClick={() => {
                const next = active ? config.rarities.filter(x => x !== r) : [...config.rarities, r];
                if (next.length > 0) onChange({ ...config, rarities: next });
              }} style={{
                padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 12,
                background: active ? "rgba(201,185,154,0.15)" : "transparent",
                border: "0.5px solid " + (active ? "rgba(201,185,154,0.5)" : "rgba(201,185,154,0.15)"),
                color: active ? "#c9b99a" : "rgba(201,185,154,0.5)",
                transition: "all 0.15s",
              }}>{r}</button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
          Budget
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {BUDGETS.map((b) => (
            <button key={b} type="button" onClick={() => onChange({ ...config, budget: b })} style={{
              flex: 1, padding: "6px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 12,
              background: config.budget === b ? "rgba(201,185,154,0.15)" : "transparent",
              border: "0.5px solid " + (config.budget === b ? "rgba(201,185,154,0.5)" : "rgba(201,185,154,0.15)"),
              color: config.budget === b ? "#c9b99a" : "rgba(201,185,154,0.5)",
              transition: "all 0.15s",
            }}>{b}</button>
          ))}
        </div>
      </div>

      {/* Playstyle */}
      <div>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
          Playstyle
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PLAYSTYLES.map((p) => (
            <button key={p} type="button" onClick={() => onChange({ ...config, playstyle: p })} style={{
              flex: 1, padding: "6px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 12,
              background: config.playstyle === p ? "rgba(201,185,154,0.15)" : "transparent",
              border: "0.5px solid " + (config.playstyle === p ? "rgba(201,185,154,0.5)" : "rgba(201,185,154,0.15)"),
              color: config.playstyle === p ? "#c9b99a" : "rgba(201,185,154,0.5)",
              transition: "all 0.15s",
            }}>{p}</button>
          ))}
        </div>
      </div>

      <button onClick={onStart} style={{
        marginTop: "auto", padding: "12px", borderRadius: 8,
        background: "rgba(201,185,154,0.15)", border: "0.5px solid rgba(201,185,154,0.4)",
        color: "#c9b99a", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif",
        fontWeight: 600, letterSpacing: "0.05em",
        transition: "background 0.15s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(201,185,154,0.25)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(201,185,154,0.15)"}
      >
        Start Building →
      </button>
    </div>
  );
}
