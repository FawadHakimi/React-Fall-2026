import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      // Do not retry when we are offline or the car does not exist: it will not help
      retry: (failureCount, error) =>
        error.code !== "OFFLINE" && error.code !== "NOT_FOUND" && failureCount < 1,
      refetchOnWindowFocus: false,
      // By default React Query PAUSES requests while offline.
      // We want them to run, so the service worker can answer from its cache.
      networkMode: "offlineFirst",
    },
    mutations: {
      networkMode: "offlineFirst",
    },
  },
});