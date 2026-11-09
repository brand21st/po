import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  // imagetools: `import x from './photo.png?format=avif;webp;jpg&as=picture'`
  // generates optimized AVIF/WebP/JPG at build time (see src/lib/photos.ts).
  plugins: [react(), imagetools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    strictPort: true,
    // Dev only: same-origin /api calls, so no CORS friction locally.
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  preview: { port: 5173 },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['gsap', 'locomotive-scroll'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
