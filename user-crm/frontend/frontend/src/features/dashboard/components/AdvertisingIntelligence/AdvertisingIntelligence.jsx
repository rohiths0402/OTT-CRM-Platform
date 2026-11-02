const stats = [
  ['Ad impressions', '18.6M', '+9.8%'],
  ['Completion rate', '87.4%', '+2.1%'],
  ['Average CPM', '₹142', '+4.6%'],
  ['Fill rate', '94.8%', '+1.3%'],
]
export default function AdvertisingIntelligence() {
  return <div className="sa-mini-grid">{stats.map(([label, value, change]) => (
    <div className="sa-panel sa-mini-stat" key={label}><span>{label}</span><strong>{value}</strong><small>{change} vs previous period</small></div>
  ))}</div>
}
