import "./EngagementForm.css";
import { useState } from "react";
const fields = [
  { key: "subscriber", label: "Subscriber", type: "text" },
  { key: "sessions", label: "Sessions", type: "number" },
  { key: "watchTime", label: "Watch time", type: "text" },
  { key: "lastActive", label: "Last active", type: "text" },
  {
    key: "segment",
    label: "Segment",
    type: "select",
    options: ["Power viewer", "Regular", "New viewer", "At risk"],
  },
  { key: "score", label: "Engagement score", type: "number" },
];
export default function EngagementForm({ onClose, onSave }) {
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
        <h2>Add Engagement record</h2>
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
