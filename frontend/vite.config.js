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
  build: {
    outDir: '../backend/static/frontend', 
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index-build.js',
        chunkFileNames: 'assets/index-build.js',
        assetFileNames: 'assets/index-build.css',
        

      },
    },
},
})
