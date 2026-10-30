import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, KeyRound } from "lucide-react";
import { authApi } from "../services/api";
import { isPasswordStrong, validateEmail } from "../utils/validation";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthNotice from "../components/AuthNotice";
import PasswordInput from "../components/PasswordInput";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import SubmitButton from "../components/SubmitButton";

// Matches app.otp.resend-cooldown-seconds on the backend.
const RESEND_COOLDOWN_SECONDS = 60;
const OTP_REGEX = /^\d{6}$/;

function secondsLeft(sentAt) {
  if (!sentAt) return 0;
  const elapsed = Math.floor((Date.now() - sentAt) / 1000);
  return Math.max(0, RESEND_COOLDOWN_SECONDS - elapsed);
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email")?.trim() || "";

  const [form, setForm] = useState({ otp: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState(
    location.state?.otpSentAt
      ? { type: "success", message: `If an account exists for ${email}, a 6-digit OTP has been sent.` }
      : null
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(() => secondsLeft(location.state?.otpSentAt));

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    const { name } = e.target;
    const value = name === "otp" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setNotice(null);
  };

  const handleResend = async () => {
    setNotice(null);
    try {
      setResending(true);
      await authApi.forgotPassword({ email });
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setNotice({ type: "success", message: "A new OTP has been sent if the account exists." });
    } catch (error) {
      setNotice({ type: "error", message: error.message || "Unable to resend the OTP." });
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!form.otp) {
      errors.otp = "OTP is required.";
    } else if (!OTP_REGEX.test(form.otp)) {
      errors.otp = "OTP must be 6 digits.";
    }

    if (!form.password) {
      errors.password = "New password is required.";
    } else if (!isPasswordStrong(form.password)) {
      errors.password = "Password does not meet all requirements.";
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    setNotice(null);

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      await authApi.resetPassword({ email, otp: form.otp, password: form.password });

      navigate("/login", {
        replace: true,
        state: { message: "Your password has been reset. Please sign in." },
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Unable to reset your password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!validateEmail(email)) {
    return (
      <div className="w-full max-w-md">
        <AuthCard>
          <AuthNotice
            notice={{
              type: "error",
              message: "We could not tell which account to reset. Please request a new OTP.",
            }}
          />
          <p className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-studio-goldBright transition hover:text-white"
            >
              Request a new OTP
            </Link>
          </p>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">

      <AuthCard>
        <h2 className="font-display text-xl font-semibold text-white">
          Reset your password
        </h2>
        <p className="mb-6 mt-1 text-sm text-studio-muted">
          Enter the code sent to <span className="text-studio-silver">{email}</span> and choose a
          new password.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <AuthInput
              id="otp"
              name="otp"
              label="6-digit OTP"
              icon={KeyRound}
              value={form.otp}
              onChange={handleChange}
              placeholder="123456"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              disabled={loading}
              error={fieldErrors.otp}
            />
            <div className="text-right">
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resending || loading}
                className="text-xs font-medium text-studio-goldBright transition hover:text-white disabled:cursor-not-allowed disabled:text-studio-muted"
              >
                {resending
                  ? "Sending..."
                  : cooldown > 0
                    ? `Resend OTP in ${cooldown}s`
                    : "Resend OTP"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <PasswordInput
              id="password"
              name="password"
              label="New password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a new password"
              autoComplete="new-password"
              disabled={loading}
              error={fieldErrors.password}
            />
            <PasswordStrengthMeter password={form.password} />
          </div>

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            disabled={loading}
            error={fieldErrors.confirmPassword}
          />

          <AuthNotice notice={notice} />

          <SubmitButton
            loading={loading}
            loadingText="Resetting password..."
            icon={ArrowRight}
          >
            Reset password
          </SubmitButton>
        </form>

        <p className="mt-6 border-t border-studio-border pt-5 text-center text-sm text-studio-muted">
          Remembered it?{" "}
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
