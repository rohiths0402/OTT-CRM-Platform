import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
const ENDPOINT='/rewards'
export const rewardsService={
 list:async()=>MOCK?mockStore.list('rewards'):api.get(ENDPOINT).then(r=>Array.isArray(r)?r:r.results||r.data||[]),
 create:data=>MOCK?mockStore.create('rewards',data):api.post(ENDPOINT,data),
 update:(id,data)=>MOCK?mockStore.update('rewards',id,data):api.put(`${ENDPOINT}/${encodeURIComponent(id)}`,data),
 remove:id=>MOCK?mockStore.remove('rewards',id):api.delete(`${ENDPOINT}/${encodeURIComponent(id)}`),

}
