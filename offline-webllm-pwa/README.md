# WebLLM Offline Chat PWA

This is a standalone, offline-first PWA shell for the current WebLLM chat experience.

## What it does

- Runs in-browser with WebGPU through WebLLM
- Registers a service worker so the app shell stays available offline
- Persists the chat history in localStorage
- Uses WebLLM cache backends for model artifacts
- Ships with a lightweight default model ID

## How to run

Serve the folder over `http://localhost` or HTTPS.

Examples:

```bash
python -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080` and install the app from the browser menu.

## Important note

The application shell is offline-capable after first load, but the model weights still need to be downloaded once before the browser can keep using them offline.
