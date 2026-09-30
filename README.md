# ITS RIRX WINDOWS TOOL KIT (ItsRiRx Toolkit)

A remotely hosted PowerShell-based Windows administration toolkit engineered for system administrators, IT professionals, and power users.

Run directly in Windows PowerShell or CMD with a single command — **no local .ps1, .bat, .cmd, or .exe file download**, and **no Python or Node.js runtime required** on the client machine. The toolkit executes completely in memory.

---

## ⚡ Quick Launcher Commands

### In Windows PowerShell (Run as Administrator recommended):
```powershell
irm https://YOUR-PROJECT.vercel.app/i | iex
```

### In Windows Command Prompt (CMD):
```cmd
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://YOUR-PROJECT.vercel.app/i | iex"
```

*(Replace `https://YOUR-PROJECT.vercel.app` with your actual Vercel deployment URL or custom domain).*

---

## 🖥️ Terminal Interface Preview

When launched, an interactive terminal UI opens directly inside the console:

```
╔══════════════════════════════════════════════════════════════════╗
║                  ITS RIRX WINDOWS TOOL KIT                       ║
║                         Version 1.0.0                            ║
╠══════════════════════════════════════════════════════════════════╣
║  Status: Administrator [ELEVATED]                                ║
║  Host:   DESKTOP-IRX01 | User: Administrator                     ║
╚══════════════════════════════════════════════════════════════════╝

  [1] Software Installer       (Winget App Deployments)
  [2] Network Tools            (IP, DNS, WiFi, Ping, Trace)
  [3] Windows Repair           (SFC, DISM, CHKDSK, WinUpdate)
  [4] Cleanup Tools            (Temp Files, Recycle Bin, Caches)
  [5] System Information       (CPU, RAM, Disks, GPU, Motherboard)
  [6] Windows Utilities        (Task Manager, Regedit, Services)
  [7] Windows Configuration    (Hostname, TimeZone, License, Power)
  [8] Quick Actions            (One-Click Diagnostic Routines)
  [0] Exit Toolkit
```

---

## 📦 Project Architecture & File Tree

```
├── api/
│   ├── i.js               # Vercel Serverless Function serving raw PowerShell (/i)
│   └── index.js           # Vercel Serverless Function serving plain-text root / banner
├── src/
│   ├── App.tsx            # Sysadmin portal with terminal preview, copiers, & source inspector
│   ├── index.css          # Tailwind CSS styling
│   └── main.tsx           # React entry point
├── toolkit.ps1            # Master standalone PowerShell 5.1 & PS 7+ toolkit script
├── server.ts              # Express dev & full-stack server serving /i as text/plain
├── vercel.json            # Vercel routing configuration
├── package.json           # Node.js project manifest & scripts
├── metadata.json          # AI Studio applet metadata
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite bundler configuration
└── README.md              # Full documentation and operating guide
```

---

## 🛠️ Modules Breakdown

### Module 1: Software Installer (Winget)
- Automatic detection of `winget` CLI.
- Strict package whitelisting:
  - **Notepad++**: `Notepad++.Notepad++`
  - **Google Chrome**: `Google.Chrome`
  - **Python**: `Python.Python.3.14`
  - **Mozilla Firefox**: `Mozilla.Firefox`
  - **WinRAR**: `RARLab.WinRAR`
  - **VLC**: `VideoLAN.VLC`
  - **Avro Keyboard**: `OmicronLab.Avro`
- Configurable package bundles: **Essential**, **Browser Pack**, **Developer Pack**, **Multimedia Pack**, and **Utility Pack**.
- Pre-installation detection skips already installed software without errors.
- Displays summary: Successful, Skipped, and Failed counts.

### Module 2: Network Tools
- Active IP configuration (IPv4, IPv6, Default Gateway, DNS Servers, DHCP).
- ICMP Ping tests with input validation.
- 3-point Internet connectivity test (Gateway ping, DNS resolution, and HTTPS request).
- DNS record resolution (`Resolve-DnsName`).
- Traceroute routing diagnostics.
- Flush DNS client cache (`Clear-DnsClientCache`).
- DHCP IP release & renew.
- WiFi interfaces & saved network profiles (safe profile name inspection; stored key reveals require admin confirmation).
- Network Stack Reset (flushes DNS, resets Winsock, and resets TCP/IP stack with confirmation).
- DNS Server Switcher: Predefined safe presets for **Cloudflare** (`1.1.1.1`), **Google** (`8.8.8.8`), **Quad9** (`9.9.9.9`), or **Automatic DHCP**.

### Module 3: Windows Repair
- **System File Checker**: `sfc /scannow`
- **DISM Image Repair**: `CheckHealth`, `ScanHealth`, and `RestoreHealth` (with confirmation).
- **CHKDSK Inspection**: Read-only file system inspection on drive C: without forced reboot.
- **Windows Update Repair**: Controlled service shutdown (`wuauserv`, `bits`, `cryptSvc`), update cache purge (`SoftwareDistribution\Download`), and service restart.
- **Network Repair Routine**: DNS flush, DNS registration, Winsock reset, and DHCP refresh.
- **Component Store Cleanup**: `DISM /Online /Cleanup-Image /StartComponentCleanup`.

