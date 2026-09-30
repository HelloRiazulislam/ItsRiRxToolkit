import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Helper to get raw PowerShell toolkit
function getToolkitScript(): string {
  const filePath = path.join(__dirname, 'toolkit.ps1');
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return '# [ERROR] toolkit.ps1 not found on server.';
}

// 1. Raw PowerShell Endpoint: /i and /raw
app.get(['/i', '/raw', '/api/i'], (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  const script = getToolkitScript();
  return res.status(200).send(script);
});

// 2. Info Plain-Text Endpoint: /info
app.get('/info', (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const fullUrl = `${protocol}://${host}`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  const banner = [
    '==================================================',
    '             ITS RIRX WINDOWS TOOL KIT',
    '                    Version 1.0.0',
    '==================================================',
    '',
    'Remotely hosted PowerShell Windows administration toolkit.',
    '',
    'LAUNCHER COMMANDS (Run from Windows terminal):',
    '',
    'PowerShell:',
    `  irm ${fullUrl}/i | iex`,
    '',
    'Command Prompt (CMD):',
    `  powershell -NoProfile -ExecutionPolicy Bypass -Command "irm ${fullUrl}/i | iex"`,
    '',
    'ENDPOINT:',
    `  ${fullUrl}/i  -> Returns raw PowerShell toolkit source code`,
    '',
    'No local file download or runtime installation required.',
    'Executes safely and directly in PowerShell memory.',
    '=================================================='
  ].join('\n');

  return res.status(200).send(banner);
});

// 3. API endpoint for web preview to fetch toolkit script
app.get('/api/script', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).send(getToolkitScript());
});

// 4. Mount Vite in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[ItsRiRx Toolkit] Server listening on port ${PORT}`);
    console.log(`[ItsRiRx Toolkit] PowerShell endpoint ready at http://localhost:${PORT}/i`);
  });
}

startServer().catch((err) => {
  console.error('[ItsRiRx Toolkit] Failed to start server:', err);
  process.exit(1);
});
