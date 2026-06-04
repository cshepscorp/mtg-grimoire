# MTG App — Session Context

## Project Overview

Next.js MTG deck builder and collection tracker.

---

## Last Session Summary

### Deck Editor — Polish, fixes, and responsive layout

**Deck list panel:**
- Visual mode toggle (⊞/≡) — grid of card images, 5 columns, quantity badge on each tile
- Hover a list row → shows card image in the shared right-panel preview (no floating tooltip)
- Mobile: tap a row to expand card image inline; full-screen overlay on tap in add-cards tab
- `DeckCardImage` component handles both UUID-based and name-based card IDs (AI-generated decks)
- View mode state lifted to `DeckEditorPage` so layout can respond to it

**Layout:**
- Deck panel: `clamp(300px, 38%, 500px)` — fluid, no jumping between modes
- Preview panel hides at ≤1100px; mobile tab layout at ≤768px
- `scryfallImageUrl` fixed to use single-char CDN path segments

**Bug fixes:**
- Deck cards lost on page reload — fixed hydration timing (localStorage read in `useEffect`, `useState` initialized before data arrived)
- AI-generated deck cards used card names as IDs — `DeckCardImage` + `handleDeckCardHover` now detect non-UUID IDs and fetch by name from Scryfall
- Unsaved changes dialog when navigating away; `beforeunload` for browser refresh

**Other:**
- Artists tab redesigned as thumbnail grid (fetches art_crop from Scryfall)
- Sidebar sections truncate to 3 items with "Show N more" expand
- Codex Entry removed — tokens preserved for deck builder AI chat

---

## Key Design Decisions

| Context | Printing matters? | Reason |
|---|---|---|
| Deck | ❌ No | No card play difference based on printing |
| Collection | ✅ Yes | You own a specific physical copy from a specific set |

Collection action lives in the **preview panel** (not the results row) to keep the list clean.

---

## Where We Left Off

All committed and pushed. Next natural areas:
- Deck builder AI chat (Anthropic API — tokens preserved for this)
- Supabase integration for persistence (planned — see memory)