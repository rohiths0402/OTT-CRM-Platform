
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../../services/api/apiClient'
import { useDashboardPreferences } from '../hooks/useDashboardPreferences'
import { dashboardSections } from '../data/dashboardMockData'
import DashboardCustomizer from '../components/DashboardCustomizer/DashboardCustomizer'
import DashboardSection from '../components/DashboardSection/DashboardSection'
import OverviewCards from '../components/OverviewCards/OverviewCards'
import AudienceIntelligence from '../components/AudienceIntelligence/AudienceIntelligence'
import ContentIntelligence from '../components/ContentIntelligence/ContentIntelligence'
import AdvertisingIntelligence from '../components/AdvertisingIntelligence/AdvertisingIntelligence'
import RevenueIntelligence from '../components/RevenueIntelligence/RevenueIntelligence'
import StreamingInfrastructure from '../components/StreamingInfrastructure/StreamingInfrastructure'
import ViewerEngagement from '../components/ViewerEngagement/ViewerEngagement'
import '../styles/superAdminDashboard.css'
import '../styles/audienceMap.css'

const sectionComponents = {
  audience: AudienceIntelligence,
  content: ContentIntelligence,
  advertising: AdvertisingIntelligence,
  revenue: RevenueIntelligence,
  infrastructure: StreamingInfrastructure,
  engagement: ViewerEngagement,
}

const formatMetric = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  const number = Number(value)

  return Number.isFinite(number)
    ? number.toLocaleString('en-IN')
    : '—'
}

const formatRevenue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return '—'
  }

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`
  }

  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`
}

const createInitialMetrics = () => [
  {
    label: 'New subscribers',
    value: '—',
    change: 'Loading',
    note: 'Last 30 days',
    icon: 'users',
  },
  {
    label: 'Monthly active viewers',
    value: '—',
    change: 'Loading',
    note: 'Unique viewers',
    icon: 'play',
  },
  {
    label: 'Watch hours',
    value: '—',
    change: 'Loading',
    note: 'Hours streamed',
    icon: 'clock',
  },
  {
    label: 'Ad impressions',
    value: '—',
    change: 'Loading',
    note: 'Recorded impressions',
    icon: 'megaphone',
  },
  {
    label: 'Concurrent viewers',
    value: '—',
    change: 'Loading',
    note: 'Latest streaming telemetry',
    icon: 'signal',
  },
  {
    label: 'Platform revenue',
    value: '—',
    change: 'Loading',
    note: 'Subscription + advertising revenue',
    icon: 'wallet',
  },
]

