export interface SoftwareApp {
  id: string;
  name: string;
  category: string;
  desc: string;
  icon: string;
  popular?: boolean;
}

export interface SystemTweak {
  id: string;
  title: string;
  category: string;
  moduleNum: string;
  desc: string;
  recommended?: boolean;
  psCode: string;
  batCode: string;
}

export const CATEGORIES = [
  'All Applications',
  'Web Browsers',
  'Developer & Coding',
  'Multimedia',
  'Utilities & Tools',
  'Communication',
  'Gaming',
  'Security & Privacy',
  'Remote Access & IT',
  'Office & Productivity'
] as const;

export const SOFTWARE_APPS: SoftwareApp[] = [
  // 1. Web Browsers
  { id: 'Google.Chrome', name: 'Google Chrome', category: 'Web Browsers', desc: 'Fast, secure and official web browser by Google', icon: 'Globe', popular: true },
  { id: 'Mozilla.Firefox', name: 'Mozilla Firefox', category: 'Web Browsers', desc: 'Privacy-first open source web browser', icon: 'Globe', popular: true },
  { id: 'Microsoft.Edge', name: 'Microsoft Edge', category: 'Web Browsers', desc: 'Chromium-based native Windows browser', icon: 'Globe' },
  { id: 'Brave.Brave', name: 'Brave Browser', category: 'Web Browsers', desc: 'Privacy browser with built-in ad and tracker blocking', icon: 'Globe', popular: true },
  { id: 'Opera.Opera', name: 'Opera Browser', category: 'Web Browsers', desc: 'Feature-rich web browser with built-in VPN and sidebar', icon: 'Globe' },

  // 2. Developer & Coding
  { id: 'Microsoft.VisualStudioCode', name: 'Visual Studio Code', category: 'Developer & Coding', desc: 'Industry standard code editor with extensions & terminal', icon: 'Code2', popular: true },
  { id: 'Git.Git', name: 'Git for Windows', category: 'Developer & Coding', desc: 'Distributed version control system and Git Bash CLI', icon: 'Code2', popular: true },
  { id: 'Python.Python.3.14', name: 'Python 3', category: 'Developer & Coding', desc: 'Powerful high-level programming language and PIP package manager', icon: 'Code2', popular: true },
  { id: 'OpenJS.NodeJS.LTS', name: 'Node.js (LTS)', category: 'Developer & Coding', desc: 'JavaScript runtime environment with NPM package manager', icon: 'Code2', popular: true },
  { id: 'Notepad++.Notepad++', name: 'Notepad++', category: 'Developer & Coding', desc: 'Lightweight, ultra-fast tabbed text and source code editor', icon: 'Code2', popular: true },

  // 3. Multimedia & Creators
  { id: 'VideoLAN.VLC', name: 'VLC Media Player', category: 'Multimedia', desc: 'Plays all audio, video formats and streaming protocols natively', icon: 'Film', popular: true },
  { id: 'Spotify.Spotify', name: 'Spotify Music', category: 'Multimedia', desc: 'Digital streaming music and podcast player', icon: 'Film', popular: true },
  { id: 'OBSProject.OBSStudio', name: 'OBS Studio', category: 'Multimedia', desc: 'Free open source screen recording and live streaming studio', icon: 'Film', popular: true },
  { id: 'Audacity.Audacity', name: 'Audacity Audio Editor', category: 'Multimedia', desc: 'Multi-track audio editor and sound recorder', icon: 'Film' },
  { id: 'HandBrake.HandBrake', name: 'HandBrake Transcoder', category: 'Multimedia', desc: 'High performance video transcoder and format converter', icon: 'Film' },

  // 4. Utilities & Tools
  { id: '7zip.7zip', name: '7-Zip Archiver', category: 'Utilities & Tools', desc: 'High compression ratio file archiver for 7z, ZIP, RAR, TAR', icon: 'Wrench', popular: true },
  { id: 'RARLab.WinRAR', name: 'WinRAR', category: 'Utilities & Tools', desc: 'Powerful archive manager with recovery record capabilities', icon: 'Wrench', popular: true },
  { id: 'voidtools.Everything', name: 'Everything Search', category: 'Utilities & Tools', desc: 'Instant millisecond filename search engine for Windows NTFS', icon: 'Wrench', popular: true },
  { id: 'Microsoft.PowerToys', name: 'Microsoft PowerToys', category: 'Utilities & Tools', desc: 'System utilities for power users (FancyZones, ColorPicker, Run)', icon: 'Wrench', popular: true },
  { id: 'Rufus.Rufus', name: 'Rufus USB Creator', category: 'Utilities & Tools', desc: 'Create bootable USB drives for Windows and Linux installations', icon: 'Wrench' },
  { id: 'ShareX.ShareX', name: 'ShareX Screen Capture', category: 'Utilities & Tools', desc: 'Advanced screen capture, file sharing and productivity tool', icon: 'Wrench' },
  { id: 'OmicronLab.Avro', name: 'Avro Keyboard', category: 'Utilities & Tools', desc: 'Standard phonetic Bangla typing software for Windows', icon: 'Wrench', popular: true },

  // 5. Communication
  { id: 'WhatsApp.WhatsApp', name: 'WhatsApp Desktop', category: 'Communication', desc: 'Desktop client for WhatsApp messaging and video calls', icon: 'MessageSquare', popular: true },
  { id: 'Telegram.TelegramDesktop', name: 'Telegram Desktop', category: 'Communication', desc: 'Fast, secure cloud messaging client with unlimited storage', icon: 'MessageSquare', popular: true },
  { id: 'Discord.Discord', name: 'Discord', category: 'Communication', desc: 'Voice, video and text chat platform for communities and gaming', icon: 'MessageSquare', popular: true },
  { id: 'Zoom.Zoom', name: 'Zoom Workplace', category: 'Communication', desc: 'Enterprise video meetings, screen sharing and team chat', icon: 'MessageSquare' },
  { id: 'Microsoft.Teams', name: 'Microsoft Teams', category: 'Communication', desc: 'Collaboration and video conferencing platform for business', icon: 'MessageSquare' },

  // 6. Gaming Launchers
  { id: 'Valve.Steam', name: 'Steam Client', category: 'Gaming', desc: 'Ultimate entertainment platform for playing and creating games', icon: 'Gamepad2', popular: true },
  { id: 'EpicGames.EpicGamesLauncher', name: 'Epic Games Launcher', category: 'Gaming', desc: 'Play Unreal Engine titles and claim weekly free PC games', icon: 'Gamepad2', popular: true },
  { id: 'ElectronicArts.EADesktop', name: 'EA Desktop App', category: 'Gaming', desc: 'Official game launcher for EA games and subscriptions', icon: 'Gamepad2' },
  { id: 'Ubisoft.Connect', name: 'Ubisoft Connect', category: 'Gaming', desc: 'Ecosystem of players and games across Ubisoft network', icon: 'Gamepad2' },
  { id: 'RiotGames.RiotClient', name: 'Riot Client', category: 'Gaming', desc: 'Launcher for League of Legends, Valorant and Teamfight Tactics', icon: 'Gamepad2' },
  { id: 'Microsoft.GamingApp', name: 'Xbox App', category: 'Gaming', desc: 'Play PC Game Pass titles, connect with friends and cloud gaming', icon: 'Gamepad2' },

  // 7. Security & Privacy
  { id: 'Bitwarden.Bitwarden', name: 'Bitwarden', category: 'Security & Privacy', desc: 'Secure open-source password manager with end-to-end encryption', icon: 'ShieldCheck', popular: true },
  { id: 'Malwarebytes.Malwarebytes', name: 'Malwarebytes', category: 'Security & Privacy', desc: 'Industry leading anti-malware, spyware and ransomware scanner', icon: 'ShieldCheck', popular: true },
  { id: 'Proton.ProtonVPN', name: 'Proton VPN', category: 'Security & Privacy', desc: 'High-speed Swiss VPN with rigorous no-logs policy', icon: 'ShieldCheck' },

  // 8. Remote Access & IT
  { id: 'AnyDeskSoftwareGmbH.AnyDesk', name: 'AnyDesk Remote Desktop', category: 'Remote Access & IT', desc: 'Ultra-low latency secure remote desktop connection software', icon: 'Monitor', popular: true },
  { id: 'UltraViewer.UltraViewer', name: 'UltraViewer Remote', category: 'Remote Access & IT', desc: 'Simple, free remote desktop support and screen control tool', icon: 'Monitor', popular: true },
  { id: 'TeamViewer.TeamViewer', name: 'TeamViewer Remote', category: 'Remote Access & IT', desc: 'Remote connectivity and IT management solution worldwide', icon: 'Monitor' },
  { id: 'RustDesk.RustDesk', name: 'RustDesk Open Source', category: 'Remote Access & IT', desc: 'Self-hosted open source remote desktop written in Rust', icon: 'Monitor' },
  { id: 'PuTTY.PuTTY', name: 'PuTTY SSH Client', category: 'Remote Access & IT', desc: 'Free terminal emulator, serial console and network transfer tool', icon: 'Monitor' },
  { id: 'WinSCP.WinSCP', name: 'WinSCP SFTP Client', category: 'Remote Access & IT', desc: 'Popular SFTP and FTP client for secure file transfer to servers', icon: 'Monitor' },

  // 9. Office & Productivity
  { id: 'Microsoft.Office', name: 'Microsoft 365 Apps', category: 'Office & Productivity', desc: 'Official Word, Excel, PowerPoint and cloud collaboration tools', icon: 'FileText', popular: true },
  { id: 'TheDocumentFoundation.LibreOffice', name: 'LibreOffice', category: 'Office & Productivity', desc: 'Free and open source full office productivity suite', icon: 'FileText', popular: true },
  { id: 'Adobe.Acrobat.Reader.64-bit', name: 'Adobe Acrobat Reader', category: 'Office & Productivity', desc: 'Standard reliable PDF viewing, printing and annotating tool', icon: 'FileText', popular: true },
  { id: 'Notion.Notion', name: 'Notion Workspace', category: 'Office & Productivity', desc: 'Connected workspace for notes, tasks, wikis and databases', icon: 'FileText' }
];

