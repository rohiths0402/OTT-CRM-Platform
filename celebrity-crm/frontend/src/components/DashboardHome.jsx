import { useMemo } from "react";
import { motion } from "framer-motion";
import { FileSignature, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import TodayHero from "./home/TodayHero";
import AttentionCard from "./home/AttentionCard";
import MiniCalendar from "./home/MiniCalendar";
import PaymentsCard from "./home/PaymentsCard";
import ProjectsCard from "./home/ProjectsCard";
import { getAttention } from "../data/attention";
import { events } from "../data/schedule";
import { manager } from "../data/mock";
import { isSameDay, startOfDay } from "../utils/dates";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
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
  const today = useMemo(() => startOfDay(new Date()), []);
  const attention = useMemo(() => getAttention(), []);
  const contractsWaiting = attention.filter(
    (entry) => entry.kind === "contract",
  ).length;

  const todays = events.filter((event) => isSameDay(event.date, today));
  const heroEvent =
    todays.find((event) => event.type === "shoot") ||
    todays[0] ||
    events.find((event) => event.date > today);

  const openSchedule = (date) => onNavigate("schedule", { date });

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

      {heroEvent && (
        <motion.div variants={item}>
          <TodayHero event={heroEvent} onOpenSchedule={openSchedule} />
        </motion.div>
      )}

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
          hint={
            contractsWaiting > 0
              ? `${contractsWaiting} waiting`
              : "Nothing waiting"
          }
          onClick={() => onNavigate("contracts")}
        />
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item}>
          <AttentionCard items={attention} onNavigate={onNavigate} />
        </motion.div>
        <motion.div variants={item}>
          <MiniCalendar
            events={events}
            today={today}
            onPickDate={openSchedule}
          />
        </motion.div>
        <motion.div variants={item}>
          <PaymentsCard onNavigate={onNavigate} />
        </motion.div>
        <motion.div variants={item}>
          <ProjectsCard onNavigate={onNavigate} />
        </motion.div>
      </div>
    </motion.div>
  );
}
