import { Navigate, useLocation } from "react-router";

// Sends the user to the /offline page and remembers where they wanted to go.
// The "Retry Connection" button uses "from" to bring them back.
function OfflineRedirect() {
  const location = useLocation();
  const from = location.pathname + location.search;

  return <Navigate to="/offline" replace state={{ from }} />;
}

export default OfflineRedirect;