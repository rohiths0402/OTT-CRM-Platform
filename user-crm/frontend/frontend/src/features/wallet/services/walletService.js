import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
const ENDPOINT='/wallet/transactions'
export const walletService={
 list:async()=>MOCK?mockStore.list('wallet'):api.get(ENDPOINT).then(r=>Array.isArray(r)?r:r.results||r.data||[]),
 create:data=>MOCK?mockStore.create('wallet',data):api.post(ENDPOINT,data),
 update:(id,data)=>MOCK?mockStore.update('wallet',id,data):api.put(`${ENDPOINT}/${encodeURIComponent(id)}`,data),
 remove:id=>MOCK?mockStore.remove('wallet',id):api.delete(`${ENDPOINT}/${encodeURIComponent(id)}`),

}
