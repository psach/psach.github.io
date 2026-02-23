import { useState, useEffect, useCallback } from "react";

// ─── Detect iOS ────────────────────────────────────────────────────
const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !window.MSStream;

const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

// ─── usePWAInstall Hook ─────────────────────────────────────────────
function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installState, setInstallState] = useState("idle"); // idle | available | installing | installed | ios | unsupported
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Already installed
    if (isInStandaloneMode()) {
      setInstallState("installed");
      return;
    }

    // iOS — no beforeinstallprompt, show manual guide
    if (isIOS()) {
      setIsIos(true);
      setInstallState("ios");
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallState("available");
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setInstallState("installed");
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    setInstallState("installing");
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setInstallState(outcome === "accepted" ? "installed" : "available");
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  return { installState, isIos, triggerInstall };
}

// ─── Icons ──────────────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── iOS Guide Modal ─────────────────────────────────────────────────
function IOSGuide({ onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}><XIcon /></button>
        <p style={styles.modalEyebrow}>iOS Installation</p>
        <h2 style={styles.modalTitle}>Add to Home Screen</h2>
        <p style={styles.modalSub}>Follow these steps in Safari</p>

        <div style={styles.steps}>
          {[
            { icon: <ShareIcon />, label: "Tap the Share button", sub: "Bottom center of Safari" },
            { icon: <span style={{ fontSize: 18 }}>⊕</span>, label: "Scroll & tap "Add to Home Screen"", sub: "In the share sheet menu" },
            { icon: <CheckIcon />, label: "Tap "Add" to confirm", sub: "Top right corner" },
          ].map((step, i) => (
            <div key={i} style={styles.step}>
              <div style={styles.stepNum}>{i + 1}</div>
              <div style={styles.stepIcon}>{step.icon}</div>
              <div>
                <div style={styles.stepLabel}>{step.label}</div>
                <div style={styles.stepSub}>{step.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.iosTip}>
          <span style={{ marginRight: 6 }}>💡</span>
          This only works in <strong>Safari</strong>. Other browsers on iOS don't support PWA install.
        </div>
      </div>
    </div>
  );
}

// ─── Install Banner ──────────────────────────────────────────────────
function InstallBanner({ installState, isIos, triggerInstall }) {
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (dismissed || installState === "installed") return null;
  if (installState !== "available" && installState !== "ios") return null;

  return (
    <>
      {showIOSGuide && <IOSGuide onClose={() => setShowIOSGuide(false)} />}

      <div style={styles.banner}>
        <div style={styles.bannerGlow} />
        <div style={styles.bannerContent}>
          <div style={styles.appIcon}>
            <span style={{ fontSize: 22 }}>⚡</span>
          </div>
          <div style={styles.bannerText}>
            <div style={styles.bannerTitle}>Install App</div>
            <div style={styles.bannerSub}>
              {isIos ? "Add to your Home Screen" : "Fast, offline-ready, no App Store"}
            </div>
          </div>
          <div style={styles.bannerActions}>
            <button
              style={styles.installBtn}
              onClick={isIos ? () => setShowIOSGuide(true) : triggerInstall}
            >
              {isIos ? <><ShareIcon /><span>How to</span></> : <><DownloadIcon /><span>Install</span></>}
            </button>
            <button style={styles.dismissBtn} onClick={() => setDismissed(true)}>
              <XIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Install Button (standalone / inline use) ──────────────────────
function InstallButton({ installState, isIos, triggerInstall }) {
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const map = {
    idle:       { label: "Checking…",    disabled: true,  variant: "ghost" },
    available:  { label: "Install App",  disabled: false, variant: "primary" },
    installing: { label: "Installing…",  disabled: true,  variant: "loading" },
    installed:  { label: "Installed ✓",  disabled: true,  variant: "success" },
    ios:        { label: "Add to Home",  disabled: false, variant: "primary" },
    unsupported:{ label: "Not Supported",disabled: true,  variant: "ghost" },
  };

  const { label, disabled, variant } = map[installState] || map.idle;

  const handleClick = () => {
    if (isIos) setShowIOSGuide(true);
    else triggerInstall();
  };

  return (
    <>
      {showIOSGuide && <IOSGuide onClose={() => setShowIOSGuide(false)} />}
      <button
        style={{ ...styles.mainBtn, ...styles[`btn_${variant}`] }}
        onClick={handleClick}
        disabled={disabled}
      >
        {variant === "loading" ? (
          <span style={styles.spinner} />
        ) : variant === "success" ? (
          <CheckIcon />
        ) : isIos ? (
          <ShareIcon />
        ) : (
          <DownloadIcon />
        )}
        <span>{label}</span>
      </button>
    </>
  );
}

// ─── Demo Page ───────────────────────────────────────────────────────
export default function PWAInstallDemo() {
  const { installState, isIos, triggerInstall } = usePWAInstall();

  return (
    <div style={styles.page}>
      {/* Ambient background */}
      <div style={styles.bgGrid} />
      <div style={styles.bgBlob1} />
      <div style={styles.bgBlob2} />

      {/* Banner */}
      <InstallBanner installState={installState} isIos={isIos} triggerInstall={triggerInstall} />

      {/* Hero */}
      <main style={styles.main}>
        <div style={styles.badge}>Progressive Web App</div>
        <h1 style={styles.hero}>
          Install once.<br />
          <span style={styles.heroAccent}>Works anywhere.</span>
        </h1>
        <p style={styles.heroSub}>
          No app store. No update prompts. Full offline support.<br />
          Just tap install and you're done.
        </p>

        <InstallButton installState={installState} isIos={isIos} triggerInstall={triggerInstall} />

        <div style={styles.statusPill}>
          State: <code style={styles.code}>{installState}</code>
          {isIos && <span style={styles.iosBadge}>iOS</span>}
        </div>

        {/* Features */}
        <div style={styles.features}>
          {[
            ["⚡", "Instant Load",     "Cached with Service Worker"],
            ["📶", "Works Offline",    "Full offline functionality"],
            ["🔔", "Push Notifs",      "Native notification support"],
            ["🖥️", "Any Device",       "Phone, tablet, desktop"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={styles.feature}>
              <span style={styles.featureIcon}>{icon}</span>
              <div style={styles.featureTitle}>{title}</div>
              <div style={styles.featureDesc}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Code Snippet */}
        <div style={styles.codeBlock}>
          <div style={styles.codeHeader}>
            <span style={styles.codeDot} />
            <span style={styles.codeDot} />
            <span style={styles.codeDot} />
            <span style={styles.codeFilename}>usePWAInstall.js</span>
          </div>
          <pre style={styles.codePre}>{`// 1. Register Service Worker in index.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// 2. Add manifest link in <head>
// <link rel="manifest" href="/manifest.json" />

// 3. Use the hook anywhere
const { installState, triggerInstall } = usePWAInstall();`}</pre>
        </div>
      </main>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#080c14",
    color: "#e8ecf4",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgGrid: {
    position: "fixed", inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  bgBlob1: {
    position: "fixed", top: "-20%", right: "-10%",
    width: 600, height: 600, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,70,229,.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgBlob2: {
    position: "fixed", bottom: "-20%", left: "-10%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },

  // Banner
  banner: {
    position: "fixed", bottom: 24, left: "50%",
    transform: "translateX(-50%)",
    width: "min(520px, calc(100% - 32px))",
    background: "rgba(15,20,35,.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 1000,
    boxShadow: "0 24px 64px rgba(0,0,0,.6)",
    animation: "slideUp .4s cubic-bezier(.16,1,.3,1)",
  },
  bannerGlow: {
    position: "absolute", top: 0, left: 0, right: 0, height: 1,
    background: "linear-gradient(90deg, transparent, rgba(99,102,241,.8), transparent)",
  },
  bannerContent: {
    display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
  },
  appIcon: {
    width: 48, height: 48, borderRadius: 12,
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 8px 24px rgba(79,70,229,.4)",
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontWeight: 600, fontSize: 15, color: "#fff" },
  bannerSub: { fontSize: 12, color: "#8892a4", marginTop: 2 },
  bannerActions: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  installBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    border: "none", borderRadius: 10,
    color: "#fff", fontWeight: 600, fontSize: 13,
    padding: "8px 14px", cursor: "pointer",
    boxShadow: "0 4px 16px rgba(79,70,229,.4)",
    transition: "all .2s",
  },
  dismissBtn: {
    background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 8, color: "#8892a4", padding: 6, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all .2s",
  },

  // Main
  main: {
    maxWidth: 680, margin: "0 auto",
    padding: "100px 24px 80px",
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", position: "relative", zIndex: 1,
  },
  badge: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase",
    background: "rgba(79,70,229,.15)",
    border: "1px solid rgba(79,70,229,.4)",
    color: "#818cf8", padding: "5px 12px", borderRadius: 20,
    marginBottom: 28,
  },
  hero: {
    fontSize: "clamp(40px, 7vw, 68px)",
    fontWeight: 800, lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: "#f0f4ff", margin: "0 0 20px",
    fontFamily: "'DM Serif Display', Georgia, serif",
  },
  heroAccent: {
    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: 17, color: "#8892a4", lineHeight: 1.7,
    maxWidth: 480, margin: "0 0 40px",
  },

  // Main button
  mainBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "14px 28px", borderRadius: 14,
    fontSize: 16, fontWeight: 700, border: "none",
    cursor: "pointer", transition: "all .25s",
    marginBottom: 24,
  },
  btn_primary: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(79,70,229,.45), 0 0 0 1px rgba(79,70,229,.3)",
  },
  btn_loading: {
    background: "rgba(79,70,229,.2)",
    color: "#818cf8", border: "1px solid rgba(79,70,229,.3)",
  },
  btn_success: {
    background: "rgba(16,185,129,.15)",
    color: "#34d399", border: "1px solid rgba(16,185,129,.3)",
    cursor: "default",
  },
  btn_ghost: {
    background: "rgba(255,255,255,.05)",
    color: "#4b5563", border: "1px solid rgba(255,255,255,.08)",
    cursor: "default",
  },
  spinner: {
    width: 18, height: 18, borderRadius: "50%",
    border: "2px solid rgba(129,140,248,.3)",
    borderTopColor: "#818cf8",
    display: "inline-block",
    animation: "spin .7s linear infinite",
  },

  // Status
  statusPill: {
    fontSize: 12, color: "#4b5563",
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 20, padding: "4px 12px",
    display: "flex", alignItems: "center", gap: 6,
    marginBottom: 60,
  },
  code: {
    fontFamily: "monospace", color: "#818cf8",
    background: "rgba(79,70,229,.12)", padding: "1px 6px",
    borderRadius: 4,
  },
  iosBadge: {
    fontSize: 10, background: "rgba(6,182,212,.15)",
    color: "#22d3ee", border: "1px solid rgba(6,182,212,.3)",
    borderRadius: 4, padding: "1px 5px",
  },

  // Features
  features: {
    display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16, width: "100%", marginBottom: 48,
  },
  feature: {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 14, padding: 20, textAlign: "left",
    transition: "border-color .2s",
  },
  featureIcon: { fontSize: 24, marginBottom: 10, display: "block" },
  featureTitle: { fontWeight: 600, fontSize: 14, color: "#c7d0e4", marginBottom: 4 },
  featureDesc: { fontSize: 12, color: "#4b5563", lineHeight: 1.5 },

  // Code block
  codeBlock: {
    width: "100%",
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 14, overflow: "hidden",
    textAlign: "left",
  },
  codeHeader: {
    padding: "10px 16px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,.02)",
  },
  codeDot: {
    width: 10, height: 10, borderRadius: "50%",
    background: "rgba(255,255,255,.12)", display: "inline-block",
  },
  codeFilename: {
    marginLeft: 8, fontSize: 11, color: "#4b5563",
    fontFamily: "monospace", letterSpacing: ".04em",
  },
  codePre: {
    margin: 0, padding: "20px 20px",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 12, lineHeight: 1.8, color: "#818cf8",
    overflowX: "auto",
    background: "transparent",
  },

  // Modal
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,.75)",
    backdropFilter: "blur(8px)",
    zIndex: 2000,
    display: "flex", alignItems: "flex-end", justifyContent: "center",
    padding: "0 16px 24px",
  },
  modal: {
    width: "min(480px, 100%)",
    background: "#0d1422",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 20, padding: 28,
    position: "relative",
    animation: "slideUp .35s cubic-bezier(.16,1,.3,1)",
  },
  closeBtn: {
    position: "absolute", top: 16, right: 16,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 8, color: "#8892a4",
    padding: 6, cursor: "pointer",
    display: "flex", alignItems: "center",
  },
  modalEyebrow: {
    fontSize: 10, fontWeight: 700, letterSpacing: ".12em",
    textTransform: "uppercase", color: "#6366f1", marginBottom: 8,
  },
  modalTitle: {
    fontSize: 26, fontWeight: 800,
    color: "#f0f4ff", margin: "0 0 4px",
    fontFamily: "'DM Serif Display', Georgia, serif",
  },
  modalSub: { fontSize: 14, color: "#4b5563", marginBottom: 28 },
  steps: { display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 },
  step: {
    display: "flex", alignItems: "center", gap: 14,
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 12, padding: "14px 16px",
  },
  stepNum: {
    width: 24, height: 24, borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  stepIcon: {
    width: 36, height: 36,
    background: "rgba(79,70,229,.12)",
    border: "1px solid rgba(79,70,229,.2)",
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#818cf8", flexShrink: 0,
  },
  stepLabel: { fontWeight: 600, fontSize: 14, color: "#c7d0e4" },
  stepSub: { fontSize: 12, color: "#4b5563", marginTop: 2 },
  iosTip: {
    background: "rgba(6,182,212,.08)",
    border: "1px solid rgba(6,182,212,.2)",
    borderRadius: 10, padding: "12px 14px",
    fontSize: 13, color: "#7dd3fc", lineHeight: 1.5,
  },
};

// Inject keyframes
const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=DM+Serif+Display&display=swap');
  @keyframes slideUp {
    from { transform: translateY(40px) translateX(-50%); opacity: 0; }
    to   { transform: translateY(0)    translateX(-50%); opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  * { box-sizing: border-box; }
`;
document.head.appendChild(style);
