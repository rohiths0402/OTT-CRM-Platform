import "./IdentityVaultPage.css";
import { Search, Download, RefreshCw } from "lucide-react";
import IdentityVaultTable from "../components/IdentityVaultTable";
import { identityVaultService } from "../services/identityVaultService";
import { useIdentityVault } from "../hooks/useIdentityVault";

export default function IdentityVaultPage() {
  const {
    rows,
    setRows,
    query,
    setQuery,
    filter,
    setFilter,
    loading,
    error,
    setError,
    load,
    filtered,
    exportCsv,
  } = useIdentityVault();
  const review = async (id, status) => {
    try {
      await identityVaultService.setKycStatus(id, String(status).toLowerCase());
      setRows((current) =>
        current.map((row) =>
          String(row.id) === String(id) ? { ...row, status } : row,
        ),
      );
    } catch (e) {
      setError(e?.message || "KYC update failed");
    }
  };
  return (
    <div className="crm-page">
      <header className="crm-head">
        <div>
          <p className="crm-eyebrow">LOOP USER CRM</p>
          <h1>Identity Vault</h1>
          <p>
            Review KYC submissions and approve or reject subscriber
            verification.
          </p>
        </div>
        {}
      </header>
      <div className="crm-kpis">
        <div className="crm-kpi">
          <span>Total records</span>
          <strong>{rows.length}</strong>
        </div>
        <div className="crm-kpi">
          <span>Matching records</span>
          <strong>{filtered.length}</strong>
        </div>
        <div className="crm-kpi">
          <span>Data source</span>
          <strong style={{ fontSize: 13, color: "#d6b56d" }}>
            {import.meta.env.VITE_USE_MOCK_API === "false"
              ? "Live API"
              : "Mock data"}
          </strong>
        </div>
      </div>
      {error && <div className="crm-error">{error}</div>}
      <section className="crm-panel">
        <div className="crm-toolbar">
          <label className="crm-search">
            <Search size={15} />
            <input
              placeholder="Search records..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              {[
                "Active",
                "Pending",
                "Approved",
                "Rejected",
                "Suspended",
                "Completed",
                "Failed",
                "Success",
                "Scheduled",
                "Sent",
                "Paused",
                "Inactive",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button className="crm-btn secondary" onClick={load}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="crm-btn secondary" onClick={exportCsv}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
        {loading ? (
          <div className="crm-foot">Loading…</div>
        ) : (
          <IdentityVaultTable
            rows={filtered}
            extraHeader="Review"
            renderExtra={(row) =>
              row.status === "Pending" ? (
                <div className="crm-actions">
                  <button
                    title="Approve"
                    onClick={() => review(row.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    title="Reject"
                    onClick={() => review(row.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span className="crm-status">{row.status}</span>
              )
            }
          />
        )}
        <div className="crm-foot">
          <span>
            Showing {filtered.length} of {rows.length} records
          </span>
          <span>Identity Vault</span>
        </div>
      </section>
    </div>
  );
}
