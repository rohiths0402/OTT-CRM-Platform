import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import { authService } from "../../services/authService";
import "./AuthPages.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // authService stores the token in sessionStorage for api.js to send.
      await authService.login({
        email: form.email.trim(),
        password: form.password,
        rememberMe,
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <div className="auth-heading">
        <h2>Login</h2>
        <p>Sign in to continue managing your productions.</p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {!error && successMessage && (
          <div className="auth-success">{successMessage}</div>
        )}

        <div className="auth-field">
          <label htmlFor="login-email">Work email</label>

          <div className="auth-input-wrap">
            <Mail size={17} />
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@production.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>

          <div className="auth-input-wrap">
            <LockKeyhole size={17} />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="auth-options">
          <label className="remember-option">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight size={17} />}
        </button>

        <div className="auth-divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <button
          type="button"
          className="social-button google-button"
          onClick={() => setError("Google authentication is not configured yet.")}
        >
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <button
          type="button"
          className="social-button apple-button"
          onClick={() => setError("Apple authentication is not configured yet.")}
        >
          <span className="apple-icon">●</span>
          Continue with Apple
        </button>

        <div className="auth-bottom-text">
          Don't have an account?
          <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </AuthLayout>
  );
}