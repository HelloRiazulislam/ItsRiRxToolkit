import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Copy,
  Check,
  CheckCircle2,
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
  MousePointerClick
} from 'lucide-react';

export default function App() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [hostUrl, setHostUrl] = useState<string>('');

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itsrirx-toolkit.vercel.app';
    setHostUrl(origin);
  }, []);

  const endpointUrl = `${hostUrl}/i`;
  const psCommand = `irm ${endpointUrl} | iex`;
  const cmdCommand = `powershell -NoProfile -ExecutionPolicy Bypass -Command "irm ${endpointUrl} | iex"`;

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
::  ItsRiRx Windows Tool Kit - Universal 'rirx' Setup & ExecutionPolicy Fixer
:: ============================================================================
title Setup 'rirx' Command & Fix Security Policy
color 0b
cls

echo ============================================================================
echo   ItsRiRx Windows Tool Kit - 1-Click 'rirx' Command Setup
echo ============================================================================
echo.
echo [*] Step 1: Unlocking PowerShell Execution Policy for scripts...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; Write-Host '  [OK] CurrentUser ExecutionPolicy set to RemoteSigned' -ForegroundColor Green } catch { Write-Host '  [!] Warning: ' $_.Exception.Message -ForegroundColor Yellow }"

echo.
echo [*] Step 2: Registering 'rirx' function in PowerShell Profiles...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$doc = [Environment]::GetFolderPath('MyDocuments'); $profiles = @($PROFILE, (Join-Path $doc 'WindowsPowerShell\\Microsoft.PowerShell_profile.ps1'), (Join-Path $doc 'PowerShell\\Microsoft.PowerShell_profile.ps1')); foreach ($p in $profiles) { if ($p) { $dir = Split-Path $p; if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }; if (!(Test-Path $p)) { New-Item -ItemType File -Path $p -Force | Out-Null }; $fn = 'function rirx { & powershell.exe -NoProfile -ExecutionPolicy Bypass -Command \"\"\"$url = ''https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1''; try { irm $url | iex } catch { irm ''https://itsrirx-toolkit.vercel.app/i'' | iex }\"\"\" }'; $cnt = Get-Content $p -Raw -ErrorAction SilentlyContinue; if ($cnt -notmatch 'function rirx') { Add-Content -Path $p -Value ([Environment]::NewLine + '# ItsRiRx Windows Tool Kit Shortcut' + [Environment]::NewLine + $fn) -Force }; try { Unblock-File -Path $p -ErrorAction SilentlyContinue } catch {} } }; Write-Host '  [OK] PowerShell Profile scripts configured and unblocked' -ForegroundColor Green"

echo.
echo [*] Step 3: Creating Global 'rirx.cmd' (Runs everywhere in CMD, PowerShell & Run Dialog)...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$appsDir = [Environment]::GetFolderPath('LocalApplicationData') + '\\Microsoft\\WindowsApps'; if (Test-Path $appsDir) { $cmdPath = Join-Path $appsDir 'rirx.cmd'; $cmdText = '@echo off' + [Environment]::NewLine + 'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command \"\"\"$url = ''https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1''; try { irm $url | iex } catch { irm ''https://itsrirx-toolkit.vercel.app/i'' | iex }\"\"\"' + [Environment]::NewLine; [System.IO.File]::WriteAllText($cmdPath, $cmdText, [System.Text.Encoding]::ASCII); Write-Host '  [OK] Created global binary in WindowsApps: rirx.cmd' -ForegroundColor Green }"

echo.
echo ============================================================================
echo   [SUCCESS] Setup Completed!
echo   
echo   You can now open ANY PowerShell or Command Prompt (CMD) and simply type:
echo     rirx
echo ============================================================================
echo.
echo [*] Launching toolkit now to verify...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$url = 'https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1'; try { irm $url | iex } catch { irm 'https://itsrirx-toolkit.vercel.app/i' | iex }"
pause`;

  const vbsShortcutCode = `Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\\ItsRiRx ToolKit.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "powershell.exe"
