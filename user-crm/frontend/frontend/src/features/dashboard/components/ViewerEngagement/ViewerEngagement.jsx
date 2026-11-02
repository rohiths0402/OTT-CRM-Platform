export default function ViewerEngagement() {
  const devices = [['Mobile', 58], ['Smart TV', 24], ['Web', 12], ['Tablet', 6]]
  return (
    <div className="sa-two-column">
      <div className="sa-panel sa-engagement-highlight">
        <div><span>Daily active viewers</span><strong>286K</strong><small>+6.4% vs previous period</small></div>
        <div><span>Monthly retention</span><strong>72.8%</strong><small>+1.8% vs previous period</small></div>
        <div><span>Average session</span><strong>46 min</strong><small>+3.2% vs previous period</small></div>
      </div>
      <div className="sa-panel">
        <div className="sa-panel-heading"><h4>Device distribution</h4><span>Active viewing sessions</span></div>
        {devices.map(([name, value]) => <div className="sa-genre-row" key={name}>
          <div><span>{name}</span><b>{value}%</b></div><div className="sa-progress"><i style={{ width: `${value}%` }} /></div>
        </div>)}
      </div>
    </div>
  )
}
