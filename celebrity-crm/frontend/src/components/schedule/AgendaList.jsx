import { motion } from "framer-motion";
import { CalendarCheck, ChevronRight } from "lucide-react";
import { eventTypes, statusStyles } from "../../data/schedule";
import { dayLabel, formatDay } from "../../utils/dates";

function groupByDay(events) {
  const groups = [];
  events.forEach((event) => {
    const last = groups[groups.length - 1];
    if (last && last.date.getTime() === event.date.getTime())
      last.items.push(event);
    else groups.push({ date: event.date, items: [event] });
  });
  return groups;
}

export default function AgendaList({ events, today, onPick }) {
  const groups = groupByDay(events.filter((event) => event.date >= today));

  if (groups.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-ink-900/60 p-10 text-center">
        <CalendarCheck className="mx-auto h-8 w-8 text-gold-400" />
        <p className="mt-4 font-display text-xl text-ivory">
          Nothing coming up
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group, groupIndex) => (
        <section key={group.date.getTime()}>
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-xl text-ivory">
              {dayLabel(group.date, today)}
            </h3>
            <span className="text-sm text-mute">{formatDay(group.date)}</span>
          </div>
          <ul className="mt-3 space-y-3">
            {group.items.map((event, index) => {
              const type = eventTypes[event.type];
              const status = statusStyles[event.status];
              return (
                <motion.li
                  key={event.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: groupIndex * 0.05 + index * 0.05,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onPick(event.date)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-ink-900 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/40"
                  >
                    <span
                      className={`h-12 w-1 shrink-0 rounded-full ${type.dot}`}
                    />
                    <span className="w-20 shrink-0">
                      <span className="block font-display text-xl leading-tight text-gold-300">
                        {event.callTime}
                      </span>
                      <span className="block text-[11px] text-mute">
                        {type.label}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ivory">
                        {event.title}
                      </span>
                      <span className="block truncate text-xs text-mute">
                        {event.location}
                      </span>
                    </span>
                    <span
                      className={`hidden shrink-0 rounded-full border px-3 py-1 text-xs font-medium sm:inline ${status.className}`}
                    >
                      {status.label}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-mute transition group-hover:translate-x-0.5 group-hover:text-gold-300" />
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
