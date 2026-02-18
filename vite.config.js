import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',   // 👈 IMPORTANT
  build: {
    outDir: 'dist-ameya',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://darkgrey-owl-595695.hostingersite.com',
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: 'https://darkgrey-owl-595695.hostingersite.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
// version1