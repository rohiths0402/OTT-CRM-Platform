
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../../services/api/apiClient';
import './ContentIntelligence.css';

export default function ContentIntelligence() {
  const [titles, setTitles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.get('/command-center/content/top-titles/?days=30')
      .then((response) => {
        if (!active) return;

        const content = response.top_titles || [];

        setTitles(content);
        setSelectedId(content[0]?.title_id ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Unable to load content metrics');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredTitles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return titles;

    return titles.filter((item) =>
      (item.title || '').toLowerCase().includes(query)
    );
  }, [titles, search]);

  const selectedTitle = filteredTitles.find(
    (item) => item.title_id === selectedId
  ) || filteredTitles[0] || null;

  const totalWatchHours = useMemo(
    () => titles.reduce(
      (total, item) => total + Number(item.watch_hours || 0),
      0
    ),
    [titles]
  );

  const averageWatchHours = titles.length
    ? totalWatchHours / titles.length
    : 0;

  const selectedWatchHours = Number(
    selectedTitle?.watch_hours || 0
  );

  const selectedShare = totalWatchHours > 0
    ? (selectedWatchHours / totalWatchHours) * 100
    : 0;

  const formatNumber = (value, maximumFractionDigits = 2) =>
    Number(value || 0).toLocaleString(undefined, {
      maximumFractionDigits,
    });

  const handleRetry = () => {
    setLoading(true);
    setError('');

    api.get('/command-center/content/top-titles/?days=30')
      .then((response) => {
        const content = response.top_titles || [];

        setTitles(content);
        setSelectedId(content[0]?.title_id ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load content metrics');
        setLoading(false);
      });
  };

  return (
    <section className="sa-content-intelligence">

      {/* Header */}
      <div className="sa-content-header">
        <div>
          <div className="sa-content-heading-title">
            <div className="sa-content-heading-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="16"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M10 9L15 12L10 15V9Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div>
              <h3>Content intelligence</h3>
              <p>Understand content consumption across your platform.</p>
            </div>
          </div>
        </div>

        <span className="sa-content-period">
          <span className="sa-content-period-dot" />
          Last 30 days
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="sa-content-state">
          <span className="sa-content-loader" />
          Loading content analytics...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="sa-content-state sa-content-error">
          <p>{error}</p>
          <button
            type="button"
            className="sa-content-retry"
            onClick={handleRetry}
          >
            Try again
          </button>
        </div>
      )}

      {/* Main Dashboard */}
      {!loading && !error && (
        <>
          {/* Summary Metrics */}
          <div className="sa-content-overview">

            <div className="sa-content-overview-card">
              <div className="sa-content-overview-label">
                <span className="sa-content-metric-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 4V20M16 4V20M3 9H8M16 9H21M3 15H8M16 15H21"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </span>
                <span>Active titles</span>
              </div>

              <strong>{formatNumber(titles.length, 0)}</strong>
              <small>Titles with viewing activity</small>
            </div>

            <div className="sa-content-overview-card">
              <div className="sa-content-overview-label">
                <span className="sa-content-metric-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M12 7V12L15 14"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span>Total watch hours</span>
              </div>

              <strong>{formatNumber(totalWatchHours)}</strong>
              <small>Combined viewing time</small>
            </div>

            <div className="sa-content-overview-card">
              <div className="sa-content-overview-label">
                <span className="sa-content-metric-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 19V5M4 19H21M8 15L12 11L15 14L21 7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>Average watch hours</span>
              </div>

              <strong>{formatNumber(averageWatchHours)}</strong>
              <small>Per active title</small>
            </div>

          </div>

          {titles.length > 0 ? (
            <div className="sa-content-dashboard">

              {/* Left: Content Library */}
              <div className="sa-content-library">

                <div className="sa-content-library-header">
                  <div>
                    <h4>Content library</h4>
                    <p>Browse viewing performance by title.</p>
                  </div>

                  <span className="sa-content-count">
                    {filteredTitles.length} titles
                  </span>
                </div>

                {/* Search */}
                <div className="sa-content-search">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M16 16L21 21"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>

                  <input
                    type="search"
                    placeholder="Search titles..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search content titles"
                  />

                  {search && (
                    <button
                      type="button"
                      className="sa-content-clear"
                      onClick={() => setSearch('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Title List */}
                <div className="sa-content-title-list">
                  {filteredTitles.length > 0 ? (
                    filteredTitles.map((item) => {
                      const isSelected =
                        selectedTitle?.title_id === item.title_id;

                      return (
                        <button
                          type="button"
                          key={item.title_id}
                          className={`sa-content-title-item ${
                            isSelected ? 'active' : ''
                          }`}
                          onClick={() => setSelectedId(item.title_id)}
                        >
                          <span className="sa-content-title-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                              <rect
                                x="4"
                                y="3"
                                width="16"
                                height="18"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M10 9L15 12L10 15V9Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>

                          <span className="sa-content-title-info">
                            <strong>{item.title}</strong>
                            <small>
                              {formatNumber(item.watch_hours)} watch hours
                            </small>
                          </span>

                          <svg
                            className="sa-content-chevron"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M9 18L15 12L9 6"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      );
                    })
                  ) : (
                    <div className="sa-content-no-results">
                      No titles match your search.
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Selected Content Details */}
              <aside className="sa-content-details">

                <div className="sa-content-details-header">
                  <span>SELECTED CONTENT</span>
                  <span className="sa-content-live-dot" />
                </div>

                {selectedTitle ? (
                  <>
                    <div className="sa-content-feature">
                      <div className="sa-content-feature-art">
                        <svg viewBox="0 0 24 24" fill="none">
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M10 8L16 12L10 16V8Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>

                      <div className="sa-content-feature-text">
                        <span>CONTENT TITLE</span>
                        <h4>{selectedTitle.title}</h4>
                        <small>Viewing performance</small>
                      </div>
                    </div>

                    <div className="sa-content-detail-divider" />

                    <div className="sa-content-primary-stat">
                      <span>Total watch hours</span>
                      <strong>
                        {formatNumber(selectedWatchHours)}
                      </strong>
                      <small>Hours recorded in the selected period</small>
                    </div>

                    <div className="sa-content-detail-grid">

                      <div className="sa-content-detail-card">
                        <span>Share of watch time</span>
                        <strong>{selectedShare.toFixed(2)}%</strong>
                      </div>

                      <div className="sa-content-detail-card">
                        <span>Platform average</span>
                        <strong>
                          {formatNumber(averageWatchHours)}
                        </strong>
                      </div>

                    </div>

                    <div className="sa-content-detail-footer">
                      <span>Reporting period</span>
                      <strong>Last 30 days</strong>
                    </div>

                  </>
                ) : (
                  <div className="sa-content-no-results">
                    Select a title to view its performance.
                  </div>
                )}

              </aside>

            </div>
          ) : (
            <div className="sa-content-empty">
              <div className="sa-content-empty-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 9L15 12L10 15V9Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h4>No content activity</h4>
              <p>No titles have recorded viewing activity in this period.</p>
            </div>
          )}
        </>
      )}

    </section>
  );
}
