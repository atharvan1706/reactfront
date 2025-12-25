import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000
    // ❌ REMOVE proxy entirely
  },

  preview: {
    port: 3000,
    host: true,
    allowedHosts: [
      'reactfront-production-101d.up.railway.app'
    ]
  }
});
