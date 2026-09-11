import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Repo name on GitHub Pages: https://<user>.github.io/nickvw-art/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/nickvw-art/' : '/',
}))
