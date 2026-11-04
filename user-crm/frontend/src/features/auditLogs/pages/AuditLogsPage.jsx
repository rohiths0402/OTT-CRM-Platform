import { Search, Download, RefreshCw } from 'lucide-react';

import AuditLogsTable from '../components/AuditLogsTable';
import { useAuditLogs } from '../hooks/useAuditLogs';

import './AuditLogsPage.css';
import '../auditLogs.css';

export default function AuditLogsPage() {
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
        exportCsv
    } = useAuditLogs();

    return (
        <div className="crm-page">
            <header className="crm-head">
                <div>
                    <p className="crm-eyebrow">LOOP USER CRM</p>
                    <h1>Audit Logs</h1>
                    <p>
                        Review actions performed by workspace users and
                        system processes.
                    </p>
                </div>
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
                    <strong
                        style={{
                            fontSize: 13,
                            color: '#d6b56d'
                        }}
                    >
                        {import.meta.env.VITE_USE_MOCK_API === 'false'
                            ? 'Live API'
                            : 'Mock data'}
                    </strong>
                </div>
            </div>

            {error && (
                <div className="crm-error">
                    {error}
                </div>
            )}

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

                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            flexWrap: 'wrap'
                        }}
                    >
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option>All</option>

                            {[
                                'Active',
                                'Pending',
                                'Approved',
                                'Rejected',
                                'Suspended',
                                'Completed',
                                'Failed',
                                'Success',
                                'Scheduled',
                                'Sent',
                                'Paused',
                                'Inactive'
                            ].map((status) => (
                                <option key={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        <button
                            className="crm-btn secondary"
                            onClick={load}
                        >
                            <RefreshCw size={14} />
                            Refresh
                        </button>

                        <button
                            className="crm-btn secondary"
                            onClick={exportCsv}
                        >
                            <Download size={14} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="crm-foot">
                        Loading…
                    </div>
                ) : (
                    <AuditLogsTable rows={filtered} />
                )}

                <div className="crm-foot">
                    <span>
                        Showing {filtered.length} of {rows.length} records
                    </span>

                    <span>Audit Logs</span>
                </div>
            </section>
        </div>
    );
}