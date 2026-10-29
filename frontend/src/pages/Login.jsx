import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import {
  ArrowLeft,
  CalendarClock,
  Crown,
  Eye,
  EyeOff,
  FileSignature,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import OtpInput from "../components/OtpInput";
import { googleLogin, passwordLogin, sendOtp, verifyOtp } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const highlights = [
  { icon: FileSignature, text: "Contracts and endorsements in one place" },
  { icon: CalendarClock, text: "Shooting schedules that follow you" },
  { icon: ShieldCheck, text: "Access only for invited profiles" },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const primaryButton =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#f0c24d] to-[#b8821a] py-3.5 text-sm font-semibold text-[#1a1100] shadow-[0_4px_14px_-4px_rgba(217,162,43,0.4)] transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a22b]/60 enabled:hover:-translate-y-0.5 enabled:hover:brightness-110 enabled:hover:shadow-[0_10px_26px_-6px_rgba(217,162,43,0.65)] enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40";

const fieldWrapper =
  "flex overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition hover:border-[#d9a22b]/50 focus-within:border-[#d9a22b] focus-within:ring-2 focus-within:ring-[#d9a22b]/30";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [method, setMethod] = useState("password");
  const [step, setStep] = useState("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const { data } = await passwordLogin(email.trim(), password);
      signIn(data.user);
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
      const { data } = await verifyOtp(mobile, otp);
      signIn(data.user);
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
        const { data } = await googleLogin(code);
        signIn(data.user);
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
        ? "bg-[#d9a22b]/12 font-semibold text-[#f0c24d]"
        : "text-[#8b8596] hover:text-[#ece8f0]"
    }`;

  return (
    <div className="flex min-h-screen bg-[#0c0a10] text-[#ece8f0] font-['Manrope']">
      <aside className="relative hidden w-[46%] overflow-hidden border-r border-white/5 lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 30% 0%, rgba(217,162,43,0.26), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(139,92,246,0.14), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -top-10 left-[18%] h-[130%] w-56 origin-top rotate-[14deg] opacity-40 blur-2xl"
          style={{
            background:
              "linear-gradient(to bottom, rgba(241,230,208,0.55), transparent 80%)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9a22b]/40 bg-[#d9a22b]/10">
            <Crown className="h-5 w-5 text-[#d9a22b]" />
          </div>
          <span className="font-['Fraunces'] text-xl tracking-wide text-[#f1e6d0]">
            Celebrity Suite
          </span>
        </div>

        <div className="relative max-w-md">
          <h1 className="font-['Fraunces'] text-5xl font-light leading-[1.1] text-[#f6efe0]">
            Backstage, kept private.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#a39cb0]">
            Your contracts, schedules, brand deals and payments, managed quietly
            and available only to you and your team.
          </p>
          <ul className="mt-10 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="group flex items-center gap-3 text-sm text-[#cfc8da] transition hover:translate-x-1 hover:text-[#f6efe0]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition group-hover:border-[#d9a22b]/60 group-hover:bg-[#d9a22b]/15">
                  <Icon className="h-4 w-4 text-[#d9a22b]" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-[#6f687c]">
          Invite only. Every sign in is protected and logged.
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9a22b]/40 bg-[#d9a22b]/10">
              <Crown className="h-5 w-5 text-[#d9a22b]" />
            </div>
            <span className="font-['Fraunces'] text-xl text-[#f1e6d0]">
              Celebrity Suite
            </span>
          </div>

          {step === "otp" ? (
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
                      className="text-[#d9a22b] underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
                    >
                      Resend code
                    </button>
                  )}
                </p>
              </form>
            </>
          ) : (
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
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-[#a39cb0]"
                  >
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
                      className="w-full bg-transparent px-4 py-3.5 text-base text-[#f1e6d0] placeholder-[#5a5468] outline-none"
                    />
                  </div>

                  <label
                    htmlFor="password"
                    className="mb-2 mt-5 block text-sm text-[#a39cb0]"
                  >
                    Password
                  </label>
                  <div className={fieldWrapper}>
                    <span className="flex items-center border-r border-white/10 px-4 text-[#a39cb0]">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password from your admin"
                      className="w-full bg-transparent px-4 py-3.5 text-base text-[#f1e6d0] placeholder-[#5a5468] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="flex items-center px-4 text-[#8b8596] transition hover:text-[#ece8f0] focus:outline-none focus-visible:text-[#d9a22b]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {error && (
                    <p role="alert" className="mt-3 text-sm text-rose-400">
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
                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm text-[#a39cb0]"
                  >
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
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="98765 43210"
                      className="w-full bg-transparent px-4 py-3.5 text-base tracking-wider text-[#f1e6d0] placeholder-[#5a5468] outline-none"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="mt-3 text-sm text-rose-400">
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
          )}

          <p className="mt-10 flex items-center justify-center gap-2 text-xs text-[#6f687c]">
            <Lock className="h-3.5 w-3.5" />
            Access is limited to invited celebrities and their managers.
          </p>
        </div>
      </main>
    </div>
  );
}
