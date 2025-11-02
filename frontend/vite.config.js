import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    build: {
        outputDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true
    },
    base: '/'
})
