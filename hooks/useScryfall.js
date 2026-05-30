import { useState, useEffect, useCallback, useRef } from "react";
import { VIEW_CARD, VIEW_SEARCH, VIEW_ARTIST, VIEW_FILTER, VIEW_SETS } from "../utils/constants";
import { checkLimit, incrementUsage } from "../utils/rateLimit";

export default function useScryfall({ setGalleryContext, setView }) {
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
  const [filterError, setFilterError] = useState("");
  const [filterBackView, setFilterBackView] = useState(VIEW_CARD);
  const [artistError, setArtistError] = useState("");
  const filterAbortRef = useRef(null);
  const artistAbortRef = useRef(null);

  const [sets, setSets] = useState([]);
  const [setsLoading, setSetsLoading] = useState(false);
  const setsFetchedRef = useRef(false);

  const fetchLore = useCallback(async (cardData) => {
    if (!checkLimit("lore")) {
      setLore("The archives have reached their daily limit. Return tomorrow for more lore.");
      return;
    }
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
      incrementUsage("lore");
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

  const loadCard = useCallback(async (cardData, galleryIndex = null, galleryCards = null, galleryLabel = null, preferPrintingId = null) => {
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
      const prints = data.data?.filter((p) => p.image_uris || p.card_faces?.some(f => f.image_uris)) ?? [cardData];
      setPrintings(prints);
      if (preferPrintingId) {
        const idx = prints.findIndex(p => p.id === preferPrintingId);
        if (idx !== -1) setActivePrinting(idx);
      }
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

  const loadCardById = useCallback(async (scryfallId) => {
    setRandomLoading(true);
    setError("");
    setGalleryContext(null);
    try {
      const res = await fetch(`https://api.scryfall.com/cards/${scryfallId}`);
      if (!res.ok) { setError("Could not load card."); return; }
      const data = await res.json();
      await loadCard(data, null, null, null, scryfallId);
    } catch { setError("Could not load card."); }
    setRandomLoading(false);
  }, [loadCard, setGalleryContext]);

  const openArtist = useCallback(async (artistName) => {
    artistAbortRef.current?.abort();
    const controller = new AbortController();
    artistAbortRef.current = controller;

    setSelectedArtist(artistName);
    setView(VIEW_ARTIST);
    setArtistLoading(true);
    setArtistCards([]);
    setArtistError("");
    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=a:"${encodeURIComponent(artistName)}"&unique=art&order=name`,
        { signal: controller.signal }
      );
      if (res.status === 429) {
        setArtistError("Scryfall is rate limiting requests — wait a moment and try again.");
      } else if (!res.ok) {
        setArtistError("Failed to load artist cards. Please try again.");
      } else {
        const data = await res.json();
        setArtistCards(data.data?.filter((c) => c.image_uris?.art_crop) ?? []);
      }
    } catch (e) {
      if (e.name !== "AbortError") setArtistError("Failed to load artist cards. Check your connection.");
    }
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

  const openFilter = useCallback(async (label, sublabel, scryfallQuery, backView = VIEW_CARD) => {
    filterAbortRef.current?.abort();
    const controller = new AbortController();
    filterAbortRef.current = controller;

    setFilterLabel(label);
    setFilterSublabel(sublabel);
    setFilterBackView(backView);
    setFilterError("");
    setView(VIEW_FILTER);
    setFilterLoading(true);
    setFilterCards([]);

    try {
      let url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(scryfallQuery)}&unique=cards&order=name`;
      let accumulated = [];
      let pages = 0;
      const PAGE_CAP = 10;

      while (url && pages < PAGE_CAP) {
        const res = await fetch(url, { signal: controller.signal });
        if (res.status === 429) {
          setFilterError("Scryfall is rate limiting requests — wait a moment and try again.");
          break;
        }
        if (!res.ok) {
          setFilterError("Failed to load cards. Please try again.");
          break;
        }
        const data = await res.json();
        accumulated = [...accumulated, ...(data.data?.filter((c) => c.image_uris) ?? [])];
        setFilterCards([...accumulated]);
        pages++;
        url = data.has_more ? data.next_page : null;
        if (url) await new Promise(r => setTimeout(r, 100));
      }
    } catch (e) {
      if (e.name !== "AbortError") setFilterError("Failed to load cards. Check your connection.");
    }
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
    loadCard, loadCardById, doRandom, doSearch, openArtist, openFilter,
    searchResults, searchQuery,
    artistCards, selectedArtist,
    filterCards, filterLabel, filterSublabel, filterError, filterBackView,
    artistError,
    sets, setsLoading, openSetBrowser,
    activeCard, cardImageUrl, lightboxImageUrl,
    isLoading,
  };
}
