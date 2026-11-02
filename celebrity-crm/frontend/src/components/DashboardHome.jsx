import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clapperboard,
  FileSignature,
  Megaphone,
  Phone,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import TodayHero from "./home/TodayHero";
import MiniCalendar from "./home/MiniCalendar";
import PaymentsCard from "./home/PaymentsCard";
import ProjectsCard from "./home/ProjectsCard";
import { getEvents } from "../api/scheduleApi";
import { getProjects } from "../api/projectApi";
import { getDashboard } from "../api/dashboardApi";
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

function CareerSnapshot({ events, projects, dashboard, today, onNavigate }) {
  const upcomingBookings = events.filter(
    (event) => event.response === "accepted" && event.date >= today,
  );
  const activeProjects = projects.filter(
    (project) => project.status === "active",
  );
  const activeDeals = dashboard.attention.filter(
    (entry) => entry.target === "deals",
  );
  const insights = [
    {
      label: "Bookings ahead",
      count: upcomingBookings.length,
      detail: upcomingBookings[0]
        ? `${upcomingBookings[0].project} · ${upcomingBookings[0].date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
        : "No confirmed bookings yet",
      icon: CalendarDays,
      target: "schedule",
      tone: "text-aqua-400 bg-aqua-400/10",
    },
    {
      label: "Active productions",
      count: activeProjects.length,
      detail: activeProjects[0]?.title || "Your current project slate",
      icon: Clapperboard,
      target: "projects",
      tone: "text-gold-300 bg-gold-400/10",
    },
    {
      label: "Brand opportunities",
      count: activeDeals.length,
      detail: activeDeals[0]?.detail || "No open brand conversations",
      icon: Megaphone,
      target: "deals",
      tone: "text-rose-300 bg-rose-400/10",
    },
  ];

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-900 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">
            Your career at a glance
          </p>
          <h3 className="mt-1 font-display text-2xl text-ivory">
            Career snapshot
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("analytics")}
          className="text-xs font-semibold text-gold-300 transition hover:text-gold-200"
        >
          View performance
        </button>
      </div>
      <div className="mt-5 grid flex-1 gap-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <button
              key={insight.label}
              type="button"
              onClick={() => onNavigate(insight.target)}
              className="group flex min-w-0 items-center gap-4 rounded-2xl border border-line bg-ink-800/60 p-4 text-left transition hover:-translate-y-0.5 hover:border-gold-400/35 hover:bg-ink-800"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${insight.tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ivory">
                  {insight.label}
                </span>
                <span className="mt-1 block truncate text-xs text-mute">
                  {insight.detail}
                </span>
              </span>
              <span className="font-display text-3xl text-ivory">
                {insight.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardHome({ name, onNavigate }) {
  const firstName = name.split(" ")[0];
  const today = useMemo(() => startOfDay(new Date()), []);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getEvents(), getProjects(), getDashboard()])
      .then(([eventList, projectList, dashboardData]) => {
        setEvents(
          eventList.map((event) => ({
            ...event,
            project: event.project || event.title,
          })),
        );
        setProjects(projectList);
        setDashboard(dashboardData);
      })
      .catch(() => setError("Could not load your dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-mute">Loading your dashboard...</p>;
  }
  if (error) {
    return <p className="text-sm text-rose-400">{error}</p>;
  }

  const accepted = events.filter((event) => event.response === "accepted");
  const calendarEvents = events
    .filter((event) => event.response !== "declined")
    .map((event) =>
      event.response === "pending" ? { ...event, status: "tentative" } : event,
    );

  const contractsWaiting = dashboard.attention.filter(
    (entry) => entry.target === "contracts",
  ).length;
  const manager = dashboard.manager;

  const todays = accepted.filter((event) => isSameDay(event.date, today));
  const heroEvent =
    todays.find((event) => event.type === "shoot") ||
    todays[0] ||
    accepted.find((event) => event.date > today);

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
        {manager && (
          <>
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
          </>
        )}
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
        <motion.div variants={item} className="h-full">
          <CareerSnapshot
            events={events}
            projects={projects}
            dashboard={dashboard}
            today={today}
            onNavigate={onNavigate}
          />
        </motion.div>
        <motion.div variants={item}>
          <MiniCalendar
            events={calendarEvents}
            today={today}
            onPickDate={openSchedule}
          />
        </motion.div>
        <motion.div variants={item}>
          <PaymentsCard onNavigate={onNavigate} />
        </motion.div>
        <motion.div variants={item}>
          <ProjectsCard projects={projects} onNavigate={onNavigate} />
        </motion.div>
      </div>
    </motion.div>
  );
}