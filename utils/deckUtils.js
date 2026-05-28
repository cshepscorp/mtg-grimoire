export const FORMATS = ["Standard", "Modern", "Legacy", "Commander"];
export const RARITIES = ["Common", "Uncommon", "Rare", "Mythic"];
export const BUDGETS = ["Budget", "Moderate", "No limit"];
export const PLAYSTYLES = ["Aggro", "Control", "Midrange", "Combo"];

export function parseDeckJson(text) {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

export function deduplicateDeck(cards) {
  return Object.values(
    cards.reduce((acc, c) => {
      const key = `${c.category}__${c.name}`;
      if (acc[key]) acc[key] = { ...acc[key], quantity: acc[key].quantity + c.quantity };
      else acc[key] = { ...c };
      return acc;
    }, {})
  );
}
