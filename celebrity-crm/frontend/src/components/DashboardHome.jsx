import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import {
  Car,
  ChevronRight,
  Clock,
  FileSignature,
  MapPin,
  Phone,
  Shirt,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import PhotoCard from "./PhotoCard";
import {
  attention,
  manager,
  payments,
  projects,
  todayShoot,
  upcoming,
} from "../data/mock";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const card =
  "rounded-3xl border border-line bg-ink-900 p-6 transition duration-200 hover:border-gold-400/30";

const tones = {
  gold: "border-gold-400/30 bg-gold-400/10 text-gold-300",
  aqua: "border-aqua-400/30 bg-aqua-400/10 text-aqua-400",
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const todayLabel = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

function AnimatedNumber({ value, prefix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <>
      {prefix}
      {display.toLocaleString("en-IN")}
    </>
  );
}

function QuickAction({ icon: Icon, label, hint, href, onClick }) {
  const Tag = href ? "a" : "button";
  const props = href
    ? {
        href,
        target: href.startsWith("http") ? "_blank" : undefined,
        rel: "noreferrer",
      }
    : { type: "button", onClick };

  return (
    <Tag
      {...props}
      className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-ink-900 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/50 hover:bg-ink-800"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-400/10 text-gold-400 transition duration-200 group-hover:bg-gold-400 group-hover:text-ink-950">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-ivory">{label}</span>
        <span className="block text-xs text-mute">{hint}</span>
      </span>
    </Tag>
  );
}

export default function DashboardHome({ name, onNavigate }) {
  const firstName = name.split(" ")[0];
  const details = [
    { icon: MapPin, label: "Location", text: todayShoot.location },
    { icon: Car, label: "Vanity", text: todayShoot.vanity },
    { icon: Shirt, label: "Costume", text: todayShoot.costume },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.header variants={item}>
        <p className="text-sm text-mute">{todayLabel()}</p>
        <h2 className="mt-1 font-display text-4xl font-light text-ivory">
          {getGreeting()}, {firstName}
        </h2>
      </motion.header>

      <motion.section
        variants={item}
        className="relative min-h-[460px] overflow-hidden rounded-3xl border border-gold-400/25 bg-ink-900"
      >
        <div className="absolute inset-y-0 right-0 w-full sm:w-3/5">
          <PhotoCard name={name} />
        </div>

        <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-6 sm:max-w-[58%] sm:p-10">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
              Today, {todayShoot.shift}
            </span>
            <h3 className="mt-5 font-display text-4xl leading-tight text-ivory sm:text-5xl">
              {todayShoot.title}
            </h3>
            <p className="mt-2 text-sm text-mute">{todayShoot.scene}</p>

            <p className="mt-8 flex items-center gap-1.5 text-xs uppercase tracking-wider text-mute">
              <Clock className="h-3.5 w-3.5" />
              Call time
            </p>
            <p className="gold-text font-display text-5xl">
              {todayShoot.callTime}
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {details.map(({ icon: Icon, label, text }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-400/25 bg-ink-800">
                  <Icon className="h-4 w-4 text-gold-400" />
                </span>
                <span>
                  <span className="block text-[10px] uppercase tracking-widest text-mute">
                    {label}
                  </span>
                  <span className="block text-sm text-ivory">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      <motion.section variants={item} className="grid gap-3 sm:grid-cols-3">
        <QuickAction
          icon={Phone}
          label="Call manager"
          hint={manager.name}
          href={`tel:+${manager.phone}`}
        />
        <QuickAction
          icon={FaWhatsapp}
          label="WhatsApp"
          hint={manager.display}
          href={`https://wa.me/${manager.phone}`}
        />
        <QuickAction
          icon={FileSignature}
          label="Contracts to sign"
          hint={`${attention.length} waiting`}
          onClick={() => onNavigate("contracts")}
        />
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section variants={item} className={card}>
          <h3 className="text-sm font-semibold text-ivory">
            Needs your attention
          </h3>
          <ul className="mt-4 space-y-3">
            {attention.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(entry.target)}
                  className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-ink-800/60 p-4 text-left transition duration-200 hover:border-gold-400/40 hover:bg-ink-800"
                >
                  <span>
                    <span className="block text-sm font-medium text-ivory">
                      {entry.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-mute">
                      {entry.detail}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${tones[entry.tone]}`}
                    >
                      {entry.tag}
                    </span>
                    <ChevronRight className="h-4 w-4 text-mute transition group-hover:translate-x-0.5 group-hover:text-gold-300" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={item} className={card}>
          <h3 className="text-sm font-semibold text-ivory">Coming up</h3>
          <ul className="mt-4 space-y-3">
            {upcoming.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-4 rounded-2xl p-2 transition duration-200 hover:bg-white/[0.03]"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-ink-800 text-center leading-tight">
                  <span>
                    <span className="block font-display text-xl text-gold-300">
                      {entry.day}
                    </span>
                    <span className="block text-[11px] uppercase text-mute">
                      {entry.month}
                    </span>
                  </span>
                </span>
                <span>
                  <span className="block text-sm font-medium text-ivory">
                    {entry.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-mute">
                    {entry.place}, {entry.time}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={item} className={card}>
          <h3 className="text-sm font-semibold text-ivory">Payments</h3>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-mute">Received this month</p>
              <p className="mt-1 font-display text-3xl text-aqua-400">
                <AnimatedNumber value={payments.received} prefix="₹ " />
              </p>
            </div>
            <div>
              <p className="text-xs text-mute">Still to come</p>
              <p className="mt-1 font-display text-3xl text-gold-300">
                <AnimatedNumber value={payments.waiting} prefix="₹ " />
              </p>
            </div>
          </div>
          <p className="mt-5 rounded-xl bg-ink-800/60 px-4 py-3 text-xs text-mute">
            Next payment from {payments.next}
          </p>
        </motion.section>

        <motion.section variants={item} className={card}>
          <h3 className="text-sm font-semibold text-ivory">My projects</h3>
          <ul className="mt-4 space-y-5">
            {projects.map((project, index) => (
              <li key={project.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-ivory">
                      {project.title}
                    </p>
                    <p className="mt-0.5 text-xs text-mute">
                      {project.role}, {project.phase}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gold-300">
                    {project.progress}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-700">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{
                      duration: 1,
                      delay: 0.4 + index * 0.15,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </motion.div>
  );
}