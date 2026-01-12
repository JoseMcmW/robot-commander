import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar TensorFlow.js en su propio chunk
          'tensorflow': ['@tensorflow/tfjs', '@tensorflow-models/coco-ssd'],
          // Separar React y librerías relacionadas
          'react-vendor': ['react', 'react-dom'],
          // Separar lucide-react (iconos)
          'icons': ['lucide-react']
        }
      }
    },
    // Aumentar el límite de advertencia a 1500 KB para chunks grandes como TensorFlow
    chunkSizeWarningLimit: 1500
  }
})
