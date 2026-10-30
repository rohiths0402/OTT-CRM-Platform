import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { fieldWrapper, inputClass, labelClass } from "../styles/formStyles";

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled = false,
  className = "",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className={fieldWrapper}>
        <span className="flex items-center border-r border-white/10 px-4 text-[#a39cb0]">
          <Lock className="h-4 w-4" />
        </span>
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="flex items-center px-4 text-[#8b8596] transition hover:text-[#ece8f0] focus:outline-none focus-visible:text-[#d9a22b]"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
