import { topTitles } from '../../data/dashboardMockData'

export default function ContentIntelligence() {
  return (
    <div className="sa-two-column">
      <div className="sa-panel">
        <div className="sa-panel-heading"><h4>Top watched titles</h4><span>By watch hours</span></div>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead><tr><th>Title</th><th>Genre / Language</th><th>Watch hours</th></tr></thead>
            <tbody>{topTitles.map(item => <tr key={item.title}>
              <td><strong>{item.title}</strong></td>
              <td>{item.genre}<small>{item.language}</small></td>
              <td>{item.hours}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
      <div className="sa-panel">
        <div className="sa-panel-heading"><h4>Genre share</h4><span>Watch time distribution</span></div>
        <div className="sa-genre-list">
          {[['Drama', 34], ['Thriller', 26], ['Comedy', 18], ['Action', 14], ['Other', 8]].map(([name, value]) => (
            <div className="sa-genre-row" key={name}><div><span>{name}</span><b>{value}%</b></div><div className="sa-progress"><i style={{ width: `${value}%` }} /></div></div>
          ))}
        </div>
      </div>
    </div>
  )
}