### Module 4: Cleanup Tools
- Safe User Temp cleanup (`$env:TEMP`) with locked-file handling.
- System Temp cleanup (`C:\Windows\Temp`) with administrative check.
- Recycle Bin cleanup (`Clear-RecycleBin` with confirmation).
- DNS resolver cache cleanup.
- Windows Update download cache purge.
- Shortcut to native Windows Disk Cleanup (`cleanmgr.exe`).
- Browser cache cleaner (Chrome, Edge, Firefox).
- Temporary file disk space analyzer with formatted MB/GB totals.

### Module 5: System Information (Native CIM)
- Windows OS (Caption, Version, Build Number, Architecture, Uptime, Install Date).
- Computer system hardware (Manufacturer, Model, Hostname, Total RAM).
- Processor details (Cores, Logical Processors, Base Clock, Socket).
- RAM audit (Module capacity, Speed in MHz, Vendor, Part numbers).
- Storage inspection (Physical disk drives and logical drive volume capacities).
- Graphics (GPU Name, Driver Version, Resolution, Video RAM).
- BIOS / UEFI (Manufacturer, Version, Release Date, Serial Number).
- Motherboard / BaseBoard (Vendor, Product, Serial Number).
- Active Network Adapters (Link speed, MAC address, Status).
- Full System Audit Summary Report.

### Module 6: Windows Utilities
Instant shortcuts using `Start-Process`:
- Task Manager (`taskmgr.exe`)
- Device Manager (`devmgmt.msc`)
- Services Console (`services.msc`)
- Computer Management (`compmgmt.msc`)
- Registry Editor (`regedit.exe`)
- Control Panel (`control.exe`)
- Windows Settings (`ms-settings:`)
- Command Prompt (`cmd.exe`)
- PowerShell (`powershell.exe`)
- Event Viewer (`eventvwr.msc`)
- Disk Management (`diskmgmt.msc`)
- System Properties (`sysdm.cpl`)

### Module 7: Windows Configuration
- Rename Computer with hostname validation and reboot reminder.
- Time Zone inspector and switcher with popular global zones.
- Official Windows activation/licensing status query (via CIM `SoftwareLicensingProduct` and `slmgr.vbs` - no cracks or unauthorized KMS).
- Power Scheme management (High Performance, Balanced, Power Saver).
- Default Browser HTTP handler protocol query.

### Module 8: Quick Actions
One-click essential diagnostics:
- Flush DNS
- Internet Test
- Show IP
- Restart Windows Explorer
- Open Task Manager
- Open Windows Settings
- Run SFC
- Run DISM RestoreHealth
- Install Essential Software

---

## 🔒 Security Model & Best Practices

1. **No Code Injection via Query Parameters:** The Vercel serverless function serves a static, hardened PowerShell script. It never constructs or executes PowerShell from URL query arguments.
2. **Strict Whitelist for Software:** All installed applications come from the hardcoded catalog in `toolkit.ps1`.
3. **No Credential Harvesting or Exfiltration:** The toolkit never logs, transmits, or sends credentials, system info, or passwords over the network.
4. **Explicit Confirmations for Disruptive Operations:** Network resets, IP release, DISM RestoreHealth, and computer renames require explicit `[Y/N]` user confirmation.
5. **In-Memory Remote UAC Elevation:**
   When running via `irm <url>/i | iex`, standard scripts cannot elevate because `$PSCommandPath` is empty. ItsRiRx Toolkit detects this and dynamically relaunches elevated using:
   ```powershell
   Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `"irm $Script:LauncherUrl | iex`""
   ```

---

## 🚀 Deployment Instructions

### 1. Deploy to Vercel

1. Push this project to GitHub (or use Vercel CLI):
   ```bash
   git init
   git add .
   git commit -m "Deploy ItsRiRx Toolkit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/itsrirx-toolkit.git
   git push -u origin main
   ```
2. Open [vercel.com](https://vercel.com) and log in.
3. Click **Add New...** &rarr; **Project**.
4. Select your GitHub repository.
5. Keep default project settings and click **Deploy**.
6. Note your deployment URL (e.g. `https://itsrirx-toolkit.vercel.app`).
7. Test the endpoint in your browser or terminal:
   ```bash
   curl -s https://itsrirx-toolkit.vercel.app/i
   ```
8. Run the launcher from Windows PowerShell:
   ```powershell
   irm https://itsrirx-toolkit.vercel.app/i | iex
   ```

### 2. Local Testing

To test locally:
```bash
npm install
npm run dev
```
In your browser or terminal:
```powershell
irm http://localhost:3000/i | iex
```

---

## ➕ How to Customize

### Adding New Software
Open `toolkit.ps1` and locate the `$Script:SoftwareCatalog` hashtable:
```powershell
$Script:SoftwareCatalog = [ordered]@{
    # Add your software here:
    "VS Code" = @{ Id = "Microsoft.VisualStudioCode"; Name = "Visual Studio Code"; Category = "Developer" }
    ...
}
```
Then add the key `"VS Code"` into `$Script:PackageGroups["Developer"]` or create a new group.

---

## 📄 License & Attribution

Designed and maintained for authorized Windows administration.
Developed with Google AI Studio & Vercel.
Author: ItsRiRx.
