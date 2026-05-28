export default function MobileNav({ onPrev, onNext, canPrev, canNext, index, total }) {
  if (!canPrev && !canNext) return null;
  return (
    <>
      <style>{`@media (min-width: 641px) { .grimoire-mobile-nav { display: none !important; } }`}</style>
      <div className="grimoire-mobile-nav" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 24, gap: 12,
      }}>
        <button onClick={onPrev} disabled={!canPrev} style={{
          flex: 1, padding: "10px", borderRadius: 8,
          background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.2)",
          color: canPrev ? "#c9b99a" : "rgba(201,185,154,0.2)",
          fontSize: 13, cursor: canPrev ? "pointer" : "default", fontFamily: "inherit",
        }}>‹ Prev</button>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", whiteSpace: "nowrap" }}>
          {index + 1} / {total}
        </div>
        <button onClick={onNext} disabled={!canNext} style={{
          flex: 1, padding: "10px", borderRadius: 8,
          background: "rgba(201,185,154,0.08)", border: "0.5px solid rgba(201,185,154,0.2)",
          color: canNext ? "#c9b99a" : "rgba(201,185,154,0.2)",
          fontSize: 13, cursor: canNext ? "pointer" : "default", fontFamily: "inherit",
        }}>Next ›</button>
      </div>
    </>
  );
}
