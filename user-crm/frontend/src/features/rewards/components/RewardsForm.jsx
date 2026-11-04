import "./RewardsForm.css";
import { useState } from "react";
const fields = [
  { key: "name", label: "Reward name", type: "text" },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: ["Watch milestone", "Referral", "Campaign", "Loyalty"],
  },
  { key: "points", label: "Points", type: "number" },
  { key: "redemptions", label: "Redemptions", type: "number" },
  { key: "startDate", label: "Start date", type: "date" },
  { key: "endDate", label: "End date", type: "date" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Scheduled", "Paused"],
  },
];
export default function RewardsForm({ onClose, onSave }) {
  const [form, setForm] = useState({}),
    [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave(form);
      onClose();
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
        <h2>Add Rewards Studio record</h2>
        <div className="crm-form">
          {fields.map((f) => (
            <label key={f.key}>
              {f.label}
              {f.type === "select" ? (
                <select
                  required
                  value={form[f.key] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                >
                  <option value="">Select…</option>
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  type={f.type}
                  value={form[f.key] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  placeholder={f.label}
                />
              )}
            </label>
          ))}
        </div>
        <div className="crm-modal-actions">
          <button type="button" className="crm-btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="crm-btn" disabled={busy}>
            {busy ? "Saving…" : "Save record"}
          </button>
        </div>
      </form>
    </div>
  );
}
