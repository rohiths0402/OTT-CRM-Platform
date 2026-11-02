import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
const ENDPOINT='/audit-logs'
export const auditLogsService={
 list:async()=>MOCK?mockStore.list('auditLogs'):api.get(ENDPOINT).then(r=>Array.isArray(r)?r:r.results||r.data||[]),
 create:data=>MOCK?mockStore.create('auditLogs',data):api.post(ENDPOINT,data),
 update:(id,data)=>MOCK?mockStore.update('auditLogs',id,data):api.put(`${ENDPOINT}/${encodeURIComponent(id)}`,data),
 remove:id=>MOCK?mockStore.remove('auditLogs',id):api.delete(`${ENDPOINT}/${encodeURIComponent(id)}`),

}
