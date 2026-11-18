function CarCard({ car, onSelect }) {
  return (
    <article className="car-card">
      <div className="car-top">
        <span className="car-type">{car.type}</span>
        <span className={car.available ? "status available" : "status booked"}>
          {car.available ? "Available" : "Booked"}
        </span>
      </div>

      <h3 className="car-title">
        <button
          type="button"
          className="card-link"
          onClick={() => onSelect(car.id)}
        >
          {car.brand} {car.model}
        </button>
      </h3>
      <p className="car-meta">
        {car.year} · {car.transmission} · {car.fuel}
      </p>

      <div className="car-footer">
        <p className="car-price">
          ${car.pricePerDay}
          <span> / day</span>
        </p>
        <span 
        className="car-rating"> {car.rating > 0 ? `★ ${car.rating}` : "New"} 
        </span>
      </div>
    </article>
  );
}

export default CarCard;