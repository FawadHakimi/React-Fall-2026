import { useSearchParams } from "react-router";
import { useCars } from "../hooks/useCars";
import CarList from "./CarList";
import Filters from "./Filters";
import Pagination from "./Pagination";

const PAGE_SIZE = 12;

function CarsPage({ onSelectCar }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Read the values from the URL
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "All";
  const transmission = searchParams.get("transmission") || "All";
  const availableOnly = searchParams.get("available") === "true";
  const sortBy = searchParams.get("sort") || "default";
  const page = Math.max(1, Math.floor(Number(searchParams.get("page"))) || 1);

  const filters = { search, type, transmission, availableOnly, sortBy };

  // 2. Load the cars (cached)
  const { data, isPending, isError, error, isPlaceholderData, refetch } =
    useCars({ ...filters, page, pageSize: PAGE_SIZE });

  // 3. The status is calculated, not stored
  const status = isError ? "error" : isPending || isPlaceholderData ? "loading" : "success";
  const cars = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // 4. Handlers write to the URL
  function handleFiltersChange(newFilters) {
    const next = new URLSearchParams();
    if (newFilters.search) next.set("search", newFilters.search);
    if (newFilters.type !== "All") next.set("type", newFilters.type);
    if (newFilters.transmission !== "All") {
      next.set("transmission", newFilters.transmission);
    }
    if (newFilters.availableOnly) next.set("available", "true");
    if (newFilters.sortBy !== "default") next.set("sort", newFilters.sortBy);
    setSearchParams(next, { replace: true });
  }

  function handlePageChange(newPage) {
    const next = new URLSearchParams(searchParams);
    if (newPage === 1) {
      next.delete("page");
    } else {
      next.set("page", newPage);
    }
    setSearchParams(next);
  }

  function handleRetry() {
    refetch();
  }

  return (
    <>
      <Filters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={() => setSearchParams({}, { replace: true })}
      />

      {status === "loading" && cars.length === 0 && (
        <p className="message">Loading cars...</p>
      )}
      {status === "loading" && cars.length > 0 && (
        <p className="result-count">Updating...</p>
      )}
      {status === "success" && (
        <p className="result-count">{total} cars found</p>
      )}
      {status === "error" && (
        <div className="message">
          <p>Something went wrong: {error?.message}</p>
          <button type="button" className="btn" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}
      {status === "success" && cars.length === 0 && (
        <p className="message">
          No cars match your search. Try changing the filters.
        </p>
      )}

      {cars.length > 0 && status !== "error" && (
        <div
          className={status === "loading" ? "list-wrap is-loading" : "list-wrap"}
        >
          <CarList cars={cars} onSelect={onSelectCar} />
        </div>
      )}

      {status !== "error" && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={status === "loading"}
        />
      )}
    </>
  );
}

export default CarsPage;