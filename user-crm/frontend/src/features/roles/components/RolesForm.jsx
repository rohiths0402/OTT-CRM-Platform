
import './RolesTable.css';

import { useState } from 'react'
import {
  Plus,
  Search,
  Download,
  RefreshCw,
} from 'lucide-react'

import RolesTable from '../components/RolesTable'
import RolesForm from '../components/RolesForm'
import { useRoles } from '../hooks/useRoles'
import { rolesService } from '../services/rolesService'

import '../roles.css'

export default function RolesPage() {
  const {
    rows,
    query,
    setQuery,
    filter,
    setFilter,
    modal,
    setModal,
    loading,
    error,
    load,
    filtered,
    save,
    exportCsv,
  } = useRoles()

  const [loadingId, setLoadingId] = useState(null)
  const [actionError, setActionError] = useState('')

  const handleToggleStatus = async (role) => {
    const nextStatus = !role.is_active

    const confirmed = window.confirm(
      `Are you sure you want to ${
        nextStatus ? 'activate' : 'deactivate'
      } the "${role.name}" role?`
    )

    if (!confirmed) return

    setLoadingId(role.id)
    setActionError('')

    try {
      await rolesService.toggleStatus(role.id, nextStatus)

      // Reload actual data from Django/MySQL.
      await load()
    } catch (error) {
      console.error('Role status update failed:', error)

      setActionError(
        error?.response?.data?.detail ||
        error?.message ||
        'Unable to update role status.'
      )
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="crm-page">
      <header className="crm-head">
        <div>
          <p className="crm-eyebrow">LOOP USER CRM</p>
          <h1>Roles & Permissions</h1>
          <p>Manage workspace roles and their assigned permissions.</p>
        </div>

        <button
          className="crm-btn"
          onClick={() => setModal(true)}
        >
          <Plus size={15} />
          Add record
        </button>
      </header>

      <div className="crm-kpis">
        <div className="crm-kpi">
          <span>Total roles</span>
          <strong>{rows.length}</strong>
        </div>

        <div className="crm-kpi">
          <span>Active roles</span>
          <strong>
            {rows.filter((role) => role.is_active).length}
          </strong>
        </div>

        <div className="crm-kpi">
          <span>Inactive roles</span>
          <strong>
            {rows.filter((role) => !role.is_active).length}
          </strong>
        </div>
      </div>

      {(error || actionError) && (
        <div className="crm-error">
          {actionError || error}
        </div>
      )}

      <section className="crm-panel">
        <div className="crm-toolbar">
          <label className="crm-search">
            <Search size={15} />
            <input
              placeholder="Search roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <button
              className="crm-btn secondary"
              onClick={load}
              disabled={loading}
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
          <div className="crm-foot">Loading roles...</div>
        ) : (
          <RolesTable
            rows={filtered}
            onToggleStatus={handleToggleStatus}
            loadingId={loadingId}
          />
        )}

        <div className="crm-foot">
          <span>
            Showing {filtered.length} of {rows.length} roles
          </span>
          <span>Roles & Permissions</span>
        </div>
      </section>

      {modal && (
        <RolesForm
          onClose={() => setModal(false)}
          onSave={save}
        />
      )}
    </div>
  )
}
