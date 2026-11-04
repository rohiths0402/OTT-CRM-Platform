import { api, unwrapList } from '../../../services/api/apiClient';

const ENDPOINT = '/admin/broadcast/campaigns/';

export const broadcastService = {
    list: async () => {
        const response = await api.get(ENDPOINT);
        const records = unwrapList(response);

        return records.map((record) => ({
            id: record.id,
            title: record.title,
            audience: record.recipient_count
                ? `${record.recipient_count} subscribers`
                : '—',
            channel: record.channel,
            scheduledAt: record.created_at,
            sent: record.recipient_count || 0,
            delivered: '—',
            status: 'Sent',
            body: record.body
        }));
    },

    create: (data) => {
        return api
            .post(ENDPOINT, {
                title: data.title,
                body: data.body,
                channel: data.channel || 'in_app'
            })
            .then((response) => ({
                id: `broadcast-${Date.now()}`,
                title: response.title,
                audience: `${response.recipient_count || 0} subscribers`,
                channel: response.channel,
                scheduledAt: new Date().toISOString(),
                sent: response.recipient_count || 0,
                delivered: '—',
                status: 'Sent',
                body: response.body
            }));
    }
};