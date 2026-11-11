import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Zap,
  Wrench,
  Printer,
  Trash2,
  FileCode,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  PackageCheck,
  Layers,
  Wifi,
  Database,
  Share2
} from 'lucide-react';
import {
  generatePrintSpoolerFixScript,
  generateTempCleanerFixScript,
  generateSfcDismFixScript,
  generateWingetStoreFixScript,
  generateMissingDllRuntimesFixScript,
  generateNetworkResetFixScript,
  generateCDriveSpaceFixScript,
  generateSharedPrinterRegistryFixScript,
  triggerFileDownload
} from '../utils/scriptGenerator';

interface PowerToolsTabProps {
  onNotify: (msg: string) => void;
  isDark?: boolean;
}

type FixFilterType =
  | 'all'
  | 'temp_cleaner'
  | 'printer_fix'
  | 'shared_printer_fix'
  | 'sfc_dism'
  | 'winget_store'
  | 'dll_runtimes'
  | 'network_reset'
  | 'c_drive_space';

interface FixModuleItem {
  id: Exclude<FixFilterType, 'all'>;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  filename: string;
  downloadLabel: string;
  generator: () => string;
  psCommand: string;
  accentColor: 'emerald' | 'indigo' | 'cyan' | 'rose' | 'purple' | 'amber';
  icon: React.ReactNode;
  steps: { badge: string; cmd: string; desc: string }[];
}

