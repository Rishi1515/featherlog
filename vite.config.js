import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visionPlugin } from './server/vision.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visionPlugin()],
})
