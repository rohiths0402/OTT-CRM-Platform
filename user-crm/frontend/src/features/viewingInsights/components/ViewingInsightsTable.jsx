import './ViewingInsightsTable.css';
import FeatureTable from '../../shared/FeatureTable'
const columns=[{key:'id',label:'View ID'},{key:'subscriber',label:'Subscriber'},{key:'title',label:'Content'},{key:'contentType',label:'Type'},{key:'duration',label:'Duration'},{key:'viewedAt',label:'Viewed at'},{key:'device',label:'Device'}]
export default function ViewingInsightsTable({rows,extraHeader,renderExtra}){return <FeatureTable columns={columns} rows={rows} extraHeader={extraHeader} renderExtra={renderExtra}/>}
