import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import { authService } from "../../services/authService";
import "./AuthPages.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const result = await authService.forgotPassword(email.trim());

      navigate("/reset-password", {
        state: { email: email.trim(), message: result.message },
      });
    } catch (err) {
      setError(err.message || "Unable to send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-heading">
        <h2>Forgot Password</h2>
        <p>Enter your account email and we'll send you a 6-digit code.</p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label htmlFor="forgot-email">Work email</label>

          <div className="auth-input-wrap">
            <Mail size={17} />
            <input
              id="forgot-email"
              type="email"
              name="email"
              placeholder="you@production.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Sending code..." : "Send code"}
          {!loading && <ArrowRight size={17} />}
        </button>

        <div className="auth-bottom-text">
          Remembered it?
          <Link to="/login">Back to sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
