import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },

  preview: {
    port: 3000,
    host: true,
    allowedHosts: [
      'reactfront-production-101d.up.railway.app'
    ]
  }
});
