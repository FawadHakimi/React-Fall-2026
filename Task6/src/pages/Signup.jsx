import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import GoogleButton from "../components/GoogleButton";

function validate(form) {
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (form.confirm !== form.password) {
    errors.confirm = "Passwords do not match.";
  }
  return errors;
}

function Signup() {
  const { user, loading, error, clearError, signup, loginGoogle } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (!loading && user) {
    return <Navigate to="/profile" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    clearError();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }

    setSubmitting(true);
    await signup(form.email.trim(), form.password);
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
        <h2 className="form-title">Create your account</h2>
        <p className="auth-sub">Sign up to manage your profile</p>
      </div>

      <form className="detail-card" onSubmit={handleSubmit} noValidate>
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
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label className="filter-label">
            Password
            <input
              className="field"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </label>

          <label className="filter-label">
            Confirm password
            <input
              className="field"
              type="password"
              name="confirm"
              placeholder="Repeat the password"
              value={form.confirm}
              onChange={handleChange}
            />
            {errors.confirm && (
              <span className="field-error">{errors.confirm}</span>
            )}
          </label>
        </div>

        {error && <p className="field-error login-notice">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </div>

        <p className="auth-divider">or</p>
        <GoogleButton onClick={handleGoogle} disabled={busy} />

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;