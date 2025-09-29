import { defineConfig } from 'vite';

export default defineConfig({
  base: '/go-home-tanuki/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3017,
  },
});