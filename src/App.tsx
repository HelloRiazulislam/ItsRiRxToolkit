import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Wifi,
  Wrench,
  Trash2,
  Settings,
  Zap,
  Boxes,
  HelpCircle,
  Sparkles,
  Gamepad2,
  ShieldAlert,
  Code2,
  BatteryCharging,
  Layers,
  ArrowRight,
  HardDrive,
  Globe,
  Film,
  MessageSquare,
  Monitor,
  FileText,
  Download,
  FolderDown,
  FileCode,
  MousePointerClick,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { SoftwareInstallerTab } from './components/SoftwareInstallerTab';
import { SystemTweaksTab } from './components/SystemTweaksTab';
import { CustomBundleTab } from './components/CustomBundleTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'apps' | 'tweaks' | 'builder' | 'cli'>('apps');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedTweaks, setSelectedTweaks] = useState<string[]>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hostUrl, setHostUrl] = useState<string>('');

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itsrirx-toolkit.vercel.app';
    setHostUrl(origin);
  }, []);

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

  const batLauncherCode = `@echo off
:: ============================================================================
::  ItsRiRx Windows Tool Kit - 1-Click Desktop Launcher
::  Compatibility: Windows 10, Windows 11 (64-bit)
:: ============================================================================
title ItsRiRx Windows Tool Kit
color 0b

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Administrator rights required. Requesting elevation...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \\"\\"%~f0\\"\\"' -Verb RunAs"
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
pause >nul`;

  const setupRirxCode = `@echo off
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
echo     1. Windows Run Dialog : Press [Win + R] -> type \\"rirx\\" -> hit Enter
echo     2. Windows PowerShell : Type \\"rirx\\" -> hit Enter
echo     3. Command Prompt CMD : Type \\"rirx\\" -> hit Enter
echo     4. Windows Terminal   : Type \\"rirx\\" -> hit Enter
echo ============================================================================
echo.
echo Press any key to exit this installer window...
pause >nul`;

  const totalSelectedCount = selectedApps.length + selectedTweaks.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-4 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">ItsRiRx Windows Tool Kit</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-semibold">v1.2.0 Minimalist</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono hidden sm:block">Web Application & Remote PowerShell Suite</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('apps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'apps'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span className="hidden sm:inline">Software Store</span>
              {selectedApps.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'apps' ? 'bg-black text-cyan-300' : 'bg-cyan-500 text-black'}`}>
                  {selectedApps.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tweaks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tweaks'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">System Tweaks</span>
              {selectedTweaks.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'tweaks' ? 'bg-black text-emerald-300' : 'bg-emerald-500 text-black'}`}>
                  {selectedTweaks.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'builder'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Custom Builder</span>
              {totalSelectedCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('cli')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cli'
                  ? 'bg-zinc-800 text-cyan-300 border border-zinc-700 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">CLI Suite</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Quick Launch Hero Strip */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Instant Remote PowerShell Endpoint
                </span>
              </div>
              <p className="text-sm font-semibold text-white">
                Launch the entire 12-Module Suite directly in your Windows Terminal:
              </p>
            </div>

            {/* Quick Command Box */}
            <div className="flex items-center gap-2 bg-black/60 border border-zinc-800 rounded-xl px-4 py-2.5 max-w-md w-full justify-between">
              <code className="text-xs font-mono text-cyan-300 truncate select-all">
                {psCommand}
              </code>
              <button
                onClick={() => handleCopy(psCommand, 'PowerShell command')}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Copy Command"
              >
                {copiedType === 'PowerShell command' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Tab 1: Software Installer */}
        {activeTab === 'apps' && (
          <SoftwareInstallerTab
            selectedApps={selectedApps}
            setSelectedApps={setSelectedApps}
            onNotify={showToast}
            onSwitchToCustomBuilder={() => setActiveTab('builder')}
          />
        )}

        {/* Tab 2: System Tweaks */}
        {activeTab === 'tweaks' && (
          <SystemTweaksTab
            selectedTweaks={selectedTweaks}
            setSelectedTweaks={setSelectedTweaks}
            onNotify={showToast}
          />
        )}

        {/* Tab 3: Custom Builder */}
        {activeTab === 'builder' && (
          <CustomBundleTab
            selectedApps={selectedApps}
            setSelectedApps={setSelectedApps}
            selectedTweaks={selectedTweaks}
            setSelectedTweaks={setSelectedTweaks}
            onNotify={showToast}
            onNavigateToApps={() => setActiveTab('apps')}
            onNavigateToTweaks={() => setActiveTab('tweaks')}
          />
        )}

        {/* Tab 4: CLI Suite & Complete Documentation */}
        {activeTab === 'cli' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Downloadable 1-Click Launchers Section */}
            <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <FolderDown className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">1-Click Desktop Launchers & Offline Binaries</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download zero-setup desktop launchers for your computer. No need to memorize terminal commands or browse URLs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => handleDownloadFile('ItsRiRx-ToolKit.bat', batLauncherCode, 'Desktop Launcher (.bat)')}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800/80 transition-all text-left flex items-start gap-3 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-cyan-300">Desktop Launcher</h4>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">ItsRiRx-ToolKit.bat</p>
                  </div>
                </button>

                <button
                  onClick={() => handleDownloadFile('Setup-rirx-Command.bat', setupRirxCode, 'rirx Command Setup (.bat)')}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 transition-all text-left flex items-start gap-3 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-emerald-300">Setup 'rirx' Command</h4>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Win + R & Terminal shortcut</p>
                  </div>
                </button>

                <button
                  onClick={() => handleCopy(cmdCommand, 'CMD command')}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all text-left flex items-start gap-3 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Copy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-blue-300">Copy CMD Command</h4>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">For Command Prompt</p>
                  </div>
                </button>
              </div>
            </section>

            {/* All 12 Modules Table */}
            <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Full PowerShell Suite Modules</h3>
                </div>
                <span className="text-xs font-mono text-zinc-400">12 Specialized Modules</span>
              </div>

              <div className="border border-zinc-800 rounded-xl overflow-hidden font-mono text-xs">
                <div className="grid grid-cols-12 bg-zinc-900 p-3 text-cyan-400 font-bold border-b border-zinc-800">
                  <div className="col-span-1">NUM</div>
                  <div className="col-span-4">MODULE</div>
                  <div className="col-span-7">DESCRIPTION & CAPABILITIES</div>
                </div>

                {[
                  { num: '[01]', name: 'Software Installer', desc: 'Curated apps across 9 domains with multi-select checkboxes' },
                  { num: '[02]', name: 'Debloat & Privacy', desc: 'Disable telemetry, Bing search, Cortana & purge UWP bloatware' },
                  { num: '[03]', name: 'Performance & Gaming', desc: 'Unlock Ultimate Power plan, Game DVR disable, 1:1 mouse input' },
                  { num: '[04]', name: 'Safety & Restore', desc: '1-click system restore points, active listening ports & Defender scan' },
                  { num: '[05]', name: 'Developer Tools', desc: 'WSL2, Windows Sandbox, Hyper-V and container platform activation' },
                  { num: '[06]', name: 'Battery & Power', desc: 'Health analytics, battery wear degradation & sleep study reports' },
                  { num: '[07]', name: 'Windows System Repair', desc: 'SFC scannow, DISM RestoreHealth & Windows Update reset' },
                  { num: '[08]', name: 'Disk Cleanup & Storage', desc: 'Temp cleaner, top 15 largest files & manual SSD TRIM retrim' },
                  { num: '[09]', name: 'Network Diagnostics', desc: 'Ping test, 3-point link check, DNS switcher (Cloudflare/Google) & flush' },
                  { num: '[10]', name: 'System Info & Utilities', desc: 'Hardware specs, Windows licensing status, devmgmt & diskmgmt' },
                  { num: '[11]', name: 'Instant Quick Actions', desc: 'Instant DNS flush, Explorer taskbar freeze fix & quick restore point' },
                  { num: '[12]', name: 'App Uninstaller', desc: 'Batch multi-select uninstaller with AppData leftover deep wipe' }
                ].map((m) => (
                  <div key={m.num} className="grid grid-cols-12 p-3 border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors text-zinc-300">
                    <div className="col-span-1 text-cyan-400 font-bold">{m.num}</div>
                    <div className="col-span-4 font-semibold text-white">{m.name}</div>
                    <div className="col-span-7 text-zinc-400">{m.desc}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Security & Architecture Note */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Security & Privacy Assurance</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The ItsRiRx Windows Tool Kit is built strictly for authorized system administration and maintenance. All generated batch (<code className="text-cyan-400 font-mono">.bat</code>) and PowerShell (<code className="text-cyan-400 font-mono">.ps1</code>) scripts use native Windows utilities and official Microsoft Winget APIs. No telemetry, user credentials, or system profiles are ever transmitted to external servers.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ItsRiRx Windows Tool Kit v1.2.0 Minimalist</span>
          </div>
          <div>
            Launcher: <code className="text-zinc-400">irm {endpointUrl} | iex</code>
          </div>
          <div>
            Built with PowerShell for Power Users & SysAdmins.
          </div>
        </div>
      </footer>
    </div>
  );
}
