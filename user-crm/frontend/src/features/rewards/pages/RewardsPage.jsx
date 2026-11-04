import "./RewardsPage.css";
import { Search, Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import RewardAdjustmentForm from "../components/RewardAdjustmentForm";
import { rewardsService } from "../services/rewardsService";
import RewardsTable from "../components/RewardsTable";
import "../rewards.css";
import { useRewards } from "../hooks/useRewards";
export default function RewardsPage() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const {
    rows,
    query,
    setQuery,
    filter,
    setFilter,
    loading,
    error,
    load,
    filtered,
    exportCsv,
  } = useRewards();
  return (
    <div className="crm-page">
      <header className="crm-head">
        <div>
          <p className="crm-eyebrow">LOOP USER CRM</p>
          <h1>Rewards Studio</h1>
          <p>Manage reward campaigns, point values and redemptions.</p>
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
          <RewardsTable
            rows={filtered}
            extraHeader="Action"
            renderExtra={(row) =>
              row.accountId ? (
                <button
                  className="crm-btn secondary"
                  onClick={() => setSelectedAccount(row)}
                >
                  Adjust
                </button>
              ) : null
            }
          />
        )}
        <div className="crm-foot">
          <span>
            Showing {filtered.length} of {rows.length} records
          </span>
          <span>Rewards Studio</span>
        </div>
      </section>

      {selectedAccount && (
        <RewardAdjustmentForm
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onSave={async (data) => {
            await rewardsService.adjust(selectedAccount.accountId, data);
            await load();
          }}
        />
      )}
    </div>
  );
}
