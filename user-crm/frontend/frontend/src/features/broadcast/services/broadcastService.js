import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
const ENDPOINT='/notifications'
export const broadcastService={
 list:async()=>MOCK?mockStore.list('broadcast'):api.get(ENDPOINT).then(r=>Array.isArray(r)?r:r.results||r.data||[]),
 create:data=>MOCK?mockStore.create('broadcast',data):api.post(ENDPOINT,data),
 update:(id,data)=>MOCK?mockStore.update('broadcast',id,data):api.put(`${ENDPOINT}/${encodeURIComponent(id)}`,data),
 remove:id=>MOCK?mockStore.remove('broadcast',id):api.delete(`${ENDPOINT}/${encodeURIComponent(id)}`),

}
