"use client";

export default function ChatInput({ value, onChange, onSend, loading, inputRef }) {
  return (
    <div style={{
      padding: "1rem 1.25rem",
      borderTop: "0.5px solid rgba(201,185,154,0.15)",
      display: "flex", gap: 8, flexShrink: 0,
    }}>
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder="Make it more aggressive, swap the lands..."
        style={{
          flex: 1, background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(201,185,154,0.2)",
          borderRadius: 8, padding: "10px 14px",
          color: "#e8dcc8", fontSize: 16, fontFamily: "Georgia, serif",
          outline: "none",
        }}
      />
      <button onClick={onSend} disabled={loading || !value.trim()} style={{
        background: "rgba(201,185,154,0.12)", border: "0.5px solid rgba(201,185,154,0.3)",
        borderRadius: 8, padding: "10px 16px", color: "#c9b99a",
        fontSize: 13, cursor: loading ? "default" : "pointer",
        fontFamily: "inherit", opacity: loading || !value.trim() ? 0.4 : 1,
        transition: "opacity 0.15s",
      }}>Send</button>
    </div>
  );
}
