import { useMemo, useState } from 'react'
import { useDashboardPreferences } from '../hooks/useDashboardPreferences'
import { dashboardSections, overviewMetrics } from '../data/dashboardMockData'
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

const sectionComponents = {
  audience: AudienceIntelligence,
  content: ContentIntelligence,
  advertising: AdvertisingIntelligence,
  revenue: RevenueIntelligence,
  infrastructure: StreamingInfrastructure,
  engagement: ViewerEngagement,
}

export default function SuperAdminDashboard() {
  const [customizerOpen, setCustomizerOpen] = useState(false)

  const {
    preferences,
    toggleVisibility,
    toggleCollapsed,
    moveSection,
    resetPreferences,
  } = useDashboardPreferences(dashboardSections)

  const visibleSections = useMemo(() => {
    return preferences.order
      .map(id => dashboardSections.find(section => section.id === id))
      .filter(section => section && preferences.visible[section.id])
  }, [preferences])

  const openCustomizer = () => setCustomizerOpen(true)
  const closeCustomizer = () => setCustomizerOpen(false)

  return (
    <div className="sa-dashboard">
      <header className="sa-dashboard-header">
        <div>
          <p className="sa-eyebrow">LOOP PLATFORM OPERATIONS</p>
          <h1>Command Center</h1>
          <p className="sa-subtitle">
            A unified view of audience, content, revenue and streaming health.
          </p>
        </div>

        <div className="sa-header-actions">
          <span className="sa-live-indicator">
            <i />
            Demo data
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
          <p>Illustrative platform-wide metrics</p>
        </div>

        <span className="sa-period-label">Last 30 days</span>
      </div>

      <OverviewCards metrics={overviewMetrics} />
      <div className="sa-sections-heading">
        <div>
          <h2>Platform intelligence</h2>
          <p>Show, hide, collapse or reorder the sections you need.</p>
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
          const SectionComponent = sectionComponents[section.id]

          if (!SectionComponent) return null

          return (
            <DashboardSection
              key={section.id}
              section={section}
              collapsed={Boolean(preferences.collapsed[section.id])}
              onToggleCollapse={() => toggleCollapsed(section.id)}
              onMoveUp={() => moveSection(section.id, -1)}
              onMoveDown={() => moveSection(section.id, 1)}
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
            Choose the sections you want to see in Customize dashboard.
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
