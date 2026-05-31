const COLOR_MAP = { W: "#e0d8be", U: "#4a7fb5", B: "#8a8a9a", R: "#c94040", G: "#3d8a4a" };

export function colorDotColor(colors, colorIdentity) {
  const c = colors ?? colorIdentity ?? [];
  if (!c.length) return "#777";
  if (c.length > 1) return "#c9a227";
  return COLOR_MAP[c[0]] ?? "#777";
}

export function scryfallImageUrl(id, size = "normal") {
  return `https://cards.scryfall.io/${size}/front/${id.slice(0, 2)}/${id.slice(2, 4)}/${id}.jpg`;
}
