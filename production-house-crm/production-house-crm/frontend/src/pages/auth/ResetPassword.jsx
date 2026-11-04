import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  KeyRound,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import { authService } from "../../services/authService";
import "./AuthPages.css";

// Matches the backend's resend cooldown.
const RESEND_SECONDS = 60;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(location.state?.message || "");
  const [resendIn, setResendIn] = useState(
    location.state?.email ? RESEND_SECONDS : 0
  );

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: name === "otp" ? value.replace(/\D/g, "").slice(0, 6) : value,
    });
  };

  const handleResend = async () => {
    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      const result = await authService.forgotPassword(form.email.trim());
      setInfo(result.message);
      setResendIn(RESEND_SECONDS);
    } catch (err) {
      setError(err.message || "Unable to send the code. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(form.otp)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        email: form.email.trim(),
        otp: form.otp,
        password: form.password,
      });

      navigate("/login", {
        state: { message: "Password reset successfully. Please sign in." },
      });
    } catch (err) {
      setError(err.message || "Unable to reset the password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-heading">
        <h2>Reset Password</h2>
        <p>Enter the code from your email and choose a new password.</p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {!error && info && <div className="auth-success">{info}</div>}

        <div className="auth-field">
          <label htmlFor="reset-email">Work email</label>
          <div className="auth-input-wrap">
            <Mail size={17} />
            <input
              id="reset-email"
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
          <label htmlFor="reset-otp">Verification code</label>
          <div className="auth-input-wrap">
            <KeyRound size={17} />
            <input
              id="reset-otp"
              name="otp"
              inputMode="numeric"
              placeholder="6-digit code"
              value={form.otp}
              onChange={handleChange}
              autoComplete="one-time-code"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="reset-password">New password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={17} />
            <input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
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

        <div className="auth-field">
          <label htmlFor="reset-confirm">Confirm new password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={17} />
            <input
              id="reset-confirm"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter your new password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <div className="auth-options">
          <span className="remember-option">Didn't get the code?</span>
          {resendIn > 0 ? (
            <span className="remember-option">Resend in {resendIn}s</span>
          ) : (
            <button
              type="button"
              className="auth-link auth-link-button"
              onClick={handleResend}
            >
              Resend code
            </button>
          )}
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
          {!loading && <ArrowRight size={17} />}
        </button>

        <div className="auth-bottom-text">
          <Link to="/login">Back to sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
