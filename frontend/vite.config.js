import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000', 
    },
  },
  preview: {
    host: '0.0.0.0', // Dla `vite preview`
    port: 4173,      // Dopasuj port
    proxy: {
      '/api': {
        target: 'http://backend:8000', // Użyj nazwy usługi 'backend'
        changeOrigin: true,
      },
    },
  },
})
