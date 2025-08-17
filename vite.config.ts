import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// AI dev note: Vite 2 + React 16.14 + TS 3.4
// Bundle size otimizado com code splitting
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // AI dev note: Proxy removido - agora usa webhook n8n direto
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks próprios
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', '@radix-ui/react-avatar', '@radix-ui/react-dropdown-menu'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'utils-vendor': ['lucide-react', 'class-variance-authority']
        }
      }
    },
    // Aumentar limite para reduzir warnings (opcional)
    chunkSizeWarningLimit: 600
  }
})


