import { motion } from "framer-motion";

const words = [
  "Schedule",
  "Contracts",
  "Brand deals",
  "Payments",
  "Private",
  "Invite only",
];

export default function Marquee() {
  const items = [...words, ...words];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-white/10 bg-ink-950/70 py-3 backdrop-blur-md"
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex w-max items-center whitespace-nowrap"
      >
        {items.map((word, index) => (
          <span
            key={index}
            className="flex items-center gap-10 pr-10 text-xs font-semibold uppercase tracking-[0.35em] text-ivory/60"
          >
            {word}
            <span className="text-gold-400">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
