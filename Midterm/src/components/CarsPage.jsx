import { useState, useEffect } from "react";
import { getCars } from "../api/carsApi";
import CarList from "./CarList";
import Filters from "./Filters";
import Pagination from "./Pagination";

const PAGE_SIZE = 12;

const defaultFilters = {
  search: "",
  type: "All",
  transmission: "All",
  availableOnly: false,
  sortBy: "default",
};

function CarsPage({ onSelectCar }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getCars({
      ...filters,
      page,
      pageSize: PAGE_SIZE,
      signal: controller.signal,
    })
      .then((data) => {
        setCars(data.items);
        setTotal(data.total);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [filters, page, retryCount]);

   function handleFiltersChange(newFilters) {
    setFilters(newFilters);
    setPage(1);
    setStatus("loading");
  }

  function handlePageChange(newPage) {
    setPage(newPage);
    setStatus("loading");
  }

  function handleRetry() {
    setRetryCount(retryCount + 1);
    setStatus("loading");
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <Filters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={() => handleFiltersChange(defaultFilters)}
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