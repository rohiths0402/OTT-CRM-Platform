import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
const ENDPOINT='/engagement'
export const engagementService={
 list:async()=>MOCK?mockStore.list('engagement'):api.get(ENDPOINT).then(r=>Array.isArray(r)?r:r.results||r.data||[]),
 create:data=>MOCK?mockStore.create('engagement',data):api.post(ENDPOINT,data),
 update:(id,data)=>MOCK?mockStore.update('engagement',id,data):api.put(`${ENDPOINT}/${encodeURIComponent(id)}`,data),
 remove:id=>MOCK?mockStore.remove('engagement',id):api.delete(`${ENDPOINT}/${encodeURIComponent(id)}`),

}
