import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  FileSignature,
  MoveUpRight,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { formatMoney } from "../utils/format";

const filters = [
  { id: "all", label: "All deals" },
  { id: "active", label: "In progress" },
  { id: "completed", label: "Completed" },
];

const statusStyles = {
  "In production": "border-aqua-400/30 bg-aqua-400/10 text-aqua-400",
  Negotiating: "border-gold-400/30 bg-gold-400/10 text-gold-300",
  Completed: "border-white/10 bg-white/[0.05] text-mute",
};

function DealForm({ onClose, onCreate }) {
  const [brand, setBrand] = useState("");
  const [campaign, setCampaign] = useState("");
  const [value, setValue] = useState("");
  const [platform, setPlatform] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const amount = Number(value);
    if (!brand.trim() || !campaign.trim() || !platform.trim() || amount <= 0) {
      setError("Enter the brand, campaign, platform and a valid budget.");
      return;
    }
    onCreate({
      id: `deal-${Date.now()}`,
      brand: brand.trim(),
      campaign: campaign.trim(),
      category: "New partnership",
      platform: platform.trim(),
      value: amount,
      status: "Negotiating",
      deliverables: "To be agreed",
      dueDate: "To be scheduled",
      contact: "Add a brand contact",
      nextStep: "Confirm the brief and deliverables",
    });
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-3xl border border-line bg-ink-900 p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-300">
              New opportunity
            </p>
            <h3 className="mt-2 font-display text-3xl text-ivory">
              Add a brand deal
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-2 text-mute transition hover:bg-white/5 hover:text-ivory"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-mute">
            Brand
            <input
              autoFocus
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              placeholder="e.g. Aster Watches"
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory placeholder:text-mute/70"
            />
          </label>
          <label className="text-xs text-mute">
            Campaign
            <input
              value={campaign}
              onChange={(event) => setCampaign(event.target.value)}
              placeholder="Campaign name"
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory placeholder:text-mute/70"
            />
          </label>
          <label className="text-xs text-mute">
            Budget (₹)
            <input
              type="number"
              min="1"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="250000"
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory placeholder:text-mute/70"
            />
          </label>
          <label className="text-xs text-mute">
            Platform
            <input
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
              placeholder="Instagram · YouTube"
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory placeholder:text-mute/70"
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
            className="rounded-xl border border-line px-4 py-2.5 text-sm text-mute transition hover:text-ivory"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="gold-btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Create deal
          </button>
        </div>
      </form>
    </div>
  );
}

