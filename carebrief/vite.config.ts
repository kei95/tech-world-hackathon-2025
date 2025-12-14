import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite dev server automatically supports SPA routing by default
  // For production, use vercel.json or _redirects for hosting platforms
})
