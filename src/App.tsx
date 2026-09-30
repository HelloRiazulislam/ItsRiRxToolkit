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
  Play,
  HelpCircle,
  Sparkles,
  ArrowRight,
  MonitorCheck,
  CheckCircle2,
  HardDrive,
  Globe
} from 'lucide-react';

export default function App() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [hostUrl, setHostUrl] = useState<string>('');
  const [simStep, setSimStep] = useState<string>('main');
  const [simLogs, setSimLogs] = useState<Array<{ text: string; color?: string }>>([]);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itsrirx-toolkit.vercel.app';
    setHostUrl(origin);
  }, []);

  const endpointUrl = `${hostUrl}/i`;
  const psCommand = `irm ${endpointUrl} | iex`;
  const cmdCommand = `powershell -NoProfile -ExecutionPolicy Bypass -Command "irm ${endpointUrl} | iex"`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Terminal simulator logic
  const handleTerminalSelect = (option: string) => {
    if (simStep === 'main') {
      switch (option) {
        case '1':
          setSimStep('software');
          setSimLogs([
            { text: '  ╔════════════════════════════════════════════════════════════════════╗', color: 'text-cyan-400' },
            { text: '  ║             MODULE 1: SOFTWARE SELECTOR (WINGET)                   ║', color: 'text-cyan-400' },
            { text: '  ╠════════════════════════════════════════════════════════════════════╣', color: 'text-cyan-400' },
            { text: '  ┌─────┬───────┬──────────────┬────────────────────────┬─────────────┐', color: 'text-cyan-400' },
            { text: '  │ #   │ SELECT│ STATUS       │ APPLICATION NAME       │ WINGET ID   │', color: 'text-cyan-400' },
            { text: '  ├─────┼───────┼──────────────┼────────────────────────┼─────────────┤', color: 'text-cyan-400' },
            { text: '  │ [1] │ [ ]   │ AVAILABLE    │ Google Chrome          │ Chrome      │', color: 'text-cyan-300' },
            { text: '  │ [2] │ [✔]   │ INSTALLED    │ Notepad++              │ Notepad++   │', color: 'text-emerald-400' },
            { text: '  │ [3] │ [ ]   │ AVAILABLE    │ Python 3.14            │ Python      │', color: 'text-cyan-300' },
            { text: '  │ [4] │ [ ]   │ AVAILABLE    │ VLC Media Player       │ VLC         │', color: 'text-cyan-300' },
            { text: '  │ [5] │ [ ]   │ AVAILABLE    │ WinRAR                 │ WinRAR      │', color: 'text-cyan-300' },
            { text: '  └─────┴───────┴──────────────┴────────────────────────┴─────────────┘', color: 'text-cyan-400' },
            { text: '  👉 User picks numbers: 1, 4', color: 'text-yellow-300' },
            { text: '  ──────────────────────────────────────────────────────────────────────', color: 'text-zinc-600' },
            { text: '  ╔════════════════════════════════════════════════════════════════════╗', color: 'text-amber-400' },
            { text: '  ║                 FINAL INSTALLATION CONFIRMATION                    ║', color: 'text-amber-400' },
            { text: '  ╠════════════════════════════════════════════════════════════════════╣', color: 'text-amber-400' },
            { text: '  ║  Installing: Google Chrome, VLC Media Player. Proceed? [Y/N]       ║', color: 'text-white font-bold' },
            { text: '  ╚════════════════════════════════════════════════════════════════════╝', color: 'text-amber-400' },
            { text: '  [OK]   Winget only starts after user approves with Y.', color: 'text-emerald-400' }
          ]);
          break;
        case '2':
          setSimStep('network');
          setSimLogs([
            { text: '  ╔════════════════════════════════════════════════════════════════════╗', color: 'text-cyan-400' },
            { text: '  ║                 MODULE 2: NETWORK DIAGNOSTICS & TOOLS              ║', color: 'text-cyan-400' },
            { text: '  ╠════════════════════════════════════════════════════════════════════╣', color: 'text-cyan-400' },
            { text: '  [OK]   Active Adapter: Wi-Fi 6 (Intel AX201) - 1.2 Gbps Link Speed', color: 'text-emerald-400' },
            { text: '    • IPv4 Address : 192.168.1.145 (Subnet: 255.255.255.0)', color: 'text-zinc-200' },
            { text: '    • Default GW   : 192.168.1.1 (Reachable, 1ms)', color: 'text-zinc-200' },
            { text: '    • DNS Servers  : 1.1.1.1, 1.0.0.1 (Cloudflare Ultra-Fast)', color: 'text-cyan-300' },
            { text: '  ✔ 3-Point Connectivity: Gateway [OK] | DNS [OK] | HTTPS [OK]', color: 'text-emerald-400' }
          ]);
          break;
        case '3':
          setSimStep('repair');
          setSimLogs([
            { text: '  ╔════════════════════════════════════════════════════════════════════╗', color: 'text-cyan-400' },
            { text: '  ║                   MODULE 3: WINDOWS SYSTEM REPAIR                  ║', color: 'text-cyan-400' },
            { text: '  ╠════════════════════════════════════════════════════════════════════╣', color: 'text-cyan-400' },
            { text: '  [1] SFC /scannow       - Scans & repairs corrupted Windows system files', color: 'text-zinc-200' },
            { text: '  [2] DISM RestoreHealth - Downloads & fixes corrupted component store', color: 'text-zinc-200' },
            { text: '  [3] WinUpdate Fix      - Cleans corrupted SoftwareDistribution download cache', color: 'text-zinc-200' },
            { text: '  [OK]   All operations require explicit admin confirmation before running.', color: 'text-emerald-400' }
          ]);
          break;
        case '4':
          setSimStep('cleanup');
          setSimLogs([
            { text: '  ╔════════════════════════════════════════════════════════════════════╗', color: 'text-cyan-400' },
            { text: '  ║                 MODULE 4: DISK & CACHE CLEANUP                     ║', color: 'text-cyan-400' },
            { text: '  ╠════════════════════════════════════════════════════════════════════╣', color: 'text-cyan-400' },
            { text: '  • User Temp Files   ($env:TEMP)                      : 1,420 MB', color: 'text-zinc-300' },
            { text: '  • Windows Temp      (C:\\Windows\\Temp)                 : 480 MB', color: 'text-zinc-300' },
            { text: '  • WinUpdate Cache   (SoftwareDistribution\\Download)   : 2,150 MB', color: 'text-zinc-300' },
            { text: '  ────────────────────────────────────────────────────────────────────', color: 'text-zinc-700' },
            { text: '  ✔ Total Reclaimable Disk Space: ~4.05 GB (Safely skips active locked files)', color: 'text-emerald-400' }
          ]);
          break;
        case '5':
          setSimStep('system');
          setSimLogs([
            { text: '  ╔════════════════════════════════════════════════════════════════════╗', color: 'text-cyan-400' },
            { text: '  ║                 MODULE 5: SYSTEM & HARDWARE INFO                   ║', color: 'text-cyan-400' },
            { text: '  ╠════════════════════════════════════════════════════════════════════╣', color: 'text-cyan-400' },
            { text: '  Host: DESKTOP-IRX01 | User: Administrator', color: 'text-white font-bold' },
            { text: '  OS   : Microsoft Windows 11 Pro 64-bit (Build 22631.4317)', color: 'text-zinc-200' },
            { text: '  CPU  : 13th Gen Intel(R) Core(TM) i7-13700H (14 Cores / 20 Threads)', color: 'text-zinc-200' },
            { text: '  RAM  : 32 GB DDR5 @ 5200 MHz across 2 modules', color: 'text-zinc-200' },
            { text: '  GPU  : NVIDIA GeForce RTX 4070 (8192 MB VRAM)', color: 'text-zinc-200' },
            { text: '  Disk : NVMe Samsung 990 PRO 2TB (Drive C: 412 GB free of 1860 GB)', color: 'text-zinc-200' }
          ]);
          break;
        case '6':
          setSimStep('utility');
          setSimLogs([
            { text: '  ╔════════════════════════════════════════════════════════════════════╗', color: 'text-cyan-400' },
            { text: '  ║                 MODULE 6: BUILT-IN WINDOWS UTILITIES               ║', color: 'text-cyan-400' },
            { text: '  ╠════════════════════════════════════════════════════════════════════╣', color: 'text-cyan-400' },
            { text: '  Instant 1-key launch shortcuts: Task Manager, Device Manager, Regedit,', color: 'text-zinc-200' },
            { text: '  Services, Event Viewer, Disk Management, Command Prompt, System Info.', color: 'text-zinc-200' }
          ]);
          break;
        case '7':
          setSimStep('config');
          setSimLogs([
            { text: '  ╔════════════════════════════════════════════════════════════════════╗', color: 'text-cyan-400' },
            { text: '  ║                 MODULE 7: WINDOWS CONFIGURATION                    ║', color: 'text-cyan-400' },
            { text: '  ╠════════════════════════════════════════════════════════════════════╣', color: 'text-cyan-400' },
            { text: '  Activation : Licensed (Permanently Activated - Official CIM query)', color: 'text-emerald-400 font-bold' },
            { text: '  Timezone   : Eastern Standard Time (UTC-05:00)', color: 'text-zinc-200' },
            { text: '  Power Plan : High Performance (Active)', color: 'text-cyan-300' }
          ]);
          break;
        case '8':
          setSimStep('quick');
          setSimLogs([
            { text: '  ╔════════════════════════════════════════════════════════════════════╗', color: 'text-cyan-400' },
            { text: '  ║                   MODULE 8: INSTANT QUICK ACTIONS                  ║', color: 'text-cyan-400' },
            { text: '  ╠════════════════════════════════════════════════════════════════════╣', color: 'text-cyan-400' },
            { text: '  [OK]   Flushed DNS Resolver Cache in 12ms', color: 'text-emerald-400' },
            { text: '  [OK]   Restarted explorer.exe cleanly to fix frozen taskbars', color: 'text-emerald-400' },
            { text: '  [OK]   3-point Internet validation passed with 0 packet loss', color: 'text-emerald-400' }
          ]);
          break;
        case '0':
          setSimLogs([{ text: 'Thank you for using ItsRiRx Windows Tool Kit! Session ended.', color: 'text-cyan-300' }]);
          break;
        default:
          break;
      }
    } else {
      setSimStep('main');
      setSimLogs([]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Cyber Nav */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">ItsRiRx Windows Tool Kit</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-semibold">v1.0.0</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">Cloud-Hosted Windows Administration Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#how-to-use"
              className="text-xs text-zinc-400 hover:text-white transition hidden sm:inline-block"
            >
              How to Use
            </a>
            <a
              href="#features"
              className="text-xs text-zinc-400 hover:text-white transition hidden sm:inline-block"
            >
              Tool Capabilities
            </a>
            <a
              href="#preview"
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-cyan-400 font-medium border border-zinc-700 transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              Live Preview
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-zinc-950 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-600/40 text-cyan-300 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Zero Downloads • Pure In-Memory Execution • Windows 10 & 11 Compatible
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Complete Windows Admin Suite <span className="text-cyan-400">in One Command</span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              A powerful, remotely hosted PowerShell toolkit designed for system maintenance, corrupted Windows repair, deep disk cleanup, network diagnostics, and batch software installation — executed directly in RAM without installing software or saving files.
            </p>
          </div>

          {/* 1-CLICK LAUNCHERS */}
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

        {/* HOW TO USE SECTION */}
        <section id="how-to-use" className="space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-cyan-400" />
              How to Use (3 Simple Steps)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Get started in seconds on any Windows 10 or 11 computer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-white text-base">Open Terminal</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Open <strong>Windows PowerShell</strong> or <strong>Command Prompt</strong> from the Start Menu. Running as Administrator is recommended for full system repairs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-white text-base">Paste Launcher Command</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click the 1-click copy button above, paste the command into your terminal window, and press <strong>Enter</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-white text-base">Select & Control Tools</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                An interactive cyberpunk console menu appears. Type the option number to navigate. Pick applications via checkboxes and confirm before anything runs.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT THE TOOL DOES / FEATURES */}
        <section id="features" className="space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              What This Toolkit Does (8 Comprehensive Modules)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Engineered to handle your entire Windows administration and troubleshooting workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">1. Software Selector & Batch Installer</h3>
                  <span className="text-[11px] text-blue-400 font-mono">Interactive Checkboxes • Zero Auto-Install</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Skip manually searching websites for installers. Browse a curated catalog of essentials (Chrome, Firefox, VLC, Python, VS Code, Git, WinRAR, 7-Zip, Avro). Check the boxes for the apps you want, review the selection, and approve with <code>Y</code> before Winget starts installing silently.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">2. Windows System & Update Repair</h3>
                  <span className="text-[11px] text-amber-400 font-mono">SFC Scannow • DISM Image • Update Cache Reset</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Resolve system crashes and corrupted DLLs using <code>sfc /scannow</code> and <code>DISM RestoreHealth</code>. If Windows Update is stuck or failing, the toolkit stops services, purges corrupted <code>SoftwareDistribution\Download</code> caches, and restarts update components cleanly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">3. Deep Disk Space & Cache Cleanup</h3>
                  <span className="text-[11px] text-rose-400 font-mono">User Temp • System Temp • Locked-File Safe</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Reclaim gigabytes of wasted storage on drive C:. Safely deletes leftover user temporary files (<code>$env:TEMP</code>), Windows system temp, browser cache folders, and empties Recycle Bins without crashing or modifying active locked files.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">4. Network Diagnostics & DNS Switcher</h3>
                  <span className="text-[11px] text-emerald-400 font-mono">Ping • DNS Flush • Cloudflare / Google Presets</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Run 3-point connectivity diagnostics (Gateway, DNS, and HTTPS). Flush cached DNS to resolve website connection timeouts. Switch DNS on active adapters to ultra-fast Cloudflare (1.1.1.1) or Google (8.8.8.8) with 1 click, and view saved WiFi connection profiles.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">5. Comprehensive Hardware & CIM Audit</h3>
                  <span className="text-[11px] text-purple-400 font-mono">Native CIM • CPU • RAM Speeds • GPU • Disks</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Inspect your hardware specifications instantly without downloading heavy 3rd-party benchmark utilities: CPU core and clock counts, individual RAM module frequencies (MHz) and slots, GPU VRAM, physical SSD capacities, and motherboard model numbers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">6. Built-in Utilities & Windows Configuration</h3>
                  <span className="text-[11px] text-cyan-400 font-mono">TaskMgr • Regedit • Services • Official License</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Instant shortcuts to Task Manager, Registry Editor, Services, Device Manager, and Disk Management. Query official Windows activation status via native WMI licensing APIs, switch system time zones, and activate High Performance power plans.
              </p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE TERMINAL PREVIEW */}
        <section id="preview" className="space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Terminal className="w-6 h-6 text-cyan-400" />
                Live Terminal Preview (Interactive Simulator)
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Experience the exact console interface and checkbox workflow before running it on your PC</p>
            </div>

            <button
              onClick={() => { setSimStep('main'); setSimLogs([]); }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition"
            >
              Reset Menu
            </button>
          </div>

          {/* Terminal Box */}
          <div className="rounded-2xl border border-zinc-800 bg-black font-mono text-xs sm:text-sm shadow-2xl overflow-hidden">
            {/* Title Bar */}
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="text-zinc-400 text-xs ml-2 font-mono">Administrator: Windows PowerShell</span>
              </div>
              <span className="text-zinc-500 text-xs">80x25 ANSI</span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 sm:p-6 space-y-3 min-h-[460px]">
              <div className="text-cyan-400 whitespace-pre font-mono leading-tight text-[11px] sm:text-xs">
{`  ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗
  ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝
  ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT
  ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.0.0
  ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗
  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
  ══════════════════════════════════════════════════════════════════════
  🛡️  STATUS : ADMINISTRATOR [ELEVATED]
  💻 HOST   : DESKTOP-IRX01 | 👤 USER: Administrator
  ══════════════════════════════════════════════════════════════════════`}
              </div>

              {simStep === 'main' ? (
                <div className="space-y-1.5 pt-2">
                  <div className="text-cyan-400 font-bold">  ╔════════════════════════════════════════════════════════════════════╗</div>
                  <div className="text-cyan-400 font-bold">  ║                     SYSTEM CONTROL DASHBOARD                       ║</div>
                  <div className="text-cyan-400 font-bold">  ╠════════════════════════════════════════════════════════════════════╣</div>
                  <p className="text-white">  ║   [1] 📦 Software Installer       • Interactive Winget Deployment  ║</p>
                  <p className="text-white">  ║   [2] 🌐 Network Tools            • Ping, DNS, WiFi, Stack Reset   ║</p>
                  <p className="text-white">  ║   [3] 🔧 Windows System Repair    • SFC, DISM Image & Update Fix   ║</p>
                  <p className="text-white">  ║   [4] 🧹 Deep Disk Cleanup        • User Temp, System & Caches     ║</p>
                  <p className="text-white">  ║   [5] 💻 System Information       • CIM CPU, RAM, GPU, Disk Audit  ║</p>
                  <p className="text-white">  ║   [6] ⚙️ Built-In Utilities       • TaskMgr, DevMgmt, Regedit      ║</p>
                  <p className="text-white">  ║   [7] 🎛️ Windows Configuration    • Hostname, Timezone, License    ║</p>
                  <p className="text-white">  ║   [8] ⚡ Instant Quick Actions    • One-Click System Maintenance   ║</p>
                  <div className="text-cyan-400">  ║                                                                    ║</div>
                  <p className="text-zinc-400">  ║   [0] 🚪 Exit Toolkit             • Return to PowerShell Prompt    ║</p>
                  <div className="text-cyan-400 font-bold">  ╚════════════════════════════════════════════════════════════════════╝</div>
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

              <div className="pt-4 border-t border-zinc-900 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">PS &gt;</span>
                <span className="text-zinc-400 text-xs">
                  {simStep === 'main' ? 'Click any button below to test simulated options:' : 'Press [0] to return to Main Menu:'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Menu Buttons */}
          <div className="space-y-2">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Test Menu Options:</span>
            <div className="flex flex-wrap gap-2">
              {simStep === 'main' ? (
                <>
                  {[
                    { num: '1', label: '1: Software Selector' },
                    { num: '2', label: '2: Network Tools' },
                    { num: '3', label: '3: Windows Repair' },
                    { num: '4', label: '4: Cache Cleanup' },
                    { num: '5', label: '5: System Info' },
                    { num: '6', label: '6: Utilities' },
                    { num: '7', label: '7: Configuration' },
                    { num: '8', label: '8: Quick Actions' },
                    { num: '0', label: '0: Exit' }
                  ].map((btn) => (
                    <button
                      key={btn.num}
                      onClick={() => handleTerminalSelect(btn.num)}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-cyan-500 hover:text-black text-xs font-mono text-zinc-200 transition"
                    >
                      {btn.label}
                    </button>
                  ))}
                </>
              ) : (
                <button
                  onClick={() => handleTerminalSelect('0')}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-mono font-bold transition hover:bg-cyan-400"
                >
                  [0] Return to Main Menu
                </button>
              )}
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
            <span>ItsRiRx Windows Tool Kit v1.0.0</span>
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
