import { useState, useEffect, useCallback } from "react";

const KEY = "grimoire_favorites";

const slim = (card) => ({
  id: card.id,
  name: card.name,
  set: card.set,
  set_name: card.set_name,
  collector_number: card.collector_number,
  colors: card.colors ?? [],
  color_identity: card.color_identity ?? [],
  image_uri: card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? null,
});

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  const addFavorite = useCallback((card) => {
    setFavorites(prev => {
      if (prev.some(c => c.id === card.id)) return prev;
      const next = [slim(card), ...prev];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const removeFavorite = useCallback((cardId) => {
    setFavorites(prev => {
      const next = prev.filter(c => c.id !== cardId);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback((cardId) => {
    return favorites.some(c => c.id === cardId);
  }, [favorites]);

  const toggleFavorite = useCallback((card) => {
    setFavorites(prev => {
      const exists = prev.some(c => c.id === card.id);
      const next = exists ? prev.filter(c => c.id !== card.id) : [slim(card), ...prev];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
