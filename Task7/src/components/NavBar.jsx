import InstallButton from "./InstallButton";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import OnlineIndicator from "./OnlineIndicator";

function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    const ok = await logout();
    if (ok) {
      navigate("/", { replace: true });
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          Car Rental
        </Link>

        <div className="header-controls">
          <OnlineIndicator />
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="menu-bar" />
            <span className="menu-bar" />
            <span className="menu-bar" />
          </button>
        </div>

        {/* Clicking any link inside the menu closes it */}
        <nav
          id="main-nav"
          className={menuOpen ? "nav is-open" : "nav"}
          onClick={closeMenu}
        >
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/cars" end className="nav-link">
            Cars
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>

          {!loading && user && (
            <>
              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>
              <button type="button" className="nav-link nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          {!loading && !user && (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/signup" className="nav-link">
                Signup
              </NavLink>
            </>
          )}
          <InstallButton />
        </nav>
      </div>
    </header>
  );
}

export default NavBar;