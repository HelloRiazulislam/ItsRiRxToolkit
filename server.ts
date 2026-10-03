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
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Launching remote suite...
echo ============================================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$url = 'https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1'; try { irm $url | iex } catch { irm 'https://itsrirx-toolkit.vercel.app/i' | iex }"

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
::  ItsRiRx Windows Tool Kit - Universal 'rirx' Setup & Binary Installer
::  Compatibility: Windows 10, Windows 11 (64-bit)
:: ============================================================================
title Setup 'rirx' Command Everywhere
color 0b

:: 1. Auto-elevate to Administrator with UAC prompt
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Requesting Administrator privileges to register system command...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - 1-Click 'rirx' Command Setup
echo ============================================================================
echo.
echo [*] Step 1: Installing global 'rirx.cmd' and 'rirx.ps1' binaries to System32...

:: Write rirx.cmd using pure native batch
(
echo @echo off
echo powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$url = 'https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1'; try { irm $url | iex } catch { irm 'https://itsrirx-toolkit.vercel.app/i' | iex }"
) > "%SystemRoot%\\System32\\rirx.cmd"

copy /y "%SystemRoot%\\System32\\rirx.cmd" "%SystemRoot%\\rirx.cmd" >nul 2>&1
copy /y "%SystemRoot%\\System32\\rirx.cmd" "%SystemRoot%\\System32\\rirx.bat" >nul 2>&1
copy /y "%SystemRoot%\\System32\\rirx.cmd" "%SystemRoot%\\rirx.bat" >nul 2>&1

:: Write rirx.ps1
(
echo $url = 'https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1'
echo try { irm $url ^| iex } catch { irm 'https://itsrirx-toolkit.vercel.app/i' ^| iex }
) > "%SystemRoot%\\System32\\rirx.ps1"

copy /y "%SystemRoot%\\System32\\rirx.ps1" "%SystemRoot%\\rirx.ps1" >nul 2>&1

echo   [OK] Installed system binary: %SystemRoot%\\System32\\rirx.cmd
echo   [OK] Installed system script: %SystemRoot%\\System32\\rirx.ps1

echo.
echo [*] Step 2: Registering in Windows 'Run' Dialog (Win + R) Registry...
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\rirx.cmd" /ve /t REG_SZ /d "%SystemRoot%\\System32\\rirx.cmd" /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\rirx.exe" /ve /t REG_SZ /d "%SystemRoot%\\System32\\rirx.cmd" /f >nul 2>&1
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\rirx.cmd" /ve /t REG_SZ /d "%SystemRoot%\\System32\\rirx.cmd" /f >nul 2>&1
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\rirx.exe" /ve /t REG_SZ /d "%SystemRoot%\\System32\\rirx.cmd" /f >nul 2>&1
echo   [OK] Registered in Windows Run Dialog (App Paths)

echo.
echo [*] Step 3: Unlocking PowerShell Execution Policy...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force -ErrorAction SilentlyContinue; Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine -Force -ErrorAction SilentlyContinue; Write-Host '  [OK] CurrentUser & LocalMachine ExecutionPolicy set to RemoteSigned' -ForegroundColor Green"

