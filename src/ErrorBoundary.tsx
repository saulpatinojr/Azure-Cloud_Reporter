import React from 'react';
import './styles/error-boundary.css';

interface ErrorBoundaryState { hasError: boolean; error: unknown }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('[ErrorBoundary] Caught error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          <h1 className="error-boundary-title">Something went wrong.</h1>
          <p className="error-boundary-text">
            An unexpected error occurred while rendering the application. Open the browser console to see more details.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
