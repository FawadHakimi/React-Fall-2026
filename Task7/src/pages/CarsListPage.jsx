import { Link, useNavigate, useLocation } from "react-router";
import CarsPage from "../components/CarsPage";

function CarsListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleSelect(id) {
    // Remember the list filters, so "Back" can return to them
    navigate(`/cars/${id}`, { state: { from: location.search } });
  }

  return (
    <>
      <div className="page-head">
        <h2>Cars</h2>
        <Link to="/cars/new" className="btn btn-primary btn-link">
          Add car
        </Link>
      </div>
      <CarsPage onSelectCar={handleSelect} />
    </>
  );
}

export default CarsListPage;