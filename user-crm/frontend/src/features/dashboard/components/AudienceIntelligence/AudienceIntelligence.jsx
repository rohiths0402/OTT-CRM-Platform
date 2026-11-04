
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { feature } from 'topojson-client';

import { api } from '../../../../services/api/apiClient';
import './AudienceIntelligence.css';

const GEO_URL =
  'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/topojson/india.json';

const normalize = (value = '') =>
  value.toLowerCase().replace(/[^a-z]/g, '');

const formatNumber = (value, digits = 0) =>
  Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: digits,
  });

const formatPercentage = (value) =>
  `${Number(value || 0).toFixed(1)}%`;

export default function AudienceIntelligence() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [apiError, setApiError] = useState('');
  const [mapError, setMapError] = useState('');
  const [loadingMap, setLoadingMap] = useState(true);

  // -----------------------------------------
  // AUDIENCE API
  // -----------------------------------------

  useEffect(() => {
    let active = true;

    api.get('/admin/analytics/audience/?days=30')
      .then((result) => {
        if (!active) return;

        setData(result);

        const states = result.subscribers_by_state || [];

        setSelectedState(
          states.find(
            (item) => normalize(item.state) === 'tamilnadu'
          ) || states[0] || null
        );
      })
      .catch((error) => {
        if (active) {
          setApiError(
            error.message || 'Unable to load audience data'
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // -----------------------------------------
  // INDIA MAP DATA
  // -----------------------------------------

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadMap() {
      try {
        setLoadingMap(true);
        setMapError('');

        const response = await fetch(GEO_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Map download failed: HTTP ${response.status}`
          );
        }

        const topology = await response.json();

        if (!topology.objects?.states) {
          throw new Error(
            'The map file does not contain state boundaries.'
          );
        }

        const converted = feature(
          topology,
          topology.objects.states
        );

        if (active) {
          setGeoData(converted);
        }
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          setMapError(
            error.message || 'Unable to load India map'
          );
        }
      } finally {
        if (active) {
          setLoadingMap(false);
        }
      }
    }

    loadMap();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  // -----------------------------------------
  // REGIONAL DATA
  // -----------------------------------------

  const states = data?.subscribers_by_state || [];

  const stateData = useMemo(() => {
    const result = new Map();

    for (const item of states) {
      result.set(normalize(item.state), item);
    }

    return result;
  }, [states]);

  const maxSubscribers = Math.max(
    1,
    ...states.map((item) => Number(item.subscribers || 0))
  );

  // Overall audience figures returned by the API.
  const totalSubscribers = Number(data?.new_subscribers || 0);
  const totalActiveViewers = Number(data?.active_viewers || 0);
  const totalWatchHours = Number(data?.watch_hours || 0);

  // -----------------------------------------
  // SELECTED REGION CALCULATIONS
  // -----------------------------------------

  const selectedMetrics = useMemo(() => {
    if (!selectedState) return null;

    const subscribers = Number(selectedState.subscribers || 0);
    const activeViewers = Number(selectedState.active_viewers || 0);
    const watchHours = Number(selectedState.watch_hours || 0);

    const activityRate = subscribers > 0
      ? (activeViewers / subscribers) * 100
      : 0;

    const averageWatchTime = activeViewers > 0
      ? watchHours / activeViewers
      : 0;

    const subscriberShare = totalSubscribers > 0
      ? (subscribers / totalSubscribers) * 100
      : 0;

    const watchHourShare = totalWatchHours > 0
      ? (watchHours / totalWatchHours) * 100
      : 0;

    const subscriberRanking = [...states]
      .sort(
        (a, b) =>
          Number(b.subscribers || 0) -
          Number(a.subscribers || 0)
      );

    const watchHourRanking = [...states]
      .sort(
        (a, b) =>
          Number(b.watch_hours || 0) -
          Number(a.watch_hours || 0)
      );

    const subscriberRank =
      subscriberRanking.findIndex(
        (item) => normalize(item.state) === normalize(selectedState.state)
      ) + 1;

    const watchHourRank =
      watchHourRanking.findIndex(
        (item) => normalize(item.state) === normalize(selectedState.state)
      ) + 1;

    return {
      subscribers,
      activeViewers,
      watchHours,
      activityRate,
      averageWatchTime,
      subscriberShare,
      watchHourShare,
      subscriberRank,
      watchHourRank,
    };
  }, [
    selectedState,
    states,
    totalSubscribers,
    totalWatchHours,
  ]);

  const getFill = (stateName) => {
    const item = stateData.get(normalize(stateName));
    if (!item) return '#292929';

    const ratio =
      Number(item.subscribers || 0) / maxSubscribers;

    if (ratio >= 0.8) return '#E8C779';
    if (ratio >= 0.6) return '#D6B56D';
    if (ratio >= 0.4) return '#B58B45';
    if (ratio >= 0.2) return '#89652F';

    return '#634B29';
  };

  // -----------------------------------------
  // API STATES
  // -----------------------------------------

  if (apiError) {
    return (
      <div className="sa-audience-state sa-audience-error" role="alert">
        {apiError}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="sa-audience-state">
        Loading audience intelligence...
      </div>
    );
  }

  return (
    <div className="sa-audience-layout">

      <section className="sa-map-panel">

        <div className="sa-map-toolbar">
          <div>
            <h4>India Audience Intelligence</h4>
            <p>
              Regional audience distribution · {data.period_days} days
            </p>
          </div>

          <button
            type="button"
            className="sa-button sa-button-quiet"
            onClick={() =>
              navigate('/command-center/audience-intelligence')
            }
          >
            View full analytics →
          </button>
        </div>

        {/* Overall Audience Summary */}

        <div className="sa-audience-summary">
          <div>
            <span>New subscribers</span>
            <strong>{formatNumber(totalSubscribers)}</strong>
          </div>

          <div>
            <span>Active viewers</span>
            <strong>{formatNumber(totalActiveViewers)}</strong>
          </div>

          <div>
            <span>Watch hours</span>
            <strong>{formatNumber(totalWatchHours, 2)}</strong>
          </div>
        </div>

        {/* India Map */}

        <div className="sa-india-map">

          {loadingMap && (
            <p>Loading India state boundaries...</p>
          )}

          {mapError && (
            <p className="sa-map-error" role="alert">
              {mapError}
            </p>
          )}

          {geoData && (
            <ComposableMap
              width={650}
              height={600}
              projection="geoMercator"
              projectionConfig={{
                center: [82.8, 22.5],
                scale: 950,
              }}
              style={{
                width: '100%',
                height: 'auto',
              }}
            >
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName =
                      geo.properties?.st_nm ||
                      geo.properties?.NAME_1 ||
                      geo.properties?.name ||
                      geo.id ||
                      '';

                    const selected =
                      normalize(selectedState?.state) ===
                      normalize(stateName);

                    const hasData = stateData.has(
                      normalize(stateName)
                    );

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => {
                          const state = stateData.get(
                            normalize(stateName)
                          );

                          if (state) {
                            setSelectedState(state);
                          }
                        }}
                        style={{
                          default: {
                            fill: selected
                              ? '#E8C779'
                              : getFill(stateName),
                            stroke: '#777777',
                            strokeWidth: 0.9,
                            outline: 'none',
                            transition: 'fill 180ms ease',
                          },

                          hover: {
                            fill: hasData ? '#F5DFA8' : '#484848',
                            stroke: '#F5DFA8',
                            strokeWidth: 1.5,
                            outline: 'none',
                            cursor: hasData ? 'pointer' : 'default',
                          },

                          pressed: {
                            fill: '#F5DFA8',
                            stroke: '#FFFFFF',
                            strokeWidth: 1.5,
                            outline: 'none',
                          },
                        }}
                        className={
                          selected ? 'sa-map-state-active' : ''
                        }
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          )}
        </div>

        {/* Map Legend */}

        <div className="sa-map-legend">
          <span>Lower audience</span>
          <div className="sa-map-gradient" />
          <span>Higher audience</span>
          <small>No reported data = Grey</small>
        </div>
      </section>

      {/* =====================================
          RIGHT: REGIONAL INTELLIGENCE
      ===================================== */}

      <aside className="sa-state-detail">

        <div className="sa-region-header">
          <div>
            <span className="sa-detail-eyebrow">
              REGIONAL INTELLIGENCE
            </span>

            <h4>
              {selectedState?.state || 'Select a state'}
            </h4>
          </div>

          <span className="sa-region-period">
            {data.period_days} days
          </span>
        </div>

        {selectedState && selectedMetrics ? (
          <>

            {/* 1. AUDIENCE OVERVIEW */}

            <section className="sa-region-section">

              <div className="sa-region-section-heading">
                <span>01</span>
                <h5>Audience overview</h5>
              </div>

              <div className="sa-region-metrics">

                <div className="sa-region-metric">
                  <span>Subscribers</span>
                  <strong>
                    {formatNumber(selectedMetrics.subscribers)}
                  </strong>
                </div>

                <div className="sa-region-metric">
                  <span>Active viewers</span>
                  <strong>
                    {formatNumber(selectedMetrics.activeViewers)}
                  </strong>
                </div>

                <div className="sa-region-metric">
                  <span>Watch hours</span>
                  <strong>
                    {formatNumber(selectedMetrics.watchHours, 2)}
                  </strong>
                </div>

                <div className="sa-region-metric">
                  <span>Viewer activity rate</span>
                  <strong>
                    {formatPercentage(selectedMetrics.activityRate)}
                  </strong>
                </div>

              </div>
            </section>

            {/* 2. ENGAGEMENT INSIGHTS */}

            <section className="sa-region-section">

              <div className="sa-region-section-heading">
                <span>02</span>
                <h5>Engagement insights</h5>
              </div>

              <div className="sa-region-insight">

                <div>
                  <span>Average watch time per active viewer</span>
                  <strong>
                    {formatNumber(
                      selectedMetrics.averageWatchTime,
                      2
                    )} hrs
                  </strong>
                </div>

                <div>
                  <span>Share of platform watch hours</span>
                  <strong>
                    {formatPercentage(selectedMetrics.watchHourShare)}
                  </strong>
                </div>

              </div>
            </section>

            {/* 3. REGIONAL COMPARISON */}

            <section className="sa-region-section">

              <div className="sa-region-section-heading">
                <span>03</span>
                <h5>Regional comparison</h5>
              </div>

              <div className="sa-region-comparison">

                <div className="sa-region-comparison-item">
                  <div>
                    <span>Share of new subscribers</span>
                    <strong>
                      {formatPercentage(
                        selectedMetrics.subscriberShare
                      )}
                    </strong>
                  </div>

                  <small>
                    Based on reported new subscribers
                  </small>
                </div>

                <div className="sa-region-comparison-item">
                  <div>
                    <span>Subscriber ranking</span>
                    <strong>
                      {selectedMetrics.subscriberRank > 0
                        ? `${selectedMetrics.subscriberRank} / ${states.length}`
                        : 'N/A'}
                    </strong>
                  </div>

                  <small>
                    Compared with reported states
                  </small>
                </div>

                <div className="sa-region-comparison-item">
                  <div>
                    <span>Watch-hour ranking</span>
                    <strong>
                      {selectedMetrics.watchHourRank > 0
                        ? `${selectedMetrics.watchHourRank} / ${states.length}`
                        : 'N/A'}
                    </strong>
                  </div>

                  <small>
                    Compared with reported states
                  </small>
                </div>

              </div>
            </section>

            <div className="sa-region-footer">
              Metrics are calculated from regional records returned by
              the Loop analytics API.
            </div>

          </>
        ) : (
          <div className="sa-region-empty">
            Select a state on the map to explore its audience metrics.
          </div>
        )}

      </aside>

    </div>
  );
}
