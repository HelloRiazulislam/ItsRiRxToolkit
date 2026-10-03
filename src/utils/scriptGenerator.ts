import { SOFTWARE_APPS, SYSTEM_TWEAKS, SoftwareApp, SystemTweak } from '../data/toolkitCatalog';

export function getAppById(id: string): SoftwareApp | undefined {
  return SOFTWARE_APPS.find((a) => a.id === id);
}

export function getTweakById(id: string): SystemTweak | undefined {
  return SYSTEM_TWEAKS.find((t) => t.id === id);
}

/**
 * Generates an auto-elevating, self-contained .bat silent installer for selected applications and tweaks
 * with rich ItsRiRx toolkit branding & creator credits (Created by: Riazul Islam)
 */
export function generateBatchInstaller(
  selectedAppIds: string[],
  selectedTweakIds: string[] = [],
  bundleTitle: string = 'ItsRiRx Custom Setup'
): string {
  const apps = selectedAppIds.map(getAppById).filter(Boolean) as SoftwareApp[];
  const tweaks = selectedTweakIds.map(getTweakById).filter(Boolean) as SystemTweak[];

  const dateStr = new Date().toISOString().split('T')[0];

  let script = `@echo off
:: ============================================================================
::   ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗
::   ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝
::   ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT
::   ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.2.0
::   ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗
::   ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
:: ============================================================================
::  Project    : ItsRiRx Windows Tool Kit (Automated Deployment Script)
::  Website    : https://itsrirx-toolkit.vercel.app
::  Created by : Riazul Islam
::  Target     : ${bundleTitle}
::  Generated  : ${dateStr}
::  Support    : Windows 10, Windows 11 (64-bit Architecture)
:: ============================================================================
title ${bundleTitle} - ItsRiRx Windows Tool Kit
color 0b

:: 1. Self-Elevate to Administrator if running unprivileged
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Administrator privileges required for silent installation.
    echo [*] Requesting UAC elevation...
    powershell.exe -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Automated Silent Deployment
echo   Website    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo   Setup Item : ${bundleTitle}
echo   Queue      : ${apps.length} Application(s) ^| ${tweaks.length} System Optimization(s)
echo ============================================================================
echo.

:: Detect or resolve Winget executable
set WINGET_CMD=winget
where winget >nul 2>&1
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\\Microsoft\\WindowsApps\\winget.exe" (
        set WINGET_CMD="%LOCALAPPDATA%\\Microsoft\\WindowsApps\\winget.exe"
    )
)
`;

  // Append system tweaks if selected
  if (tweaks.length > 0) {
    script += `
echo ----------------------------------------------------------------------------
echo  STAGE 1: APPLYING SYSTEM TWEAKS & OPTIMIZATIONS
echo ----------------------------------------------------------------------------
echo.
`;
    tweaks.forEach((t, i) => {
      script += `echo [${i + 1}/${tweaks.length}] Applying: ${t.title}...
${t.batCode}
echo   [OK] Done.
echo.
`;
    });
  }

  // Append silent software installations if selected
  if (apps.length > 0) {
    script += `
echo ----------------------------------------------------------------------------
echo  STAGE 2: SILENT APPLICATION DEPLOYMENT VIA WINGET
echo ----------------------------------------------------------------------------
echo.
echo [*] Initializing package manager and accepting source agreements...
%WINGET_CMD% source update --accept-source-agreements >nul 2>&1
echo.
`;

    apps.forEach((app, idx) => {
      script += `echo [${idx + 1}/${apps.length}] Downloading ^& Silently Installing: ${app.name} (${app.id})...
%WINGET_CMD% install --id ${app.id} -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity
if %errorlevel% equ 0 (
    echo   [SUCCESS] ${app.name} installed successfully!
) else (
    echo   [INFO] Status: Process completed with code %errorlevel%
)
echo.
`;
    });
  }

  script += `echo ============================================================================
echo   [COMPLETED] Automated setup and deployment has finished successfully!
echo   Toolkit    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo ============================================================================
echo.
powershell.exe -NoProfile -Command "[console]::beep(800,200); [console]::beep(1000,300)" >nul 2>&1
pause
`;

  return script;
}

/**
 * Generates a clean standalone PowerShell (.ps1) script with branding & creator credits
 */
