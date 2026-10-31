import { eventTypes, statusStyles } from "../data/schedule";

export const isDeclined = (event) => event.response === "declined";

export const dotFor = (event) =>
  isDeclined(event) ? "bg-rose-500" : eventTypes[event.type].dot;

export const chipStyle = (event) =>
  isDeclined(event)
    ? "bg-rose-500/15 text-rose-300 line-through"
    : "bg-white/[0.05] text-ivory";

export const statusFor = (event) => {
  if (isDeclined(event)) {
    return {
      label: "Declined",
      className: "border-rose-500/40 bg-rose-500/15 text-rose-300",
    };
  }
  if (event.response === "pending") {
    return {
      label: "Waiting for you",
      className: "border-gold-400/30 bg-gold-400/10 text-gold-300",
    };
  }
  return statusStyles[event.status];
};