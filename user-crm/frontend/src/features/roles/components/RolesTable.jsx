import './RolesTable.css';
import FeatureTable from '../../shared/FeatureTable'
const columns=[{key:'id',label:'Role ID'},{key:'name',label:'Role'},{key:'members',label:'Members'},{key:'description',label:'Description'},{key:'permissions',label:'Permissions'},{key:'status',label:'Status',render:v=><span className={`crm-status ${String(v||'').toLowerCase()}`}>{v}</span>}]
export default function RolesTable({rows,extraHeader,renderExtra}){return <FeatureTable columns={columns} rows={rows} extraHeader={extraHeader} renderExtra={renderExtra}/>}
