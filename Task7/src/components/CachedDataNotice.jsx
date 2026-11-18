import { useCachedDataStatus } from "../hooks/useCachedDataStatus";

function CachedDataNotice() {
  const fromCache = useCachedDataStatus();

  if (!fromCache) {
    return null;
  }

  return (
    <p className="cached-notice" role="status">
      You are viewing saved data from your last visit. It will refresh when you are back online.
    </p>
  );
}

export default CachedDataNotice;