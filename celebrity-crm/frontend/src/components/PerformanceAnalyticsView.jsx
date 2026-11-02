import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clapperboard,
  Download,
  Percent,
  Sparkles,
  Target,
  Wallet,
  X,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { getAnalytics } from "../api/analyticsApi";
import { formatMoney } from "../utils/format";

export default function PerformanceAnalyticsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNet, setShowNet] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => setError("Could not load your analytics. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-mute">Loading your analytics...</p>;
  if (error) return <p className="text-sm text-rose-400">{error}</p>;

  const displayIncome = showNet ? data.collected * 0.9 : data.collected;
  const progressPercent = data.annualTarget
    ? Math.min(Math.round((data.collected / data.annualTarget) * 100), 100)
    : 0;
  const totalProjects =
    data.activeProjects + data.upcomingProjects + data.completedProjects;

  const downloadAuditReport = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 17, 26);
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(245, 200, 115);
    doc.setFontSize(20);
    doc.text("EXECUTIVE TALENT FINANCIAL STATEMENT", 14, 22);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 30);
    doc.text("Confidential", 14, 36);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`Total Gross Revenue: ${formatMoney(data.collected)}`, 14, 50);
    doc.text(`TDS Deducted at Source (10%): ${formatMoney(data.collected * 0.1)}`, 14, 58);
    doc.text(`Net In-Hand Realized: ${formatMoney(data.collected * 0.9)}`, 14, 66);
    doc.text(`Receivables Pending: ${formatMoney(data.pending)}`, 14, 74);

    doc.text("Brand Deals:", 14, 90);
    data.deals.forEach((deal, index) => {
      doc.text(
        `${index + 1}. ${deal.brand} - ${formatMoney(deal.value)} (${deal.status})`,
        20,
        100 + index * 8,
      );
    });

    doc.save("Celebrity_Executive_Audit_Report.pdf");
  };

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-gold-400/25 bg-gradient-to-br from-gold-400/15 via-ink-900 to-ink-950 p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
              <Sparkles className="h-4 w-4 text-gold-400" /> Career velocity
            </div>
            <h2 className="mt-3 font-display text-4xl font-light text-ivory sm:text-5xl">
              Performance and revenue analytics
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-mute">
              Your payments, brand deals, projects and contracts in one view.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowNet(!showNet)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                showNet
                  ? "border-aqua-400 bg-aqua-400/15 text-aqua-300"
                  : "border-line bg-ink-800 text-mute hover:text-white"
              }`}
            >
              <Percent className="h-3.5 w-3.5" />
              {showNet ? "Showing net (after 10% TDS)" : "Showing gross figures"}
            </button>
            <button
              type="button"
              onClick={downloadAuditReport}
              className="gold-btn flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-lg"
            >
              <Download className="h-4 w-4" /> Export audit PDF
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-ink-900 p-6 lg:col-span-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400">
                <Target className="h-4 w-4" /> Earnings goal
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">
                Target: {formatMoney(data.annualTarget)}
              </h3>
            </div>
            <span className="rounded-full border border-aqua-400/20 bg-aqua-400/10 px-3 py-1 text-sm font-bold text-aqua-400">
              {progressPercent}% achieved
            </span>
          </div>
          <div className="mt-4">
            <div className="h-3 w-full overflow-hidden rounded-full border border-white/5 bg-black/60 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-aqua-400 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-mute">
              <span>Received: {formatMoney(data.collected)}</span>
              <span>
                Remaining: {formatMoney(Math.max(data.annualTarget - data.collected, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-400/10 to-ink-900 p-6 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-300">
                Work summary
              </span>
              <Clapperboard className="h-4 w-4 text-gold-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-white">
                {totalProjects}
              </span>
              <span className="text-sm text-mute">projects</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-mute">
              {data.activeProjects} active, {data.upcomingProjects} upcoming and{" "}
              {data.completedProjects} completed.
            </p>
          </div>
          <span className="mt-3 self-start rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
            {data.signedContracts} of {data.totalContracts} contracts signed
          </span>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-line bg-ink-900 p-5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase text-mute">Money received</span>
            <span className="rounded-xl bg-aqua-400/10 p-2 text-aqua-400">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            {formatMoney(displayIncome)}
          </p>
          <p className="mt-1 text-xs text-mute">
            {showNet ? "After 10% TDS" : "Gross amount"}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-ink-900 p-5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase text-mute">Brand pipeline</span>
            <span className="rounded-xl bg-gold-400/10 p-2 text-gold-400">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            {formatMoney(data.pipelineValue)}
          </p>
          <p className="mt-1 text-xs text-mute">
            {data.pipelineCount} open {data.pipelineCount === 1 ? "deal" : "deals"}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-ink-900 p-5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase text-mute">Estimated TDS</span>
            <span className="rounded-xl bg-purple-400/10 p-2 text-purple-400">
              <Percent className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            {formatMoney(data.collected * 0.1)}
          </p>
          <p className="mt-1 text-xs text-mute">10% of money received</p>
        </div>

        <div className="rounded-2xl border border-line bg-ink-900 p-5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase text-mute">Still to receive</span>
            <span className="rounded-xl bg-rose-400/10 p-2 text-rose-400">
              <ArrowDownRight className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            {formatMoney(data.pending)}
          </p>
          <p className="mt-1 text-xs text-mute">Payments that are due</p>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-ink-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Brand deal ledger</h3>
            <p className="mt-0.5 text-xs text-mute">Tap a row to see the details.</p>
          </div>
          <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-400">
            {data.deals.length} deals
          </span>
        </div>

        {data.deals.length ? (
          <div className="mt-4 divide-y divide-line/60">
            {data.deals.map((deal, index) => (
              <div
                key={deal.id}
                onClick={() => setSelectedDeal(deal)}
                className="group flex cursor-pointer flex-wrap items-center justify-between gap-4 rounded-xl px-3 py-4 transition hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold-400/10 text-xs font-bold text-gold-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white transition group-hover:text-gold-300">
                      {deal.brand}
                    </h4>
                    <p className="text-xs text-mute">{deal.campaign}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatMoney(deal.value)}</p>
                    <p className="text-[11px] text-mute">Due: {deal.due}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      deal.status === "Completed"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-gold-400/30 bg-gold-400/10 text-gold-300"
                    }`}
                  >
                    {deal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-mute">
            No brand deals yet.
          </p>
        )}
      </section>

      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-line bg-ink-900 p-7 shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSelectedDeal(null)}
              className="absolute right-5 top-5 text-mute hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-400">
              <CheckCircle2 className="h-4 w-4" /> Brand deal
            </div>
            <h3 className="mt-1 font-serif text-2xl font-bold text-white">
              {selectedDeal.brand}
            </h3>
            <p className="mt-0.5 text-xs text-mute">{selectedDeal.campaign}</p>

            <div className="my-6 space-y-3 rounded-2xl border border-white/5 bg-black/40 p-4 text-xs">
              <div className="flex justify-between border-b border-white/5 py-1">
                <span className="text-mute">Deal value</span>
                <span className="font-bold text-white">{formatMoney(selectedDeal.value)}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span className="text-mute">After 10% TDS</span>
                <span className="font-bold text-aqua-400">
                  {formatMoney(selectedDeal.value * 0.9)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span className="text-mute">Due date</span>
                <span className="font-bold text-white">{selectedDeal.due}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span className="text-mute">Status</span>
                <span className="font-bold text-white">{selectedDeal.status}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1">
                <span className="text-mute">Brand contact</span>
                <span className="font-bold text-white">{selectedDeal.contact}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-mute">Next step</span>
                <span className="max-w-[60%] text-right font-bold text-white">
                  {selectedDeal.nextStep}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDeal(null)}
              className="w-full rounded-xl border border-line px-5 py-3 text-xs text-mute hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}