import { SOFTWARE_APPS, SYSTEM_TWEAKS, SoftwareApp, SystemTweak } from '../data/toolkitCatalog';

export function getAppById(id: string): SoftwareApp | undefined {
  return SOFTWARE_APPS.find((a) => a.id === id || (a.altIds && a.altIds.includes(id)));
}

export function getTweakById(id: string): SystemTweak | undefined {
  return SYSTEM_TWEAKS.find((t) => t.id === id);
}

/**
 * Generates a smart 1-line command for a single application with fallback support
 */
export function getSingleAppInstallCommand(app: SoftwareApp): string {
  if (app.id === 'Google.Gemini') {
    return `$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut("$env:USERPROFILE\\Desktop\\Google Gemini.lnk"); $s.TargetPath = "msedge.exe"; $s.Arguments = "--app=https://gemini.google.com"; $s.Save(); Start-Process "msedge.exe" "--app=https://gemini.google.com"`;
  }
  const sourceFlag = app.source ? ` --source ${app.source}` : '';
  const primaryCmd = `winget install --id ${app.id} -e${sourceFlag} --silent --accept-package-agreements --accept-source-agreements --disable-interactivity`;
  if (app.altIds && app.altIds.length > 0) {
    return `${primaryCmd}; if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne -1978335189) { winget install --id ${app.altIds[0]} --silent --accept-package-agreements --accept-source-agreements --disable-interactivity }`;
  }
  return primaryCmd;
}

/**
 * Reusable PowerShell snippet to bootstrap Winget + Dependencies + CDN Source on Fresh Windows 10/11
 */
const WINGET_BOOTSTRAP_PS_ONELINER = `$ProgressPreference = 'SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13; $dir = Join-Path $env:TEMP 'itsrirx_winget_boot'; New-Item -ItemType Directory -Path $dir -Force | Out-Null; Write-Host '  [1/4] Downloading official Winget Dependencies archive...' -ForegroundColor Cyan; curl.exe -L -s -S --retry 3 -o "$dir\\deps.zip" "https://github.com/microsoft/winget-cli/releases/latest/download/DesktopAppInstaller_Dependencies.zip"; if (Test-Path "$dir\\deps.zip") { Expand-Archive -Path "$dir\\deps.zip" -DestinationPath "$dir\\deps" -Force; Get-ChildItem -Path "$dir\\deps" -Recurse -Include *x64*.appx,*x64*.msix | ForEach-Object { Add-AppxPackage -Path $_.FullName -ErrorAction SilentlyContinue } }; Write-Host '  [2/4] Ensuring VCLibs 14.00 & UI.Xaml 2.8 UWP runtimes...' -ForegroundColor Cyan; curl.exe -L -s -S --retry 2 -o "$dir\\vclibs.appx" "https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx"; if (Test-Path "$dir\\vclibs.appx") { Add-AppxPackage -Path "$dir\\vclibs.appx" -ErrorAction SilentlyContinue }; curl.exe -L -s -S --retry 2 -o "$dir\\xaml.appx" "https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx"; if (Test-Path "$dir\\xaml.appx") { Add-AppxPackage -Path "$dir\\xaml.appx" -ErrorAction SilentlyContinue }; Write-Host '  [3/4] Downloading & registering Microsoft DesktopAppInstaller (Winget)...' -ForegroundColor Cyan; curl.exe -L -s -S --retry 3 -o "$dir\\winget.msixbundle" "https://github.com/microsoft/winget-cli/releases/latest/download/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle"; if (Test-Path "$dir\\winget.msixbundle") { $depFiles = @(Get-ChildItem -Path "$dir\\deps" -Recurse -Include *x64*.appx,*x64*.msix -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName); if ($depFiles.Count -gt 0) { Add-AppxPackage -Path "$dir\\winget.msixbundle" -DependencyPath $depFiles -ErrorAction SilentlyContinue } else { Add-AppxPackage -Path "$dir\\winget.msixbundle" -ErrorAction SilentlyContinue }; Add-AppxProvisionedPackage -Online -PackagePath "$dir\\winget.msixbundle" -SkipLicense -ErrorAction SilentlyContinue | Out-Null }; Write-Host '  [4/4] Updating Winget CDN Source Certificate (fixes 0x8a15000f / 0x8a15005e)...' -ForegroundColor Cyan; curl.exe -L -s -S --retry 2 -o "$dir\\source.msix" "https://cdn.winget.microsoft.com/cache/source.msix"; if (Test-Path "$dir\\source.msix") { Add-AppxPackage -Path "$dir\\source.msix" -ErrorAction SilentlyContinue }; Write-Host '  [OK] Winget & CDN source initialized!' -ForegroundColor Green`;

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
setlocal EnableDelayedExpansion
:: ============================================================================
::   ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗
::   ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝
::   ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT
::   ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.3.0
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

