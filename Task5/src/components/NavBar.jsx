import { Link, NavLink } from "react-router";

function NavBar() {
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
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;