const LABELS = {
  available: "Available",
  rented: "Rented",
  maintenance: "Maintenance",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>{LABELS[status] ?? status}</span>
  );
}
