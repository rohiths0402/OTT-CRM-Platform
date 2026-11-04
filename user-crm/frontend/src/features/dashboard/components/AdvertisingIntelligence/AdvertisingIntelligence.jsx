import { useEffect, useState } from 'react';
import { api } from '../../../../services/api/apiClient';

export default function AdvertisingIntelligence() {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        api.get('/admin/analytics/advertising/?days=30')
            .then((response) => {
                if (active) {
                    setData(response);
                }
            })
            .catch((e) => {
                if (active) {
                    setError(
                        e.message || 'Unable to load advertising metrics'
                    );
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const stats = data
        ? [
            [
                'Ad impressions',
                Number(data.impressions || 0).toLocaleString()
            ],
            [
                'Completion rate',
                `${data.completion_rate || 0}%`
            ],
            [
                'Ad revenue',
                `₹${Number(data.revenue || 0).toLocaleString()}`
            ],
            [
                'Active campaigns',
                Number(data.active_campaigns || 0).toLocaleString()
            ]
        ]
        : [];

    return (
        <div>
            {error && (
                <p role="alert">
                    {error}
                </p>
            )}

            <div className="sa-mini-grid">
                {(data ? stats : []).map(([label, value]) => (
                    <div
                        className="sa-panel sa-mini-stat"
                        key={label}
                    >
                        <span>{label}</span>
                        <strong>{value}</strong>
                        <small>Live API · last 30 days</small>
                    </div>
                ))}
            </div>

            {!data && !error && (
                <p>Loading advertising metrics…</p>
            )}
        </div>
    );
}