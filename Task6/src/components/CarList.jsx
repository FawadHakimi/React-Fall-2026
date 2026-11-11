import CarCard from "./CarCard";

function CarList({ cars, onSelect }) {
  return (
    <div className="car-grid">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default CarList;