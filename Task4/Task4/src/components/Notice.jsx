export default function Notice({ type, children, onClose }) {
  return (
    <div className={`notice notice-${type}`} role={type === "error" ? "alert" : "status"}>
      <span>{children}</span>
      {onClose && (
        <button type="button" className="link-button" onClick={onClose}>
          Dismiss
        </button>
      )}
    </div>
  );
}
