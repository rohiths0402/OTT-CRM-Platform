import "./SubscribersForm.css";
import { useState } from "react";
const fields = [
  { key: "name", label: "Full name", type: "text" },
  { key: "email", label: "Email address", type: "email" },
  {
    key: "plan",
    label: "Plan",
    type: "select",
    options: ["Basic", "Standard", "Premium"],
  },
  { key: "region", label: "Region", type: "text" },
  { key: "joined", label: "Joined date", type: "date" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Pending", "Suspended"],
  },
];
export default function SubscribersForm({ onClose, onSave }) {
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
        <h2>Add Subscribers record</h2>
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
