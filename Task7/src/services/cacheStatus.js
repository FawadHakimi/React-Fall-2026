let fromCache = false;
const listeners = new Set();

export function setFromCache(value) {
  if (value === fromCache) return;
  fromCache = value;
  listeners.forEach((listener) => listener());
}

// These two functions are what React's useSyncExternalStore needs
export function subscribeToCacheStatus(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCacheStatus() {
  return fromCache;
}