export const PowerToolsTab: React.FC<PowerToolsTabProps> = ({ onNotify, isDark = false }) => {
  const [activeFilter, setActiveFilter] = useState<FixFilterType>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState<string | null>(null);

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

  const fixModules: FixModuleItem[] = [
    {
      id: 'temp_cleaner',
      number: 'Fix Module #1',
      title: '1-Click Temp, %Temp%, Prefetch & Recent Cleaner',
      subtitle: 'Replaces manual Win+R cleanup',
      description:
        'Instead of opening Win + R four separate times to type temp, %temp%, prefetch, and recent, this single .bat file elevates to Administrator and force-cleans all four directories at once.',
      filename: 'Clean-Temp-Prefetch-Recent.bat',
      downloadLabel: 'Temp, %Temp%, Prefetch & Recent Cleaner (.bat)',
      generator: generateTempCleanerFixScript,
      psCommand: `Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path "$env:SystemRoot\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path "$env:SystemRoot\\Prefetch\\*" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path "$env:APPDATA\\Microsoft\\Windows\\Recent\\*" -Recurse -Force -ErrorAction SilentlyContinue; Write-Host "[SUCCESS] Cleaned temp, %temp%, prefetch, and recent folders!" -ForegroundColor Green; Write-Host "\`nAll tasks finished! Press any key to close this window..." -ForegroundColor Yellow; cmd.exe /c pause | Out-Null`,
      accentColor: 'emerald',
      icon: <Trash2 className="w-5 h-5" />,
      steps: [
        {
          badge: '%temp%',
          cmd: 'C:\\Users\\<User>\\AppData\\Local\\Temp',
          desc: 'Deletes leftover app installer caches, browser temp files, and crash logs.'
        },
        {
          badge: 'temp',
          cmd: 'C:\\Windows\\Temp',
          desc: 'Clears OS-level system temporary files and background service cache.'
        },
        {
          badge: 'prefetch',
          cmd: 'C:\\Windows\\Prefetch',
          desc: 'Removes outdated application launch trace files (.pf) to refresh startup speed.'
        },
        {
          badge: 'recent',
          cmd: 'AppData\\Roaming\\Microsoft\\Windows\\Recent',
          desc: 'Clears Recent file shortcuts and File Explorer Quick Access jump-list history.'
        }
      ]
    },
    {
      id: 'printer_fix',
      number: 'Fix Module #2',
      title: 'Print Spooler & Stuck Jobs Repair Tool',
      subtitle: 'Clears stuck queue & restarts Spooler',
      description:
        '1-Click utility to force-stop the Windows Print Spooler service, permanently delete all stuck or corrupted print jobs inside System32\\Spool\\Printers, and restart the print service cleanly.',
      filename: 'Fix-Printer-Spooler.bat',
      downloadLabel: 'Print Spooler Fixer (.bat)',
      generator: generatePrintSpoolerFixScript,
      psCommand: `Stop-Service Spooler -Force -ErrorAction SilentlyContinue; Remove-Item -Path "$env:SystemRoot\\System32\\Spool\\Printers\\*" -Force -Recurse -ErrorAction SilentlyContinue; Set-Service Spooler -StartupType Automatic; Start-Service Spooler; Write-Host "[SUCCESS] Print Spooler restarted & all stuck print jobs deleted!" -ForegroundColor Green; Write-Host "\`nAll tasks finished! Press any key to close this window..." -ForegroundColor Yellow; cmd.exe /c pause | Out-Null`,
      accentColor: 'indigo',
      icon: <Printer className="w-5 h-5" />,
      steps: [
        {
          badge: 'Step 1',
          cmd: 'net stop spooler',
          desc: 'Safely stops the background Windows Print Spooler service so locked queue files can be deleted.'
        },
        {
          badge: 'Step 2',
          cmd: 'del /Q /F /S Spool\\Printers\\*.*',
          desc: 'Purges all stuck .SPL and .SHD print queue jobs blocking new documents from printing.'
        },
        {
          badge: 'Step 3',
          cmd: 'sc config spooler start= auto & net start',
          desc: 'Sets Print Spooler startup type to Automatic and restarts the service immediately.'
        }
      ]
    },
    {
      id: 'sfc_dism',
      number: 'Fix Module #3',
      title: 'Corrupted Windows System File Repair (DISM + SFC)',
      subtitle: 'Repairs OS image & corrupted system DLLs',
      description:
        'Automatically runs DISM /RestoreHealth followed by sfc /scannow to repair the Windows Component Store and replace any damaged, missing, or corrupted operating system files.',
      filename: 'Fix-System-SFC-DISM.bat',
      downloadLabel: 'Corrupted System File Repair (.bat)',
      generator: generateSfcDismFixScript,
      psCommand: `DISM.exe /Online /Cleanup-Image /RestoreHealth; sfc /scannow; Write-Host "[SUCCESS] DISM and SFC system file repair completed!" -ForegroundColor Green; Write-Host "\`nAll tasks finished! Press any key to close this window..." -ForegroundColor Yellow; cmd.exe /c pause | Out-Null`,
      accentColor: 'cyan',
      icon: <HardDrive className="w-5 h-5" />,
      steps: [
        {
          badge: 'Step 1',
          cmd: 'DISM /Online /Cleanup-Image /RestoreHealth',
          desc: 'Verifies and repairs corrupted Windows Component Store packages from official Microsoft Update servers.'
        },
        {
          badge: 'Step 2',
          cmd: 'sfc /scannow',
          desc: 'Scans all protected Windows operating system files and replaces corrupted files with verified cached copies.'
        },
        {
          badge: 'Step 3',
          cmd: 'Verify & Keep Window Open',
          desc: 'Displays full repair summary and waits for your key press before closing the console.'
        }
      ]
    },
    {
      id: 'winget_store',
      number: 'Fix Module #4',
      title: 'Winget & Microsoft Store Not Working Fixer',
      subtitle: 'Fixes fresh Windows Winget & Store errors',
      description:
        'Resolves "winget is not recognized", certificate errors (0x8a15000f / 0x8a15005e), missing UWP dependencies (VCLibs / UI.Xaml), and stuck Microsoft Store downloads on newly installed Windows PCs.',
      filename: 'Fix-Winget-And-Store.bat',
      downloadLabel: 'Winget & Store Repair (.bat)',
      generator: generateWingetStoreFixScript,
      psCommand: `$ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol = 3072; $d = Join-Path $env:TEMP 'wg_fix'; New-Item -ItemType Directory -Path $d -Force | Out-Null; curl.exe -L -s -S -o "$d\\deps.zip" "https://github.com/microsoft/winget-cli/releases/latest/download/DesktopAppInstaller_Dependencies.zip"; if (Test-Path "$d\\deps.zip") { Expand-Archive "$d\\deps.zip" "$d\\deps" -Force; Get-ChildItem "$d\\deps" -Recurse -Include *x64*.appx,*x64*.msix | ForEach-Object { Add-AppxPackage $_.FullName -ErrorAction SilentlyContinue } }; curl.exe -L -s -S -o "$d\\winget.msixbundle" "https://github.com/microsoft/winget-cli/releases/latest/download/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle"; Add-AppxPackage "$d\\winget.msixbundle" -ErrorAction SilentlyContinue; curl.exe -L -s -S -o "$d\\source.msix" "https://cdn.winget.microsoft.com/cache/source.msix"; Add-AppxPackage "$d\\source.msix" -ErrorAction SilentlyContinue; winget source reset --force; wsreset -i; Write-Host "[SUCCESS] Winget & Microsoft Store repaired!" -ForegroundColor Green; Write-Host "\`nAll tasks finished! Press any key to close this window..." -ForegroundColor Yellow; cmd.exe /c pause | Out-Null`,
      accentColor: 'rose',
      icon: <PackageCheck className="w-5 h-5" />,
      steps: [
        {
          badge: 'Step 1',
          cmd: 'Install VCLibs, UI.Xaml & DesktopAppInstaller',
          desc: 'Downloads and registers official Winget UWP dependencies and App Installer directly from GitHub.'
        },
        {
          badge: 'Step 2',
          cmd: 'Add-AppxPackage source.msix & source reset',
          desc: 'Repairs expired Winget CDN source certificates (fixes 0x8a15000f & 0x8a15005e errors).'
        },
        {
          badge: 'Step 3',
          cmd: 'wsreset -i & Re-register WindowsStore',
          desc: 'Clears corrupted Microsoft Store cache and re-registers the Store AppX manifest.'
        }
      ]
    },
    {
      id: 'dll_runtimes',
      number: 'Fix Module #5',
      title: 'Missing DLL & Game/App Runtime Fixer',
      subtitle: 'Fixes VCRUNTIME140.dll, MSVCP140.dll & DirectX',
      description:
        'Eliminates "VCRUNTIME140.dll was not found", "MSVCP140.dll is missing", "d3dx9_43.dll", and "0xc000007b" application startup errors by installing Visual C++ 2015-2022 (x86/x64), DirectX, and .NET 8.',
      filename: 'Fix-Missing-DLL-Runtimes.bat',
      downloadLabel: 'Missing DLL & Runtime Fixer (.bat)',
      generator: generateMissingDllRuntimesFixScript,
      psCommand: `@('Microsoft.VCRedist.2015+.x64','Microsoft.VCRedist.2015+.x86','Microsoft.DirectX','Microsoft.DotNet.DesktopRuntime.8') | ForEach-Object { winget install --id $_ -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity }; Write-Host "[SUCCESS] All Visual C++, DirectX, and .NET Runtimes installed!" -ForegroundColor Green; Write-Host "\`nAll tasks finished! Press any key to close this window..." -ForegroundColor Yellow; cmd.exe /c pause | Out-Null`,
      accentColor: 'purple',
      icon: <Layers className="w-5 h-5" />,
      steps: [
        {
          badge: 'Visual C++',
          cmd: 'vc_redist.x64.exe & vc_redist.x86.exe',
          desc: 'Installs both 64-bit and 32-bit Visual C++ 2015-2022 Redistributable packages from Microsoft CDN.'
        },
        {
          badge: 'DirectX',
          cmd: 'dxwebsetup.exe /Q',
          desc: 'Installs legacy and modern DirectX End-User Runtimes (d3dx9, xinput1_3, xaudio2 DLLs).'
        },
        {
          badge: '.NET Runtime',
          cmd: 'Microsoft.DotNet.DesktopRuntime.8',
          desc: 'Ensures modern .NET 8 Desktop Runtime is installed for Windows desktop utilities and games.'
        }
      ]
    },
    {
      id: 'network_reset',
      number: 'Fix Module #6',
      title: 'Network & Internet Reset Fixer',
      subtitle: 'Fixes "No Internet, Secured" & DNS errors',
      description:
        '1-Click complete network repair that flushes DNS cache, renews DHCP IP leases, clears ARP/NetBIOS tables, resets Winsock catalog, and restores clean TCP/IP stack defaults.',
      filename: 'Fix-Network-Internet.bat',
      downloadLabel: 'Network & Internet Reset Fixer (.bat)',
      generator: generateNetworkResetFixScript,
      psCommand: `ipconfig /flushdns; ipconfig /release; ipconfig /renew; arp -d *; netsh winsock reset; netsh int ip reset; Write-Host "[SUCCESS] Network stack, DNS, and Winsock reset complete!" -ForegroundColor Green; Write-Host "\`nAll tasks finished! Press any key to close this window..." -ForegroundColor Yellow; cmd.exe /c pause | Out-Null`,
      accentColor: 'amber',
      icon: <Wifi className="w-5 h-5" />,
      steps: [
        {
          badge: 'Step 1',
          cmd: 'ipconfig /flushdns & /release & /renew',
          desc: 'Flushes poisoned DNS cache records and requests a fresh IPv4/IPv6 lease from your router.'
        },
        {
          badge: 'Step 2',
          cmd: 'arp -d * & nbtstat -R / -RR',
          desc: 'Clears stale MAC address ARP routing tables and reloads NetBIOS name cache.'
        },
        {
          badge: 'Step 3',
          cmd: 'netsh winsock reset & netsh int ip reset',
          desc: 'Repairs corrupted Windows Sockets (Winsock) and resets the TCP/IP stack to factory defaults.'
        }
      ]
    },
    {
      id: 'c_drive_space',
      number: 'Fix Module #7',
      title: 'C: Drive Space Recovery & Windows Update Cleanup',
      subtitle: 'Reclaims 10GB-30GB+ of hidden system bloat',
      description:
        'Frees up massive amounts of C: drive space by removing hiberfil.sys, purging downloaded Windows Update caches (SoftwareDistribution & DeliveryOptimization), deleting crash dumps/WER logs, emptying Recycle Bin, and running DISM WinSxS component cleanup.',
      filename: 'Fix-C-Drive-Space.bat',
      downloadLabel: 'C: Drive Space Recovery (.bat)',
      generator: generateCDriveSpaceFixScript,
      psCommand: `powercfg -h off; Stop-Service wuauserv,bits,dosvc -Force -ErrorAction SilentlyContinue; Remove-Item "$env:SystemRoot\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue; Start-Service wuauserv,bits -ErrorAction SilentlyContinue; Remove-Item "$env:SystemRoot\\Minidump\\*","$env:SystemRoot\\MEMORY.DMP","$env:ProgramData\\Microsoft\\Windows\\WER\\*" -Recurse -Force -ErrorAction SilentlyContinue; Clear-RecycleBin -Force -ErrorAction SilentlyContinue; Dism.exe /Online /Cleanup-Image /StartComponentCleanup; Write-Host "[SUCCESS] C: Drive Space Recovery & Update Cleanup completed!" -ForegroundColor Green; Write-Host "\`nAll tasks finished! Press any key to close this window..." -ForegroundColor Yellow; cmd.exe /c pause | Out-Null`,
      accentColor: 'emerald',
      icon: <Database className="w-5 h-5" />,
      steps: [
        {
          badge: 'hiberfil.sys',
          cmd: 'powercfg -h off',
          desc: 'Disables Hibernation and removes the massive hidden C:\\hiberfil.sys file (saves 4GB to 16GB immediately).'
        },
        {
          badge: 'Update Cache',
          cmd: 'SoftwareDistribution\\Download & DO',
          desc: 'Stops Update services temporarily and purges leftover Windows Update & Delivery Optimization cache.'
        },
        {
          badge: 'Crash Dumps',
          cmd: 'MEMORY.DMP, Minidump & WER Reports',
          desc: 'Deletes gigantic kernel crash dumps, BSOD minidumps, and Windows Error Reporting archives.'
        },
        {
          badge: 'WinSxS & Bin',
          cmd: 'DISM /StartComponentCleanup + RecycleBin',
          desc: 'Compresses superseded WinSxS component packages and empties the Recycle Bin across all drives.'
        }
      ]
    },
    {
      id: 'shared_printer_fix',
      number: 'Fix Module #8',
      title: 'Shared Printer & Network Printer Registry Fixer',
      subtitle: 'Fixes 0x0000011b, 0x00000709, 0x00000bcb, 0x00000040 & Guest SMB',
      description:
        'All-in-one registry and service repair for LAN/Wi-Fi Shared Printers that refuse to connect on Windows 10 & 11. Automatically fixes RPC Auth Privacy (0x0000011b), RPC Named Pipes (0x00000709), PointAndPrint driver restrictions (0x00000bcb), SMB Guest Logon (0x80070035), and Printer Sharing Firewall rules.',
      filename: 'Fix-Shared-Printer-Registry.bat',
      downloadLabel: 'Shared Printer Registry Fixer (.bat)',
      generator: generateSharedPrinterRegistryFixScript,
      psCommand: `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print" /v RpcAuthnLevelPrivacyEnabled /t REG_DWORD /d 0 /f; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print" /v DnsOnWire /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Printers\\RPC" /v RpcUseNamedPipeProtocol /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Printers\\RPC" /v RpcProtocols /t REG_DWORD /d 7 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Printers\\RPC" /v RpcAuthnLevelPrivacyEnabled /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Printers\\PointAndPrint" /v RestrictDriverInstallationToAdministrators /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Printers\\PointAndPrint" /v NoWarningNoElevationOnInstall /t REG_DWORD /d 1 /f; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\LanmanWorkstation\\Parameters" /v AllowInsecureGuestAuth /t REG_DWORD /d 1 /f; netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes; Restart-Service Spooler -Force; Write-Host "[SUCCESS] All Shared Printer Registry keys & Spooler repaired!" -ForegroundColor Green; Write-Host "\`nAll tasks finished! Press any key to close this window..." -ForegroundColor Yellow; cmd.exe /c pause | Out-Null`,
      accentColor: 'indigo',
      icon: <Share2 className="w-5 h-5" />,
      steps: [
        {
          badge: '0x0000011b',
          cmd: 'RpcAuthnLevelPrivacyEnabled = 0',
          desc: 'Disables strict RPC privacy enforcement under HKLM\\System\\CurrentControlSet\\Control\\Print.'
        },
        {
          badge: '0x00000709',
          cmd: 'RpcUseNamedPipeProtocol = 1 & RpcProtocols = 7',
          desc: 'Enables RPC over Named Pipes, TCP protocols, and DnsOnWire for Windows 11 22H2/23H2/24H2 shared printers.'
        },
        {
          badge: '0x00000bcb',
          cmd: 'PointAndPrint Driver Restrictions = 0',
          desc: 'Unlocks PointAndPrint policies so shared printer drivers install cleanly without elevation blocks.'
        },
        {
          badge: 'SMB & Firewall',
          cmd: 'AllowInsecureGuestAuth = 1 & Firewall Enable',
          desc: 'Enables Guest SMB sharing, Blank Password LAN logon, Function Discovery services, and restarts Spooler.'
        }
      ]
    }
  ];

  const visibleModules =
    activeFilter === 'all' ? fixModules : fixModules.filter((m) => m.id === activeFilter);

  const getColorClasses = (color: FixModuleItem['accentColor']) => {
    switch (color) {
      case 'emerald':
        return {
          badge: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
          iconBg: 'bg-emerald-500/15 text-emerald-500',
          btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25',
          stepBadge: 'bg-emerald-500/15 text-emerald-500',
          text: 'text-emerald-500',
          codeText: 'text-emerald-300'
        };
      case 'indigo':
        return {
          badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
          iconBg: 'bg-indigo-500/15 text-indigo-500',
          btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25',
          stepBadge: 'bg-indigo-500/15 text-indigo-400',
          text: 'text-indigo-400',
          codeText: 'text-indigo-300'
        };
      case 'cyan':
        return {
          badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          iconBg: 'bg-cyan-500/15 text-cyan-500',
          btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/25',
          stepBadge: 'bg-cyan-500/15 text-cyan-400',
          text: 'text-cyan-400',
          codeText: 'text-cyan-300'
        };
      case 'rose':
        return {
          badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          iconBg: 'bg-rose-500/15 text-rose-500',
          btn: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25',
          stepBadge: 'bg-rose-500/15 text-rose-400',
          text: 'text-rose-400',
          codeText: 'text-rose-300'
        };
      case 'purple':
        return {
          badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          iconBg: 'bg-purple-500/15 text-purple-500',
          btn: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/25',
          stepBadge: 'bg-purple-500/15 text-purple-400',
          text: 'text-purple-400',
          codeText: 'text-purple-300'
        };
      case 'amber':
        return {
          badge: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
          iconBg: 'bg-amber-500/15 text-amber-500',
          btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25',
          stepBadge: 'bg-amber-500/15 text-amber-500',
          text: 'text-amber-500',
          codeText: 'text-amber-300'
        };
    }
  };

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
                Dedicated 1-Click Repair Hub
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Windows Fix Center
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              Standalone, auto-elevating <code className="font-mono text-cyan-500 font-bold">.bat</code> fix modules for regular Windows repairs. Every script stays open upon completion until you press a key to close.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                isDark ? 'bg-cyan-950/60 border-cyan-800/50 text-cyan-300' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-500" /> Auto-Admin & No Auto-Close
            </span>
            <span
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                isDark ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-500" /> {fixModules.length} Active Fix Modules
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-200/50 dark:bg-zinc-900/50 border border-slate-300/40 dark:border-white/10 backdrop-blur-xl">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 shrink-0" />
          <span>All Fix Modules ({fixModules.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('temp_cleaner')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'temp_cleaner'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 shrink-0" />
          <span>Temp & Prefetch Cleaner</span>
        </button>

        <button
          onClick={() => setActiveFilter('printer_fix')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'printer_fix'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Printer className="w-3.5 h-3.5 shrink-0" />
          <span>Print Spooler Fix</span>
        </button>

        <button
          onClick={() => setActiveFilter('sfc_dism')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'sfc_dism'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5 shrink-0" />
          <span>Corrupted System Repair</span>
        </button>

        <button
          onClick={() => setActiveFilter('winget_store')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'winget_store'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Winget & Store Fixer</span>
        </button>

        <button
          onClick={() => setActiveFilter('dll_runtimes')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'dll_runtimes'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>Missing DLL & Runtimes</span>
        </button>

        <button
          onClick={() => setActiveFilter('network_reset')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'network_reset'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Wifi className="w-3.5 h-3.5 shrink-0" />
          <span>Network & Internet Reset</span>
        </button>

        <button
          onClick={() => setActiveFilter('c_drive_space')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'c_drive_space'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Database className="w-3.5 h-3.5 shrink-0" />
          <span>C: Drive Space Recovery</span>
        </button>

        <button
          onClick={() => setActiveFilter('shared_printer_fix')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'shared_printer_fix'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 shrink-0" />
          <span>Shared Printer Registry Fix</span>
        </button>
      </div>

      {/* Fix Modules List */}
      <div className="space-y-6">
        {visibleModules.map((mod) => {
          const colors = getColorClasses(mod.accentColor);
          const isPreviewOpen = previewKey === mod.id;

          return (
            <div
              key={mod.id}
              className={`rounded-3xl p-6 md:p-8 border transition-all ${
                isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${colors.badge}`}>
                      {mod.number}
                    </span>
                    <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
                      {mod.subtitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${colors.iconBg}`}>
                      {mod.icon}
                    </div>
                    <h2 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {mod.title}
                    </h2>
                  </div>
                  <p className={`text-sm leading-relaxed max-w-2xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                    {mod.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => handleDownload(mod.filename, mod.generator, mod.downloadLabel)}
                    className={`px-5 py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${colors.btn}`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {mod.filename}</span>
                  </button>

                  <button
                    onClick={() => setPreviewKey(isPreviewOpen ? null : mod.id)}
                    className={`px-3.5 py-3.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDark
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                    title="View .bat source code"
                  >
                    <FileCode className={`w-4 h-4 ${colors.text}`} />
                    <span>{isPreviewOpen ? 'Hide .bat' : 'View .bat'}</span>
                  </button>
                </div>
              </div>

              {/* Steps / Details Grid */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  mod.steps.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
                } gap-3 pt-6`}
              >
                {mod.steps.map((s) => (
                  <div
                    key={s.badge}
                    className={`p-4 rounded-2xl border space-y-1.5 ${
                      isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-lg font-mono text-xs font-extrabold ${colors.stepBadge}`}>
                        {s.badge}
                      </span>
                      <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className={`text-[11px] font-mono truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      {s.cmd}
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Optional Script Source Code Preview */}
              {isPreviewOpen && (
                <div className={`mt-4 p-4 rounded-2xl bg-black/95 border border-zinc-800 font-mono text-xs overflow-x-auto max-h-80 overflow-y-auto ${colors.codeText}`}>
                  <pre>{mod.generator()}</pre>
                </div>
              )}

              {/* Quick PowerShell One-Liner */}
              <div className="pt-5">
                <div
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Terminal className={`w-3.5 h-3.5 shrink-0 ${colors.text}`} />
                      <span className={`text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                        Instant PowerShell Command (Admin):
                      </span>
                    </div>
                    <div className={`font-mono text-[11px] truncate select-all ${colors.text}`}>
                      {mod.psCommand}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(mod.psCommand, `${mod.id}_cmd`, `${mod.title} command`)}
                    className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer ${colors.btn}`}
                  >
                    {copiedKey === `${mod.id}_cmd` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === `${mod.id}_cmd` ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
