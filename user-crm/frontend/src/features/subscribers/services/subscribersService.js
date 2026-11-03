import { api } from '../../../services/api/apiClient';
const ENDPOINT = '/subscribers/';
const normalize = (r) => ({ id:r.id, name:r.fullName || r.full_name || '—', email:r.email || '—', plan:r.plan_name || r.plan || '—', region:[r.city,r.state,r.country].filter(Boolean).join(', ') || r.state || '—', joined:r.joined_at || r.created_at || '—', status:r.status || 'Active', phone:r.phone || '' });
export const subscribersService = {
  list: async () => (await api.getAll(ENDPOINT)).map(normalize),
  create: async () => { throw new Error('Subscriber creation must start with a customer registration; use the approved customer onboarding flow.'); },
  update: (id,data) => api.patch(`${ENDPOINT}${encodeURIComponent(id)}/`,data).then(normalize),
  remove: (id) => api.delete(`${ENDPOINT}${encodeURIComponent(id)}/`),
};
