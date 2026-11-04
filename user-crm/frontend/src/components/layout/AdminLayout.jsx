
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { useAuth } from '../../features/auth/context/AuthContext'
import { navigationConfig } from '../../config/navigationConfig'

import Sidebar from './Sidebar'
import Topbar from './Topbar'

import './adminLayout.css'

export default function AdminLayout() {
  const { user } = useAuth()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = String(user?.role || '')
    .trim()
    .toLowerCase()
    .replaceAll('-', '_')
    .replaceAll(' ', '_')

  const navigation = navigationConfig[role] || []

  const workspaceLabel =
    role === 'super_admin' ? 'SUPER ADMIN' : 'USER CRM'

  return (
    <div
      className={`admin-layout ${
        collapsed ? 'layout-sidebar-collapsed' : ''
      }`}
    >
      <Sidebar
        navigation={navigation}
        workspaceLabel={workspaceLabel}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => {
          setCollapsed((previous) => !previous)
        }}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="admin-main">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
