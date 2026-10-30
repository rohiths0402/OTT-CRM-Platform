import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { authApi } from "../services/api";
import { validateEmail } from "../utils/validation";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthNotice from "../components/AuthNotice";
import PasswordInput from "../components/PasswordInput";
import SocialAuthButtons from "../components/SocialAuthButtons";
import SubmitButton from "../components/SubmitButton";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState(
    location.state?.message
      ? { type: "success", message: location.state.message }
      : null
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!validateEmail(form.email)) {
      errors.email = "Enter a valid email address.";
    }

    // Login only checks presence; the password policy applies at signup/reset.
    if (!form.password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    setNotice(null);

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);

      await authApi.login({
        email: form.email.trim(),
        password: form.password,
        rememberMe,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Unable to sign in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Welcome Back
        </h1>
        <p className="mt-3 text-sm leading-6 text-studio-muted">
          Sign in to continue managing your productions.
        </p>
      </div>

      <AuthCard>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Work email"
            icon={Mail}
            value={form.email}
            onChange={handleChange}
            placeholder="you@production.com"
            autoComplete="email"
            disabled={loading}
            error={fieldErrors.email}
          />

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
            error={fieldErrors.password}
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-studio-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="h-4 w-4 cursor-pointer rounded border-studio-border bg-studio-deep accent-studio-gold"
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-studio-goldBright transition hover:text-white"
            >
              Forgot password?
            </Link>
          </div>

          <AuthNotice notice={notice} />

          <SubmitButton
            loading={loading}
            loadingText="Signing in..."
            icon={ArrowRight}
          >
            Sign in
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
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-studio-goldBright transition hover:text-white"
          >
            Sign up
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
