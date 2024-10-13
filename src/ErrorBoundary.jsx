import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Define a state variable to track whether an error has occurred
    this.state = { hasError: false };
  }

  // This method is called if any error occurs in a child component
  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  // Optional: Log the error information for further debugging (e.g., send to a server)
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  // Render the fallback UI if an error occurs
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    // Otherwise, render the children components as usual
    return this.props.children;
  }
}

export default ErrorBoundary;
