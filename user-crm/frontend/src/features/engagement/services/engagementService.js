import { api } from '../../../services/api/apiClient';
export const engagementService = {
  list: async () => {
    const r = await api.get('/admin/analytics/engagement/?days=30');
    const rows = [{ id:'summary', subscriber:'All subscribers', sessions:r.total_sessions, watchTime:`${r.watch_hours} hrs`, lastActive:'Last 30 days', segment:'Platform total', score:`${r.average_completion_percent}% completion` }];
    (r.device_breakdown || []).forEach((d,i) => rows.push({id:`device-${i}`,subscriber:'Device breakdown',sessions:d.sessions,watchTime:'—',lastActive:'Last 30 days',segment:d.device_type,score:'—'}));
    return rows;
  },
  create: async () => { throw new Error('Engagement metrics are calculated from viewing sessions and cannot be manually created.'); },
};
