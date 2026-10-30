import { Loader2 } from "lucide-react";

export default function SubmitButton({
  loading = false,
  loadingText = "Please wait...",
  icon: Icon,
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-studio-gold via-studio-goldBright to-studio-gold px-4 py-3.5 text-sm font-semibold tracking-wide text-studio-deep shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(212,175,55,0.35)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={17} className="animate-spin" aria-hidden="true" />
          {loadingText}
        </>
      ) : (
        <>
          {children}
          {Icon && (
            <Icon
              size={17}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </button>
  );
}
