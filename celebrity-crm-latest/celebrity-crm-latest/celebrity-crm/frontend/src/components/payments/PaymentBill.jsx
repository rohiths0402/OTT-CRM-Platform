import { Download, X } from "lucide-react";
import { billNumber, downloadBill } from "../../utils/paymentBill";
import { formatMoney } from "../../utils/format";

export default function PaymentBill({ payment, name, onClose }) {
  const received = payment.receivedAmount || payment.amount;
  const balance = payment.amount - received;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 text-gray-900 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Payment bill
            </p>
            <h3 className="mt-1 text-2xl font-semibold">{billNumber(payment)}</h3>
            <p className="text-sm text-gray-500">
              {payment.date.toLocaleDateString("en-IN")}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close bill"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase text-gray-500">Received from</p>
            <p className="mt-1 font-semibold">{payment.payer}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500">Paid to</p>
            <p className="mt-1 font-semibold">{name}</p>
          </div>
        </div>

        <div className="mt-6 border-y border-gray-200 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{payment.project}</p>
              <p className="text-sm text-gray-500">
                {payment.kind} · {payment.projectType}
              </p>
            </div>
            <p className="font-semibold">{formatMoney(payment.amount)}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Bill amount</span>
            <span>{formatMoney(payment.amount)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Received</span>
            <span>{formatMoney(received)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Balance</span>
            <span>{formatMoney(balance)}</span>
          </div>
        </div>

        <div className="mt-5 space-y-1 rounded-xl bg-gray-50 p-4 text-sm">
          <p>
            <span className="text-gray-500">Status: </span>
            {balance === 0 ? "Paid in full" : "Partly paid"}
          </p>
          <p>
            <span className="text-gray-500">Method: </span>
            {payment.method || "-"}
          </p>
          <p className="break-all">
            <span className="text-gray-500">Reference: </span>
            {payment.reference || "-"}
          </p>
          <p>
            <span className="text-gray-500">Note: </span>
            {payment.note || "-"}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => downloadBill(payment, name)}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}