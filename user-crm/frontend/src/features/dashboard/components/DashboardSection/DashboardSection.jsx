export default function DashboardSection({
  section, collapsed, onToggleCollapse, onMoveUp, onMoveDown, isFirst, isLast, children,
}) {
  return (
    <section className={`sa-section ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="sa-section-header">
        <div>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
        </div>
        <div className="sa-section-controls">
          <button title="Move section up" aria-label="Move section up" disabled={isFirst} onClick={onMoveUp}>↑</button>
          <button title="Move section down" aria-label="Move section down" disabled={isLast} onClick={onMoveDown}>↓</button>
          <button title={collapsed ? 'Expand section' : 'Collapse section'} onClick={onToggleCollapse}>
            {collapsed ? '＋' : '−'}
          </button>
        </div>
      </div>
      {!collapsed && <div className="sa-section-content">{children}</div>}
    </section>
  )
}
