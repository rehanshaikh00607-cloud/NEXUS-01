import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        '**/scratch*/**',
        '**/scratch_edge_*/**',
        '**/scratch_edge_baseline/**',
        '**/scratch_edge_profile/**',
        '**/scratch/**',
        '**/.git/**',
        '**/dist/**'
      ]
    }
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/three') && !id.includes('@react-three')) {
            return 'three-core'
          }
          if (id.includes('node_modules/@react-three')) {
            return 'r3f-vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor'
          }
        }
      }
    }
  }
})