export default function SuperAdminDashboard() {
  const [customizerOpen, setCustomizerOpen] = useState(false)
  const [overviewMetrics, setOverviewMetrics] = useState(
    createInitialMetrics
  )
  const [overviewError, setOverviewError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetchOverview = async () => {
      setLoading(true)
      setOverviewError('')

      try {
        const response = await api.get(
          '/command-center/overview/?days=30'
        )

        if (!active) return

        const metrics = response?.metrics || {}

        setOverviewMetrics([
          {
            label: 'New subscribers',
            value: formatMetric(metrics.new_subscribers),
            change: 'Live API',
            note: 'Last 30 days',
            icon: 'users',
          },
          {
            label: 'Monthly active viewers',
            value: formatMetric(metrics.monthly_active_viewers),
            change: 'Live API',
            note: 'Unique viewers',
            icon: 'play',
          },
          {
            label: 'Watch hours',
            value: formatMetric(metrics.watch_hours),
            change: 'Live API',
            note: 'Hours streamed',
            icon: 'clock',
          },
          {
            label: 'Ad impressions',
            value: formatMetric(metrics.ad_impressions),
            change: 'Live API',
            note: 'Recorded impressions',
            icon: 'megaphone',
          },
          {
            label: 'Concurrent viewers',
            value: formatMetric(metrics.concurrent_viewers),
            change:
              metrics.concurrent_viewers == null
                ? 'No telemetry'
                : 'Live API',
            note: 'Latest streaming telemetry',
            icon: 'signal',
          },
          {
            label: 'Platform revenue',
            value: formatRevenue(metrics.platform_revenue),
            change:
              metrics.platform_revenue == null
                ? 'Not configured'
                : 'Live API',
            note: 'Subscription + advertising revenue',
            icon: 'wallet',
          },
        ])
      } catch (error) {
        if (!active) return

        setOverviewError(
          error?.message || 'Unable to load dashboard metrics.'
        )

        setOverviewMetrics(
          createInitialMetrics().map((metric) => ({
            ...metric,
            change: 'API unavailable',
          }))
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchOverview()

    return () => {
      active = false
    }
  }, [])

  const {
    preferences,
    toggleVisibility,
    toggleCollapsed,
    moveSection,
    resetPreferences,
  } = useDashboardPreferences(dashboardSections)

  const visibleSections = useMemo(() => {
    return preferences.order
      .map((id) =>
        dashboardSections.find((section) => section.id === id)
      )
      .filter(
        (section) =>
          section && preferences.visible[section.id]
      )
  }, [preferences])

  const openCustomizer = () => setCustomizerOpen(true)
  const closeCustomizer = () => setCustomizerOpen(false)

  return (
    <div className="sa-dashboard">
      <header className="sa-dashboard-header">
        <div>
          <p className="sa-eyebrow">
            LOOP PLATFORM OPERATIONS
          </p>

          <h1>Command Center</h1>

          <p className="sa-subtitle">
            A unified view of audience, content, revenue and
            streaming health.
          </p>
        </div>

        <div className="sa-header-actions">
          <span className="sa-live-indicator">
            <i />
            {loading ? 'Updating' : 'Live API'}
          </span>

          <button
            type="button"
            className="sa-button sa-button-primary"
            onClick={openCustomizer}
          >
            <span aria-hidden="true">☷</span>
            Customize dashboard
          </button>
        </div>
      </header>

      <div className="sa-overview-heading">
        <div>
          <h2>Platform overview</h2>

          <p>
            Platform metrics returned by the backend for the
            last 30 days.
          </p>
        </div>

        <span className="sa-period-label">
          Last 30 days
        </span>
      </div>

      {overviewError && (
        <p role="alert" className="sa-subtitle">
          Dashboard API: {overviewError}
        </p>
      )}

      <OverviewCards metrics={overviewMetrics} />

      <div className="sa-sections-heading">
        <div>
          <h2>Platform intelligence</h2>

          <p>
            Show, hide, collapse or reorder the sections you need.
          </p>
        </div>

        <button
          type="button"
          className="sa-button sa-button-quiet"
          onClick={openCustomizer}
        >
          Manage sections
        </button>
      </div>

      <div className="sa-dashboard-sections">
        {visibleSections.map((section, index) => {
          const SectionComponent =
            sectionComponents[section.id]

          if (!SectionComponent) return null

          return (
            <DashboardSection
              key={section.id}
              section={section}
              collapsed={Boolean(
                preferences.collapsed[section.id]
              )}
              onToggleCollapse={() =>
                toggleCollapsed(section.id)
              }
              onMoveUp={() =>
                moveSection(section.id, -1)
              }
              onMoveDown={() =>
                moveSection(section.id, 1)
              }
              isFirst={index === 0}
              isLast={index === visibleSections.length - 1}
            >
              <SectionComponent />
            </DashboardSection>
          )
        })}
      </div>

      {visibleSections.length === 0 && (
        <div className="sa-empty-state">
          <h3>Your dashboard is empty</h3>

          <p>
            Choose the sections you want to see in
            Customize dashboard.
          </p>

          <button
            type="button"
            className="sa-button sa-button-primary"
            onClick={openCustomizer}
          >
            Choose sections
          </button>
        </div>
      )}

      <DashboardCustomizer
        open={customizerOpen}
        sections={dashboardSections}
        preferences={preferences}
        onClose={closeCustomizer}
        onToggleVisibility={toggleVisibility}
        onMove={moveSection}
        onReset={resetPreferences}
      />
    </div>
  )
}
