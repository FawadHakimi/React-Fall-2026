import StatusBadge from "./StatusBadge.jsx";

export default function CarCard({ car, selected, onSelect }) {
  return (
    <li>
      <button
        type="button"
        className={`car-card ${selected ? "selected" : ""}`}
        onClick={() => onSelect(car.id)}
      >
        <span className="car-card-main">
          <strong>{car.name}</strong>
          <small>
            {car.year} · ${car.pricePerDay}/day
          </small>
        </span>
        <StatusBadge status={car.status} />
      </button>
    </li>
  );
}
