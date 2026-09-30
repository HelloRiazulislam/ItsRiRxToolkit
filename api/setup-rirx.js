export default function handler(req, res) {
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
}
