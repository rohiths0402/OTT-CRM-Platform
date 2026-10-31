import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarClock,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileText,
  Search,
  Send,
  Wallet,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import AnimatedMoney from "../AnimatedMoney";
import { manager } from "../../data/mock";
import {
  paymentStatus,
  paymentWhen,
  sumAmount,
} from "../../data/payments";
import { formatMoney } from "../../utils/format";

const tabs = [
  { id: "pending", label: "To collect" },
  { id: "received", label: "Received" },
  { id: "sent", label: "Sent" },
  { id: "all", label: "All activity" },
];

const sortPayments = (items) =>
  [...items].sort((a, b) => {
    const rank = { overdue: 0, due: 1, sent: 2, received: 3 };
    if (rank[a.status] !== rank[b.status])
      return rank[a.status] - rank[b.status];
    return a.status === "received" ? b.date - a.date : a.date - b.date;
  });

function MakePaymentForm({ onClose, onRecord }) {
  const [recipient, setRecipient] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const validUpiId = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z0-9.-]{2,64}$/;
  const paymentLink = `upi://pay?${new URLSearchParams({
    pa: upiId,
    pn: recipient,
    am: Number(amount).toFixed(2),
    cu: "INR",
    tn: note || "Payment",
  }).toString()}`;

  const continueToPayment = (event) => {
    event.preventDefault();
    if (!recipient.trim()) {
      setError("Enter the name of the person or team you are paying.");
      return;
    }
    if (!validUpiId.test(upiId.trim())) {
      setError("Enter a valid UPI ID, for example name@bank.");
      return;
    }
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("Enter a payment amount greater than zero.");
      return;
    }
    setError("");
    setReady(true);
  };

  const recordPayment = (event) => {
    event.preventDefault();
    if (!reference.trim()) {
      setError("Add the UPI transaction reference after you complete payment.");
      return;
    }
    onRecord({
      id: `sent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      direction: "sent",
      recipient: recipient.trim(),
      upiId: upiId.trim(),
      amount: Number(amount),
      note: note.trim() || "Personal payment",
      reference: reference.trim(),
      method: "UPI",
      status: "sent",
      date: new Date(),
    });
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-md">
      <form
        onSubmit={ready ? recordPayment : continueToPayment}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-line bg-ink-900 p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-300">
              UPI transfer
            </p>
            <h3 className="mt-2 font-display text-3xl text-ivory">
              Make a payment
            </h3>
            <p className="mt-1 text-sm text-mute">
              Send money to a person or your crew.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close make payment"
            onClick={onClose}
            className="rounded-full p-2 text-mute transition hover:bg-white/5 hover:text-ivory"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!ready ? (
          <div className="mt-6 space-y-4">
            <label className="block text-xs text-mute">
              Recipient name
              <input
                autoFocus
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                placeholder="e.g. Arjun — manager"
                className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute/70"
              />
            </label>
            <label className="block text-xs text-mute">
              UPI ID
              <input
                autoComplete="off"
                value={upiId}
                onChange={(event) => setUpiId(event.target.value)}
                placeholder="name@bank"
                className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute/70"
              />
            </label>
            <label className="block text-xs text-mute">
              Amount (₹)
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="5000"
                className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute/70"
              />
            </label>
            <label className="block text-xs text-mute">
              Note
              <input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Stylist advance, travel, crew..."
                className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute/70"
              />
            </label>
            <p className="rounded-xl border border-gold-400/15 bg-gold-400/5 p-3 text-xs leading-5 text-mute">
              Your UPI app will ask you to review and authorize the transfer.
              This workspace never collects your UPI PIN.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.05] p-4">
              <p className="text-xs uppercase tracking-wider text-mute">
                Payment review
              </p>
              <p className="mt-2 font-display text-3xl text-rose-300">
                {formatMoney(Number(amount))}
              </p>
              <p className="mt-1 text-sm text-ivory">
                {recipient} · {upiId}
              </p>
              <p className="mt-1 text-xs text-mute">{note || "Personal payment"}</p>
            </div>
            <a
              href={paymentLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-300 px-4 py-3 text-sm font-semibold text-ink-950 transition hover:brightness-110"
            >
              <Send className="h-4 w-4" />
              Open UPI app to pay
            </a>
            <label className="block text-xs text-mute">
              UPI transaction ID / UTR
              <input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="Enter this after payment succeeds"
                className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute/70"
              />
            </label>
            <p className="text-[11px] leading-5 text-mute">
              Only add this to Sent history after your UPI app confirms the
              transfer. Keep the transaction ID for your records.
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-rose-400">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              if (ready) {
                setReady(false);
                setError("");
              } else onClose();
            }}
            className="rounded-xl border border-line px-4 py-2.5 text-sm text-mute hover:text-ivory"
          >
            {ready ? "Edit details" : "Cancel"}
          </button>
          <button
            type="submit"
            className="gold-btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            {ready ? <Check className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            {ready ? "Record sent payment" : "Review payment"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SettlementForm({ payment, onClose, onSettle }) {
  const remaining = Math.max(
    0,
    payment.amount - (payment.receivedAmount || 0),
  );
  const [amount, setAmount] = useState(String(remaining));
  const [method, setMethod] = useState("UPI");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const paidAmount = Number(amount);
    if (
      !Number.isFinite(paidAmount) ||
      paidAmount <= 0 ||
      paidAmount > remaining
    ) {
      setError("Enter a valid amount up to the remaining balance.");
      return;
    }
    if (!reference.trim()) {
      setError("Add the bank or transaction reference to record this payment.");
      return;
    }
    onSettle(payment.id, {
      amount: paidAmount,
      method,
      reference: reference.trim(),
      date: new Date(),
    });
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-md">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-3xl border border-line bg-ink-900 p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-aqua-400">
              Settlement entry
            </p>
            <h3 className="mt-2 font-display text-3xl text-ivory">
              Record payment
            </h3>
            <p className="mt-1 text-sm text-mute">{payment.payer}</p>
          </div>
          <button
            type="button"
            aria-label="Close settlement form"
            onClick={onClose}
            className="rounded-full p-2 text-mute transition hover:bg-white/5 hover:text-ivory"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 rounded-2xl border border-aqua-400/20 bg-aqua-400/5 p-4">
          <p className="text-xs text-mute">{payment.project} · {payment.kind}</p>
          <p className="mt-1 font-display text-3xl text-aqua-400">
            {formatMoney(remaining)}
          </p>
          {payment.receivedAmount > 0 && (
            <p className="mt-1 text-[11px] text-mute">
              Outstanding from {formatMoney(payment.amount)}
            </p>
          )}
          <p className="mt-1 text-[11px] leading-5 text-mute">
            Demo only: this records a payment you have already received. It
            does not initiate a bank or UPI transfer.
          </p>
        </div>
        <div className="mt-5 space-y-4">
          <label className="block text-xs text-mute">
            Amount received (₹)
            <input
              type="number"
              min="1"
              max={remaining}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-4 py-3 text-sm text-ivory"
            />
          </label>
          <label className="block text-xs text-mute">
            Payment method
            <select
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-4 py-3 text-sm text-ivory"
            >
              <option>UPI</option>
              <option>Bank transfer</option>
              <option>Cheque</option>
              <option>Cash</option>
              <option>Other</option>
            </select>
          </label>
          <label className="block text-xs text-mute">
            Transaction / bank reference
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="UTR or payment reference"
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-4 py-3 text-sm text-ivory placeholder:text-mute/70"
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="mt-4 text-sm text-rose-400">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line px-4 py-2.5 text-sm text-mute hover:text-ivory"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-aqua-400 px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:brightness-110"
          >
            <Check className="h-4 w-4" />
            Confirm received
          </button>
        </div>
      </form>
    </div>
  );
}

function PaymentDetails({ payment, onClose, onRecordPayment }) {
  const status = paymentStatus[payment.status];
  const Icon = status.icon;
  const managerFirstName = manager.name.split(" ")[0];
  const message = `Hi ${managerFirstName}, could you check the ${payment.kind.toLowerCase()} of ${formatMoney(payment.amount)} from ${payment.payer} for ${payment.project}?`;

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close payment details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`${payment.project} payment details`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed inset-y-3 right-3 z-[70] flex w-[min(34rem,calc(100vw-1.5rem))] flex-col overflow-y-auto rounded-3xl border border-line bg-ink-900 shadow-2xl"
      >
        <div className="relative overflow-hidden border-b border-line bg-gradient-to-br from-aqua-400/10 via-ink-900 to-ink-900 p-7">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-mute transition hover:bg-white/5 hover:text-ivory"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-xs uppercase tracking-[0.2em] text-aqua-400">
            {payment.kind} · {payment.projectType}
          </p>
          <h3 className="mt-3 pr-9 font-display text-3xl text-ivory">
            {payment.project}
          </h3>
          <p className="mt-1 text-sm text-mute">{payment.payer}</p>
          <p
            className={`mt-4 font-display text-4xl ${
              payment.status === "received"
                ? "text-aqua-400"
                : payment.status === "overdue"
                  ? "text-rose-400"
                  : "text-gold-300"
            }`}
          >
            {formatMoney(payment.amount)}
          </p>
          {payment.receivedAmount > 0 &&
            payment.status !== "received" && (
              <p className="mt-1 text-xs text-mute">
                {formatMoney(payment.receivedAmount)} received ·{" "}
                {formatMoney(payment.amount - payment.receivedAmount)} left
              </p>
            )}
        </div>
        <div className="flex-1 space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${status.chip}`}>
              <Icon className="h-3.5 w-3.5" />
              {status.label}
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-xs text-mute">
              {paymentWhen(payment)}
            </span>
          </div>
          <div className="grid gap-3 rounded-2xl border border-line bg-ink-800/60 p-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-mute">
                Payment milestone
              </p>
              <p className="mt-1 text-sm text-ivory">{payment.kind}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-mute">
                Reference
              </p>
              <p className="mt-1 break-all text-sm text-ivory">
                {payment.reference || "Not recorded"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] uppercase tracking-wider text-mute">
                Note
              </p>
              <p className="mt-1 text-sm leading-6 text-ivory">
                {payment.note}
              </p>
            </div>
          </div>
          {payment.status !== "received" ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onRecordPayment(payment)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-aqua-400 px-4 py-3 text-sm font-semibold text-ink-950 transition hover:brightness-110"
              >
                <CreditCard className="h-4 w-4" />
                Record payment received
              </button>
              <a
                href={`https://wa.me/${manager.phone}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-medium text-ivory transition hover:border-gold-400/50 hover:bg-gold-400/5"
              >
                <FaWhatsapp className="h-4 w-4 text-aqua-400" />
                Ask {managerFirstName} to follow up
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border border-aqua-400/20 bg-aqua-400/5 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-aqua-400">
                <CheckCircle2 className="h-4 w-4" />
                Payment recorded as received
              </p>
              {payment.method && (
                <p className="mt-2 text-xs text-mute">
                  {payment.method}
                  {payment.receivedAmount
                    ? ` · ${formatMoney(payment.receivedAmount)}`
                    : ""}
                  {payment.reference ? ` · Ref ${payment.reference}` : ""}
                </p>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs text-ivory transition hover:border-aqua-400/40"
              >
                <FileText className="h-3.5 w-3.5" />
                Print payment record
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

export default function PaymentsView({
  initialPaymentId,
  paymentItems,
  onSettle,
  outgoingPayments,
  onRecordOutgoing,
}) {
  const initial =
    paymentItems.find((payment) => payment.id === initialPaymentId) || null;
  const [tab, setTab] = useState(
    initial && initial.status === "received" ? "received" : "pending",
  );
  const [query, setQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(initial);
  const [settlingPayment, setSettlingPayment] = useState(null);
  const [makePaymentOpen, setMakePaymentOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const received = paymentItems.reduce(
    (total, payment) =>
      total +
      (payment.receivedAmount ||
        (payment.status === "received" ? payment.amount : 0)),
    0,
  );
  const stillToCome = sumAmount(
    paymentItems
      .filter((payment) => payment.status !== "received")
      .map((payment) => ({
        ...payment,
        amount: payment.amount - (payment.receivedAmount || 0),
      })),
  );
  const sentTotal = sumAmount(outgoingPayments);
  const overdueList = paymentItems.filter(
    (payment) => payment.status === "overdue",
  );
  const counts = useMemo(
    () => ({
      pending: paymentItems.filter((payment) => payment.status !== "received")
        .length,
      received: paymentItems.filter((payment) => payment.status === "received")
        .length,
      sent: outgoingPayments.length,
      all: paymentItems.length + outgoingPayments.length,
    }),
    [paymentItems, outgoingPayments],
  );
  const activity = [...paymentItems, ...outgoingPayments];
  const visible = sortPayments(
    activity.filter((payment) => {
      const matchesTab = payment.direction === "sent"
        ? tab === "sent" || tab === "all"
        : tab === "all" ||
          (tab === "received" && payment.status === "received") ||
          (tab === "pending" && payment.status !== "received");
      const searchText =
        `${payment.project || ""} ${payment.payer || ""} ${payment.recipient || ""} ${payment.kind || ""} ${payment.status} ${payment.reference || ""}`.toLowerCase();
      return matchesTab && searchText.includes(query.trim().toLowerCase());
    }),
  );

  const settle = (paymentId, settlement) => {
    const payment = paymentItems.find((item) => item.id === paymentId);
    const updatedAmount =
      (payment?.receivedAmount || 0) + settlement.amount;
    const isComplete = updatedAmount >= (payment?.amount || 0);
    onSettle(paymentId, { ...settlement, isComplete });
    setSettlingPayment(null);
    setSelectedPayment(null);
    setTab(isComplete ? "received" : "pending");
    setNotice(
      isComplete
        ? `${payment?.payer || "Payment"} settlement completed`
        : `Partial settlement recorded for ${payment?.payer || "payment"}`,
    );
  };

  const recordOutgoing = (payment) => {
    onRecordOutgoing(payment);
    setMakePaymentOpen(false);
    setTab("sent");
    setNotice(`${formatMoney(payment.amount)} sent to ${payment.recipient}`);
  };

  const summary = [
    { label: "Received", value: received, tone: "text-aqua-400", icon: ArrowDownLeft },
    { label: "Sent", value: sentTotal, tone: "text-rose-300", icon: Send },
    { label: "Expected", value: stillToCome, tone: "text-gold-300", icon: Clock3 },
    {
      label: overdueList.length
        ? `${overdueList.length} overdue`
        : "No overdue",
      value: sumAmount(
        overdueList.map((payment) => ({
          ...payment,
          amount: payment.amount - (payment.receivedAmount || 0),
        })),
      ),
      tone: overdueList.length ? "text-rose-400" : "text-mute",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] border border-aqua-400/20 bg-gradient-to-br from-[#102522] via-ink-900 to-[#17121c] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-14 -top-20 h-60 w-60 rounded-full bg-aqua-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-aqua-400">
              <Wallet className="h-4 w-4" />
              Talent finance
            </div>
            <h2 className="mt-3 font-display text-4xl font-light text-ivory sm:text-5xl">
              Money in & out
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-mute">
              Follow income from your projects and make payments to your team
              from one private money desk.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="relative min-w-48 rounded-2xl border border-aqua-400/20 bg-ink-950/40 p-4">
            <p className="text-xs text-mute">Available received total</p>
            <p className="mt-1 font-display text-3xl text-aqua-400">
              <AnimatedMoney value={received} />
            </p>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-aqua-400">
              <ArrowDownLeft className="h-3 w-3" />
              Across {counts.received} settlements
            </p>
            </div>
            <button
              type="button"
              onClick={() => setMakePaymentOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:-translate-y-0.5 hover:border-rose-300/50 hover:bg-rose-300/15"
            >
              <Send className="h-4 w-4" />
              Make a payment
            </button>
          </div>
        </div>
        <div className="relative mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((entry) => {
            const Icon = entry.icon;
            return (
              <div
                key={entry.label}
                className="rounded-2xl border border-white/10 bg-ink-950/40 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-mute">{entry.label}</p>
                  <Icon className={`h-4 w-4 ${entry.tone}`} />
                </div>
                <p className={`mt-2 font-display text-2xl ${entry.tone}`}>
                  <AnimatedMoney value={entry.value} />
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-aqua-400/25 bg-aqua-400/10 px-4 py-3 text-sm text-aqua-400"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {notice}
          </span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setNotice("")}
            className="rounded-lg p-1 hover:bg-aqua-400/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter payments" className="flex gap-1">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`rounded-xl px-3 py-2 text-sm transition sm:px-4 ${
                tab === id
                  ? "bg-aqua-400/10 text-aqua-400"
                  : "text-mute hover:text-ivory"
              }`}
            >
              {id === "sent" ? "Sent" : label}
              <span className="ml-1.5 text-xs opacity-70">{counts[id]}</span>
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-line bg-ink-900 px-3 py-2.5 text-mute focus-within:border-aqua-400/50 sm:w-72">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search project or payer"
            aria-label="Search payments"
            className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-mute"
          />
        </label>
      </div>

      {visible.length ? (
        <ul className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((payment, index) => {
            if (payment.direction === "sent") {
              return (
                <motion.li
                  key={payment.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: Math.min(index, 6) * 0.035,
                  }}
                  className="self-start"
                >
                  <article className="relative flex min-h-56 flex-col overflow-hidden rounded-3xl border border-rose-300/20 bg-gradient-to-br from-rose-300/[0.06] via-ink-900 to-ink-900 p-5 sm:p-6">
                    <span className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-rose-300/10 blur-3xl" />
                    <div className="relative flex items-center justify-between gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-300/10 text-rose-300">
                        <Send className="h-5 w-5" />
                      </span>
                      <span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-[11px] text-rose-200">
                        Sent · UPI
                      </span>
                    </div>
                    <div className="relative mt-5">
                      <p className="truncate font-display text-xl text-ivory">
                        {payment.recipient}
                      </p>
                      <p className="mt-1 truncate text-sm text-mute">
                        {payment.note} · {payment.upiId}
                      </p>
                    </div>
                    <div className="relative mt-auto flex items-end justify-between gap-3 border-t border-white/[0.08] pt-4">
                      <span>
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">
                          Amount sent
                        </span>
                        <span className="mt-1 block font-display text-2xl text-rose-200">
                          {formatMoney(payment.amount)}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">
                          Date
                        </span>
                        <span className="mt-1 block text-sm text-ivory">
                          {payment.date.toLocaleDateString("en-IN")}
                        </span>
                      </span>
                    </div>
                    <p className="relative mt-3 truncate text-xs text-mute">
                      UTR · {payment.reference}
                    </p>
                  </article>
                </motion.li>
              );
            }
            const status = paymentStatus[payment.status];
            const Icon = status.icon;
            return (
              <motion.li
                key={payment.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(index, 6) * 0.035 }}
                className="self-start"
              >
                <button
                  type="button"
                  onClick={() => setSelectedPayment(payment)}
                  className="group relative flex min-h-56 w-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-900 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-aqua-400/35 hover:shadow-[0_20px_55px_-30px_rgba(63,214,198,0.35)] sm:p-6"
                >
                  <span className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-aqua-400/10 blur-3xl transition group-hover:bg-aqua-400/20" />
                  <span className="relative flex w-full items-center justify-between gap-3">
                    <span className={`grid h-11 w-11 place-items-center rounded-2xl ${status.tone}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-[11px] ${status.chip}`}>
                      {status.label}
                    </span>
                  </span>
                  <span className="relative mt-5 block w-full">
                    <span className="block truncate font-display text-xl text-ivory">
                      {payment.project}
                    </span>
                    <span className="mt-1 block truncate text-sm text-mute">
                      {payment.kind} · {payment.payer}
                    </span>
                  </span>
                  <span className="relative mt-auto flex w-full items-end justify-between gap-3 border-t border-line pt-4">
                    <span>
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">
                        {payment.status === "received" ? "Received" : "Amount"}
                      </span>
                      <span className={`mt-1 block font-display text-2xl ${payment.status === "received" ? "text-aqua-400" : "text-ivory"}`}>
                        {formatMoney(
                          payment.status === "received"
                            ? payment.receivedAmount || payment.amount
                            : payment.amount - (payment.receivedAmount || 0),
                        )}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">
                        {payment.status === "received" ? "Date" : "Due"}
                      </span>
                      <span className="mt-1 block text-sm text-ivory">
                        {paymentWhen(payment)}
                      </span>
                    </span>
                  </span>
                  <span className="relative mt-4 flex w-full items-center justify-between text-xs text-mute">
                    <span>{payment.reference || "No reference yet"}</span>
                    <span className="inline-flex items-center gap-1 text-aqua-400 transition group-hover:gap-2">
                      {payment.status === "received" ? "View receipt" : "Open settlement"}
                      {payment.status === "received" ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <CreditCard className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-3xl border border-dashed border-line bg-ink-900/60 p-12 text-center">
          <CircleDollarSign className="mx-auto h-8 w-8 text-aqua-400" />
          <p className="mt-4 font-display text-xl text-ivory">Nothing to show</p>
          <p className="mt-2 text-sm text-mute">
            Try a different search or activity filter.
          </p>
        </div>
      )}

      <AnimatePresence>
        {makePaymentOpen && (
          <MakePaymentForm
            key="make-payment"
            onClose={() => setMakePaymentOpen(false)}
            onRecord={recordOutgoing}
          />
        )}
        {selectedPayment && (
          <PaymentDetails
            key="payment-details"
            payment={
              paymentItems.find((item) => item.id === selectedPayment.id) ||
              selectedPayment
            }
            onClose={() => setSelectedPayment(null)}
            onRecordPayment={(payment) => setSettlingPayment(payment)}
          />
        )}
        {settlingPayment && (
          <SettlementForm
            key="settlement-form"
            payment={settlingPayment}
            onClose={() => setSettlingPayment(null)}
            onSettle={settle}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
