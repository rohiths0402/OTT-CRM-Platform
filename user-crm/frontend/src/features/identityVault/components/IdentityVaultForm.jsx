import "./IdentityVaultForm.css";
import { useState } from "react";
const fields = [
  { key: "name", label: "Subscriber name", type: "text" },
  {
    key: "documentType",
    label: "Document type",
    type: "select",
    options: ["Aadhaar", "PAN Card", "Passport", "Driving Licence"],
  },
  { key: "submittedAt", label: "Submitted date", type: "date" },
  { key: "region", label: "Region", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Pending", "Approved", "Rejected"],
  },
];
export default function IdentityVaultForm({ onClose, onSave }) {
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
        <h2>Add Identity Vault record</h2>
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
