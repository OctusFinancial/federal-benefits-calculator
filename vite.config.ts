import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'public', // Set public as the root where index.html resides
  build: {
    outDir: '../dist', // Output to dist outside public
    rollupOptions: {
      input: 'index.html', // Relative to root (public/)
    },
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'], // Ensure TS/TSX support
  },
});
