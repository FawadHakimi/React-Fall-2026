import { lazy } from "react";
import { Routes, Route } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import CarsListPage from "./pages/CarsListPage";
import CarDetailPage from "./pages/CarDetailPage";
import AddCarPage from "./pages/AddCarPage";
import NotFound from "./pages/NotFound";

// These pages load only when the user opens them.
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="cars">
          <Route index element={<CarsListPage />} />
          <Route path="new" element={<AddCarPage />} />
          <Route path=":id" element={<CarDetailPage />} />
        </Route>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;