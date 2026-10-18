import { useState, useEffect } from "react";
import { getCarById } from "../api/carsApi";

function CarDetail({ carId, onBack }) {
  const [car, setCar] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    getCarById(carId, controller.signal)
      .then((data) => {
        setCar(data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [carId]);

  const specs = car
    ? [
        ["Year", car.year],
        ["Type", car.type],
        ["Transmission", car.transmission],
        ["Fuel", car.fuel],
        ["Seats", car.seats],
        ["Rating", car.rating > 0 ? `★ ${car.rating}` : "New"],
      ]
    : [];

  return (
    <section className="detail">
      <button type="button" className="btn" onClick={onBack}>
        ← Back to cars
      </button>

      {status === "loading" && <p className="message">Loading car...</p>}
      {status === "error" && (
        <p className="message">Something went wrong: {error}</p>
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