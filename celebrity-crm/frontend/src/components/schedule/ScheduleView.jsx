import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, List } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import DayDetails from "./DayDetails";
import AgendaList from "./AgendaList";
import { eventTypes, events } from "../../data/schedule";
import { isSameDay, startOfDay } from "../../utils/dates";

const views = [
  { id: "month", label: "Calendar", icon: CalendarDays },
  { id: "agenda", label: "List", icon: List },
];

const filters = [
  { id: "all", label: "All" },
  ...Object.entries(eventTypes).map(([id, type]) => ({
    id,
    label: type.label,
    dot: type.dot,
  })),
];

export default function ScheduleView({ initialSelectedDate }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const safeInitial = initialSelectedDate ? startOfDay(new Date(initialSelectedDate)) : today;
  const [view, setView] = useState("month");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(safeInitial);
  const [monthStart, setMonthStart] = useState(
    () => new Date(safeInitial.getFullYear(), safeInitial.getMonth(), 1),
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? events
        : events.filter((event) => event.type === filter),
    [filter],
  );

  const eventsOn = (date) =>
    filtered.filter((event) => isSameDay(event.date, date));
  const nextEvent = filtered.find((event) => event.date > selected);

  const pickDate = (date) => {
    setSelected(date);
    setMonthStart(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const shiftMonth = (delta) =>
    setMonthStart(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );

  const pickFromList = (date) => {
    pickDate(date);
    setView("month");
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-light text-ivory">
            Schedule
          </h2>
          <p className="mt-2 text-sm text-mute">
            Tap a day to see call time, location and who to call.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => pickDate(today)}
            className="rounded-xl border border-line px-4 py-2 text-sm text-ivory transition duration-200 hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-300"
          >
            Today
          </button>
          <div
            role="tablist"
            className="flex gap-1 rounded-xl border border-line bg-ink-900 p-1"
          >
            {views.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                onClick={() => setView(id)}
                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
                  view === id ? "text-gold-300" : "text-mute hover:text-ivory"
                }`}
              >
                {view === id && (
                  <motion.span
                    layoutId="schedule-view"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-lg bg-gold-400/15"
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition duration-200 ${
              filter === item.id
                ? "border-gold-400/60 bg-gold-400/15 text-gold-300"
                : "border-line text-mute hover:border-gold-400/40 hover:text-ivory"
            }`}
          >
            {item.dot && (
              <span className={`h-2 w-2 rounded-full ${item.dot}`} />
            )}
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === "month" ? (
              <div className="grid items-start gap-6 lg:grid-cols-[1.45fr_1fr]">
                <CalendarGrid
                  monthStart={monthStart}
                  selected={selected}
                  today={today}
                  eventsOn={eventsOn}
                  onSelect={pickDate}
                  onPrev={() => shiftMonth(-1)}
                  onNext={() => shiftMonth(1)}
                />
                <DayDetails
                  date={selected}
                  today={today}
                  events={eventsOn(selected)}
                  nextEvent={nextEvent}
                  onJump={pickDate}
                />
              </div>
            ) : (
              <AgendaList
                events={filtered}
                today={today}
                onPick={pickFromList}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
