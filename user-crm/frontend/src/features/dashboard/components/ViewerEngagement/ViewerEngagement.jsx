
import { useEffect, useState } from 'react';
import { api } from '../../../../services/api/apiClient';
import './ViewerEngagement.css';

export default function ViewerEngagement() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/admin/analytics/engagement/?days=30')
      .then((response) => {
        if (active) setData(response);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.message || 'Unable to load engagement metrics'
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="sa-engagement-state sa-engagement-error" role="alert">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="sa-engagement-state">
        Loading engagement metrics...
      </div>
    );
  }

  const devices = data.device_breakdown || [];

  const totalDeviceSessions = devices.reduce(
    (total, device) => total + Number(device.sessions || 0),
    0
  );

  const metrics = [
    {
      label: 'Monthly active viewers',
      value: Number(data.unique_viewers || 0).toLocaleString(),
      description: 'Last 30 days',
    },
    {
      label: 'Total sessions',
      value: Number(data.total_sessions || 0).toLocaleString(),
      description: 'Recorded viewing sessions',
    },
    {
      label: 'Watch hours',
      value: Number(data.watch_hours || 0).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }),
      description: 'Aggregated watch time',
    },
    {
      label: 'Average completion',
      value: `${Number(
        data.average_completion_percent || 0
      ).toFixed(1)}%`,
      description: 'Session completion',
    },
  ];

  return (
    <section className="sa-engagement">
      <div className="sa-engagement-grid">

        {/* Engagement Metrics */}
        <div className="sa-engagement-panel">
          <div className="sa-engagement-panel-header">
            <div>
              <h3>Engagement overview</h3>
              <p>Viewer activity across the platform</p>
            </div>
            <span className="sa-engagement-period">Last 30 days</span>
          </div>

          <div className="sa-engagement-metrics">
            {metrics.map((metric) => (
              <div className="sa-engagement-metric" key={metric.label}>
                <span className="sa-engagement-label">
                  {metric.label}
                </span>

                <strong className="sa-engagement-value">
                  {metric.value}
                </strong>

                <span className="sa-engagement-description">
                  {metric.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="sa-engagement-panel sa-device-panel">
          <div className="sa-engagement-panel-header">
            <div>
              <h3>Device distribution</h3>
              <p>Viewing sessions by device</p>
            </div>
            <span className="sa-engagement-period">
              {totalDeviceSessions.toLocaleString()} sessions
            </span>
          </div>

          {devices.length > 0 ? (
            <div className="sa-device-list">
              {devices.map((device) => {
                const sessions = Number(device.sessions || 0);

                const percentage = totalDeviceSessions > 0
                  ? (sessions / totalDeviceSessions) * 100
                  : 0;

                return (
                  <div
                    className="sa-device-item"
                    key={device.device_type || 'unknown'}
                  >
                    <div className="sa-device-info">
                      <span className="sa-device-name">
                        {(device.device_type || 'Unknown')
                          .replaceAll('_', ' ')}
                      </span>

                      <div className="sa-device-stats">
                        <strong>{sessions.toLocaleString()}</strong>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div
                      className="sa-device-track"
                      role="progressbar"
                      aria-label={`${device.device_type || 'Unknown'} sessions`}
                      aria-valuenow={Number(percentage.toFixed(1))}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="sa-device-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="sa-engagement-empty">
              No device distribution data available.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
