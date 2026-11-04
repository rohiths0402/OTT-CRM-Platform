import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import { authService } from "../../services/authService";
import "./AuthPages.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    productionHouseName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
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

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions.");
      return;
    }

    try {
      setLoading(true);

      await authService.register({
        fullName: form.fullName.trim(),
        // The backend calls the production house name "company".
        company: form.productionHouseName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.replace(/[\s-]/g, ""),
        password: form.password,
      });

      navigate("/login", {
        state: { message: "Account created successfully. Please sign in." },
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-heading">
        <h2>Create Account</h2>
        <p>Set up your production workspace.</p>
      </div>

      <form className="auth-card signup-card" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label htmlFor="fullName">Full name</label>
          <div className="auth-input-wrap">
            <User size={17} />
            <input
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="productionHouseName">Production house name</label>
          <div className="auth-input-wrap">
            <Building2 size={17} />
            <input
              id="productionHouseName"
              name="productionHouseName"
              placeholder="Enter production house name"
              value={form.productionHouseName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-email">Work email</label>
          <div className="auth-input-wrap">
            <Mail size={17} />
            <input
              id="signup-email"
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
          <label htmlFor="mobile">Mobile number</label>
          <div className="auth-input-wrap">
            <Phone size={17} />
            <input
              id="mobile"
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={form.mobile}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={17} />
            <input
              id="signup-password"
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
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={17} />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        <label className="remember-option terms-option">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <span>
            I agree to the terms and conditions.
          </span>
        </label>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
          {!loading && <ArrowRight size={17} />}
        </button>

        <div className="auth-bottom-text">
          Already have an account?
          <Link to="/login">Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}