import { useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  Clapperboard,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  Shirt,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  manager,
  pendingPayments,
  recentPayments,
  todayShoot,
} from "../data/mock";
import { events } from "../data/schedule";
import { projects as allProjects } from "../data/projects";
import { isSameDay } from "../utils/dates";

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

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const dateKey = (date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

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
  const now = new Date();
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const todayEvent = events.find(
    (event) => event.type === "shoot" && isSameDay(event.date, now),
  );
  const details = [
    { icon: Car, label: "Vanity", text: todayShoot.vanity },
    { icon: Shirt, label: "Costume", text: todayShoot.costume },
  ];

  const startOffset = (calendarMonth.getDay() + 6) % 7;
  const calendarStart = new Date(calendarMonth);
  calendarStart.setDate(calendarMonth.getDate() - startOffset);
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + index);
    return day;
  });
  const eventsByDate = new Map();
  events.forEach((event) => {
    const key = dateKey(event.date);
    eventsByDate.set(key, [...(eventsByDate.get(key) || []), event]);
  });
  const activeProjects = allProjects.filter(
    (project) => project.status === "active",
  );
  const upcomingEvents = events
    .filter(
      (event) =>
        event.date >= new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    )
    .slice(0, 3);
  const featuredPayments = [
    {
      ...(recentPayments.find((payment) => payment.event === "The Blood Oath") ||
        recentPayments[0]),
      label: "Movie advance received",
      status: "Received",
    },
    {
      ...pendingPayments[0],
      label: "Ad film balance",
      status: "Balance pending",
    },
    {
      ...pendingPayments[1],
      label: "Promotion payment",
      status: "Pending",
    },
  ].filter(Boolean);
  const attentionItems = [
    ...pendingPayments.slice(0, 2).map((payment) => ({
      id: `payment-${payment.id}`,
      title: `${payment.title} payment pending`,
      detail: `${payment.event} • ${formatMoney(payment.amount)} due ${payment.dueDate}`,
      tag: "Payment",
      tone: "gold",
      target: "payments",
    })),
    ...allProjects
      .filter((project) => project.contract !== "signed")
      .slice(0, 1)
      .map((project) => ({
        id: `contract-${project.id}`,
        title: `Review ${project.title} contract`,
        detail: `${project.company} • ${project.contract === "awaiting" ? "Waiting for your signature" : "Being discussed"}`,
        tag: "Contract",
        tone: "aqua",
        target: "projects",
      })),
  ];
  const shootLocation = [todayShoot.location, todayEvent?.city]
    .filter(Boolean)
    .join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shootLocation)}`;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.header variants={item} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-mute">{todayLabel()}</p>
          <h2 className="mt-1 font-display text-4xl font-light text-ivory">
            {getGreeting()}, {firstName}
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-300">
          <span className="h-2 w-2 rounded-full bg-gold-400" />
          Live schedule
        </span>
      </motion.header>

      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-[30px] border border-line bg-ink-900"
      >
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1fr_0.72fr]">
          <div className="p-6 sm:p-8">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Today&apos;s call sheet · {todayShoot.shift}
            </p>
            <h3 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-ivory sm:text-5xl">
              {todayShoot.title}
            </h3>
            <p className="mt-2 text-sm text-mute">
              {todayEvent
                ? `${todayEvent.project} · ${todayShoot.scene}`
                : todayShoot.scene}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-mute">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-medium text-ivory">
                    {shootLocation}
                  </p>
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-semibold text-ivory transition hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-300"
              >
                <Navigation className="h-3.5 w-3.5" />
                Get directions
              </a>
            </div>

            <div className="mt-7 grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
              {details.map(({ icon: Icon, label, text }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-gold-400" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-mute">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-ivory">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="flex flex-col justify-between border-t border-line bg-white/[0.02] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div>
              <div className="flex items-center gap-2 text-xs text-mute">
                <Clock3 className="h-4 w-4 text-gold-400" />
                CALL TIME
              </div>
              <p className="mt-3 font-display text-6xl leading-none text-gold-300 sm:text-7xl">
                {todayShoot.callTime}
              </p>
              <p className="mt-3 text-sm text-mute">
                {todayShoot.shift} · {todayShoot.scene}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-mute">
                  Your manager
                </p>
                <p className="mt-1 text-sm font-medium text-ivory">
                  {manager.name}
                </p>
              </div>
              <a
                href={`tel:+${manager.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-semibold text-ivory transition hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-300"
              >
                <Phone className="h-3.5 w-3.5" />
                Call manager
              </a>
            </div>
          </aside>
        </div>
      </motion.section>

      <motion.section variants={item} className="grid gap-3 sm:grid-cols-2">
        <QuickAction
          icon={FaWhatsapp}
          label="WhatsApp"
          hint={manager.display}
          href={`https://wa.me/${manager.phone}`}
        />
        <QuickAction
          icon={Clapperboard}
          label="Review projects"
          hint={`${activeProjects.length} active projects`}
          onClick={() => onNavigate("projects")}
        />
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.section variants={item} className={card}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ivory">Needs your attention</h3>
            <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-gold-300">
              {attentionItems.length} items
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {attentionItems.length > 0 ? attentionItems.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(entry.target)}
                  className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-ink-800/70 p-4 text-left transition duration-200 hover:border-gold-400/40 hover:bg-ink-800"
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
            )) : (
              <li className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-mute">
                You&apos;re all caught up.
              </li>
            )}
          </ul>
        </motion.section>

        <motion.section variants={item} className={card}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ivory">Payments</h3>
            <button
              type="button"
              onClick={() => onNavigate("payments")}
              className="text-[10px] uppercase tracking-[0.2em] text-gold-300 transition hover:text-gold-200"
            >
              View all
            </button>
          </div>
          <ul className="mt-5 space-y-3">
            {featuredPayments.map((item) => (
              <li
                key={item.id}
                className={`rounded-2xl border p-3 ${
                  item.status === "Received"
                    ? "border-aqua-400/20 bg-aqua-400/[0.04]"
                    : "border-gold-400/20 bg-gold-400/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-mute">
                      {item.label}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-ivory">
                      {item.title}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-mute">
                      {item.event}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-display text-xl ${
                      item.status === "Received" ? "text-aqua-400" : "text-gold-300"
                    }`}>
                      {formatMoney(item.amount)}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-mute">
                      {item.date || `Due ${item.dueDate}`}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.section variants={item} className={card}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ivory">Coming up</h3>
            <button
              type="button"
              onClick={() => onNavigate("schedule")}
              className="text-[10px] uppercase tracking-[0.2em] text-gold-300 transition hover:text-gold-200"
            >
              View all
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-line bg-ink-800/50 p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-ivory">
                  {calendarMonth.toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() =>
                      setCalendarMonth(
                        (month) =>
                          new Date(month.getFullYear(), month.getMonth() - 1, 1),
                      )
                    }
                    className="grid h-7 w-7 place-items-center rounded-lg text-mute transition hover:bg-white/10 hover:text-ivory"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() =>
                      setCalendarMonth(
                        (month) =>
                          new Date(month.getFullYear(), month.getMonth() + 1, 1),
                      )
                    }
                    className="grid h-7 w-7 place-items-center rounded-lg text-mute transition hover:bg-white/10 hover:text-ivory"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-mute">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <span
                    key={`${day}-${index}`}
                    className="py-1 font-medium uppercase"
                  >
                    {day}
                  </span>
                ))}
                {calendarDays.map((date) => {
                  const key = dateKey(date);
                  const dayEvents = eventsByDate.get(key) || [];
                  const isOccupied = dayEvents.length > 0;
                  const isCurrentMonth =
                    date.getMonth() === calendarMonth.getMonth() &&
                    date.getFullYear() === calendarMonth.getFullYear();
                  const isToday = isSameDay(date, now);

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onNavigate("schedule", date)}
                      aria-label={`${date.toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}: ${
                        isOccupied
                          ? `occupied, ${dayEvents.map((event) => event.title).join(", ")}`
                          : "free"
                      }`}
                      className={[
                        "grid h-8 place-items-center rounded-lg border text-xs transition",
                        isOccupied
                          ? "border-gold-400/40 bg-gold-400/15 text-gold-200 hover:bg-gold-400/25"
                          : isCurrentMonth
                            ? "border-aqua-400/15 bg-aqua-400/[0.04] text-aqua-300 hover:border-aqua-400/40"
                            : "border-transparent bg-transparent text-white/20",
                        isToday ? "ring-1 ring-ivory/50" : "",
                      ].join(" ")}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3 text-[10px] uppercase tracking-[0.16em] text-mute">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gold-400" />
                  Occupied
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-aqua-400" />
                  Free
                </span>
              </div>
            </div>

            <ul className="space-y-3">
              {upcomingEvents.length > 0 ? upcomingEvents.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-2xl border border-line bg-ink-800/50 p-3 transition duration-200 hover:border-gold-400/30 hover:bg-ink-800"
                >
                  <button
                    type="button"
                    onClick={() => onNavigate("schedule", entry.date)}
                    className="flex w-full items-center gap-4 text-left"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-ink-900 text-center leading-tight">
                      <span>
                        <span className="block font-display text-xl text-gold-300">
                          {entry.date.toLocaleDateString("en-IN", {
                            day: "2-digit",
                          })}
                        </span>
                        <span className="block text-[11px] uppercase text-mute">
                          {entry.date.toLocaleDateString("en-IN", {
                            month: "short",
                          })}
                        </span>
                      </span>
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ivory">
                        {entry.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-mute">
                        {entry.location}
                        {entry.city ? `, ${entry.city}` : ""} · {entry.callTime}
                      </span>
                    </span>
                  </button>
                </li>
              )) : (
                <li className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-mute">
                  No upcoming bookings. Check the calendar for free dates.
                </li>
              )}
            </ul>
          </div>
        </motion.section>

        <motion.section variants={item} className={card}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-ivory">Active projects</h3>
              <p className="mt-1 text-xs text-mute">
                Progress from your Projects board
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("projects")}
              className="text-[10px] uppercase tracking-[0.2em] text-gold-300 transition hover:text-gold-200"
            >
              View all
            </button>
          </div>
          <ul className="mt-4 space-y-5">
            {activeProjects.slice(0, 3).map((project, index) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => onNavigate("projects")}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-ivory">
                        {project.title}
                      </p>
                      <p className="mt-0.5 text-xs text-mute">
                        {project.role} · {project.company}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-gold-300">
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
                        delay: 0.35 + index * 0.15,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-mute">
                    {project.phase} · {project.progressLabel}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </motion.div>
  );
}