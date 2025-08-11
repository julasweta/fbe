import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/fbe/', // 👈 це обов'язково для GitHub Pages
});
