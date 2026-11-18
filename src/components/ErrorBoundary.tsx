import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  // What crashed, for the console: "Analytical Mode", "the Median Grade section"...
  name: string;
  // What to show instead. `retry` draws the children again.
  fallback: (retry: () => void) => ReactNode;
  // Changing this (like going to another page) draws the children again too.
  resetKey?: unknown;
  children: ReactNode;
};

type ErrorBoundaryState = {
  failed: boolean;
  resetKey: unknown;
};

// When something inside crashes while drawing, React removes everything it drew, which left the
// sidebar empty and see-through until the page was refreshed. This catches the crash, so only the
// part that broke is replaced, with a message and a way to try again.
// (React can only do this with a class component.)
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false, resetKey: this.props.resetKey };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState) {
    return props.resetKey === state.resetKey ? null : { failed: false, resetKey: props.resetKey };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error(`RowdySearch: ${this.props.name} crashed.`, error, info.componentStack);
  }

  retry = () => this.setState({ failed: false });

  render() {
    return this.state.failed ? this.props.fallback(this.retry) : this.props.children;
  }
}
