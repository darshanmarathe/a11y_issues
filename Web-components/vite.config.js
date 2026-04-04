import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
    },
  },
  preview: {
    port: 3000,
    open: true,
  },
  appType: 'spa',
});
