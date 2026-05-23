import React from "react";

type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--vc-paper)]">
          <div className="max-w-md text-center premium-card p-8">
            <p className="vc-section-label mb-3">Something went wrong</p>
            <p className="text-sm text-muted mb-6">
              Refresh the page. If the problem continues, check the dev server and API.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload site
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
