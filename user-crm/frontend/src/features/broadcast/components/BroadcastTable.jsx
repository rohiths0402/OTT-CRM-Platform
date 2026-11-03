import './BroadcastTable.css';
import FeatureTable from '../../shared/FeatureTable'
const columns=[{key:'id',label:'Campaign ID'},{key:'title',label:'Notification'},{key:'audience',label:'Audience'},{key:'channel',label:'Channel'},{key:'scheduledAt',label:'Scheduled'},{key:'sent',label:'Sent'},{key:'delivered',label:'Delivered'},{key:'status',label:'Status',render:v=><span className={`crm-status ${String(v||'').toLowerCase()}`}>{v}</span>}]
export default function BroadcastTable({rows,extraHeader,renderExtra}){return <FeatureTable columns={columns} rows={rows} extraHeader={extraHeader} renderExtra={renderExtra}/>}
