
import { useMemo, useState } from 'react';
import {
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  Database,
} from 'lucide-react';

import SubscribersTable from '../components/SubscribersTable';
import { useSubscribers } from '../hooks/useSubscribers';

import './SubscribersPage.css';
import '../subscribers.css';

const PAGE_SIZE = 10;

function SubscribersSkeleton() {
  return (
    <div className="crm-page crm-skeleton-page">

      {/* Header skeleton */}
      <header className="crm-head">
        <div>
          <div className="crm-skeleton crm-sk-eyebrow" />
          <div className="crm-skeleton crm-sk-title" />
          <div className="crm-skeleton crm-sk-subtitle" />
        </div>
      </header>

      {/* KPI skeleton */}
      <div className="crm-kpis">
        {[1, 2, 3].map((item) => (
          <div className="crm-kpi crm-sk-card" key={item}>
            <div className="crm-skeleton crm-sk-label" />
            <div className="crm-skeleton crm-sk-value" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <section className="crm-panel">
        <div className="crm-toolbar crm-sk-toolbar">
          <div className="crm-skeleton crm-sk-search" />

          <div className="crm-sk-actions">
            <div className="crm-skeleton crm-sk-filter" />
            <div className="crm-skeleton crm-sk-button" />
            <div className="crm-skeleton crm-sk-button" />
          </div>
        </div>

        <div className="crm-sk-table">
          <div className="crm-sk-table-header">
            {[1, 2, 3, 4, 5].map((item) => (
              <div className="crm-skeleton" key={item} />
            ))}
          </div>

          {Array.from({ length: 7 }).map((_, index) => (
            <div className="crm-sk-table-row" key={index}>
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="crm-skeleton" key={item} />
              ))}
            </div>
          ))}
        </div>

        <div className="crm-sk-footer">
          <div className="crm-skeleton crm-sk-footer-text" />
          <div className="crm-skeleton crm-sk-footer-text" />
        </div>
      </section>

    </div>
  );
}

export default function SubscribersPage() {
  const {
    rows = [],
    query,
    setQuery,
    filter,
    setFilter,
    loading,
    error,
    load,
    filtered = [],
    exportCsv,
  } = useSubscribers();

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const startRecord = filtered.length
    ? (safePage - 1) * PAGE_SIZE + 1
    : 0;

  const endRecord = Math.min(
    safePage * PAGE_SIZE,
    filtered.length
  );

  const pageNumbers = useMemo(() => {
    const maxVisible = 5;

    let start = Math.max(
      1,
      safePage - Math.floor(maxVisible / 2)
    );

    let end = Math.min(
      totalPages,
      start + maxVisible - 1
    );

    start = Math.max(1, end - maxVisible + 1);

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
  }, [safePage, totalPages]);

  const handleSearch = (value) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  // Full-page skeleton while data is loading.
  if (loading) {
    return <SubscribersSkeleton />;
  }

  return (
    <div className="crm-page">

      {/* Header */}
      <header className="crm-head">
        <div>
          <p className="crm-eyebrow">LOOP USER CRM</p>
          <h1>Subscribers</h1>
          <p>Search, manage and export subscriber accounts.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="crm-kpis">

        <div className="crm-kpi">
          <span>Total records</span>
          <strong>{rows.length.toLocaleString('en-IN')}</strong>
        </div>

        <div className="crm-kpi">
          <span>Matching records</span>
          <strong>{filtered.length.toLocaleString('en-IN')}</strong>
        </div>

        <div className="crm-kpi">
          <span>Data source</span>
          <strong className="crm-source-value">
            {import.meta.env.VITE_USE_MOCK_API === 'false'
              ? 'Live API'
              : 'Mock data'}
          </strong>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="crm-error" role="alert">
          {error}
        </div>
      )}

      {/* Subscribers Table */}
      <section className="crm-panel">

        {/* Toolbar */}
        <div className="crm-toolbar crm-subscribers-toolbar">

          <label className="crm-search">
            <Search size={15} />

            <input
              placeholder="Search subscribers..."
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </label>

          <div className="crm-subscriber-actions">

            <select
              value={filter}
              onChange={(event) => handleFilter(event.target.value)}
              aria-label="Filter subscribers by status"
            >
              <option>All</option>

              {[
                'Active',
                'Pending',
                'Approved',
                'Rejected',
                'Suspended',
                'Completed',
                'Failed',
                'Success',
                'Scheduled',
                'Sent',
                'Paused',
                'Inactive',
              ].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <button
              type="button"
              className="crm-btn secondary"
              onClick={() => {
                setCurrentPage(1);
                load();
              }}
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            <button
              type="button"
              className="crm-btn secondary"
              onClick={exportCsv}
            >
              <Download size={14} />
              Export CSV
            </button>

          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <SubscribersTable rows={paginatedRows} />
        ) : (
          <div className="crm-subscribers-empty">
            <div className="crm-subscribers-empty-icon">
              <Users size={25} />
            </div>

            <h3>No subscribers found</h3>

            <p>
              {query || filter !== 'All'
                ? 'Try changing your search or status filter.'
                : 'Subscriber records will appear here when available.'}
            </p>

            {(query || filter !== 'All') && (
              <button
                type="button"
                className="crm-btn secondary"
                onClick={() => {
                  handleSearch('');
                  handleFilter('All');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Footer and Pagination */}
        <div className="crm-pagination-container">

          <div className="crm-pagination-info">
            <span>
              Showing <strong>{startRecord}–{endRecord}</strong> of{' '}
              <strong>{filtered.length.toLocaleString('en-IN')}</strong>
              {' '}records
            </span>

            <span className="crm-pagination-page-size">
              10 records per page
            </span>
          </div>

          {filtered.length > 0 && (
            <nav
              className="crm-pagination"
              aria-label="Subscribers pagination"
            >
              <button
                type="button"
                className="crm-page-btn crm-page-arrow"
                disabled={safePage === 1}
                onClick={() => setCurrentPage(safePage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {pageNumbers[0] > 1 && (
                <>
                  <button
                    type="button"
                    className="crm-page-btn"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </button>

                  {pageNumbers[0] > 2 && (
                    <span className="crm-page-ellipsis">...</span>
                  )}
                </>
              )}

              {pageNumbers.map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`crm-page-btn ${
                    safePage === page ? 'active' : ''
                  }`}
                  aria-current={safePage === page ? 'page' : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <span className="crm-page-ellipsis">...</span>
                  )}

                  <button
                    type="button"
                    className="crm-page-btn"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                type="button"
                className="crm-page-btn crm-page-arrow"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}

        </div>
      </section>

    </div>
  );
}
