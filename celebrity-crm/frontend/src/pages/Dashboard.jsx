import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  Clapperboard,
  FileSignature,
  LayoutDashboard,
  LineChart,
  LogOut,
  Megaphone,
  Menu,
  ShieldCheck,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import Logo from "../components/Logo";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: UserRound, label: "My profile" },
  { icon: FileSignature, label: "Contracts" },
  { icon: Megaphone, label: "Endorsements" },
  { icon: CalendarClock, label: "Schedule" },
  { icon: Clapperboard, label: "OTT projects" },
  { icon: Wallet, label: "Payments" },
  { icon: LineChart, label: "Analytics" },
  { icon: ShieldCheck, label: "Security" },
];

const stats = [
  { label: "Active contracts", value: "6", note: "2 expiring this quarter" },
  { label: "Endorsements live", value: "4", note: "1 awaiting approval" },
  { label: "Shoots this month", value: "9", note: "3 outside the city" },
  { label: "Payments due", value: "3", note: "Next on 5 Nov" },
];

const schedule = [
  {
    title: "Series 2 - Night shoot",
    place: "Film City, Hyderabad",
    when: "Fri, 7:00 PM",
    status: "Confirmed",
  },
  {
    title: "Brand film - Aster Watches",
    place: "Studio 4, Chennai",
    when: "Mon, 10:30 AM",
    status: "Pending",
  },
  {
    title: "Promo interview",
    place: "Remote",
    when: "Wed, 4:00 PM",
    status: "Confirmed",
  },
];

const payments = [
  { from: "Northlight Productions", amount: "4,50,000", status: "Pending" },
  { from: "Aster Watches", amount: "2,00,000", status: "Paid" },
  { from: "Velvet Originals", amount: "6,75,000", status: "Overdue" },
];

const statusStyle = {
  Confirmed: "border-aqua-400/30 bg-aqua-400/10 text-aqua-400",
  Paid: "border-aqua-400/30 bg-aqua-400/10 text-aqua-400",
  Pending: "border-gold-400/30 bg-gold-400/10 text-gold-400",
  Overdue: "border-rose-400/30 bg-rose-400/10 text-rose-400",
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const name = user?.name || "there";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-ink-950">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-ink-900 p-5 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="text-mute lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 flex-1 space-y-1">
          {navItems.map(({ icon: Icon, label }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setActive(label);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-gold-400/15 text-gold-300"
                    : "text-mute hover:bg-gold-400/10 hover:text-gold-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-mute transition hover:bg-ink-800 hover:text-rose-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-ink-950/90 px-6 py-4 backdrop-blur">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="text-ivory lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="hidden text-sm text-mute lg:block">{active}</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ivory">{name}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-500/40 bg-ink-800 text-sm font-semibold text-gold-300">
              {initial}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10">
          {active === "Security" ? (
            <>
              <h1 className="font-display text-4xl font-light text-ivory">
                Security
              </h1>
              <p className="mt-2 text-sm text-mute">
                Change the password you use to sign in with your email.
              </p>
              <div className="mt-8 rounded-2xl border border-line bg-ink-900 p-6 sm:p-8">
                <ChangePasswordForm />
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-4xl font-light text-ivory">
                Welcome back, {name}
              </h1>
              <p className="mt-2 text-sm text-mute">
                Here is what needs your attention. Figures shown are sample
                data.
              </p>

              <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-line bg-ink-900 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/50"
                  >
                    <p className="text-sm text-mute">{item.label}</p>
                    <p className="mt-2 font-display text-4xl text-gold-300">
                      {item.value}
                    </p>
                    <p className="mt-2 text-xs text-mute">{item.note}</p>
                  </div>
                ))}
              </section>

              <section className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-line bg-ink-900 p-6">
                  <h2 className="text-base font-semibold text-ivory">
                    Upcoming schedule
                  </h2>
                  <ul className="mt-5 divide-y divide-line">
                    {schedule.map((item) => (
                      <li
                        key={item.title}
                        className="-mx-3 flex items-center justify-between gap-4 rounded-lg px-3 py-4 transition hover:bg-gold-400/5"
                      >
                        <div>
                          <p className="text-sm text-ivory">{item.title}</p>
                          <p className="mt-0.5 text-xs text-mute">
                            {item.place}, {item.when}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs ${statusStyle[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-line bg-ink-900 p-6">
                  <h2 className="text-base font-semibold text-ivory">
                    Payments
                  </h2>
                  <ul className="mt-5 divide-y divide-line">
                    {payments.map((item) => (
                      <li
                        key={item.from}
                        className="-mx-3 flex items-center justify-between gap-4 rounded-lg px-3 py-4 transition hover:bg-gold-400/5"
                      >
                        <div>
                          <p className="text-sm text-ivory">{item.from}</p>
                          <p className="mt-0.5 text-xs text-mute">
                            Rs. {item.amount}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs ${statusStyle[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
