import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true,
  },
  // This is the key part for Render:
  preview: {
    port: 4173,
    strictPort: true,
  },
  // Add this to ensure fallback works during preview/build
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});