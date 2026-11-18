import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { checkConnection } from "../pwa/connection";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

function Offline() {
  const location = useLocation();
  const navigate = useNavigate();
  const online = useOnlineStatus();

  // The page the user wanted to open before we sent them here
  const from = location.state?.from || "/";

  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleRetry() {
    setChecking(true);
    setFailed(false);
    const ok = await checkConnection(); // a real request, not navigator.onLine
    setChecking(false);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setFailed(true);
    }
  }

  return (
    <section className="offline-page">
      <div className="detail-card offline-card">
        <p className="offline-icon" aria-hidden="true">
          📡
        </p>
        <h2 className="form-title">You are offline</h2>
        <p className="offline-text">
          We cannot reach the internet and this page is not saved on your device yet.
          Pages and cars you opened before are still available.
        </p>

        {online && !failed && (
          <p className="offline-hint">Your device says it is online again. Press Retry.</p>
        )}
        {failed && <p className="field-error">Still offline. Please try again.</p>}

        <div className="offline-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRetry}
            disabled={checking}
          >
            {checking ? "Checking..." : "Retry Connection"}
          </button>
          <Link to="/" className="btn btn-link">
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Offline;