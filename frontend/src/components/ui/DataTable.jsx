import React, { useEffect, useState } from 'react';
import { Search, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  searchPlaceholder = 'Cari...',
  searchKey,
  pageSize = 10
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredData = searchKey && query
    ? data.filter((item) => {
        const value = typeof searchKey === 'function' ? searchKey(item) : item[searchKey];
        return value && String(value).toLowerCase().includes(query.toLowerCase());
      })
    : data;

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [query, data]);

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const navBtn = 'p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400';

  return (
    <div className="w-full">
      {searchKey && (
        <div className="mb-4 relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-[13px] border border-slate-200 rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 bg-white placeholder:text-slate-400 transition-shadow"
          />
        </div>
      )}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="min-w-full divide-y divide-slate-200 bg-white">
          <thead className="bg-slate-50/70">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-[13px]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/70 transition-colors duration-150">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-5 py-3 whitespace-nowrap">
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Inbox className="h-7 w-7 text-slate-300" />
                    <span className="text-[13px] font-medium">Data tidak ditemukan</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > pageSize && (
        <div className="flex items-center justify-between mt-3.5">
          <p className="text-[12px] text-slate-500">
            Menampilkan <span className="font-medium text-slate-700">{(currentPage - 1) * pageSize + 1}
            –{Math.min(currentPage * pageSize, filteredData.length)}</span> dari{' '}
            <span className="font-medium text-slate-700">{filteredData.length}</span> data
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className={navBtn}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-[12px] font-medium text-slate-600 tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={navBtn}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
