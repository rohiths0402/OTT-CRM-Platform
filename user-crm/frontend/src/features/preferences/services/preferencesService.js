import {api} from '../../../services/api/apiClient'
import {mockStore} from '../../../services/mock/mockStore'
const MOCK=import.meta.env.VITE_USE_MOCK_API!=='false'
export const preferencesService={
 get:()=>MOCK?mockStore.getPreferences():api.get('/users/me/preferences'),
 save:data=>MOCK?mockStore.savePreferences(data):api.put('/users/me/preferences',data)
}
