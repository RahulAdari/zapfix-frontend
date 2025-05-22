import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // ✅ ensures routing works after deployment
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});