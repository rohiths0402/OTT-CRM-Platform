export default function DashboardCustomizer({
  open, sections, preferences, onClose, onToggleVisibility, onMove, onReset,
}) {
  if (!open) return null
  return (
    <div className="sa-drawer-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <aside className="sa-customizer" role="dialog" aria-modal="true" aria-labelledby="sa-customizer-title">
        <div className="sa-customizer-header">
          <div>
            <p className="sa-eyebrow">PERSONALIZE WORKSPACE</p>
            <h2 id="sa-customizer-title">Customize dashboard</h2>
          </div>
          <button className="sa-close-button" onClick={onClose} aria-label="Close customizer">×</button>
        </div>
        <p className="sa-customizer-help">Choose which intelligence sections appear on your dashboard. Use the arrows to change their order.</p>
        <div className="sa-customizer-list">
          {preferences.order.map((id, index) => {
            const section = sections.find(item => item.id === id)
            if (!section) return null
            return (
              <div className="sa-customizer-item" key={id}>
                <label>
                  <input type="checkbox" checked={Boolean(preferences.visible[id])} onChange={() => onToggleVisibility(id)} />
                  <span>{section.title}</span>
                </label>
                <div>
                  <button disabled={index === 0} onClick={() => onMove(id, -1)} aria-label={`Move ${section.title} up`}>↑</button>
                  <button disabled={index === preferences.order.length - 1} onClick={() => onMove(id, 1)} aria-label={`Move ${section.title} down`}>↓</button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="sa-customizer-footer">
          <button className="sa-button sa-button-quiet" onClick={onReset}>Reset layout</button>
          <button className="sa-button sa-button-primary" onClick={onClose}>Done</button>
        </div>
        <p className="sa-storage-note">Your preferences are saved in this browser.</p>
      </aside>
    </div>
  )
}
