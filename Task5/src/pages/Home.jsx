import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getCars } from "../services/service";
import CarList from "../components/CarList";

const STEPS = [
  ["Browse", "Search the fleet and filter by type, transmission or price."],
  ["Choose", "Open a car to see its full details and price per day."],
  ["Drive", "Pick an available car and enjoy your trip."],
];

function CarIllustration() {
  return (
    <svg
      viewBox="0 0 400 200"
      role="img"
      aria-label="Illustration of a car"
      className="hero-image"
    >
      <ellipse cx="200" cy="168" rx="170" ry="10" fill="#e5e7eb" />
      <path
        d="M40 140 L40 110 Q40 98 54 95 L110 84 L145 52 Q150 47 158 47 L250 47 Q258 47 264 52 L300 84 L350 94 Q362 97 362 110 L362 140 Z"
        fill="#106090"
      />
      <path d="M130 84 L156 58 L205 58 L205 84 Z" fill="#ffffff" opacity="0.85" />
      <path d="M215 84 L215 58 L250 58 L282 84 Z" fill="#ffffff" opacity="0.85" />
      <rect x="40" y="128" width="322" height="12" fill="#0d4d73" />
      <circle cx="105" cy="142" r="26" fill="#16181d" />
      <circle cx="105" cy="142" r="11" fill="#e5e7eb" />
      <circle cx="300" cy="142" r="26" fill="#16181d" />
      <circle cx="300" cy="142" r="11" fill="#e5e7eb" />
    </svg>
  );
}

function TopRatedCars() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getCars({
      sortBy: "rating-desc",
      availableOnly: true,
      pageSize: 4,
      signal: controller.signal,
    })
      .then((data) => {
        setCars(data.items);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [retryCount]);

  function handleRetry() {
    setStatus("loading");
    setRetryCount(retryCount + 1);
  }

  return (
    <section className="home-section">
      <div className="section-head">
        <h2>Top rated cars</h2>
        <Link to="/cars?sort=rating-desc" className="btn btn-link">
          See all
        </Link>
      </div>

      {status === "loading" && <p className="message">Loading cars...</p>}
      {status === "error" && (
        <div className="message">
          <p>Could not load the cars.</p>
          <button type="button" className="btn" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}
      {status === "success" && cars.length === 0 && (
        <p className="message">No cars available right now.</p>
      )}
      {status === "success" && cars.length > 0 && (
        <CarList cars={cars} onSelect={(id) => navigate(`/cars/${id}`)} />
      )}
    </section>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>Find the right car for your trip</h1>
          <p>
            Browse our fleet, search and filter by type or transmission, and
            see the price per day before you decide.
          </p>
          <div className="hero-actions">
            <Link to="/cars" className="btn btn-primary btn-link">
              Browse cars
            </Link>
            <Link to="/dashboard" className="btn btn-link">
              View dashboard
            </Link>
          </div>
        </div>
        <CarIllustration />
      </section>

      <section className="home-links">
        <Link to="/cars" className="home-link">
          <h3>Cars</h3>
          <p>Search, filter, sort and open any car.</p>
        </Link>
        <Link to="/dashboard" className="home-link">
          <h3>Dashboard</h3>
          <p>Fleet statistics and breakdowns.</p>
        </Link>
        <Link to="/cars/new" className="home-link">
          <h3>Add a car</h3>
          <p>Add a new car to the fleet.</p>
        </Link>
      </section>

      <TopRatedCars />

      <section className="home-section">
        <div className="section-head">
          <h2>How it works</h2>
        </div>
        <div className="steps">
          {STEPS.map(([title, text], index) => (
            <div key={title} className="step">
              <span className="step-number">{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Ready to pick your car?</h2>
        <p>Over 100 cars are waiting for you.</p>
        <Link to="/cars" className="btn btn-link">
          Browse cars
        </Link>
      </section>
    </>
  );
}

export default Home;