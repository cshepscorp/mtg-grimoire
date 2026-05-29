const DAILY_LIMITS = {
  lore: 20,
  chat: 5,
};

const KEY = "grimoire_usage";

function getUsage() {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return {};
    const { date, counts } = JSON.parse(stored);
    if (date !== new Date().toDateString()) return {};
    return counts;
  } catch { return {}; }
}

function saveUsage(counts) {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      date: new Date().toDateString(),
      counts,
    }));
  } catch {}
}

export function checkLimit(type) {
  const limit = DAILY_LIMITS[type];
  if (!limit) return true;
  return (getUsage()[type] || 0) < limit;
}

export function incrementUsage(type) {
  const counts = getUsage();
  counts[type] = (counts[type] || 0) + 1;
  saveUsage(counts);
}
