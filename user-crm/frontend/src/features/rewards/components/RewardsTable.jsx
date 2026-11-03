import './RewardsTable.css';
import FeatureTable from '../../shared/FeatureTable'
const columns=[{key:'id',label:'Reward ID'},{key:'name',label:'Reward'},{key:'category',label:'Category'},{key:'points',label:'Points'},{key:'redemptions',label:'Redemptions'},{key:'startDate',label:'Start date'},{key:'endDate',label:'End date'},{key:'status',label:'Status',render:v=><span className={`crm-status ${String(v||'').toLowerCase()}`}>{v}</span>}]
export default function RewardsTable({rows,extraHeader,renderExtra}){return <FeatureTable columns={columns} rows={rows} extraHeader={extraHeader} renderExtra={renderExtra}/>}
