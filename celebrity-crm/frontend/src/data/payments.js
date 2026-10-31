import { Banknote, BellRing, Hourglass } from "lucide-react";
import { addDays, formatDay, startOfDay } from "../utils/dates";

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

const raw = [
  {
    id: "pay-1",
    project: "The Last Lighthouse",
    projectType: "Web series",
    payer: "Lumen Studios",
    kind: "Advance",
    amount: 3000000,
    status: "received",
    offset: -2,
    reference: "UTR 4821 7730 19",
    note: "Signing advance",
  },
  {
    id: "pay-2",
    project: "Festival Watch Campaign",
    projectType: "Ad film",
    payer: "Aster Watches",
    kind: "Balance",
    amount: 6000000,
    status: "due",
    offset: 4,
    reference: "Invoice AW-1042",
    note: "Payable on the shoot day",
  },
  {
    id: "pay-3",
    project: "Harbour Lights",
    projectType: "Feature film",
    payer: "Velvet Originals",
    kind: "Final payment",
    amount: 2500000,
    status: "overdue",
    offset: -6,
    reference: "Invoice VO-310",
    note: "Was due after the dubbing wrap",
  },
  {
    id: "pay-4",
    project: "The Blood Oath",
    projectType: "Feature film",
    payer: "Northlight Productions",
    kind: "Balance",
    amount: 9000000,
    status: "due",
    offset: 5,
    reference: "Invoice NL-208",
    note: "Next milestone",
  },
  {
    id: "pay-5",
    project: "Chola Chronicles",
    projectType: "Narration",
    payer: "Heritage Films",
    kind: "Full payment",
    amount: 2500000,
    status: "due",
    offset: 12,
    reference: "Invoice HF-077",
    note: "After the contract is signed",
  },
  {
    id: "pay-6",
    project: "The Last Lighthouse",
    projectType: "Web series",
    payer: "Lumen Studios",
    kind: "Balance",
    amount: 15000000,
    status: "due",
    offset: 63,
    reference: "Invoice LS-012",
    note: "On the start date in January",
  },
  {
    id: "pay-7",
    project: "Festival Watch Campaign",
    projectType: "Ad film",
    payer: "Aster Watches",
    kind: "Advance",
    amount: 6000000,
    status: "received",
    offset: -10,
    reference: "UTR 3390 1184 52",
    note: "Campaign advance",
  },
  {
    id: "pay-8",
    project: "The Blood Oath",
    projectType: "Feature film",
    payer: "Northlight Productions",
    kind: "Milestone",
    amount: 11000000,
    status: "received",
    offset: -45,
    reference: "UTR 7712 4408 06",
    note: "Mid schedule milestone",
  },
  {
    id: "pay-9",
    project: "Harbour Lights",
    projectType: "Feature film",
    payer: "Velvet Originals",
    kind: "Milestone",
    amount: 2500000,
    status: "received",
    offset: -50,
    reference: "UTR 2201 9954 31",
    note: "Dubbing start milestone",
  },
  {
    id: "pay-10",
    project: "Monsoon Notes",
    projectType: "Feature film",
    payer: "Blue Door Pictures",
    kind: "Final payment",
    amount: 9000000,
    status: "received",
    offset: -70,
    reference: "UTR 6643 0127 88",
    note: "Paid in full",
  },
  {
    id: "pay-11",
    project: "Harbour Lights",
    projectType: "Feature film",
    payer: "Velvet Originals",
    kind: "Advance",
    amount: 2500000,
    status: "received",
    offset: -100,
    reference: "UTR 1180 5523 70",
    note: "Signing advance",
  },
  {
    id: "pay-12",
    project: "The Blood Oath",
    projectType: "Feature film",
    payer: "Northlight Productions",
    kind: "Advance",
    amount: 10000000,
    status: "received",
    offset: -120,
    reference: "UTR 9054 3317 25",
    note: "Signing advance",
  },
];

export const payments = raw.map(({ offset, ...rest }) => ({
  ...rest,
  date: addDays(today, offset),
}));

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

export const keyPayments = () => {
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
