
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus, Save } from 'lucide-react'
import { employeesService } from '../services/employeesService'
import './EmployeeCreatePage.css'

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  is_active: true,
}

export default function EmployeeCreatePage() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await employeesService.create({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        is_active: form.is_active,
      })

      navigate('/super-admin/roles', {
        replace: true,
        state: { employeeCreated: true },
      })
    } catch (err) {
      const responseData = err?.response?.data

      setError(
        responseData?.email?.[0] ||
        responseData?.detail ||
        responseData?.error ||
        err?.message ||
        'Unable to create employee.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="crm-page employee-create-page">

      <header className="crm-head">
        <div>
          <p className="crm-eyebrow">LOOP USER CRM / TEAM</p>
          <h1>Create Employee</h1>
          <p>
            Create an employee account and assign workspace access.
          </p>
        </div>

        <button
          type="button"
          className="crm-btn secondary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </header>

      <form
        className="employee-create-card"
        onSubmit={handleSubmit}
      >

        <div className="employee-create-heading">
          <div className="employee-create-icon">
            <UserPlus size={21} />
          </div>

          <div>
            <h2>Employee Information</h2>
            <p>Enter the employee's account details.</p>
          </div>
        </div>

        {error && (
          <div className="crm-error">
            {error}
          </div>
        )}

        <div className="employee-form-grid">

          <label>
            Full name
            <input
              type="text"
              required
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Enter full name"
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              required
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="employee@company.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="Minimum 8 characters"
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={e => update('confirmPassword', e.target.value)}
              placeholder="Confirm password"
            />
          </label>

          <label>
            Assign role
            <select
              value={form.role}
              onChange={e => update('role', e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="analyst">Analyst</option>
              <option value="support">Support</option>
            </select>
          </label>

          <label>
            Account status
            <select
              value={String(form.is_active)}
              onChange={e => update(
                'is_active',
                e.target.value === 'true'
              )}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>

        </div>

        <div className="employee-create-footer">
          <button
            type="button"
            className="crm-btn secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="crm-btn"
            disabled={loading}
          >
            <Save size={15} />
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
        </div>

      </form>
    </div>
  )
}