echo.
echo [*] Step 4: Registering 'rirx' function in PowerShell Profiles (Local + OneDrive)...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$dirs = @([Environment]::GetFolderPath('MyDocuments'), ($env:USERPROFILE + '\\OneDrive\\Documents'), ($env:USERPROFILE + '\\Documents')); $pList = @($PROFILE.CurrentUserCurrentHost, $PROFILE.CurrentUserAllHosts, $PROFILE.AllUsersCurrentHost, $PROFILE.AllUsersAllHosts); foreach ($d in $dirs) { if (Test-Path $d) { $pList += (Join-Path $d 'WindowsPowerShell\\Microsoft.PowerShell_profile.ps1'); $pList += (Join-Path $d 'PowerShell\\Microsoft.PowerShell_profile.ps1') } }; $fn = [Environment]::NewLine + 'function rirx { & powershell.exe -NoProfile -ExecutionPolicy Bypass -Command \"\"\"$u=''https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1''; try { irm $u | iex } catch { irm ''https://itsrirx-toolkit.vercel.app/i'' | iex }\"\"\" }' + [Environment]::NewLine; foreach ($p in ($pList | Select-Object -Unique)) { if ($p) { try { $parent = Split-Path $p; if (!(Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force -ErrorAction SilentlyContinue | Out-Null }; if (!(Test-Path $p)) { New-Item -ItemType File -Path $p -Force -ErrorAction SilentlyContinue | Out-Null }; $cnt = Get-Content $p -Raw -ErrorAction SilentlyContinue; if ($cnt -notmatch 'function rirx') { Add-Content -Path $p -Value $fn -Force -ErrorAction SilentlyContinue }; Unblock-File -Path $p -ErrorAction SilentlyContinue } catch {} } }; Write-Host '  [OK] All PowerShell profiles updated and unblocked' -ForegroundColor Green"

echo.
echo ============================================================================
echo   [SUCCESS] 'rirx' command has been installed and configured!
echo.
echo   You can now launch the toolkit anytime from:
echo     1. Windows Run Dialog : Press [Win + R] -> type "rirx" -> hit Enter
echo     2. Windows PowerShell : Type "rirx" -> hit Enter
echo     3. Command Prompt CMD : Type "rirx" -> hit Enter
echo     4. Windows Terminal   : Type "rirx" -> hit Enter
echo ============================================================================
echo.
echo Press any key to exit this installer window...
pause >nul
`;
  return res.status(200).send(batContent);
});

// 5. API endpoint for web preview to fetch toolkit script
app.get('/api/script', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).send(getToolkitScript());
});

// 6. Dynamic Bundle Download API: /api/bundle.bat and /api/bundle.ps1
app.get(['/api/bundle.bat', '/download/bundle.bat'], (req, res) => {
  const appsParam = (req.query.apps as string) || '';
  const apps = appsParam ? appsParam.split(',').filter(Boolean) : [];

  let script = `@echo off
:: ============================================================================
::  ItsRiRx Windows Tool Kit - Automated Silent Application Deployment
:: ============================================================================
title ItsRiRx Silent Software Deployment
color 0b

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Administrator rights required for silent installation.
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Automated Silent Deployment
echo   Total Packages to Deploy: ${apps.length}
echo ============================================================================
echo.

set WINGET_CMD=winget
where winget >nul 2>&1
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\\Microsoft\\WindowsApps\\winget.exe" (
        set WINGET_CMD="%LOCALAPPDATA%\\Microsoft\\WindowsApps\\winget.exe"
    )
)

echo [*] Initializing package manager...
%WINGET_CMD% source update --accept-source-agreements >nul 2>&1
echo.
`;

  apps.forEach((app, idx) => {
    script += `echo [${idx + 1}/${apps.length}] Installing ${app}...
%WINGET_CMD% install --id ${app} -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity
echo.
`;
  });

  script += `echo ============================================================================
echo   [COMPLETED] Automated silent deployment finished!
echo ============================================================================
pause
`;

  res.setHeader('Content-Type', 'application/x-bat; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="ItsRiRx-Silent-Installer.bat"');
  return res.status(200).send(script);
});

app.get(['/api/bundle.ps1', '/download/bundle.ps1'], (req, res) => {
  const appsParam = (req.query.apps as string) || '';
  const apps = appsParam ? appsParam.split(',').filter(Boolean) : [];

  let script = `# ============================================================================
#  ItsRiRx Windows Tool Kit - Automated Silent Application Deployment
# ============================================================================
#Requires -RunAsAdministrator

Write-Host "ItsRiRx Silent Software Deployment (${apps.length} applications)" -ForegroundColor Cyan
$apps = @('${apps.join("','")}')

$wingetExe = "winget"
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    if (Test-Path "$env:LOCALAPPDATA\\Microsoft\\WindowsApps\\winget.exe") {
        $wingetExe = "$env:LOCALAPPDATA\\Microsoft\\WindowsApps\\winget.exe"
    }
}

$idx = 1
foreach ($app in $apps) {
    if ([string]::IsNullOrWhiteSpace($app)) { continue }
    Write-Host "[$idx/$($apps.Count)] Installing $app..." -ForegroundColor Cyan
    Start-Process -FilePath $wingetExe -ArgumentList @("install", "--id", $app, "-e", "--silent", "--accept-package-agreements", "--accept-source-agreements", "--disable-interactivity") -NoNewWindow -Wait
    $idx++
}

Write-Host "All applications processed successfully!" -ForegroundColor Green
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="ItsRiRx-Silent-Installer.ps1"');
  return res.status(200).send(script);
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
