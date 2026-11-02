import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
const ENDPOINT='/kyc'
export const identityVaultService={
 list:async()=>MOCK?mockStore.list('identityVault'):api.get(ENDPOINT).then(r=>Array.isArray(r)?r:r.results||r.data||[]),
 create:data=>MOCK?mockStore.create('identityVault',data):api.post(ENDPOINT,data),
 update:(id,data)=>MOCK?mockStore.update('identityVault',id,data):api.put(`${ENDPOINT}/${encodeURIComponent(id)}`,data),
 remove:id=>MOCK?mockStore.remove('identityVault',id):api.delete(`${ENDPOINT}/${encodeURIComponent(id)}`),
 setKycStatus:(id,status,note='')=>MOCK?mockStore.update('identityVault',id,{status,reviewNote:note}):api.patch(`${ENDPOINT}/${encodeURIComponent(id)}/status`,{status,note}),
}
