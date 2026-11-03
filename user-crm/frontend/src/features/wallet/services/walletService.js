import { api } from '../../../services/api/apiClient';
const ENDPOINT = '/admin/wallets/';
export const walletService = {
  list: async () => {
    const wallets = await api.getAll(ENDPOINT);
    return wallets.flatMap((w) => (w.transactions?.length ? w.transactions : [{id:`wallet-${w.id}`,kind:'balance',amount:0,balance_after:w.balance,created_at:w.updated_at}]).map((t) => ({ id:t.id, walletId:w.id, subscriber:w.full_name || w.email || `Subscriber #${w.subscriber_id}`, transactionType:t.kind, amount:t.amount, balance:t.balance_after ?? w.balance, createdAt:t.created_at, status:'Completed', reference:t.reference })));
  },
  create: async () => { throw new Error('Use the wallet adjustment action for an existing subscriber wallet.'); },
  adjust: (walletId,{kind,amount,description}) => api.post(`${ENDPOINT}${encodeURIComponent(walletId)}/adjust/`,{kind,amount,description}),
};
