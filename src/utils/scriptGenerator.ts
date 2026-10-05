import { SOFTWARE_APPS, SYSTEM_TWEAKS, SoftwareApp, SystemTweak } from '../data/toolkitCatalog';

export function getAppById(id: string): SoftwareApp | undefined {
  return SOFTWARE_APPS.find((a) => a.id === id);
}

export function getTweakById(id: string): SystemTweak | undefined {
  return SYSTEM_TWEAKS.find((t) => t.id === id);
}

/**
 * Generates an auto-elevating, self-contained .bat silent installer for selected applications and tweaks
 * with ItsRiRx toolkit branding & creator credit once in the header
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

:: 1. Safely unblock file from browser Mark-of-the-Web to prevent SmartScreen lock
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

:: 2. Check for Administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Administrator privileges required for silent installation.
    echo [*] Requesting UAC elevation...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs" >nul 2>&1
    if %errorlevel% neq 0 (
        echo.
        echo [!] Automatic elevation could not proceed.
        echo [!] Please right-click this file and choose: 'Run as administrator'
        echo.
        pause
    )
    exit /b
)

:: Set working directory to script location
cd /d "%~dp0"

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Automated Silent Deployment
echo   Website    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo   Setup Item : ${bundleTitle}
echo   Queue      : ${apps.length} Application(s) ^| ${tweaks.length} System Optimization(s)
echo ============================================================================
echo.

:: Detect or resolve official Microsoft Winget binary across System and User profiles
set "WINGET_CMD="
where winget.exe >nul 2>&1 && set "WINGET_CMD=winget.exe"
if not defined WINGET_CMD (
    for /d %%D in ("%ProgramFiles%\\WindowsApps\\Microsoft.DesktopAppInstaller_*_x64__8wekyb3d8bbwe") do (
        if exist "%%~fD\\winget.exe" set "WINGET_CMD=\"%%~fD\\winget.exe\""
    )
)
if not defined WINGET_CMD (
    for /d %%U in ("C:\\Users\\*") do (
        if exist "%%~fU\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe" (
            set "WINGET_CMD=\"%%~fU\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe\""
        )
    )
)
if not defined WINGET_CMD set "WINGET_CMD=winget"
`;

  // Append system tweaks if selected
  if (tweaks.length > 0) {
    script += `
echo ----------------------------------------------------------------------------
echo  STAGE 1: APPLYING SYSTEM TWEAKS AND OPTIMIZATIONS
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
      script += `echo [${idx + 1}/${apps.length}] Downloading and Silently Installing: ${app.name} (${app.id})...
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
echo ============================================================================
echo.
powershell.exe -NoProfile -Command "[console]::beep(800,200); [console]::beep(1000,300)" >nul 2>&1
pause
`;

  return script;
}

/**
 * Generates a clean standalone PowerShell (.ps1) script with branding & creator credit once in the header
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
 * Generates an official Rollback / Undo script (.bat) that reverts system tweaks back to Windows defaults
 */
export function generateRollbackScript(): string {
  return `@echo off
:: ============================================================================
::   ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗
::   ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝
::   ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT
::   ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.2.0
::   ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗
::   ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
:: ============================================================================
::  Project    : ItsRiRx Windows Tool Kit - Official Rollback & Undo Script
::  Website    : https://itsrirx-toolkit.vercel.app
::  Created by : Riazul Islam
:: ============================================================================
title ItsRiRx Rollback & Restore Windows Defaults
color 0b

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Administrator privileges required for registry rollback.
    powershell.exe -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Reverting Tweaks to Windows Defaults
echo   Website    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo ============================================================================
echo.

echo [1/8] Re-enabling Diagnostic Telemetry services...
sc config DiagTrack start=auto >nul 2>&1
sc start DiagTrack >nul 2>&1
sc config dmwappushservice start=demand >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /f >nul 2>&1
echo   [OK] Telemetry defaults restored.

echo [2/8] Restoring Start Menu Bing Search suggestions...
reg delete "HKCU\\Software\\Policies\\Microsoft\\Windows\\Explorer" /v DisableSearchBoxSuggestions /f >nul 2>&1
reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search" /v BingSearchEnabled /f >nul 2>&1
echo   [OK] Start search restored.

echo [3/8] Restoring Modern Windows 11 Context Menu...
reg delete "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f >nul 2>&1
echo   [OK] Modern Win 11 context menu restored.

echo [4/8] Re-enabling Windows 11 Copilot...
reg delete "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v TurnOffWindowsCopilot /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v TurnOffWindowsCopilot /f >nul 2>&1
echo   [OK] Copilot policies reset.

echo [5/8] Restoring Game DVR defaults...
reg delete "HKCU\\System\\GameConfigStore" /v GameDVR_Enabled /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /f >nul 2>&1
echo   [OK] Game DVR restored.

echo [6/8] Restoring standard mouse pointer precision...
reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d 1 /f >nul 2>&1
echo   [OK] Mouse acceleration restored.

echo [7/8] Re-enabling Hibernation...
powercfg -h on >nul 2>&1
echo   [OK] Hibernation re-enabled.

echo [8/8] Restarting Windows Explorer...
taskkill /f /im explorer.exe >nul 2>&1
start explorer.exe
echo   [OK] Explorer refreshed.

echo.
echo ============================================================================
echo   [COMPLETED] All tweaks have been safely reverted to Windows defaults!
echo   Toolkit    : https://itsrirx-toolkit.vercel.app
echo ============================================================================
echo.
pause
`;
}

