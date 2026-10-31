import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import EventCard from "./EventCard";
import { dayLabel, formatDay } from "../../utils/dates";

export default function DayDetails({ date, today, events, nextEvent, onJump }) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-mute">
            {dayLabel(date, today)}
          </p>
          <h3 className="mt-1 font-display text-2xl text-ivory">
            {formatDay(date)}
          </h3>
        </div>
        {events.length > 0 && (
          <span className="text-xs text-mute">{events.length} planned</span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={date.getTime()}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="mt-4 space-y-4"
        >
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="rounded-3xl border border-dashed border-line bg-ink-900/60 p-8 text-center">
              <CalendarCheck className="mx-auto h-8 w-8 text-gold-400" />
              <p className="mt-4 font-display text-xl text-ivory">
                Nothing planned
              </p>
              <p className="mt-1 text-sm text-mute">A free day.</p>
              {nextEvent && (
                <button
                  type="button"
                  onClick={() => onJump(nextEvent.date)}
                  className="mt-5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ivory transition duration-200 hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-300"
                >
                  Next: {nextEvent.title}, {formatDay(nextEvent.date)}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
