import { useState, useEffect, useCallback } from "react";

const KEY = "grimoire_favorites";

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = useCallback((next) => {
    setFavorites(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }, []);

  const addFavorite = useCallback((card) => {
    setFavorites(prev => {
      if (prev.some(c => c.id === card.id)) return prev;
      const next = [card, ...prev];
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
      const next = exists ? prev.filter(c => c.id !== card.id) : [card, ...prev];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