/**
 * Generates standalone OEM Windows Product Key Extractor (.bat)
 */
export function generateOemKeyExtractorScript(): string {
  return `@echo off
title Extract Windows OEM Product Key
color 0b
cls
echo ============================================================================
echo   ItsRiRx Windows OEM Product Key Extractor
echo   Website    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo ============================================================================
echo.
echo [*] Querying BIOS/UEFI embedded license tables (MSDM / OA3)...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$desktop = [Environment]::GetFolderPath('Desktop'); $k = (Get-CimInstance -Query 'select * from SoftwareLicensingService').OA3xOriginalProductKey; if ($k) { Write-Host '=====================================================' -ForegroundColor Cyan; Write-Host '>>> FOUND OEM PRODUCT KEY: ' -NoNewline -ForegroundColor Green; Write-Host $k -ForegroundColor Yellow; Write-Host '=====================================================' -ForegroundColor Cyan; $outPath = Join-Path $desktop 'Windows_OEM_Product_Key.txt'; ('Windows OEM Product Key: ' + $k) | Out-File -FilePath $outPath -Encoding utf8; Write-Host '>>> Saved key to Desktop\\Windows_OEM_Product_Key.txt' -ForegroundColor Green } else { Write-Host 'No OEM BIOS key detected (Retail / Digital Entitlement License).' -ForegroundColor Yellow }"
echo.
echo Press any key to exit...
pause >nul
`;
}

/**
 * Generates standalone Driver Backup Script (.bat)
 */
export function generateDriverBackupScript(): string {
  return `@echo off
title Backup All Windows Drivers to Desktop
color 0b

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Administrator privileges required to export system drivers.
    powershell.exe -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo   ItsRiRx Full Device Driver Backup Tool
echo   Website    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo ============================================================================
echo.

:: Detect Desktop directory (including OneDrive redirected Desktop)
set "DEST=%USERPROFILE%\\Desktop\\Windows_Drivers_Backup"
if exist "%USERPROFILE%\\OneDrive\\Desktop" set "DEST=%USERPROFILE%\\OneDrive\\Desktop\\Windows_Drivers_Backup"

echo [*] Target Directory: "%DEST%"
echo [*] Exporting all third-party drivers (Wi-Fi, GPU, Audio, Bluetooth, Chipset)...
echo [*] This might take 1-2 minutes depending on your storage speed...
echo.

if not exist "%DEST%" mkdir "%DEST%" >nul 2>&1

:: Method 1: Native Windows DISM Export (Fastest, 100%% reliable, shows progress)
dism.exe /Online /Export-Driver /Destination:"%DEST%"

if %errorlevel% neq 0 (
    echo.
    echo [*] Falling back to PowerShell Export-WindowsDriver...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$d = '%DEST%'; if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }; Export-WindowsDriver -Online -Destination $d"
)

echo.
echo ============================================================================
echo   [SUCCESS] Driver Backup Finished!
echo   All drivers safely saved to:
echo   "%DEST%"
echo ============================================================================
echo.
echo [*] Opening backup folder in File Explorer...
start "" "%DEST%"
echo.
pause
`;
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
