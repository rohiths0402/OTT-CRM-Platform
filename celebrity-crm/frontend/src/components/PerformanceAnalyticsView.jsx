import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  Clapperboard,
  Wallet,
  Download,
  Sparkles,
  TrendingUp,
  Percent,
  Flame,
  CheckCircle2,
  X,
  Target,
  FileSpreadsheet,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { formatMoney } from "../utils/format";

const periods = [
  { id: 6, label: "Last 6 months" },
  { id: 12, label: "Last 12 months" },
  { id: 0, label: "All time records" },
];

const mockDeals = [
  {
    id: "1",
    brand: "Titan Celestial Watches",
    campaign: "Diwali Global TVC & 4 Reels",
    value: 32000000,
    status: "In production",
    due: "15 Nov 2026",
    manager: "Sanjay Narayanan",
  },
  {
    id: "2",
    brand: "Puma Sportswear",
    campaign: "Winter Athleisure Drop",
    value: 27500000,
    status: "Negotiating",
    due: "28 Nov 2026",
    manager: "Matrix Agency",
  },
  {
    id: "3",
    brand: "Audi Electric Experience",
    campaign: "EV Keynote Endorsement",
    value: 24500000,
    status: "Completed",
    due: "Paid in Full",
    manager: "Direct",
  },
  {
    id: "4",
    brand: "Aster Swiss Luxury",
    campaign: "Print Hoardings & Ads",
    value: 18000000,
    status: "In production",
    due: "05 Dec 2026",
    manager: "Sanjay Narayanan",
  },
];

const mockPayments = [
  {
    id: "p1",
    title: "Garuda 2 - Advance Signing",
    date: "2026-10-15",
    amount: 50000000,
    received: 50000000,
    status: "received",
  },
  {
    id: "p2",
    title: "Titan Watches - Milestone 1",
    date: "2026-09-10",
    amount: 16000000,
    received: 16000000,
    status: "received",
  },
  {
    id: "p3",
    title: "Madras Syndicate - Dubbing",
    date: "2026-08-01",
    amount: 25000000,
    received: 25000000,
    status: "received",
  },
  {
    id: "p4",
    title: "Puma - Signing Tranche",
    date: "2026-11-15",
    amount: 12500000,
    received: 0,
    status: "pending",
  },
];

