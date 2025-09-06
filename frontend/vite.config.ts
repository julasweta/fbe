import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/fbe/', // для GitHub Pages можна поставити "/fbe/" або залишити "/"
  build: {
    target: 'es2019', // щоб react-snap не падав на optional chaining
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined, // об'єднати JS у один файл для простішого prerender
      },
    },
  },
  server: {
    open: true,
    port: 5173,
  },
});
