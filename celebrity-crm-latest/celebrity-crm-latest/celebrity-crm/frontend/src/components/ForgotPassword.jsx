import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import OtpInput from "./OtpInput";
import PasswordField from "./PasswordField";
import PasswordRules from "./PasswordRules";
import {
  requestPasswordReset,
  resetPassword,
  verifyResetOtp,
} from "../api/authApi";
import { isStrongPassword } from "../utils/password";
import {
  errorClass,
  fieldWrapper,
  inputClass,
  labelClass,
  primaryButton,
} from "../styles/formStyles";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^[6-9]\d{9}$/;

function parseIdentifier(raw) {
  const value = raw.trim();
  if (value.includes("@")) {
    return emailPattern.test(value)
      ? { channel: "EMAIL", identifier: value }
      : null;
  }
  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  return mobilePattern.test(digits)
    ? { channel: "MOBILE", identifier: digits }
    : null;
}

function maskTarget({ channel, identifier }) {
  if (channel === "MOBILE") {
    return `+91 ${identifier.slice(0, 2)}••••••${identifier.slice(-2)}`;
  }
  const [name, domain] = identifier.split("@");
  return `${name.slice(0, 2)}••••@${domain}`;
}

export default function ForgotPassword({ onBack }) {
  const [step, setStep] = useState("identify");
  const [input, setInput] = useState("");
  const [target, setTarget] = useState(null);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const passwordsMatch = newPassword === confirmPassword;
  const canReset =
    isStrongPassword(newPassword) &&
    confirmPassword.length > 0 &&
    passwordsMatch;

  const handleIdentify = async (e) => {
    e.preventDefault();
    const parsed = parseIdentifier(input);
    if (!parsed) {
      setError("Enter a valid email address or 10 digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(parsed.identifier, parsed.channel);
      setTarget(parsed);
      setOtp("");
      setTimer(30);
      setStep("otp");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We could not send the code. Try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !target) return;
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(target.identifier, target.channel);
      setOtp("");
      setTimer(30);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We could not resend the code. Try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6 digit code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await verifyResetOtp(
        target.identifier,
        target.channel,
        otp,
      );
      setResetToken(data.resetToken);
      setStep("reset");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "That code did not work. Check it and try again.",
      );
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(newPassword)) {
      setError("Your password does not meet all the requirements below.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setStep("done");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We could not update your password. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const backToIdentify = () => {
    setStep("identify");
    setOtp("");
    setError("");
  };

  const backLink =
    "mb-8 flex items-center gap-2 text-sm text-[#8b8596] transition hover:text-[#ece8f0] focus:outline-none focus-visible:text-[#d9a22b]";

  if (step === "done") {
    return (
      <div>
        <CheckCircle2 className="h-10 w-10 text-[#3fd6c6]" />
        <h2 className="mt-6 font-['Fraunces'] text-3xl font-light text-[#f6efe0]">
          Password updated
        </h2>
        <p className="mt-2 text-sm text-[#8b8596]">
          You can now sign in with your new password.
        </p>
        <button
          type="button"
          onClick={onBack}
          className={`mt-8 ${primaryButton}`}
        >
          Back to sign in
        </button>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div>
        <h2 className="font-['Fraunces'] text-3xl font-light text-[#f6efe0]">
          Set a new password
        </h2>
        <p className="mt-2 text-sm text-[#8b8596]">
          Choose a password you have not used before.
        </p>

        <form onSubmit={handleReset} className="mt-8" noValidate>
          <PasswordField
            id="new-password"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Create a password"
            autoComplete="new-password"
          />
          <PasswordRules value={newPassword} />

          <PasswordField
            id="confirm-password"
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Type it again"
            autoComplete="new-password"
            className="mt-5"
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p role="alert" className="mt-2 text-xs text-rose-400">
              Passwords do not match.
            </p>
          )}

          {error && (
            <p role="alert" className={errorClass}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !canReset}
            className={`mt-6 ${primaryButton}`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update password
          </button>
        </form>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div>
        <button type="button" onClick={backToIdentify} className={backLink}>
          <ArrowLeft className="h-4 w-4" />
          Change {target.channel === "EMAIL" ? "email" : "number"}
        </button>

        <h2 className="font-['Fraunces'] text-3xl font-light text-[#f6efe0]">
          Enter your code
        </h2>
        <p className="mt-2 text-sm text-[#8b8596]">
          We sent a 6 digit code to {maskTarget(target)}.
        </p>

        <form onSubmit={handleVerify} className="mt-8" noValidate>
          <OtpInput value={otp} onChange={setOtp} disabled={loading} />

          {error && (
            <p role="alert" className="mt-4 text-sm text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`mt-7 ${primaryButton}`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Verify code
          </button>

          <p className="mt-5 text-center text-sm text-[#8b8596]">
            {timer > 0 ? (
              <>Resend code in {timer}s</>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-[#d9a22b] underline-offset-4 transition hover:text-[#f0c24d] hover:underline focus:outline-none focus-visible:underline"
              >
                Resend code
              </button>
            )}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={onBack} className={backLink}>
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </button>

      <h2 className="font-['Fraunces'] text-3xl font-light text-[#f6efe0]">
        Forgot password?
      </h2>
      <p className="mt-2 text-sm text-[#8b8596]">
        Enter your registered email or mobile number and we will send you a
        code.
      </p>

      <form onSubmit={handleIdentify} className="mt-8" noValidate>
        <label htmlFor="identifier" className={labelClass}>
          Email or mobile number
        </label>
        <div className={fieldWrapper}>
          <span className="flex items-center border-r border-white/10 px-4 text-[#a39cb0]">
            <Mail className="h-4 w-4" />
          </span>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="name@gmail.com or 98765 43210"
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className={errorClass}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || input.trim().length === 0}
          className={`mt-6 ${primaryButton}`}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Send code
        </button>
      </form>
    </div>
  );
}
