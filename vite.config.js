import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // All requests to /api/* are forwarded to the real PHP backend.
      // This eliminates CORS errors during local development because the
      // browser talks to localhost (same origin); Vite's Node.js process
      // relays the request to the remote server.
      '/api': {
        target: 'https://demo.onlineserp.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/serp_dev/app/integration/poss_new/exe_realese.php'),
      },
    },
  },
})
