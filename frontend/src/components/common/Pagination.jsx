import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
