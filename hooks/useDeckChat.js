import { useState, useRef, useEffect } from "react";
import { parseDeckJson, deduplicateDeck } from "../utils/deckUtils";

const CATEGORY_ORDER = ["Creatures", "Spells", "Artifacts", "Enchantments", "Planeswalkers", "Lands"];

export default function useDeckChat({ card, isOpen }) {
  const [phase, setPhase] = useState("config");
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

    const deduped = deduplicateDeck(deckData.cards);
    const lines = [`// ${deckData.deckName}`, `// ${deckData.description}`, ""];
    const categories = [...new Set(deduped.map(c => c.category))];
    const sorted = CATEGORY_ORDER.filter(c => categories.includes(c));
    sorted.forEach(cat => {
      lines.push(`// ${cat}`);
      deduped.filter(c => c.category === cat).forEach(c => lines.push(`${c.quantity} ${c.name}`));
      lines.push("");
    });

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return {
    phase, config, setConfig,
    messages,
    input, setInput,
    loading, copied,
    showClearConfirm, setShowClearConfirm,
    bottomRef, inputRef,
    handleClear, handleStart, handleSend, handleCopy,
  };
}
