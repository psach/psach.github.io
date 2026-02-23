import { useState } from "react";
import { IOSGuide } from "./IOSGuide";
import { DownloadIcon, ShareIcon, XIcon } from "./icons";

/**
 * InstallBanner
 *
 * Fixed bottom-center toast that appears when the PWA is installable.
 * Handles both Chrome/Edge (native prompt) and iOS Safari (guide modal).
 * Dismissable; hides itself when already installed.
 *
 * @param {{
 *   installState: import("../../hooks/usePWAInstall").InstallState,
 *   isIos: boolean,
 *   triggerInstall: () => Promise<void>
 * }} props
 */
export function InstallBanner({ installState, isIos, triggerInstall }) {
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const isVisible =
    !dismissed &&
    (installState === "available" || installState === "ios");

  if (!isVisible) return null;

  return (
    <>
      {showIOSGuide && (
        <IOSGuide onClose={() => setShowIOSGuide(false)} />
      )}

      {/* 
        ── Animation note ──────────────────────────────────────────────
        The banner is centered with `left: 50%; transform: translateX(-50%)`.
        We animate via `bottom` (from -80px → 24px) so the translateX is
        never touched by the keyframe — avoids the position flash.
      */}
      <div className="pwa-banner" role="status" aria-live="polite">
        {/* Top-edge gradient accent */}
        <div className="pwa-banner-glow" aria-hidden="true" />

        <div className="pwa-banner-content">
          <div className="pwa-app-icon" aria-hidden="true">
            <span>⚡</span>
          </div>

          <div className="pwa-banner-text">
            <div className="pwa-banner-title">Install App</div>
            <div className="pwa-banner-sub">
              {isIos
                ? "Add to your Home Screen"
                : "Fast, offline-ready — no App Store needed"}
            </div>
          </div>

          <div className="pwa-banner-actions">
            <button
              className="pwa-install-btn"
              onClick={isIos ? () => setShowIOSGuide(true) : triggerInstall}
              aria-label={isIos ? "Show iOS install guide" : "Install app"}
            >
              {isIos ? <ShareIcon /> : <DownloadIcon />}
              <span>{isIos ? "How to" : "Install"}</span>
            </button>

            <button
              className="pwa-dismiss-btn"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss install prompt"
            >
              <XIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
