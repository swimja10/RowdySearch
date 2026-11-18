import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { CrashScreen } from "./components/StatusScreen.tsx";
import "./index.css";

// The last line of defense: anything that crashes and isn't caught closer to where it happened
// shows a message here, instead of leaving the sidebar empty.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary name="the sidebar" fallback={retry => <CrashScreen onRetry={retry} />}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
