function Pagination({ page, totalPages, onPageChange, disabled }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination">
      <button
        type="button"
        className="btn"
        disabled={disabled || page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      <span className="page-info">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        className="btn"
        disabled={disabled || page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;