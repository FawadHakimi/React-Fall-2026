import { Suspense, useEffect } from "react";
import { Outlet } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import NavBar from "./NavBar";
import UpdateBanner from "./UpdateBanner";
import CachedDataNotice from "./CachedDataNotice";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import RouteErrorBoundary from "./RouteErrorBoundary";

function RootLayout() {
  const online = useOnlineStatus();
  const queryClient = useQueryClient();

  // When the connection comes back, refresh the data on the screen
  useEffect(() => {
    if (online) {
      queryClient.invalidateQueries();
    }
  }, [online, queryClient]);

  return (
    <>
      <NavBar />
      <main className="container">
        <CachedDataNotice />
        <RouteErrorBoundary>
          <Suspense fallback={<p className="message">Loading page...</p>}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </main>
      <UpdateBanner />
    </>
  );
}

export default RootLayout;