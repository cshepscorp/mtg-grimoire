import { useState, useEffect, useCallback } from "react";

const KEY = "grimoire_favorite_artists";

export default function useFavoriteArtists() {
  const [favoriteArtists, setFavoriteArtists] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setFavoriteArtists(JSON.parse(stored));
    } catch {}
  }, []);

  const toggleFavoriteArtist = useCallback((artistName) => {
    setFavoriteArtists(prev => {
      const next = prev.includes(artistName)
        ? prev.filter(a => a !== artistName)
        : [artistName, ...prev];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isArtistFavorite = useCallback((artistName) => {
    return favoriteArtists.includes(artistName);
  }, [favoriteArtists]);

  const clearFavoriteArtists = useCallback(() => {
    setFavoriteArtists([]);
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  return { favoriteArtists, toggleFavoriteArtist, isArtistFavorite, clearFavoriteArtists };
}
