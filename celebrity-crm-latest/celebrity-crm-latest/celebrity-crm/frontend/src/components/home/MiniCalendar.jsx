import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { card } from "../../styles/cardStyles";
import {
  addDays,
  formatDay,
  formatMonth,
  isSameDay,
  monthGrid,
} from "../../utils/dates";

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

const cellStyles = {
  busy: "border-gold-400/50 bg-gold-400/20 font-semibold text-gold-300",
  tentative: "border-dashed border-gold-400/60 text-gold-300",
  free: "border-transparent bg-aqua-400/10 text-aqua-400",
  past: "border-transparent text-mute/50",
};

const navButton =
  "grid h-8 w-8 place-items-center rounded-full border border-line text-mute transition duration-200 hover:border-gold-400/60 hover:text-gold-300";

export default function MiniCalendar({ events, today, onPickDate }) {
  const [monthStart, setMonthStart] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const eventsOf = (date) =>
    events.filter((event) => isSameDay(event.date, date));

  const statusOf = (date) => {
    const list = eventsOf(date);
    if (list.length === 0) return "free";
    return list.every((event) => event.status === "tentative")
      ? "tentative"
      : "busy";
  };

  const days = monthGrid(monthStart);
  const upcomingDays = days.filter(
    (date) => date.getMonth() === monthStart.getMonth() && date >= today,
  );
  const counts = upcomingDays.reduce(
    (total, date) => {
      total[statusOf(date)] += 1;
      return total;
    },
    { busy: 0, tentative: 0, free: 0 },
  );

  let nextFree = null;
  for (let offset = 0; offset < 120 && !nextFree; offset += 1) {
    const date = addDays(today, offset);
    if (statusOf(date) === "free") nextFree = date;
  }

  const shiftMonth = (delta) =>
    setMonthStart(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );

  return (
    <section className={card}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ivory">Availability</h3>
          <p className="mt-0.5 text-xs text-mute">{formatMonth(monthStart)}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => shiftMonth(-1)}
            className={navButton}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => shiftMonth(1)}
            className={navButton}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[10px] uppercase text-mute">
        {weekdays.map((day, index) => (
          <span key={index}>{day}</span>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {days.map((date) => {
          if (date.getMonth() !== monthStart.getMonth())
            return <span key={date.getTime()} />;

          const isPast = date < today;
          const status = statusOf(date);
          const list = eventsOf(date);
          const summary = list.length
            ? `${formatDay(date)}: ${list.map((event) => `${event.title} (${event.project})`).join(", ")}`
            : `${formatDay(date)}: free`;

          return (
            <button
              key={date.getTime()}
              type="button"
              title={summary}
              aria-label={summary}
              onClick={() => onPickDate(date)}
              className={`grid aspect-square place-items-center rounded-lg border text-xs transition duration-150 hover:scale-110 hover:brightness-125 ${
                isPast ? cellStyles.past : cellStyles[status]
              } ${isSameDay(date, today) ? "ring-2 ring-ivory/70 ring-offset-2 ring-offset-ink-900" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-mute">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-gold-400/60" />
          Busy {counts.busy}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-gold-400" />
          Tentative {counts.tentative}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-aqua-400/50" />
          Free {counts.free}
        </li>
      </ul>

      {nextFree && (
        <button
          type="button"
          onClick={() => onPickDate(nextFree)}
          className="mt-4 flex w-full items-center justify-between rounded-xl bg-aqua-400/10 px-4 py-3 text-left transition duration-200 hover:bg-aqua-400/20"
        >
          <span className="text-xs text-mute">Next free day</span>
          <span className="text-sm font-semibold text-aqua-400">
            {nextFree.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        </button>
      )}
    </section>
  );
}
