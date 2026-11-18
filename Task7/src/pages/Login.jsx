import { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import GoogleButton from "../components/GoogleButton";

function Login() {
  const { user, loading, error, clearError, login, loginGoogle } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/profile";

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    clearError();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await login(form.email.trim(), form.password);
    setSubmitting(false);
  }

  async function handleGoogle() {
    setSubmitting(true);
    await loginGoogle();
    setSubmitting(false);
  }

  const busy = submitting || loading;

  return (
    <section className="login">
            <div className="auth-head">
        <h2 className="form-title">Welcome back</h2>
        <p className="auth-sub">Log in to your Car Rental account</p>
            </div>

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
              required
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
              required
            />
          </label>
        </div>

        {error && <p className="field-error login-notice">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <p className="auth-divider">or</p>
        <GoogleButton onClick={handleGoogle} disabled={busy} />

        <p className="auth-switch">
          No account yet? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;