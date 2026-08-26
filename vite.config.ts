import { defineConfig } from 'vite';

// base e relativo para o build funcionar tanto local quanto no GitHub Pages
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 5173,
  },
});
