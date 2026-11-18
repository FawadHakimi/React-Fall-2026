import { useNavigate } from "react-router";
import AddCarForm from "../components/AddCarForm";

function AddCarPage() {
  const navigate = useNavigate();
  return (
    <AddCarForm
      onCancel={() => navigate("/cars")}
      onAdded={() => navigate("/cars")}
    />
  );
}

export default AddCarPage;