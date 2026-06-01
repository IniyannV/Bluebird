import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-4 text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h1 className="mb-2 text-xl font-bold text-app-text">Something went wrong</h1>
          <p className="mb-6 text-sm text-app-muted">
            There was an unexpected error. Your data is safe. Try refreshing the page.
          </p>
          <button
            className="rounded-md border border-app-border bg-app-surface px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
