export default function Pagination({ page, totalPages, total, disabled, onPageChange }) {
  return (
    <div className="pagination">
      <button
        type="button"
        className="secondary"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Prev
      </button>
      <span>
        Page {page} of {totalPages} · {total} cars
      </span>
      <button
        type="button"
        className="secondary"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
