import { defineConfig } from 'vite';

export default defineConfig({
  base: '/go-home-tanuki/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Performance optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Phaser into its own chunk for better caching
          phaser: ['phaser'],
          // Separate p2 physics engine
          physics: ['p2'],
        },
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/mp3|wav|ogg|m4a/i.test(ext)) {
            return `audio/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    // Enable compression
    reportCompressedSize: true,
    // Optimize for production
    target: 'es2015',
  },
  server: {
    port: 3017,
    // Enable HMR for faster development
    hmr: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['phaser', 'p2'],
  },
  // Enable source maps for debugging
  sourcemap: true,
});