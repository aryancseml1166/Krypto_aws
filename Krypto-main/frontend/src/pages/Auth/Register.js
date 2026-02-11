import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api";
import "./auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", { email, password });
      toast.success("Account created. Sign in to continue.");
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed. Try another email.";
      setError(message);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-pattern" aria-hidden="true" />
      <div className="auth-wrapper">
        <div className="auth-card">
          <header className="auth-header">
            <div className="auth-logo" aria-hidden="true">₿</div>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Join Krypto and track your portfolio</p>
          </header>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                className={`auth-input ${error ? "error" : ""}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                className={`auth-input ${error ? "error" : ""}`}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
              {error && <p className="auth-error-msg">{error}</p>}
            </div>

            <button
              type="submit"
              className="auth-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <span className="auth-btn-loading">
                  <span className="auth-btn-spinner" />
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
