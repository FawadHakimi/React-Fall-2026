import { useInstallPrompt } from "../hooks/useInstallPrompt";

function InstallButton() {
  const { canInstall, install } = useInstallPrompt();

  if (!canInstall) {
    return null;
  }

  return (
    <button type="button" className="nav-link nav-button" onClick={install}>
      Install app
    </button>
  );
}

export default InstallButton;