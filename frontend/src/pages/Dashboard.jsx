import { Link } from "react-router-dom";
import {
  CalendarClock,
  FileSignature,
  LineChart,
  Megaphone,
  Wallet,
} from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const upcoming = [
  {
    title: "Series 2 - Night shoot",
    place: "Film City, Hyderabad",
    when: "Fri, 7:00 PM",
    tone: "text-aqua-400",
  },
  {
    title: "Brand film - Aster Watches",
    place: "Studio 4, Chennai",
    when: "Mon, 10:30 AM",
    tone: "text-gold-400",
  },
  {
    title: "Promo interview",
    place: "Remote",
    when: "Wed, 4:00 PM",
    tone: "text-aqua-400",
  },
];

const modules = [
  { icon: FileSignature, label: "Contracts" },
  { icon: Megaphone, label: "Endorsements" },
  { icon: CalendarClock, label: "Schedules" },
  { icon: Wallet, label: "Payments" },
  { icon: LineChart, label: "Analytics" },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 0%, rgba(217,162,43,0.22), transparent 70%), radial-gradient(ellipse 50% 45% at 95% 90%, rgba(63,214,198,0.08), transparent 70%)",
        }}
      />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="gold-btn rounded-xl px-6 py-2.5 text-sm font-semibold"
        >
          {isAuthenticated ? "Open dashboard" : "Sign in"}
        </Link>
      </header>

      <main className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-10 lg:grid-cols-[1fr_1.05fr] lg:pt-20">
        <section>
          <h1 className="font-display text-5xl font-light leading-[1.08] text-ivory sm:text-6xl">
            Your career, managed in one private room.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-mute">
            Contracts, brand deals, shooting schedules and payments, available
            only to you and the team you invite.
          </p>
          <ul className="mt-10 flex flex-wrap gap-3">
            {modules.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-line bg-ink-900 px-4 py-2 text-sm text-ivory transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/70 hover:bg-gold-400/10 hover:text-gold-300"
              >
                <Icon className="h-4 w-4 text-gold-400" />
                {label}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-label="Dashboard preview"
          className="rounded-3xl border border-line bg-ink-900/80 p-6 backdrop-blur"
        >
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Active contracts", value: "6" },
              { label: "Shoots this month", value: "9" },
              { label: "Payments due", value: "3" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-line bg-ink-800 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/50"
              >
                <p className="font-display text-3xl text-gold-300">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-mute">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-line bg-ink-800 p-5">
            <p className="text-sm font-semibold text-ivory">This week</p>
            <ul className="mt-4 space-y-4">
              {upcoming.map((item) => (
                <li
                  key={item.title}
                  className="-mx-2 flex items-start justify-between gap-4 rounded-lg px-2 py-1.5 transition hover:bg-gold-400/10"
                >
                  <div>
                    <p className="text-sm text-ivory">{item.title}</p>
                    <p className="mt-0.5 text-xs text-mute">{item.place}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-medium ${item.tone}`}>
                    {item.when}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-center text-xs text-mute">
            Preview with sample data. Sign in to see your own workspace.
          </p>
        </section>
      </main>
    </div>
  );
}
