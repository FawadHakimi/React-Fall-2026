import { Link } from "react-router";
import { useCar } from "../hooks/useCars";

function CarDetail({ carId, backTo }) {
  const { data: car, isPending, isError, error, refetch } = useCar(carId);

  const notFound = isError && error.code === "NOT_FOUND";
  const status = notFound
    ? "notfound"
    : isError
      ? "error"
      : isPending
        ? "loading"
        : "success";

  function handleRetry() {
    refetch();
  }

  const specs = car
    ? [
        ["Car ID", `#${car.id}`],
        ["Year", car.year],
        ["Type", car.type],
        ["Transmission", car.transmission],
        ["Fuel", car.fuel],
        ["Seats", car.seats],
        ["Rating", car.rating > 0 ? `★ ${car.rating}` : "New"],
        ["Price per day", `$${car.pricePerDay}`],
        ["Price for 7 days", `$${car.pricePerDay * 7}`],
      ]
    : [];

  return (
    <section className="detail">
      <div className="detail-links">
        <Link to={backTo} className="btn btn-link">
          ← Back
        </Link>
        <Link to="/cars" className="btn btn-link">
          All cars
        </Link>
      </div>

      {status === "loading" && <p className="message">Loading car...</p>}

      {status === "error" && (
        <div className="message">
          <p>Something went wrong: {error?.message}</p>
          <button type="button" className="btn" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}

      {status === "notfound" && (
        <div className="message">
          <p>Car #{carId} was not found.</p>
          <Link to="/cars" className="btn btn-link">
            See all cars
          </Link>
        </div>
      )}

      {status === "success" && (
        <div className="detail-card">
          <div className="detail-header">
            <div>
              <h2>
                {car.brand} {car.model}
              </h2>
              <span
                className={car.available ? "status available" : "status booked"}
              >
                {car.available ? "Available" : "Booked"}
              </span>
            </div>
            <p className="car-price">
              ${car.pricePerDay}
              <span> / day</span>
            </p>
          </div>

          <p className="detail-description">{car.description}</p>

          <dl className="specs">
            {specs.map(([label, value]) => (
              <div key={label} className="spec">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

export default CarDetail;