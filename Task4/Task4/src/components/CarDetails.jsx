import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import Notice from "./Notice.jsx";

function Field({ label, children }) {
  return (
    <div className="field">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

// Which status actions are offered for each current status.
const ACTIONS = {
  available: [
    { next: "rented", label: "Rent out" },
    { next: "maintenance", label: "Send to maintenance", secondary: true },
  ],
  rented: [{ next: "available", label: "Mark as returned" }],
  maintenance: [{ next: "available", label: "Back to fleet" }],
};

export default function CarDetails({
  car,
  status,
  error,
  busy,
  onRetry,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const [confirming, setConfirming] = useState(false);

  if (status === "loading") {
    return <p className="state-box">Loading car details…</p>;
  }

  if (status === "error") {
    return (
      <div className="state-box">
        <Notice type="error">Could not load details: {error}</Notice>
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  return (
    <article className="details">
      <header className="details-header">
        <div>
          <h2>{car.name}</h2>
          <p className="muted">{car.description}</p>
        </div>
        <StatusBadge status={car.status} />
      </header>

      <dl className="fields">
        <Field label="Brand">{car.brand}</Field>
        <Field label="Year">{car.year}</Field>
        <Field label="Price per day">${car.pricePerDay}</Field>
        <Field label="Transmission">{car.transmission}</Field>
        <Field label="Fuel">{car.fuel}</Field>
        <Field label="Seats">{car.seats}</Field>
        <Field label="Color">{car.color}</Field>
        <Field label="Mileage">{Number(car.mileage).toLocaleString("en-US")} km</Field>
        <Field label="Location">{car.location}</Field>
        <Field label="Plate">{car.plate}</Field>
      </dl>

      <div className="actions">
        {ACTIONS[car.status]?.map((action) => (
          <button
            key={action.next}
            type="button"
            className={action.secondary ? "secondary" : ""}
            disabled={Boolean(busy)}
            onClick={() => onStatusChange(car, action.next)}
          >
            {action.label}
          </button>
        ))}
        <button
          type="button"
          className="secondary"
          disabled={Boolean(busy)}
          onClick={onEdit}
        >
          Edit
        </button>
        {confirming ? (
          <>
            <button
              type="button"
              className="danger"
              disabled={Boolean(busy)}
              onClick={() => onDelete(car)}
            >
              Yes, delete
            </button>
            <button type="button" className="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="danger-outline"
            disabled={Boolean(busy)}
            onClick={() => setConfirming(true)}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
