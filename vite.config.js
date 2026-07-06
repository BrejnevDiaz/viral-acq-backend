import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Acquisition Pro',
        short_name: 'Acquisition Pro',
        description: "L'arme secrète des marques qui dominent leur marché.",
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: '#FAFAF8',
        background_color: '#FFFFFF',
        icons: [
          { src: '/pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: '/pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
