import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createClient } from "../lib/supabase/client";

const KEY = "grimoire_collection";

export default function useCollection() {
  const { user } = useAuth();
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem(KEY);
        setCollection(stored ? JSON.parse(stored) : []);
      } catch { setCollection([]); }
      return;
    }

    createClient()
      .from("user_collection")
      .select("card_id, card_data, quantity_owned")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) return;
        if (data.length > 0) {
          setCollection(data.map(r => ({ ...r.card_data, cardId: r.card_id, quantityOwned: r.quantity_owned })));
        } else {
          // Migrate localStorage on first login
          try {
            const stored = localStorage.getItem(KEY);
            if (!stored) return;
            const items = JSON.parse(stored);
            if (!items.length) return;
            setCollection(items);
            createClient().from("user_collection")
              .upsert(items.map(c => ({ user_id: user.id, card_id: c.cardId, card_data: c, quantity_owned: c.quantityOwned })), { onConflict: "user_id,card_id" })
              .then();
          } catch {}
        }
      });
  }, [user?.id]);

  const persist = (next) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const addToCollection = useCallback((card, quantity = 1) => {
    const existing = collection.find(c => c.cardId === card.id);
    let next;
    if (existing) {
      next = collection.map(c => c.cardId === card.id ? { ...c, quantityOwned: c.quantityOwned + quantity } : c);
      if (user) {
        createClient().from("user_collection")
          .update({ quantity_owned: existing.quantityOwned + quantity })
          .eq("user_id", user.id).eq("card_id", card.id)
          .then();
      }
    } else {
      const entry = {
        id: crypto.randomUUID(),
        cardId: card.id,
        cardName: card.name,
        setCode: card.set?.toUpperCase(),
        setName: card.set_name,
        collectorNumber: card.collector_number,
        colors: card.colors ?? [],
        colorIdentity: card.color_identity ?? [],
        imageUri: card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? null,
        quantityOwned: quantity,
      };
      next = [entry, ...collection];
      if (user) {
        createClient().from("user_collection")
          .upsert({ user_id: user.id, card_id: card.id, card_data: entry, quantity_owned: quantity }, { onConflict: "user_id,card_id" })
          .then();
      }
    }
    setCollection(next);
    persist(next);
  }, [user, collection]);

  const removeFromCollection = useCallback((cardId) => {
    const next = collection.filter(c => c.cardId !== cardId);
    setCollection(next);
    persist(next);
    if (user) {
      createClient().from("user_collection")
        .delete().eq("user_id", user.id).eq("card_id", cardId)
        .then();
    }
  }, [user, collection]);

  const updateQuantity = useCallback((cardId, quantity) => {
    const next = quantity <= 0
      ? collection.filter(c => c.cardId !== cardId)
      : collection.map(c => c.cardId === cardId ? { ...c, quantityOwned: quantity } : c);
    setCollection(next);
    persist(next);
    if (user) {
      const sb = createClient();
      if (quantity <= 0) {
        sb.from("user_collection").delete().eq("user_id", user.id).eq("card_id", cardId).then();
      } else {
        sb.from("user_collection").update({ quantity_owned: quantity }).eq("user_id", user.id).eq("card_id", cardId).then();
      }
    }
  }, [user, collection]);

  const isOwned = useCallback((cardId) => {
    return collection.some(c => c.cardId === cardId);
  }, [collection]);

  return { collection, addToCollection, removeFromCollection, updateQuantity, isOwned };
}
