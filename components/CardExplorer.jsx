"use client";

import { useState, useEffect, useRef } from "react";
import DeckChat from "./DeckChat";
import CardGrid from "./card/CardGrid";
import SetBrowser from "./card/SetBrowser";
import ColorBrowser from "./card/ColorBrowser";
import CardImage from "./card/CardImage";
import CardDetail from "./card/CardDetail";
import SearchHeader from "./layout/SearchHeader";
import SavedSidebar from "./layout/SavedSidebar";
import NavArrow from "./nav/NavArrow";
import MobileNav from "./nav/MobileNav";
import useFavoriteArtists from "../hooks/useFavoriteArtists";
import useFavorites from "../hooks/useFavorites";
import useCollection from "../hooks/useCollection";
import useDecks from "../hooks/useDecks";
import useGallery from "../hooks/useGallery";
import useScryfall from "../hooks/useScryfall";
import { VIEW_CARD, VIEW_SEARCH, VIEW_ARTIST, VIEW_FILTER, VIEW_SETS, VIEW_COLORS, VIEW_FAVORITES } from "../utils/constants";
import styles from "./CardExplorer.module.css";

export default function CardExplorer() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("name");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxRotation, setLightboxRotation] = useState(0);
  const [deckChatOpen, setDeckChatOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [view, setView] = useState(VIEW_CARD);
  const [sidebarWidth, setSidebarWidth] = useState(260);

  const { favoriteArtists, toggleFavoriteArtist, isArtistFavorite, clearFavoriteArtists } = useFavoriteArtists();
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  const { collection, addToCollection, removeFromCollection, updateQuantity, isOwned } = useCollection();
  const { decks, saveDeck, deleteDeck } = useDecks();
  const { galleryContext, setGalleryContext, navigateGallery, goBackToGallery, canGoPrev, canGoNext } = useGallery({ setView, view });
  const {

    printings, activePrinting, setActivePrinting,
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
    activeCard, lightboxImageUrl,
    isLoading,
  } = useScryfall({ setGalleryContext, setView });

  const flipTargetName = hasFaces
    ? activeCard?.card_faces?.[activeFace === 0 ? 1 : 0]?.name
    : null;
  const canRotate = ["split", "flip", "aftermath", "planar", "scheme"].includes(displayCard?.layout);

  // Touch tracking for swipe
  const touchStartX = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (view === VIEW_CARD && galleryContext && !lightboxOpen) {
        if (e.key === "ArrowLeft") navigateGallery(-1, loadCard);
        if (e.key === "ArrowRight") navigateGallery(1, loadCard);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, galleryContext, lightboxOpen]);

  // Swipe handling
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60 && view === VIEW_CARD && galleryContext) {
      navigateGallery(dx < 0 ? 1 : -1, loadCard);
    }
    touchStartX.current = null;
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#0e0c09", color: "#e8dcc8", fontFamily: "Georgia, 'Times New Roman', serif", display: "flex", flexDirection: "column" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <SearchHeader
        query={query}
        setQuery={setQuery}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        onSearch={doSearch}
        onRandom={doRandom}
        onOpenSets={openSetBrowser}
        onOpenColors={() => setView(VIEW_COLORS)}
        onOpenFavorites={() => setView(VIEW_FAVORITES)}
        onOpenMySaved={() => setMobileSidebarOpen(true)}
        isLoading={isLoading}
        onLogoClick={() => { setView(VIEW_CARD); setGalleryContext(null); }}
      />

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        <SavedSidebar
          favoriteArtists={favoriteArtists}
          onSelectArtist={openArtist}
          onRemoveArtist={toggleFavoriteArtist}
          selectedArtist={selectedArtist}
          currentView={view}
          favorites={favorites}
          onSelectFavorite={(card) => loadCard(card, 0, favorites, VIEW_FAVORITES)}
          onRemoveFavorite={removeFavorite}
          collection={collection}
          onSelectCollectionCard={(item) => loadCard(item.cardData, 0, collection.map(c => c.cardData), VIEW_FAVORITES)}
          onRemoveFromCollection={removeFromCollection}
          decks={decks}
          onSelectDeck={(deck) => { /* TODO: open deck editor */ }}
          onRemoveDeck={deleteDeck}
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          onWidthChange={setSidebarWidth}
        />

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto" }}>

          {view === VIEW_FAVORITES && (
            <CardGrid
              cards={favorites}
              label="Favorites"
              sublabel={favorites.length === 0 ? "No favorites yet" : `${favorites.length} card${favorites.length === 1 ? "" : "s"}`}
              loading={false}
              loadingText=""
              onSelectCard={(c, i) => loadCard(c, i, favorites, VIEW_FAVORITES)}
              onBack={() => setView(VIEW_FAVORITES)}
            />
          )}

          {view === VIEW_SETS && (
            <SetBrowser
              sets={sets}
              loading={setsLoading}
              onSelectSet={(set) => openFilter("Set", set.name, `e:${set.code}`)}
            />
          )}

          {view === VIEW_COLORS && (
            <ColorBrowser
              onSelectColor={(color) => openFilter("Color", color.name, color.query)}
            />
          )}

          {view === VIEW_SEARCH && (
            <CardGrid
              cards={searchResults} label="Search results" sublabel={`"${searchQuery}"`}
              loading={searchLoading} loadingText="Searching the archives..."
              onSelectCard={(c, i) => loadCard(c, i, searchResults, VIEW_SEARCH)}
              onBack={() => setView(VIEW_SEARCH)}
            />
          )}

          {view === VIEW_ARTIST && (
            <CardGrid
              cards={artistCards} label="Artist" sublabel={selectedArtist}
              loading={artistLoading} loadingText="Gathering works..."
              onSelectCard={(c, i) => loadCard(c, i, artistCards, VIEW_ARTIST)}
              onBack={() => setView(VIEW_ARTIST)}
              headerAction={selectedArtist && (
                <button
                  onClick={() => toggleFavoriteArtist(selectedArtist)}
                  style={{
                    background: isArtistFavorite(selectedArtist) ? "rgba(232,162,124,0.1)" : "rgba(201,185,154,0.06)",
                    border: `0.5px solid ${isArtistFavorite(selectedArtist) ? "rgba(232,162,124,0.4)" : "rgba(201,185,154,0.25)"}`,
                    borderRadius: 6, padding: "6px 12px",
                    color: isArtistFavorite(selectedArtist) ? "#e8a27c" : "rgba(201,185,154,0.6)",
                    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {isArtistFavorite(selectedArtist) ? "♥ Favorited" : "♡ Favorite Artist"}
                </button>
              )}
            />
          )}

          {view === VIEW_FILTER && (
            <CardGrid
              cards={filterCards} label={filterLabel} sublabel={filterSublabel}
              loading={filterLoading} loadingText="Browsing the collection..."
              onSelectCard={(c, i) => loadCard(c, i, filterCards, VIEW_FILTER)}
              onBack={() => setView(VIEW_FILTER)}
            />
          )}

          {view === VIEW_CARD && (
            <>
              <div className={styles.cardView} style={{ padding: "2.5rem 4rem", maxWidth: 1100, margin: "0 auto" }}>

              {/* Back to gallery + position indicator */}
              {galleryContext && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <button onClick={goBackToGallery} style={{
                    background: "transparent", border: "0.5px solid rgba(201,185,154,0.3)",
                    borderRadius: 6, padding: "6px 14px", color: "rgba(201,185,154,0.7)",
                    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  }}>← Back to {galleryContext.label === VIEW_ARTIST ? "Artist" : galleryContext.label === VIEW_SEARCH ? "Search Results" : "Gallery"}</button>
                  <div style={{ fontSize: 11, color: "rgba(201,185,154,0.4)", letterSpacing: "0.06em" }}>
                    {galleryContext.index + 1} / {galleryContext.cards.length}
                  </div>
                </div>
              )}

              {(randomLoading || searchLoading) && (
                <div style={{ textAlign: "center", padding: "5rem", color: "rgba(201,185,154,0.35)", fontSize: 13, letterSpacing: "0.12em" }}>
                  Consulting the archives...
                </div>
              )}
              {error && <div style={{ color: "#e8a27c", fontSize: 13, padding: "1rem 0" }}>{error}</div>}

              {!randomLoading && !searchLoading && displayCard && (
                <div className={styles.cardGrid} style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "3rem", alignItems: "start" }}>

                  {/* Left */}
                  <div>
                    <CardImage
                      card={displayCard}
                      printings={printings}
                      activePrinting={activePrinting}
                      onPrintingChange={setActivePrinting}
                      onOpenArtist={openArtist}
                      onLightboxOpen={() => { setLightboxRotation(0); setLightboxOpen(true); }}
                      onRotateOpen={() => { setLightboxRotation(90); setLightboxOpen(true); }}
                      canRotate={canRotate}
                      isFavorite={isFavorite(activeCard?.id)}
                      onToggleFavorite={() => toggleFavorite(activeCard)}
                      isArtistFavorite={isArtistFavorite(displayCard?.artist)}
                      onToggleFavoriteArtist={toggleFavoriteArtist}
                      hasFaces={hasFaces}
                      flipTargetName={flipTargetName}
                      onFlipFace={() => setActiveFace(f => f === 0 ? 1 : 0)}
                      isOwned={(printingId) => isOwned(printingId)}
                      getOwnedQuantity={(printingId) => collection.find(c => c.cardId === printingId)?.quantityOwned ?? 0}
                      onAddToCollection={(card, qty) => addToCollection(card, qty)}
                      onUpdateQuantity={(printingId, qty) => updateQuantity(printingId, qty)}
                    />

                    {/* Mobile prev/next */}
                    {galleryContext && (
                      <MobileNav
                        onPrev={() => navigateGallery(-1, loadCard)}
                        onNext={() => navigateGallery(1, loadCard)}
                        canPrev={canGoPrev}
                        canNext={canGoNext}
                        index={galleryContext.index}
                        total={galleryContext.cards.length}
                      />
                    )}
                  </div>

                  {/* Right */}
                  <CardDetail
                    card={displayCard}
                    lore={lore}
                    loreLoading={loreLoading}
                    rulings={rulings}
                    rulingsLoading={rulingsLoading}
                    onOpenFilter={openFilter}
                    onOpenDeckChat={() => setDeckChatOpen(true)}
                  />
                </div>
              )}
            </div>
            </>
          )}
        </main>
      </div>

      {/* Desktop gallery nav arrows */}
      <NavArrow direction="prev" onClick={() => navigateGallery(-1, loadCard)} visible={canGoPrev} sidebarWidth={sidebarWidth} />
      <NavArrow direction="next" onClick={() => navigateGallery(1, loadCard)} visible={canGoNext} sidebarWidth={0} />

      {/* Lightbox */}
      {lightboxOpen && lightboxImageUrl && (
        <div onClick={() => setLightboxOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "zoom-out", backdropFilter: "blur(4px)",
        }}>
          <img
            src={lightboxImageUrl}
            alt={displayCard?.name}
            onClick={e => e.stopPropagation()}
            style={{
              maxHeight: lightboxRotation % 180 !== 0 ? "90vw" : "90vh",
              maxWidth: lightboxRotation % 180 !== 0 ? "90vh" : "90vw",
              borderRadius: 16, boxShadow: "0 32px 80px rgba(0,0,0,0.8)", cursor: "default",
              transform: `rotate(${lightboxRotation}deg)`,
              transition: "transform 0.3s ease",
            }}
          />
          <div onClick={e => e.stopPropagation()} style={{ position: "fixed", top: 24, right: 24, display: "flex", gap: 8 }}>
            {hasFaces && (
              <button onClick={() => setActiveFace(f => f === 0 ? 1 : 0)} style={{
                background: "rgba(201,185,154,0.1)", border: "0.5px solid rgba(201,185,154,0.25)",
                borderRadius: 6, padding: "6px 14px", color: "rgba(201,185,154,0.6)",
                fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              }}>↺ {flipTargetName}</button>
            )}
            {canRotate && (
              <button onClick={() => setLightboxRotation(r => r + 90)} style={{
                background: "rgba(201,185,154,0.1)", border: "0.5px solid rgba(201,185,154,0.25)",
                borderRadius: 6, padding: "6px 14px", color: "rgba(201,185,154,0.6)",
                fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              }}>↻ Rotate</button>
            )}
            <button onClick={() => setLightboxOpen(false)} style={{
              background: "rgba(201,185,154,0.1)", border: "0.5px solid rgba(201,185,154,0.25)",
              borderRadius: 6, padding: "6px 14px", color: "rgba(201,185,154,0.6)",
              fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            }}>✕ Close</button>
          </div>
        </div>
      )}

      {/* Deck Builder chat panel */}
      <DeckChat
        card={activeCard}
        isOpen={deckChatOpen}
        onClose={() => setDeckChatOpen(false)}
        onSaveDeck={saveDeck}
      />
    </div>
  );
}