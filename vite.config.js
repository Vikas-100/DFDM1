import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [react()];

  // Only mount Express API backend middleware during local 'vite' dev server
  if (command === 'serve') {
    try {
      const { createServer: createBackendServer } = await import('./server/index.js');
      const backendApp = createBackendServer();
      plugins.push({
        name: 'truthlens-api-plugin',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.startsWith('/api')) {
              backendApp(req, res, next);
            } else {
              next();
            }
          });
        }
      });
    } catch (e) {
      console.warn('[Vite Dev] Backend middleware could not be loaded:', e.message);
    }
  }

  return {
    base: process.env.VITE_BASE_PATH || '/Deep-Fake-Detection/',
    plugins,
    server: {
      port: 5173
    }
  };
});
