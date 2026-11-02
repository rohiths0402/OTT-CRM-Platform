import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
const ENDPOINT='/viewing-history'
export const viewingInsightsService={
 list:async()=>MOCK?mockStore.list('viewingInsights'):api.get(ENDPOINT).then(r=>Array.isArray(r)?r:r.results||r.data||[]),
 create:data=>MOCK?mockStore.create('viewingInsights',data):api.post(ENDPOINT,data),
 update:(id,data)=>MOCK?mockStore.update('viewingInsights',id,data):api.put(`${ENDPOINT}/${encodeURIComponent(id)}`,data),
 remove:id=>MOCK?mockStore.remove('viewingInsights',id):api.delete(`${ENDPOINT}/${encodeURIComponent(id)}`),

}
