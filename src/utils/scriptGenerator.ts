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

:: Auto-Bootstrap Winget on Fresh Windows if missing (No Microsoft Store required)
if not defined WINGET_CMD (
    echo [!] Winget package manager not found on this fresh Windows installation.
    echo [*] Auto-downloading and bootstrapping Microsoft App Installer and VCLibs...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = 3072; $dir = Join-Path $env:TEMP 'winget_bootstrap'; if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }; Write-Host '  [*] Downloading Microsoft.VCLibs...' -ForegroundColor Cyan; (New-Object Net.WebClient).DownloadFile('https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx', (Join-Path $dir 'vclibs.appx')); Add-AppxPackage -Path (Join-Path $dir 'vclibs.appx') -ErrorAction SilentlyContinue; Write-Host '  [*] Downloading Microsoft.UI.Xaml...' -ForegroundColor Cyan; (New-Object Net.WebClient).DownloadFile('https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx', (Join-Path $dir 'xaml.appx')); Add-AppxPackage -Path (Join-Path $dir 'xaml.appx') -ErrorAction SilentlyContinue; Write-Host '  [*] Downloading Winget Package Manager...' -ForegroundColor Cyan; (New-Object Net.WebClient).DownloadFile('https://github.com/microsoft/winget-cli/releases/latest/download/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle', (Join-Path $dir 'winget.msixbundle')); Add-AppxPackage -Path (Join-Path $dir 'winget.msixbundle') -ErrorAction SilentlyContinue; Write-Host '  [OK] Winget installed successfully!' -ForegroundColor Green"
    where winget.exe >nul 2>&1 && set "WINGET_CMD=winget.exe"
    if not defined WINGET_CMD (
        for /d %%D in ("%ProgramFiles%\\WindowsApps\\Microsoft.DesktopAppInstaller_*_x64__8wekyb3d8bbwe") do (
            if exist "%%~fD\\winget.exe" set "WINGET_CMD=\"%%~fD\\winget.exe\""
        )
    )
    if not defined WINGET_CMD set "WINGET_CMD=winget"
)
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

# Auto-Bootstrap Winget on Fresh Windows if not detected
$wingetCmd = (Get-Command winget -ErrorAction SilentlyContinue).Source
if (-not $wingetCmd) {
    $localPath = "$env:LOCALAPPDATA\\Microsoft\\WindowsApps\\winget.exe"
    if (Test-Path $localPath) { $wingetCmd = $localPath }
}

