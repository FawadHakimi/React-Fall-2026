import CarCard from "./CarCard.jsx";
import Notice from "./Notice.jsx";

// Shows exactly one of: loading, error, empty, success.
export default function CarList({ cars, status, error, search, selectedId, onSelect, onRetry }) {
  if (status === "loading") {
    return <p className="state-box">Loading cars…</p>;
  }

  if (status === "error") {
    return (
      <div className="state-box">
        <Notice type="error">Could not load cars: {error}</Notice>
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <p className="state-box">
        {search
          ? `No cars match “${search}”.`
          : "The fleet is empty. Add your first car!"}
      </p>
    );
  }

  return (
    <ul className="car-list">
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          selected={car.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
