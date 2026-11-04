
import './RolesPage.css'
import '../roles.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Plus,
  Search,
  Download,
  RefreshCw,
} from 'lucide-react'

import RolesTable from '../components/RolesTable'
import { useRoles } from '../hooks/useRoles'
import { rolesService } from '../services/rolesService'

export default function RolesPage() {
  const navigate = useNavigate()

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
  } = useRoles()

  const [loadingId, setLoadingId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

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
    setActionMessage('')

    try {
      await rolesService.toggleStatus(role.id, nextStatus)
      await load()

      setActionMessage(
        `${role.name} role successfully ${
          nextStatus ? 'activated' : 'deactivated'
        }.`
      )
    } catch (err) {
      console.error(err)

      setActionError(
        err?.response?.data?.detail ||
        err?.message ||
        'Unable to update role status.'
      )
    } finally {
      setLoadingId(null)
    }
  }

  const activeCount = rows.filter(
    role => role.is_active
  ).length

  const inactiveCount = rows.length - activeCount

  return (
    <div className="crm-page">

      <header className="crm-head">
        <div>
          <p className="crm-eyebrow">LOOP USER CRM</p>
          <h1>Roles & Permissions</h1>
          <p>
            Manage workspace roles and their assigned permissions.
          </p>
        </div>

        <button
          type="button"
          className="crm-btn"
          onClick={() => navigate('/super-admin/employees/create')}
        >
          <Plus size={15} />
          Add Employee
        </button>
      </header>

      <div className="crm-kpis">
        <div className="crm-kpi">
          <span>Total roles</span>
          <strong>{rows.length}</strong>
        </div>

        <div className="crm-kpi">
          <span>Active roles</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="crm-kpi">
          <span>Inactive roles</span>
          <strong>{inactiveCount}</strong>
        </div>
      </div>

      {(error || actionError) && (
        <div className="crm-error">
          {actionError || error}
        </div>
      )}

      {actionMessage && (
        <div className="crm-success">
          {actionMessage}
        </div>
      )}

      <section className="crm-panel">

        <div className="crm-toolbar">
          <label className="crm-search">
            <Search size={15} />

            <input
              type="search"
              placeholder="Search roles..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </label>

          <div className="roles-toolbar-actions">

            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              type="button"
              className="crm-btn secondary"
              onClick={load}
              disabled={loading || loadingId !== null}
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            <button
              type="button"
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
            Loading roles...
          </div>
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
    </div>
  )
}
