import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Car,
  MapPin,
  Navigation,
  Phone,
  Shirt,
} from "lucide-react";
import useNow from "../../hooks/useNow";
import { eventTypes, statusStyles } from "../../data/schedule";
import { dayLabel, startOfDay, toMinutes } from "../../utils/dates";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const timeFrom = (text) =>
  text ? text.match(/\d{1,2}:\d{2} [AP]M/)?.[0] : undefined;

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
};

function buildSteps(event) {
  const steps = [];
  if (event.pickup) steps.push({ label: "Pickup", time: event.pickup.time });
  const makeup = timeFrom(event.look?.makeup);
  if (makeup) steps.push({ label: "Makeup", time: makeup });
  steps.push({
    label: event.type === "shoot" ? "Call" : "Start",
    time: event.callTime,
    isCall: true,
  });
  if (event.wrapTime)
    steps.push({
      label: event.type === "shoot" ? "Pack up" : "End",
      time: event.wrapTime,
    });

  let offset = 0;
  let previous = -1;
  return steps.map((step) => {
    let minutes = toMinutes(step.time) + offset;
    if (minutes < previous) {
      offset += 1440;
      minutes += 1440;
    }
    previous = minutes;
    return { ...step, minutes };
  });
}

function getCountdown(event, steps, now, date, today) {
  const isToday = date.getTime() === today.getTime();
  const callLabel = event.type === "shoot" ? "Call time in" : "Starts in";

  if (!isToday) {
    const days = Math.round((date - today) / 86400000);
    return {
      label: "Coming up",
      value: days === 1 ? "Tomorrow" : `In ${days} days`,
      note: `${dayLabel(date, today)} at ${event.callTime}`,
      doneCount: 0,
    };
  }

  const current = now.getHours() * 60 + now.getMinutes();
  const call = steps.find((step) => step.isCall).minutes;
  const last = steps[steps.length - 1].minutes;
  const end = last > call ? last : call + 60;
  const doneCount = steps.filter((step) => step.minutes <= current).length;

  if (current < call)
    return {
      label: callLabel,
      value: formatDuration(call - current),
      note: null,
      doneCount,
    };
  if (current < end) {
    return {
      label: "Right now",
      value: "In progress",
      note: event.wrapTime ? `Pack up at ${event.wrapTime}` : null,
      doneCount,
    };
  }
  return {
    label: "Today",
    value: "All done",
    note: "See you at the next one.",
    doneCount,
  };
}

