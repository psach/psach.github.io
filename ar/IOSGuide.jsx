import { useEffect } from "react";
import { ShareIcon, CheckIcon, XIcon } from "./icons";

/**
 * IOSGuide
 *
 * Bottom-sheet modal that walks iOS Safari users through the manual
 * "Add to Home Screen" flow. Traps focus and closes on Escape.
 *
 * @param {{ onClose: () => void }} props
 */
export function IOSGuide({ onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (/** @type {KeyboardEvent} */ e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const STEPS = [
    {
      icon: <ShareIcon />,
      label: 'Tap the Share button',
      sub: "Bottom center of Safari's toolbar",
    },
    {
      icon: <span style={{ fontSize: 18, lineHeight: 1 }}>⊕</span>,
      label: 'Tap "Add to Home Screen"',
      sub: "Scroll down in the share sheet",
    },
    {
      icon: <CheckIcon />,
      label: 'Tap "Add" to confirm',
      sub: "Top-right corner of the dialog",
    },
  ];

  return (
    <div
      className="pwa-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-guide-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pwa-modal">
        <button
          className="pwa-close-btn"
          onClick={onClose}
          aria-label="Close installation guide"
        >
          <XIcon />
        </button>

        <p className="pwa-modal-eyebrow">iOS Installation</p>
        <h2 id="ios-guide-title" className="pwa-modal-title">
          Add to Home Screen
        </h2>
        <p className="pwa-modal-sub">Follow these steps in Safari</p>

        <div className="pwa-steps">
          {STEPS.map((step, i) => (
            <div key={i} className="pwa-step">
              <div className="pwa-step-num" aria-hidden="true">
                {i + 1}
              </div>
              <div className="pwa-step-icon" aria-hidden="true">
                {step.icon}
              </div>
              <div>
                <div className="pwa-step-label">{step.label}</div>
                <div className="pwa-step-sub">{step.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="pwa-ios-tip" role="note">
          <span aria-hidden="true">💡 </span>
          This only works in <strong>Safari</strong>. Other browsers on iOS
          don't support PWA installation.
        </div>
      </div>
    </div>
  );
}