export function generatePowerShellInstaller(
  selectedAppIds: string[],
  selectedTweakIds: string[] = [],
  bundleTitle: string = 'ItsRiRx Custom Setup'
): string {
  const apps = selectedAppIds.map(getAppById).filter(Boolean) as SoftwareApp[];
  const tweaks = selectedTweakIds.map(getTweakById).filter(Boolean) as SystemTweak[];

  const dateStr = new Date().toISOString().split('T')[0];

  let script = `# ============================================================================
#   ItsRiRx Windows Tool Kit - Automated Silent Setup & Deployment (PowerShell)
#   Website    : https://itsrirx-toolkit.vercel.app
#   Created by : Riazul Islam
#   Target     : ${bundleTitle}
#   Generated  : ${dateStr}
# ============================================================================
#Requires -RunAsAdministrator

$Host.UI.RawUI.WindowTitle = "${bundleTitle} - ItsRiRx Windows Tool Kit"
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  ItsRiRx Windows Tool Kit - Automated Silent Deployment" -ForegroundColor White
Write-Host "  Website    : https://itsrirx-toolkit.vercel.app" -ForegroundColor Cyan
Write-Host "  Created by : Riazul Islam" -ForegroundColor Green
Write-Host "  Target     : ${bundleTitle}" -ForegroundColor Yellow
Write-Host "  Queue      : ${apps.length} Application(s) | ${tweaks.length} System Optimization(s)" -ForegroundColor DarkCyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
`;

  if (tweaks.length > 0) {
    script += `Write-Host "--- STAGE 1: APPLYING SYSTEM OPTIMIZATIONS ---" -ForegroundColor Yellow
`;
    tweaks.forEach((t, i) => {
      script += `Write-Host "[${i + 1}/${tweaks.length}] Applying: ${t.title}..." -ForegroundColor White
try {
    ${t.psCode}
} catch {
    Write-Host "  [SKIP] $($_.Exception.Message)" -ForegroundColor DarkGray
}
`;
    });
    script += `Write-Host ""
`;
  }

  if (apps.length > 0) {
    script += `Write-Host "--- STAGE 2: SILENT APPLICATION DEPLOYMENT VIA WINGET ---" -ForegroundColor Yellow
$wingetCmd = (Get-Command winget -ErrorAction SilentlyContinue).Source
if (-not $wingetCmd) {
    $wingetCmd = "$env:LOCALAPPDATA\\Microsoft\\WindowsApps\\winget.exe"
}
`;
    apps.forEach((app, idx) => {
      script += `Write-Host "[${idx + 1}/${apps.length}] Installing ${app.name} (${app.id})..." -ForegroundColor White
try {
    Start-Process -FilePath $wingetCmd -ArgumentList @("install", "--id", "${app.id}", "-e", "--silent", "--accept-package-agreements", "--accept-source-agreements", "--disable-interactivity") -NoNewWindow -Wait
    Write-Host "  [OK] ${app.name} installed successfully." -ForegroundColor Green
} catch {
    Write-Host "  [!] Error installing ${app.name}: $($_.Exception.Message)" -ForegroundColor Red
}
`;
    });
    script += `Write-Host ""
`;
  }

  script += `Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  [SUCCESS] All queued operations completed!" -ForegroundColor Green
Write-Host "  Toolkit    : https://itsrirx-toolkit.vercel.app" -ForegroundColor Cyan
Write-Host "  Created by : Riazul Islam" -ForegroundColor White
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor DarkGray
[void][System.Console]::ReadKey($true)
`;

  return script;
}

/**
 * Generates an instant 1-line PowerShell command string to execute in terminal
 */
export function generateOneLineCommand(
  selectedAppIds: string[],
  selectedTweakIds: string[] = []
): string {
  const parts: string[] = [];

  const tweaks = selectedTweakIds.map(getTweakById).filter(Boolean) as SystemTweak[];
  tweaks.forEach((t) => {
    parts.push(t.psCode.trim());
  });

  const apps = selectedAppIds.map(getAppById).filter(Boolean) as SoftwareApp[];
  if (apps.length > 0) {
    const ids = apps.map((a) => `'${a.id}'`).join(',');
    parts.push(`@(${ids}) | ForEach-Object { winget install --id $_ -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity }`);
  }

  return parts.join('; ');
}

/**
 * Triggers a native file download in the browser
 */
export function triggerFileDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
