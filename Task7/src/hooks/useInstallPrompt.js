import { useEffect, useState } from "react";

// Chrome tells us when the app can be installed ("beforeinstallprompt").
// We keep that event and show our own Install button.
export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    function handleBeforeInstall(event) {
      event.preventDefault(); // stop the default mini-bar, we use our button
      setPromptEvent(event);
    }
    function handleInstalled() {
      setPromptEvent(null);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function install() {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  }

  return { canInstall: promptEvent !== null, install };
}