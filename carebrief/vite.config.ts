import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // SPA routing support - fallback to index.html for client-side routing
    historyApiFallback: true,
  },
  preview: {
    // Also apply to preview mode
    historyApiFallback: true,
  },
})
