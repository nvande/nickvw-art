import react from '@vitejs/plugin-react'
import sharp from 'sharp'
import { defineConfig } from 'vite'

function thumbs() {
  return {
    name: 'thumbs',
    enforce: 'pre',
    async load(id) {
      if (!id.includes('?thumb')) return null
      const file = id.split('?')[0]
      if (!/\.(jpe?g|png|webp|gif)$/i.test(file)) return null
      const buf = await sharp(file).rotate().resize({ width: 32 }).webp({ quality: 30 }).toBuffer()
      return `export default ${JSON.stringify(`data:image/webp;base64,${buf.toString('base64')}`)}`
    },
  }
}

// Repo name on GitHub Pages: https://<user>.github.io/nickvw-art/
export default defineConfig(({ command }) => ({
  plugins: [thumbs(), react()],
  base: command === 'build' ? '/nickvw-art/' : '/',
}))
