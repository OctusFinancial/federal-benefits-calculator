import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/guide/deploys.html#general-guidelines
export default defineConfig({
  plugins: [react()]
});
