import { useSyncExternalStore } from "react";

// The browser fires "online" / "offline" events when the connection changes
function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  // cleanup: remove the listeners when the component disappears
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}