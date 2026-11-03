import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Search, Plus, Download, ChevronLeft, ChevronRight, SlidersHorizontal,
  X, Eye, Check, XCircle, MoreHorizontal, FileText, RefreshCw,
} from 'lucide-react'
import { moduleDefinitions, initialSettings } from '../data/moduleData'
import './adminModulePage.css'

const pathToKey = {
  '/admin/subscribers': 'subscribers',
  '/admin/kyc': 'kyc',
  '/admin/wallet': 'wallet',
  '/admin/rewards': 'rewards',
  '/admin/engagement': 'engagement',
  '/admin/viewing-history': 'viewing-history',
  '/admin/ad-analytics': 'ad-analytics',
  '/admin/campaigns': 'campaigns',
  '/admin/notifications': 'notifications',
  '/admin/roles': 'roles',
  '/admin/audit-logs': 'audit-logs',
}

function getStatusClass(value) {
  const status = String(value).toLowerCase()
  if (['active', 'approved', 'completed', 'sent', 'success', 'high', 'verified'].includes(status)) return 'status-success'
  if (['pending', 'scheduled', 'medium'].includes(status)) return 'status-warning'
  if (['inactive', 'rejected', 'failed', 'low'].includes(status)) return 'status-danger'
  return 'status-neutral'
}

function DetailModal({ row, columns, onClose }) {
  if (!row) return null

  return (
    <div className="module-modal-backdrop" onMouseDown={onClose}>
      <section className="module-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="module-modal-header">
          <div>
            <span className="module-eyebrow">RECORD DETAILS</span>
            <h2>{row[0]}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close details"><X size={18} /></button>
        </div>
        <div className="module-detail-list">
          {columns.map((column, index) => (
            <div className="module-detail-row" key={column}>
              <span>{column}</span>
              <strong>{row[index] || '—'}</strong>
            </div>
          ))}
        </div>
        <div className="module-modal-footer">
          <button className="secondary-button" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  )
}

function AddRecordModal({ title, columns, onClose, onSave }) {
  const [values, setValues] = useState(() => columns.map(() => ''))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values[0].trim()) return
    onSave(values.map((value) => value.trim() || '—'))
  }

  return (
    <div className="module-modal-backdrop" onMouseDown={onClose}>
      <section className="module-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="module-modal-header">
          <div>
            <span className="module-eyebrow">NEW RECORD</span>
            <h2>{title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close form"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="module-form-grid">
            {columns.map((column, index) => (
              <label className="module-form-field" key={column}>
                <span>{column}{index === 0 ? ' *' : ''}</span>
                <input
                  value={values[index]}
                  onChange={(event) => setValues((previous) => previous.map((value, valueIndex) => valueIndex === index ? event.target.value : value))}
                  placeholder={`Enter ${column.toLowerCase()}`}
                  required={index === 0}
                />
              </label>
            ))}
          </div>
          <div className="module-modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button"><Plus size={15} /> Save record</button>
          </div>
        </form>
      </section>
    </div>
  )
}

function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings)
  const [saved, setSaved] = useState(false)

  const update = (key, value) => {
    setSettings((previous) => ({ ...previous, [key]: value }))
    setSaved(false)
  }

  return (
    <div className="admin-module-page">
      <div className="module-page-heading">
        <div><span className="module-eyebrow">CONFIGURATION</span><h1>Settings</h1><p>Manage your workspace preferences.</p></div>
      </div>
      <section className="module-panel settings-panel">
        <div className="module-section-heading"><div><h2>Organization settings</h2><p>Basic information for your Loop CRM workspace.</p></div></div>
        <div className="settings-grid">
          <label className="module-form-field"><span>Organization name</span><input value={settings.organizationName} onChange={(e) => update('organizationName', e.target.value)} /></label>
          <label className="module-form-field"><span>Support email</span><input type="email" value={settings.supportEmail} onChange={(e) => update('supportEmail', e.target.value)} /></label>
          <label className="module-form-field"><span>Timezone</span><select value={settings.timezone} onChange={(e) => update('timezone', e.target.value)}><option value="Asia/Kolkata">India Standard Time (IST)</option><option value="UTC">UTC</option><option value="Asia/Singapore">Singapore</option></select></label>
          <label className="module-form-field"><span>Date format</span><select value={settings.dateFormat} onChange={(e) => update('dateFormat', e.target.value)}><option>DD MMM YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></label>
        </div>
        <div className="settings-toggles">
          <label><span><strong>Email notifications</strong><small>Receive system and account notifications.</small></span><input type="checkbox" checked={settings.notificationsEnabled} onChange={(e) => update('notificationsEnabled', e.target.checked)} /></label>
          <label><span><strong>Two-factor authentication</strong><small>Require an additional verification step for sign-in.</small></span><input type="checkbox" checked={settings.twoFactorEnabled} onChange={(e) => update('twoFactorEnabled', e.target.checked)} /></label>
        </div>
        <div className="module-panel-actions"><span className="settings-saved">{saved ? 'Settings saved locally.' : 'Changes are stored in this browser session only.'}</span><button className="primary-button" onClick={() => setSaved(true)}>Save changes</button></div>
      </section>
    </div>
  )
}

