export const PIP_COLORS = {
  W: "#f0e6c8",
  U: "#4a90d9",
  B: "#9b7fc8",
  R: "#e05a4a",
  G: "#5ab87a",
  C: "#b8b0aa",
};

export const MONO_COLORS = [
  { name: "White",     codes: ["W"],      query: "c=W" },
  { name: "Blue",      codes: ["U"],      query: "c=U" },
  { name: "Black",     codes: ["B"],      query: "c=B" },
  { name: "Red",       codes: ["R"],      query: "c=R" },
  { name: "Green",     codes: ["G"],      query: "c=G" },
  { name: "Colorless", codes: ["C"],      query: "c:C -t:land" },
];

export const GUILD_COLORS = [
  { name: "Azorius",  codes: ["W", "U"], query: "c=WU" },
  { name: "Dimir",    codes: ["U", "B"], query: "c=UB" },
  { name: "Rakdos",   codes: ["B", "R"], query: "c=BR" },
  { name: "Gruul",    codes: ["R", "G"], query: "c=RG" },
  { name: "Selesnya", codes: ["G", "W"], query: "c=GW" },
  { name: "Orzhov",   codes: ["W", "B"], query: "c=WB" },
  { name: "Izzet",    codes: ["U", "R"], query: "c=UR" },
  { name: "Golgari",  codes: ["B", "G"], query: "c=BG" },
  { name: "Boros",    codes: ["R", "W"], query: "c=RW" },
  { name: "Simic",    codes: ["G", "U"], query: "c=GU" },
];

export const SHARD_COLORS = [
  { name: "Bant",   codes: ["G", "W", "U"], query: "c=GWU" },
  { name: "Esper",  codes: ["W", "U", "B"], query: "c=WUB" },
  { name: "Grixis", codes: ["U", "B", "R"], query: "c=UBR" },
  { name: "Jund",   codes: ["B", "R", "G"], query: "c=BRG" },
  { name: "Naya",   codes: ["R", "G", "W"], query: "c=RGW" },
];

export const WEDGE_COLORS = [
  { name: "Abzan",  codes: ["W", "B", "G"], query: "c=WBG" },
  { name: "Jeskai", codes: ["U", "R", "W"], query: "c=URW" },
  { name: "Sultai", codes: ["B", "G", "U"], query: "c=BGU" },
  { name: "Mardu",  codes: ["R", "W", "B"], query: "c=RWB" },
  { name: "Temur",  codes: ["G", "U", "R"], query: "c=GUR" },
];
