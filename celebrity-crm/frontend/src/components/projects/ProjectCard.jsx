import { useState } from "react";
import { motion } from "framer-motion";
import { Clapperboard, Clock, Wallet } from "lucide-react";
import { formatMoney } from "../../utils/format";

const phaseStyles = {
  active: "border-gold-400/40 bg-gold-400/15 text-gold-300",
  upcoming: "border-aqua-400/40 bg-aqua-400/15 text-aqua-400",
  completed: "border-white/20 bg-white/10 text-ivory",
};

export default function ProjectCard({ project, index, onOpen }) {
  const [broken, setBroken] = useState(false);
  const pending = project.money.total - project.money.received;
  const hasPoster = Boolean(project.poster) && !broken;

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      onClick={() => onOpen(project)}
      className="group overflow-hidden rounded-3xl border border-line bg-ink-900 text-left transition duration-200 hover:-translate-y-1 hover:border-gold-400/40"
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${project.tint} ${hasPoster ? "h-60" : "h-28"}`}
      >
        {hasPoster ? (
          <>
            <img
              src={project.poster}
              alt={`${project.title} poster`}
              onError={() => setBroken(true)}
              className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-900 via-black/10 to-black/40" />
          </>
        ) : (
          <Clapperboard
            className="absolute -right-3 -top-3 h-28 w-28 text-white/[0.07] transition duration-500 group-hover:rotate-6 group-hover:scale-110"
            strokeWidth={1}
          />
        )}
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-ivory backdrop-blur">
          {project.type}
        </span>
        <span
          className={`absolute bottom-4 left-4 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${phaseStyles[project.status]}`}
        >
          {project.phase}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-2xl leading-tight text-ivory">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-mute">
          {project.role}, {project.company}
        </p>
        {project.director && (
          <p className="mt-1 text-xs text-mute">Directed by {project.director}</p>
        )}

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-mute">{project.progressLabel}</span>
            {project.status === "active" && (
              <span className="font-semibold text-gold-300">
                {project.progress}%
              </span>
            )}
          </div>
          {project.status === "active" && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{
                  duration: 1,
                  delay: 0.3 + index * 0.06,
                  ease: "easeOut",
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-xs">
          <span className="flex items-center gap-1.5 text-mute">
            <Clock className="h-3.5 w-3.5 text-gold-400" />
            {project.nextCall || "No call planned"}
          </span>
          <span
            className={`flex items-center gap-1.5 font-medium ${pending > 0 ? "text-gold-300" : "text-aqua-400"}`}
          >
            <Wallet className="h-3.5 w-3.5" />
            {pending > 0 ? `${formatMoney(pending)} due` : "Paid in full"}
          </span>
        </div>
      </div>
    </motion.button>
  );
}