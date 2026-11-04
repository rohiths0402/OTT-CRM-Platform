import './WalletTable.css';
import FeatureTable from '../../shared/FeatureTable'
const columns=[{key:'id',label:'Transaction ID'},{key:'subscriber',label:'Subscriber'},{key:'transactionType',label:'Type'},{key:'amount',label:'Amount'},{key:'balance',label:'Balance'},{key:'createdAt',label:'Date'},{key:'status',label:'Status',render:v=><span className={`crm-status ${String(v||'').toLowerCase()}`}>{v}</span>}]
export default function WalletTable({rows,extraHeader,renderExtra}){return <FeatureTable columns={columns} rows={rows} extraHeader={extraHeader} renderExtra={renderExtra}/>}
