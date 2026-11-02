import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
const ENDPOINT='/subscribers'
export const subscribersService={
 list:async()=>MOCK?mockStore.list('subscribers'):api.get(ENDPOINT).then(r=>Array.isArray(r)?r:r.results||r.data||[]),
 create:data=>MOCK?mockStore.create('subscribers',data):api.post(ENDPOINT,data),
 update:(id,data)=>MOCK?mockStore.update('subscribers',id,data):api.put(`${ENDPOINT}/${encodeURIComponent(id)}`,data),
 remove:id=>MOCK?mockStore.remove('subscribers',id):api.delete(`${ENDPOINT}/${encodeURIComponent(id)}`),

}
