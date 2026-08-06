import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev
export default defineConfig({
  base: './', // Garante os caminhos relativos corretos para HTTPS
  plugins: [
    react(),
    tailwindcss() // Garante o suporte ao Tailwind v4
  ],
  css: {
    // Corrige os erros de [lightningcss] com as diretivas do Tailwind v4 (@theme)
    transformer: 'postcss' 
  }
})
