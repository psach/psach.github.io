import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./pwa.css";
import App from "./App.jsx";

// ── Service Worker registration ─────────────────────────────────────────
// Run after the page loads so it doesn't block first paint.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        console.log("[SW] Registered, scope:", reg.scope);

        // Optional: prompt the user to refresh when a new SW version is waiting.
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // A new version is available. Your app can show a "Refresh to update" toast here.
              console.log("[SW] New version available — refresh to update.");
            }
          });
        });
      })
      .catch((err) => console.error("[SW] Registration failed:", err));
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
