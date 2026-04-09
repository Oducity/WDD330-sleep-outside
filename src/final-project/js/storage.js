const FAVORITES_KEY = "final-favorite-parks";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

export function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

export function toggleFavorite(parkCode) {
  const current = getFavorites();
  const has = current.includes(parkCode);
  const next = has ? current.filter((p) => p !== parkCode) : [...current, parkCode];
  saveFavorites(next);
  return next;
}

export function isFavorite(parkCode) {
  return getFavorites().includes(parkCode);
}
