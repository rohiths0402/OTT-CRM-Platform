import { api } from '../../../services/api/apiClient';
export const auditLogsService = {
  list: async () => (await api.getAll('/admin/audit-logs/')).map((r)=>({id:r.id,actor:r.user_email || `User #${r.user_id || 'system'}`,action:r.action,target:JSON.stringify(r.details || {}),timestamp:r.created_at,ipAddress:r.ip_address || '—',result:'Success'})),
  create: async () => { throw new Error('Audit logs are immutable and are generated automatically by the backend.'); },
};
