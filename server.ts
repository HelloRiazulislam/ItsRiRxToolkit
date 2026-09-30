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

// 3. Downloadable Batch Launcher: /launcher.bat and /download/launcher.bat
app.get(['/launcher.bat', '/i.bat', '/download/launcher.bat'], (req, res) => {
  res.setHeader('Content-Type', 'application/x-bat; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="ItsRiRx-ToolKit.bat"');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const batContent = `@echo off
:: ============================================================================
::  ItsRiRx Windows Tool Kit - 1-Click Desktop Launcher
::  Compatibility: Windows 10, Windows 11 (64-bit)
:: ============================================================================
title ItsRiRx Windows Tool Kit
color 0b

:: Check for Administrator elevation
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Administrator rights required. Requesting elevation...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Launching remote suite...
echo ============================================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "irm https://itsrirx-toolkit.vercel.app/i | iex"

echo.
echo Press any key to exit...
pause >nul
`;
  return res.status(200).send(batContent);
});

// 4. Downloadable Setup Profile Shortcut: /setup-rirx.bat
app.get(['/setup-rirx.bat', '/download/setup-rirx.bat'], (req, res) => {
  res.setHeader('Content-Type', 'application/x-bat; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="Setup-rirx-Command.bat"');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const batContent = `@echo off
:: ============================================================================
::  ItsRiRx Windows Tool Kit - Permanent 'rirx' Terminal Command Installer
:: ============================================================================
title Setup 'rirx' Command
color 0a
cls
echo ============================================================================
echo   Installing 'rirx' shortcut command into your PowerShell Profile...
echo ============================================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$profileDir = Split-Path $PROFILE; if (!(Test-Path $profileDir)) { New-Item -ItemType Directory -Path $profileDir -Force | Out-Null }; if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force | Out-Null }; $fn = 'function rirx { irm https://itsrirx-toolkit.vercel.app/i | iex }'; $content = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue; if ($content -notmatch 'function rirx') { Add-Content -Path $PROFILE -Value \"\`n# ItsRiRx Windows Tool Kit Shortcut\`n$fn\" -Force; Write-Host '[OK] Shortcut installed successfully!' -ForegroundColor Green } else { Write-Host '[INFO] ''rirx'' command already configured in your PowerShell Profile.' -ForegroundColor Yellow }; Write-Host ''; Write-Host 'Now you can open any PowerShell terminal and simply type: rirx' -ForegroundColor Cyan"

echo.
echo ============================================================================
echo Installation Complete!
echo You can now open any terminal and type: rirx
echo ============================================================================
echo.
pause
`;
  return res.status(200).send(batContent);
});

// 5. API endpoint for web preview to fetch toolkit script
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
