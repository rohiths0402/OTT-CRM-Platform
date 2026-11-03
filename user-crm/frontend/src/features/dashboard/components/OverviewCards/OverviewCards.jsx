const icons = { users: '♙', play: '▶', clock: '◷', signal: '⌁', megaphone: '◉', wallet: '₹' }

export default function OverviewCards({ metrics }) {
  return (
    <div className="sa-metric-grid">
      {metrics.map(metric => (
        <article className="sa-metric-card" key={metric.label}>
          <div className="sa-metric-top">
            <span className="sa-metric-icon">{icons[metric.icon] || '•'}</span>
            <span className="sa-metric-change">{metric.change}</span>
          </div>
          <strong>{metric.value}</strong>
          <span className="sa-metric-label">{metric.label}</span>
          <span className="sa-metric-note">{metric.note}</span>
        </article>
      ))}
    </div>
  )
}
