import { useState } from "react";
import {
  Building2,
  Car,
  Check,
  Info,
  MapPin,
  Navigation,
  Phone,
  Shirt,
  StickyNote,
  X,
} from "lucide-react";
import { eventTypes } from "../../data/schedule";
import { formatMoney } from "../../utils/format";
import { dotFor, isDeclined, statusFor } from "../../utils/offer";

const timeLabels = { shoot: "Call time", travel: "Departs" };
const endLabels = { shoot: "Pack up", travel: "Arrives" };

function Row({ icon: Icon, label, action, children }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-gold-400">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-mute">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-ivory">{children}</div>
      </div>
      {action}
    </div>
  );
}

function ActionLink({ href, icon: Icon, external = false, children }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel="noreferrer"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ivory transition duration-200 hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-300"
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </a>
  );
}

export default function EventCard({ event, onRespond }) {
  const [busy, setBusy] = useState("");
  const type = eventTypes[event.type];
  const status = statusFor(event);
  const declined = isDeclined(event);
  const TypeIcon = type.icon;
  const place = [event.location, event.city].filter(Boolean).join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

  const answer = async (action) => {
    setBusy(action);
    try {
      await onRespond(event.id, action);
    } finally {
      setBusy("");
    }
  };

  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-ink-900 transition duration-200 ${
        declined
          ? "border-rose-500/40"
          : "border-line hover:border-gold-400/30"
      }`}
    >
      <div className={`h-1 ${dotFor(event)}`} />
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${type.chip}`}
          >
            <TypeIcon className="h-3.5 w-3.5" />
            {type.label}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <h4 className="mt-4 font-display text-2xl leading-tight text-ivory">
          {event.title}
        </h4>
        <p className="mt-1 text-sm text-mute">{event.project}</p>

        {declined && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            You declined this offer.
          </p>
        )}

        {event.statusNote && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {event.statusNote}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between gap-4 rounded-2xl bg-ink-800/70 px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-mute">
              {timeLabels[event.type] || "Starts"}
            </p>
            <p className="gold-text font-display text-3xl leading-tight">
              {event.callTime}
            </p>
          </div>
          {event.wrapTime && (
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-mute">
                {endLabels[event.type] || "Ends"}
              </p>
              <p className="text-sm font-medium text-ivory">{event.wrapTime}</p>
            </div>
          )}
        </div>

        {event.offer && (
          <div className="mt-3 rounded-2xl border border-line bg-white/[0.03] p-4">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-mute">
              <Building2 className="h-3.5 w-3.5 text-gold-400" />
              Offer{event.offer.company ? ` from ${event.offer.company}` : ""}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-mute">Advance</p>
                <p className="mt-1 font-display text-xl text-aqua-400">
                  {formatMoney(event.offer.advance)}
                </p>
              </div>
              <div>
                <p className="text-xs text-mute">Total fee</p>
                <p className="mt-1 font-display text-xl text-gold-300">
                  {formatMoney(event.offer.total)}
                </p>
              </div>
            </div>
          </div>
        )}

        {event.response === "pending" && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={busy !== ""}
                onClick={() => answer("accept")}
                className="gold-btn inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                Accept
              </button>
              <button
                type="button"
                disabled={busy !== ""}
                onClick={() => answer("decline")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 px-4 py-2.5 text-sm font-semibold text-rose-300 transition duration-200 hover:bg-rose-500/10 disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                Decline
              </button>
            </div>
            {event.offer?.total > 0 && (
              <p className="mt-2 text-center text-xs text-mute">
                Accepting adds this to your projects.
              </p>
            )}
          </div>
        )}

        {event.response === "accepted" && event.offer?.total > 0 && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-aqua-400/30 bg-aqua-400/10 px-3 py-2 text-xs text-aqua-400">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Accepted. This is in your projects.
          </p>
        )}

        <div className="mt-2 divide-y divide-line/70">
          <Row
            icon={MapPin}
            label={event.offer ? "Shooting location" : "Where"}
            action={
              !event.online && (
                <ActionLink href={mapsUrl} icon={Navigation} external>
                  Directions
                </ActionLink>
              )
            }
          >
            {place}
          </Row>

          {event.contact && (
            <Row
              icon={Phone}
              label="Contact"
              action={
                <ActionLink href={`tel:+${event.contact.phone}`} icon={Phone}>
                  Call
                </ActionLink>
              }
            >
              {event.contact.name}
              <span className="text-mute">, {event.contact.role}</span>
            </Row>
          )}

          {event.pickup && (
            <Row icon={Car} label="Pickup">
              {event.pickup.time}, {event.pickup.driver}
              <span className="block text-xs text-mute">
                {event.pickup.vehicle}
              </span>
            </Row>
          )}

          {event.look && (
            <Row icon={Shirt} label="Look">
              {event.look.wardrobe}
              <span className="block text-xs text-mute">
                {[event.look.vanity, event.look.makeup]
                  .filter(Boolean)
                  .join(". ")}
              </span>
            </Row>
          )}
        </div>

        {event.notes && (
          <p className="mt-3 flex gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed text-mute">
            <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" />
            {event.notes}
          </p>
        )}
      </div>
    </article>
  );
}