import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Worker Ledger crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6">
          <div className="text-center max-w-sm">
            <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-500" size={26} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Something went wrong</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              An unexpected error occurred. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
