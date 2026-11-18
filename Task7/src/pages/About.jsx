import { Link } from "react-router";

const TECH = [
  "React and React Router",
  "Vite",
  "A simulated API (Promises, delays, localStorage)",
  "Lazy loading with React.lazy and Suspense",
];

const PAGES = [
  ["Home", "Short introduction and links."],
  ["Cars", "The fleet with search, filters, sorting and pages."],
  ["Car details", "Full information about one car."],
  ["Dashboard", "Statistics calculated from the fleet."],
  ["Login", "A placeholder for future sign in."],
];

function About() {
  return (
    <section>
      <h2 className="form-title">About this project</h2>

      <div className="about-grid">
        <div className="detail-card">
          <p className="about-text">
            Car Rental is a single page application made for the React course.
            It shows a fleet of 120 cars and lets you search, filter, sort and
            open each car. You can also add your own car.
          </p>

          <h3 className="about-heading">Built with</h3>
          <ul className="about-list">
            {TECH.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="about-action">
            <Link to="/cars" className="btn btn-primary btn-link">
              Browse cars
            </Link>
          </div>
        </div>

        <div className="detail-card">
          <h3 className="about-heading about-heading-first">Pages</h3>
          <dl className="about-pages">
            {PAGES.map(([name, text]) => (
              <div key={name} className="about-page">
                <dt>{name}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default About;