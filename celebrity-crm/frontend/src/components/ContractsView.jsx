import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CalendarClock,
  Check,
  CheckCircle2,
  Eraser,
  FileSignature,
  MoveUpRight,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { formatMoney } from "../utils/format";

const filters = [
  { id: "action", label: "Needs attention" },
  { id: "signed", label: "Signed" },
  { id: "all", label: "All contracts" },
];

const statusStyles = {
  "Needs review": "border-rose-400/30 bg-rose-400/10 text-rose-400",
  "Awaiting signature": "border-gold-400/30 bg-gold-400/10 text-gold-300",
  "Expiring soon": "border-rose-400/30 bg-rose-400/10 text-rose-400",
  Draft: "border-white/10 bg-white/[0.05] text-mute",
  Signed: "border-aqua-400/30 bg-aqua-400/10 text-aqua-400",
};

function ContractForm({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const amount = Number(value);
    if (!title.trim() || !counterparty.trim() || amount <= 0) {
      setError("Enter the contract name, counterparty and a valid value.");
      return;
    }
    onCreate({
      id: `contract-${Date.now()}`,
      title: title.trim(),
      counterparty: counterparty.trim(),
      type: "New agreement",
      status: "Draft",
      value: amount,
      updated: "Draft created today",
      expiry: "Not set",
      terms: "Terms to be added",
      action: "Add the agreement terms before sending for review.",
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
              Agreement workspace
            </p>
            <h3 className="mt-2 font-display text-3xl text-ivory">
              Add a contract
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
        <div className="mt-6 space-y-4">
          <label className="block text-xs text-mute">
            Contract or project name
            <input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. The next campaign"
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory placeholder:text-mute/70"
            />
          </label>
          <label className="block text-xs text-mute">
            Brand or production house
            <input
              value={counterparty}
              onChange={(event) => setCounterparty(event.target.value)}
              placeholder="Company name"
              className="mt-2 w-full rounded-xl border border-line bg-ink-800 px-3 py-3 text-sm text-ivory placeholder:text-mute/70"
            />
          </label>
          <label className="block text-xs text-mute">
            Contract value (₹)
            <input
              type="number"
              min="1"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="500000"
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
            Create draft
          </button>
        </div>
      </form>
    </div>
  );
}

function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const drawnRef = useRef(false);

  const point = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const start = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { x, y } = point(event);
    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;
    const context = canvasRef.current.getContext("2d");
    const { x, y } = point(event);
    context.strokeStyle = "#f0c24d";
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(x, y);
    context.stroke();
    drawnRef.current = true;
    onChange(true);
  };

  const finish = () => {
    drawingRef.current = false;
    if (drawnRef.current)
      onChange(true, canvasRef.current.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    drawnRef.current = false;
    onChange(false, "");
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-line bg-[#100e14]">
        <canvas
          ref={canvasRef}
          width={640}
          height={180}
          aria-label="Draw your signature here"
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={finish}
          onPointerCancel={finish}
          className="h-32 w-full touch-none cursor-crosshair"
        />
        <span className="pointer-events-none absolute bottom-7 left-5 right-5 border-b border-dashed border-white/20" />
        <span className="pointer-events-none absolute bottom-2 left-5 text-[10px] uppercase tracking-[0.16em] text-mute">
          Draw signature above
        </span>
      </div>
      <button
        type="button"
        onClick={clear}
        className="mt-2 inline-flex items-center gap-1.5 text-xs text-mute transition hover:text-ivory"
      >
        <Eraser className="h-3.5 w-3.5" />
        Clear signature
      </button>
    </div>
  );
}

function ContractDrawer({ contract, onClose, onSign }) {
  const [signing, setSigning] = useState(false);
  const [signer, setSigner] = useState("");
  const [drawn, setDrawn] = useState(false);
  const [signatureData, setSignatureData] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const isSigned = contract.status === "Signed";

  const submitSignature = (event) => {
    event.preventDefault();
    if (!signer.trim() || !drawn || !signatureData || !consent) {
      setError("Enter your name, draw your signature and confirm the agreement.");
      return;
    }
    onSign(contract.id, signer.trim(), signatureData);
    setSigning(false);
    setError("");
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close contract details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`${contract.title} contract`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed inset-y-3 right-3 z-[70] flex w-[min(38rem,calc(100vw-1.5rem))] flex-col overflow-y-auto rounded-3xl border border-line bg-ink-900 shadow-2xl"
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
            {contract.type} · Agreement
          </p>
          <h3 className="mt-3 pr-9 font-display text-3xl text-ivory">
            {contract.title}
          </h3>
          <p className="mt-1 text-sm text-mute">{contract.counterparty}</p>
          <p className="mt-4 font-display text-2xl text-gold-300">
            {formatMoney(contract.value)}
          </p>
        </div>
        <div className="flex-1 space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[contract.status]}`}
            >
              {contract.status}
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-mute">
              <CalendarClock className="h-3.5 w-3.5 text-gold-300" />
              Expires {contract.expiry}
            </span>
          </div>
          <div className="rounded-2xl border border-line bg-ink-800/60 p-4">
            <p className="text-[11px] uppercase tracking-wider text-mute">
              Key terms to review
            </p>
            <p className="mt-2 text-sm leading-6 text-ivory">{contract.terms}</p>
            <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-mute">
              {contract.action}
            </p>
          </div>

          {isSigned ? (
            <div className="rounded-2xl border border-aqua-400/20 bg-aqua-400/5 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-aqua-400">
                <CheckCircle2 className="h-4 w-4" />
                Signed in this demo workspace
              </p>
              {contract.signedBy && (
                <p className="mt-2 text-xs text-mute">
                  Signed by {contract.signedBy} · {contract.signedAt}
                </p>
              )}
              {contract.signatureData && (
                <img
                  src={contract.signatureData}
                  alt={`Signature of ${contract.signedBy}`}
                  className="mt-3 h-16 max-w-56 rounded-lg border border-aqua-400/15 bg-ink-950 object-contain px-3"
                />
              )}
            </div>
          ) : signing ? (
            <form
              onSubmit={submitSignature}
              className="space-y-4 rounded-2xl border border-gold-400/25 bg-gold-400/[0.04] p-4"
            >
              <div>
                <p className="text-sm font-semibold text-ivory">
                  Review & sign
                </p>
                <p className="mt-1 text-xs leading-5 text-mute">
                  Check the terms above, then add your signature to this demo
                  agreement.
                </p>
              </div>
              <SignaturePad
                onChange={(isDrawn, data) => {
                  setDrawn(isDrawn);
                  setSignatureData(data || "");
                }}
              />
              <label className="block text-xs text-mute">
                Full legal name
                <input
                  autoComplete="name"
                  value={signer}
                  onChange={(event) => setSigner(event.target.value)}
                  placeholder="Type your full name"
                  className="mt-2 w-full rounded-xl border border-line bg-ink-950 px-3 py-3 text-sm text-ivory placeholder:text-mute/70"
                />
              </label>
              <label className="flex items-start gap-3 text-xs leading-5 text-mute">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-0.5 accent-[#d9a22b]"
                />
                I confirm that I reviewed these displayed terms and intend to
                record my signature in this demo.
              </label>
              <p className="text-[11px] leading-5 text-gold-300/80">
                Demo only: this signature is saved in this browser session; it
                is not sent to a legally binding e-signature service.
              </p>
              {error && (
                <p role="alert" className="text-xs text-rose-400">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSigning(false)}
                  className="rounded-xl border border-line px-4 py-2.5 text-sm text-mute hover:text-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                  <Check className="h-4 w-4" />
                  Sign agreement
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-2xl border border-line bg-ink-800/40 p-4">
              <p className="text-sm font-medium text-ivory">
                Ready for your review?
              </p>
              <p className="mt-1 text-xs leading-5 text-mute">
                Open the signature pad to sign this agreement in the demo
                workspace.
              </p>
              <button
                type="button"
                onClick={() => setSigning(true)}
                className="gold-btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
              >
                <FileSignature className="h-4 w-4" />
                Review & sign contract
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

export default function ContractsView({
  contracts,
  onAddContract,
  onSignContract,
}) {
  const [filter, setFilter] = useState("action");
  const [query, setQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const summary = useMemo(
    () => ({
      action: contracts.filter((item) =>
        ["Needs review", "Awaiting signature", "Expiring soon", "Draft"].includes(
          item.status,
        ),
      ).length,
      signed: contracts.filter((item) => item.status === "Signed").length,
      expiring: contracts.filter((item) => item.status === "Expiring soon")
        .length,
    }),
    [contracts],
  );
  const visibleContracts = contracts.filter((item) => {
    const isActionNeeded = item.status !== "Signed";
    const matchesFilter =
      filter === "all" ||
      (filter === "action" && isActionNeeded) ||
      (filter === "signed" && item.status === "Signed");
    const searchText =
      `${item.title} ${item.counterparty} ${item.type} ${item.status}`.toLowerCase();
    return matchesFilter && searchText.includes(query.trim().toLowerCase());
  });

  const addContract = (contract) => {
    onAddContract(contract);
    setFilter("action");
    setQuery("");
    setFormOpen(false);
    setSelectedContract(contract);
  };

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-ink-800 via-ink-900 to-ink-900 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-aqua-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-aqua-400">
              <ShieldCheck className="h-4 w-4" />
              Agreements
            </div>
            <h2 className="mt-3 font-display text-4xl font-light text-ivory sm:text-5xl">
              Contracts
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-mute">
              Stay ahead of reviews, signatures and renewal dates across every
              project.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="gold-btn inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add contract
          </button>
        </div>
        <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-ink-950/40 p-4">
            <p className="text-xs text-mute">Need attention</p>
            <p className="mt-2 flex items-center gap-2 font-display text-3xl text-gold-300">
              {summary.action}
              <AlertCircle className="h-5 w-5" />
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-950/40 p-4">
            <p className="text-xs text-mute">Signed agreements</p>
            <p className="mt-2 flex items-center gap-2 font-display text-3xl text-aqua-400">
              {summary.signed}
              <CheckCircle2 className="h-5 w-5" />
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-950/40 p-4">
            <p className="text-xs text-mute">Expiring soon</p>
            <p className="mt-2 flex items-center gap-2 font-display text-3xl text-rose-400">
              {summary.expiring}
              <CalendarClock className="h-5 w-5" />
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter contracts" className="flex gap-1">
          {filters.map((item) => {
            const count =
              item.id === "signed"
                ? summary.signed
                : item.id === "action"
                  ? summary.action
                  : contracts.length;
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
            placeholder="Search agreements"
            aria-label="Search contracts"
            className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-mute"
          />
        </label>
      </div>

      {visibleContracts.length ? (
        <ul className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {visibleContracts.map((contract, index) => (
            <motion.li
              key={contract.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index, 5) * 0.04 }}
              className="self-start"
            >
              <button
                type="button"
                onClick={() => setSelectedContract(contract)}
                className="group relative flex min-h-64 w-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-900 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-aqua-400/40 hover:shadow-[0_20px_55px_-30px_rgba(63,214,198,0.35)] sm:p-6"
              >
                <span className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-aqua-400/10 blur-3xl transition group-hover:bg-aqua-400/20" />
                <span className="relative flex w-full items-center justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-aqua-400/20 bg-aqua-400/10 text-aqua-400">
                    <FileSignature className="h-5 w-5" />
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium ${statusStyles[contract.status]}`}
                  >
                    {contract.status}
                  </span>
                </span>
                <span className="relative mt-5 block w-full">
                  <span className="block truncate font-display text-2xl text-ivory">
                    {contract.title}
                  </span>
                  <span className="mt-1 block truncate text-sm text-mute">
                    {contract.counterparty} · {contract.type}
                  </span>
                </span>
                <span className="relative mt-auto grid w-full grid-cols-2 gap-3 border-t border-line pt-4">
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">
                      Agreement value
                    </span>
                    <span className="mt-1 block font-display text-xl text-ivory">
                      {formatMoney(contract.value)}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">
                      Expiry
                    </span>
                    <span className="mt-1 block truncate text-sm text-ivory">
                      {contract.expiry}
                    </span>
                  </span>
                </span>
                <span className="relative mt-4 flex w-full items-center justify-between text-xs text-mute">
                  <span>{contract.updated}</span>
                  <span className="inline-flex items-center gap-1 text-aqua-400 transition group-hover:gap-2">
                    {contract.status === "Signed" ? "View agreement" : "Review & sign"}
                    <MoveUpRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl border border-dashed border-line bg-ink-900/60 p-12 text-center">
          <FileSignature className="mx-auto h-8 w-8 text-gold-400" />
          <p className="mt-4 font-display text-xl text-ivory">
            No contracts found
          </p>
          <p className="mt-2 text-sm text-mute">
            Try a different search or add an agreement to your workspace.
          </p>
        </div>
      )}

      {formOpen && (
        <ContractForm
          onClose={() => setFormOpen(false)}
          onCreate={addContract}
        />
      )}
      <AnimatePresence>
        {selectedContract && (
          <ContractDrawer
            contract={
              contracts.find((item) => item.id === selectedContract.id) ||
              selectedContract
            }
            onClose={() => setSelectedContract(null)}
            onSign={onSignContract}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
