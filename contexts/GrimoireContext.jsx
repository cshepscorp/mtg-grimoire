"use client";

import { createContext, useContext } from "react";
import useFavorites from "../hooks/useFavorites";
import useCollection from "../hooks/useCollection";
import useDecks from "../hooks/useDecks";
import useFavoriteArtists from "../hooks/useFavoriteArtists";

const GrimoireContext = createContext(null);

export function GrimoireProvider({ children }) {
  const favoritesData = useFavorites();
  const collectionData = useCollection();
  const decksData = useDecks();
  const artistsData = useFavoriteArtists();

  return (
    <GrimoireContext.Provider value={{
      ...favoritesData,
      ...collectionData,
      ...decksData,
      ...artistsData,
    }}>
      {children}
    </GrimoireContext.Provider>
  );
}

export function useGrimoire() {
  const ctx = useContext(GrimoireContext);
  if (!ctx) throw new Error("useGrimoire must be used within GrimoireProvider");
  return ctx;
}
