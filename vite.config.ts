import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    entry: './src/main.jsx', // ← Add this line
  },
});
