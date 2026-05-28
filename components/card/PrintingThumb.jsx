export default function PrintingThumb({ card, active, onClick }) {
  const thumb = card.image_uris?.small;
  if (!thumb) return null;
  return (
    <div onClick={onClick} style={{
      flexShrink: 0, width: 52, borderRadius: 4, overflow: "hidden",
      cursor: "pointer",
      border: active ? "2px solid #c9b99a" : "2px solid transparent",
      opacity: active ? 1 : 0.55,
      transition: "opacity 0.15s, border-color 0.15s",
    }}>
      <img src={thumb} alt={card.set_name} style={{ width: "100%", display: "block" }} />
    </div>
  );
}
