import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import AuthInput from "./AuthInput";

export default function PasswordInput({ id, label, error, disabled, ...rest }) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthInput
      id={id}
      label={label}
      icon={LockKeyhole}
      error={error}
      disabled={disabled}
      {...rest}
      type={visible ? "text" : "password"}
      rightElement={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          disabled={disabled}
          className="shrink-0 rounded-md p-1 text-studio-muted transition hover:text-studio-goldBright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold disabled:opacity-50"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}
