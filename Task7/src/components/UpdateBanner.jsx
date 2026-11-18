import { useServiceWorkerUpdate } from "../hooks/useServiceWorkerUpdate";

function UpdateBanner() {
  const { updateAvailable, updateNow, dismiss } = useServiceWorkerUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="update-banner" role="alert">
      <p className="update-text">A new version of the app is available.</p>
      <div className="update-actions">
        <button type="button" className="btn btn-primary" onClick={updateNow}>
          Update
        </button>
        <button type="button" className="btn" onClick={dismiss}>
          Later
        </button>
      </div>
    </div>
  );
}

export default UpdateBanner;