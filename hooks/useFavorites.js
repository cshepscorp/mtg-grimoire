import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createClient } from "../lib/supabase/client";

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
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem(KEY);
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch { setFavorites([]); }
      return;
    }

    createClient()
      .from("user_favorite_cards")
      .select("card_data")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) return;
        if (data.length > 0) {
          setFavorites(data.map(r => r.card_data));
        } else {
          // Migrate localStorage data on first login
          try {
            const stored = localStorage.getItem(KEY);
            if (!stored) return;
            const items = JSON.parse(stored);
            if (!items.length) return;
            setFavorites(items);
            createClient().from("user_favorite_cards")
              .upsert(items.map(c => ({ user_id: user.id, card_id: c.id, card_data: c })), { onConflict: "user_id,card_id" })
              .then();
          } catch {}
        }
      });
  }, [user?.id]);

  const addFavorite = useCallback((card) => {
    if (favorites.some(c => c.id === card.id)) return;
    const slimCard = slim(card);
    const next = [slimCard, ...favorites];
    setFavorites(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    if (user) {
      createClient().from("user_favorite_cards")
        .upsert({ user_id: user.id, card_id: card.id, card_data: slimCard }, { onConflict: "user_id,card_id" })
        .then();
    }
  }, [user, favorites]);

  const removeFavorite = useCallback((cardId) => {
    const next = favorites.filter(c => c.id !== cardId);
    setFavorites(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    if (user) {
      createClient().from("user_favorite_cards")
        .delete().eq("user_id", user.id).eq("card_id", cardId)
        .then();
    }
  }, [user, favorites]);

  const isFavorite = useCallback((cardId) => {
    return favorites.some(c => c.id === cardId);
  }, [favorites]);

  const toggleFavorite = useCallback((card) => {
    const exists = favorites.some(c => c.id === card.id);
    const slimCard = slim(card);
    const next = exists ? favorites.filter(c => c.id !== card.id) : [slimCard, ...favorites];
    setFavorites(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    if (user) {
      const sb = createClient();
      if (exists) {
        sb.from("user_favorite_cards").delete().eq("user_id", user.id).eq("card_id", card.id).then();
      } else {
        sb.from("user_favorite_cards").upsert({ user_id: user.id, card_id: card.id, card_data: slimCard }, { onConflict: "user_id,card_id" }).then();
      }
    }
  }, [user, favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
