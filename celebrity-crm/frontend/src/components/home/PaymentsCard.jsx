import AnimatedMoney from "../AnimatedMoney";
import CardHeader from "./CardHeader";
import { card } from "../../styles/cardStyles";
import {
  keyPayments,
  paymentStatus,
  paymentWhen,
  payments,
  sumAmount,
} from "../../data/payments";
import { formatMoney } from "../../utils/format";

export default function PaymentsCard({ onNavigate }) {
  const rows = keyPayments();
  const stillToCome = sumAmount(
    payments.filter((payment) => payment.status !== "received"),
  );

  return (
    <section className={card}>
      <CardHeader
        title="Payments"
        actionLabel="View all"
        onAction={() => onNavigate("payments")}
      />

      <ul className="mt-5 space-y-3">
        {rows.map(({ slot, payment }) => {
          const status = paymentStatus[payment.status];
          const Icon = status.icon;
          return (
            <li key={payment.id}>
              <button
                type="button"
                onClick={() =>
                  onNavigate("payments", { paymentId: payment.id })
                }
                className="group flex w-full items-center gap-3 rounded-2xl border border-line bg-ink-800/60 p-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/40"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${status.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] uppercase tracking-wider text-mute">
                    {slot}
                  </span>
                  <span className="block truncate text-sm font-medium text-ivory">
                    {payment.project}
                  </span>
                  <span className="block text-xs text-mute">
                    {paymentWhen(payment)}
                  </span>
                </span>
                <span className="shrink-0 font-display text-lg text-ivory">
                  {formatMoney(payment.amount)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
        <span className="text-xs text-mute">Total still to come</span>
        <span className="font-display text-xl text-gold-300">
          <AnimatedMoney value={stillToCome} />
        </span>
      </div>
    </section>
  );
}
