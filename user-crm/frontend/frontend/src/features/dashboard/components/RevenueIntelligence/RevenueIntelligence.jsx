import { revenueTrend } from '../../data/dashboardMockData'

export default function RevenueIntelligence() {
  return (
    <div className="sa-two-column">
      <div className="sa-panel">
        <div className="sa-panel-heading"><h4>Revenue trend</h4><span>Illustrative monthly revenue index</span></div>
        <div className="sa-bar-chart">
          {revenueTrend.map(item => <div className="sa-bar-column" key={item.month}>
            <b>{item.value}</b><i style={{ height: `${item.value}%` }} /><span>{item.month}</span>
          </div>)}
        </div>
      </div>
      <div className="sa-panel sa-revenue-breakdown">
        <div className="sa-panel-heading"><h4>Revenue mix</h4><span>Demo figures</span></div>
        <div><span>Subscriptions</span><strong>₹3.64Cr</strong></div>
        <div><span>Advertising</span><strong>₹1.18Cr</strong></div>
        <div><span>Refunds</span><strong>₹0.08Cr</strong></div>
        <div className="sa-total-row"><span>Net revenue</span><strong>₹4.74Cr</strong></div>
      </div>
    </div>
  )
}
