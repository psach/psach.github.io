import { useState } from "react";
import { IOSGuide } from "./IOSGuide";
import { DownloadIcon, ShareIcon, CheckIcon } from "./icons";

/**
 * State → button config mapping.
 * Kept outside the component so it's never recreated on renders.
 */
const STATE_CONFIG = {
  idle:        { label: "Checking…",     disabled: true,  variant: "ghost"   },
  available:   { label: "Install App",   disabled: false, variant: "primary"  },
  installing:  { label: "Installing…",   disabled: true,  variant: "loading"  },
  installed:   { label: "Installed",     disabled: true,  variant: "success"  },
  ios:         { label: "Add to Home",   disabled: false, variant: "primary"  },
  unsupported: { label: "Not Supported", disabled: true,  variant: "ghost"   },
};

/**
 * InstallButton
 *
 * Self-contained install CTA. Drop it anywhere in your UI.
 * Automatically renders the IOSGuide modal when needed.
 *
 * @param {{
 *   installState: import("../../hooks/usePWAInstall").InstallState,
 *   isIos: boolean,
 *   triggerInstall: () => Promise<void>,
 *   className?: string
 * }} props
 */
export function InstallButton({ installState, isIos, triggerInstall, className = "" }) {
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const { label, disabled, variant } =
    STATE_CONFIG[installState] ?? STATE_CONFIG.idle;

  const handleClick = () => {
    if (isIos) setShowIOSGuide(true);
    else triggerInstall();
  };

  return (
    <>
      {showIOSGuide && (
        <IOSGuide onClose={() => setShowIOSGuide(false)} />
      )}

      <button
        className={`pwa-main-btn pwa-btn--${variant} ${className}`.trim()}
        onClick={handleClick}
        disabled={disabled}
        aria-label={label}
        aria-busy={variant === "loading"}
      >
        {variant === "loading" && (
          <span className="pwa-spinner" aria-hidden="true" />
        )}
        {variant === "success" && <CheckIcon />}
        {variant === "primary" && (isIos ? <ShareIcon /> : <DownloadIcon />)}

        <span>{label}</span>
      </button>
    </>
  );
}
