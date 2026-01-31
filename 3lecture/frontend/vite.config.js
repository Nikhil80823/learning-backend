import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy:{
      '/api': 'http://localHost:5000'
    }
  },
  plugins: [react()],
})
