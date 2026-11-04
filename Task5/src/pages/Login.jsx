import { useState } from "react";
import { Link } from "react-router";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setMessage("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("Sign in is not available yet. It will be added later.");
  }

  return (
    <section className="login">
      <h2 className="form-title">Login</h2>

      <form className="detail-card" onSubmit={handleSubmit}>
        <div className="login-fields">
          <label className="filter-label">
            Email
            <input
              className="field"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label className="filter-label">
            Password
            <input
              className="field"
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
            />
          </label>
        </div>

        {message && <p className="notice login-notice">{message}</p>}

        <div className="form-actions">
          <Link to="/" className="btn btn-link">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </div>
      </form>
    </section>
  );
}

export default Login;