import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'public', // Root directory containing index.html
  build: {
    outDir: '../dist', // Output directory outside public
    rollupOptions: {
      input: 'index.html', // Entry point relative to root
    },
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'], // Support JS and TS files
  },
});
