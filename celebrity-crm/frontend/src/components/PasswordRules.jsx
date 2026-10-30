import { Check, Circle } from "lucide-react";
import { passwordRules } from "../utils/password";

export default function PasswordRules({ value }) {
  return (
    <ul
      aria-label="Password requirements"
      className="mt-3 grid gap-1.5 sm:grid-cols-2"
    >
      {passwordRules.map((rule) => {
        const met = rule.test(value);
        return (
          <li
            key={rule.id}
            className={`flex items-center gap-2 text-xs transition ${
              met ? "text-[#3fd6c6]" : "text-[#8b8596]"
            }`}
          >
            {met ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Circle className="h-3.5 w-3.5" />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
