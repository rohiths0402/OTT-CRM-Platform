import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { UserRound } from "lucide-react";
import { coverPhotos } from "../data/mock";

const tints = [
  "from-[#5a3f10] via-[#2a1d0b] to-[#0c0a10]",
  "from-[#17314a] via-[#14202e] to-[#0c0a10]",
  "from-[#4a1730] via-[#241320] to-[#0c0a10]",
  "from-[#0f4a3f] via-[#12261f] to-[#0c0a10]",
  "from-[#33205f] via-[#1c1530] to-[#0c0a10]",
  "from-[#5a2f10] via-[#2a180c] to-[#0c0a10]",
];

function Slide({ src, index }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${tints[index % tints.length]}`}
      >
        <div className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-gold-400/20 blur-3xl" />
        <UserRound
          className="absolute right-[16%] top-1/2 h-72 w-72 -translate-y-1/2 text-white/[0.07]"
          strokeWidth={0.8}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover object-[center_22%]"
    />
  );
}

export default function HeroSlideshow({ active }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      <motion.div
        key={active}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1, transition: { duration: 1.3 } }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
      >
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.02 }}
          animate={{ scale: reduceMotion ? 1.02 : 1.14 }}
          transition={{ duration: 9, ease: "linear" }}
        >
          <Slide src={coverPhotos[active].image} index={active} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
