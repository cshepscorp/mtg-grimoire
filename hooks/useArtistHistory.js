import { useState, useEffect, useCallback } from "react";

const ARTISTS_KEY = "grimoire_artists";

export default function useArtistHistory() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ARTISTS_KEY);
      if (saved) setArtists(JSON.parse(saved));
    } catch {}
  }, []);

  const addArtist = useCallback((artistName) => {
    if (!artistName) return;
    setArtists((prev) => {
      if (prev.includes(artistName)) return prev;
      const updated = [artistName, ...prev];
      try { localStorage.setItem(ARTISTS_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clearArtists = () => {
    setArtists([]);
    try { localStorage.removeItem(ARTISTS_KEY); } catch {}
  };

  return { artists, addArtist, clearArtists };
}
