"use client";

import ColorTile from "./ColorTile";
import { MONO_COLORS, GUILD_COLORS, SHARD_COLORS, WEDGE_COLORS } from "../../utils/colorData";
import styles from "./ColorBrowser.module.css";

export default function ColorBrowser({ onSelectColor }) {
  return (
    <div className={styles.container} style={{ padding: "2.5rem 4rem" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#e8dcc8", marginBottom: 4 }}>Colors</div>
        <div style={{ fontSize: 12, color: "rgba(201,185,154,0.45)" }}>Browse cards by color identity</div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Mono</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
          {MONO_COLORS.map(color => (
            <ColorTile key={color.name} color={color} onSelect={onSelectColor} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Two-Color</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
          {GUILD_COLORS.map(color => (
            <ColorTile key={color.name} color={color} onSelect={onSelectColor} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Shards</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
          {SHARD_COLORS.map(color => (
            <ColorTile key={color.name} color={color} onSelect={onSelectColor} />
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, color: "rgba(201,185,154,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Wedges</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
          {WEDGE_COLORS.map(color => (
            <ColorTile key={color.name} color={color} onSelect={onSelectColor} />
          ))}
        </div>
      </div>
    </div>
  );
}
