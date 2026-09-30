import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Disallow non-GET/HEAD methods
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const toolkitPath = path.join(process.cwd(), 'toolkit.ps1');
    let scriptContent = '';

    if (fs.existsSync(toolkitPath)) {
      scriptContent = fs.readFileSync(toolkitPath, 'utf8');
    } else {
      // Fallback relative search
      const altPath = path.resolve(__dirname, '../toolkit.ps1');
      if (fs.existsSync(altPath)) {
        scriptContent = fs.readFileSync(altPath, 'utf8');
      } else {
        return res.status(500).send('# [ERROR] toolkit.ps1 could not be located on the server.');
      }
    }

    // Set exact plain-text headers required for in-memory PowerShell execution
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).send(scriptContent);
  } catch (err) {
    console.error('Error serving toolkit script:', err);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(500).send(`# [ERROR] Internal server error: ${err.message}`);
  }
}
