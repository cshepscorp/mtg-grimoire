import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createClient } from "../lib/supabase/client";

const KEY = "grimoire_favorite_artists";

export default function useFavoriteArtists() {
  const { user } = useAuth();
  const [favoriteArtists, setFavoriteArtists] = useState([]);

  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem(KEY);
        setFavoriteArtists(stored ? JSON.parse(stored) : []);
      } catch { setFavoriteArtists([]); }
      return;
    }

    createClient()
      .from("user_favorite_artists")
      .select("artist_name")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) return;
        if (data.length > 0) {
          setFavoriteArtists(data.map(r => r.artist_name));
        } else {
          // Migrate localStorage on first login
          try {
            const stored = localStorage.getItem(KEY);
            if (!stored) return;
            const items = JSON.parse(stored);
            if (!items.length) return;
            setFavoriteArtists(items);
            createClient().from("user_favorite_artists")
              .upsert(items.map(name => ({ user_id: user.id, artist_name: name })), { onConflict: "user_id,artist_name" })
              .then();
          } catch {}
        }
      });
  }, [user?.id]);

  const toggleFavoriteArtist = useCallback((artistName) => {
    const exists = favoriteArtists.includes(artistName);
    const next = exists
      ? favoriteArtists.filter(a => a !== artistName)
      : [artistName, ...favoriteArtists];
    setFavoriteArtists(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    if (user) {
      const sb = createClient();
      if (exists) {
        sb.from("user_favorite_artists").delete().eq("user_id", user.id).eq("artist_name", artistName).then();
      } else {
        sb.from("user_favorite_artists").upsert({ user_id: user.id, artist_name: artistName }, { onConflict: "user_id,artist_name" }).then();
      }
    }
  }, [user, favoriteArtists]);

  const isArtistFavorite = useCallback((artistName) => {
    return favoriteArtists.includes(artistName);
  }, [favoriteArtists]);

  const clearFavoriteArtists = useCallback(() => {
    setFavoriteArtists([]);
    try { localStorage.removeItem(KEY); } catch {}
    if (user) {
      createClient().from("user_favorite_artists").delete().eq("user_id", user.id).then();
    }
  }, [user]);

  return { favoriteArtists, toggleFavoriteArtist, isArtistFavorite, clearFavoriteArtists };
}
