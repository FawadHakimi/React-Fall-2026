import { Suspense } from "react";
import { Outlet } from "react-router";
import NavBar from "./NavBar";

function RootLayout() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Suspense fallback={<p className="message">Loading page...</p>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}

export default RootLayout;