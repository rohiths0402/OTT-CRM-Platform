import { AlertCircle, CheckCircle2 } from "lucide-react";

// notice: { type: "success" | "error", message: string }
export default function AuthNotice({ notice }) {
  if (!notice?.message) return null;

  const isError = notice.type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;
  // Error red is kept for clear, accessible error feedback.
  const color = isError
    ? "border-red-400/30 bg-red-400/10 text-red-200"
    : "border-studio-gold/30 bg-studio-gold/10 text-studio-goldBright";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${color}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p>{notice.message}</p>
    </div>
  );
}
