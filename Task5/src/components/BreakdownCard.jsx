import { Link } from "react-router";

// rows looks like: [["SUV", 46], ["Sedan", 33], ...]
function BreakdownCard({ title, rows, total, linkFor }) {
  return (
    <section className="detail-card">
      <h3 className="about-heading about-heading-first">{title}</h3>

      <ul className="bar-list">
        {rows.map(([label, count]) => {
          const percent = Math.round((count / total) * 100);

          const content = (
            <>
              <span className="bar-label">{label}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${percent}%` }} />
              </span>
              <span className="bar-value">
                {count} · {percent}%
              </span>
            </>
          );

          return (
            <li key={label}>
              {linkFor ? (
                <Link to={linkFor(label)} className="bar-row">
                  {content}
                </Link>
              ) : (
                <div className="bar-row">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default BreakdownCard;