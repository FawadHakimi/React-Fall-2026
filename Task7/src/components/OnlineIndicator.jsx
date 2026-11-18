import { useOnlineStatus } from "../hooks/useOnlineStatus";

function OnlineIndicator() {
  const online = useOnlineStatus();

  return (
    <span
      className={online ? "online-indicator is-online" : "online-indicator is-offline"}
      role="status"
    >
      <span className="online-dot" aria-hidden="true" />
      {online ? "Online" : "Offline"}
    </span>
  );
}

export default OnlineIndicator;