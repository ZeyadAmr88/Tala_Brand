import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define the Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change this if you need a different port
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://tala-store.vercel.app'),
  },
});
