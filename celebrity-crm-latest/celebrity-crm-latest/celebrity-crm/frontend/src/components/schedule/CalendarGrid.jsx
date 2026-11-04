import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { chipStyle, dotFor } from "../../utils/offer";
import { formatMonth, isSameDay, monthGrid } from "../../utils/dates";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const shortTime = (label) => label.replace(" ", "").toLowerCase();

const navButton =
  "grid h-9 w-9 place-items-center rounded-full border border-line text-mute transition duration-200 hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-300";

export default function CalendarGrid({
  monthStart,
  selected,
  today,
  eventsOn,
  onSelect,
  onPrev,
  onNext,
}) {
  const days = monthGrid(monthStart);

  return (
    <section className="rounded-3xl border border-line bg-ink-900 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-ivory">
          {formatMonth(monthStart)}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={onPrev}
            className={navButton}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={onNext}
            className={navButton}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-mute sm:gap-1.5">
        {weekdays.map((day) => (
          <span key={day} className="pb-2">
            {day}
          </span>
        ))}
      </div>

      <motion.div
        key={monthStart.getTime()}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-7 gap-1 sm:gap-1.5"
      >
        {days.map((date) => {
          const inMonth = date.getMonth() === monthStart.getMonth();
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selected);
          const list = eventsOn(date);

          return (
            <button
              key={date.getTime()}
              type="button"
              onClick={() => onSelect(date)}
              aria-pressed={isSelected}
              aria-label={`${date.toDateString()}, ${list.length} planned`}
              className={`relative flex min-h-[3.75rem] flex-col rounded-xl border p-1.5 text-left transition duration-200 sm:min-h-[6.75rem] sm:p-2 ${
                isSelected
                  ? "border-transparent bg-gold-400/10"
                  : "border-line/60 hover:border-gold-400/40 hover:bg-white/[0.03]"
              } ${inMonth ? "" : "opacity-40"}`}
            >
              {isSelected && (
                <motion.span
                  layoutId="day-select"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="pointer-events-none absolute inset-0 rounded-xl border-2 border-gold-400"
                />
              )}
              <span
                className={`relative grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${
                  isToday ? "bg-gold-400 text-ink-950" : "text-ivory"
                }`}
              >
                {date.getDate()}
              </span>

              <span className="relative mt-auto flex gap-1 pt-1 sm:hidden">
                {list.slice(0, 3).map((event) => (
                  <span
                    key={event.id}
                    className={`h-1.5 w-1.5 rounded-full ${dotFor(event)}`}
                  />
                ))}
              </span>

              <span className="relative mt-1.5 hidden flex-col gap-1 sm:flex">
                {list.slice(0, 2).map((event) => (
                  <span
                    key={event.id}
                    className={`flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-[10px] leading-none ${chipStyle(event)}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotFor(event)}`}
                    />
                    <span className="truncate">
                      {shortTime(event.callTime)} {event.title}
                    </span>
                  </span>
                ))}
                {list.length > 2 && (
                  <span className="px-1 text-[10px] text-mute">
                    +{list.length - 2} more
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </motion.div>
    </section>
  );
}