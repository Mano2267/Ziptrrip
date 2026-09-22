import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Multi-Page Application (MPA) configuration
// Two independent entry points: list page + detail page
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to the Express backend during development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        // Main list page
        main: resolve(__dirname, 'index.html'),
        // Single todo detail page
        todo: resolve(__dirname, 'todo.html')
      }
    }
  }
});
