import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true, // Permite manejar rutas en desarrollo
  },
  base: '/', // Asegura que las rutas sean absolutas
});
