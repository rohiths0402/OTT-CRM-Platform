import { Check, X } from "lucide-react";
import { getPasswordChecks } from "../utils/validation";

const TOTAL = 5;

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const checks = getPasswordChecks(password);
  const score = checks.filter((check) => check.met).length;

  let label = "Weak";
  let barColor = "bg-studio-silver/60";
  let textColor = "text-studio-silver";

  if (score === TOTAL) {
    label = "Strong";
    barColor = "bg-studio-goldBright";
    textColor = "text-studio-goldBright";
  } else if (score >= 3) {
    label = "Good";
    barColor = "bg-studio-gold";
    textColor = "text-studio-gold";
  }

  return (
    <div className="space-y-2.5 pt-1" aria-live="polite">
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: TOTAL }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? barColor : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-studio-muted">Password strength</span>
        <span className={`font-medium ${textColor}`}>{label}</span>
      </div>

      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {checks.map((check) => (
          <li
            key={check.id}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              check.met ? "text-studio-goldBright" : "text-studio-muted/60"
            }`}
          >
            {check.met ? <Check size={13} /> : <X size={13} />}
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
