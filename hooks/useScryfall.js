import { useState, useEffect, useCallback, useRef } from "react";
import { VIEW_CARD, VIEW_SEARCH, VIEW_ARTIST, VIEW_FILTER, VIEW_SETS } from "../utils/constants";

export default function useScryfall({ addArtist, setGalleryContext, setView }) {
  const [card, setCard] = useState(null);
  const [printings, setPrintings] = useState([]);
  const [activePrinting, setActivePrinting] = useState(0);
  const [activeFace, setActiveFace] = useState(0);
  const [lore, setLore] = useState("");
  const [loreLoading, setLoreLoading] = useState(false);
  const [rulings, setRulings] = useState([]);
  const [rulingsLoading, setRulingsLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistCards, setArtistCards] = useState([]);
  const [artistLoading, setArtistLoading] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [filterLabel, setFilterLabel] = useState("");
  const [filterSublabel, setFilterSublabel] = useState("");
  const [filterCards, setFilterCards] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  const [sets, setSets] = useState([]);
  const [setsLoading, setSetsLoading] = useState(false);
  const setsFetchedRef = useRef(false);

  const fetchLore = useCallback(async (cardData) => {
    setLoreLoading(true);
    setLore("");
    try {
      const res = await fetch("/api/lore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card: cardData }),
      });
      const data = await res.json();
      setLore(data.lore || "The archives are silent on this matter.");
    } catch {
      setLore("The archives are currently inaccessible.");
    }
    setLoreLoading(false);
  }, []);

  const fetchRulings = useCallback(async (cardId) => {
    setRulingsLoading(true);
    setRulings([]);
    try {
      const res = await fetch(`https://api.scryfall.com/cards/${cardId}/rulings`);
      const data = await res.json();
      setRulings(data.data ?? []);
    } catch {}
    setRulingsLoading(false);
  }, []);

  const loadCard = useCallback(async (cardData, galleryIndex = null, galleryCards = null, galleryLabel = null) => {
    setCard(cardData);
    setActivePrinting(0);
    setActiveFace(0);
    setError("");
    setView(VIEW_CARD);
    if (galleryIndex !== null && galleryCards !== null) {
      setGalleryContext({ cards: galleryCards, index: galleryIndex, label: galleryLabel });
    }

    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?order=released&q=!"${encodeURIComponent(cardData.name)}"&unique=prints`
      );
      const data = await res.json();
      setPrintings(data.data?.filter((p) => p.image_uris || p.card_faces?.some(f => f.image_uris)) ?? [cardData]);
    } catch {
      setPrintings([cardData]);
    }
    fetchLore(cardData);
    fetchRulings(cardData.id);
  }, [fetchLore, fetchRulings, setGalleryContext, setView]);

  const doRandom = useCallback(async () => {
    setRandomLoading(true);
    setError("");
    setGalleryContext(null);
    try {
      const res = await fetch("https://api.scryfall.com/cards/random");
      const data = await res.json();
      await loadCard(data);
    } catch { setError("Could not fetch a random card."); }
    setRandomLoading(false);
  }, [loadCard, setGalleryContext]);

  const openArtist = useCallback(async (artistName) => {
    addArtist(artistName);
    setSelectedArtist(artistName);
    setView(VIEW_ARTIST);
    setArtistLoading(true);
    setArtistCards([]);
    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=a:"${encodeURIComponent(artistName)}"&unique=art&order=name`
      );
      const data = await res.json();
      const cards = data.data?.filter((c) => c.image_uris?.art_crop) ?? [];
      setArtistCards(cards);
    } catch {}
    setArtistLoading(false);
  }, [setView]);

  const doSearch = useCallback(async (query, searchMode) => {
    if (!query.trim()) return;
    setError("");
    setSearchLoading(true);
    setSearchQuery(query.trim());

    if (searchMode === "artist") {
      await openArtist(query.trim());
      setSearchLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=name:"${encodeURIComponent(query.trim())}"&unique=cards&order=name`
      );
      const data = await res.json();

      if (data.object === "error" || !data.data?.length) {
        const fuzzyRes = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(query.trim())}`);
        const fuzzyData = await fuzzyRes.json();
        if (fuzzyData.object === "error") {
          setError("No cards found. Try a different search.");
          setSearchLoading(false);
          return;
        }
        await loadCard(fuzzyData);
        setSearchLoading(false);
        return;
      }

      if (data.data.length === 1) {
        await loadCard(data.data[0], 0, data.data, VIEW_SEARCH);
        setSearchLoading(false);
        return;
      }

      setSearchResults(data.data);
      setView(VIEW_SEARCH);
    } catch {
      setError("Search failed. Check your connection.");
    }
    setSearchLoading(false);
  }, [loadCard, openArtist, setView]);

  const openSetBrowser = useCallback(async () => {
    setView(VIEW_SETS);
    if (setsFetchedRef.current) return;
    setsFetchedRef.current = true;
    setSetsLoading(true);
    try {
      const res = await fetch("https://api.scryfall.com/sets");
      const data = await res.json();
      setSets(data.data ?? []);
    } catch {
      setsFetchedRef.current = false;
    }
    setSetsLoading(false);
  }, [setView]);

  const openFilter = useCallback(async (label, sublabel, scryfallQuery) => {
    setFilterLabel(label);
    setFilterSublabel(sublabel);
    setView(VIEW_FILTER);
    setFilterLoading(true);
    setFilterCards([]);
    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=${scryfallQuery}&unique=cards&order=name`
      );
      const data = await res.json();
      setFilterCards(data.data?.filter((c) => c.image_uris) ?? []);
    } catch {}
    setFilterLoading(false);
  }, [setView]);

  useEffect(() => { doRandom(); }, []);

  const activeCard = printings[activePrinting] || card;
  const hasFaces = !!(activeCard?.card_faces?.length > 1 && !activeCard?.image_uris);
  const displayCard = hasFaces
    ? { ...activeCard, ...activeCard.card_faces[activeFace] }
    : activeCard;
  const cardImageUrl = displayCard?.image_uris?.normal;
  const lightboxImageUrl = displayCard?.image_uris?.png || displayCard?.image_uris?.large || cardImageUrl;
  const isLoading = randomLoading || searchLoading || artistLoading || filterLoading;

  return {
    card, printings, activePrinting, setActivePrinting,
    activeFace, setActiveFace, hasFaces, displayCard,
    lore, loreLoading,
    rulings, rulingsLoading,
    randomLoading, searchLoading, artistLoading, filterLoading,
    error,
    loadCard, doRandom, doSearch, openArtist, openFilter,
    searchResults, searchQuery,
    artistCards, selectedArtist,
    filterCards, filterLabel, filterSublabel,
    sets, setsLoading, openSetBrowser,
    activeCard, cardImageUrl, lightboxImageUrl,
    isLoading,
  };
}
