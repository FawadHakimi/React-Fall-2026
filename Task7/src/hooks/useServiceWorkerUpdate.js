import { useState, useEffect, useRef } from "react";

const CHECK_EVERY = 60 * 60 * 1000; // look for a new version every hour

export function useServiceWorkerUpdate() {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const updateRequested = useRef(false);

  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

    const container = navigator.serviceWorker;
    let registration = null;
    let intervalId = null;

    // A new worker was found: wait until it is installed
    function handleUpdateFound() {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener("statechange", () => {
        // "controller" exists = an old version is already running,
        // so this is an UPDATE, not the very first install
        if (newWorker.state === "installed" && container.controller) {
          setWaitingWorker(newWorker);
        }
      });
    }

    // The new worker took control. Reload, but only if the user pressed "Update"
    function handleControllerChange() {
      if (updateRequested.current) {
        window.location.reload();
      }
    }

    container.addEventListener("controllerchange", handleControllerChange);

    container
      .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .then((reg) => {
        registration = reg;
        // A new version may already be waiting
        if (reg.waiting && container.controller) {
          setWaitingWorker(reg.waiting);
        }
        reg.addEventListener("updatefound", handleUpdateFound);
        intervalId = setInterval(() => reg.update().catch(() => {}), CHECK_EVERY);
      })
      .catch((error) => console.error("Service Worker registration failed:", error));

    // cleanup
    return () => {
      container.removeEventListener("controllerchange", handleControllerChange);
      if (registration) registration.removeEventListener("updatefound", handleUpdateFound);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  function updateNow() {
    if (!waitingWorker) return;
    updateRequested.current = true;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  }

  function dismiss() {
    setWaitingWorker(null);
  }

  return { updateAvailable: waitingWorker !== null, updateNow, dismiss };
}