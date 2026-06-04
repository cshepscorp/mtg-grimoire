import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createClient } from "../lib/supabase/client";

const KEY = "grimoire_decks";

export default function useDecks() {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem(KEY);
        setDecks(stored ? JSON.parse(stored) : []);
      } catch { setDecks([]); }
      return;
    }

    createClient()
      .from("user_decks")
      .select("data")
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) return;
        if (data.length > 0) {
          setDecks(data.map(r => r.data));
        } else {
          // Migrate localStorage on first login
          try {
            const stored = localStorage.getItem(KEY);
            if (!stored) return;
            const items = JSON.parse(stored);
            if (!items.length) return;
            setDecks(items);
            createClient().from("user_decks")
              .upsert(items.map(d => ({ id: d.id, user_id: user.id, data: d, updated_at: d.updatedAt ?? new Date().toISOString() })))
              .then();
          } catch {}
        }
      });
  }, [user?.id]);

  const persist = (next) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const saveDeck = useCallback((deck) => {
    const now = new Date().toISOString();
    const existing = decks.find(d => d.id === deck.id);
    const updated = existing
      ? { ...deck, updatedAt: now }
      : { ...deck, id: deck.id ?? crypto.randomUUID(), createdAt: now, updatedAt: now };
    const next = existing
      ? decks.map(d => d.id === deck.id ? updated : d)
      : [updated, ...decks];
    setDecks(next);
    persist(next);
    if (user) {
      createClient().from("user_decks")
        .upsert({ id: updated.id, user_id: user.id, data: updated, updated_at: now })
        .then();
    }
  }, [user, decks]);

  const deleteDeck = useCallback((deckId) => {
    const next = decks.filter(d => d.id !== deckId);
    setDecks(next);
    persist(next);
    if (user) {
      createClient().from("user_decks")
        .delete().eq("id", deckId).eq("user_id", user.id)
        .then();
    }
  }, [user, decks]);

  const updateDeck = useCallback((deckId, changes) => {
    const now = new Date().toISOString();
    const next = decks.map(d => d.id === deckId ? { ...d, ...changes, updatedAt: now } : d);
    setDecks(next);
    persist(next);
    if (user) {
      const updated = next.find(d => d.id === deckId);
      if (updated) {
        createClient().from("user_decks")
          .upsert({ id: deckId, user_id: user.id, data: updated, updated_at: now })
          .then();
      }
    }
  }, [user, decks]);

  return { decks, saveDeck, deleteDeck, updateDeck };
}
