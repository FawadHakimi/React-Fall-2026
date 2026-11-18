import { useSyncExternalStore } from "react";
import { subscribeToCacheStatus, getCacheStatus } from "../services/cacheStatus";

// true = the data on the screen came from the service worker cache
export function useCachedDataStatus() {
  return useSyncExternalStore(subscribeToCacheStatus, getCacheStatus, () => false);
}