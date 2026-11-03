import './IdentityVaultTable.css';
import FeatureTable from '../../shared/FeatureTable'
const columns=[{key:'id',label:'KYC ID'},{key:'name',label:'Subscriber'},{key:'documentType',label:'Document'},{key:'submittedAt',label:'Submitted'},{key:'region',label:'Region'},{key:'status',label:'Status',render:v=><span className={`crm-status ${String(v||'').toLowerCase()}`}>{v}</span>}]
export default function IdentityVaultTable({rows,extraHeader,renderExtra}){return <FeatureTable columns={columns} rows={rows} extraHeader={extraHeader} renderExtra={renderExtra}/>}
