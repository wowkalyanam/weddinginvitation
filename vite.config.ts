import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 5980,
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        invite: path.resolve(__dirname, 'invite.html'),
        meenaya: path.resolve(__dirname, 'meenaya.html'),
        template2: path.resolve(__dirname, 'template2.html'),
        kasavu: path.resolve(__dirname, 'kasavu.html'),
        template10: path.resolve(__dirname, 'template10.html'),
      },
    },
  },
})
