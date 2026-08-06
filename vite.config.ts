import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev
export default defineConfig({
  // MUDADO AQUI: Remova o nome do repositório e deixe apenas a barra para o Netlify
  base: '/', 
  
  plugins: [
    react(),
    tailwindcss() 
  ],
  css: {
    transformer: 'postcss' 
  }
})
