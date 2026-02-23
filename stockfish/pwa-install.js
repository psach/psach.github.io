class PwaInstallManager {
    constructor() {
        this.deferredPrompt = null;
        this.initialize();
    }

    async initialize() {
        window.addEventListener('beforeinstallprompt', (event) => {
            // Prevent the mini info bar from appearing on mobile
            event.preventDefault();
            // Stash the event so it can be triggered later.
            this.deferredPrompt = event;
        });
    }

    async promptInstall() {
        // Ensure that there’s a pending install prompt
        if (!this.deferredPrompt) {
            console.warn('No install prompt available.');
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the PWA installation.');
        } else {
            console.log('User dismissed the PWA installation.');
        }
        // Clear the deferredPrompt so it can’t be used again
        this.deferredPrompt = null;
    }
}

// Example use of the PwaInstallManager
const pwaInstallManager = new PwaInstallManager();

// Event listener for a button to trigger the installation prompt
document.getElementById('install-button').addEventListener('click', () => {
    pwaInstallManager.promptInstall();
});