import { api } from '../../../services/api/apiClient';
const ENDPOINT = '/admin/rewards/accounts/';
export const rewardsService = {
  list: async () => {
    const accounts = await api.getAll(ENDPOINT);
    return accounts.flatMap((a) => (a.transactions?.length ? a.transactions : [{id:`account-${a.id}`,kind:'balance',points:a.points_balance,created_at:a.updated_at}]).map((t) => ({ id:t.id, accountId:a.id, name:a.full_name || a.email || `Subscriber #${a.subscriber_id}`, category:t.kind, points:t.points ?? a.points_balance, redemptions:0, startDate:t.created_at, endDate:'—', status:'Completed', balanceAfter:t.balance_after })));
  },
  create: async () => { throw new Error('Use the reward points adjustment action for an existing reward account.'); },
  adjust: (accountId,{kind,points,reason}) => api.post(`${ENDPOINT}${encodeURIComponent(accountId)}/adjust/`,{kind,points,reason}),
};
