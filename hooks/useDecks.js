import { useState, useEffect, useCallback } from "react";

const KEY = "grimoire_decks";

export default function useDecks() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setDecks(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (next) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const saveDeck = useCallback((deck) => {
    setDecks(prev => {
      const now = new Date().toISOString();
      const existing = prev.find(d => d.id === deck.id);
      let next;
      if (existing) {
        next = prev.map(d => d.id === deck.id ? { ...deck, updatedAt: now } : d);
      } else {
        next = [{ ...deck, id: deck.id ?? crypto.randomUUID(), createdAt: now, updatedAt: now }, ...prev];
      }
      persist(next);
      return next;
    });
  }, []);

  const deleteDeck = useCallback((deckId) => {
    setDecks(prev => {
      const next = prev.filter(d => d.id !== deckId);
      persist(next);
      return next;
    });
  }, []);

  const updateDeck = useCallback((deckId, changes) => {
    setDecks(prev => {
      const next = prev.map(d => d.id === deckId ? { ...d, ...changes, updatedAt: new Date().toISOString() } : d);
      persist(next);
      return next;
    });
  }, []);

  return { decks, saveDeck, deleteDeck, updateDeck };
}
