import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
     proxy: {
      '/api/youtube': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api/lrc': {
        target: 'https://lrclib.net',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api\/lrc/, '/api'),
        headers: {
          'User-Agent': `${process.env.VITE_APP_NAME ?? 'TypeChorus'} v${process.env.VITE_APP_VERSION ?? 'dev'}`,
        },
      },
    },
  },
})
