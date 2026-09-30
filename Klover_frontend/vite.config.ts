import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Listens on every network interface, not just localhost - required so
    // a phone on the same hotspot can reach this dev server at all.
    host: true,
    // 5173 is Vite's own default; kept explicit since the backend already
    // owns port 3000 on this same laptop.
    port: 5173,
    proxy: {
      // The Klover backend has no CORS headers configured, so a direct
      // fetch("http://<ip>:3000/api/...") from the browser would be blocked.
      // Routing /api/* through Vite's own dev server instead keeps every
      // request same-origin from the browser's point of view - Vite then
      // forwards it to the real backend on this machine, server-to-server,
      // where CORS doesn't apply. This also means the frontend never needs
      // to know the backend's port separately from its own.
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
})