function Backdrop({ event }) {
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const watermark = event.project.replace(/^The\s+/i, "").toUpperCase();

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1d0b] via-ink-900 to-[#1a1230]" />

      {!failed && (
        <motion.img
          src={`/projects/${slugify(event.project)}.jpg`}
          alt=""
          onError={() => setFailed(true)}
          initial={{ scale: 1.05 }}
          animate={{ scale: reduceMotion ? 1.05 : 1.15 }}
          transition={{
            duration: 16,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      )}

      {failed && (
        <>
          <motion.div
            animate={
              reduceMotion ? undefined : { x: [0, 50, 0], y: [0, -30, 0] }
            }
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-16 -top-20 h-80 w-80 rounded-full bg-gold-400/25 blur-3xl"
          />
          <motion.div
            animate={
              reduceMotion ? undefined : { x: [0, -40, 0], y: [0, 40, 0] }
            }
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
          />
          <motion.div
            animate={
              reduceMotion ? undefined : { x: [0, 30, 0], y: [0, 30, 0] }
            }
            transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-16 top-1/4 h-60 w-60 rounded-full bg-aqua-400/10 blur-3xl"
          />
          <span className="absolute -bottom-8 right-4 select-none whitespace-nowrap font-display text-[8rem] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)] sm:text-[11rem]">
            {watermark}
          </span>
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/60 to-ink-950/20" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/70 to-transparent" />
    </div>
  );
}

const outlineButton =
  "inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-ivory transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-300";

export default function TodayHero({ event, onOpenSchedule }) {
  const now = useNow();
  const today = startOfDay(now);
  const isToday = event.date.getTime() === today.getTime();
  const steps = buildSteps(event);
  const countdown = getCountdown(event, steps, now, event.date, today);
  const type = eventTypes[event.type];
  const status = statusStyles[event.status];
  const place = [event.location, event.city].filter(Boolean).join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  const fraction =
    countdown.doneCount <= 1
      ? 0
      : (countdown.doneCount - 1) / (steps.length - 1);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900">
      <Backdrop event={event} />

      <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.35fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
              {isToday ? "Today" : "Next up"}, {type.label}
            </span>
            {event.status === "updated" && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>
            )}
          </div>

          <h2 className="mt-5 font-display text-4xl leading-[1.05] text-ivory sm:text-5xl">
            {event.project}
          </h2>
          <p className="mt-2 text-base text-ivory/70">{event.title}</p>
          {event.statusNote && (
            <p className="mt-2 text-sm text-rose-400">{event.statusNote}</p>
          )}

          <div className="mt-7">
            <p className="text-xs uppercase tracking-wider text-ivory/60">
              {countdown.label}
            </p>
            <p className="gold-text font-display text-5xl leading-tight sm:text-6xl">
              {countdown.value}
            </p>
            {countdown.note && (
              <p className="mt-1 text-sm text-ivory/70">{countdown.note}</p>
            )}
          </div>

          {isToday && steps.length > 1 && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wider text-ivory/60">
                Your day
              </p>
              <div className="relative mt-4">
                <div className="absolute inset-x-2 top-[7px] h-px bg-white/20" />
                <motion.div
                  className="absolute inset-x-2 top-[7px] h-px origin-left bg-gold-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: fraction }}
                  transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
                />
                <ol className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const done = index < countdown.doneCount;
                    const active =
                      index === countdown.doneCount - 1 &&
                      countdown.doneCount < steps.length;
                    return (
                      <li
                        key={step.label}
                        className="flex flex-col items-center gap-2 text-center"
                      >
                        <span
                          className={`relative grid h-4 w-4 place-items-center rounded-full border-2 ${
                            done
                              ? "border-gold-400 bg-gold-400"
                              : "border-white/30 bg-ink-900"
                          }`}
                        >
                          {active && (
                            <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/60" />
                          )}
                        </span>
                        <span>
                          <span className="block text-[11px] uppercase tracking-wider text-ivory/60">
                            {step.label}
                          </span>
                          <span
                            className={`block text-sm font-medium ${done ? "text-ivory" : "text-ivory/70"}`}
                          >
                            {step.time}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="self-start rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-gold-400">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-ivory/60">
                Where
              </p>
              <p className="mt-0.5 text-base font-medium text-ivory">
                {event.location}
              </p>
              {event.city && (
                <p className="text-sm text-ivory/70">{event.city}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {!event.online && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="gold-btn inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                <Navigation className="h-4 w-4" />
                Get directions
              </a>
            )}
            {event.contact && (
              <a href={`tel:+${event.contact.phone}`} className={outlineButton}>
                <Phone className="h-4 w-4" />
                Call {event.contact.name}
              </a>
            )}
          </div>

          {(event.look?.vanity || event.look?.wardrobe) && (
            <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-sm text-ivory/80">
              {event.look.vanity && (
                <li className="flex items-center gap-2.5">
                  <Car className="h-4 w-4 shrink-0 text-gold-400" />
                  {event.look.vanity}
                </li>
              )}
              {event.look.wardrobe && (
                <li className="flex items-center gap-2.5">
                  <Shirt className="h-4 w-4 shrink-0 text-gold-400" />
                  {event.look.wardrobe}
                </li>
              )}
            </ul>
          )}

          <button
            type="button"
            onClick={() => onOpenSchedule(event.date)}
            className="group mt-5 flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-ivory transition duration-200 hover:border-gold-400/50 hover:text-gold-300"
          >
            Full call sheet
            <ArrowUpRight className="h-4 w-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
