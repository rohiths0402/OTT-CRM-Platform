import { Clapperboard } from "lucide-react";

export default function BrandPanel({ content }) {
  return (
    <aside className="relative isolate flex min-h-[380px] flex-col justify-between overflow-hidden bg-studio-deep sm:min-h-[460px] lg:sticky lg:top-0 lg:h-screen lg:min-h-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 scale-105 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/production.jpg')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-gradient-to-r from-studio-deep/95 via-studio-deep/80 to-studio-deep/45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-gradient-to-t from-studio-deep via-studio-deep/20 to-studio-deep/70"
      />
      <div aria-hidden="true" className="film-grain absolute inset-0 -z-10" />

      <div className="relative flex items-center gap-3 p-8 sm:p-12">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-studio-gold/40 bg-studio-deep/60 text-studio-gold">
          <Clapperboard size={22} aria-hidden="true" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-studio-silver">
          Production House CRM
        </span>
      </div>

      <div className="relative px-8 sm:px-12 xl:px-16">
        <div className="mb-6 h-px w-20 bg-gradient-to-r from-studio-gold to-transparent" />

        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">
          {content.heading}
        </h2>

        <p className="mt-5 hidden max-w-lg text-sm leading-7 text-studio-muted sm:block xl:text-base">
          {content.description}
        </p>

        <ul className="mt-8 hidden space-y-4 md:block">
          {content.features.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-4 border-t border-studio-gold/15 pt-4 first:border-t-0 first:pt-0"
            >
              <Icon size={18} className="shrink-0 text-studio-gold" aria-hidden="true" />
              <span className="text-sm font-medium tracking-wide text-studio-silver">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative px-8 pb-8 sm:px-12 sm:pb-12 xl:px-16">
        <div className="mb-5 h-px w-full bg-gradient-to-r from-studio-gold/60 via-studio-gold/20 to-transparent" />
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-studio-goldBright">
          {content.tagline}
        </p>
      </div>
    </aside>
  );
}
