# MTG App — Session Context

## Project Overview

Next.js MTG deck builder and collection tracker.

---

## Last Session Summary

### Deck Editor — UX Fixes & Polish (committed `de3c96a`)

**Desktop card search interaction:**
- Hover a row → image-only preview in sidebar (no buttons)
- Click a row → pins the full action panel (Add to Deck + Add to Collection); X to unpin
- Quick "+ Add" button on each row still does direct add-to-deck without opening the panel
- Fixed hover-gap bug: moved `onMouseLeave` to outer flex container

**Mobile card detail:**
- Full-screen overlay on tap (was 80vh, pushing buttons off-screen)
- Add to Deck no longer auto-closes the overlay

**Codex Entry removed:**
- Removed from `CardDetail.jsx`, `CardExplorer.jsx`, `useScryfall.js`
- `/api/lore` route still exists on disk but nothing calls it
- Freed up Anthropic API tokens for deck builder AI chat

---

## Key Design Decisions

| Context | Printing matters? | Reason |
|---|---|---|
| Deck | ❌ No | No card play difference based on printing |
| Collection | ✅ Yes | You own a specific physical copy from a specific set |

Collection action lives in the **preview panel** (not the results row) to keep the list clean.

---

## Where We Left Off

Deck editor is working and pushed. Next natural areas:
- Deck builder AI chat (Anthropic API — worth preserving tokens for this)
- Supabase integration for persistence (planned — see memory)