oLink.Arguments = "-NoProfile -ExecutionPolicy Bypass -Command ""$url = 'https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1'; try { irm $url | iex } catch { irm 'https://itsrirx-toolkit.vercel.app/i' | iex }"""
oLink.Description = "ItsRiRx Windows Tool Kit 1-Click Launcher"
oLink.WorkingDirectory = "%USERPROFILE%"
oLink.IconLocation = "powershell.exe, 0"
oLink.Save
MsgBox "ItsRiRx ToolKit shortcut has been created on your Desktop!", 64, "ItsRiRx ToolKit"`;

  const ps1ScriptCode = `# ============================================================================
#  ItsRiRx Windows Tool Kit - 1-Click Local Runner
# ============================================================================
$url = 'https://raw.githubusercontent.com/itsrirx/WindowsToolKit/main/toolkit.ps1'
try { irm $url | iex } catch { irm 'https://itsrirx-toolkit.vercel.app/i' | iex }`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownload = (filename: string, content: string, label: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`Downloaded ${label}!`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const categories = [
    {
      num: '01',
      title: 'Web Browsers',
      logo: '🌐',
      icon: Globe,
      color: 'from-blue-500/20 to-blue-900/10 border-blue-500/30 text-blue-400',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      apps: ['Google Chrome', 'Mozilla Firefox', 'Microsoft Edge', 'Brave', 'Opera']
    },
    {
      num: '02',
      title: 'Developer & Coding',
      logo: '💻',
      icon: Code2,
      color: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      apps: ['Visual Studio Code', 'Git', 'Python', 'Node.js', 'Notepad++']
    },
    {
      num: '03',
      title: 'Multimedia & Creators',
      logo: '🎬',
      icon: Film,
      color: 'from-amber-500/20 to-amber-900/10 border-amber-500/30 text-amber-400',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      apps: ['VLC Media Player', 'Spotify', 'OBS Studio', 'Audacity', 'HandBrake']
    },
    {
      num: '04',
      title: 'Utilities & Tools',
      logo: '🛠️',
      icon: Wrench,
      color: 'from-purple-500/20 to-purple-900/10 border-purple-500/30 text-purple-400',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      apps: ['7-Zip', 'WinRAR', 'Everything', 'Microsoft PowerToys', 'Rufus', 'ShareX', 'Avro Keyboard']
    },
    {
      num: '05',
      title: 'Communication & Social',
      logo: '💬',
      icon: MessageSquare,
      color: 'from-indigo-500/20 to-indigo-900/10 border-indigo-500/30 text-indigo-400',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      apps: ['WhatsApp', 'Telegram', 'Discord', 'Zoom', 'Microsoft Teams']
    },
    {
      num: '06',
      title: 'Gaming Launchers',
      logo: '🎮',
      icon: Gamepad2,
      color: 'from-rose-500/20 to-rose-900/10 border-rose-500/30 text-rose-400',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      apps: ['Steam', 'Epic Games', 'EA App', 'Ubisoft Connect', 'Riot Client', 'Xbox']
    },
    {
      num: '07',
      title: 'Security & Privacy',
      logo: '🔐',
      icon: ShieldCheck,
      color: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30 text-cyan-400',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      apps: ['Bitwarden', 'Malwarebytes', 'Proton VPN']
    },
    {
      num: '08',
      title: 'Remote Access & IT',
      logo: '🖥️',
      icon: Monitor,
      color: 'from-teal-500/20 to-teal-900/10 border-teal-500/30 text-teal-400',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      apps: ['AnyDesk', 'UltraViewer', 'TeamViewer', 'RustDesk', 'PuTTY', 'WinSCP']
    },
    {
      num: '09',
      title: 'Office & Productivity',
      logo: '📄',
      icon: FileText,
      color: 'from-yellow-500/20 to-yellow-900/10 border-yellow-500/30 text-yellow-400',
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      apps: ['Microsoft 365', 'Microsoft Office 2024', 'Microsoft Office 2021', 'LibreOffice', 'Adobe Acrobat Reader', 'Notion']
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-4 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <Check className="w-5 h-5" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Top Cyber Nav */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">ItsRiRx Windows Tool Kit</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-semibold">v1.1.0 PRO</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono hidden sm:block">Advanced Remote Windows Administration Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">PowerShell Engine Ready</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Win 10 & 11 (64-bit)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-14">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-zinc-950 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-600/40 text-cyan-300 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Pure In-Memory Execution • No Installations • Windows 10 & 11 Compatible
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Advanced Windows Power Toolkit <span className="text-cyan-400">in One Command</span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Equip your PC with debloating, privacy tweaks, gaming optimizations (Ultimate Performance plan, Game DVR disable), 1-click restore points, battery reports, and 9 curated software categories with interactive checkboxes.
            </p>
          </div>

          {/* 1-CLICK LAUNCHERS (COPY COMMANDS) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* PowerShell Card */}
            <div className="rounded-2xl border border-cyan-500/40 bg-zinc-950/80 p-5 space-y-3 relative group hover:border-cyan-400 transition shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold text-white text-sm">Windows PowerShell Command</span>
                </div>
                <span className="text-[11px] text-cyan-400 font-mono">Recommended</span>
              </div>
              <p className="text-xs text-zinc-400">
                Open PowerShell (Run as Administrator) and paste:
              </p>
              <div className="bg-black rounded-xl p-3 border border-zinc-800 font-mono text-xs sm:text-sm text-cyan-300 flex items-center justify-between gap-3 overflow-x-auto">
                <span className="select-all">{psCommand}</span>
                <button
                  onClick={() => handleCopy(psCommand, 'ps')}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-cyan-500 hover:text-black text-zinc-200 transition shrink-0"
                  title="Copy PowerShell command"
                >
                  {copiedType === 'ps' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                <span>Runs securely in memory without local file traces</span>
                <button
                  onClick={() => handleCopy(psCommand, 'ps')}
                  className="text-cyan-400 font-medium hover:underline"
                >
                  {copiedType === 'ps' ? 'Copied to clipboard ✔' : 'Click to copy'}
                </button>
              </div>
            </div>

            {/* CMD Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-3 relative group hover:border-zinc-700 transition shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  <span className="font-bold text-white text-sm">Command Prompt (CMD) Launcher</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">Universal CMD</span>
              </div>
              <p className="text-xs text-zinc-400">
                Open Windows Command Prompt (CMD) and run:
              </p>
              <div className="bg-black rounded-xl p-3 border border-zinc-800 font-mono text-xs sm:text-sm text-amber-300 flex items-center justify-between gap-3 overflow-x-auto">
                <span className="select-all">{cmdCommand}</span>
                <button
                  onClick={() => handleCopy(cmdCommand, 'cmd')}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-amber-400 hover:text-black text-zinc-200 transition shrink-0"
                  title="Copy CMD command"
                >
                  {copiedType === 'cmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                <span>Automatic execution policy bypass for Command Prompt</span>
                <button
                  onClick={() => handleCopy(cmdCommand, 'cmd')}
                  className="text-amber-400 font-medium hover:underline"
                >
                  {copiedType === 'cmd' ? 'Copied to clipboard ✔' : 'Click to copy'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 1-CLICK DOWNLOADABLE SHORTCUTS & LAUNCHERS (NEW REQUESTED FEATURE) */}
        <section id="downloads" className="space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <FolderDown className="w-6 h-6 text-cyan-400" />
                1-Click Downloadable Shortcuts & Launchers
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Don't want to type commands? Download these instant helpers to launch or create permanent desktop shortcuts!
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
              No Typing Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: 1-Click Desktop Launcher .bat */}
            <div className="rounded-2xl border border-cyan-500/40 bg-zinc-900/60 p-6 space-y-4 hover:border-cyan-400 transition shadow-xl relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <MousePointerClick className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    .BAT File
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">1-Click Desktop Launcher</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Download and simply <strong>double-click</strong>. It auto-elevates to Administrator and launches the toolkit instantly without typing a single word!
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                <button
                  onClick={() => handleDownload('ItsRiRx-ToolKit.bat', batLauncherCode, 'Desktop Launcher (.bat)')}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20"
                >
                  <Download className="w-4 h-4" />
                  Download ItsRiRx-ToolKit.bat
                </button>
                <span className="text-[11px] text-zinc-500 block text-center">Double-click anytime from your Desktop or USB</span>
              </div>
            </div>

            {/* Card 2: Permanent 'rirx' Command Installer */}
            <div className="rounded-2xl border border-emerald-500/40 bg-zinc-900/60 p-6 space-y-4 hover:border-emerald-400 transition shadow-xl relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Super Fast
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">Setup 'rirx' Command</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Double-click this once. It permanently registers the <strong>`rirx`</strong> command into your PowerShell Profile. Afterward, just type <strong>`rirx`</strong> anywhere!
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                <button
                  onClick={() => handleDownload('Setup-rirx-Command.bat', setupRirxCode, 'rirx Setup (.bat)')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  Download Setup-rirx-Command.bat
                </button>
                <span className="text-[11px] text-zinc-500 block text-center">Open terminal & type "rirx" anytime</span>
              </div>
            </div>

            {/* Card 3: Create Desktop Shortcut .vbs */}
            <div className="rounded-2xl border border-purple-500/40 bg-zinc-900/60 p-6 space-y-4 hover:border-purple-400 transition shadow-xl relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    .VBS Script
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">Create Desktop Icon (.lnk)</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Generates an official Windows Shortcut icon named <strong>"ItsRiRx ToolKit"</strong> directly onto your Windows Desktop with 1 double-click!
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                <button
                  onClick={() => handleDownload('Create-Desktop-Shortcut.vbs', vbsShortcutCode, 'Desktop Shortcut Creator (.vbs)')}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-purple-500/20"
                >
                  <Download className="w-4 h-4" />
                  Download Create-Desktop-Shortcut.vbs
                </button>
                <span className="text-[11px] text-zinc-500 block text-center">Places an official shortcut icon on your Desktop</span>
              </div>
            </div>
          </div>

          {/* Quick Help & Fix Banner for ExecutionPolicy */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Auto-Fix for "Running scripts is disabled on this system"</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Resolved</span>
                </h4>
                <p className="text-xs text-zinc-300">
                  The updated <strong>Setup-rirx-Command.bat</strong> automatically fixes Windows execution policies and installs a global <code className="text-emerald-300 font-mono">rirx.cmd</code> binary that works everywhere (PowerShell, CMD, Run Dialog).
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownload('Setup-rirx-Command.bat', setupRirxCode, 'rirx Setup (.bat)')}
              className="py-2 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold whitespace-nowrap transition"
            >
              Download Fixed Setup (.bat)
            </button>
          </div>
        </section>

        {/* HOW TO USE */}
        <section id="how-to-use" className="space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-cyan-400" />
              How to Use (3 Simple Steps)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Get started in seconds on any Windows computer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-white text-base">Open Terminal or Download Launcher</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Open <strong>PowerShell</strong> as Administrator OR double-click your downloaded <strong>`ItsRiRx-ToolKit.bat`</strong> file.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-white text-base">Execute in 1 Click</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If using the command, paste <code className="text-cyan-400 font-mono">irm https://itsrirx-toolkit.vercel.app/i | iex</code> and press Enter.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-white text-base">Select & Control Tools</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A clean dashboard appears. Type option numbers (e.g. 1, 2, 3) to configure debloat, gaming power plans, battery reports, or pick apps with checkboxes.
              </p>
            </div>
          </div>
        </section>

        {/* TOP APPLICATIONS SHOWCASE */}
        <section id="apps" className="space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Boxes className="w-6 h-6 text-cyan-400" />
                Application Categories & Catalog
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                9 verified categories with direct Winget ID integration and safe approval flow
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
              47 Top Applications
            </span>
          </div>

          {/* CATEGORIES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.num}
                className={`rounded-2xl border bg-gradient-to-br ${cat.color} p-5 space-y-4 hover:border-zinc-500/60 transition-all duration-300 shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                      <span>{cat.logo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                        Category {cat.num}
                      </span>
                      <h3 className="font-bold text-base tracking-tight text-white">
                        {cat.title}
                      </h3>
                    </div>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                    {cat.apps.length} Apps
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.apps.map((app, aIdx) => (
                    <span
                      key={aIdx}
                      className="text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 transition"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ALL CATEGORIES & ADVANCED FEATURES */}
        <section id="features" className="space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              Category-Wise Advanced Features
            </h2>
            <p className="text-xs text-zinc-400 mt-1">High-impact Windows administration routines organized cleanly by domain</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Category 1 */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Debloat & Privacy</h3>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li>Disable telemetry and DiagTrack tracking</li>
                <li>Disable Bing web search in Start Menu</li>
                <li>Restore Windows 10 Classic Context Menu in Win 11</li>
                <li>Remove pre-installed UWP bloatware apps</li>
                <li>Disable Advertising ID & Activity Feeds</li>
              </ul>
            </div>

            {/* Category 2 */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Gaming & Performance</h3>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li>Unlock & activate "Ultimate Performance" plan</li>
                <li>Disable Windows Game DVR background recording</li>
                <li>Disable Mouse Acceleration (1:1 Raw input)</li>
                <li>Optimize visual effects for maximum responsiveness</li>
                <li>Disable continuous search indexing on Drive C:</li>
              </ul>
            </div>

            {/* Category 3 */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">System Safety & Restore</h3>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li>1-Click System Restore Point snapshot generator</li>
                <li>Audit and view existing system restore checkpoints</li>
                <li>Monitor active listening ports & process IDs</li>
                <li>Update Microsoft Defender definitions on-demand</li>
                <li>Trigger Microsoft Defender quick malware scan</li>
              </ul>
            </div>

            {/* Category 4 */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Developer Virtualization</h3>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li>Enable Windows Subsystem for Linux (WSL2)</li>
                <li>Enable Windows Sandbox disposable VM</li>
                <li>Enable Hyper-V Hypervisor & management tools</li>
                <li>Enable Virtual Machine Platform components</li>
                <li>Check status of all virtualization flags</li>
              </ul>
            </div>

            {/* Category 5 */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Battery & Power Health</h3>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li>Generate & launch full HTML Battery Health Report</li>
                <li>Inspect battery wear level & designed capacity</li>
                <li>Generate Sleep Study for standby drain analysis</li>
                <li>List all system power schemes</li>
              </ul>
            </div>

            {/* Category 6 */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Disk Cleanup & Storage</h3>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li>Clean user temporary files & Windows system temp</li>
                <li>Find Top 15 Largest Files across user profiles</li>
                <li>Manual SSD TRIM & ReTrim optimization</li>
                <li>Empty Recycle Bins safely without locking freezes</li>
                <li>Clean Chrome, Edge, and Firefox browser caches</li>
              </ul>
            </div>

            {/* Category 7: App Uninstaller & Deep Cleaner */}
            <div className="p-5 rounded-2xl border border-cyan-500/40 bg-zinc-900/60 space-y-3 hover:border-cyan-400 transition shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">App Uninstaller & Deep Cleaner</h3>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                <li>Batch multi-select removal for desktop & Store apps</li>
                <li>Deep leftover data & cache scrubbing (AppData / ProgramData)</li>
                <li>Search installed applications instantly by keyword</li>
                <li>Silent native engine via Winget, MSI & native uninstallers</li>
                <li>Purge orphaned directories left behind by deleted apps</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECURITY & TRUST */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">100% Safe, Transparent & In-Memory Execution</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The ItsRiRx Windows Tool Kit is built strictly for authorized system administration and maintenance. No residual scripts are written to your local storage, and no personal credentials, telemetry, or system profiles are ever recorded or transmitted to external servers. All disruptive actions explicitly ask for <code className="text-cyan-400 font-mono">[Y/N]</code> confirmation before execution.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ItsRiRx Windows Tool Kit v1.1.0 PRO</span>
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
