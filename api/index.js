export default function handler(req, res) {
  const host = req.headers.host || 'your-project.vercel.app';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const fullUrl = `${protocol}://${host}`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

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
}
