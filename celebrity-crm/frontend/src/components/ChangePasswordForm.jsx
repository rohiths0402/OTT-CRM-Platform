import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import PasswordField from "./PasswordField";
import PasswordRules from "./PasswordRules";
import { changePassword } from "../api/authApi";
import { isStrongPassword } from "../utils/password";

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDone(false);
    if (!current) {
      setError("Enter your current password.");
      return;
    }
    if (!isStrongPassword(next)) {
      setError("The new password does not meet all the rules.");
      return;
    }
    if (next !== confirm) {
      setError("The new passwords do not match.");
      return;
    }
    if (next === current) {
      setError("Choose a password different from the current one.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We could not change your password. Try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-5">
      <PasswordField
        id="current-password"
        label="Current password"
        value={current}
        onChange={setCurrent}
        autoComplete="current-password"
        disabled={loading}
      />
      <div>
        <PasswordField
          id="new-password"
          label="New password"
          value={next}
          onChange={setNext}
          autoComplete="new-password"
          disabled={loading}
        />
        <PasswordRules value={next} />
      </div>
      <PasswordField
        id="confirm-password"
        label="Confirm new password"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        disabled={loading}
      />

      {error && (
        <p role="alert" className="text-sm text-rose-400">
          {error}
        </p>
      )}
      {done && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-aqua-400"
        >
          <CheckCircle2 className="h-4 w-4" />
          Password updated. Use it the next time you sign in.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="gold-btn flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Update password
      </button>
    </form>
  );
}
