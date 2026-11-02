
import {
  Infinity,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'
import './sidebar.css'

export default function Sidebar({
  navigation = [],
  workspaceLabel = 'USER CRM',
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}) {
  const isCollapsed = collapsed && !mobileOpen

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onCloseMobile}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${
          mobileOpen ? 'sidebar-mobile-open' : ''
        }`}
      >
        {/* Brand */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <Infinity size={26} strokeWidth={2} />
            </div>

            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <strong>LOOP</strong>
                <span>{workspaceLabel}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-navigation">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <Icon size={19} strokeWidth={1.8} />

                {!isCollapsed && (
                  <span className="sidebar-link-label">
                    {item.label}
                  </span>
                )}

                {!isCollapsed && item.label === 'Broadcast' && (
                  <span className="sidebar-link-badge">5</span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          <div className="sidebar-security">
          </div>

          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
