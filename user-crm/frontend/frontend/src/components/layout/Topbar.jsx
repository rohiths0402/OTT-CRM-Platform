
import { useState } from 'react'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from 'lucide-react'

import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'

import './topbar.css'

const pageTitles = {
  '': 'Command Center',
  subscribers: 'Subscribers',
  kyc: 'Identity Vault',
  wallet: 'Wallet Control',
  rewards: 'Rewards Studio',
  engagement: 'Engagement Intelligence',
  'viewing-history': 'Viewing Insights',
  'ad-analytics': 'Ad Analytics',
  campaigns: 'Campaigns',
  notifications: 'Broadcast',
  roles: 'Roles & Permissions',
  'audit-logs': 'Audit Logs',
  settings: 'Preferences',
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()

  const { user, clearAuthenticatedUser } = useAuth()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const pathParts = location.pathname.split('/').filter(Boolean)
  const currentPage = pathParts[pathParts.length - 1] || ''
  const pageTitle = pageTitles[currentPage] || 'Workspace'

  const workspace =
    pathParts[0] === 'super-admin' ? 'SUPER ADMIN' : 'ADMIN'

  const avatarLetter = (
    user?.name ||
    user?.email ||
    'L'
  ).trim().charAt(0).toUpperCase()

  const handleLogout = () => {
    clearAuthenticatedUser()
    setProfileOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      {/* Left: Page information */}
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-mobile-menu"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        <div className="topbar-page-info">
          <div className="topbar-breadcrumb">
            <span>LOOP</span>
            <span className="breadcrumb-divider">/</span>
            <span>{workspace}</span>
          </div>

          <h1 className="topbar-page-title">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Notifications and profile */}
      <div className="topbar-actions">

        {/* Notifications */}
        <div className="topbar-action-wrapper">
          <button
            type="button"
            className={`topbar-icon-button ${
              notificationsOpen ? 'topbar-icon-active' : ''
            }`}
            onClick={() => {
              setNotificationsOpen((previous) => !previous)
              setProfileOpen(false)
            }}
            aria-label="Notifications"
          >
            <Bell size={20} strokeWidth={1.8} />
            <span className="topbar-notification-dot" />
          </button>

          {notificationsOpen && (
            <div className="topbar-dropdown notification-dropdown">
              <div className="dropdown-heading">
                <strong>Notifications</strong>
                <span>5 new</span>
              </div>

              <div className="notification-empty">
                <Bell size={23} />
                <p>Your notifications will appear here.</p>
              </div>

              <button
                type="button"
                className="dropdown-footer-button"
                onClick={() => {
                  setNotificationsOpen(false)
                  navigate(
                    pathParts[0] === 'super-admin'
                      ? '/super-admin/notifications'
                      : '/admin/notifications'
                  )
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile: Avatar only */}
        <div className="topbar-action-wrapper">
          <button
            type="button"
            className="topbar-profile-button"
            onClick={() => {
              setProfileOpen((previous) => !previous)
              setNotificationsOpen(false)
            }}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
          >
            <span className="topbar-avatar">
              {avatarLetter}
            </span>

            <ChevronDown
              size={16}
              className={profileOpen ? 'profile-chevron-open' : ''}
            />
          </button>

          {profileOpen && (
            <div className="topbar-dropdown profile-dropdown">
              <div className="profile-dropdown-heading">
                <span className="topbar-avatar">
                  {avatarLetter}
                </span>

                <div className="profile-account-info">
                  <strong>
                    {user?.name || 'Loop User'}
                  </strong>
                  <span>{user?.email || 'Account'}</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={() => {
                  setProfileOpen(false)
                  navigate(
                    pathParts[0] === 'super-admin'
                      ? '/super-admin/settings'
                      : '/admin/settings'
                  )
                }}
              >
                <UserRound size={17} />
                Account settings
              </button>

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={() => {
                  setProfileOpen(false)
                  navigate(
                    pathParts[0] === 'super-admin'
                      ? '/super-admin/settings'
                      : '/admin/settings'
                  )
                }}
              >
                <Settings size={17} />
                Preferences
              </button>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="profile-dropdown-item logout-item"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
