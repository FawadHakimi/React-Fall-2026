import { Component } from "react";

// If a page crashes (for example a page file could not be loaded),
// we show a message instead of a white screen.
// Error boundaries must be class components: React has no hook for this.
class RouteErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="message">
          <p>This page could not be loaded. Check your connection and try again.</p>
          <button type="button" className="btn" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;