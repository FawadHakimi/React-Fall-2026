import { useParams, useLocation } from "react-router";
import CarDetail from "../components/CarDetail";

function CarDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const from = location.state?.from || "";

  return <CarDetail key={id} carId={id} backTo={`/cars${from}`} />;
}

export default CarDetailPage;