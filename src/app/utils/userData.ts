export interface FootprintItem {
  id: number;
  at: number;
}

const FAVORITES_KEY = "museum_favorites";
const FOOTPRINTS_KEY = "museum_footprints";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getFavorites(): number[] {
  if (typeof window === "undefined") return [];
  return safeParse<number[]>(window.localStorage.getItem(FAVORITES_KEY), []);
}

export function saveFavorites(favorites: number[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function toggleFavorite(id: number) {
  const favorites = getFavorites();
  const exists = favorites.includes(id);
  const next = exists ? favorites.filter((item) => item !== id) : [id, ...favorites];
  saveFavorites(next);
  return next;
}

export function isFavorite(id: number) {
  const favorites = getFavorites();
  return favorites.includes(id);
}

export function getFootprints(): FootprintItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<FootprintItem[]>(window.localStorage.getItem(FOOTPRINTS_KEY), []);
}

export function saveFootprints(items: FootprintItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FOOTPRINTS_KEY, JSON.stringify(items));
}

export function addFootprint(id: number) {
  if (typeof window === "undefined") return;
  const items = getFootprints();
  const now = Date.now();
  const filtered = items.filter((item) => item.id !== id);
  const next = [{ id, at: now }, ...filtered].slice(0, 20);
  saveFootprints(next);
  return next;
}

export function clearFootprints() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FOOTPRINTS_KEY);
}
