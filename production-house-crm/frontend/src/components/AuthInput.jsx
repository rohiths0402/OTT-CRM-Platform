import { forwardRef } from "react";

const AuthInput = forwardRef(function AuthInput(
  { id, label, icon: Icon, error, rightElement, ...inputProps },
  ref
) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-studio-silver">
        {label}
      </label>

      <div
        className={`flex min-h-12 items-center gap-3 rounded-xl border bg-studio-deep px-3.5 transition duration-300 focus-within:border-studio-gold focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.12)] ${
          error ? "border-red-500/70" : "border-studio-border hover:border-[#4a4a4a]"
        }`}
      >
        {Icon && (
          <Icon size={18} className="shrink-0 text-studio-gold" aria-hidden="true" />
        )}

        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-studio-muted/50 disabled:opacity-60"
          {...inputProps}
        />

        {rightElement}
      </div>

      {error && (
        <p id={errorId} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default AuthInput;
