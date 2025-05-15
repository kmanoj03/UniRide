import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  base: './', // important for correct asset loading!
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://uniride-backend.onrender.com',
        changeOrigin: true,
        secure: false, // Disable SSL verification if needed
        rewrite: (path) => path.replace(/^\${import.meta.env.VITE_API_BASE_URL}/, '') // Remove '/api' before hitting the backend
      },
    },
  },
});
