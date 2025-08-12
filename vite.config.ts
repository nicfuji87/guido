import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// AI dev note: Vite 2 + React 16.14 + TS 3.4
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})


