import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
    <div className="w-full h-full">
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </div>
);
