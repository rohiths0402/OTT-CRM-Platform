import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clapperboard } from "lucide-react";
import ProjectCard from "./ProjectCard";
import ProjectDrawer from "./ProjectDrawer";
import { getProjects } from "../../api/projectApi";

const tabs = [
  { id: "active", label: "Active" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
];

export default function ProjectsView({ onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("active");
  const [openProject, setOpenProject] = useState(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setError("Could not load your projects."))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        tabs.map(({ id }) => [
          id,
          projects.filter((project) => project.status === id).length,
        ]),
      ),
    [projects],
  );
  const visible = projects.filter((project) => project.status === tab);

  return (
    <div>
      <div>
        <h2 className="font-display text-4xl font-light text-ivory">
          Projects
        </h2>
        <p className="mt-2 text-sm text-mute">
          Every film, series and ad you are part of. Tap one to see the details.
        </p>
      </div>

      <div
        role="tablist"
        className="mt-6 inline-flex gap-1 rounded-xl border border-line bg-ink-900 p-1"
      >
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
              tab === id ? "text-gold-300" : "text-mute hover:text-ivory"
            }`}
          >
            {tab === id && (
              <motion.span
                layoutId="projects-tab"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-lg bg-gold-400/15"
              />
            )}
            <span className="relative">{label}</span>
            <span className="relative rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px]">
              {counts[id]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-mute">Loading your projects...</p>
        ) : error ? (
          <p className="text-sm text-rose-400">{error}</p>
        ) : visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-ink-900/60 p-12 text-center">
            <Clapperboard className="mx-auto h-8 w-8 text-gold-400" />
            <p className="mt-4 font-display text-xl text-ivory">
              No projects here yet
            </p>
          </div>
        ) : (
          <motion.div
            key={tab}
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {visible.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={setOpenProject}
              />
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {openProject && (
          <ProjectDrawer
            key={openProject.id}
            project={openProject}
            onClose={() => setOpenProject(null)}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}