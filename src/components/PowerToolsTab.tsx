import React, { useState } from 'react';
import {
  Cpu,
  Wifi,
  Sparkles,
  Disc,
  Download,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Gauge,
  FolderOpen,
  Key,
  Layers,
  Zap,
  Info,
  Laptop,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import {
  generateHardwareReportScript,
  generateWifiPasswordExtractorScript,
  generateFastestDnsBenchmarkScript,
  generateGodModeFolderScript,
  generateEnableGpeditScript,
  generateRufusDownloaderScript,
  triggerFileDownload
} from '../utils/scriptGenerator';

interface PowerToolsTabProps {
  onNotify: (msg: string) => void;
  isDark?: boolean;
}

export const PowerToolsTab: React.FC<PowerToolsTabProps> = ({ onNotify, isDark = false }) => {
  const [activeSubTab, setActiveSubTab] = useState<'hardware' | 'wifi_dns' | 'god_mode' | 'iso_rufus'>('hardware');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onNotify(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownload = (filename: string, generator: () => string, label: string) => {
    const script = generator();
    triggerFileDownload(filename, script);
    onNotify(`Downloaded ${label}!`);
  };

  // Commands for quick terminal copy
  const wifiPsCommand = `(netsh wlan show profiles) | Select-String 'All User Profile\\s+:\\s+(.*)' | ForEach-Object { $p = $_.Matches.Groups[1].Value.Trim(); $pass = (netsh wlan show profile name="$p" key=clear) | Select-String 'Key Content\\s+:\\s+(.*)' | ForEach-Object { $_.Matches.Groups[1].Value.Trim() }; [PSCustomObject]@{ SSID = $p; Password = if ($pass) { $pass } else { '[Open]' } } } | Format-Table -AutoSize`;

  const godModeCmd = `mkdir "$env:USERPROFILE\\Desktop\\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}"`;

  const dnsBenchmarkPs = `$s = @('1.1.1.1','8.8.8.8','9.9.9.9'); foreach ($ip in $s) { Test-Connection $ip -Count 2 | Select-Object Address, ResponseTime }`;

  return (
    <div className="space-y-6 relative z-10">
      {/* Hero Header Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border transition-all duration-300 relative overflow-hidden ${
          isDark
            ? 'bg-zinc-900/75 border-zinc-800/90 shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
            : 'bg-white/80 border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                Advanced System Hub & Utilities
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Windows Power Tools & Diagnostics
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              1-Click hardware specifications auditing, saved Wi-Fi password recovery, automated lowest-ping DNS benchmarking, secret Windows God Mode, and official bootable ISO creation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                isDark ? 'bg-cyan-950/60 border-cyan-800/50 text-cyan-300' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-500" /> 100% Safe & Clean
            </span>
            <span
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                isDark ? 'bg-purple-950/60 border-purple-800/50 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700'
              }`}
            >
              <Zap className="w-4 h-4 text-purple-500" /> Windows 10 & 11
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-slate-200/50 dark:bg-zinc-900/50 border border-slate-300/40 dark:border-white/10 backdrop-blur-xl">
        <button
          onClick={() => setActiveSubTab('hardware')}
          className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'hardware'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Cpu className="w-4 h-4 shrink-0" />
          <span>PC Specs Reporter</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wifi_dns')}
          className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'wifi_dns'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Wifi className="w-4 h-4 shrink-0" />
          <span>Wi-Fi & Fast DNS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('god_mode')}
          className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'god_mode'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>God Mode & Secret Tools</span>
        </button>

        <button
          onClick={() => setActiveSubTab('iso_rufus')}
          className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'iso_rufus'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Disc className="w-4 h-4 shrink-0" />
          <span>Windows ISO & Rufus</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. PC Specs & Hardware Report Generator */}
      {/* ========================================================================= */}
      {activeSubTab === 'hardware' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    1-Click Hardware & PC Specs Reporter
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Exports a complete breakdown of your PC's CPU, GPU, RAM clock, SSD health, Motherboard, and Battery into a styled HTML dashboard saved directly to your Desktop.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => handleDownload('Generate-PC-Hardware-Report.bat', generateHardwareReportScript, 'Hardware Reporter (.bat)')}
                  className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Hardware Reporter (.bat)
                </button>
              </div>
            </div>

            {/* Spec Inspection Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>CPU & Clocks</h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Full Processor Model, Physical Cores, Logical Threads, Base & Max Turbo Clock Speeds, and L3 Cache.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>GPU & Dedicated VRAM</h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  NVIDIA GeForce, AMD Radeon, or Intel Arc GPU details, Dedicated Video Memory (VRAM), and active Driver version.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>RAM Speeds & Channels</h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Total installed Gigabytes, individual stick manufacturer, configured MHz frequency, and Dual-Channel status.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>NVMe / SSD Storage</h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Model numbers for all installed NVMe/SATA drives, individual partition letters, total capacity, and free space.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>Motherboard & BIOS</h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Exact motherboard brand and product revision, installed BIOS version date, and UEFI Secure Boot state.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>Battery Health & Cycles</h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  For laptops: Full charge capacity vs design capacity, current health percentage, and battery cycle counts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Wi-Fi Password Viewer & Fastest DNS Benchmark */}
      {/* ========================================================================= */}
      {activeSubTab === 'wifi_dns' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Card 1: Saved Wi-Fi Password Exporter */}
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-purple-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Saved Wi-Fi Password Viewer & Exporter
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Extracts every previously connected Wi-Fi SSID and its plaintext security key from your Windows profile and writes them cleanly into <code className="text-purple-400 font-mono">Desktop\Saved_WiFi_Passwords.txt</code>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => handleDownload('Export-Saved-WiFi-Passwords.bat', generateWifiPasswordExtractorScript, 'Wi-Fi Password Exporter (.bat)')}
                  className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Wi-Fi Exporter (.bat)
                </button>
                <button
                  onClick={() => handleCopy(wifiPsCommand, 'wifi_ps', 'PowerShell command')}
                  className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  {copiedKey === 'wifi_ps' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  Copy PS Command
                </button>
              </div>
            </div>

            <div className={`mt-5 p-4 rounded-2xl text-xs font-mono border overflow-x-auto ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <span className="text-purple-500 font-bold"># PowerShell Command (Run in Terminal):</span>
              <br />
              {wifiPsCommand}
            </div>
          </div>

          {/* Card 2: Auto-Fastest DNS Benchmark & Switcher */}
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-emerald-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Auto-Fastest DNS Benchmark & Switcher
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Tests live ping latency from your computer to Cloudflare, Google, Quad9, and AdGuard DNS. Automatically detects the lowest latency resolver and assigns it to your active Wi-Fi / Ethernet adapter.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => handleDownload('Auto-Fastest-DNS-Selector.bat', generateFastestDnsBenchmarkScript, 'Auto-Fastest DNS (.bat)')}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Benchmark & Apply Fastest DNS (.bat)
                </button>
                <button
                  onClick={() => handleCopy(dnsBenchmarkPs, 'dns_bench', 'DNS benchmark command')}
                  className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  {copiedKey === 'dns_bench' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  Copy Ping Test
                </button>
              </div>
            </div>

            {/* DNS Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Cloudflare DNS</span>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">1.1.1.1 / 1.0.0.1</div>
                <p className={`text-xs mt-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  World's fastest DNS resolver with strict zero-logging privacy policy.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Google Public DNS</span>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">8.8.8.8 / 8.8.4.4</div>
                <p className={`text-xs mt-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Massive global server network ensuring 99.99% uptime and zero cache drops.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Quad9 Secure</span>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">9.9.9.9 / 149.112.112.112</div>
                <p className={`text-xs mt-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Non-profit security DNS blocking known phishing and malware domains.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">AdGuard Public DNS</span>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">94.140.14.14 / 94.140.15.15</div>
                <p className={`text-xs mt-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Filters ads, trackers, and malicious scripts at the network resolver level.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. God Mode & Secret Windows Utilities */}
      {/* ========================================================================= */}
      {activeSubTab === 'god_mode' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Windows "God Mode" Folder Creator
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Creates an all-powerful system shortcut on your Desktop containing over 206+ categorized Windows administrative applets, hardware configs, and hidden control settings in a single unified view.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => handleDownload('Create-God-Mode-Folder.bat', generateGodModeFolderScript, 'God Mode Creator (.bat)')}
                  className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Create God Mode Folder (.bat)
                </button>
                <button
                  onClick={() => handleCopy(godModeCmd, 'god_cmd', 'Command')}
                  className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  {copiedKey === 'god_cmd' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  Copy Command
                </button>
              </div>
            </div>

            {/* Enable Group Policy on Windows Home */}
            <div className="pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-zinc-800 pb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-500" />
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Enable Group Policy Editor (gpedit.msc) on Windows Home
                  </h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Windows 10/11 Home editions disable the Group Policy Editor by default. This script adds the official Microsoft DISM servicing packages to activate <code className="text-purple-400 font-mono">gpedit.msc</code> without upgrading to Pro.
                </p>
              </div>

              <button
                onClick={() => handleDownload('Enable-gpedit-msc-Home.bat', generateEnableGpeditScript, 'Enable gpedit.msc (.bat)')}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" /> Enable gpedit.msc (.bat)
              </button>
            </div>

            {/* Quick System Launchers Grid */}
            <div className="pt-6 space-y-3">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Quick Run Commands (Press Win + R, type command and press Enter)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { name: 'DirectX Diagnostics', cmd: 'dxdiag' },
                  { name: 'Resource Monitor', cmd: 'resmon' },
                  { name: 'System Config', cmd: 'msconfig' },
                  { name: 'Disk Management', cmd: 'diskmgmt.msc' },
                  { name: 'Device Manager', cmd: 'devmgmt.msc' },
                  { name: 'Advanced Cleanup', cmd: 'cleanmgr /sageset:1' }
                ].map((item) => (
                  <div
                    key={item.cmd}
                    onClick={() => handleCopy(item.cmd, item.cmd, item.cmd)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isDark ? 'bg-zinc-950/60 hover:bg-zinc-800 border-zinc-800' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 truncate">{item.name}</span>
                    <div className="flex items-center justify-between mt-2">
                      <code className="text-xs text-purple-600 dark:text-purple-400 font-mono font-bold">{item.cmd}</code>
                      {copiedKey === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. Windows Official ISO & Rufus Bootable Media Hub */}
      {/* ========================================================================= */}
      {activeSubTab === 'iso_rufus' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div
            className={`rounded-3xl p-6 md:p-8 border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Disc className="w-5 h-5 text-emerald-500" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Official Windows ISO Downloads & Rufus Tool
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Direct access to authentic, untouched Microsoft Windows ISOs and 1-click Rufus download with automatic TPM 2.0 / Secure Boot bypass instructions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => handleDownload('Download-Rufus-Portable.bat', generateRufusDownloaderScript, 'Rufus Portable (.bat)')}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Rufus Portable (.bat)
                </button>
              </div>
            </div>

            {/* Official Windows ISO Direct Sources */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                      11
                    </div>
                    <div>
                      <h3 className={`text-base font-bold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                        Windows 11 (24H2) Official ISO
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Direct from Microsoft Software Download</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold text-[11px]">Latest</span>
                </div>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Includes Windows 11 Home, Pro, and Enterprise editions (Multi-edition ISO) with the latest security updates.
                </p>
                <a
                  href="https://www.microsoft.com/software-download/windows11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open Microsoft Windows 11 Download</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black text-sm">
                      10
                    </div>
                    <div>
                      <h3 className={`text-base font-bold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                        Windows 10 (22H2) Official ISO
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Direct from Microsoft Media Creation</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500 font-bold text-[11px]">Stable</span>
                </div>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  The most stable, battle-tested release of Windows 10 for legacy systems and maximum game compatibility.
                </p>
                <a
                  href="https://www.microsoft.com/software-download/windows10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open Microsoft Windows 10 Download</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Rufus Setup Instructions & Bypass Guide */}
            <div className={`mt-6 p-6 rounded-2xl border ${isDark ? 'bg-zinc-950/80 border-zinc-800/90' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className={`text-base font-bold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Rufus Recommended USB Setup Cheat-sheet
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-emerald-500 text-sm">1. Partition Scheme</span>
                  <p className={`mt-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                    Choose <strong>GPT</strong> for modern UEFI systems (Windows 11). Choose <strong>MBR</strong> only for older legacy BIOS computers (pre-2015).
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-purple-500 text-sm">2. TPM & SecureBoot Bypass</span>
                  <p className={`mt-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                    When clicking "START", check: <em>"Remove requirement for 4GB+ RAM, Secure Boot and TPM 2.0"</em> to install Windows 11 on any PC!
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-cyan-500 text-sm">3. Local Account Creation</span>
                  <p className={`mt-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                    Check: <em>"Remove requirement for an online Microsoft account"</em> to create an offline local Windows user without entering an email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
