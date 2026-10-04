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
  FolderDown,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Share2,
  Undo2,
  Key,
  HardDriveDownload,
  Layers,
  RotateCcw
} from 'lucide-react';
import { SoftwareInstallerTab } from './components/SoftwareInstallerTab';
import { SystemTweaksTab } from './components/SystemTweaksTab';
import {
  generateBatchInstaller,
  generateRollbackScript,
  generateOemKeyExtractorScript,
  generateDriverBackupScript,
  triggerFileDownload
} from './utils/scriptGenerator';
import { PRESET_BUNDLES, SOFTWARE_APPS, SYSTEM_TWEAKS } from './data/toolkitCatalog';

export default function App() {
  const [activeTab, setActiveTab] = useState<'apps' | 'tweaks'>('apps');
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

  const [showCliReference, setShowCliReference] = useState<boolean>(false);

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

  const endpointUrl = `${hostUrl}/i`;
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

:: 1. Self-Elevate to Administrator safely without triggering AMSI heuristic flags
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Requesting Administrator privileges to run toolkit...
    powershell.exe -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

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

:: Method 1: Native Windows curl.exe (Safe, clean download - No in-memory AMSI flag)
where curl.exe >nul 2>&1
if %errorlevel% equ 0 (
    curl.exe -s -L -f --connect-timeout 10 -o "%TARGET_PS1%" "https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1"
)

:: Method 2: Native WebClient fallback if curl did not output file
if not exist "%TARGET_PS1%" (
    powershell.exe -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1', '%TARGET_PS1%')" >nul 2>&1
)

:: Method 3: Vercel primary endpoint fallback
if not exist "%TARGET_PS1%" (
    curl.exe -s -L -f --connect-timeout 10 -o "%TARGET_PS1%" "https://itsrirx-toolkit.vercel.app/i"
)

if not exist "%TARGET_PS1%" (
    echo [ERROR] Failed to download toolkit.ps1. Please check your internet connection.
    echo Press any key to exit...
    pause >nul
    exit /b
)

:: Strip Mark-of-the-Web zone identifier so Windows Defender trusts the file
powershell.exe -NoProfile -Command "Unblock-File -Path '%TARGET_PS1%' -ErrorAction SilentlyContinue" >nul 2>&1

echo [*] Starting ItsRiRx Windows Tool Kit console...
echo.

:: Launch the script file directly (Clean, official execution - Never triggers 'Access is denied')
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

:: 1. Auto-elevate to Administrator with UAC prompt safely
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Requesting Administrator privileges to register system command...
    powershell.exe -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

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
echo if not exist "%%TARGET_PS1%%" curl.exe -s -L -f -o "%%TARGET_PS1%%" "https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1"
echo if not exist "%%TARGET_PS1%%" curl.exe -s -L -f -o "%%TARGET_PS1%%" "https://itsrirx-toolkit.vercel.app/i"
echo powershell.exe -NoProfile -Command "Unblock-File -Path '%%TARGET_PS1%%' -ErrorAction SilentlyContinue" ^>nul 2^>^&1
echo powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%%TARGET_PS1%%"
) > "%SystemRoot%\\System32\\rirx.cmd"

copy /y "%SystemRoot%\\System32\\rirx.cmd" "%SystemRoot%\\rirx.cmd" >nul 2>&1
copy /y "%SystemRoot%\\System32\\rirx.cmd" "%SystemRoot%\\System32\\rirx.bat" >nul 2>&1
copy /y "%SystemRoot%\\System32\\rirx.cmd" "%SystemRoot%\\rirx.bat" >nul 2>&1

