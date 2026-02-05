# PDF Tools – Offline SPA (iLovePDF-style)

This is a single-page application (PWA) that runs **entirely in the browser** and provides common PDF tools similar to iLovePDF. After first load, it works **offline** thanks to a service worker.

## Features
- **Merge PDFs**
- **Split PDF** by page ranges (e.g., `1-3,5,8-`)
- **Organize pages**: thumbnails, drag-reorder, rotate left/right
- **Compress PDF** by rasterizing pages (quality presets)
- **Images → PDF** (JPG/PNG/WebP)
- **PDF → Images** (PNG/JPEG, ZIP download)

> ⚠️ Limitations
> - Encrypted/password-protected PDFs are not supported (cannot open or save with passwords).
> - "True" compression (image recompression without rasterizing) and Office conversions (PDF↔Word/Excel/PowerPoint) are **not** included.
> - All processing stays on-device; large PDFs may be slow depending on hardware.

## Run locally
1. Extract this folder and open `index.html` in a modern browser (Chrome, Edge, or Firefox). To enable PWA install and full offline caching, serve it via a tiny local server:
   ```bash
   # Python 3
   python -m http.server 8080
   # then open http://localhost:8080
   ```
2. Click **➕ Install** in the app header to install as an offline app.

## Offline dependencies
The app uses three well-known client-side libraries:
- [pdf-lib](https://github.com/Hopding/pdf-lib) for creating/editing PDFs
- [pdf.js](https://github.com/mozilla/pdf.js) for rendering page thumbnails
- [JSZip](https://github.com/Stuk/jszip) for creating ZIPs (PDF→Images)

They are loaded from CDNs and automatically cached by the service worker after the first online load. If you need **first-run offline** (no internet even once), download these files and place them in `./lib/` and tweak `index.html` to point to them:
- `./lib/pdf-lib.min.js`
- `./lib/pdf.min.js` and `./lib/pdf.worker.min.js`
- `./lib/jszip.min.js`

Then update the three `<script>` tags in `index.html` to use local paths.

## License
This sample is provided "as is" under the MIT license. No affiliation with iLovePDF.
