# Grimoire Refactor Plan

## Context
This is a Next.js app (App Router) with two main components that have grown large and need to be broken up. The goal is to extract reusable hooks and presentational components without changing any behavior.

## Current structure
```
components/
  CardExplorer.jsx   (~800 lines) — main card browsing UI, all state lives here
  DeckChat.jsx       (~400 lines) — deck builder slide-in panel
app/
  api/lore/route.js  — Anthropic lore generation
  api/chat/route.js  — Anthropic deck builder chat
```

## Target structure
```
components/
  CardExplorer.jsx         — orchestration only, wires hooks and components together
  DeckChat.jsx             — unchanged for now
  card/
    CardDetail.jsx         — right column: name, type, mana, oracle text, badges, codex entry, deck button
    CardImage.jsx          — left column: card image (clickable), artist credit, printings strip
    CardGrid.jsx           — shared gallery grid (already somewhat isolated, extract fully)
    ManaPip.jsx            — single mana symbol pip
    ClickableBadge.jsx     — reusable clickable badge
    PrintingThumb.jsx      — single printing thumbnail
  layout/
    SearchHeader.jsx       — header with search input, name/artist toggle, search/random buttons
    ArtistSidebar.jsx      — artist chip list with clear button
  nav/
    NavArrow.jsx           — prev/next desktop arrow buttons
    MobileNav.jsx          — prev/next mobile button row
hooks/
  useScryfall.js           — all Scryfall fetch logic
  useGallery.js            — gallery context, navigation, back-to-gallery
  useArtistHistory.js      — localStorage artist history (read, add, clear)
```

## Step-by-step instructions

Work through these one step at a time. After each step, confirm the app still runs and nothing is visually broken before moving to the next.

### Step 1 — Extract small presentational components
These have no state and no side effects. Safe to do first.

1. Create `components/card/ManaPip.jsx` — extract the `ManaPip` function from `CardExplorer.jsx`. It takes a `symbol` prop and renders a colored pip span. Also move `parseMana` and `replaceSymbols` as named exports from the same file or a `utils/mana.js` file.
2. Create `components/card/ClickableBadge.jsx` — extract the `ClickableBadge` function.
3. Create `components/card/PrintingThumb.jsx` — extract the `PrintingThumb` function.
4. Create `components/nav/NavArrow.jsx` — extract the `NavArrow` function.
5. Create `components/nav/MobileNav.jsx` — extract the `MobileNav` function.
6. Update `CardExplorer.jsx` to import all of the above instead of defining them inline.

### Step 2 — Extract useArtistHistory hook
This is the simplest hook — pure localStorage with no Scryfall dependency.

Create `hooks/useArtistHistory.js`:
```js
// Should return: { artists, addArtist, clearArtists }
// Reads from localStorage key "grimoire_artists" on mount
// addArtist prepends and deduplicates
// clearArtists removes from localStorage and resets state
```

Replace the inline artist state and functions in `CardExplorer.jsx` with this hook.

### Step 3 — Extract useGallery hook
Create `hooks/useGallery.js`:
```js
// Should return: {
//   galleryContext, setGalleryContext,
//   navigateGallery,    // takes delta (+1 or -1)
//   goBackToGallery,    // returns to correct view
//   canGoPrev,
//   canGoNext,
// }
// Depends on: current view state setter (passed in or use a callback)
// navigateGallery calls loadCard — accept it as a parameter
```

This hook manages `galleryContext` state and the navigation logic. `navigateGallery` needs `loadCard` passed in as a dependency since it calls it. Consider accepting `{ loadCard, setView }` as params.

### Step 4 — Extract useScryfall hook
This is the biggest one. Create `hooks/useScryfall.js`:
```js
// Should return: {
//   card, printings, activePrinting, setActivePrinting,
//   lore, loreLoading,
//   randomLoading, searchLoading, artistLoading, filterLoading,
//   error,
//   loadCard,      // (cardData, galleryIndex?, galleryCards?, galleryLabel?) => void
//   doRandom,
//   doSearch,      // (query, searchMode) => void
//   openArtist,    // (artistName) => void
//   openFilter,    // (label, sublabel, scryfallQuery) => void
//   searchResults, searchQuery,
//   artistCards, selectedArtist,
//   filterCards, filterLabel, filterSublabel,
//   activeCard, cardImageUrl, lightboxImageUrl,
//   isLoading,
// }
// Internal: fetchLore calls /api/lore
// All Scryfall fetch logic moves here
// addArtist should be accepted as a parameter (from useArtistHistory)
```

### Step 5 — Extract CardGrid component
Create `components/card/CardGrid.jsx` — it's already fairly self-contained in `CardExplorer.jsx`, just needs to live in its own file. Signature stays the same: `{ cards, label, sublabel, loading, loadingText, onSelectCard, onBack }`.

Note: `onSelectCard` currently receives `(card, index)` — make sure that's preserved.

### Step 6 — Extract CardImage component
Create `components/card/CardImage.jsx`:
```jsx
// Props: { card, printings, activePrinting, onPrintingChange, onOpenArtist, onLightboxOpen }
// Renders: the card image (zoom-in cursor, click to lightbox), artist credit (clickable), printings strip
```

### Step 7 — Extract CardDetail component
Create `components/card/CardDetail.jsx`:
```jsx
// Props: { card, lore, loreLoading, onOpenArtist, onOpenFilter, onOpenDeckChat }
// Renders: card name, type line, mana cost, oracle text, flavor text, power/toughness,
//          clickable badges (set, rarity, CMC), codex entry, build a deck button
```

### Step 8 — Extract SearchHeader component
Create `components/layout/SearchHeader.jsx`:
```jsx
// Props: { query, setQuery, searchMode, setSearchMode, onSearch, onRandom, isLoading, onLogoClick }
// Renders: the full header including logo, search input, name/artist toggle, search/random buttons
// Contains all the mobile CSS for the header
```

### Step 9 — Extract ArtistSidebar component
Create `components/layout/ArtistSidebar.jsx`:
```jsx
// Props: { artists, selectedArtist, currentView, onSelectArtist, onClear }
// Renders: the aside with artist chips and clear button
// Contains the grimoire-sidebar CSS class and mobile hide logic
```

### Step 10 — Slim down CardExplorer
At this point `CardExplorer.jsx` should be mostly:
- Hook calls (`useArtistHistory`, `useGallery`, `useScryfall`)
- View state (`view`, `setView`)
- Lightbox state
- Touch/swipe handling
- The main layout shell (header, sidebar, main, lightbox, DeckChat)
- Routing between VIEW_CARD / VIEW_SEARCH / VIEW_ARTIST / VIEW_FILTER

Target length: under 200 lines.

## Important notes
- Keep `"use client"` at the top of any component that uses state or browser APIs
- Hooks go in `hooks/` and do NOT need `"use client"` — they're used by client components
- Don't change any logic, styling, or behavior — this is purely structural
- The `MANA_COLORS` constant and `VIEW_*` constants can live in a `constants.js` or `utils/` file
- Test on both desktop and mobile viewport after each step
- If a step feels too big, split it further before proceeding

### Step 11 — Extract styles (future)
The inline `<style>` blocks and inline style props are out of scope for this refactor but worth a follow-up pass. Options: CSS modules per component, or move the global mobile rules into `app/globals.css`. The component-scoped `<style>` tags (e.g. `.grimoire-nav-arrow`, `.grimoire-sidebar`) will naturally move with their components in Steps 1–9; the remaining global block in `CardExplorer` is the main candidate for Step 11.
