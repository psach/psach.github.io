import { useState, useEffect, useCallback } from "react";

/**
 * Detect iOS (iPhone / iPad / iPod) — excludes Windows Phone.
 * Must run in browser; guard with typeof window check in SSR environments.
 */
function detectIOS() {
  return (
    typeof window !== "undefined" &&
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
    !("MSStream" in window)
  );
}

/**
 * True when the app is already running as an installed PWA (standalone mode)
 * or via iOS's navigator.standalone flag.
 */
function detectStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari-specific standalone flag
    /** @type {any} */ (window.navigator).standalone === true
  );
}

/**
 * @typedef {"idle" | "available" | "installing" | "installed" | "ios" | "unsupported"} InstallState
 *
 * idle        — waiting; beforeinstallprompt hasn't fired yet
 * available   — Chrome/Edge prompt is ready; safe to call triggerInstall()
 * installing  — native dialog is open; waiting for user choice
 * installed   — app is installed (accepted or already in standalone mode)
 * ios         — Safari on iOS; no programmatic prompt, show manual guide
 * unsupported — browser never fires beforeinstallprompt and is not iOS
 */

/**
 * usePWAInstall
 *
 * Returns the current install state and a function to trigger the native
 * install prompt (Chrome/Edge) or signal iOS guide display.
 *
 * @returns {{
 *   installState: InstallState,
 *   isIos: boolean,
 *   triggerInstall: () => Promise<void>
 * }}
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(
    /** @type {BeforeInstallPromptEvent | null} */ (null)
  );
  const [installState, setInstallState] = useState(
    /** @type {InstallState} */ ("idle")
  );
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // ── Already installed ──────────────────────────────────────────
    if (detectStandalone()) {
      setInstallState("installed");
      return;
    }

    // ── iOS Safari — no beforeinstallprompt; manual guide only ────
    if (detectIOS()) {
      setIsIos(true);
      setInstallState("ios");
      return;
    }

    // ── Chrome / Edge — intercept the native prompt ───────────────
    const onBeforeInstall = (/** @type {any} */ e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallState("available");
    };

    const onAppInstalled = () => {
      setInstallState("installed");
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    // ── Cleanup: remove BOTH listeners ────────────────────────────
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  /**
   * Trigger the native install dialog.
   * Only works in browsers that have fired beforeinstallprompt (Chrome/Edge).
   * Safe to call on iOS — returns early (consumer should show IOSGuide instead).
   */
  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    setInstallState("installing");
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    // Reset prompt regardless of outcome — it can only be used once.
    setDeferredPrompt(null);
    setInstallState(outcome === "accepted" ? "installed" : "available");
  }, [deferredPrompt]);

  return { installState, isIos, triggerInstall };
}
