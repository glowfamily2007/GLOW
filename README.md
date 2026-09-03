# Worship Setlist

A lightweight, GitHub Pages-ready worship setlist planner inspired by common worship-set workflows. It is an original implementation and does not copy proprietary source code, branding, or assets.

## Features

- Create and manage worship setlists
- Song library with title, artist, key, BPM, lyrics/chords
- Add/remove/reorder songs
- Search songs
- Presentation mode for large-screen lyrics/notes
- JSON backup export/import
- Browser local storage
- Responsive desktop/mobile layout
- No backend or database required

## Run locally

Simply open `index.html` in a browser.

For a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a GitHub repository, e.g. `worship-setlist`.
2. Upload `index.html`, `styles.css`, and `app.js`.
3. In GitHub, open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Save. GitHub will provide your public Pages URL.

## Notes

All user-created data is stored in the browser's local storage. Use **Export** regularly to make a JSON backup. This version intentionally uses original UI/code rather than reproducing the source site's proprietary implementation.
