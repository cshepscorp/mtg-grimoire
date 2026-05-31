import { useState, useEffect, useCallback } from "react";

const KEY = "grimoire_collection";

export default function useCollection() {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setCollection(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (next) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const addToCollection = useCallback((card, quantity = 1) => {
    setCollection(prev => {
      const existing = prev.find(c => c.cardId === card.id);
      let next;
      if (existing) {
        next = prev.map(c => c.cardId === card.id
          ? { ...c, quantityOwned: c.quantityOwned + quantity }
          : c
        );
      } else {
        next = [{
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
        }, ...prev];
      }
      persist(next);
      return next;
    });
  }, []);

  const removeFromCollection = useCallback((cardId) => {
    setCollection(prev => {
      const next = prev.filter(c => c.cardId !== cardId);
      persist(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((cardId, quantity) => {
    setCollection(prev => {
      const next = quantity <= 0
        ? prev.filter(c => c.cardId !== cardId)
        : prev.map(c => c.cardId === cardId ? { ...c, quantityOwned: quantity } : c);
      persist(next);
      return next;
    });
  }, []);

  const isOwned = useCallback((cardId) => {
    return collection.some(c => c.cardId === cardId);
  }, [collection]);

  return { collection, addToCollection, removeFromCollection, updateQuantity, isOwned };
}
