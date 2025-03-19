import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:814',
        changeOrigin: true,
        secure: false, // Disable SSL verification if needed
        rewrite: (path) => path.replace(/^\/api/, '') // Remove '/api' before hitting the backend
      },
    },
  },
});
