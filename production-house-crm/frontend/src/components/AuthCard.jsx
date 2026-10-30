export default function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-studio-border bg-studio-card p-6 shadow-2xl shadow-black/60 sm:p-8 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-studio-gold/70 to-transparent"
      />
      {children}
    </div>
  );
}
