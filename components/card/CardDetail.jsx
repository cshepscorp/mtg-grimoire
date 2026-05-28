import { parseMana, replaceSymbols } from "./ManaPip";
import ClickableBadge from "./ClickableBadge";

export default function CardDetail({ card, lore, loreLoading, onOpenFilter, onOpenDeckChat }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#e8dcc8", lineHeight: 1.2 }}>{card.name}</div>
        <div style={{ fontSize: 13, color: "rgba(201,185,154,0.55)", marginTop: 6, letterSpacing: "0.04em" }}>{card.type_line}</div>
      </div>

      {card.mana_cost && (
        <div>
          <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Mana Cost</div>
          {parseMana(card.mana_cost)}
        </div>
      )}

      {card.oracle_text && (
        <div style={{ borderLeft: "2px solid rgba(201,185,154,0.2)", paddingLeft: 16 }}>
          {card.oracle_text.split("\n").map((line, i, arr) => (
            <div key={i} style={{ fontSize: 13, color: "#c9b99a", lineHeight: 1.8, marginBottom: i < arr.length - 1 ? 8 : 0 }}>
              {replaceSymbols(line)}
            </div>
          ))}
        </div>
      )}

      {card.flavor_text && (
        <div style={{ fontSize: 12, color: "rgba(201,185,154,0.55)", fontStyle: "italic", lineHeight: 1.8 }}>
          "{card.flavor_text}"
        </div>
      )}

      {card.power && (
        <div style={{
          display: "inline-flex", alignItems: "center",
          fontSize: 17, fontWeight: 700, color: "#e8dcc8",
          background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.25)",
          borderRadius: 6, padding: "4px 14px", alignSelf: "flex-start",
        }}>{card.power}/{card.toughness}</div>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {card.set_name && (
          <ClickableBadge onClick={() => onOpenFilter("Set", card.set_name, `e:${card.set}`)}>
            {card.set_name}
          </ClickableBadge>
        )}
        {card.rarity && (
          <ClickableBadge onClick={() => onOpenFilter("Rarity", card.rarity, `r:${card.rarity}`)}>
            {card.rarity}
          </ClickableBadge>
        )}
        {card.cmc > 0 && (
          <ClickableBadge onClick={() => onOpenFilter("Mana Value", `CMC ${card.cmc}`, `cmc:${card.cmc}`)}>
            CMC {card.cmc}
          </ClickableBadge>
        )}
      </div>

      <div style={{ borderTop: "0.5px solid rgba(201,185,154,0.12)", paddingTop: 20 }}>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Codex Entry</div>
        <div style={{ fontSize: 13, lineHeight: 1.8, fontStyle: "italic", color: loreLoading ? "rgba(201,185,154,0.25)" : "rgba(201,185,154,0.75)" }}>
          {loreLoading ? "Consulting the archives..." : lore}
        </div>
      </div>

      <button
        onClick={onOpenDeckChat}
        style={{
          marginTop: 8, padding: "10px 16px", borderRadius: 8, width: "100%",
          background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.25)",
          color: "#c9b99a", fontSize: 13, cursor: "pointer",
          fontFamily: "Georgia, serif", letterSpacing: "0.05em",
          transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.15)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,185,154,0.08)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.25)"; }}
      >
        ✦ Build a Deck Around This Card
      </button>
    </div>
  );
}
