
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(async ({ command }) => {
  const plugins = [react()]

  // Load Express API middleware only during local development
  if (command === 'serve') {
    try {
      const serverPath = './server/index.js'
      const { createServer: createBackendServer } =
        await import(/* @vite-ignore */ serverPath)

      const backendApp = createBackendServer()

      plugins.push({
        name: 'truthlens-api-plugin',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Support both direct '/api' and repo subpath '/Deep-Fake-Detection/api'
            if (req.url && req.url.startsWith('/Deep-Fake-Detection/api')) {
              req.url = req.url.replace('/Deep-Fake-Detection', '')
              backendApp(req, res, next)
              return
            }
            if (req.url && req.url.startsWith('/api')) {
              backendApp(req, res, next)
              return
            }
            // Seamlessly redirect subpath access to root in local dev
            if (req.url === '/Deep-Fake-Detection' || req.url === '/Deep-Fake-Detection/') {
              res.writeHead(302, { Location: '/' })
              res.end()
              return
            }
            next()
          })
        }
      })
    } catch (e) {
      console.warn(
        '[Vite Dev] Backend middleware could not be loaded:',
        e.message
      )
    }
  }

  return {
    // Serve from '/' in dev so localhost:5173 loads instantly without 404s
    // In build, default to repository subpath '/Deep-Fake-Detection/' for GitHub Pages
    // Use '/' for Vercel; override with VITE_BASE_PATH for GitHub Pages if needed
    base: process.env.VITE_BASE_PATH || '/',
    plugins,
    server: {
      port: 5173
    }
  }
})
