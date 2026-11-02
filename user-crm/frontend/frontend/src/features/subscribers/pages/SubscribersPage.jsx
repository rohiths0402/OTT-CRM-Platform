import './SubscribersPage.css';
import { Plus, Search, Download, RefreshCw } from 'lucide-react'
import SubscribersTable from '../components/SubscribersTable'
import SubscribersForm from '../components/SubscribersForm'
import '../subscribers.css'
import { useSubscribers } from '../hooks/useSubscribers'
export default function SubscribersPage() {
    const { rows, setRows, query, setQuery, filter, setFilter, modal, setModal, loading, error, setError, load, filtered, save, exportCsv } = useSubscribers();
    return <div className="crm-page"><header className="crm-head"><div><p className="crm-eyebrow">LOOP USER CRM</p><h1>Subscribers</h1><p>Search, filter, add and export subscriber accounts.</p></div>{<button className="crm-btn" onClick={() => setModal(true)}><Plus size={15} /> Add record</button>}</header>
        <div className="crm-kpis"><div className="crm-kpi"><span>Total records</span><strong>{rows.length}</strong></div><div className="crm-kpi"><span>Matching records</span><strong>{filtered.length}</strong></div><div className="crm-kpi"><span>Data source</span><strong style={{ fontSize: 13, color: '#d6b56d' }}>{import.meta.env.VITE_USE_MOCK_API === 'false' ? 'Live API' : 'Mock data'}</strong></div></div>
        {error && <div className="crm-error">{error}</div>}
        <section className="crm-panel"><div className="crm-toolbar"><label className="crm-search"><Search size={15} /><input placeholder="Search records..." value={query} onChange={e => setQuery(e.target.value)} /></label><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><select value={filter} onChange={e => setFilter(e.target.value)}><option>All</option>{['Active', 'Pending', 'Approved', 'Rejected', 'Suspended', 'Completed', 'Failed', 'Success', 'Scheduled', 'Sent', 'Paused', 'Inactive'].map(s => <option key={s}>{s}</option>)}</select><button className="crm-btn secondary" onClick={load}><RefreshCw size={14} /> Refresh</button><button className="crm-btn secondary" onClick={exportCsv}><Download size={14} /> Export CSV</button></div></div>
            {loading ? <div className="crm-foot">Loading…</div> : <SubscribersTable rows={filtered} />}
            <div className="crm-foot"><span>Showing {filtered.length} of {rows.length} records</span><span>Subscribers</span></div></section>
        {modal && <SubscribersForm onClose={() => setModal(false)} onSave={save} />}
    </div>
}
