import { useState } from "react";
export default function RewardAdjustmentForm({ account, onClose, onSave }) {
  const [kind, setKind] = useState("earn");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("Admin points adjustment");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSave({ kind, points, reason });
      onClose();
    } catch (err) {
      setError(err.message || "Points adjustment failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div
      className="crm-modal-bg"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form className="crm-modal" onSubmit={submit}>
        <h2>Adjust reward points</h2>
        <p>
          {account.name} · Account #{account.accountId}
        </p>
        <label>
          Adjustment type
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="earn">Earn</option>
            <option value="redeem">Redeem</option>
            <option value="adjust">Adjustment / credit</option>
          </select>
        </label>
        <label>
          Points
          <input
            type="number"
            min="1"
            step="1"
            required
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </label>
        <label>
          Reason
          <input
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        {error && (
          <p className="crm-error" role="alert">
            {error}
          </p>
        )}
        <div className="crm-modal-actions">
          <button type="button" className="crm-btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="crm-btn" disabled={busy}>
            {busy ? "Saving…" : "Apply adjustment"}
          </button>
        </div>
      </form>
    </div>
  );
}
