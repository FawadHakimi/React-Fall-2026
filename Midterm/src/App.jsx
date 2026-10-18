import { useState } from "react";
import CarsPage from "./components/CarsPage";
import CarDetail from "./components/CarDetail";
import AddCarForm from "./components/AddCarForm";

function App() {
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [listKey, setListKey] = useState(0);
  const [notice, setNotice] = useState("");

  const onList = selectedCarId === null && !isAdding;

  function handleSelectCar(id) {
    setNotice("");
    setSelectedCarId(id);
  }

  function handleOpenForm() {
    setNotice("");
    setSelectedCarId(null);
    setIsAdding(true);
  }

  function handleGoHome() {
    setSelectedCarId(null);
    setIsAdding(false);
  }

  function handleAdded(car) {
    setIsAdding(false);
    setListKey((k) => k + 1);
    setNotice(`${car.brand} ${car.model} was added to the fleet.`);
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <button type="button" className="brand" onClick={handleGoHome}>
            Car Rental
          </button>
          {!isAdding && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenForm}
            >
              Add car
            </button>
          )}
        </div>
      </header>

      <main className="container">
        {notice && onList && <p className="notice">{notice}</p>}

        <div hidden={!onList}>
          <CarsPage key={listKey} onSelectCar={handleSelectCar} />
        </div>

        {selectedCarId !== null && (
          <CarDetail
            key={selectedCarId}
            carId={selectedCarId}
            onBack={() => setSelectedCarId(null)}
          />
        )}

        {isAdding && (
          <AddCarForm
            onCancel={() => setIsAdding(false)}
            onAdded={handleAdded}
          />
        )}
      </main>
    </>
  );
}

export default App;