export default function BrandDealsView({ deals, onAddDeal, onNavigate }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const totals = useMemo(
    () => ({
      active: deals.filter((deal) => deal.status !== "Completed").length,
      pipeline: deals
        .filter((deal) => deal.status !== "Completed")
        .reduce((sum, deal) => sum + deal.value, 0),
      completed: deals.filter((deal) => deal.status === "Completed").length,
    }),
    [deals],
  );
  const visibleDeals = deals.filter((deal) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && deal.status !== "Completed") ||
      (filter === "completed" && deal.status === "Completed");
    const searchText =
      `${deal.brand} ${deal.campaign} ${deal.category} ${deal.platform}`.toLowerCase();
    return matchesFilter && searchText.includes(query.trim().toLowerCase());
  });

  const addDeal = (deal) => {
    onAddDeal(deal);
    setFilter("all");
    setQuery("");
    setFormOpen(false);
    setSelectedDeal(deal);
  };

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-gold-400/10 via-ink-900 to-ink-900 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-300">
              <Sparkles className="h-4 w-4" />
              Partnerships
            </div>
            <h2 className="mt-3 font-display text-4xl font-light text-ivory sm:text-5xl">
              Brand deals
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-mute">
              Keep every collaboration, campaign deliverable and brand follow-up
              in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="gold-btn inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add brand deal
          </button>
        </div>
        <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-ink-950/40 p-4">
            <p className="text-xs text-mute">Active partnerships</p>
            <p className="mt-2 font-display text-3xl text-ivory">
              {totals.active}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-950/40 p-4">
            <p className="text-xs text-mute">Pipeline value</p>
            <p className="mt-2 font-display text-3xl text-gold-300">
              {formatMoney(totals.pipeline)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-950/40 p-4">
            <p className="text-xs text-mute">Campaigns delivered</p>
            <p className="mt-2 font-display text-3xl text-aqua-400">
              {totals.completed}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter brand deals" className="flex gap-1">
          {filters.map((item) => {
            const count = deals.filter((deal) => {
              if (item.id === "active") return deal.status !== "Completed";
              if (item.id === "completed") return deal.status === "Completed";
              return true;
            }).length;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={`rounded-xl px-3 py-2 text-sm transition sm:px-4 ${
                  filter === item.id
                    ? "bg-gold-400/15 text-gold-300"
                    : "text-mute hover:text-ivory"
                }`}
              >
                {item.label} <span className="ml-1 text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-line bg-ink-900 px-3 py-2.5 text-mute focus-within:border-gold-400/60 sm:w-72">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brand or campaign"
            aria-label="Search brand deals"
            className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-mute"
          />
        </label>
      </div>

      {visibleDeals.length ? (
        <ul className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {visibleDeals.map((deal, index) => (
            <motion.li
              key={deal.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index, 5) * 0.04 }}
              className="self-start"
            >
              <button
                type="button"
                onClick={() => setSelectedDeal(deal)}
                className="group relative flex min-h-64 w-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-900 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-gold-400/45 hover:shadow-[0_20px_55px_-30px_rgba(217,162,43,0.5)] focus-visible:border-gold-400/60 sm:p-6"
              >
                <span className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl transition duration-500 group-hover:bg-gold-400/20" />
                <span className="relative flex w-full items-center justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/20 to-ink-800 font-display text-xl text-gold-300">
                    {deal.brand.charAt(0)}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium ${statusStyles[deal.status]}`}
                  >
                    {deal.status}
                  </span>
                </span>
                <span className="relative mt-5 block w-full">
                  <span className="block truncate font-display text-2xl text-ivory">
                    {deal.brand}
                  </span>
                  <span className="mt-1 block truncate text-sm text-mute">
                    {deal.campaign}
                  </span>
                </span>
                <span className="relative mt-auto grid w-full grid-cols-2 gap-3 border-t border-line pt-4">
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">
                      Deal value
                    </span>
                    <span className="mt-1 block font-display text-xl text-gold-300">
                      {formatMoney(deal.value)}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">
                      Next milestone
                    </span>
                    <span className="mt-1 block truncate text-sm text-ivory">
                      {deal.dueDate}
                    </span>
                  </span>
                </span>
                <span className="relative mt-4 flex w-full items-center justify-between text-xs text-mute">
                  <span>{deal.platform}</span>
                  <span className="inline-flex items-center gap-1 text-gold-300 transition group-hover:gap-2">
                    Open deal <MoveUpRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl border border-dashed border-line bg-ink-900/60 p-12 text-center">
          <CircleDollarSign className="mx-auto h-8 w-8 text-gold-400" />
          <p className="mt-4 font-display text-xl text-ivory">
            No brand deals found
          </p>
          <p className="mt-2 text-sm text-mute">
            Try a different search or add your next partnership.
          </p>
        </div>
      )}

      {formOpen && (
        <DealForm onClose={() => setFormOpen(false)} onCreate={addDeal} />
      )}
      <AnimatePresence>
        {selectedDeal && (
          <>
            <motion.button
              type="button"
              aria-label="Close deal details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDeal(null)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedDeal.brand} deal details`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="fixed inset-y-3 right-3 z-[70] flex w-[min(34rem,calc(100vw-1.5rem))] flex-col overflow-y-auto rounded-3xl border border-line bg-ink-900 shadow-2xl"
            >
              <div className="relative overflow-hidden border-b border-line bg-gradient-to-br from-gold-400/20 via-ink-900 to-ink-900 p-7">
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelectedDeal(null)}
                  className="absolute right-4 top-4 rounded-full p-2 text-mute transition hover:bg-white/5 hover:text-ivory"
                >
                  <X className="h-5 w-5" />
                </button>
                <p className="text-xs uppercase tracking-[0.2em] text-gold-300">
                  Partnership · {selectedDeal.category}
                </p>
                <h3 className="mt-3 pr-8 font-display text-4xl text-ivory">
                  {selectedDeal.brand}
                </h3>
                <p className="mt-1 text-sm text-mute">{selectedDeal.campaign}</p>
                <p className="mt-5 font-display text-3xl text-gold-300">
                  {formatMoney(selectedDeal.value)}
                </p>
              </div>
              <div className="flex-1 space-y-6 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${statusStyles[selectedDeal.status]}`}
                  >
                    {selectedDeal.status}
                  </span>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-mute">
                    {selectedDeal.platform}
                  </span>
                </div>
                <div className="grid gap-4 rounded-2xl border border-line bg-ink-800/60 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-mute">
                      Deliverables
                    </p>
                    <p className="mt-1 text-sm leading-6 text-ivory">
                      {selectedDeal.deliverables}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-mute">
                      Due date
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-ivory">
                      <CalendarDays className="h-4 w-4 text-gold-300" />
                      {selectedDeal.dueDate}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[11px] uppercase tracking-wider text-mute">
                      Brand contact
                    </p>
                    <p className="mt-1 text-sm text-ivory">
                      {selectedDeal.contact}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gold-400/20 bg-gold-400/5 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-gold-300">
                    Your next move
                  </p>
                  <p className="mt-2 flex gap-2 text-sm leading-6 text-ivory">
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-gold-300" />
                    {selectedDeal.nextStep}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDeal(null);
                      onNavigate("contracts");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ivory transition hover:border-gold-400/50 hover:bg-gold-400/5"
                  >
                    <FileSignature className="h-4 w-4 text-gold-300" />
                    View contracts
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDeal(null);
                      onNavigate("payments");
                    }}
                    className="gold-btn inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                  >
                    <CircleDollarSign className="h-4 w-4" />
                    View payments
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
