import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // No proxy needed — Vercel serves /api and frontend from same domain
})
