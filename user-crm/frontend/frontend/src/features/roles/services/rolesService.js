import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
const ENDPOINT='/roles'
export const rolesService={
 list:async()=>MOCK?mockStore.list('roles'):api.get(ENDPOINT).then(r=>Array.isArray(r)?r:r.results||r.data||[]),
 create:data=>MOCK?mockStore.create('roles',data):api.post(ENDPOINT,data),
 update:(id,data)=>MOCK?mockStore.update('roles',id,data):api.put(`${ENDPOINT}/${encodeURIComponent(id)}`,data),
 remove:id=>MOCK?mockStore.remove('roles',id):api.delete(`${ENDPOINT}/${encodeURIComponent(id)}`),

}
