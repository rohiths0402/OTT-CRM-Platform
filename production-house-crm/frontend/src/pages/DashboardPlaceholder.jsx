// Temporary post-login destination. The real dashboard is built in a later phase.
export default function DashboardPlaceholder() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-studio-deep px-4 text-white">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold">Dashboard coming soon</h1>
        <p className="mt-2 text-sm text-studio-muted">
          Sign-in redirects here. The dashboard will be built in a later phase.
        </p>
      </div>
    </main>
  );
}