export const SYSTEM_TWEAKS: SystemTweak[] = [
  // Module 2: Debloat & Privacy
  {
    id: 'disable_telemetry',
    title: 'Disable Diagnostic Telemetry',
    category: 'Debloat & Privacy',
    moduleNum: '02',
    desc: 'Stops DiagTrack and dmwappushservice background tracking services and sets telemetry level to 0.',
    recommended: true,
    psCode: `Stop-Service 'DiagTrack' -Force -ErrorAction SilentlyContinue; Set-Service 'DiagTrack' -StartupType Disabled; Stop-Service 'dmwappushservice' -Force -ErrorAction SilentlyContinue; Set-Service 'dmwappushservice' -StartupType Disabled; Set-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -Name 'AllowTelemetry' -Type DWord -Value 0 -Force; Write-Host 'Telemetry disabled.' -ForegroundColor Green`,
    batCode: `sc stop DiagTrack >nul 2>&1 & sc config DiagTrack start=disabled >nul 2>&1 & sc stop dmwappushservice >nul 2>&1 & sc config dmwappushservice start=disabled >nul 2>&1 & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f >nul 2>&1`
  },
  {
    id: 'disable_bing_start',
    title: 'Disable Bing Search in Start',
    category: 'Debloat & Privacy',
    moduleNum: '02',
    desc: 'Removes slow web search results from the Start Menu, making local app and file search instant.',
    recommended: true,
    psCode: `Set-ItemProperty -Path 'HKCU:\\Software\\Policies\\Microsoft\\Windows\\Explorer' -Name 'DisableSearchBoxSuggestions' -Type DWord -Value 1 -Force -ErrorAction SilentlyContinue; Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Search' -Name 'BingSearchEnabled' -Type DWord -Value 0 -Force -ErrorAction SilentlyContinue; Write-Host 'Bing Start search disabled.' -ForegroundColor Green`,
    batCode: `reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\Explorer" /v DisableSearchBoxSuggestions /t REG_DWORD /d 1 /f >nul 2>&1 & reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search" /v BingSearchEnabled /t REG_DWORD /d 0 /f >nul 2>&1`
  },
  {
    id: 'classic_context_menu',
    title: 'Restore Classic Context Menu (Win 11)',
    category: 'Debloat & Privacy',
    moduleNum: '02',
    desc: 'Restores the traditional Windows 10 right-click menu without having to click "Show more options".',
    recommended: true,
    psCode: `Set-ItemProperty -Path 'HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32' -Name '(Default)' -Value '' -Force; Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue; Start-Process explorer.exe; Write-Host 'Classic context menu restored.' -ForegroundColor Green`,
    batCode: `reg add "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" /f /ve >nul 2>&1 & taskkill /f /im explorer.exe >nul 2>&1 & start explorer.exe`
  },
  {
    id: 'remove_uwp_bloatware',
    title: 'Remove Pre-Installed UWP Bloatware',
    category: 'Debloat & Privacy',
    moduleNum: '02',
    desc: 'Removes pre-installed OEM apps like Feedback Hub, Tips, Maps, Weather, and Solitaire.',
    recommended: false,
    psCode: `Get-AppxPackage -AllUsers *Microsoft.GetHelp* | Remove-AppxPackage -ErrorAction SilentlyContinue; Get-AppxPackage -AllUsers *Microsoft.Getstarted* | Remove-AppxPackage -ErrorAction SilentlyContinue; Get-AppxPackage -AllUsers *Microsoft.WindowsFeedbackHub* | Remove-AppxPackage -ErrorAction SilentlyContinue; Write-Host 'Bloatware UWP removed.' -ForegroundColor Green`,
    batCode: `powershell -Command "Get-AppxPackage -AllUsers *Microsoft.GetHelp* | Remove-AppxPackage -ErrorAction SilentlyContinue; Get-AppxPackage -AllUsers *Microsoft.WindowsFeedbackHub* | Remove-AppxPackage -ErrorAction SilentlyContinue"`
  },

  // Module 3: Performance & Gaming
  {
    id: 'ultimate_performance',
    title: 'Unlock Ultimate Performance Power Plan',
    category: 'Performance & Gaming',
    moduleNum: '03',
    desc: 'Unlocks and activates Windows hidden zero-throttle Ultimate Performance power scheme for maximum CPU frequency.',
    recommended: true,
    psCode: `powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61; powercfg /setactive e9a42b02-d5df-448d-aa00-03f14749eb61; Write-Host 'Ultimate Performance scheme activated.' -ForegroundColor Green`,
    batCode: `powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1 & powercfg /setactive e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1`
  },
  {
    id: 'disable_game_dvr',
    title: 'Disable Game DVR Background Recording',
    category: 'Performance & Gaming',
    moduleNum: '03',
    desc: 'Stops Windows from secretly recording gameplay in the background, eliminating stutter and boosting FPS.',
    recommended: true,
    psCode: `Set-ItemProperty -Path 'HKCU:\\System\\GameConfigStore' -Name 'GameDVR_Enabled' -Type DWord -Value 0 -Force; Set-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR' -Name 'AllowGameDVR' -Type DWord -Value 0 -Force -ErrorAction SilentlyContinue; Write-Host 'Game DVR disabled.' -ForegroundColor Green`,
    batCode: `reg add "HKCU\\System\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f >nul 2>&1 & reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f >nul 2>&1`
  },
  {
    id: 'disable_mouse_accel',
    title: 'Disable Mouse Acceleration (1:1 Raw Input)',
    category: 'Performance & Gaming',
    moduleNum: '03',
    desc: 'Disables "Enhance pointer precision" to provide true 1:1 raw hardware mouse movement for gaming accuracy.',
    recommended: true,
    psCode: `Set-ItemProperty -Path 'HKCU:\\Control Panel\\Mouse' -Name 'MouseSpeed' -Value '0' -Force; Set-ItemProperty -Path 'HKCU:\\Control Panel\\Mouse' -Name 'MouseThreshold1' -Value '0' -Force; Set-ItemProperty -Path 'HKCU:\\Control Panel\\Mouse' -Name 'MouseThreshold2' -Value '0' -Force; Write-Host 'Mouse acceleration disabled.' -ForegroundColor Green`,
    batCode: `reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d 0 /f >nul 2>&1 & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d 0 /f >nul 2>&1 & reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d 0 /f >nul 2>&1`
  },

  // Module 4: System Safety & Restore
  {
    id: 'create_restore_point',
    title: 'Create 1-Click System Restore Point',
    category: 'Safety & Restore',
    moduleNum: '04',
    desc: 'Takes an instant snapshot checkpoint of the Windows registry and system files before applying modifications.',
    recommended: true,
    psCode: `Enable-ComputerRestore -Drive 'C:\\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description 'ItsRiRx-Web-SafeCheckpoint' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction Stop; Write-Host 'System Restore Point created.' -ForegroundColor Green`,
    batCode: `powershell -Command "Enable-ComputerRestore -Drive 'C:\\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description 'ItsRiRx-Web-SafeCheckpoint' -RestorePointType 'MODIFY_SETTINGS'"`
  },
  {
    id: 'update_defender_quick_scan',
    title: 'Update Defender & Run Quick Scan',
    category: 'Safety & Restore',
    moduleNum: '04',
    desc: 'Downloads the latest virus definitions from Microsoft cloud and launches a rapid system threat scan.',
    recommended: false,
    psCode: `Update-MpSignature; Start-MpScan -ScanType QuickScan; Write-Host 'Defender scan complete.' -ForegroundColor Green`,
    batCode: `powershell -Command "Update-MpSignature; Start-MpScan -ScanType QuickScan"`
  },

  // Module 7: Windows System Repair
  {
    id: 'sfc_scannow',
    title: 'SFC /scannow (System File Checker)',
    category: 'Windows System Repair',
    moduleNum: '07',
    desc: 'Scans all protected Windows operating system files and automatically replaces corrupted files from cached copies.',
    recommended: true,
    psCode: `sfc /scannow`,
    batCode: `sfc /scannow`
  },
  {
    id: 'dism_restore_health',
    title: 'DISM /Online /Cleanup-Image /RestoreHealth',
    category: 'Windows System Repair',
    moduleNum: '07',
    desc: 'Repairs the Windows Component Store image using Windows Update servers as a source to fix stubborn errors.',
    recommended: true,
    psCode: `DISM /Online /Cleanup-Image /RestoreHealth`,
    batCode: `DISM /Online /Cleanup-Image /RestoreHealth`
  },
  {
    id: 'repair_windows_update',
    title: 'Repair Windows Update Cache & Services',
    category: 'Windows System Repair',
    moduleNum: '07',
    desc: 'Stops wuauserv, bits, cryptSvc, deletes corrupted SoftwareDistribution temporary downloads, and restarts services.',
    recommended: true,
    psCode: `Stop-Service wuauserv, bits, cryptSvc -Force -ErrorAction SilentlyContinue; Remove-Item '$env:SystemRoot\\SoftwareDistribution\\Download\\*' -Recurse -Force -ErrorAction SilentlyContinue; Start-Service wuauserv, bits, cryptSvc -ErrorAction SilentlyContinue; Write-Host 'Windows Update cache repaired.' -ForegroundColor Green`,
    batCode: `net stop wuauserv >nul 2>&1 & net stop bits >nul 2>&1 & del /s /q /f "%windir%\\SoftwareDistribution\\Download\\*.*" >nul 2>&1 & net start wuauserv >nul 2>&1 & net start bits >nul 2>&1`
  },

  // Module 8: Disk Cleanup & Storage
  {
    id: 'clean_temp_files',
    title: 'Purge User & Windows Temp Files',
    category: 'Disk Cleanup & Storage',
    moduleNum: '08',
    desc: 'Safely removes accumulated gigabytes of temporary junk files from %TEMP% and C:\\Windows\\Temp.',
    recommended: true,
    psCode: `Remove-Item '$env:TEMP\\*' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '$env:SystemRoot\\Temp\\*' -Recurse -Force -ErrorAction SilentlyContinue; Write-Host 'Temp files purged.' -ForegroundColor Green`,
    batCode: `del /s /f /q "%temp%\\*.*" >nul 2>&1 & del /s /f /q "%windir%\\Temp\\*.*" >nul 2>&1`
  },
  {
    id: 'empty_recycle_bin',
    title: 'Empty Recycle Bin (All Drives)',
    category: 'Disk Cleanup & Storage',
    moduleNum: '08',
    desc: 'Instantly permanently clears all deleted files from the recycle bin across all local partitions.',
    recommended: false,
    psCode: `Clear-RecycleBin -Force -ErrorAction SilentlyContinue; Write-Host 'Recycle bin emptied.' -ForegroundColor Green`,
    batCode: `powershell -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"`
  },
  {
    id: 'ssd_trim_retrim',
    title: 'Manual SSD TRIM Optimization',
    category: 'Disk Cleanup & Storage',
    moduleNum: '08',
    desc: 'Executes Optimize-Volume -ReTrim on Drive C: to inform the SSD controller of freed blocks for peak write speed.',
    recommended: true,
    psCode: `Optimize-Volume -DriveLetter C -ReTrim -Verbose`,
    batCode: `powershell -Command "Optimize-Volume -DriveLetter C -ReTrim -Verbose"`
  },

  // Module 9: Network Diagnostics & DNS
  {
    id: 'flush_dns_cache',
    title: 'Flush DNS Client Resolver Cache',
    category: 'Network Diagnostics & DNS',
    moduleNum: '09',
    desc: 'Clears stale or poisoned local DNS records instantly, solving webpage loading failures and domain errors.',
    recommended: true,
    psCode: `Clear-DnsClientCache; ipconfig /flushdns; Write-Host 'DNS cache flushed.' -ForegroundColor Green`,
    batCode: `ipconfig /flushdns`
  },
  {
    id: 'set_dns_cloudflare',
    title: 'Switch to Cloudflare DNS (1.1.1.1 / 1.0.0.1)',
    category: 'Network Diagnostics & DNS',
    moduleNum: '09',
    desc: 'Applies Cloudflare privacy-focused ultra-fast public DNS resolvers to all active network adapters.',
    recommended: true,
    psCode: `Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | ForEach-Object { Set-DnsClientServerAddress -InterfaceAlias $_.Name -ServerAddresses ('1.1.1.1', '1.0.0.1') }; Write-Host 'Cloudflare DNS applied.' -ForegroundColor Green`,
    batCode: `powershell -Command "Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | ForEach-Object { Set-DnsClientServerAddress -InterfaceAlias $_.Name -ServerAddresses ('1.1.1.1', '1.0.0.1') }"`
  },
  {
    id: 'reset_network_stack',
    title: 'Full Network Stack & Winsock Reset',
    category: 'Network Diagnostics & DNS',
    moduleNum: '09',
    desc: 'Resets Winsock catalog, TCP/IP stack configuration, and flushes network routes to fix stubborn internet loss.',
    recommended: false,
    psCode: `netsh winsock reset; netsh int ip reset; ipconfig /flushdns; Write-Host 'Network stack reset complete. Please restart computer.' -ForegroundColor Yellow`,
    batCode: `netsh winsock reset >nul 2>&1 & netsh int ip reset >nul 2>&1 & ipconfig /flushdns >nul 2>&1`
  },

  // Module 11: Instant Quick Actions
  {
    id: 'restart_explorer',
    title: 'Restart Windows Explorer Process',
    category: 'Instant Quick Actions',
    moduleNum: '11',
    desc: 'Restarts explorer.exe cleanly, immediately unfreezing stuck taskbars, black screens, or frozen desktops.',
    recommended: true,
    psCode: `Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 1; Start-Process explorer.exe; Write-Host 'Windows Explorer restarted.' -ForegroundColor Green`,
    batCode: `taskkill /f /im explorer.exe >nul 2>&1 & start explorer.exe`
  }
];

