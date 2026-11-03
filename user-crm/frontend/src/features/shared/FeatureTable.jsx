export default function FeatureTable({columns,rows,extraHeader,renderExtra}) {
 return <div className="crm-table-wrap"><table className="crm-table"><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}{extraHeader&&<th>{extraHeader}</th>}</tr></thead><tbody>
 {rows.map(row=><tr key={row.id}>{columns.map(c=><td key={c.key}>{c.render?c.render(row[c.key],row):row[c.key]??'—'}</td>)}{renderExtra&&<td>{renderExtra(row)}</td>}</tr>)}
 {!rows.length&&<tr><td className="crm-empty" colSpan={columns.length+(extraHeader?1:0)}>No records found.</td></tr>}
 </tbody></table></div>
}
