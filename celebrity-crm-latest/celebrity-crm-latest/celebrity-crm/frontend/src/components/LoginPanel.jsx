import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import {
  ArrowLeft,
  Check,
  Loader2,
  Lock,
  Mail,
  Smartphone,
  X,
} from "lucide-react";
import ForgotPassword from "./ForgotPassword";
import Logo from "./Logo";
import OtpInput from "./OtpInput";
import PasswordField from "./PasswordField";
import { googleLogin, passwordLogin, sendOtp, verifyOtp } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import {
  errorClass,
  fieldWrapper,
  inputClass,
  labelClass,
  primaryButton,
} from "../styles/formStyles";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_KEY = "aurum_remembered_email";

const readRememberedEmail = () => {
  try {
    return localStorage.getItem(EMAIL_KEY) || "";
  } catch {
    return "";
  }
};

const storeRememberedEmail = (email, remember) => {
  try {
    if (remember) localStorage.setItem(EMAIL_KEY, email);
    else localStorage.removeItem(EMAIL_KEY);
  } catch {
    return;
  }
};

function RememberMe({ checked, onChange }) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 text-sm text-[#a39cb0] transition hover:text-[#ece8f0]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`flex h-[18px] w-[18px] items-center justify-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#d9a22b]/60 ${
          checked
            ? "border-[#d9a22b] bg-[#d9a22b]"
            : "border-white/20 bg-white/[0.04] group-hover:border-[#d9a22b]/60"
        }`}
      >
        {checked && (
          <Check className="h-3 w-3 text-[#1a1100]" strokeWidth={3} />
        )}
      </span>
      Remember me
    </label>
  );
}

export default function LoginPanel({ onClose }) {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const panelRef = useRef(null);
  const [view, setView] = useState("signin");
  const [method, setMethod] = useState("password");
  const [step, setStep] = useState("form");
  const [email, setEmail] = useState(readRememberedEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() => readRememberedEmail() !== "");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    panelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const mobileValid = /^[6-9]\d{9}$/.test(mobile);
  const passwordReady = emailPattern.test(email.trim()) && password.length > 0;

  const switchMethod = (next) => {
    setMethod(next);
    setStep("form");
    setOtp("");
    setError("");
  };

  const openForgot = () => {
    setError("");
    setPassword("");
    setView("forgot");
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await passwordLogin(email.trim(), password, remember);
      storeRememberedEmail(email.trim(), remember);
      signIn(data.user, remember);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We could not sign you in. Try again in a moment.",
      );
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobileValid) {
      setError("Enter a valid 10 digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendOtp(mobile);
      setStep("otp");
      setOtp("");
      setTimer(30);
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
    if (timer > 0) return;
    setError("");
    setLoading(true);
    try {
      await sendOtp(mobile);
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
      const { data } = await verifyOtp(mobile, otp, remember);
      signIn(data.user, remember);
      navigate("/dashboard");
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

  const handleGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      setError("");
      setLoading(true);
      try {
        const { data } = await googleLogin(code, remember);
        signIn(data.user, remember);
        navigate("/dashboard");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "This Google account does not have access.",
        );
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google sign in was cancelled. Try again."),
  });

  const goBack = () => {
    setStep("form");
    setOtp("");
    setError("");
  };

  const tabClass = (value) =>
    `flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a22b]/50 ${
      method === value
        ? "bg-[#d9a22b]/15 font-semibold text-[#f0c24d]"
        : "text-[#8b8596] hover:bg-white/[0.04] hover:text-[#ece8f0]"
    }`;

  const viewKey =
    view === "forgot" ? "forgot" : step === "otp" ? "otp" : "signin";

  const otpView = (
    <>
      <button
        type="button"
        onClick={goBack}
        className="mb-8 flex items-center gap-2 text-sm text-[#8b8596] transition hover:text-[#ece8f0] focus:outline-none focus-visible:text-[#d9a22b]"
      >
        <ArrowLeft className="h-4 w-4" />
        Change number
      </button>

      <h2 className="font-['Fraunces'] text-3xl font-light text-[#f6efe0]">
        Enter your code
      </h2>
      <p className="mt-2 text-sm text-[#8b8596]">
        We sent a 6 digit code to +91 {mobile.slice(0, 2)}••••••
        {mobile.slice(-2)}.
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
          Verify and sign in
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
    </>
  );

  const signInView = (
    <>
      <h2 className="font-['Fraunces'] text-3xl font-light text-[#f6efe0]">
        Welcome back
      </h2>
      <p className="mt-2 text-sm text-[#8b8596]">
        Sign in to your private workspace.
      </p>

      <button
        type="button"
        onClick={() => handleGoogle()}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-medium text-[#ece8f0] transition hover:-translate-y-0.5 hover:border-[#d9a22b]/60 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a22b]/50 disabled:opacity-50"
      >
        <FcGoogle className="h-5 w-5" />
        Continue with Google
      </button>

      <div className="my-7 flex items-center gap-4 text-xs text-[#6f687c]">
        <span className="h-px flex-1 bg-white/10" />
        or sign in with
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div
        role="tablist"
        className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={method === "password"}
          onClick={() => switchMethod("password")}
          className={tabClass("password")}
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={method === "mobile"}
          onClick={() => switchMethod("mobile")}
          className={tabClass("mobile")}
        >
          <Smartphone className="h-4 w-4" />
          Mobile OTP
        </button>
      </div>

      {method === "password" ? (
        <form onSubmit={handlePasswordLogin} noValidate>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <div className={fieldWrapper}>
            <span className="flex items-center border-r border-white/10 px-4 text-[#a39cb0]">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              className={inputClass}
            />
          </div>

          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Password from your admin"
            autoComplete="current-password"
            className="mt-5"
          />

          <div className="mt-4 flex items-center justify-between gap-4">
            <RememberMe checked={remember} onChange={setRemember} />
            <button
              type="button"
              onClick={openForgot}
              className="text-sm text-[#d9a22b] underline-offset-4 transition hover:text-[#f0c24d] hover:underline focus:outline-none focus-visible:underline"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p role="alert" className={errorClass}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !passwordReady}
            className={`mt-6 ${primaryButton}`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendOtp} noValidate>
          <label htmlFor="mobile" className={labelClass}>
            Mobile number
          </label>
          <div className={fieldWrapper}>
            <span className="flex items-center gap-2 border-r border-white/10 px-4 text-sm text-[#a39cb0]">
              <Smartphone className="h-4 w-4" />
              +91
            </span>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder="98765 43210"
              className={`${inputClass} tracking-wider`}
            />
          </div>

          <div className="mt-4">
            <RememberMe checked={remember} onChange={setRemember} />
          </div>

          {error && (
            <p role="alert" className={errorClass}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !mobileValid}
            className={`mt-6 ${primaryButton}`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send code
          </button>
        </form>
      )}
    </>
  );

  const content =
    view === "forgot" ? (
      <ForgotPassword onBack={() => setView("signin")} />
    ) : step === "otp" ? (
      otpView
    ) : (
      signInView
    );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      <motion.aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        initial={{ x: "110%" }}
        animate={{ x: 0 }}
        exit={{ x: "110%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed inset-y-3 right-3 z-50 flex w-[min(30rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-line bg-ink-900 font-['Manrope'] text-[#ece8f0] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] focus:outline-none"
      >
        <div className="flex items-center justify-between px-7 pt-6">
          <Logo />
          <button
            type="button"
            aria-label="Close sign in"
            onClick={onClose}
            className="rounded-full p-2 text-[#8b8596] transition hover:bg-white/5 hover:text-[#ece8f0]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 pb-8 pt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewKey}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>

          <p className="mt-10 flex items-center justify-center gap-2 text-xs text-[#6f687c]">
            <Lock className="h-3.5 w-3.5" />
            Access is limited to invited celebrities and their managers.
          </p>
        </div>
      </motion.aside>
    </>
  );
}
