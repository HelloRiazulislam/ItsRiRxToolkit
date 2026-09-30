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
  Gamepad2,
  ShieldAlert,
  Code2,
  BatteryCharging,
  Layers,
  ArrowRight,
  HardDrive
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
            { text: '  --- MODULE 1: SOFTWARE INSTALLER (WINGET) ---', color: 'text-cyan-400 font-semibold' },
            { text: '  All selections show checkboxes. Nothing installs until you approve with Y.', color: 'text-amber-400' },
            { text: '  ┌─────┬───────┬──────────────┬────────────────────────┬─────────────┐', color: 'text-cyan-400' },
            { text: '  │ #   │ SELECT│ STATUS       │ APPLICATION NAME       │ WINGET ID   │', color: 'text-cyan-400' },
            { text: '  ├─────┼───────┼──────────────┼────────────────────────┼─────────────┤', color: 'text-cyan-400' },
            { text: '  │ [1] │ [ ]   │ AVAILABLE    │ Google Chrome          │ Chrome      │', color: 'text-cyan-300' },
            { text: '  │ [2] │ [OK]  │ INSTALLED    │ Notepad++              │ Notepad++   │', color: 'text-emerald-400' },
            { text: '  │ [3] │ [ ]   │ AVAILABLE    │ Visual Studio Code     │ VSCode      │', color: 'text-cyan-300' },
            { text: '  │ [4] │ [ ]   │ AVAILABLE    │ VLC Media Player       │ VLC         │', color: 'text-cyan-300' },
            { text: '  │ [5] │ [ ]   │ AVAILABLE    │ Discord                │ Discord     │', color: 'text-cyan-300' },
            { text: '  │ [6] │ [ ]   │ AVAILABLE    │ 7-Zip Archiver         │ 7zip        │', color: 'text-cyan-300' },
            { text: '  └─────┴───────┴──────────────┴────────────────────────┴─────────────┘', color: 'text-cyan-400' },
            { text: '  User types: 1, 4', color: 'text-yellow-300' },
            { text: '  ----------------------------------------------------------------------', color: 'text-zinc-600' },
            { text: '  FINAL CONFIRMATION: Installing: Google Chrome, VLC Media Player.', color: 'text-amber-400 font-semibold' },
            { text: '  Proceed? [Y/N]: ', color: 'text-emerald-400' },
            { text: '  [OK] Winget only executes after explicit approval.', color: 'text-emerald-400' }
          ]);
          break;
        case '2':
          setSimStep('debloat');
          setSimLogs([
            { text: '  --- MODULE 2: DEBLOAT & PRIVACY HARDENING ---', color: 'text-cyan-400 font-semibold' },
            { text: '  [OK] Telemetry and Diagnostic Tracking services disabled.', color: 'text-emerald-400' },
            { text: '  [OK] Bing web search results disabled in Start Menu (Local search accelerated).', color: 'text-emerald-400' },
            { text: '  [OK] Windows 10 Classic Context Menu restored in Windows 11.', color: 'text-emerald-400' }
          ]);
          break;
        case '3':
          setSimStep('perf');
          setSimLogs([
            { text: '  --- MODULE 3: PERFORMANCE & GAMING ---', color: 'text-cyan-400 font-semibold' },
            { text: '  [OK] Ultimate Performance Power Scheme GUID unlocked and activated!', color: 'text-emerald-400' },
            { text: '  [OK] Game DVR background recording disabled (Frame drops eliminated).', color: 'text-emerald-400' },
            { text: '  [OK] Mouse acceleration disabled (1:1 Raw input precision active).', color: 'text-emerald-400' }
          ]);
          break;
        case '4':
          setSimStep('safety');
          setSimLogs([
            { text: '  --- MODULE 4: SYSTEM SAFETY & RESTORE ---', color: 'text-cyan-400 font-semibold' },
            { text: '  [OK] System Restore Point created: ItsRiRx-Toolkit-SafeCheckpoint-2025.', color: 'text-emerald-400' },
            { text: '  [OK] Active Listening TCP/UDP ports scanned with bound process IDs.', color: 'text-emerald-400' },
            { text: '  [OK] Microsoft Defender signatures updated to latest build.', color: 'text-emerald-400' }
          ]);
          break;
        case '5':
          setSimStep('dev');
          setSimLogs([
            { text: '  --- MODULE 5: DEVELOPER & VIRTUALIZATION ---', color: 'text-cyan-400 font-semibold' },
            { text: '  [OK] Windows Subsystem for Linux (WSL2) enabled.', color: 'text-emerald-400' },
            { text: '  [OK] Windows Sandbox (Disposable VM) enabled.', color: 'text-emerald-400' },
            { text: '  [OK] Hyper-V and Virtual Machine Platform configured.', color: 'text-emerald-400' }
          ]);
          break;
        case '6':
          setSimStep('battery');
          setSimLogs([
            { text: '  --- MODULE 6: BATTERY HEALTH & POWER ---', color: 'text-cyan-400 font-semibold' },
            { text: '  [OK] Full Battery Report generated: C:\\Users\\Admin\\AppData\\Local\\Temp\\battery-report.html', color: 'text-emerald-400' },
            { text: '  Estimated Remaining: 98% | Health: Normal | Chemistry: Li-Ion', color: 'text-zinc-200' },
            { text: '  Sleep Study Standby analysis ready.', color: 'text-zinc-400' }
          ]);
          break;
        case '7':
          setSimStep('repair');
          setSimLogs([
            { text: '  --- MODULE 7: WINDOWS SYSTEM REPAIR ---', color: 'text-cyan-400 font-semibold' },
            { text: '  [1] SFC /scannow       - Scans & repairs corrupted system files', color: 'text-zinc-200' },
            { text: '  [2] DISM RestoreHealth - Restores healthy image components from Windows Update', color: 'text-zinc-200' },
            { text: '  [3] WinUpdate Repair   - Cleans corrupted SoftwareDistribution cache', color: 'text-zinc-200' },
            { text: '  [OK] All repair routines run under strict administrator safety.', color: 'text-emerald-400' }
          ]);
          break;
        case '8':
          setSimStep('cleanup');
          setSimLogs([
            { text: '  --- MODULE 8: DISK CLEANUP & ADVANCED STORAGE ---', color: 'text-cyan-400 font-semibold' },
            { text: '  [OK] Cleaned User Temp & System Temp files safely.', color: 'text-emerald-400' },
            { text: '  [OK] Top 15 Largest Files scanned on Drive C: (Identified 18.4 GB ISO & VM images).', color: 'text-emerald-400' },
            { text: '  [OK] Manual SSD TRIM executed on Drive C: (Storage blocks optimized).', color: 'text-emerald-400' }
          ]);
          break;
        case '9':
          setSimStep('net');
          setSimLogs([
            { text: '  --- MODULE 9: NETWORK DIAGNOSTICS & DNS TOOLS ---', color: 'text-cyan-400 font-semibold' },
            { text: '  [OK] Active Adapter: Wi-Fi 6 (Intel AX201) - 1.2 Gbps Link Speed', color: 'text-emerald-400' },
            { text: '  [OK] DNS Switcher: 1-click apply Cloudflare (1.1.1.1) or Google (8.8.8.8)', color: 'text-emerald-400' },
            { text: '  [OK] 3-point connectivity: Gateway [OK] | DNS [OK] | HTTPS [OK]', color: 'text-emerald-400' }
          ]);
          break;
        case '10':
          setSimStep('system');
          setSimLogs([
            { text: '  --- MODULE 10: SYSTEM INFO & UTILITIES ---', color: 'text-cyan-400 font-semibold' },
            { text: '  OS   : Microsoft Windows 11 Pro 64-bit (Build 22631)', color: 'text-zinc-200' },
            { text: '  CPU  : 13th Gen Intel Core i7-13700H (14 Cores / 20 Threads)', color: 'text-zinc-200' },
            { text: '  RAM  : 32 GB DDR5 @ 5200 MHz across 2 modules', color: 'text-zinc-200' },
            { text: '  Status: Licensed (Permanently Activated - Official CIM query)', color: 'text-emerald-400 font-bold' }
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
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-semibold">v1.1.0 PRO</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">Advanced Remote Windows Administration Suite</p>
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
              href="#apps"
              className="text-xs text-zinc-400 hover:text-white transition hidden sm:inline-block"
            >
              Supported Apps
            </a>
            <a
              href="#features"
              className="text-xs text-zinc-400 hover:text-white transition hidden sm:inline-block"
            >
              All Categories
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-14">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-zinc-950 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-600/40 text-cyan-300 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Pure In-Memory Execution • No Downloads • Windows 10 & 11 Compatible
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Advanced Windows Power Toolkit <span className="text-cyan-400">in One Command</span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Equip your PC with debloating, privacy tweaks, gaming optimizations (Ultimate Performance plan, Game DVR disable), 1-click restore points, battery reports, and category-wise software selection with interactive checkboxes.
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
              <h3 className="font-bold text-white text-base">Open Terminal</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Open <strong>PowerShell</strong> or <strong>CMD</strong> (Run as Administrator is recommended for system tweaks and repairs).
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
                A clean dashboard appears. Type option numbers (e.g. 1, 2, 3) to configure debloat, gaming power plans, battery reports, or pick apps with checkboxes.
              </p>
            </div>
          </div>
        </section>

        {/* TOP APPLICATIONS SHOWCASE */}
        <section id="apps" className="space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Boxes className="w-6 h-6 text-cyan-400" />
              Category-Wise Top Applications (Interactive Software Selector)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Browse, select via checkboxes, review confirmation, and install silently via Winget</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: '1',
                title: '1. Web Browsers',
                apps: ['Google Chrome', 'Mozilla Firefox', 'Microsoft Edge', 'Brave', 'Opera'],
                color: 'text-blue-400'
              },
              {
                id: '2',
                title: '2. Developer & Coding',
                apps: ['Visual Studio Code', 'Git', 'Python', 'Node.js', 'Notepad++'],
                color: 'text-emerald-400'
              },
              {
                id: '3',
                title: '3. Multimedia',
                apps: ['VLC Media Player', 'Spotify', 'OBS Studio', 'Audacity', 'HandBrake'],
                color: 'text-amber-400'
              },
              {
                id: '4',
                title: '4. Utilities & Tools',
                apps: ['7-Zip', 'WinRAR', 'Everything', 'Microsoft PowerToys', 'Rufus', 'ShareX', 'Avro Keyboard'],
                color: 'text-purple-400'
              },
              {
                id: '5',
                title: '5. Communication',
                apps: ['WhatsApp', 'Telegram', 'Discord', 'Zoom', 'Microsoft Teams'],
                color: 'text-indigo-400'
              },
              {
                id: '6',
                title: '6. Gaming Launchers',
                apps: ['Steam', 'Epic Games', 'EA App', 'Ubisoft Connect', 'Riot Client', 'Xbox'],
                color: 'text-rose-400'
              },
              {
                id: '7',
                title: '7. Security & Privacy',
                apps: ['Bitwarden', 'Malwarebytes', 'Proton VPN'],
                color: 'text-cyan-400'
              },
              {
                id: '8',
                title: '8. Remote Access & IT',
                apps: ['AnyDesk', 'TeamViewer', 'RustDesk', 'PuTTY', 'WinSCP'],
                color: 'text-teal-400'
              },
              {
                id: '9',
                title: '9. Office & Productivity',
                apps: ['Microsoft 365', 'LibreOffice', 'Adobe Acrobat Reader', 'Notion'],
                color: 'text-yellow-400'
              }
            ].map((cat, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2.5 hover:border-zinc-700 transition">
                <span className={`text-xs font-bold uppercase tracking-wider font-mono ${cat.color}`}>{cat.title}</span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.apps.map((app, aIdx) => (
                    <span key={aIdx} className="text-[11px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
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
          </div>
        </section>

        {/* INTERACTIVE TERMINAL PREVIEW */}
        <section id="preview" className="space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Terminal className="w-6 h-6 text-cyan-400" />
                Live Terminal Preview (Clean Regular Option Typography)
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Exact replica of the regular, clean console options inside Windows Terminal</p>
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
  ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.1.0 PRO
  ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗
  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
  ══════════════════════════════════════════════════════════════════════
  Status: Administrator [ELEVATED] | Host: DESKTOP-IRX01 | User: Admin
  ══════════════════════════════════════════════════════════════════════`}
              </div>

              {simStep === 'main' ? (
                <div className="space-y-1 pt-2 font-normal">
                  <p className="text-cyan-400 font-semibold">  --- MAIN NAVIGATION DASHBOARD ---</p>
                  <p className="text-zinc-200">  [1]  Software Installer        (Winget Top Applications & Checkbox Selector)</p>
                  <p className="text-zinc-200">  [2]  Debloat & Privacy         (Telemetry, Bing in Start, Classic Context Menu)</p>
                  <p className="text-zinc-200">  [3]  Performance & Gaming      (Ultimate Power Plan, Game DVR, Mouse Fix)</p>
                  <p className="text-zinc-200">  [4]  System Safety & Restore   (Restore Point, Active Ports, Defender Scan)</p>
                  <p className="text-zinc-200">  [5]  Developer & Virtualization(WSL2, Windows Sandbox, Hyper-V)</p>
                  <p className="text-zinc-200">  [6]  Battery Health & Power    (HTML Battery Report, Wear Level, Sleep Study)</p>
                  <p className="text-zinc-200">  [7]  Windows System Repair     (SFC Scannow, DISM RestoreHealth, Update Repair)</p>
                  <p className="text-zinc-200">  [8]  Disk Cleanup & Storage    (Temp Cleaner, Top 15 Largest Files, SSD TRIM)</p>
                  <p className="text-zinc-200">  [9]  Network Diagnostics & DNS (3-Point Test, DNS Switcher, Flush DNS, WiFi)</p>
                  <p className="text-zinc-200">  [10] System Info & Utilities   (Hardware Audit, License Status, TaskMgr, CMD)</p>
                  <p className="text-zinc-200">  [11] Quick Actions             (One-Click Emergency Maintenance)</p>
                  <p className="text-zinc-500">  [0]  Exit Toolkit</p>
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
                  {simStep === 'main' ? 'Click any button below to test simulated regular options:' : 'Press [0] to return to Main Menu:'}
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
                    { num: '1', label: '1: Software' },
                    { num: '2', label: '2: Debloat' },
                    { num: '3', label: '3: Gaming & Perf' },
                    { num: '4', label: '4: Safety & Restore' },
                    { num: '5', label: '5: Developer' },
                    { num: '6', label: '6: Battery' },
                    { num: '7', label: '7: Repair' },
                    { num: '8', label: '8: Storage' },
                    { num: '9', label: '9: Network' },
                    { num: '10', label: '10: System Info' },
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
