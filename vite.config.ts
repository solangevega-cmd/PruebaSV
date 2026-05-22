import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tablasvega': {
        target: 'https://nunk2bv345.execute-api.us-east-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
