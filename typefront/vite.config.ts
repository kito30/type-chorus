import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendBase = env.VITE_BACKEND_BASE || env.VITE_API_BASE || 'http://localhost:3000'
  const lrcBase = env.VITE_LRC_BASE || 'https://lrclib.net'
  const appName = env.VITE_APP_NAME || 'TypeChorus'
  const appVersion = env.VITE_APP_VERSION || 'dev'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/youtube': {
          target: backendBase,
          changeOrigin: true,
        },
        '/api/lrc': {
          target: lrcBase,
          changeOrigin: true,
          rewrite: p => p.replace(/^\/api\/lrc/, '/api'),
          headers: {
            'User-Agent': `${appName} v${appVersion}`,
          },
        },
      },
    },
  }
})
