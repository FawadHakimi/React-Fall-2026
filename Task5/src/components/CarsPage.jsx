import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { getCars } from "../services/service";
import CarList from "./CarList";
import Filters from "./Filters";
import Pagination from "./Pagination";

const PAGE_SIZE = 12;

function CarsPage({ onSelectCar }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState({
    key: "",
    cars: [],
    total: 0,
    error: "",
  });

  // 1. Read the values from the URL
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "All";
  const transmission = searchParams.get("transmission") || "All";
  const availableOnly = searchParams.get("available") === "true";
  const sortBy = searchParams.get("sort") || "default";
  const page = Math.max(1, Math.floor(Number(searchParams.get("page"))) || 1);

  const filters = { search, type, transmission, availableOnly, sortBy };

  // 2. One text that describes the current request
  const requestKey = JSON.stringify([
    search,
    type,
    transmission,
    availableOnly,
    sortBy,
    page,
    retryCount,
  ]);

  // 3. Load the cars whenever the URL values change
  useEffect(() => {
    const controller = new AbortController();

    getCars({
      search,
      type,
      transmission,
      availableOnly,
      sortBy,
      page,
      pageSize: PAGE_SIZE,
      signal: controller.signal,
    })
      .then((data) => {
        setResult({
          key: requestKey,
          cars: data.items,
          total: data.total,
          error: "",
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setResult((prev) => ({ ...prev, key: requestKey, error: err.message }));
      });

    return () => controller.abort();
  }, [search, type, transmission, availableOnly, sortBy, page, retryCount, requestKey]);

  // 4. The status is calculated, not stored
  const isLoading = result.key !== requestKey;
  const status = isLoading ? "loading" : result.error ? "error" : "success";
  const { cars, total, error } = result;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // 5. Handlers write to the URL
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
    setRetryCount(retryCount + 1);
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
          <p>Something went wrong: {error}</p>
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