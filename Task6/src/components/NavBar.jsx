import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    const ok = await logout();
    if (ok) {
      navigate("/", { replace: true });
    }
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          Car Rental
        </Link>

        <nav className="nav">
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
        </nav>
      </div>
    </header>
  );
}

export default NavBar;