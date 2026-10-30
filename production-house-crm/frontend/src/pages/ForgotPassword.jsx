import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { authApi } from "../services/api";
import { validateEmail } from "../utils/validation";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthNotice from "../components/AuthNotice";
import SubmitButton from "../components/SubmitButton";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setFieldError("");
    setNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);

    if (!email.trim()) {
      setFieldError("Email address is required.");
      return;
    }

    if (!validateEmail(email)) {
      setFieldError("Enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const trimmed = email.trim();
      await authApi.forgotPassword({ email: trimmed });

      navigate(`/reset-password?email=${encodeURIComponent(trimmed)}`, {
        state: { otpSentAt: Date.now() },
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Unable to send the OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">

      <AuthCard>
        <h2 className="font-display text-xl font-semibold text-white">
          Forgot your password?
        </h2>
        <p className="mb-6 mt-1 text-sm text-studio-muted">
          Enter your email and we will send you a 6-digit code to reset it.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            icon={Mail}
            value={email}
            onChange={handleChange}
            placeholder="you@production.com"
            autoComplete="email"
            disabled={loading}
            error={fieldError}
          />

          <AuthNotice notice={notice} />

          <SubmitButton
            loading={loading}
            loadingText="Sending OTP..."
            icon={Send}
          >
            Send OTP
          </SubmitButton>
        </form>

        <p className="mt-6 border-t border-studio-border pt-5 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-studio-goldBright transition hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sign in
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