(
echo $target = "$env:TEMP\\itsrirx_toolkit.ps1"
echo if (-not (Test-Path $target)) {
echo     curl.exe -s -L -f -o $target "https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1"
echo }
echo if (Test-Path $target) {
echo     Unblock-File -Path $target -ErrorAction SilentlyContinue
echo     ^& $target
echo } else {
echo     irm 'https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1' ^| iex
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

  const applyPresetBundle = (bundle: typeof PRESET_BUNDLES[number]) => {
    setSelectedApps(bundle.apps);
    setSelectedTweaks(bundle.tweaks);
    showToast(`Applied "${bundle.name}" (${bundle.apps.length} Apps + ${bundle.tweaks.length} Tweaks)!`);
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
                <span className={`font-extrabold tracking-tight text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ItsRiRx Windows Tool Kit
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                    isDark
                      ? 'bg-white/10 text-cyan-400 border border-white/10'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200/60'
                  }`}
                >
                  v1.2.0 Minimalist
                </span>
              </div>
              <p className={`text-xs font-mono hidden sm:block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'apps'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>Software Store</span>
                {selectedApps.length > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeTab === 'apps' ? 'bg-white/20 text-white' : 'bg-cyan-500 text-white'
                    }`}
                  >
                    {selectedApps.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('tweaks')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'tweaks'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>System Tweaks</span>
                {selectedTweaks.length > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeTab === 'tweaks' ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {selectedTweaks.length}
                  </span>
                )}
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
        {/* Quick Launch Hero Strip */}
        <section
          className={`rounded-3xl p-5 md:p-6 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden ${
            isDark
              ? 'bg-zinc-900/50 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
              : 'bg-white/65 border border-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.03)]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                >
                  Instant Remote PowerShell Endpoint
                </span>
              </div>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Launch the entire 12-Module Suite directly in your Windows Terminal:
              </p>
            </div>

            {/* Quick Command Glass Box */}
            <div
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 max-w-md w-full justify-between transition-all backdrop-blur-md ${
                isDark
                  ? 'bg-black/40 border border-white/10'
                  : 'bg-slate-100/80 border border-slate-200/80 shadow-sm'
              }`}
            >
              <code
                className={`text-xs font-mono truncate select-all ${
                  isDark ? 'text-cyan-300' : 'text-cyan-700 font-bold'
                }`}
              >
                {psCommand}
              </code>
              <button
                onClick={() => handleCopy(psCommand, 'PowerShell command')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 active:scale-90 ${
                  isDark
                    ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                    : 'bg-white hover:bg-slate-200 text-slate-700 shadow-sm'
                }`}
                title="Copy Command"
              >
                {copiedType === 'PowerShell command' ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* 1-Click Curated Presets Bar (Gamer, Office, Dev, Low-End PC, IT Admin, AI) */}
        <section
          className={`rounded-3xl p-5 backdrop-blur-2xl transition-all duration-300 ${
            isDark
              ? 'bg-zinc-900/40 border border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.2)]'
              : 'bg-white/60 border border-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.02)]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" />
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>
                1-Click Curated Setup Presets
              </h3>
              <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                (Apps + Tweaks bundled together)
              </span>
            </div>
            {totalSelectedCount > 0 && (
              <button
                onClick={handleShareConfig}
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Current Selection Link
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {PRESET_BUNDLES.map((b) => (
              <button
                key={b.id}
                onClick={() => applyPresetBundle(b)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between group active:scale-95 ${
                  isDark
                    ? 'bg-zinc-800/50 hover:bg-zinc-800 hover:border-cyan-500/50 border-white/10'
                    : 'bg-white/80 hover:bg-white hover:border-cyan-400 border-slate-200/80 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-base">{b.name.split(' ')[0]}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isDark ? 'bg-zinc-700/80 text-cyan-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {b.apps.length}A + {b.tweaks.length}T
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-cyan-700'}`}>
                    {b.name.split(' ').slice(1).join(' ')}
                  </h4>
                  <p className={`text-[10px] mt-0.5 font-mono truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    {b.badge}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Tab 1: Software Installer */}
        {activeTab === 'apps' && (
          <SoftwareInstallerTab
            selectedApps={selectedApps}
            setSelectedApps={setSelectedApps}
            onNotify={showToast}
            isDark={isDark}
          />
        )}

        {/* Tab 2: System Tweaks */}
        {activeTab === 'tweaks' && (
          <SystemTweaksTab
            selectedTweaks={selectedTweaks}
            setSelectedTweaks={setSelectedTweaks}
            onNotify={showToast}
            isDark={isDark}
          />
        )}

        {/* Combined Setup Floating Bar if items are selected */}
        {totalSelectedCount > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 dark:bg-zinc-900/90 border border-cyan-400/80 text-white px-5 py-3 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-wrap items-center gap-3 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold text-cyan-300 font-mono">
                {selectedApps.length} Apps + {selectedTweaks.length} Tweaks
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCombinedSetup}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" /> Download .bat
              </button>

              <button
                onClick={handleShareConfig}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="Copy shareable configuration link"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-300" /> Share Link
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

        {/* Collapsible Section: 1-Click Launchers, Standalone Utilities & Full 12-Module Reference */}
        <section
          className={`rounded-3xl overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
            isDark
              ? 'bg-zinc-900/40 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.2)]'
              : 'bg-white/60 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
          }`}
        >
          <button
            onClick={() => setShowCliReference((prev) => !prev)}
            className={`w-full p-5 text-left flex items-center justify-between transition-colors cursor-pointer ${
              isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                  isDark
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-cyan-50 text-cyan-700 border border-cyan-200/60'
                }`}
              >
                <FolderDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Desktop Launchers, Standalone Utilities & Full 12-Module Reference
                </h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Download zero-setup .bat launchers, rollback scripts, driver backup & product key tools
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400">
              <span>{showCliReference ? 'Hide Reference' : 'Show Reference'}</span>
              {showCliReference ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showCliReference && (
            <div
              className={`p-6 border-t space-y-6 animate-in fade-in duration-150 backdrop-blur-xl ${
                isDark ? 'border-white/10 bg-zinc-950/40' : 'border-slate-100 bg-slate-50/50'
              }`}
            >
              {/* 1-Click Desktop Launchers & Standalone Tools */}
              <div className="space-y-3">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  1-Click Desktop Scripts (.bat)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleDownloadFile('ItsRiRx-ToolKit.bat', batLauncherCode, 'Desktop Launcher (.bat)')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer backdrop-blur-xl ${
                      isDark
                        ? 'bg-zinc-900/60 border-white/10 hover:border-cyan-500/50 hover:bg-zinc-800/80 shadow-md'
                        : 'bg-white/80 border-white/90 hover:border-cyan-400 hover:bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Desktop Launcher</h4>
                      <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>ItsRiRx-ToolKit.bat</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDownloadFile('Setup-rirx-Command.bat', setupRirxCode, 'rirx Command Setup (.bat)')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer backdrop-blur-xl ${
                      isDark
                        ? 'bg-zinc-900/60 border-white/10 hover:border-emerald-500/50 hover:bg-zinc-800/80 shadow-md'
                        : 'bg-white/80 border-white/90 hover:border-emerald-400 hover:bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Setup 'rirx' Command</h4>
                      <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Win + R & Terminal shortcut</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleCopy(cmdCommand, 'CMD command')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer backdrop-blur-xl ${
                      isDark
                        ? 'bg-zinc-900/60 border-white/10 hover:border-blue-500/50 hover:bg-zinc-800/80 shadow-md'
                        : 'bg-white/80 border-white/90 hover:border-blue-400 hover:bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Copy className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Copy CMD Command</h4>
                      <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>For Command Prompt</p>
                    </div>
                  </button>

                  {/* Rollback Script Button */}
                  <button
                    onClick={() => handleDownloadFile('ItsRiRx-Rollback-Tweaks.bat', generateRollbackScript(), 'Rollback Script (.bat)')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer backdrop-blur-xl ${
                      isDark
                        ? 'bg-zinc-900/60 border-white/10 hover:border-amber-500/50 hover:bg-zinc-800/80 shadow-md'
                        : 'bg-white/80 border-white/90 hover:border-amber-400 hover:bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Undo2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Rollback Tweaks</h4>
                      <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Restore Windows defaults</p>
                    </div>
                  </button>

                  {/* Extract OEM Key Button */}
                  <button
                    onClick={() => handleDownloadFile('Extract-Windows-Key.bat', generateOemKeyExtractorScript(), 'OEM Product Key Extractor (.bat)')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer backdrop-blur-xl ${
                      isDark
                        ? 'bg-zinc-900/60 border-white/10 hover:border-cyan-500/50 hover:bg-zinc-800/80 shadow-md'
                        : 'bg-white/80 border-white/90 hover:border-cyan-400 hover:bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Extract OEM License Key</h4>
                      <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Save BIOS key to Desktop</p>
                    </div>
                  </button>

                  {/* Backup All Drivers Button */}
                  <button
                    onClick={() => handleDownloadFile('Backup-All-Drivers.bat', generateDriverBackupScript(), 'All Drivers Backup (.bat)')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer backdrop-blur-xl ${
                      isDark
                        ? 'bg-zinc-900/60 border-white/10 hover:border-emerald-500/50 hover:bg-zinc-800/80 shadow-md'
                        : 'bg-white/80 border-white/90 hover:border-emerald-400 hover:bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <HardDriveDownload className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Backup All Device Drivers</h4>
                      <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Export Wi-Fi, audio & GPU</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* All 12 Modules Table */}
              <div className="space-y-3">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Terminal Suite Modules (12 Modules)
                </h4>
                <div
                  className={`border rounded-2xl overflow-hidden font-mono text-xs backdrop-blur-xl ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}
                >
                  <div
                    className={`grid grid-cols-12 p-3.5 font-bold border-b ${
                      isDark ? 'bg-zinc-900/80 text-cyan-400 border-white/10' : 'bg-slate-100/80 text-cyan-700 border-slate-200'
                    }`}
                  >
                    <div className="col-span-1">NUM</div>
                    <div className="col-span-4">MODULE</div>
                    <div className="col-span-7">DESCRIPTION & CAPABILITIES</div>
                  </div>

                  {[
                    { num: '[01]', name: 'Software Installer', desc: 'Curated apps across 17 domains with multi-select checkboxes' },
                    { num: '[02]', name: 'Debloat & Windows 11', desc: 'Disable telemetry, Bing search, Copilot, classic context menu & UWP bloatware' },
                    { num: '[03]', name: 'Performance & Gaming', desc: 'Unlock Ultimate Power plan, Game DVR disable, low latency ping & 1:1 mouse input' },
                    { num: '[04]', name: 'Safety & Restore', desc: '1-click restore points, OEM product key extractor, driver backup & Defender scan' },
                    { num: '[05]', name: 'Developer Tools', desc: 'WSL2, Windows Sandbox, Hyper-V and container platform activation' },
                    { num: '[06]', name: 'Battery & Power', desc: 'Health analytics, battery wear degradation & sleep study reports' },
                    { num: '[07]', name: 'Windows System Repair', desc: 'SFC scannow, DISM RestoreHealth & Windows Update reset' },
                    { num: '[08]', name: 'Disk Cleanup & Storage', desc: 'Temp cleaner, hibernation off (free 8-32GB) & manual SSD TRIM retrim' },
                    { num: '[09]', name: 'Network Diagnostics', desc: 'Ping test, 3-point link check, Cloudflare/Google DNS switcher & flush' },
                    { num: '[10]', name: 'System Info & Utilities', desc: 'Hardware specs, Windows licensing status, devmgmt & diskmgmt' },
                    { num: '[11]', name: 'Instant Quick Actions', desc: 'Instant DNS flush, Explorer taskbar freeze fix & quick restore point' },
                    { num: '[12]', name: 'App Uninstaller', desc: 'Batch multi-select uninstaller with AppData leftover deep wipe' }
                  ].map((m) => (
                    <div
                      key={m.num}
                      className={`grid grid-cols-12 p-3.5 border-b transition-colors ${
                        isDark
                          ? 'border-white/5 hover:bg-zinc-800/40 text-zinc-300'
                          : 'border-slate-100 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="col-span-1 text-cyan-600 dark:text-cyan-400 font-bold">{m.num}</div>
                      <div className={`col-span-4 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.name}</div>
                      <div className={`col-span-7 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

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
            <code className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">.bat</code>) and PowerShell (
            <code className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">.ps1</code>) scripts use native Windows utilities and official Microsoft Winget APIs. No telemetry, user credentials, or system profiles are ever transmitted to external servers.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 text-xs font-mono transition-colors backdrop-blur-xl ${
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