export default function AdminModulePage() {
  const location = useLocation()
  const key = pathToKey[location.pathname]
  const definition = moduleDefinitions[key]
  const [rows, setRows] = useState(() => definition ? definition.rows.map((row) => [...row]) : [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const pageSize = 6

  useEffect(() => {
    setRows(definition ? definition.rows.map((row) => [...row]) : [])
    setSearch('')
    setStatus('All statuses')
    setPage(1)
    setSelectedRow(null)
    setShowAdd(false)
  }, [location.pathname])

  const filteredRows = useMemo(() => rows.filter((row) => {
    const matchesSearch = row.join(' ').toLowerCase().includes(search.toLowerCase())
    const statusValue = row[row.length - 1]
    const matchesStatus = status === 'All statuses' || String(statusValue).toLowerCase() === status.toLowerCase()
    return matchesSearch && matchesStatus
  }), [rows, search, status])

  if (location.pathname === '/admin/settings') return <SettingsPage />
  if (!definition) return <div className="admin-module-page"><section className="module-panel"><h2>Page not found</h2><p>This CRM page is not configured.</p></section></div>

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize)
  const statusOptions = ['All statuses', ...new Set(rows.map((row) => row[row.length - 1]).filter(Boolean))]

  const exportRows = () => {
    const csv = [definition.columns, ...filteredRows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${key}-records.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const updateKycStatus = (row, nextStatus) => {
    setRows((previous) => previous.map((item) => item[0] === row[0] ? item.map((value, index) => index === item.length - 1 ? nextStatus : value) : item))
  }

  return (
    <div className="admin-module-page">
      <div className="module-page-heading">
        <div><span className="module-eyebrow">LOOP CRM / WORKSPACE</span><h1>{definition.title}</h1><p>{definition.description}</p></div>
        <div className="module-heading-actions">
          <button className="secondary-button" onClick={exportRows}><Download size={15} /> Export</button>
          <button className="primary-button" onClick={() => setShowAdd(true)}><Plus size={16} /> {definition.primaryAction}</button>
        </div>
      </div>

      <div className="module-stats-grid">
        {definition.stats.map(([label, value, change]) => (
          <section className="module-stat-card" key={label}>
            <span>{label}</span><strong>{value}</strong><small>{change} <em>vs previous period</em></small>
          </section>
        ))}
      </div>

      <section className="module-panel">
        <div className="module-section-heading">
          <div><h2>{definition.title} records</h2><p>{filteredRows.length.toLocaleString()} records found</p></div>
          <button className="icon-button" onClick={() => { setSearch(''); setStatus('All statuses'); setPage(1) }} title="Reset filters"><RefreshCw size={16} /></button>
        </div>

        <div className="module-toolbar">
          <div className="module-search"><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder={`Search ${definition.title.toLowerCase()}...`} /></div>
          <label className="module-filter"><SlidersHorizontal size={15} /><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>

        <div className="module-table-wrap">
          <table className="module-table">
            <thead><tr>{definition.columns.map((column) => <th key={column}>{column}</th>)}<th>Actions</th></tr></thead>
            <tbody>
              {visibleRows.map((row, index) => (
                <tr key={`${row[0]}-${index}`}>
                  {row.map((value, cellIndex) => <td key={`${cellIndex}-${value}`}>{cellIndex === row.length - 1 ? <span className={`module-status ${getStatusClass(value)}`}>{value}</span> : value}</td>)}
                  <td>
                    <div className="module-row-actions">
                      <button className="icon-button small" onClick={() => setSelectedRow(row)} title="View details"><Eye size={15} /></button>
                      {key === 'kyc' && row[row.length - 1] === 'Pending' && <>
                        <button className="icon-button small action-approve" onClick={() => updateKycStatus(row, 'Approved')} title="Approve"><Check size={15} /></button>
                        <button className="icon-button small action-reject" onClick={() => updateKycStatus(row, 'Rejected')} title="Reject"><XCircle size={15} /></button>
                      </>}
                      {key !== 'kyc' && <button className="icon-button small" onClick={() => setSelectedRow(row)} title="More actions"><MoreHorizontal size={15} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && <tr><td colSpan={definition.columns.length + 1} className="module-empty"><FileText size={22} /><strong>No records found</strong><span>Try changing your search or filters.</span></td></tr>}
            </tbody>
          </table>
        </div>

        <div className="module-table-footer">
          <span>Showing {filteredRows.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredRows.length)} of {filteredRows.length}</span>
          <div className="module-pagination">
            <button className="icon-button small" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={16} /></button>
            <span>Page {page} of {totalPages}</span>
            <button className="icon-button small" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>

      {selectedRow && <DetailModal row={selectedRow} columns={definition.columns} onClose={() => setSelectedRow(null)} />}
      {showAdd && <AddRecordModal title={definition.primaryAction} columns={definition.columns} onClose={() => setShowAdd(false)} onSave={(row) => { setRows((previous) => [row, ...previous]); setShowAdd(false); setPage(1) }} />}
    </div>
  )
}
