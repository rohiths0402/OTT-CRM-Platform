import { api, unwrapList } from '../../../services/api/apiClient';
const ENDPOINT='/admin/broadcast/campaigns/';
export const broadcastService = {
  list: async () => unwrapList(await api.get(ENDPOINT)).map((r) => ({ id:r.id, title:r.title, audience:r.recipient_count ? `${r.recipient_count} subscribers` : '—', channel:r.channel, scheduledAt:r.created_at, sent:r.recipient_count || 0, delivered:'—', status:'Sent', body:r.body })),
  create: (data) => api.post(ENDPOINT,{ title:data.title, body:data.body, channel:data.channel || 'in_app' }).then((r)=>({id:`broadcast-${Date.now()}`,title:r.title,audience:`${r.recipient_count||0} subscribers`,channel:r.channel,scheduledAt:new Date().toISOString(),sent:r.recipient_count||0,delivered:'—',status:'Sent',body:r.body})),
};