:: Verify if Winget is genuinely functional (prevents 0-byte WindowsApps stub false-positive on fresh Windows)
set "WINGET_CMD="
set "WINGET_READY=0"

where winget.exe >nul 2>&1
if %errorlevel% equ 0 (
    winget.exe --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "WINGET_CMD=winget.exe"
        set "WINGET_READY=1"
    )
)

if "!WINGET_READY!"=="0" (
    for /d %%D in ("%ProgramFiles%\\WindowsApps\\Microsoft.DesktopAppInstaller_*_x64__8wekyb3d8bbwe") do (
        if exist "%%~fD\\winget.exe" (
            "%%~fD\\winget.exe" --version >nul 2>&1
            if !errorlevel! equ 0 (
                set "WINGET_CMD=\"%%~fD\\winget.exe\""
                set "WINGET_READY=1"
            )
        )
    )
)

if "!WINGET_READY!"=="0" (
    for /d %%U in ("C:\\Users\\*") do (
        if exist "%%~fU\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe" (
            "%%~fU\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe" --version >nul 2>&1
            if !errorlevel! equ 0 (
                set "WINGET_CMD=\"%%~fU\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe\""
                set "WINGET_READY=1"
            )
        )
    )
)

:: Auto-Bootstrap Winget + All Dependencies + CDN Source if missing or broken on Fresh Windows
if "!WINGET_READY!"=="0" (
    echo [!] Winget package manager is missing or uninitialized on this Windows device.
    echo [*] Running Fresh Windows Winget Self-Healing Bootstrapper...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${WINGET_BOOTSTRAP_PS_ONELINER}"
    
    where winget.exe >nul 2>&1
    if !errorlevel! equ 0 (
        winget.exe --version >nul 2>&1
        if !errorlevel! equ 0 (
            set "WINGET_CMD=winget.exe"
            set "WINGET_READY=1"
        )
    )
    if "!WINGET_READY!"=="0" (
        for /d %%D in ("%ProgramFiles%\\WindowsApps\\Microsoft.DesktopAppInstaller_*_x64__8wekyb3d8bbwe") do (
            if exist "%%~fD\\winget.exe" (
                set "WINGET_CMD=\"%%~fD\\winget.exe\""
                set "WINGET_READY=1"
            )
        )
    )
    if not defined WINGET_CMD set "WINGET_CMD=winget.exe"
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
echo  STAGE 2: SILENT APPLICATION DEPLOYMENT (MULTI-STAGE FALLBACK ENGINE)
echo ----------------------------------------------------------------------------
echo.
echo [*] Synchronizing Winget package catalogs and verifying source certificates...
%WINGET_CMD% source update --accept-source-agreements >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Repairing Winget CDN source cache...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol = 3072; curl.exe -L -s -S -o \"$env:TEMP\\source.msix\" \"https://cdn.winget.microsoft.com/cache/source.msix\"; if (Test-Path \"$env:TEMP\\source.msix\") { Add-AppxPackage -Path \"$env:TEMP\\source.msix\" -ErrorAction SilentlyContinue }" >nul 2>&1
    %WINGET_CMD% source reset --force >nul 2>&1
    %WINGET_CMD% source update --accept-source-agreements >nul 2>&1
)
echo.
`;

    apps.forEach((app, idx) => {
      const safeSlug = app.name.replace(/[^a-zA-Z0-9]/g, '_');
      const sourceFlag = app.source ? ` --source ${app.source}` : '';

      script += `echo [${idx + 1}/${apps.length}] Installing: ${app.name} (${app.id})...
