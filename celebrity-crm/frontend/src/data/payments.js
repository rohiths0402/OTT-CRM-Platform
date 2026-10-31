import { Banknote, BellRing, Hourglass } from "lucide-react";
import { formatDay, startOfDay } from "../utils/dates";

export const paymentStatus = {
  received: {
    label: "Received",
    icon: Banknote,
    chip: "border-aqua-400/30 bg-aqua-400/10 text-aqua-400",
    tone: "bg-aqua-400/15 text-aqua-400",
  },
  due: {
    label: "Due",
    icon: Hourglass,
    chip: "border-gold-400/30 bg-gold-400/10 text-gold-300",
    tone: "bg-gold-400/15 text-gold-300",
  },
  overdue: {
    label: "Overdue",
    icon: BellRing,
    chip: "border-rose-400/30 bg-rose-400/10 text-rose-400",
    tone: "bg-rose-400/15 text-rose-400",
  },
};

const today = startOfDay(new Date());

export const paymentWhen = (payment) => {
  if (payment.status === "received")
    return `Received ${formatDay(payment.date)}`;
  if (payment.status === "overdue") {
    const days = Math.round((today - payment.date) / 86400000);
    return `Overdue by ${days} ${days === 1 ? "day" : "days"}`;
  }
  return `Due ${formatDay(payment.date)}`;
};

export const sumAmount = (list) =>
  list.reduce((total, payment) => total + payment.amount, 0);

export const keyPayments = (payments) => {
  const advance = payments
    .filter(
      (payment) => payment.status === "received" && payment.kind === "Advance",
    )
    .sort((a, b) => b.date - a.date)[0];
  const adBalance = payments
    .filter(
      (payment) =>
        payment.status === "due" && payment.projectType === "Ad film",
    )
    .sort((a, b) => a.date - b.date)[0];
  const overdue = payments
    .filter((payment) => payment.status === "overdue")
    .sort((a, b) => a.date - b.date)[0];
  const nextDue = payments
    .filter(
      (payment) =>
        payment.status === "due" && payment.projectType !== "Ad film",
    )
    .sort((a, b) => a.date - b.date)[0];

  return [
    advance && { slot: "Advance received", payment: advance },
    adBalance && { slot: "Balance due", payment: adBalance },
    overdue
      ? { slot: "Overdue", payment: overdue }
      : nextDue && { slot: "Pending", payment: nextDue },
  ].filter(Boolean);
};