export default function PerformanceAnalyticsView() {
  const [period, setPeriod] = useState(6);
  const [showNet, setShowNet] = useState(false); // Toggle between Gross and Net (TDS 10%)
  const [selectedDeal, setSelectedDeal] = useState(null); // Clickable Deal Modal
  const [annualTarget, setAnnualTarget] = useState(120000000); // ₹ 12 Cr Target

  // Total collected calculation
  const totalCollected = mockPayments.reduce((sum, p) => sum + p.received, 0);
  const totalPending = mockPayments.reduce(
    (sum, p) => (p.status === "pending" ? sum + p.amount : sum),
    0,
  );
  const displayIncome = showNet ? totalCollected * 0.9 : totalCollected; // Net after 10% TDS
  const progressPercent = Math.min(
    Math.round((totalCollected / annualTarget) * 100),
    100,
  );

  // 1. FEATURE: REAL WORKING PDF DOWNLOAD FOR AUDITOR / CA
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
    doc.text("Confidential & Subject to Non-Disclosure Agreements", 14, 36);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`Total Gross Revenue: ${formatMoney(totalCollected)}`, 14, 50);
    doc.text(
      `TDS Deducted at Source (10%): ${formatMoney(totalCollected * 0.1)}`,
      14,
      58,
    );
    doc.text(
      `Net In-Hand Realized: ${formatMoney(totalCollected * 0.9)}`,
      14,
      66,
    );
    doc.text(
      `Committed Receivables Pending: ${formatMoney(totalPending)}`,
      14,
      74,
    );

    doc.text("Active Endorsement Pipeline:", 14, 90);
    mockDeals.forEach((deal, idx) => {
      doc.text(
        `${idx + 1}. ${deal.brand} - ${formatMoney(deal.value)} (${deal.status})`,
        20,
        100 + idx * 8,
      );
    });

    doc.save("Celebrity_Executive_Audit_Report.pdf");
  };

  return (
    <div className="space-y-7 selection:bg-gold-500 selection:text-black">
      {/* =========================================================================
          TOP BANNER WITH REAL ACTION CONTROLS
      ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-gold-400/25 bg-gradient-to-br from-gold-400/15 via-ink-900 to-ink-950 p-6 sm:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-300 font-bold">
              <Sparkles className="h-4 w-4 text-gold-400" /> Career Velocity &
              Market Valuation
            </div>
            <h2 className="mt-3 font-display text-4xl font-light text-ivory sm:text-5xl">
              Performance & Revenue Analytics
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-mute">
              Real-time audit of verified film remuneration, brand endorsement
              pipelines, and projected tax withholdings.
            </p>
          </div>

          {/* Action Buttons: Tax Toggle & Export CA Report */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Gross vs Net Switch */}
            <button
              onClick={() => setShowNet(!showNet)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold border transition ${
                showNet
                  ? "bg-aqua-400/15 border-aqua-400 text-aqua-300"
                  : "bg-ink-800 border-line text-mute hover:text-white"
              }`}
            >
              <Percent className="h-3.5 w-3.5" />
              {showNet ? "Showing Net (Post-TDS 10%)" : "Showing Gross Figures"}
            </button>

            {/* Working PDF Export Button */}
            <button
              onClick={downloadAuditReport}
              className="gold-btn flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-lg"
            >
              <Download className="h-4 w-4" /> Export CA Audit PDF
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE 1: ANNUAL EARNINGS TARGET & STAR POWER INDEX
      ========================================================================= */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Annual Target Progress */}
        <div className="lg:col-span-8 rounded-2xl border border-line bg-ink-900 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5">
                <Target className="h-4 w-4" /> Fiscal Year Goal (FY 2026-27)
              </p>
              <h3 className="text-xl font-bold text-white mt-1">
                Target: {formatMoney(annualTarget)}
              </h3>
            </div>
            <span className="text-sm font-bold text-aqua-400 bg-aqua-400/10 px-3 py-1 rounded-full border border-aqua-400/20">
              {progressPercent}% Achieved
            </span>
          </div>

          <div className="mt-4">
            <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-gold-500 via-gold-300 to-aqua-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-mute mt-2">
              <span>Realized: {formatMoney(totalCollected)}</span>
              <span>
                Remaining to goal:{" "}
                {formatMoney(Math.max(annualTarget - totalCollected, 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Star Power & OTT ROI Score */}
        <div className="lg:col-span-4 rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-400/10 to-ink-900 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gold-300 font-bold">
                OTT Star Index
              </span>
              <Flame className="h-4 w-4 text-gold-400 animate-pulse" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-white">
                9.4
              </span>
              <span className="text-sm text-mute">/ 10 Rating</span>
            </div>
            <p className="text-xs text-mute mt-1.5 leading-relaxed">
              Based on 48M trailer views and 3.2x subscriber acquisition lift on
              recent OTT titles.
            </p>
          </div>
          <span className="mt-3 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 self-start">
            High Salary Leverage Tier
          </span>
        </div>
      </div>

      {/* =========================================================================
          KEY METRIC SUMMARY CARDS
      ========================================================================= */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-line bg-ink-900 p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-mute uppercase font-semibold">
              Realized Bank Inflow
            </span>
            <span className="p-2 rounded-xl bg-aqua-400/10 text-aqua-400">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            {formatMoney(displayIncome)}
          </p>
          <p className="mt-1 text-xs text-mute">
            {showNet ? "Post 10% TDS deduction" : "Gross bank disburals"}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-ink-900 p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-mute uppercase font-semibold">
              Active Commercial Pipeline
            </span>
            <span className="p-2 rounded-xl bg-gold-400/10 text-gold-400">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            ₹ 10.2 Cr
          </p>
          <p className="mt-1 text-xs text-mute">
            4 Active campaigns in execution
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-ink-900 p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-mute uppercase font-semibold">
              Estimated TDS Withheld
            </span>
            <span className="p-2 rounded-xl bg-purple-400/10 text-purple-400">
              <Percent className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            {formatMoney(totalCollected * 0.1)}
          </p>
          <p className="mt-1 text-xs text-mute">
            Available for tax credit in ITR
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-ink-900 p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs text-mute uppercase font-semibold">
              Pending Escrow Tranches
            </span>
            <span className="p-2 rounded-xl bg-rose-400/10 text-rose-400">
              <ArrowDownRight className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            {formatMoney(totalPending)}
          </p>
          <p className="mt-1 text-xs text-mute">Due on shoot wrap milestone</p>
        </div>
      </section>

      {/* =========================================================================
          FEATURE 2: INTERACTIVE CLICKABLE DEALS TABLE
      ========================================================================= */}
      <section className="rounded-2xl border border-line bg-ink-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              Brand Endorsement Deal Ledger 
            </h3>
            <p className="text-xs text-mute mt-0.5">
              Tap any row to view milestone breakdown, manager notes, and
              deliverables.
            </p>
          </div>
          <span className="text-xs text-gold-400 font-semibold bg-gold-400/10 px-3 py-1 rounded-full border border-gold-400/20">
            {mockDeals.length} Contracted Deals
          </span>
        </div>

        <div className="mt-4 divide-y divide-line/60">
          {mockDeals.map((deal, idx) => (
            <div
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              className="flex flex-wrap items-center justify-between gap-4 py-4 px-3 rounded-xl hover:bg-white/[0.03] transition cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold-400/10 text-xs font-bold text-gold-300">
                  0{idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-gold-300 transition">
                    {deal.brand}
                  </h4>
                  <p className="text-xs text-mute">{deal.campaign}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {formatMoney(deal.value)}
                  </p>
                  <p className="text-[11px] text-mute">Due: {deal.due}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    deal.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-gold-400/10 text-gold-300 border-gold-400/30"
                  }`}
                >
                  {deal.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CLICKABLE DEAL MODAL (DRILL-DOWN VIEW)
      ========================================================================= */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-line bg-ink-900 p-7 shadow-2xl">
            <button
              onClick={() => setSelectedDeal(null)}
              className="absolute top-5 right-5 text-mute hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-bold">
              <CheckCircle2 className="h-4 w-4" /> Endorsement Dossier
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mt-1">
              {selectedDeal.brand}
            </h3>
            <p className="text-xs text-mute mt-0.5">{selectedDeal.campaign}</p>

            <div className="my-6 space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs text-gray-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-mute">Contracted Compensation:</span>
                <span className="font-bold text-white">
                  {formatMoney(selectedDeal.value)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-mute">Net Receivable (Post TDS):</span>
                <span className="font-bold text-aqua-400">
                  {formatMoney(selectedDeal.value * 0.9)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-mute">Delivery Deadline:</span>
                <span className="font-bold text-white">{selectedDeal.due}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-mute">Lead Talent Representative:</span>
                <span className="font-bold text-white">
                  {selectedDeal.manager}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert(`Invoice generated for ${selectedDeal.brand}!`);
                  setSelectedDeal(null);
                }}
                className="gold-btn flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Generate Milestone Invoice
              </button>
              <button
                onClick={() => setSelectedDeal(null)}
                className="rounded-xl border border-line px-5 py-3 text-xs text-mute hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
