import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

function Profile() {
  const { user, error, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    const ok = await logout();
    if (ok) {
      navigate("/", { replace: true });
    }
  }

  return (
    <section className="login">
      <h2 className="form-title">Profile</h2>

      <div className="detail-card">
        <dl className="specs profile-specs">
          <div className="spec">
            <dt>Email</dt>
            <dd>{user?.email}</dd>
          </div>
          <div className="spec">
            <dt>UID</dt>
            <dd className="uid">{user?.uid}</dd>
          </div>
        </dl>

        {error && <p className="field-error login-notice">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default Profile;