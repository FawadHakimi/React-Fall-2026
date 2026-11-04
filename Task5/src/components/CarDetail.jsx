import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getCarById } from "../services/service";

function CarDetail({ carId, backTo }) {
  const [car, setCar] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getCarById(carId, controller.signal)
      .then((data) => {
        setCar(data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        if (err.code === "NOT_FOUND") {
          setStatus("notfound");
        } else {
          setError(err.message);
          setStatus("error");
        }
      });

    // If the id changes or the page closes, the old request is cancelled
    return () => controller.abort();
  }, [carId, retryCount]);

  function handleRetry() {
    setStatus("loading");
    setRetryCount(retryCount + 1);
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
          <p>Something went wrong: {error}</p>
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