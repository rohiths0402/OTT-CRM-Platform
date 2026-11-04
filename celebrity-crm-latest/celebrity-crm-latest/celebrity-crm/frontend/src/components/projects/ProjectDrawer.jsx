import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, FileSignature, Phone, X } from "lucide-react";
import { contractStates } from "../../data/projects";
import { formatMoney } from "../../utils/format";

function Section({ title, children }) {
  return (
    <section className="border-t border-line pt-6">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-mute">
        {title}
      </h4>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const pillButton =
  "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ivory transition duration-200 hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-300";

export default function ProjectDrawer({ project, onClose, onNavigate }) {
  const panelRef = useRef(null);
  const { total, received, next } = project.money;
  const pending = total - received;
  const paidPercent = Math.round((received / total) * 100);
  const contract = contractStates[project.contract];

  useEffect(() => {
    panelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const go = (tab) => {
    onClose();
    onNavigate(tab);
  };

  const facts = [
    { label: "Your role", value: project.role },
    { label: "Production", value: project.company },
    { label: "Director", value: project.director },
    {
      label: project.status === "completed" ? "Released" : "Release",
      value: project.release,
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
      />
      <motion.aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ x: "110%" }}
        animate={{ x: 0 }}
        exit={{ x: "110%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed inset-y-3 right-3 z-[60] flex w-[min(34rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-line bg-ink-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] focus:outline-none"
      >
        <div
          className={`relative bg-gradient-to-br ${project.tint} px-7 pb-6 pt-7`}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-ivory/80 transition hover:bg-white/10 hover:text-ivory"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-xs uppercase tracking-wider text-ivory/70">
            {project.type}, {project.phase}
          </p>
          <h3 className="mt-2 pr-10 font-display text-3xl leading-tight text-ivory">
            {project.title}
          </h3>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-7 pb-8 pt-6">
          {project.nextCall && (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-4 py-3">
              <span className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold-400" />
                <span>
                  <span className="block text-[11px] uppercase tracking-wider text-mute">
                    Next call
                  </span>
                  <span className="block text-sm font-medium text-ivory">
                    {project.nextCall}
                  </span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => go("schedule")}
                className={pillButton}
              >
                See schedule
              </button>
            </div>
          )}

          {project.status === "active" && (
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-mute">{project.progressLabel}</span>
                <span className="font-semibold text-gold-300">
                  {project.progress}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-700">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-4">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl bg-white/[0.03] px-4 py-3"
              >
                <dt className="text-[11px] uppercase tracking-wider text-mute">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm text-ivory">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <Section title="Payment">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-mute">Total</p>
                <p className="mt-1 font-display text-xl text-ivory">
                  {formatMoney(total)}
                </p>
              </div>
              <div>
                <p className="text-xs text-mute">Received</p>
                <p className="mt-1 font-display text-xl text-aqua-400">
                  {formatMoney(received)}
                </p>
              </div>
              <div>
                <p className="text-xs text-mute">Still to come</p>
                <p className="mt-1 font-display text-xl text-gold-300">
                  {pending > 0 ? formatMoney(pending) : "Nil"}
                </p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink-700">
              <motion.div
                className="h-full rounded-full bg-aqua-400"
                initial={{ width: 0 }}
                animate={{ width: `${paidPercent}%` }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              />
            </div>
            {next && (
              <p className="mt-3 text-xs text-mute">Next payment: {next}</p>
            )}
          </Section>

          <Section title="Team">
            <ul className="space-y-3">
              {project.team.map((person) => (
                <li
                  key={person.name}
                  className="flex items-center justify-between gap-3"
                >
                  <span>
                    <span className="block text-sm text-ivory">
                      {person.name}
                    </span>
                    <span className="block text-xs text-mute">
                      {person.role}
                    </span>
                  </span>
                  <a href={`tel:+${person.phone}`} className={pillButton}>
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Contract">
            <div className="flex items-center justify-between gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${contract.className}`}
              >
                {contract.label}
              </span>
              <button
                type="button"
                onClick={() => go("contracts")}
                className={pillButton}
              >
                <FileSignature className="h-3.5 w-3.5" />
                Open contracts
              </button>
            </div>
          </Section>
        </div>
      </motion.aside>
    </>
  );
}
