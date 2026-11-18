// Checks the REAL connection by asking our server for a tiny file.
// navigator.onLine can say "online" when there is no internet (for example
// Wi-Fi without access), so we do not trust it alone.
// The Service Worker ignores requests with "?ping=", so this always uses the network.
export async function checkConnection() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}ping.txt?ping=${Date.now()}`, {
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}