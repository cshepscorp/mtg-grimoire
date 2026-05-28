"use client";

import { useState } from "react";

export default function NavArrow({ direction, onClick, visible, sidebarWidth }) {
  const [hovered, setHovered] = useState(false);
  if (!visible) return null;
  return (
    <>
      <style>{`@media (max-width: 640px) { .grimoire-nav-arrow { display: none !important; } }`}</style>
      <button
        className="grimoire-nav-arrow"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={direction === "prev" ? "Previous card" : "Next card"}
        style={{
          position: "fixed",
          top: "50%",
          transform: "translateY(-50%)",
          [direction === "prev" ? "left" : "right"]: direction === "prev" ? sidebarWidth + 12 : 12,
          width: 40, height: 40,
          borderRadius: "50%",
          background: hovered ? "rgba(201,185,154,0.15)" : "rgba(201,185,154,0.05)",
          border: "0.5px solid " + (hovered ? "rgba(201,185,154,0.5)" : "rgba(201,185,154,0.2)"),
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s, border-color 0.2s",
          zIndex: 20,
        }}
      >
        <span style={{
          fontSize: 22,
          color: hovered ? "#c9b99a" : "rgba(201,185,154,0.4)",
          transition: "color 0.2s",
          userSelect: "none",
          lineHeight: 1,
        }}>
          {direction === "prev" ? "‹" : "›"}
        </span>
      </button>
    </>
  );
}
