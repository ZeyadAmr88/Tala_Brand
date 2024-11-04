import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Root-E-commerce/', // Add this line to specify the base path
  plugins: [react()],
})
