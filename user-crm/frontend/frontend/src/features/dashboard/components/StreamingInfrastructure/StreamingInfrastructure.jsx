const health = [
  ['CDN cache hit ratio', '91.8%', 'Healthy', 92],
  ['Playback startup success', '98.7%', 'Healthy', 99],
  ['Average startup latency', '2.4 sec', 'Monitor', 72],
  ['Playback failure rate', '0.8%', 'Healthy', 96],
]
export default function StreamingInfrastructure() {
  return (
    <div className="sa-panel">
      <div className="sa-panel-heading"><h4>Delivery and playback health</h4><span>Sample telemetry</span></div>
      <div className="sa-health-grid">
        {health.map(([label, value, status, score]) => <div className="sa-health-item" key={label}>
          <span>{label}</span><strong>{value}</strong>
          <div className="sa-progress"><i style={{ width: `${score}%` }} /></div>
          <small className={status === 'Monitor' ? 'sa-status-warning' : 'sa-status-good'}>{status}</small>
        </div>)}
      </div>
      <p className="sa-disclaimer">Connect CDN, player telemetry, transcoding and message-queue monitoring APIs to show production health.</p>
    </div>
  )
}
