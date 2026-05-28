"use client";

import { useState, useRef, useEffect } from "react";

const FORMATS = ["Standard", "Modern", "Legacy", "Commander"];
const RARITIES = ["Common", "Uncommon", "Rare", "Mythic"];
const BUDGETS = ["Budget", "Moderate", "No limit"];
const PLAYSTYLES = ["Aggro", "Control", "Midrange", "Combo"];

function ConfigPanel({ config, onChange, card, onStart }) {
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

function DeckList({ deckData, onCopy, copied }) {
  // Deduplicate cards by name+category in case AI returns multiples
  const deduped = Object.values(
    deckData.cards.reduce((acc, c) => {
      const key = `${c.category}__${c.name}`;
      if (acc[key]) acc[key] = { ...acc[key], quantity: acc[key].quantity + c.quantity };
      else acc[key] = { ...c };
      return acc;
    }, {})
  );

  const categories = [...new Set(deduped.map(c => c.category))];
  const categoryOrder = ["Creatures", "Spells", "Artifacts", "Enchantments", "Planeswalkers", "Lands"];
  const sorted = categoryOrder.filter(c => categories.includes(c));
  const total = deduped.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div style={{
      margin: "12px 0", borderRadius: 10,
      border: "0.5px solid rgba(201,185,154,0.2)",
      background: "rgba(201,185,154,0.04)",
      overflow: "hidden",
    }}>
      {/* Deck header */}
      <div style={{ padding: "12px 16px", borderBottom: "0.5px solid rgba(201,185,154,0.15)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e8dcc8" }}>{deckData.deckName}</div>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.5)", marginTop: 4 }}>{deckData.description}</div>
        <div style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", marginTop: 4 }}>{total} cards</div>
      </div>

      {/* Card list by category */}
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {sorted.map(cat => {
          const cards = deduped.filter(c => c.category === cat);
          const catTotal = cards.reduce((s, c) => s + c.quantity, 0);
          return (
            <div key={cat}>
              <div style={{ fontSize: 10, color: "rgba(201,185,154,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                {cat} ({catTotal})
              </div>
              {cards.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: "0.5px solid rgba(201,185,154,0.06)" }}>
                  <span style={{ fontSize: 12, color: "#c9b99a" }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", fontVariantNumeric: "tabular-nums" }}>×{c.quantity}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Copy button */}
      <div style={{ padding: "10px 16px", borderTop: "0.5px solid rgba(201,185,154,0.15)" }}>
        <button onClick={onCopy} style={{
          width: "100%", padding: "8px", borderRadius: 6,
          background: copied ? "rgba(100,180,100,0.15)" : "rgba(201,185,154,0.08)",
          border: "0.5px solid " + (copied ? "rgba(100,180,100,0.4)" : "rgba(201,185,154,0.2)"),
          color: copied ? "rgba(100,200,100,0.9)" : "rgba(201,185,154,0.6)",
          fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.2s",
        }}>
          {copied ? "✓ Copied to clipboard" : "Copy deck list"}
        </button>
      </div>
    </div>
  );
}

function parseDeckJson(text) {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

function MessageBubble({ msg, onCopy, copied }) {
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
            <div style={{ fontSize: 13, color: "rgba(201,185,154,0.8)", lineHeight: 1.8, marginBottom: deckData ? 0 : 0 }}>
              {prose}
            </div>
          )}
          {deckData && <DeckList deckData={deckData} onCopy={onCopy} copied={copied} />}
        </div>
      )}
    </div>
  );
}

export default function DeckChat({ card, isOpen, onClose }) {
  const [phase, setPhase] = useState("config"); // "config" | "chat"
  const [config, setConfig] = useState({
    format: "Modern",
    isCommander: false,
    rarities: ["Common", "Uncommon", "Rare", "Mythic"],
    budget: "Moderate",
    playstyle: "Midrange",
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Reset when card changes only if not mid-conversation
  const lastCardRef = useRef(null);
  useEffect(() => {
    if (card?.name !== lastCardRef.current) {
      lastCardRef.current = card?.name;
      // Don't auto-reset — user keeps their conversation
    }
  }, [card]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (phase === "chat" && isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [phase, isOpen]);

  const handleClear = () => {
    setMessages([]);
    setPhase("config");
    setShowClearConfirm(false);
  };

  const handleStart = async () => {
    setPhase("chat");
    setLoading(true);
    const openingMessage = {
      role: "user",
      content: `I want to build a ${config.isCommander ? "Commander" : "60-card " + config.format} deck around ${card.name}. Playstyle: ${config.playstyle}. Budget: ${config.budget}. Allowed rarities: ${config.rarities.join(", ")}. Please suggest a strategy and then build me a complete deck list.`,
    };
    setMessages([openingMessage]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [openingMessage], card, config }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, card, config }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    const deckMessages = messages.filter(m => m.role === "assistant" && parseDeckJson(m.content));
    if (!deckMessages.length) return;
    const deckData = parseDeckJson(deckMessages[deckMessages.length - 1].content);
    if (!deckData) return;

    // Deduplicate
    const deduped = Object.values(
      deckData.cards.reduce((acc, c) => {
        const key = `${c.category}__${c.name}`;
        if (acc[key]) acc[key] = { ...acc[key], quantity: acc[key].quantity + c.quantity };
        else acc[key] = { ...c };
        return acc;
      }, {})
    );

    const lines = [`// ${deckData.deckName}`, `// ${deckData.description}`, ""];
    const categoryOrder = ["Creatures", "Spells", "Artifacts", "Enchantments", "Planeswalkers", "Lands"];
    const categories = [...new Set(deduped.map(c => c.category))];
    const sorted = categoryOrder.filter(c => categories.includes(c));
    sorted.forEach(cat => {
      lines.push(`// ${cat}`);
      deduped.filter(c => c.category === cat).forEach(c => {
        lines.push(`${c.quantity} ${c.name}`);
      });
      lines.push("");
    });

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

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

            {/* Input */}
            <div style={{
              padding: "1rem 1.25rem",
              borderTop: "0.5px solid rgba(201,185,154,0.15)",
              display: "flex", gap: 8, flexShrink: 0,
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Make it more aggressive, swap the lands..."
                style={{
                  flex: 1, background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(201,185,154,0.2)",
                  borderRadius: 8, padding: "10px 14px",
                  color: "#e8dcc8", fontSize: 13, fontFamily: "Georgia, serif",
                  outline: "none",
                }}
              />
              <button onClick={handleSend} disabled={loading || !input.trim()} style={{
                background: "rgba(201,185,154,0.12)", border: "0.5px solid rgba(201,185,154,0.3)",
                borderRadius: 8, padding: "10px 16px", color: "#c9b99a",
                fontSize: 13, cursor: loading ? "default" : "pointer",
                fontFamily: "inherit", opacity: loading || !input.trim() ? 0.4 : 1,
                transition: "opacity 0.15s",
              }}>Send</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}