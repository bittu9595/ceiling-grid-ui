import { Component, type ReactNode, type ErrorInfo } from "react";
import { useRouteError } from "react-router-dom";
import { Button } from "../Button/Button";
import "./ErrorBoundary.scss";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/*
 * Catches rendering errors in child components.
 * Falls back to a safe UI and exposes retry behavior.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <Button onClick={this.handleRetry}>Try again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/*
 * Renders the route-level fallback error view.
 * Displays the router failure message and offers a page reload action.
 */
export function RouteError() {
  const error = useRouteError() as Error;
  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <p>{error?.message || "An unexpected error occurred"}</p>
      <Button onClick={() => window.location.reload()}>Reload Page</Button>
    </div>
  );
}
