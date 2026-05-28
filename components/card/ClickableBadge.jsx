export default function ClickableBadge({ children, onClick }) {
  return (
    <span onClick={onClick} style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 99,
      background: "rgba(255,255,255,0.06)", color: "#c9b99a",
      border: "0.5px solid rgba(201,185,154,0.2)",
      textTransform: "capitalize", letterSpacing: "0.03em",
      cursor: "pointer", transition: "background 0.15s, border-color 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,185,154,0.15)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(201,185,154,0.2)"; }}
    >{children}</span>
  );
}
