import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'public/index.html', // Define HTML as the entry point
    },
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'], // Ensure TS/TSX support
  },
});