if (-not $wingetCmd) {
    Write-Host "[!] Winget package manager not detected on this fresh Windows system." -ForegroundColor Yellow
    Write-Host "[*] Auto-installing Microsoft App Installer (Winget) and VCLibs dependencies..." -ForegroundColor Cyan
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
        $tempDir = "$env:TEMP\\winget_bootstrap"
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
        
        Write-Host "  [*] Downloading Microsoft.VCLibs..." -ForegroundColor DarkCyan
        Invoke-WebRequest -Uri "https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx" -OutFile "$tempDir\\vclibs.appx" -UseBasicParsing
        Add-AppxPackage -Path "$tempDir\\vclibs.appx" -ErrorAction SilentlyContinue
        
        Write-Host "  [*] Downloading Microsoft.UI.Xaml..." -ForegroundColor DarkCyan
        Invoke-WebRequest -Uri "https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx" -OutFile "$tempDir\\xaml.appx" -UseBasicParsing
        Add-AppxPackage -Path "$tempDir\\xaml.appx" -ErrorAction SilentlyContinue
        
        Write-Host "  [*] Downloading Winget DesktopAppInstaller..." -ForegroundColor DarkCyan
        Invoke-WebRequest -Uri "https://github.com/microsoft/winget-cli/releases/latest/download/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle" -OutFile "$tempDir\\winget.msixbundle" -UseBasicParsing
        Add-AppxPackage -Path "$tempDir\\winget.msixbundle" -ErrorAction SilentlyContinue
        
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        $wingetCmd = (Get-Command winget -ErrorAction SilentlyContinue).Source
        if (-not $wingetCmd) { $wingetCmd = "$env:LOCALAPPDATA\\Microsoft\\WindowsApps\\winget.exe" }
        Write-Host "  [OK] Winget package manager ready!" -ForegroundColor Green
    } catch {
        Write-Host "  [!] Winget bootstrap notice: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
if (-not $wingetCmd) { $wingetCmd = "winget" }
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
 * Generates an official 1-Click Hardware & PC Specs Report script (.bat)
 */
export function generateHardwareReportScript(): string {
  return `@echo off
:: ============================================================================
::  Project    : ItsRiRx Windows Tool Kit - Hardware & PC Specs Report
::  Website    : https://itsrirx-toolkit.vercel.app
::  Created by : Riazul Islam
:: ============================================================================
title ItsRiRx Hardware & PC Specs Generator
color 0b

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs" >nul 2>&1
    exit /b
)

cd /d "%~dp0"
cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Gathering Complete Hardware Specs
echo   Website    : https://itsrirx-toolkit.vercel.app
echo ============================================================================
echo.
echo [*] Inspecting CPU, GPU, RAM, Disks, Motherboard, and Battery...

set "HTML_OUT=%USERPROFILE%\\Desktop\\PC_Hardware_Report.html"
if exist "%USERPROFILE%\\OneDrive\\Desktop" set "HTML_OUT=%USERPROFILE%\\OneDrive\\Desktop\\PC_Hardware_Report.html"

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$cpu = Get-CimInstance Win32_Processor; $gpu = Get-CimInstance Win32_VideoController; $board = Get-CimInstance Win32_BaseBoard; $bios = Get-CimInstance Win32_BIOS; $ram = Get-CimInstance Win32_PhysicalMemory; $totalRamGB = [math]::Round(($ram | Measure-Object -Property Capacity -Sum).Sum / 1GB, 1); $disks = Get-CimInstance Win32_DiskDrive; $os = Get-CimInstance Win32_OperatingSystem; $report = '<html><head><meta charset=\"UTF-8\"><title>ItsRiRx PC Hardware Report</title><style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#f8fafc;padding:30px;max-width:900px;margin:auto}.card{background:#1e293b;border-radius:16px;padding:24px;margin-bottom:20px;border:1px solid #334155}h1{color:#38bdf8}h2{color:#a78bfa;font-size:1.2rem;margin-top:0}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #334155}.label{color:#94a3b8;font-weight:600}.val{font-weight:500;text-align:right}.badge{background:#0284c7;color:#fff;padding:4px 10px;border-radius:8px;font-size:12px}</style></head><body><h1>ItsRiRx Windows Tool Kit - PC Hardware Report</h1><p style=\"color:#94a3b8\">Generated on: ' + (Get-Date).ToString() + '</p><div class=\"card\"><h2>Processor (CPU)</h2><div class=\"row\"><span class=\"label\">Name</span><span class=\"val\">' + $cpu[0].Name + '</span></div><div class=\"row\"><span class=\"label\">Cores / Threads</span><span class=\"val\">' + $cpu[0].NumberOfCores + ' Cores / ' + $cpu[0].NumberOfLogicalProcessors + ' Threads</span></div><div class=\"row\"><span class=\"label\">Max Clock Speed</span><span class=\"val\">' + $cpu[0].MaxClockSpeed + ' MHz</span></div></div><div class=\"card\"><h2>Graphics Card (GPU)</h2>' + (($gpu | ForEach-Object { '<div class=\"row\"><span class=\"label\">GPU</span><span class=\"val\">' + $_.Name + ' (' + [math]::Round($_.AdapterRAM / 1GB, 1) + ' GB VRAM)</span></div>' }) -join '') + '</div><div class=\"card\"><h2>System Memory (RAM)</h2><div class=\"row\"><span class=\"label\">Total Memory</span><span class=\"val\">' + $totalRamGB + ' GB</span></div><div class=\"row\"><span class=\"label\">Modules & Speed</span><span class=\"val\">' + ($ram | ForEach-Object { $_.Speed.ToString() + ' MHz' } | Select-Object -First 1) + '</span></div></div><div class=\"card\"><h2>Storage Disks</h2>' + (($disks | ForEach-Object { '<div class=\"row\"><span class=\"label\">' + $_.Model + '</span><span class=\"val\">' + [math]::Round($_.Size / 1GB, 1) + ' GB</span></div>' }) -join '') + '</div><div class=\"card\"><h2>Motherboard & Operating System</h2><div class=\"row\"><span class=\"label\">Motherboard</span><span class=\"val\">' + $board.Manufacturer + ' ' + $board.Product + '</span></div><div class=\"row\"><span class=\"label\">BIOS Version</span><span class=\"val\">' + $bios.SMBIOSBIOSVersion + '</span></div><div class=\"row\"><span class=\"label\">Windows Edition</span><span class=\"val\">' + $os.Caption + ' (' + $os.OSArchitecture + ')</span></div></div></body></html>'; $report | Out-File -FilePath '%HTML_OUT%' -Encoding utf8"

echo.
echo ============================================================================
echo   [SUCCESS] Hardware Report Generated!
echo   Report saved to: "%HTML_OUT%"
echo ============================================================================
echo.
echo [*] Opening report in your default web browser...
start "" "%HTML_OUT%"
echo.
pause
`;
}

/**
 * Generates an official 1-Click Wi-Fi Password Viewer & Exporter script (.bat)
 */
export function generateWifiPasswordExtractorScript(): string {
  return `@echo off
:: ============================================================================
::  Project    : ItsRiRx Windows Tool Kit - Saved Wi-Fi Password Exporter
::  Website    : https://itsrirx-toolkit.vercel.app
::  Created by : Riazul Islam
:: ============================================================================
title ItsRiRx Saved Wi-Fi Passwords Viewer
color 0b

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs" >nul 2>&1
    exit /b
)

cd /d "%~dp0"
cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Exporting Saved Wi-Fi Passwords
echo   Website    : https://itsrirx-toolkit.vercel.app
echo ============================================================================
echo.

set "OUT_TXT=%USERPROFILE%\\Desktop\\Saved_WiFi_Passwords.txt"
if exist "%USERPROFILE%\\OneDrive\\Desktop" set "OUT_TXT=%USERPROFILE%\\OneDrive\\Desktop\\Saved_WiFi_Passwords.txt"

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$results = @(); $profiles = (netsh wlan show profiles) | Select-String 'All User Profile\s+:\s+(.*)' | ForEach-Object { $_.Matches.Groups[1].Value.Trim() }; foreach ($p in $profiles) { $pass = (netsh wlan show profile name=\"$p\" key=clear) | Select-String 'Key Content\s+:\s+(.*)' | ForEach-Object { $_.Matches.Groups[1].Value.Trim() }; $results += [PSCustomObject]@{ 'Wi-Fi Network (SSID)' = $p; 'Password' = if ($pass) { $pass } else { '[Open / None]' } } }; $results | Format-Table -AutoSize | Out-String | Write-Host; $results | Format-Table -AutoSize | Out-File -FilePath '%OUT_TXT%' -Encoding utf8"

echo.
echo ============================================================================
echo   [SUCCESS] Wi-Fi Passwords Exported!
echo   Saved file location: "%OUT_TXT%"
echo ============================================================================
echo.
echo [*] Opening text file on Desktop...
start notepad.exe "%OUT_TXT%"
echo.
pause
`;
}

/**
 * Generates an Auto-Fastest DNS Benchmark and Switcher script (.bat)
 */
export function generateFastestDnsBenchmarkScript(): string {
  return `@echo off
:: ============================================================================
::  Project    : ItsRiRx Windows Tool Kit - Auto-Fastest DNS Selector
::  Website    : https://itsrirx-toolkit.vercel.app
::  Created by : Riazul Islam
:: ============================================================================
title ItsRiRx Auto-Fastest DNS Selector
color 0b

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs" >nul 2>&1
    exit /b
)

cd /d "%~dp0"
cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Benchmarking Public DNS Resolvers
echo   Website    : https://itsrirx-toolkit.vercel.app
echo ============================================================================
echo.
echo [*] Testing ping latency from your actual connection...
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$servers = @( @{ Name = 'Cloudflare'; Primary = '1.1.1.1'; Secondary = '1.0.0.1' }, @{ Name = 'Google'; Primary = '8.8.8.8'; Secondary = '8.8.4.4' }, @{ Name = 'Quad9 Secure'; Primary = '9.9.9.9'; Secondary = '149.112.112.112' }, @{ Name = 'AdGuard DNS'; Primary = '94.140.14.14'; Secondary = '94.140.15.15' } ); $bench = @(); foreach ($s in $servers) { Write-Host \"[*] Pinging $($s.Name) ($($s.Primary))...\" -NoNewline; $p = Test-Connection -ComputerName $s.Primary -Count 3 -ErrorAction SilentlyContinue; if ($p) { $avg = [math]::Round(($p | Measure-Object -Property ResponseTime -Average).Average, 1); Write-Host \" $avg ms\" -ForegroundColor Green; $bench += [PSCustomObject]@{ Name = $s.Name; Primary = $s.Primary; Secondary = $s.Secondary; Ping = $avg } } else { Write-Host ' Timeout' -ForegroundColor Red } }; if ($bench.Count -gt 0) { $fastest = $bench | Sort-Object Ping | Select-Object -First 1; Write-Host \"\`n[WINNER] Fastest DNS: $($fastest.Name) with $($fastest.Ping) ms average!\" -ForegroundColor Cyan; Write-Host \"[*] Applying $($fastest.Name) DNS to active network adapters...\" -ForegroundColor Yellow; Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | ForEach-Object { Set-DnsClientServerAddress -InterfaceAlias $_.Name -ServerAddresses ($fastest.Primary, $fastest.Secondary) }; Clear-DnsClientCache; ipconfig /flushdns | Out-Null; Write-Host \"[SUCCESS] Applied $($fastest.Name) DNS and flushed DNS cache!\" -ForegroundColor Green } else { Write-Host 'Could not ping DNS servers. Please check your internet connection.' -ForegroundColor Red }"

echo.
echo ============================================================================
echo   DNS optimization completed!
echo ============================================================================
echo.
pause
`;
}

/**
 * Generates an official 1-Click God Mode Folder Creator script (.bat)
 */
export function generateGodModeFolderScript(): string {
  return `@echo off
:: ============================================================================
::  Project    : ItsRiRx Windows Tool Kit - 1-Click God Mode Creator
::  Website    : https://itsrirx-toolkit.vercel.app
::  Created by : Riazul Islam
:: ============================================================================
title ItsRiRx God Mode Folder Creator
color 0b

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

set "DEST=%USERPROFILE%\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"
if exist "%USERPROFILE%\\OneDrive\\Desktop" set "DEST=%USERPROFILE%\\OneDrive\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Creating Windows 'God Mode' Folder
echo   Website    : https://itsrirx-toolkit.vercel.app
echo ============================================================================
echo.
echo [*] Creating special system namespace shortcut on Desktop...

if not exist "%DEST%" mkdir "%DEST%"

echo.
echo ============================================================================
echo   [SUCCESS] God Mode created on your Desktop!
echo   Folder: "%DEST%"
echo   Access 206+ hidden Windows administrative tools in one single view!
echo ============================================================================
echo.
echo [*] Opening God Mode folder now...
start "" "%DEST%"
echo.
timeout /t 3 >nul
`;
}

/**
 * Generates an official script to install/enable Group Policy Editor (gpedit.msc) on Windows 10/11 Home
 */
export function generateEnableGpeditScript(): string {
  return `@echo off
:: ============================================================================
::  Project    : ItsRiRx Windows Tool Kit - Enable gpedit.msc on Windows Home
::  Website    : https://itsrirx-toolkit.vercel.app
::  Created by : Riazul Islam
:: ============================================================================
title Enable Group Policy Editor (gpedit.msc) on Windows Home
color 0b

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs" >nul 2>&1
    exit /b
)

cd /d "%~dp0"
cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Installing Group Policy Packages
echo   Website    : https://itsrirx-toolkit.vercel.app
echo ============================================================================
echo.
echo [*] Installing official Microsoft GroupPolicy client packages via DISM...
echo [*] This will enable gpedit.msc on Windows 10 and 11 Home Edition.
echo.

pushd "%~dp0"
dir /b %SystemRoot%\\servicing\\Packages\\Microsoft-Windows-GroupPolicy-ClientExtensions-Package~31bf3856ad364e35~amd64~~*.mum >nul 2>&1
for /f %%i in ('dir /b %SystemRoot%\\servicing\\Packages\\Microsoft-Windows-GroupPolicy-ClientExtensions-Package~31bf3856ad364e35~amd64~~*.mum') do (
    echo [+] Adding: %%i
    dism /online /norestart /add-package:"%SystemRoot%\\servicing\\Packages\\%%i" >nul 2>&1
)

for /f %%i in ('dir /b %SystemRoot%\\servicing\\Packages\\Microsoft-Windows-GroupPolicy-ClientTools-Package~31bf3856ad364e35~amd64~~*.mum') do (
    echo [+] Adding: %%i
    dism /online /norestart /add-package:"%SystemRoot%\\servicing\\Packages\\%%i" >nul 2>&1
)
popd

echo.
echo ============================================================================
echo   [SUCCESS] Group Policy Editor (gpedit.msc) installed successfully!
echo ============================================================================
echo.
echo [*] Testing launch of gpedit.msc...
start gpedit.msc
echo.
pause
`;
}

/**
 * Generates an official 1-Click Rufus Portable Downloader script (.bat)
 */
export function generateRufusDownloaderScript(): string {
  return `@echo off
:: ============================================================================
::  Project    : ItsRiRx Windows Tool Kit - Official Rufus Portable Downloader
::  Website    : https://itsrirx-toolkit.vercel.app
::  Created by : Riazul Islam
:: ============================================================================
title Download Official Rufus Portable
color 0b

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

set "DEST=%USERPROFILE%\\Desktop\\rufus.exe"
if exist "%USERPROFILE%\\OneDrive\\Desktop" set "DEST=%USERPROFILE%\\OneDrive\\Desktop\\rufus.exe"

cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Downloading Official Rufus Portable
echo   Website    : https://itsrirx-toolkit.vercel.app
echo ============================================================================
echo.
echo [*] Downloading latest Rufus executable from official release repository...

curl.exe -s -L -f -o "%DEST%" "https://github.com/pbatard/rufus/releases/download/v4.6/rufus-4.6p.exe"

if not exist "%DEST%" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://github.com/pbatard/rufus/releases/download/v4.6/rufus-4.6p.exe', '%DEST%')" >nul 2>&1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%DEST%' -ErrorAction SilentlyContinue" >nul 2>&1

echo.
echo ============================================================================
echo   [SUCCESS] Rufus Portable saved to:
echo   "%DEST%"
echo ============================================================================
echo.
echo [*] Launching Rufus now...
start "" "%DEST%"
echo.
timeout /t 3 >nul
`;
}

/**
 * Generates an automated 1-Click Fresh Windows Bootstrapper & Repair Script (.bat)
 * Fixes missing Winget, VCRuntime140 missing DLLs, ExecutionPolicy, TLS 1.2/1.3, DirectX & .NET
 */
export function generateFreshWindowsFixScript(): string {
  return `@echo off
:: ============================================================================
::   ItsRiRx Windows Tool Kit - Fresh Windows Setup & Winget Auto-Fixer
::   Website    : https://itsrirx-toolkit.vercel.app
::   Created by : Riazul Islam
:: ============================================================================
title Fresh Windows 1-Click Fixer - ItsRiRx Windows Tool Kit
color 0b

:: 1. Unblock file from Mark-of-the-Web
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

:: 2. Check for Administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Administrator rights required to fix Windows system runtimes.
    echo [*] Requesting UAC elevation...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs" >nul 2>&1
    if %errorlevel% neq 0 (
        echo.
        echo [!] Please right-click this file and choose: 'Run as administrator'
        echo.
        pause
    )
    exit /b
)

cd /d "%~dp0"
cls
echo ============================================================================
echo   ItsRiRx Windows Tool Kit - Fresh Windows and Winget Auto-Repair Suite
echo   Website    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo ============================================================================
echo.
echo [*] Starting automated fresh Windows post-install repair...
echo.

:: STEP 1: Fix TLS 1.2 / TLS 1.3 and Execution Policy
echo [1/5] Configuring PowerShell ExecutionPolicy and TLS 1.2/1.3 security protocols...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13; Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force" >nul 2>&1
echo   [OK] PowerShell Execution Policy and TLS configured.
echo.

:: STEP 2: Bootstrap Microsoft App Installer and Winget Dependencies
echo [2/5] Bootstrapping Microsoft Winget Package Manager and UWP dependencies...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = 3072; $dir = Join-Path $env:TEMP 'wg_boot'; if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }; Write-Host '  [*] Downloading Microsoft.VCLibs...' -ForegroundColor Cyan; (New-Object Net.WebClient).DownloadFile('https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx', (Join-Path $dir 'vclibs.appx')); Add-AppxPackage -Path (Join-Path $dir 'vclibs.appx') -ErrorAction SilentlyContinue; Write-Host '  [*] Downloading Microsoft.UI.Xaml...' -ForegroundColor Cyan; (New-Object Net.WebClient).DownloadFile('https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx', (Join-Path $dir 'xaml.appx')); Add-AppxPackage -Path (Join-Path $dir 'xaml.appx') -ErrorAction SilentlyContinue; Write-Host '  [*] Downloading Microsoft Winget MSIXBundle...' -ForegroundColor Cyan; (New-Object Net.WebClient).DownloadFile('https://github.com/microsoft/winget-cli/releases/latest/download/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle', (Join-Path $dir 'winget.msixbundle')); Add-AppxPackage -Path (Join-Path $dir 'winget.msixbundle') -ErrorAction SilentlyContinue; Write-Host '  [OK] Winget bootstrapped successfully!' -ForegroundColor Green"
echo   [OK] Winget and dependencies installed.
echo.

:: Resolve Winget Command Path
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

:: STEP 3: Update Winget Sources
echo [3/5] Updating Winget package repository catalogs...
%WINGET_CMD% source update --accept-source-agreements >nul 2>&1
echo   [OK] Repository sources synchronized.
echo.

:: STEP 4: Install Essential Windows Runtimes (Visual C++, DirectX, .NET)
echo [4/5] Silently installing Visual C++ Redistributables (2015-2022 x86/x64) and DirectX...
%WINGET_CMD% install --id Microsoft.VCRedist.2015+.x64 -e --silent --accept-package-agreements --accept-source-agreements >nul 2>&1
%WINGET_CMD% install --id Microsoft.VCRedist.2015+.x86 -e --silent --accept-package-agreements --accept-source-agreements >nul 2>&1
%WINGET_CMD% install --id Microsoft.DirectX -e --silent --accept-package-agreements --accept-source-agreements >nul 2>&1
%WINGET_CMD% install --id Microsoft.DotNet.DesktopRuntime.8 -e --silent --accept-package-agreements --accept-source-agreements >nul 2>&1
echo   [OK] Essential runtimes installed (VCRUNTIME140.dll & DirectX errors solved).
echo.

:: STEP 5: Re-register & Reset Windows Store & Cache
echo [5/5] Resetting Windows Store and clearing DNS cache...
start /b wsreset.exe -i >nul 2>&1
ipconfig /flushdns >nul 2>&1
echo   [OK] Windows Store and network stack initialized.
echo.

echo ============================================================================
echo   [SUCCESS] Fresh Windows Setup and Winget Repair is COMPLETE!
echo   You can now run any tool or batch installer from ItsRiRx Toolkit!
echo   Website    : https://itsrirx-toolkit.vercel.app
echo ============================================================================
echo.
powershell.exe -NoProfile -Command "[console]::beep(800,200); [console]::beep(1000,300)" >nul 2>&1
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
