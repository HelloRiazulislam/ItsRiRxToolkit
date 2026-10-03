import { SOFTWARE_APPS, SYSTEM_TWEAKS, SoftwareApp, SystemTweak } from '../data/toolkitCatalog';

export function getAppById(id: string): SoftwareApp | undefined {
  return SOFTWARE_APPS.find((a) => a.id === id);
}

export function getTweakById(id: string): SystemTweak | undefined {
  return SYSTEM_TWEAKS.find((t) => t.id === id);
}

/**
 * Generates an auto-elevating, self-contained .bat silent installer for selected applications and tweaks
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
::  ItsRiRx Windows Tool Kit - Automated Silent Setup & Deployment
::  Generated: ${dateStr}
::  Compatibility: Windows 10, Windows 11 (64-bit)
:: ============================================================================
title ${bundleTitle}
color 0b

:: 1. Self-Elevate to Administrator if running unprivileged
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Administrator privileges required for silent installation.
    echo [*] Requesting UAC elevation...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Automated Silent Deployment
echo   Selected Apps: ${apps.length}  ^|  Selected System Optimizations: ${tweaks.length}
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
echo   [COMPLETED] Automated setup and deployment has finished!
echo ============================================================================
echo.
powershell.exe -NoProfile -Command "[console]::beep(800,200); [console]::beep(1000,300)" >nul 2>&1
pause
`;

  return script;
}

/**
 * Generates a clean standalone PowerShell (.ps1) script for selected applications and tweaks
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
#  ItsRiRx Windows Tool Kit - Automated Silent Setup & Deployment (PowerShell)
#  Generated: ${dateStr}
# ============================================================================
#Requires -RunAsAdministrator

$Host.UI.RawUI.WindowTitle = "${bundleTitle}"
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  ItsRiRx Windows Tool Kit - Automated Silent Deployment" -ForegroundColor White
Write-Host "  Apps: ${apps.length} | System Tweaks: ${tweaks.length}" -ForegroundColor DarkCyan
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
    script += `Write-Host "--- STAGE 2: SILENT APPLICATION INSTALLATION ---" -ForegroundColor Yellow
$appsToInstall = @(
`;
    apps.forEach((a) => {
      script += `    @{ Id = '${a.id}'; Name = '${a.name}' }
`;
    });
    script += `)

$wingetExe = "winget"
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    if (Test-Path "$env:LOCALAPPDATA\\Microsoft\\WindowsApps\\winget.exe") {
        $wingetExe = "$env:LOCALAPPDATA\\Microsoft\\WindowsApps\\winget.exe"
    }
}

$idx = 1
foreach ($app in $appsToInstall) {
    Write-Host "[$idx/$($appsToInstall.Count)] Downloading & Silently Installing: $($app.Name) ($($app.Id))..." -ForegroundColor Cyan
    $p = Start-Process -FilePath $wingetExe -ArgumentList @("install", "--id", $app.Id, "-e", "--silent", "--accept-package-agreements", "--accept-source-agreements", "--disable-interactivity") -NoNewWindow -Wait -PassThru
    if ($p.ExitCode -eq 0) {
        Write-Host "  [SUCCESS] $($app.Name) installed!" -ForegroundColor Green
    } else {
        Write-Host "  [INFO] $($app.Name) exit code: $($p.ExitCode)" -ForegroundColor DarkGray
    }
    $idx++
}

Write-Host ""
Write-Host "[SUCCESS] All selected applications processed!" -ForegroundColor Green
[console]::beep(800,200); [console]::beep(1000,300)
`;
  }

  return script;
}

/**
 * Generates an instant 1-line command to copy & run directly in PowerShell
 */
export function generateOneLineCommand(selectedAppIds: string[], selectedTweakIds: string[] = []): string {
  const appIds = selectedAppIds.join("','");
  const tweakList = selectedTweakIds.map(getTweakById).filter(Boolean) as SystemTweak[];

  const parts: string[] = [];

  if (tweakList.length > 0) {
    tweakList.forEach((t) => parts.push(t.psCode));
  }

  if (selectedAppIds.length > 0) {
    parts.push(`@('${appIds}') | ForEach-Object { winget install --id $_ -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity }`);
  }

  return parts.join('; ');
}

/**
 * Downloads a string as a file in the browser
 */
export function triggerFileDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
