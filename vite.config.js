import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, cpSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  base: '/go-home-tanuki/',
  plugins: [
    {
      name: 'copy-assets',
      writeBundle() {
        // Copy Phaser file to dist
        const phaserSrcPath = resolve(__dirname, 'src/js/lib/phaser.arcade.js');
        const phaserDestPath = resolve(__dirname, 'dist/js/lib/phaser.arcade.js');
        mkdirSync(resolve(__dirname, 'dist/js/lib'), { recursive: true });
        copyFileSync(phaserSrcPath, phaserDestPath);
        
        // Copy images to dist
        const imagesSrcPath = resolve(__dirname, 'src/images');
        const imagesDestPath = resolve(__dirname, 'dist/src/images');
        cpSync(imagesSrcPath, imagesDestPath, { recursive: true });
        
        // Copy audio to dist
        const audioSrcPath = resolve(__dirname, 'src/audio');
        const audioDestPath = resolve(__dirname, 'dist/src/audio');
        cpSync(audioSrcPath, audioDestPath, { recursive: true });
        
        // Copy favicon
        const faviconSrcPath = resolve(__dirname, 'src/images/splash/tanuki-splash-1.png');
        const faviconDestPath = resolve(__dirname, 'dist/favicon.ico');
        copyFileSync(faviconSrcPath, faviconDestPath);
      }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Performance optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Phaser into its own chunk for better caching
          phaser: ['phaser'],
          // Separate p2 physics engine
          physics: ['p2'],
          // Separate game logic
          game: ['./src/js/game/states/game.js'],
          // Separate utilities
          utils: ['./src/js/game/utils/progressiveLoader.js', './src/js/game/utils/assets.js'],
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
    // Enable asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
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