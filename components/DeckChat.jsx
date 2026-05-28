"use client";

import useDeckChat from "../hooks/useDeckChat";
import ConfigPanel from "./deck/ConfigPanel";
import MessageBubble from "./deck/MessageBubble";
import ChatInput from "./deck/ChatInput";

export default function DeckChat({ card, isOpen, onClose }) {
  const {
    phase, config, setConfig,
    messages,
    input, setInput,
    loading, copied,
    showClearConfirm, setShowClearConfirm,
    bottomRef, inputRef,
    handleClear, handleStart, handleSend, handleCopy,
  } = useDeckChat({ card, isOpen });

  if (!card) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.4)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(480px, 100vw)",
        background: "#0e0c09",
        borderLeft: "0.5px solid rgba(201,185,154,0.2)",
        zIndex: 50,
        display: "flex", flexDirection: "column",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>

        {/* Panel header */}
        <div style={{
          padding: "1rem 1.25rem",
          borderBottom: "0.5px solid rgba(201,185,154,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c9b99a", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Deck Builder
            </div>
            {phase === "chat" && (
              <div style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", marginTop: 2 }}>
                Around: {card.name}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {phase === "chat" && messages.length > 0 && (
              <>
                {showClearConfirm ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "rgba(201,185,154,0.5)" }}>Clear deck?</span>
                    <button onClick={handleClear} style={{
                      background: "rgba(220,100,100,0.15)", border: "0.5px solid rgba(220,100,100,0.3)",
                      borderRadius: 4, padding: "3px 8px", color: "rgba(220,120,120,0.9)",
                      fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                    }}>Yes</button>
                    <button onClick={() => setShowClearConfirm(false)} style={{
                      background: "transparent", border: "0.5px solid rgba(201,185,154,0.2)",
                      borderRadius: 4, padding: "3px 8px", color: "rgba(201,185,154,0.5)",
                      fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                    }}>No</button>
                  </div>
                ) : (
                  <button onClick={() => setShowClearConfirm(true)} style={{
                    background: "transparent", border: "0.5px solid rgba(201,185,154,0.15)",
                    borderRadius: 4, padding: "4px 10px", color: "rgba(201,185,154,0.4)",
                    fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  }}>Clear</button>
                )}
              </>
            )}
            <button onClick={onClose} style={{
              background: "transparent", border: "none",
              color: "rgba(201,185,154,0.4)", fontSize: 20,
              cursor: "pointer", lineHeight: 1, padding: "0 4px",
            }}>×</button>
          </div>
        </div>

        {/* Config phase */}
        {phase === "config" && (
          <ConfigPanel config={config} onChange={setConfig} card={card} onStart={handleStart} />
        )}

        {/* Chat phase */}
        {phase === "chat" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} onCopy={handleCopy} copied={copied} />
              ))}
              {loading && (
                <div style={{ fontSize: 12, color: "rgba(201,185,154,0.35)", fontStyle: "italic" }}>
                  Building your deck...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <ChatInput
              value={input}
              onChange={e => setInput(e.target.value)}
              onSend={handleSend}
              loading={loading}
              inputRef={inputRef}
            />
          </>
        )}
      </div>
    </>
  );
}