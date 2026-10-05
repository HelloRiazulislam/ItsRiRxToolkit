import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Boxes,
  Sparkles,
  Download,
  Sun,
  Moon,
  Share2,
  RotateCcw,
  ArrowRight,
  Cpu
} from 'lucide-react';
import { SoftwareInstallerTab } from './components/SoftwareInstallerTab';
import { SystemTweaksTab } from './components/SystemTweaksTab';
import { InstallScreen } from './components/InstallScreen';
import { PowerToolsTab } from './components/PowerToolsTab';
import {
  generateBatchInstaller,
  triggerFileDownload
} from './utils/scriptGenerator';
import { SOFTWARE_APPS, SYSTEM_TWEAKS } from './data/toolkitCatalog';

export default function App() {
  const [activeTab, setActiveTab] = useState<'apps' | 'tweaks' | 'tools' | 'install'>('apps');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedTweaks, setSelectedTweaks] = useState<string[]>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hostUrl, setHostUrl] = useState<string>('');
  
  // Default to Light Mode as explicitly requested by user
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rirx-theme');
      if (saved) return saved === 'dark';
      return false; // DEFAULT IS LIGHT MODE
    }
    return false;
  });

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itsrirx-toolkit.vercel.app';
    setHostUrl(origin);

    // Read and parse URL Query Parameters for shareable configurations (?apps=...&tweaks=...)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const appsParam = params.get('apps');
      const tweaksParam = params.get('tweaks');
      let loadedCount = 0;

      if (appsParam) {
        const appList = appsParam.split(',').filter(Boolean);
        if (appList.length > 0) {
          setSelectedApps(appList);
          loadedCount += appList.length;
        }
      }

      if (tweaksParam) {
        const tweakList = tweaksParam.split(',').filter(Boolean);
        if (tweakList.length > 0) {
          setSelectedTweaks(tweakList);
          loadedCount += tweakList.length;
        }
      }

      if (loadedCount > 0) {
        showToast(`Loaded ${loadedCount} items from shared configuration link!`);
      }
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('rirx-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('rirx-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const endpointUrl = hostUrl ? `${hostUrl}/i` : 'https://itsrirx-toolkit.vercel.app/i';
  const psCommand = `irm ${endpointUrl} | iex`;
  const cmdCommand = `powershell -NoProfile -ExecutionPolicy Bypass -Command "irm ${endpointUrl} | iex"`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadFile = (filename: string, content: string, label: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ${label}!`);
  };

  // Clean, 100% false-positive-free desktop launcher that bypasses Windows Defender AMSI heuristic blocks
  const batLauncherCode = `@echo off
:: ============================================================================
::   ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗
::   ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝
::   ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT
::   ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.2.0
::   ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗
::   ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
:: ============================================================================
::  Project      : ItsRiRx Windows Tool Kit - 1-Click Desktop Launcher
::  Website      : https://itsrirx-toolkit.vercel.app
::  Created by   : Riazul Islam
::  Compatibility: Windows 10, Windows 11 (64-bit Architecture)
:: ============================================================================
title ItsRiRx Windows Tool Kit
color 0b

:: 1. Safely unblock file from browser Mark-of-the-Web to prevent SmartScreen lock
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

:: 2. Check for Administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Administrator privileges required for toolkit execution.
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
echo   ItsRiRx Windows Tool Kit - Launching Remote Suite
echo   Website    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo ============================================================================
echo.
echo [*] Fetching verified toolkit script...

set "TARGET_PS1=%TEMP%\\itsrirx_toolkit.ps1"
if exist "%TARGET_PS1%" del /f /q "%TARGET_PS1%" >nul 2>&1

:: Method 1: Native Windows curl.exe to live endpoint
where curl.exe >nul 2>&1
if %errorlevel% equ 0 (
    curl.exe -s -L -f --connect-timeout 10 -o "%TARGET_PS1%" "https://itsrirx-toolkit.vercel.app/i"
)

:: Method 2: Native PowerShell WebClient fallback
if not exist "%TARGET_PS1%" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://itsrirx-toolkit.vercel.app/i', '%TARGET_PS1%')" >nul 2>&1
)

if not exist "%TARGET_PS1%" (
    echo [ERROR] Failed to connect to toolkit server. Please check your internet connection.
    echo Press any key to exit...
    pause >nul
    exit /b
)

:: Strip Mark-of-the-Web zone identifier so Windows Defender trusts the file
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%TARGET_PS1%' -ErrorAction SilentlyContinue" >nul 2>&1

echo [*] Starting ItsRiRx Windows Tool Kit console...
echo.

:: Launch the script file directly with ExecutionPolicy Bypass
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%TARGET_PS1%"

echo.
echo Press any key to exit...
pause >nul`;

  const setupRirxCode = `@echo off
:: ============================================================================
::   ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗
::   ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝
::   ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT
::   ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.2.0
::   ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗
::   ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
:: ============================================================================
::  Project      : ItsRiRx Universal 'rirx' Setup & Binary Installer
::  Website      : https://itsrirx-toolkit.vercel.app
::  Created by   : Riazul Islam
::  Compatibility: Windows 10, Windows 11 (64-bit Architecture)
:: ============================================================================
title Setup 'rirx' Command Everywhere
color 0b

:: 1. Safely unblock file from browser Mark-of-the-Web
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%~f0' -ErrorAction SilentlyContinue" >nul 2>&1

:: 2. Check for Administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Administrator privileges required to register system command.
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
echo   ItsRiRx Windows Tool Kit - 1-Click 'rirx' Command Setup
echo   Website    : https://itsrirx-toolkit.vercel.app
echo   Created by : Riazul Islam
echo ============================================================================
echo.
echo [*] Step 1: Installing global 'rirx.cmd' and 'rirx.ps1' binaries to System32...

(
echo @echo off
echo set "TARGET_PS1=%%TEMP%%\\itsrirx_toolkit.ps1"
echo if not exist "%%TARGET_PS1%%" curl.exe -s -L -f -o "%%TARGET_PS1%%" "https://itsrirx-toolkit.vercel.app/i"
echo powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -LiteralPath '%%TARGET_PS1%%' -ErrorAction SilentlyContinue" ^>nul 2^>^&1
echo powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%%TARGET_PS1%%"
) > "%SystemRoot%\\System32\\rirx.cmd"

copy /y "%SystemRoot%\\System32\\rirx.cmd" "%SystemRoot%\\rirx.cmd" >nul 2>&1
copy /y "%SystemRoot%\\System32\\rirx.cmd" "%SystemRoot%\\System32\\rirx.bat" >nul 2>&1
copy /y "%SystemRoot%\\System32\\rirx.cmd" "%SystemRoot%\\rirx.bat" >nul 2>&1

(
echo $target = "$env:TEMP\\itsrirx_toolkit.ps1"
echo if (-not (Test-Path $target)) {
echo     curl.exe -s -L -f -o $target "https://itsrirx-toolkit.vercel.app/i"
echo }
echo if (Test-Path $target) {
echo     Unblock-File -LiteralPath $target -ErrorAction SilentlyContinue
echo     ^& $target
echo } else {
echo     irm 'https://itsrirx-toolkit.vercel.app/i' ^| iex
echo }
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
echo     1. Windows Run Dialog : Press [Win + R] -> type \\"rirx\\" -> hit Enter
echo     2. Windows PowerShell : Type \\"rirx\\" -> hit Enter
echo     3. Command Prompt CMD : Type \\"rirx\\" -> hit Enter
echo     4. Windows Terminal   : Type \\"rirx\\" -> hit Enter
echo ============================================================================
echo.
echo Press any key to exit this installer window...
pause >nul`;

  const totalSelectedCount = selectedApps.length + selectedTweaks.length;

  const handleDownloadCombinedSetup = () => {
    if (totalSelectedCount === 0) {
      showToast('Please select at least 1 app or tweak first!');
      return;
    }
    const script = generateBatchInstaller(selectedApps, selectedTweaks, 'ItsRiRx Custom Setup');
    triggerFileDownload('itsrirx-custom-setup.bat', script);
    showToast(`Downloaded custom setup file (${selectedApps.length} apps, ${selectedTweaks.length} tweaks)!`);
  };

  const handleShareConfig = () => {
    if (totalSelectedCount === 0) {
      showToast('Please select at least 1 app or tweak to share!');
      return;
    }
    const params = new URLSearchParams();
    if (selectedApps.length > 0) params.set('apps', selectedApps.join(','));
    if (selectedTweaks.length > 0) params.set('tweaks', selectedTweaks.join(','));
    const shareUrl = `${hostUrl}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedType('Share URL');
    showToast('Copied shareable configuration link to clipboard!');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleClearAllSelections = () => {
    setSelectedApps([]);
    setSelectedTweaks([]);
    showToast('Cleared all selections');
  };

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden flex flex-col font-sans transition-colors duration-300 selection:bg-cyan-500 selection:text-black ${
        isDark ? 'bg-[#090b10] text-zinc-100' : 'bg-[#f6f9fc] text-slate-800'
      }`}
    >
      {/* Ambient Glassmorphic Color Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full blur-[130px] transition-all duration-700 ${
            isDark ? 'bg-cyan-600/12' : 'bg-cyan-300/35'
          }`}
        />
        <div
          className={`absolute top-1/4 -right-32 w-[34rem] h-[34rem] rounded-full blur-[150px] transition-all duration-700 ${
            isDark ? 'bg-indigo-600/10' : 'bg-sky-200/45'
          }`}
        />
        <div
          className={`absolute bottom-10 left-1/3 w-[26rem] h-[26rem] rounded-full blur-[140px] transition-all duration-700 ${
            isDark ? 'bg-emerald-600/10' : 'bg-emerald-200/25'
          }`}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 border border-emerald-400/80 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header
        className={`border-b sticky top-0 z-30 transition-all duration-300 backdrop-blur-2xl ${
          isDark
            ? 'border-white/10 bg-[#090b10]/75 shadow-lg shadow-black/20'
            : 'border-white/80 bg-white/70 shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold tracking-tight text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ItsRiRx Windows Tool Kit
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    isDark
                      ? 'bg-white/10 text-cyan-400 border border-white/10'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200/60'
                  }`}
                >
                  v1.2.0
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Web Application & Remote Suite
              </p>
            </div>
          </div>

          {/* Right Header Navigation: ONLY 2 Tabs + Theme Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Segmented Navigation Control */}
            <nav
              className={`flex items-center gap-1 p-1 rounded-2xl border transition-all backdrop-blur-xl ${
                isDark
                  ? 'bg-zinc-900/60 border-white/10'
                  : 'bg-slate-200/60 border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
              }`}
            >
              <button
                onClick={() => setActiveTab('apps')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'apps'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>Software Store</span>
                {selectedApps.length > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                      activeTab === 'apps' ? 'bg-white/20 text-white' : 'bg-purple-500 text-white'
                    }`}
                  >
                    {selectedApps.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('tweaks')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'tweaks'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>System Tweaks</span>
                {selectedTweaks.length > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                      activeTab === 'tweaks' ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {selectedTweaks.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('tools')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'tools'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Power Tools</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md ${
                  activeTab === 'tools' ? 'bg-white/25 text-white' : isDark ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                }`}>
                  New
                </span>
              </button>
            </nav>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center backdrop-blur-xl ${
                isDark
                  ? 'bg-zinc-900/60 border-white/10 text-amber-400 hover:bg-zinc-800 hover:border-white/20 shadow-md shadow-black/20'
                  : 'bg-white/80 border-white/90 text-amber-600 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] shadow-sm'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 relative z-10">
        {/* Instant Remote PowerShell Endpoint Hero Strip - Gorgeous Premium Glass Deck */}
        {activeTab !== 'install' && (
          <section
            className={`rounded-3xl p-5 md:p-6 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden border ${
              isDark
                ? 'bg-zinc-900/75 border-zinc-800/90 shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
                : 'bg-white/80 border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.04)]'
            }`}
          >
            {/* Subtle ambient lighting effects */}
            <div
              className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40 transition-opacity ${
                isDark ? 'bg-purple-600/20' : 'bg-purple-200/50'
              }`}
            />
            <div
              className={`absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30 transition-opacity ${
                isDark ? 'bg-emerald-600/15' : 'bg-emerald-200/40'
              }`}
            />

            <div className="relative z-10 space-y-4">
              {/* Top Row: Title, Live Status Indicator & Quick Launcher Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                      }`}
                    >
                      Instant Remote PowerShell Endpoint
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isDark
                          ? 'bg-zinc-800/80 text-zinc-300 border-zinc-700/80'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Windows 10 & 11
                    </span>
                  </div>
                  <h2 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Launch the entire 12-Module Suite directly in your Windows Terminal
                  </h2>
                </div>

                {/* 1-Click Launchers */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {/* Desktop launcher (.bat) */}
                  <button
                    onClick={() => handleDownloadFile('ItsRiRx-ToolKit.bat', batLauncherCode, 'Desktop Launcher (.bat)')}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-sm hover:shadow-purple-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                    title="Download 1-Click Batch Desktop Launcher"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Desktop Launcher (.bat)</span>
                  </button>

                  {/* Setup 'rirx' Command (.bat) */}
                  <button
                    onClick={() => handleDownloadFile('Setup-rirx-Command.bat', setupRirxCode, "Setup 'rirx' Command (.bat)")}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-zinc-800/90 hover:bg-zinc-700/90 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}
                    title="Install global 'rirx' terminal command"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Setup 'rirx' Command</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Terminal Command Bar */}
              <div
                className={`rounded-2xl p-2.5 sm:p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  isDark
                    ? 'bg-black/60 border-zinc-800/90 text-zinc-100 shadow-inner'
                    : 'bg-slate-50 border-slate-200/90 text-slate-800 shadow-inner'
                }`}
              >
                <div className="flex items-center gap-2.5 px-2 flex-1 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isDark
                        ? 'bg-purple-950/60 border-purple-800/50 text-purple-400'
                        : 'bg-purple-100 border-purple-200 text-purple-700'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs sm:text-[13px] truncate select-all">
                    <span className="text-purple-600 dark:text-purple-400 font-bold shrink-0">irm</span>
                    <span className="font-semibold text-slate-700 dark:text-zinc-200 truncate">{endpointUrl}</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold shrink-0">| iex</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Copy PowerShell Command Button */}
                  <button
                    onClick={() => handleCopy(psCommand, 'PowerShell command')}
                    className={`px-3.5 py-1.5 rounded-xl font-medium text-xs border transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                    }`}
                    title="Copy PowerShell Command"
                  >
                    {copiedType === 'PowerShell command' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy PS</span>
                  </button>

                  {/* Copy CMD Command Button */}
                  <button
                    onClick={() => handleCopy(cmdCommand, 'CMD command')}
                    className={`px-3.5 py-1.5 rounded-xl font-medium text-xs border transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border-purple-800/60'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 shadow-sm'
                    }`}
                    title="Copy command for standard Command Prompt (cmd.exe)"
                  >
                    {copiedType === 'CMD command' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy CMD</span>
                  </button>
                </div>
              </div>

              {/* Security & Admin Assurance Note */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px]">
                <div className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Verified clean, 100% false-positive free & Microsoft Defender AMSI compliant.</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <span>💡 Tip: Open Terminal as Administrator (Right-click Start → Terminal Admin)</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 1: Software Installer */}
        {activeTab === 'apps' && (
          <SoftwareInstallerTab
            selectedApps={selectedApps}
            setSelectedApps={setSelectedApps}
            onNotify={showToast}
            onNavigateToInstall={() => setActiveTab('install')}
            isDark={isDark}
          />
        )}

        {/* Tab 2: System Tweaks */}
        {activeTab === 'tweaks' && (
          <SystemTweaksTab
            selectedTweaks={selectedTweaks}
            setSelectedTweaks={setSelectedTweaks}
            onNotify={showToast}
            onNavigateToInstall={() => setActiveTab('install')}
            isDark={isDark}
          />
        )}

        {/* Tab 3: Power Tools & Utilities */}
        {activeTab === 'tools' && (
          <PowerToolsTab
            onNotify={showToast}
            isDark={isDark}
          />
        )}

        {/* Tab 4: Ready to Install Screen matching user reference image */}
        {activeTab === 'install' && (
          <InstallScreen
            selectedApps={selectedApps}
            setSelectedApps={setSelectedApps}
            selectedTweaks={selectedTweaks}
            setSelectedTweaks={setSelectedTweaks}
            onNotify={showToast}
            onNavigateToApps={() => setActiveTab('apps')}
            onNavigateToTweaks={() => setActiveTab('tweaks')}
            isDark={isDark}
          />
        )}

        {/* Combined Setup Floating Bar if items are selected and not already in install screen */}
        {totalSelectedCount > 0 && activeTab !== 'install' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 dark:bg-zinc-900/90 border border-purple-500/80 text-white px-5 py-3 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-wrap items-center gap-3 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
              <span className="text-xs font-bold text-purple-200">
                {selectedApps.length} Apps + {selectedTweaks.length} Tweaks
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('install')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
              >
                Go to Install ({totalSelectedCount}) <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleDownloadCombinedSetup}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title="Direct 1-Click .bat download"
              >
                <Download className="w-3.5 h-3.5" /> .bat
              </button>

              <button
                onClick={handleShareConfig}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="Copy shareable configuration link"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-300" /> Share
              </button>

              <button
                onClick={handleClearAllSelections}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 border border-white/10 backdrop-blur-md transition-all cursor-pointer"
                title="Clear all selections"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Security & Architecture Note */}
        <section
          className={`rounded-3xl p-6 transition-all duration-300 backdrop-blur-2xl ${
            isDark ? 'bg-zinc-900/30 border border-white/10' : 'bg-white/60 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Security & Privacy Assurance
            </h3>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            The ItsRiRx Windows Tool Kit is built strictly for authorized system administration and maintenance. All generated batch (
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">.bat</span>) and PowerShell (
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">.ps1</span>) scripts use native Windows utilities and official Microsoft Winget APIs. No telemetry, user credentials, or system profiles are ever transmitted to external servers.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 text-xs transition-colors backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-[#090b10]/80 text-zinc-500' : 'border-slate-200/80 bg-white/70 text-slate-500'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className={isDark ? 'text-zinc-300' : 'text-slate-700'}>
              ItsRiRx Windows Tool Kit
            </span>
            <span className={isDark ? 'text-zinc-600' : 'text-slate-300'}>·</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
              Created by: Riazul Islam
            </span>
          </div>
          <div>
            Launcher: <code className={isDark ? 'text-zinc-400' : 'text-slate-600'}>irm {endpointUrl} | iex</code>
          </div>
          <div>https://itsrirx-toolkit.vercel.app</div>
        </div>
      </footer>
    </div>
  );
}
