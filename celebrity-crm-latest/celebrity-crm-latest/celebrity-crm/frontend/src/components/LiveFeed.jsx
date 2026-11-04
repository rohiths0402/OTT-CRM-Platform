import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarClock, FileSignature, Megaphone, Wallet } from "lucide-react";

const events = [
  {
    id: 1,
    icon: CalendarClock,
    tone: "gold",
    title: "Call time updated",
    detail: "Tonight, 6:30 PM at Film City",
  },
  {
    id: 2,
    icon: FileSignature,
    tone: "aqua",
    title: "Contract ready to sign",
    detail: "Harbour Lights dubbing",
  },
  {
    id: 3,
    icon: Wallet,
    tone: "aqua",
    title: "Payment received",
    detail: "₹ 2,00,000 from Aster Watches",
  },
  {
    id: 4,
    icon: Megaphone,
    tone: "gold",
    title: "New brand offer",
    detail: "Festival film, 30 seconds",
  },
];

const tones = {
  gold: "bg-gold-400/15 text-gold-400",
  aqua: "bg-aqua-400/15 text-aqua-400",
};

const VISIBLE = 3;

export default function LiveFeed({ className = "" }) {
  const reduceMotion = useReducedMotion();
  const [head, setHead] = useState(VISIBLE - 1);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setHead((value) => value + 1), 3200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const visible = Array.from({ length: VISIBLE }, (_, position) => {
    const index =
      (((head - position) % events.length) + events.length) % events.length;
    return { event: events[index], position };
  });

  return (
    <div className={className}>
      <p className="mb-3 flex items-center gap-2 text-xs text-ivory/70">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aqua-400" />
        Live updates
      </p>
      <ul className="relative space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map(({ event, position }) => {
            const Icon = event.icon;
            return (
              <motion.li
                key={event.id}
                layout
                initial={{ opacity: 0, y: -28, scale: 0.94 }}
                animate={{
                  opacity: 1 - position * 0.28,
                  y: 0,
                  scale: 1 - position * 0.03,
                }}
                exit={{ opacity: 0, y: 28, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/70 p-3.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[event.tone]}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ivory">
                    {event.title}
                  </span>
                  <span className="block text-xs text-mute">
                    {event.detail}
                  </span>
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
