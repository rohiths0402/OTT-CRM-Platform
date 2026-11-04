import { useEffect, useState } from 'react';
import { api } from '../../../../services/api/apiClient';

export default function StreamingInfrastructure() {
    const [health, setHealth] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        api.get('/command-center/streaming/health/')
            .then((response) => {
                if (active) {
                    setHealth(response);
                }
            })
            .catch((e) => {
                if (active) {
                    setError(
                        e.message || 'Unable to load streaming health'
                    );
                }
            });

        return () => {
            active = false;
        };
    }, []);

    if (error) {
        return (
            <p role="alert">
                {error}
            </p>
        );
    }

    if (!health) {
        return (
            <p>Loading streaming telemetry…</p>
        );
    }

    if (health.status === 'no_telemetry') {
        return (
            <div className="sa-panel">
                <div className="sa-panel-heading">
                    <h4>Delivery and playback health</h4>
                    <span>No live telemetry</span>
                </div>

                <p>{health.message}</p>
            </div>
        );
    }

    const metrics = [
        [
            'CDN cache hit ratio',
            health.cdn_cache_hit_ratio,
            '%'
        ],
        [
            'Playback startup success',
            health.playback_start_success,
            '%'
        ],
        [
            'Average startup latency',
            health.startup_latency_seconds,
            ' sec'
        ],
        [
            'Playback failure rate',
            health.playback_failure_rate,
            '%'
        ]
    ];

    return (
        <div className="sa-panel">
            <div className="sa-panel-heading">
                <h4>Delivery and playback health</h4>

                <span>
                    Live telemetry · {health.provider || 'provider not specified'}
                </span>
            </div>

            <div className="sa-health-grid">
                {metrics.map(([label, value, suffix]) => (
                    <div
                        className="sa-health-item"
                        key={label}
                    >
                        <span>{label}</span>

                        <strong>
                            {value == null ? '—' : `${value}${suffix}`}
                        </strong>

                        <small>
                            {value == null
                                ? 'Not reported'
                                : 'Latest recorded value'}
                        </small>
                    </div>
                ))}
            </div>

            <p className="sa-disclaimer">
                Last update:{' '}
                {health.recorded_at
                    ? new Date(health.recorded_at).toLocaleString()
                    : '—'}
            </p>
        </div>
    );
}