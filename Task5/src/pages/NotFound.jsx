import { Link } from "react-router";

function NotFound() {
  return (
    <section className="detail">
      <h2 className="form-title">Page not found</h2>
      <p className="message">This page does not exist.</p>
      <Link to="/" className="btn btn-link">
        Go to Home
      </Link>
    </section>
  );
}

export default NotFound;