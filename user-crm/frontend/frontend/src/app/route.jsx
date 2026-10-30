import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../features/auth/pages/LoginPage'
import { useAuth } from '../features/auth/context/AuthContext'

function RoleLanding({ allowedRole }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== allowedRole) return <Navigate to={getRolePath(user.role)} replace />

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-center text-white">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#D6B56D]">Loop User CRM</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Authentication successful</h1>
      <p className="mt-3 text-sm text-[#A69C88]">
        Signed in as {user.email || 'authorized user'} ({user.role}).
      </p>
      <p className="mt-2 text-xs text-[#716956]">Your {allowedRole.replace('_', ' ')} dashboard route is ready for implementation.</p>
    </main>
  )
}

export function getRolePath(role) {
  const routes = {
    super_admin: '/super-admin',
    admin: '/admin',
    employee: '/employee',
  }
  return routes[String(role || '').toLowerCase()] || '/login'
}

function AppRoutesContent() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/super-admin" element={<RoleLanding allowedRole="super_admin" />} />
      <Route path="/admin" element={<RoleLanding allowedRole="admin" />} />
      <Route path="/employee" element={<RoleLanding allowedRole="employee" />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesContent />
    </BrowserRouter>
  )
}