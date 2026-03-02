My ecosystem as a developer
===========================

Purpose
-------
A compact, static visualization that maps the tools, platforms and workflow I use on a daily basis. It renders a force-directed network with per-tool icons and lightweight interactivity (drag, zoom, hover).

Stack
-----
- Plain HTML, CSS and vanilla JavaScript
- D3.js v7 for the force layout and interactions
- Static assets kept under `public/` (CSS, JS, icons)
- Deployment via GitHub Pages (workflow included)

Repository structure (key files)
-------------------------------
- `index.html` — single static page entry
- `public/styles.css` — visual styles and responsive rules
- `public/main.js` — D3 configuration and interaction logic
- `public/icons/` — SVG/PNG icons used for nodes
- `.github/workflows/deploy.yml` — GitHub Actions workflow to publish Pages

Run locally
-----------
Open `index.html` in a browser or serve the folder with a simple static server, for example:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

Deployment
----------
The repository includes a GitHub Actions workflow that publishes the repository root to GitHub Pages on push to the default branch. Ensure `index.html` remains at the repo root or update the workflow if you prefer to publish a subfolder.

Notes
-----
- The page is intentionally simple and dependency-free beyond D3 from the CDN.
- For visual changes (icons, spacing, or layout), edit `public/main.js` and `public/styles.css`.
