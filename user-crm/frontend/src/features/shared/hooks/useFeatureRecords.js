import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 10;

export function useFeatureRecords(service, { fileName }) {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (pageNumber = page) => {
      setLoading(true);
      setError("");

      try {
        const response = await service.list({
          page: pageNumber,
          page_size: pageSize,
          search: query.trim(),
          status: filter === "All" ? "" : filter,
        });

        const results = Array.isArray(response)
          ? response
          : response.results || [];

        const count = Array.isArray(response)
          ? response.length
          : Number(response.count ?? response.total_count ?? 0);

        setRows(results);
        setTotalCount(count);

        const pages = Math.max(1, Math.ceil(count / pageSize));
        setTotalPages(Number(response.total_pages) || pages);

        setPage(pageNumber);
      } catch (e) {
        setError(
          e?.response?.data?.detail ||
            e?.message ||
            "Unable to load subscribers",
        );
        setRows([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [service, page, pageSize, query, filter],
  );
  useEffect(() => {
    load(page);
  }, [page, query, filter]);

  const changePage = useCallback(
    (nextPage) => {
      setPage((current) => {
        const target = Math.max(1, Math.min(nextPage, totalPages));
        return target;
      });
    },
    [totalPages],
  );

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((value) => {
    setFilter(value);
    setPage(1);
  }, []);

  const save = useCallback(
    async (data) => {
      try {
        const result = await service.create(data);
        await load(1);
        setPage(1);
        return result;
      } catch (e) {
        setError(e?.message || "Unable to save record");
        throw e;
      }
    },
    [service, load],
  );

  // Export all matching records in batches.
  const exportCsv = useCallback(async () => {
    try {
      setError("");

      const exportRows = [];
      let exportPage = 1;

      while (true) {
        const response = await service.list({
          page: exportPage,
          page_size: 500,
          search: query.trim(),
          status: filter === "All" ? "" : filter,
        });

        const results = Array.isArray(response)
          ? response
          : response.results || [];

        exportRows.push(...results);

        if (
          results.length === 0 ||
          exportRows.length >=
            Number(response.count ?? response.total_count ?? exportRows.length)
        ) {
          break;
        }

        exportPage += 1;
      }

      if (!exportRows.length) {
        setError("No records available to export.");
        return;
      }

      const keys = [...new Set(exportRows.flatMap((row) => Object.keys(row)))];

      const escapeCsv = (value) => {
        const text = value == null ? "" : String(value);
        return `"${text.replaceAll('"', '""')}"`;
      };

      const csv = [
        keys.map(escapeCsv).join(","),
        ...exportRows.map((row) =>
          keys.map((key) => escapeCsv(row[key])).join(","),
        ),
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.message || "Unable to export records");
    }
  }, [service, query, filter, fileName]);

  return {
    rows,
    setRows,
    query,
    setQuery: handleQueryChange,
    filter,
    setFilter: handleFilterChange,

    page,
    pageSize,
    totalCount,
    totalPages,
    changePage,

    modal,
    setModal,
    loading,
    error,
    setError,
    load,
    filtered: rows,
    save,
    exportCsv,
  };
}
