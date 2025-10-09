import { defineConfig } from 'electron-vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main.js')
        }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'collector/index.js')
        }
      }
    }
  },
  renderer: {
    root: resolve(__dirname, 'frontend'),
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'frontend/index.html')
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'frontend/src')
      }
    },
    worker: {
      format: 'es',
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    }
  }
})
