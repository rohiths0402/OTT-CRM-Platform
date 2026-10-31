import { motion } from "framer-motion";
import CardHeader from "./CardHeader";
import { card } from "../../styles/cardStyles";
import { projects } from "../../data/projects";

export default function ProjectsCard({ onNavigate }) {
  const active = projects
    .filter((project) => project.status === "active")
    .slice(0, 3);

  return (
    <section className={card}>
      <CardHeader
        title="My projects"
        actionLabel="View all"
        onAction={() => onNavigate("projects")}
      />

      <ul className="mt-5 space-y-3">
        {active.map((project, index) => (
          <li key={project.id}>
            <button
              type="button"
              onClick={() => onNavigate("projects", { projectId: project.id })}
              className="w-full rounded-2xl border border-line bg-ink-800/60 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/40"
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium text-ivory">
                    {project.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-mute">
                    {project.role}, {project.phase}
                  </span>
                </span>
                <span className="text-sm font-semibold text-gold-300">
                  {project.progress}%
                </span>
              </span>
              <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-ink-700">
                <motion.span
                  className="block h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.4 + index * 0.12,
                    ease: "easeOut",
                  }}
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
