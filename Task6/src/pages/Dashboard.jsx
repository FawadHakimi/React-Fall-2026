import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useAllCars } from "../hooks/useCars";
import StatCard from "../components/StatCard";
import BreakdownCard from "../components/BreakdownCard";

const NO_CARS = [];
const TYPES = ["All", "Sedan", "SUV", "Hatchback", "Sports", "Electric"];

// Count cars by a field. Returns [["SUV", 46], ["Sedan", 33], ...]
function countBy(cars, field) {
  const counts = {};
  cars.forEach((car) => {
    counts[car[field]] = (counts[car[field]] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function Dashboard() {
  const [type, setType] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);

  // Load every car (cached)
  const { data, isPending, isError, error: loadError, refetch } = useAllCars();
  const allCars = data ?? NO_CARS;
  const status = isError ? "error" : isPending ? "loading" : "success";
  const error = loadError?.message;

  // The interactive filter: it changes every number on the page
  const cars = useMemo(
    () =>
      allCars.filter(
        (car) =>
          (type === "All" || car.type === type) &&
          (!availableOnly || car.available),
      ),
    [allCars, type, availableOnly],
  );

  // Statistics are calculated from the filtered cars
  const stats = useMemo(() => {
    const total = cars.length;
    const availableCars = cars.filter((car) => car.available);
    const ratedCars = cars.filter((car) => car.rating > 0);

    const priceSum = cars.reduce((sum, car) => sum + car.pricePerDay, 0);
    const ratingSum = ratedCars.reduce((sum, car) => sum + car.rating, 0);

    return {
      total,
      available: availableCars.length,
      availablePercent: total ? Math.round((availableCars.length / total) * 100) : 0,
      avgPrice: total ? Math.round(priceSum / total) : 0,
      avgRating: ratedCars.length ? (ratingSum / ratedCars.length).toFixed(1) : "–",
      topRated: ratedCars.reduce(
        (best, car) => (!best || car.rating > best.rating ? car : best),
        null,
      ),
      cheapest: availableCars.reduce(
        (best, car) => (!best || car.pricePerDay < best.pricePerDay ? car : best),
        null,
      ),
      priciest: cars.reduce(
        (best, car) => (!best || car.pricePerDay > best.pricePerDay ? car : best),
        null,
      ),
    };
  }, [cars]);

  const highlights = [
    ["Top rated", stats.topRated, stats.topRated && `★ ${stats.topRated.rating}`],
    ["Cheapest available", stats.cheapest, stats.cheapest && `$${stats.cheapest.pricePerDay} / day`],
    ["Most expensive", stats.priciest, stats.priciest && `$${stats.priciest.pricePerDay} / day`],
  ].filter(([, car]) => car);

  function handleRetry() {
    refetch();
  }

  function handleReset() {
    setType("All");
    setAvailableOnly(false);
  }

  return (
    <>
      <div className="page-head">
        <h2>Dashboard</h2>
        <Link to="/cars" className="btn btn-link">
          View all cars
        </Link>
      </div>

      <div className="filters">
        <label className="filter-label">
          Car type
          <select
            className="field"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="check-label">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available only
        </label>

        <button type="button" className="btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      {status === "loading" && <p className="message">Loading statistics...</p>}

      {status === "error" && (
        <div className="message">
          <p>Something went wrong: {error}</p>
          <button type="button" className="btn" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}

      {status === "success" && cars.length === 0 && (
        <p className="message">No cars match this filter.</p>
      )}

      {status === "success" && cars.length > 0 && (
        <>
          <div className="stats-grid">
            <StatCard label="Cars" value={stats.total} hint="in this selection" />
            <StatCard
              label="Available"
              value={stats.available}
              hint={`${stats.availablePercent}% of the cars`}
            />
            <StatCard label="Average price" value={`$${stats.avgPrice}`} hint="per day" />
            <StatCard label="Average rating" value={stats.avgRating} hint="rated cars only" />
          </div>

          <div className="dash-grid">
            <BreakdownCard
              title="Cars by type"
              rows={countBy(cars, "type")}
              total={cars.length}
              linkFor={(label) => `/cars?type=${label}`}
            />
            <BreakdownCard
              title="Cars by fuel"
              rows={countBy(cars, "fuel")}
              total={cars.length}
            />
            <BreakdownCard
              title="Cars by transmission"
              rows={countBy(cars, "transmission")}
              total={cars.length}
              linkFor={(label) => `/cars?transmission=${label}`}
            />

            <section className="detail-card">
              <h3 className="about-heading about-heading-first">Highlights</h3>
              <ul className="highlight-list">
                {highlights.map(([label, car, value]) => (
                  <li key={label} className="highlight">
                    <span className="highlight-label">{label}</span>
                    <Link to={`/cars/${car.id}`}>
                      {car.brand} {car.model}
                    </Link>
                    <span className="highlight-value">{value}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;