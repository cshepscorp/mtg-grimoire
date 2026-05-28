import { useState, useCallback } from "react";
import { VIEW_CARD, VIEW_ARTIST, VIEW_SEARCH, VIEW_FILTER } from "../utils/constants";

export default function useGallery({ setView, view }) {
  const [galleryContext, setGalleryContext] = useState(null);

  const navigateGallery = useCallback((delta, loadCard) => {
    if (!galleryContext) return;
    const { cards, index, label } = galleryContext;
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= cards.length) return;
    loadCard(cards[newIndex], newIndex, cards, label);
  }, [galleryContext]);

  const goBackToGallery = useCallback(() => {
    if (!galleryContext) return;
    const { label } = galleryContext;
    if (label === VIEW_ARTIST) setView(VIEW_ARTIST);
    else if (label === VIEW_SEARCH) setView(VIEW_SEARCH);
    else if (label === VIEW_FILTER) setView(VIEW_FILTER);
    else setView(VIEW_CARD);
    setGalleryContext(null);
  }, [galleryContext, setView]);

  const hasGalleryNav = view === VIEW_CARD && galleryContext && galleryContext.cards.length > 1;
  const canGoPrev = hasGalleryNav && galleryContext.index > 0;
  const canGoNext = hasGalleryNav && galleryContext.index < galleryContext.cards.length - 1;

  return { galleryContext, setGalleryContext, navigateGallery, goBackToGallery, canGoPrev, canGoNext };
}
