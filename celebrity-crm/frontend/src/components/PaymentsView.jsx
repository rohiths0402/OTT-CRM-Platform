import { ArrowUpRight, Banknote, CalendarClock, CircleDollarSign } from "lucide-react";
import { pendingPayments, recentPayments } from "../data/mock";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function PaymentsView() {
  const clearedTotal = recentPayments.reduce((sum, item) => sum + item.amount, 0);
  const pendingTotal = pendingPayments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-light text-ivory">Payments</h2>
          <p className="mt-2 text-sm text-mute">
            Recent settlements and pending advances across your projects.
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-line bg-ink-900 px-4 py-2 text-sm text-ivory transition hover:border-gold-400/60 hover:text-gold-300"
        >
          Export summary
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-line bg-ink-900 p-5">
          <div className="flex items-center justify-between text-mute">
            <span className="text-xs uppercase tracking-[0.2em]">Cleared</span>
            <CircleDollarSign className="h-4 w-4 text-aqua-400" />
          </div>
          <p className="mt-4 font-display text-4xl text-aqua-400">{money(clearedTotal)}</p>
        </div>
        <div className="rounded-3xl border border-line bg-ink-900 p-5">
          <div className="flex items-center justify-between text-mute">
            <span className="text-xs uppercase tracking-[0.2em]">Pending</span>
            <CalendarClock className="h-4 w-4 text-gold-400" />
          </div>
          <p className="mt-4 font-display text-4xl text-gold-300">{money(pendingTotal)}</p>
        </div>
        <div className="rounded-3xl border border-line bg-ink-900 p-5">
          <div className="flex items-center justify-between text-mute">
            <span className="text-xs uppercase tracking-[0.2em]">Net</span>
            <Banknote className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-4 font-display text-4xl text-rose-400">
            {money(clearedTotal - pendingTotal)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-line bg-ink-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ivory">Recent payments</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-mute">Last 3</span>
          </div>

          <ul className="space-y-3">
            {recentPayments.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ink-800/60 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-ivory">{item.title}</p>
                  <p className="mt-1 text-xs text-mute">
                    {item.event} • {item.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-aqua-400">{money(item.amount)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-aqua-400">
                    {item.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-line bg-ink-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ivory">Pending</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-mute">Awaiting</span>
          </div>

          <ul className="space-y-3">
            {pendingPayments.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gold-400/15 bg-gold-400/5 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-ivory">{item.title}</p>
                  <p className="mt-1 text-xs text-mute">
                    {item.event} • Due {item.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-gold-300">{money(item.amount)}</p>
                  <p className="mt-1 flex items-center justify-end gap-1 text-[10px] uppercase tracking-[0.18em] text-gold-300">
                    {item.status}
                    <ArrowUpRight className="h-3 w-3" />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
