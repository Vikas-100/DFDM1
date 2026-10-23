import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api', apiRouter);

  // Serve static assets if in production
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));

  return app;
}

const app = createServer();
const PORT = process.env.PORT || 3001;

// Only listen if executed directly
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  app.listen(PORT, () => {
    console.log(`[TruthLens AI Backend] Running on http://localhost:${PORT}`);
    console.log(`[TruthLens AI Backend] Health: http://localhost:${PORT}/api/health`);
    console.log(`[TruthLens AI Backend] Model Info: http://localhost:${PORT}/api/model-info`);
    console.log(`[TruthLens AI Backend] Detection: POST http://localhost:${PORT}/api/detect`);
  });
}

export default app;
