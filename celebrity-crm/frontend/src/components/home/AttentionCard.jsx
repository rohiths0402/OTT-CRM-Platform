import { BadgeCheck, CalendarClock, FileSignature } from "lucide-react";
import CardHeader from "./CardHeader";
import { card } from "../../styles/cardStyles";

const kindIcons = {
  schedule: CalendarClock,
  contract: FileSignature,
  approve: BadgeCheck,
};

const urgencyStyles = {
  overdue: {
    label: "Overdue",
    bar: "bg-rose-400",
    icon: "bg-rose-400/15 text-rose-400",
    chip: "border-rose-400/30 bg-rose-400/10 text-rose-400",
  },
  today: {
    label: "Today",
    bar: "bg-gold-400",
    icon: "bg-gold-400/15 text-gold-400",
    chip: "border-gold-400/30 bg-gold-400/10 text-gold-300",
  },
  week: {
    label: "This week",
    bar: "bg-aqua-400",
    icon: "bg-aqua-400/15 text-aqua-400",
    chip: "border-aqua-400/30 bg-aqua-400/10 text-aqua-400",
  },
};

export default function AttentionCard({ items, onNavigate }) {
  return (
    <section className={card}>
      <CardHeader title="Needs your attention" badge={items.length} />

      {items.length === 0 ? (
        <div className="mt-8 grid place-items-center py-6 text-center">
          <BadgeCheck className="h-9 w-9 text-aqua-400" />
          <p className="mt-3 font-display text-xl text-ivory">All caught up</p>
          <p className="mt-1 text-sm text-mute">Nothing is waiting for you.</p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => {
            const Icon = kindIcons[item.kind];
            const tone = urgencyStyles[item.urgency];
            return (
              <li
                key={item.id}
                className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-line bg-ink-800/60 p-3.5 pl-5 transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/40"
              >
                <span className={`absolute inset-y-0 left-0 w-1 ${tone.bar}`} />
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone.icon}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ivory">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-mute">
                    {item.detail}
                  </span>
                </span>
                <span
                  className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:inline ${tone.chip}`}
                >
                  {tone.label}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate(
                      item.target,
                      item.date ? { date: item.date } : undefined,
                    )
                  }
                  className="shrink-0 rounded-lg bg-gold-400 px-3.5 py-2 text-xs font-bold text-ink-950 transition duration-200 hover:brightness-110 hover:shadow-[0_6px_18px_-6px_rgba(217,162,43,0.7)]"
                >
                  {item.action}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