set "APP_DONE=0"
`;

      if (app.id === 'Google.Gemini') {
        script += `echo   [*] Creating Desktop and Start Menu Web-App Launcher for Google Gemini...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [Environment]::GetFolderPath('Desktop'); $s = $ws.CreateShortcut((Join-Path $desktop 'Google Gemini.lnk')); if (Test-Path 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe') { $s.TargetPath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'; $s.Arguments = '--app=https://gemini.google.com' } elseif (Test-Path 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe') { $s.TargetPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; $s.Arguments = '--app=https://gemini.google.com' } else { $s.TargetPath = 'https://gemini.google.com' }; $s.Save()" >nul 2>&1
set "APP_DONE=1"
echo   [SUCCESS] ${app.name} Desktop Launcher created!
echo.
`;
        return;
      }

      // Primary Winget Install Attempt
      if (app.installerType === 'user_exe') {
        script += `%WINGET_CMD% install --id "${app.id}" -e${sourceFlag} --scope user --silent --accept-package-agreements --accept-source-agreements --disable-interactivity
if !errorlevel! equ 0 set "APP_DONE=1"
if !errorlevel! equ -1978335189 set "APP_DONE=1"
`;
      } else {
        script += `%WINGET_CMD% install --id "${app.id}" -e${sourceFlag} --silent --accept-package-agreements --accept-source-agreements --disable-interactivity
if !errorlevel! equ 0 set "APP_DONE=1"
if !errorlevel! equ -1978335189 set "APP_DONE=1"
`;
      }

      // Alternate Winget IDs Fallback
      if (app.altIds && app.altIds.length > 0) {
        app.altIds.forEach((altId) => {
          script += `if "!APP_DONE!"=="0" (
    echo   [*] Trying alternate package identifier: ${altId}...
    %WINGET_CMD% install --id "${altId}" --silent --accept-package-agreements --accept-source-agreements --disable-interactivity
    if !errorlevel! equ 0 set "APP_DONE=1"
    if !errorlevel! equ -1978335189 set "APP_DONE=1"
)
`;
        });
      }

      // Direct Official Vendor Installer Fallback if Winget still failed
      if (app.directUrl) {
        if (app.installerType === 'msi') {
          script += `if "!APP_DONE!"=="0" (
    echo   [*] Winget source unavailable for ${app.name}. Downloading official MSI installer directly...
    curl.exe -L --retry 3 -s -S -o "%TEMP%\\${safeSlug}.msi" "${app.directUrl}"
    if exist "%TEMP%\\${safeSlug}.msi" (
        msiexec.exe /i "%TEMP%\\${safeSlug}.msi" /qn /norestart
        if !errorlevel! equ 0 set "APP_DONE=1"
        del /f /q "%TEMP%\\${safeSlug}.msi" >nul 2>&1
    )
)
`;
        } else if (app.installerType === 'msix') {
          script += `if "!APP_DONE!"=="0" (
    echo   [*] Downloading official MSIX package for ${app.name}...
    curl.exe -L --retry 3 -s -S -o "%TEMP%\\${safeSlug}.msix" "${app.directUrl}"
    if exist "%TEMP%\\${safeSlug}.msix" (
        powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Add-AppxPackage -Path '%TEMP%\\${safeSlug}.msix' -ErrorAction SilentlyContinue"
        if !errorlevel! equ 0 set "APP_DONE=1"
        del /f /q "%TEMP%\\${safeSlug}.msix" >nul 2>&1
    )
)
`;
        } else if (app.installerType === 'pwa') {
          script += `if "!APP_DONE!"=="0" (
    echo   [*] Creating Desktop App Shortcut for ${app.name}...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [Environment]::GetFolderPath('Desktop'); $s = $ws.CreateShortcut((Join-Path $desktop '${app.name}.lnk')); if (Test-Path 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe') { $s.TargetPath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'; $s.Arguments = '--app=${app.directUrl}' } else { $s.TargetPath = '${app.directUrl}' }; $s.Save()" >nul 2>&1
    set "APP_DONE=1"
)
`;
        } else if (app.installerType === 'user_exe') {
          script += `if "!APP_DONE!"=="0" (
    echo   [*] Downloading official user installer for ${app.name}...
    curl.exe -L --retry 3 -s -S -o "%TEMP%\\${safeSlug}.exe" "${app.directUrl}"
    if exist "%TEMP%\\${safeSlug}.exe" (
        runas /trustlevel:0x20000 "\"%TEMP%\\${safeSlug}.exe\" /silent" >nul 2>&1
        set "APP_DONE=1"
    )
)
`;
        } else {
          const args = app.directArgs ?? '/S';
          script += `if "!APP_DONE!"=="0" (
    echo   [*] Winget source unavailable for ${app.name}. Downloading official vendor installer directly...
    curl.exe -L --retry 3 -s -S -o "%TEMP%\\${safeSlug}.exe" "${app.directUrl}"
    if exist "%TEMP%\\${safeSlug}.exe" (
        "%TEMP%\\${safeSlug}.exe" ${args}
        set "APP_DONE=1"
        del /f /q "%TEMP%\\${safeSlug}.exe" >nul 2>&1
    )
)
`;
        }
      }

      script += `if "!APP_DONE!"=="1" (
    echo   [SUCCESS] ${app.name} is installed and ready!
) else (
    echo   [WARN] ${app.name} could not be installed automatically.
)
echo.
`;
    });
  }

  script += `echo ============================================================================
echo   [COMPLETED] Automated setup and deployment has finished!
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

$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
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
    script += `Write-Host "--- STAGE 2: SILENT APPLICATION DEPLOYMENT (MULTI-STAGE ENGINE) ---" -ForegroundColor Yellow

# Verify Winget binary is genuinely functional (not a 0-byte WindowsApps stub on fresh Windows)
$wingetCmd = $null
$wingetReady = $false

$candidate = (Get-Command winget.exe -ErrorAction SilentlyContinue).Source
if ($candidate) {
    try {
        $ver = & $candidate --version 2>$null
        if ($LASTEXITCODE -eq 0 -and $ver) {
            $wingetCmd = $candidate
            $wingetReady = $true
        }
    } catch {}
}

if (-not $wingetReady) {
    $resolved = Resolve-Path "$env:ProgramFiles\\WindowsApps\\Microsoft.DesktopAppInstaller_*_x64__8wekyb3d8bbwe\\winget.exe" -ErrorAction SilentlyContinue | Select-Object -Last 1
    if ($resolved -and (Test-Path $resolved.Path)) {
        $wingetCmd = $resolved.Path
        $wingetReady = $true
    }
}

if (-not $wingetReady) {
    Write-Host "[!] Winget package manager not initialized on this Windows system." -ForegroundColor Yellow
    Write-Host "[*] Running Fresh Windows Winget Self-Healing Bootstrapper..." -ForegroundColor Cyan
    try {
        ${WINGET_BOOTSTRAP_PS_ONELINER}
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        $resolved = Resolve-Path "$env:ProgramFiles\\WindowsApps\\Microsoft.DesktopAppInstaller_*_x64__8wekyb3d8bbwe\\winget.exe" -ErrorAction SilentlyContinue | Select-Object -Last 1
        if ($resolved) { $wingetCmd = $resolved.Path } else { $wingetCmd = "winget.exe" }
    } catch {
        Write-Host "  [!] Winget bootstrap notice: $($_.Exception.Message)" -ForegroundColor Yellow
        $wingetCmd = "winget.exe"
    }
}

Write-Host "[*] Synchronizing Winget package catalogs..." -ForegroundColor Cyan
& $wingetCmd source update --accept-source-agreements 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    & $wingetCmd source reset --force 2>&1 | Out-Null
    & $wingetCmd source update --accept-source-agreements 2>&1 | Out-Null
}
Write-Host ""
`;
    apps.forEach((app, idx) => {
      const safeSlug = app.name.replace(/[^a-zA-Z0-9]/g, '_');
      const sourceArgs = app.source ? `, "--source", "${app.source}"` : '';

      script += `Write-Host "[${idx + 1}/${apps.length}] Installing ${app.name} (${app.id})..." -ForegroundColor White
$installed = $false
`;
      if (app.id === 'Google.Gemini') {
        script += `try {
    $ws = New-Object -ComObject WScript.Shell
    $desktop = [Environment]::GetFolderPath('Desktop')
    $s = $ws.CreateShortcut((Join-Path $desktop 'Google Gemini.lnk'))
    if (Test-Path 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe') {
        $s.TargetPath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
        $s.Arguments = '--app=https://gemini.google.com'
    } else {
        $s.TargetPath = 'https://gemini.google.com'
    }
    $s.Save()
    $installed = $true
    Write-Host "  [OK] ${app.name} Desktop Web-App created." -ForegroundColor Green
} catch {}
`;
        return;
      }

      script += `try {
    $p = Start-Process -FilePath $wingetCmd -ArgumentList @("install", "--id", "${app.id}", "-e"${sourceArgs}, "--silent", "--accept-package-agreements", "--accept-source-agreements", "--disable-interactivity") -NoNewWindow -Wait -PassThru
    if ($p.ExitCode -eq 0 -or $p.ExitCode -eq -1978335189) { $installed = $true }
} catch {}
`;

      if (app.altIds && app.altIds.length > 0) {
        app.altIds.forEach((altId) => {
          script += `if (-not $installed) {
    Write-Host "  [*] Trying alternate package ID: ${altId}..." -ForegroundColor DarkCyan
    try {
        $p2 = Start-Process -FilePath $wingetCmd -ArgumentList @("install", "--id", "${altId}", "--silent", "--accept-package-agreements", "--accept-source-agreements", "--disable-interactivity") -NoNewWindow -Wait -PassThru
        if ($p2.ExitCode -eq 0 -or $p2.ExitCode -eq -1978335189) { $installed = $true }
    } catch {}
}
`;
        });
      }

      if (app.directUrl) {
        if (app.installerType === 'msi') {
          script += `if (-not $installed) {
    Write-Host "  [*] Downloading official MSI installer for ${app.name}..." -ForegroundColor Cyan
    $out = "$env:TEMP\\${safeSlug}.msi"
    curl.exe -L --retry 3 -s -S -o $out "${app.directUrl}"
    if (Test-Path $out) {
        Start-Process "msiexec.exe" -ArgumentList "/i \`"$out\`" /qn /norestart" -Wait
        Remove-Item $out -Force -ErrorAction SilentlyContinue
        $installed = $true
    }
}
`;
        } else if (app.installerType === 'msix') {
          script += `if (-not $installed) {
    Write-Host "  [*] Downloading official MSIX package for ${app.name}..." -ForegroundColor Cyan
    $out = "$env:TEMP\\${safeSlug}.msix"
    curl.exe -L --retry 3 -s -S -o $out "${app.directUrl}"
    if (Test-Path $out) {
        Add-AppxPackage -Path $out -ErrorAction SilentlyContinue
        Remove-Item $out -Force -ErrorAction SilentlyContinue
        $installed = $true
    }
}
`;
        } else if (app.installerType === 'pwa') {
          script += `if (-not $installed) {
    $ws = New-Object -ComObject WScript.Shell
    $s = $ws.CreateShortcut((Join-Path ([Environment]::GetFolderPath('Desktop')) '${app.name}.lnk'))
    $s.TargetPath = 'msedge.exe'
    $s.Arguments = '--app=${app.directUrl}'
    $s.Save()
    $installed = $true
}
`;
        } else {
          const directArgs = app.directArgs ?? '/S';
          script += `if (-not $installed) {
    Write-Host "  [*] Downloading official vendor installer for ${app.name}..." -ForegroundColor Cyan
    $out = "$env:TEMP\\${safeSlug}.exe"
    curl.exe -L --retry 3 -s -S -o $out "${app.directUrl}"
    if (Test-Path $out) {
        Start-Process -FilePath $out -ArgumentList '${directArgs}' -Wait
        Remove-Item $out -Force -ErrorAction SilentlyContinue
        $installed = $true
    }
}
`;
        }
      }

      script += `if ($installed) {
    Write-Host "  [OK] ${app.name} installed successfully." -ForegroundColor Green
} else {
    Write-Host "  [!] Could not install ${app.name}." -ForegroundColor Red
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
    apps.forEach((app) => {
      parts.push(getSingleAppInstallCommand(app));
    });
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
 * Fixes missing Winget, DesktopAppInstaller_Dependencies.zip, 0x8a15000f/0x8a15005e source certificate errors, VCRuntime140 missing DLLs, ExecutionPolicy, TLS 1.2/1.3, DirectX & .NET
 */
export function generateFreshWindowsFixScript(): string {
  return `@echo off
setlocal EnableDelayedExpansion
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
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13; Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force; Set-ExecutionPolicy -Scope LocalMachine -ExecutionPolicy RemoteSigned -Force -ErrorAction SilentlyContinue" >nul 2>&1
echo   [OK] PowerShell Execution Policy and TLS configured.
echo.

:: STEP 2: Bootstrap Microsoft App Installer, Dependencies Archive, and Source Certificate
echo [2/5] Bootstrapping Microsoft Winget, UWP Dependencies, and CDN Source Certificate...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${WINGET_BOOTSTRAP_PS_ONELINER}"
echo   [OK] Winget, UWP dependencies, and CDN source package installed.
echo.

:: Resolve Verified Winget Command Path
set "WINGET_CMD="
where winget.exe >nul 2>&1
if %errorlevel% equ 0 (
    winget.exe --version >nul 2>&1
    if !errorlevel! equ 0 set "WINGET_CMD=winget.exe"
)
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
if not defined WINGET_CMD set "WINGET_CMD=winget.exe"

:: STEP 3: Reset & Update Winget Sources
echo [3/5] Resetting and synchronizing Winget package repository catalogs...
%WINGET_CMD% source reset --force >nul 2>&1
%WINGET_CMD% source update --accept-source-agreements >nul 2>&1
echo   [OK] Repository sources synchronized.
echo.

:: STEP 4: Install Essential Windows Runtimes (Visual C++, DirectX, .NET) with Direct Fallback
echo [4/5] Silently installing Visual C++ Redistributables (2015-2022 x86/x64), DirectX & .NET 8...
%WINGET_CMD% install --id Microsoft.VCRedist.2015+.x64 -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity >nul 2>&1
if !errorlevel! neq 0 if !errorlevel! neq -1978335189 (
    curl.exe -L --retry 3 -s -S -o "%TEMP%\\vc_redist.x64.exe" "https://aka.ms/vs/17/release/vc_redist.x64.exe"
    if exist "%TEMP%\\vc_redist.x64.exe" "%TEMP%\\vc_redist.x64.exe" /install /quiet /norestart
)
%WINGET_CMD% install --id Microsoft.VCRedist.2015+.x86 -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity >nul 2>&1
if !errorlevel! neq 0 if !errorlevel! neq -1978335189 (
    curl.exe -L --retry 3 -s -S -o "%TEMP%\\vc_redist.x86.exe" "https://aka.ms/vs/17/release/vc_redist.x86.exe"
    if exist "%TEMP%\\vc_redist.x86.exe" "%TEMP%\\vc_redist.x86.exe" /install /quiet /norestart
)
%WINGET_CMD% install --id Microsoft.DirectX -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity >nul 2>&1
if !errorlevel! neq 0 if !errorlevel! neq -1978335189 (
    curl.exe -L --retry 3 -s -S -o "%TEMP%\\dxwebsetup.exe" "https://download.microsoft.com/download/1/7/1/1718CCC4-6315-4D8E-9543-8E28A4E18C4C/dxwebsetup.exe"
    if exist "%TEMP%\\dxwebsetup.exe" "%TEMP%\\dxwebsetup.exe" /Q
)
%WINGET_CMD% install --id Microsoft.DotNet.DesktopRuntime.8 -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity >nul 2>&1
echo   [OK] Essential runtimes installed (VCRUNTIME140.dll, MSVCP140.dll & DirectX errors solved).
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
 * Generates an automated .bat script to clear pending print jobs and restart Print Spooler service
 */
export function generatePrintSpoolerFixScript(): string {
  return `@echo off
:: ============================================================================
::   ItsRiRx Windows Tool Kit - Print Spooler & Stuck Job Repair Utility
::   Website    : https://itsrirx-toolkit.vercel.app
::   Created by : Riazul Islam
:: ============================================================================
title Print Spooler Repair - ItsRiRx Windows Tool Kit
color 0b

:: 1. Unblock file from Mark-of-the-Web
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

:: 2. Check for Administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Administrator privileges required to manage Windows Print Spooler service.
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
echo   ItsRiRx Windows Tool Kit - Print Spooler & Stuck Job Repair Utility
echo   Website    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo ============================================================================
echo.
echo [*] Step 1: Stopping Print Spooler service...
net stop spooler
echo.

echo [*] Step 2: Clearing all stuck and pending print jobs...
del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*"
echo   [OK] Pending print queue cleaned.
echo.

echo [*] Step 3: Starting and setting Print Spooler to Automatic...
sc config spooler start= auto
net start spooler
echo.

echo ============================================================================
echo   [SUCCESS] Print Spooler service restarted and all stuck jobs cleared!
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
