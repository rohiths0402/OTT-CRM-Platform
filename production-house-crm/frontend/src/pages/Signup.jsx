import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Building2, Mail, Phone, ArrowRight } from "lucide-react";
import { authApi } from "../services/api";
import {
  isPasswordStrong,
  normalizeMobile,
  validateEmail,
  validateMobile,
} from "../utils/validation";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthNotice from "../components/AuthNotice";
import PasswordInput from "../components/PasswordInput";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import SocialAuthButtons from "../components/SocialAuthButtons";
import SubmitButton from "../components/SubmitButton";

const INITIAL_FORM = {
  fullName: "",
  company: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
};

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setNotice(null);
  };

  const validate = () => {
    const errors = {};

    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }

    if (!form.company.trim()) {
      errors.company = "Production house name is required.";
    }

    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!validateEmail(form.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!form.mobile.trim()) {
      errors.mobile = "Mobile number is required.";
    } else if (!validateMobile(form.mobile)) {
      errors.mobile = "Enter a valid mobile number (10 to 15 digits).";
    }

    if (!form.password) {
      errors.password = "Password is required.";
    } else if (!isPasswordStrong(form.password)) {
      errors.password = "Password does not meet all requirements.";
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!acceptedTerms) {
      errors.terms = "You must accept the Terms and Conditions to continue.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    setNotice(null);

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);

      // acceptedTerms is enforced client-side only; the backend does not store it.
      await authApi.signup({
        fullName: form.fullName.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        mobile: normalizeMobile(form.mobile),
        password: form.password,
      });

      setNotice({
        type: "success",
        message: "Account created successfully! Redirecting to sign in...",
      });

      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Account created successfully. Please sign in.",
          },
        });
      }, 1200);
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error.message || "Unable to create your account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Create Your Account
        </h1>
        <p className="mt-3 text-sm leading-6 text-studio-muted">
          Start managing your production house with confidence.
        </p>
      </div>

      <AuthCard>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <AuthInput
              id="fullName"
              name="fullName"
              label="Full name"
              icon={User}
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={loading}
              error={fieldErrors.fullName}
            />

            <AuthInput
              id="company"
              name="company"
              label="Production house name"
              icon={Building2}
              value={form.company}
              onChange={handleChange}
              placeholder="Your company name"
              autoComplete="organization"
              disabled={loading}
              error={fieldErrors.company}
            />

            <AuthInput
              id="email"
              name="email"
              type="email"
              label="Email address"
              icon={Mail}
              value={form.email}
              onChange={handleChange}
              placeholder="you@production.com"
              autoComplete="email"
              disabled={loading}
              error={fieldErrors.email}
            />

            <AuthInput
              id="mobile"
              name="mobile"
              type="tel"
              label="Mobile number"
              icon={Phone}
              value={form.mobile}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              autoComplete="tel"
              disabled={loading}
              error={fieldErrors.mobile}
            />

            <div className="space-y-3">
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create password"
                autoComplete="new-password"
                disabled={loading}
                error={fieldErrors.password}
              />
              <PasswordStrengthMeter password={form.password} />
            </div>

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              autoComplete="new-password"
              disabled={loading}
              error={fieldErrors.confirmPassword}
            />
          </div>

          <div className="space-y-2">
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-studio-muted">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  setFieldErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                disabled={loading}
                aria-invalid={Boolean(fieldErrors.terms)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-studio-border bg-studio-deep accent-studio-gold"
              />
              <span>I agree to the Terms and Conditions</span>
            </label>
            {fieldErrors.terms && (
              <p className="text-xs text-red-400">{fieldErrors.terms}</p>
            )}
          </div>

          <AuthNotice notice={notice} />

          <SubmitButton
            loading={loading}
            loadingText="Creating account..."
            icon={ArrowRight}
          >
            Create account
          </SubmitButton>
        </form>

        <div className="relative my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-studio-border" />
          <span className="text-[10px] uppercase tracking-[0.18em] text-studio-muted">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-studio-border" />
        </div>

        <SocialAuthButtons
          onError={(message) => setNotice({ type: "error", message })}
        />

        <p className="mt-6 border-t border-studio-border pt-5 text-center text-sm text-studio-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-studio-goldBright transition hover:text-white"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