export const PRESET_BUNDLES = [
  {
    name: '⚡ Essential Fresh PC',
    desc: 'The essential browser, archiver, media player, editor & remote access for every new Windows install.',
    apps: ['Google.Chrome', '7zip.7zip', 'VideoLAN.VLC', 'Notepad++.Notepad++', 'AnyDeskSoftwareGmbH.AnyDesk', 'OmicronLab.Avro'],
    tweaks: ['disable_telemetry', 'disable_bing_start', 'classic_context_menu', 'clean_temp_files', 'flush_dns_cache']
  },
  {
    name: '💻 Developer Rig',
    desc: 'Complete software development suite with VS Code, Git, Python, Node.js, and command tools.',
    apps: ['Microsoft.VisualStudioCode', 'Git.Git', 'Python.Python.3.14', 'OpenJS.NodeJS.LTS', 'Notepad++.Notepad++', 'PuTTY.PuTTY', 'WinSCP.WinSCP', '7zip.7zip'],
    tweaks: ['disable_telemetry', 'classic_context_menu', 'flush_dns_cache']
  },
  {
    name: '🎮 Gamer Max FPS',
    desc: 'Gaming launchers, Discord, voice chat, and maximum system latency / power plan optimizations.',
    apps: ['Valve.Steam', 'Discord.Discord', 'EpicGames.EpicGamesLauncher', '7zip.7zip', 'Spotify.Spotify'],
    tweaks: ['ultimate_performance', 'disable_game_dvr', 'disable_mouse_accel', 'disable_telemetry']
  },
  {
    name: '🏢 Office & Workstation',
    desc: 'Full productivity suite with Microsoft 365 / LibreOffice, PDF reader, and communication tools.',
    apps: ['Google.Chrome', 'TheDocumentFoundation.LibreOffice', 'Adobe.Acrobat.Reader.64-bit', 'Telegram.TelegramDesktop', 'Zoom.Zoom', '7zip.7zip'],
    tweaks: ['disable_bing_start', 'clean_temp_files', 'flush_dns_cache']
  },
  {
    name: '🛡️ Privacy & Debloat Only',
    desc: 'No apps. Just purge background telemetry, disable Cortana, kill Bing Start search & clean bloatware.',
    apps: [],
    tweaks: ['disable_telemetry', 'disable_bing_start', 'classic_context_menu', 'remove_uwp_bloatware']
  }
];
