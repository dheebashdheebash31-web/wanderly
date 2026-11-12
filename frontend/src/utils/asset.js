// Files in /public (images, favicon, icons.svg) are served relative to
// whatever Vite's `base` is configured as — "/" during `npm run dev`, but
// "/static/react/" in the production build, since that's the URL prefix
// Django serves the built app under (see vite.config.js + wanderly_django
// urls.py). Hardcoded strings like "/images/bali.jpg" in JSX are NOT
// rewritten by Vite's base handling (only imports and processed HTML/CSS
// references are) — so every reference to a /public file must go through
// this helper instead, or it 404s in the single-server build.
export function asset(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
