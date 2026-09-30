import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Wifi,
  Wrench,
  Trash2,
  Settings,
  Zap,
  Boxes,
  FileCode,
  BookOpen,
  ArrowRight,
  Server,
  Play
} from 'lucide-react';

export default function App() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'launcher' | 'terminal' | 'source' | 'docs' | 'deploy'>('launcher');
  const [hostUrl, setHostUrl] = useState<string>('');
  const [customVercelDomain, setCustomVercelDomain] = useState<string>('');
  const [scriptSource, setScriptSource] = useState<string>('Loading toolkit PowerShell source...');
  const [simStep, setSimStep] = useState<string>('main');
  const [simLogs, setSimLogs] = useState<Array<{ text: string; color?: string }>>([]);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itsrirx-toolkit.vercel.app';
    setHostUrl(origin);

    // Fetch live script source
    fetch('/i')
      .then(res => res.text())
      .then(text => setScriptSource(text))
      .catch(() => setScriptSource('# Unable to load remote script preview. Use /i directly.'));
  }, []);

  const activeOrigin = customVercelDomain ? (customVercelDomain.startsWith('http') ? customVercelDomain : `https://${customVercelDomain}`) : hostUrl;
  const endpointUrl = `${activeOrigin}/i`;

  const psCommand = `irm ${endpointUrl} | iex`;
  const cmdCommand = `powershell -NoProfile -ExecutionPolicy Bypass -Command "irm ${endpointUrl} | iex"`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Simulated Terminal logic
  const handleTerminalSelect = (option: string) => {
    if (simStep === 'main') {
      switch (option) {
        case '1':
          setSimStep('software');
          setSimLogs([
            { text: '--- MODULE 1: SOFTWARE INSTALLER (WINGET) ---', color: 'text-cyan-400' },
            { text: '[INFO] Verifying Winget client...', color: 'text-cyan-400' },
            { text: '[OK]   Winget is installed and operational.', color: 'text-emerald-400' },
            { text: 'Catalog: Notepad++, Google Chrome, Python 3.14, Firefox, WinRAR, VLC, Avro', color: 'text-zinc-400' }
          ]);
          break;
        case '2':
          setSimStep('network');
          setSimLogs([
            { text: '--- MODULE 2: NETWORK DIAGNOSTICS ---', color: 'text-cyan-400' },
            { text: '[OK]   Active Adapter: Wi-Fi (Intel Wi-Fi 6 AX201 160MHz)', color: 'text-emerald-400' },
            { text: '  IPv4 Address : 192.168.1.145', color: 'text-zinc-200' },
            { text: '  IPv4 Gateway : 192.168.1.1', color: 'text-zinc-200' },
            { text: '  DNS Servers  : 1.1.1.1, 1.0.0.1 (Cloudflare)', color: 'text-zinc-200' },
            { text: '[OK]   Internet connectivity is fully operational.', color: 'text-emerald-400' }
          ]);
          break;
        case '3':
          setSimStep('repair');
          setSimLogs([
            { text: '--- MODULE 3: WINDOWS REPAIR ---', color: 'text-cyan-400' },
            { text: 'Available tools: SFC /scannow, DISM ScanHealth, DISM RestoreHealth, CHKDSK, Windows Update Repair', color: 'text-zinc-300' },
            { text: '[INFO] Elevated privileges checked: Ready for repair routines.', color: 'text-cyan-400' }
          ]);
          break;
        case '4':
          setSimStep('cleanup');
          setSimLogs([
            { text: '--- MODULE 4: CLEANUP TOOLS ---', color: 'text-cyan-400' },
            { text: '[INFO] Scanning temporary file storage...', color: 'text-cyan-400' },
            { text: '  User Temp (C:\\Users\\Admin\\AppData\\Local\\Temp) : 1,420 MB', color: 'text-zinc-300' },
            { text: '  Windows Temp (C:\\Windows\\Temp)                   : 340 MB', color: 'text-zinc-300' },
            { text: '  Windows Update Cache                             : 2,150 MB', color: 'text-zinc-300' },
            { text: '[OK]   Estimated reclaimable disk space: ~3.91 GB', color: 'text-emerald-400' }
          ]);
          break;
        case '5':
          setSimStep('system');
          setSimLogs([
            { text: '--- MODULE 5: SYSTEM INFORMATION ---', color: 'text-cyan-400' },
            { text: 'Host: DESKTOP-IRX01 | User: ItsRiRx', color: 'text-zinc-100 font-bold' },
            { text: 'OS: Microsoft Windows 11 Pro 64-bit (Build 22631.4317)', color: 'text-zinc-300' },
            { text: 'CPU: 13th Gen Intel(R) Core(TM) i7-13700H (14 Cores / 20 Threads)', color: 'text-zinc-300' },
            { text: 'RAM: 32.00 GB DDR5 @ 5200 MHz across 2 modules', color: 'text-zinc-300' },
            { text: 'GPU: NVIDIA GeForce RTX 4070 Laptop GPU (8192 MB VRAM)', color: 'text-zinc-300' },
            { text: 'Disk: Samsung SSD 990 PRO 2TB (C: 412 GB free of 1860 GB)', color: 'text-zinc-300' }
          ]);
          break;
        case '6':
          setSimStep('utility');
          setSimLogs([
            { text: '--- MODULE 6: WINDOWS UTILITIES ---', color: 'text-cyan-400' },
            { text: 'Quick shortcuts for: Task Manager, Device Manager, Services, Regedit, Control Panel, Event Viewer, Disk Mgmt', color: 'text-zinc-300' }
          ]);
          break;
        case '7':
          setSimStep('config');
          setSimLogs([
            { text: '--- MODULE 7: WINDOWS CONFIGURATION ---', color: 'text-cyan-400' },
            { text: 'License Query: Licensed (Permanently Activated)', color: 'text-emerald-400' },
            { text: 'Current Time Zone: Bangladesh Standard Time (UTC+06:00)', color: 'text-zinc-300' },
            { text: 'Power Plan: High Performance (Active)', color: 'text-zinc-300' }
          ]);
          break;
        case '8':
          setSimStep('quick');
          setSimLogs([
            { text: '--- MODULE 8: QUICK ACTIONS ---', color: 'text-cyan-400' },
            { text: '[OK]   DNS Client Cache flushed successfully.', color: 'text-emerald-400' },
            { text: '[OK]   Gateway, DNS, and HTTPS connectivity tests passed.', color: 'text-emerald-400' }
          ]);
          break;
        case '0':
          setSimLogs([{ text: 'Thank you for using ItsRiRx Windows Tool Kit! Session closed.', color: 'text-cyan-300' }]);
          break;
        default:
          break;
      }
    } else {
      // Submenus - 0 returns to main
      setSimStep('main');
      setSimLogs([]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">ItsRiRx Windows Tool Kit</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">v1.0.0</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">irm {activeOrigin.replace(/^https?:\/\//, '')}/i | iex</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('launcher')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition ${
                activeTab === 'launcher' ? 'bg-cyan-500 text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Launcher
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'terminal' ? 'bg-cyan-500 text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Terminal Preview
            </button>
            <button
              onClick={() => setActiveTab('source')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'source' ? 'bg-cyan-500 text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Source (.ps1)
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'deploy' ? 'bg-cyan-500 text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              Vercel Deploy
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition ${
                activeTab === 'docs' ? 'bg-cyan-500 text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Docs & Modules
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* TAB 1: LAUNCHER & QUICK START */}
        {activeTab === 'launcher' && (
          <div className="space-y-8">
            {/* Google Cloud Run IAP Warning Banner */}
            {hostUrl.includes('ais-dev-') && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
                  <span className="p-1 rounded bg-amber-500/20 text-amber-300">⚠️</span>
                  Why &quot;irm https://ais-dev-.../i&quot; gives CSS / HTML errors
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  The <code className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded">ais-dev-...</code> URL is Google AI Studio&apos;s internal private preview environment. When accessed from Windows terminal without Google session cookies, Google Cloud returns an <strong>authentication login HTML/CSS page</strong> (containing <code className="text-amber-200">display: flex; color: light-dark(...)</code>) instead of raw text.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span className="text-zinc-400">Solution:</span>
                  <span className="text-emerald-400 font-bold">Deploy to Vercel</span>
                  <span className="text-zinc-500">or</span>
                  <span className="text-cyan-400">Use GitHub Raw / Local toolkit.ps1</span>
                </div>
              </div>
            )}

            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Zero Download • In-Memory Execution • Windows PowerShell 5.1 & PS 7+
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Remotely Hosted Windows Administration Toolkit
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Run a single command in Windows PowerShell or CMD. No <code className="text-zinc-200">.exe</code>,{' '}
                  <code className="text-zinc-200">.ps1</code> file download, Python, or Node.js runtime required on the client.
                  The complete toolkit runs directly in memory with interactive color menus, system file repairs, Winget package deployments, and deep network diagnostics.
                </p>
              </div>

              {/* URL Customizer */}
              <div className="mt-6 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs">
                <span className="text-zinc-400">Endpoint Domain:</span>
                <input
                  type="text"
                  placeholder="https://your-project.vercel.app"
                  value={customVercelDomain}
                  onChange={(e) => setCustomVercelDomain(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 w-72"
                />
                <span className="text-zinc-500">(Auto-detected: {hostUrl})</span>
              </div>
            </div>

            {/* 1-Click Launchers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PowerShell Launcher */}
              <div className="rounded-xl border border-cyan-800/40 bg-zinc-900/60 p-6 space-y-4 relative group hover:border-cyan-500/60 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                    <h3 className="font-semibold text-white text-base">Windows PowerShell Launcher</h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">Recommended</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Open PowerShell (Run as Administrator for full repair capability) and paste:
                </p>
                <div className="bg-black/80 rounded-lg p-3 border border-zinc-800 font-mono text-xs sm:text-sm text-cyan-300 flex items-center justify-between overflow-x-auto gap-3">
                  <span className="select-all">{psCommand}</span>
                  <button
                    onClick={() => handleCopy(psCommand, 'ps')}
                    className="p-2 rounded bg-zinc-800 hover:bg-cyan-500 hover:text-black text-zinc-300 transition shrink-0"
                    title="Copy PowerShell Command"
                  >
                    {copiedType === 'ps' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                  <span>Alias: <code>irm</code> = Invoke-RestMethod, <code>iex</code> = Invoke-Expression</span>
                  <button
                    onClick={() => handleCopy(psCommand, 'ps')}
                    className="text-cyan-400 hover:underline font-mono"
                  >
                    {copiedType === 'ps' ? 'Copied to clipboard!' : 'Click to copy'}
                  </button>
                </div>
              </div>

              {/* CMD Launcher */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4 relative group hover:border-zinc-700 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-zinc-400" />
                    <h3 className="font-semibold text-white text-base">Windows Command Prompt (CMD)</h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">Universal CMD</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Open Windows CMD (Command Prompt) and run with execution policy bypass:
                </p>
                <div className="bg-black/80 rounded-lg p-3 border border-zinc-800 font-mono text-xs sm:text-sm text-amber-300 flex items-center justify-between overflow-x-auto gap-3">
                  <span className="select-all">{cmdCommand}</span>
                  <button
                    onClick={() => handleCopy(cmdCommand, 'cmd')}
                    className="p-2 rounded bg-zinc-800 hover:bg-amber-400 hover:text-black text-zinc-300 transition shrink-0"
                    title="Copy CMD Command"
                  >
                    {copiedType === 'cmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                  <span>Direct bypass without modifying machine execution policy</span>
                  <button
                    onClick={() => handleCopy(cmdCommand, 'cmd')}
                    className="text-amber-400 hover:underline font-mono"
                  >
                    {copiedType === 'cmd' ? 'Copied to clipboard!' : 'Click to copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Endpoints & Direct Access */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">HTTP Plain-Text Endpoints</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">GET /i</span>
                    <a href="/i" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1">
                      Raw <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-zinc-400 font-sans">Returns the complete PowerShell source code with <code>Content-Type: text/plain; charset=utf-8</code>.</p>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">GET /info</span>
                    <a href="/info" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1">
                      Banner <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-zinc-400 font-sans">Minimal plain-text documentation and launcher instructions for curl and text browsers.</p>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold">In-Memory Execution</span>
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-zinc-400 font-sans">Streams directly into memory with <code>Invoke-Expression</code> without leaving traces on the local drive.</p>
                </div>
              </div>
            </div>

            {/* Toolkit Modules Overview */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Included Modules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    id: '1',
                    icon: Boxes,
                    title: 'Software Installer',
                    desc: 'Winget batch deployment: Essential, Browsers, Dev Pack, Multimedia & Custom.',
                    color: 'text-blue-400'
                  },
                  {
                    id: '2',
                    icon: Wifi,
                    title: 'Network Tools',
                    desc: 'IP config, Ping, Traceroute, DNS lookup, DNS Flush, DNS Switcher & WiFi profiles.',
                    color: 'text-emerald-400'
                  },
                  {
                    id: '3',
                    icon: Wrench,
                    title: 'Windows Repair',
                    desc: 'SFC /scannow, DISM Scan/RestoreHealth, CHKDSK and Windows Update service repairs.',
                    color: 'text-amber-400'
                  },
                  {
                    id: '4',
                    icon: Trash2,
                    title: 'Cleanup Tools',
                    desc: 'Safe User Temp, System Temp, Recycle Bin, Update Cache & Browser Cache cleaners.',
                    color: 'text-rose-400'
                  },
                  {
                    id: '5',
                    icon: Cpu,
                    title: 'System Information',
                    desc: 'CIM audit: CPU cores, RAM modules, Disks, GPU VRAM, Motherboard and BIOS.',
                    color: 'text-purple-400'
                  },
                  {
                    id: '6',
                    icon: Settings,
                    title: 'Windows Utilities',
                    desc: 'Instant shortcuts to Taskmgr, DevMgmt, Services, Regedit, Event Viewer & CMD.',
                    color: 'text-cyan-400'
                  },
                  {
                    id: '7',
                    icon: Zap,
                    title: 'Windows Config',
                    desc: 'Official license status, hostname rename, timezone changer and power schemes.',
                    color: 'text-yellow-400'
                  },
                  {
                    id: '8',
                    icon: Terminal,
                    title: 'Quick Actions',
                    desc: '1-click routines: Flush DNS, Test Internet, Restart Explorer, Run SFC.',
                    color: 'text-teal-400'
                  }
                ].map((mod) => (
                  <div key={mod.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-2 hover:border-zinc-700 transition">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 ${mod.color}`}>
                        <mod.icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-white text-sm">[{mod.id}] {mod.title}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{mod.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TERMINAL SIMULATOR */}
        {activeTab === 'terminal' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" /> Interactive Terminal Emulator
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Preview how the PowerShell terminal renders on Windows console. Click any menu item or option below.
                </p>
              </div>
              <button
                onClick={() => { setSimStep('main'); setSimLogs([]); }}
                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition"
              >
                Reset Menu
              </button>
            </div>

            {/* Terminal Window Box */}
            <div className="rounded-xl border border-zinc-800 bg-black font-mono text-xs sm:text-sm shadow-2xl overflow-hidden">
              {/* Window Title Bar */}
              <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="text-zinc-400 text-xs ml-2">Administrator: Windows PowerShell</span>
                </div>
                <span className="text-zinc-500 text-xs">80x25 ANSI</span>
              </div>

              {/* Console Body */}
              <div className="p-4 sm:p-6 space-y-3 min-h-[480px]">
                {/* Banner */}
                <div className="text-cyan-400 whitespace-pre font-mono leading-tight">
{`╔══════════════════════════════════════════════════════════════════╗
║                  ITS RIRX WINDOWS TOOL KIT                       ║
║                         Version 1.0.0                            ║
╠══════════════════════════════════════════════════════════════════╣
║  Status: Administrator [ELEVATED]                                ║
║  Host:   DESKTOP-IRX01 | User: ItsRiRx                           ║
╚══════════════════════════════════════════════════════════════════╝`}
                </div>

                {/* Submenu or Main Menu */}
                {simStep === 'main' ? (
                  <div className="space-y-1 pt-2">
                    <p className="text-white">  [1] Software Installer       (Winget App Deployments)</p>
                    <p className="text-white">  [2] Network Tools            (IP, DNS, WiFi, Ping, Trace)</p>
                    <p className="text-white">  [3] Windows Repair           (SFC, DISM, CHKDSK, WinUpdate)</p>
                    <p className="text-white">  [4] Cleanup Tools            (Temp Files, Recycle Bin, Caches)</p>
                    <p className="text-white">  [5] System Information       (CPU, RAM, Disks, GPU, Motherboard)</p>
                    <p className="text-white">  [6] Windows Utilities        (Task Manager, Regedit, Services)</p>
                    <p className="text-white">  [7] Windows Configuration    (Hostname, TimeZone, License, Power)</p>
                    <p className="text-white">  [8] Quick Actions            (One-Click Diagnostic Routines)</p>
                    <p className="text-zinc-500">  [0] Exit Toolkit</p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    {simLogs.map((log, idx) => (
                      <div key={idx} className={log.color || 'text-zinc-200'}>
                        {log.text}
                      </div>
                    ))}
                    <div className="pt-4">
                      <p className="text-zinc-400">  [0] Back to Main Menu</p>
                    </div>
                  </div>
                )}

                {/* Simulated Input Area */}
                <div className="pt-4 border-t border-zinc-900 flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">PS &gt;</span>
                  <span className="text-zinc-400 text-xs">
                    {simStep === 'main' ? 'Select an option [0-8]:' : 'Press [0] to return to Main Menu:'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Interactive Controller Buttons */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Test Menu Options:</span>
              <div className="flex flex-wrap gap-2">
                {simStep === 'main' ? (
                  <>
                    {[
                      { num: '1', label: '1: Software' },
                      { num: '2', label: '2: Network' },
                      { num: '3', label: '3: Repair' },
                      { num: '4', label: '4: Cleanup' },
                      { num: '5', label: '5: System Info' },
                      { num: '6', label: '6: Utilities' },
                      { num: '7', label: '7: Config' },
                      { num: '8', label: '8: Quick Actions' },
                      { num: '0', label: '0: Exit' }
                    ].map((btn) => (
                      <button
                        key={btn.num}
                        onClick={() => handleTerminalSelect(btn.num)}
                        className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-cyan-500 hover:text-black text-xs font-mono text-zinc-200 transition"
                      >
                        Select [{btn.num}]
                      </button>
                    ))}
                  </>
                ) : (
                  <button
                    onClick={() => handleTerminalSelect('0')}
                    className="px-4 py-1.5 rounded bg-cyan-500 text-black text-xs font-mono font-bold transition hover:bg-cyan-400"
                  >
                    Select [0] Back to Main Menu
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SOURCE CODE INSPECTOR */}
        {activeTab === 'source' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-cyan-400" /> toolkit.ps1 Source Code
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Windows PowerShell 5.1 & PowerShell 7 compatible. Hosted remotely and returned by <code>/i</code>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(scriptSource, 'src')}
                  className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition flex items-center gap-1.5"
                >
                  {copiedType === 'src' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'src' ? 'Copied' : 'Copy All'}
                </button>
                <a
                  href="/i"
                  download="toolkit.ps1"
                  className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .ps1
                </a>
              </div>
            </div>

            {/* Code Box */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs overflow-x-auto max-h-[640px] text-zinc-300 leading-relaxed">
              <pre>{scriptSource}</pre>
            </div>
          </div>
        )}

        {/* TAB 4: DEPLOYMENT GUIDE */}
        {activeTab === 'deploy' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Deploy to Vercel & GitHub</h2>
              <p className="text-zinc-400 text-sm mt-1">
                Zero configuration required. Vercel serverless function serves the toolkit directly via <code>/i</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1: GitHub Push */}
              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs">1</span>
                  Push Code to GitHub
                </div>
                <p className="text-xs text-zinc-400">
                  Initialize git, stage the files, and push to your GitHub account:
                </p>
                <div className="p-3 rounded-lg bg-black font-mono text-xs text-zinc-300 space-y-1">
                  <p>git init</p>
                  <p>git add .</p>
                  <p>git commit -m &quot;Initial release of ItsRiRx Windows Tool Kit&quot;</p>
                  <p>git branch -M main</p>
                  <p>git remote add origin https://github.com/YOUR_USER/itsrirx-toolkit.git</p>
                  <p>git push -u origin main</p>
                </div>
              </div>

              {/* Step 2: Import into Vercel */}
              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs">2</span>
                  Import into Vercel
                </div>
                <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside">
                  <li>Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="text-cyan-400 underline">vercel.com/dashboard</a>.</li>
                  <li>Click <strong>&quot;Add New...&quot; &rarr; &quot;Project&quot;</strong>.</li>
                  <li>Select your <strong>itsrirx-toolkit</strong> repository.</li>
                  <li>Leave build settings as default. Click <strong>Deploy</strong>.</li>
                  <li>Copy your assigned domain (e.g. <code>itsrirx-toolkit.vercel.app</code>).</li>
                </ol>
              </div>

              {/* Step 3: Run Remote Launcher */}
              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4 md:col-span-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs">3</span>
                  Execute on Any Windows PC
                </div>
                <p className="text-xs text-zinc-400">
                  Once deployed to Vercel, any Windows 10 or Windows 11 machine can instantly launch the toolkit by running:
                </p>
                <div className="p-3 rounded-lg bg-black font-mono text-xs sm:text-sm text-cyan-400 flex items-center justify-between">
                  <span>irm https://your-project.vercel.app/i | iex</span>
                  <button
                    onClick={() => handleCopy('irm https://your-project.vercel.app/i | iex', 'vcmd')}
                    className="p-1.5 rounded bg-zinc-800 hover:bg-cyan-500 hover:text-black transition"
                  >
                    {copiedType === 'vcmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENTATION & SPEC */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Technical Specifications & Security Model</h2>
              <p className="text-zinc-400 text-sm mt-1">
                Engineered for authorized Windows administration, zero persistence, and strict input validation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security Safeguards
                </h3>
                <ul className="text-zinc-300 space-y-2 list-disc list-inside">
                  <li><strong>Zero Arbitrary Execution:</strong> The script does NOT evaluate remote code from query parameters or user-provided strings.</li>
                  <li><strong>Package Whitelisting:</strong> Only whitelisted Winget package IDs are executed; user inputs are regex validated.</li>
                  <li><strong>Confirmation Prompts:</strong> Destructive or disruptive operations (network reset, IP release, DISM RestoreHealth, Recycle Bin purge) require explicit confirmation.</li>
                  <li><strong>Zero Telemetry:</strong> No system data, credentials, or audit logs are ever uploaded or transmitted.</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" /> Elevation Mechanics
                </h3>
                <ul className="text-zinc-300 space-y-2 list-disc list-inside">
                  <li><strong>Remote In-Memory Elevation:</strong> Standard scripts fail to elevate when launched via <code>irm | iex</code> because <code>$PSCommandPath</code> is null.</li>
                  <li>ItsRiRx Toolkit detects memory execution and dynamically relaunches with <code>Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command 'irm URL | iex'"</code>.</li>
                  <li>Seamlessly prompts UAC and relaunches in an elevated session without requiring any physical file on disk.</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-blue-400" /> How to Add Software Packages
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Open <code>toolkit.ps1</code> and add your desired package to the <code className="text-cyan-300">$Script:SoftwareCatalog</code> hashtable:
                </p>
                <div className="bg-black p-2.5 rounded font-mono text-zinc-300">
                  &quot;VS Code&quot; = @&#123; Id = &quot;Microsoft.VisualStudioCode&quot;; Name = &quot;Visual Studio Code&quot;; Category = &quot;Developer&quot; &#125;
                </div>
                <p className="text-zinc-400">Then add the key to <code>$Script:PackageGroups[&quot;Developer&quot;]</code>.</p>
              </div>

              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" /> Compatibility Matrix
                </h3>
                <ul className="text-zinc-300 space-y-1.5">
                  <li>• <strong>Windows 11:</strong> 100% Native support (PowerShell 5.1 &amp; PowerShell 7+)</li>
                  <li>• <strong>Windows 10:</strong> 100% Native support (Build 1809+)</li>
                  <li>• <strong>Winget Requirement:</strong> Windows App Installer from Microsoft Store or GitHub.</li>
                  <li>• <strong>PowerShell ExecutionPolicy:</strong> Handled seamlessly via <code>-ExecutionPolicy Bypass</code> in the launcher.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ItsRiRx Windows Tool Kit v1.0.0</span>
          </div>
          <div>
            PowerShell Launcher: <code className="text-zinc-400">irm {activeOrigin}/i | iex</code>
          </div>
          <div>
            Built for legitimate Windows systems administration.
          </div>
        </div>
      </footer>
    </div>
  );
}
