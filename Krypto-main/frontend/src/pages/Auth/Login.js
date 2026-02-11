import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api";
import "./auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userEmail", email.trim());
      toast.success("Welcome back!");
      if (res.data.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
      toast.error("Invalid credentials");
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
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your Krypto account</p>
          </header>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
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
              <label className="auth-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className={`auth-input ${error ? "error" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              {error && <p className="auth-error-msg">{error}</p>}
            </div>

            <button
              type="submit"
              className="auth-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="auth-btn-loading">
                  <span className="auth-btn-spinner" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>New user? <Link to="/register">Create account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
