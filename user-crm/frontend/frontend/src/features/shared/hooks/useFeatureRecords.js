import { useCallback, useEffect, useMemo, useState } from 'react';

/** Shared CRUD state engine. Each feature exposes its own named hook around this. */
export function useFeatureRecords(service, { fileName }) {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setRows(await service.list()); }
    catch (e) { setError(e?.message || 'Unable to load records'); }
    finally { setLoading(false); }
  }, [service]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => rows.filter((row) =>
    Object.values(row).join(' ').toLowerCase().includes(query.toLowerCase()) &&
    (filter === 'All' || String(row.status || row.result || '').toLowerCase() === filter.toLowerCase())
  ), [rows, query, filter]);

  const save = useCallback(async (data) => {
    try { const row = await service.create(data); setRows((current) => [row, ...current]); return row; }
    catch (e) { setError(e?.message || 'Unable to save'); throw e; }
  }, [service]);

  const exportCsv = useCallback(() => {
    if (!filtered.length) return;
    const keys = [...new Set(filtered.flatMap((row) => Object.keys(row)))];
    const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const csv = [keys.map(escape).join(','), ...filtered.map((row) => keys.map((key) => escape(row[key])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = fileName; anchor.click(); URL.revokeObjectURL(url);
  }, [filtered, fileName]);

  return { rows, setRows, query, setQuery, filter, setFilter, modal, setModal, loading, error, setError, load, filtered, save, exportCsv };
}
