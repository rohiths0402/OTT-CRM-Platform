import { api, unwrapList } from '../../../services/api/apiClient';
const ENDPOINT='/admin/roles/';
const normalize=(r)=>({id:r.id,code:r.code,name:r.name,members:r.members ?? 0,description:r.description,permissions:r.code==='super_admin'?'All permissions':r.code==='admin'?'CRM administration':r.code==='analyst'?'Read analytics':'Support access',status:r.is_active?'Active':'Inactive'});
export const rolesService = {
  list: async () => {
    const [roles,assignments]=await Promise.all([api.getAll(ENDPOINT),api.get('/admin/employee-roles/')]);
    const members={};
    (Array.isArray(assignments)?assignments:[]).forEach(u=>(u.roles||[]).forEach(r=>{members[r.id]=(members[r.id]||0)+1;}));
    return unwrapList(roles).map(r=>normalize({...r,members:members[r.id]||0}));
  },
  create: (d) => { const code=String(d.code || d.name || '').toLowerCase().replaceAll(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''); return api.post(ENDPOINT,{code,name:d.name,description:d.description||'',is_active:d.is_active ?? String(d.status||'Active').toLowerCase()==='active'}).then(normalize); },
  update: (id,d) => api.patch(`${ENDPOINT}${encodeURIComponent(id)}/`,{name:d.name,description:d.description,is_active:d.is_active ?? String(d.status||'Active').toLowerCase()==='active'}).then(normalize),
  remove: (id) => api.delete(`${ENDPOINT}${encodeURIComponent(id)}/`),
};
