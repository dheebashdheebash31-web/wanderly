import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
//
// `npm run build` outputs straight into the Django project:
//   - index.html -> wanderly_django/templates/react_index.html
//   - assets/    -> wanderly_django/static/react/
// so Django can serve the whole app from one process/port. See
// wanderly_django/wanderly/urls.py and settings.py for the other half
// of this setup.
export default defineConfig({
  plugins: [react()],
  base: '/static/react/',
  build: {
    outDir: '../wanderly_django/static/react',
    emptyOutDir: true,
  },
})
