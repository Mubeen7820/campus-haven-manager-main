import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import ErrorBoundary from "./components/ErrorBoundary";

// Conditionally apply zoom out ONLY on non-local environments (like Vercel)
if (
  typeof window !== "undefined" &&
  !window.location.hostname.includes("localhost") &&
  !window.location.hostname.includes("127.0.0.1") &&
  !window.location.hostname.includes("192.168")
) {
  // @ts-ignore - zoom is a non-standard property but works in most modern browsers
  document.documentElement.style.zoom = "0.80";
}

createRoot(document.getElementById("root")!).render(
    <div className="w-full h-full">
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </div>
);
