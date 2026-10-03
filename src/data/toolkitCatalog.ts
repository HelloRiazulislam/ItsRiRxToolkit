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
  'Office & Productivity',
  'Cloud & Storage',
  'Remote Access',
  'Graphics & Design',
  'AI Tools',
  'Backup & Recovery',
  'System & Hardware',
  'Network Tools',
  'Download Tools',
  'Database & Server',
  'Web Browsers',
  'Developer & Coding',
  'Multimedia',
  'Utilities & Tools',
  'Communication',
  'Gaming',
  'Security & Privacy'
] as const;

export const SOFTWARE_APPS: SoftwareApp[] = [
  // 1. Office & Productivity
  { id: 'Microsoft.Office', name: 'Microsoft 365', category: 'Office & Productivity', desc: 'Word, Excel, PowerPoint, Outlook & cloud collaboration tools', icon: 'FileText', popular: true },
  { id: 'Kingsoft.WPSOffice', name: 'WPS Office', category: 'Office & Productivity', desc: 'All-in-one lightweight office suite with PDF and templates', icon: 'FileText', popular: true },
  { id: 'TheDocumentFoundation.LibreOffice', name: 'LibreOffice', category: 'Office & Productivity', desc: 'Free, powerful and open source complete office productivity suite', icon: 'FileText', popular: true },
  { id: 'Notepad++.Notepad++', name: 'Notepad++', category: 'Office & Productivity', desc: 'Ultra-fast tabbed text and source code editor with syntax highlighting', icon: 'Code2', popular: true },
  { id: 'Adobe.Acrobat.Reader.64-bit', name: 'Adobe Acrobat Reader', category: 'Office & Productivity', desc: 'Standard reliable PDF viewer, printing and form annotating software', icon: 'FileText', popular: true },

  // 2. Cloud & Storage
  { id: 'Google.GoogleDrive', name: 'Google Drive', category: 'Cloud & Storage', desc: 'Seamless cloud file backup and virtual drive synchronization', icon: 'Cloud', popular: true },
  { id: 'Microsoft.OneDrive', name: 'OneDrive', category: 'Cloud & Storage', desc: 'Microsoft cloud file hosting, backup and device sync service', icon: 'Cloud', popular: true },
  { id: 'Dropbox.Dropbox', name: 'Dropbox', category: 'Cloud & Storage', desc: 'Secure cloud storage, file sharing and collaboration workspace', icon: 'Cloud' },
  { id: 'Mega.MEGAsync', name: 'MEGA', category: 'Cloud & Storage', desc: 'Encrypted cloud storage with 20GB free storage and auto-sync', icon: 'Cloud', popular: true },

  // 3. Remote Access
  { id: 'AnyDeskSoftwareGmbH.AnyDesk', name: 'AnyDesk', category: 'Remote Access', desc: 'Ultra-low latency secure remote desktop connection software', icon: 'Monitor', popular: true },
  { id: 'TeamViewer.TeamViewer', name: 'TeamViewer', category: 'Remote Access', desc: 'Global remote desktop access, screen sharing and IT support', icon: 'Monitor', popular: true },
  { id: 'RustDesk.RustDesk', name: 'RustDesk', category: 'Remote Access', desc: 'Open source self-hosted remote desktop software written in Rust', icon: 'Monitor', popular: true },
  { id: 'PuTTY.PuTTY', name: 'PuTTY', category: 'Remote Access', desc: 'Free SSH, Telnet, and raw socket terminal emulator client', icon: 'Monitor', popular: true },

  // 4. Graphics & Design
  { id: 'Adobe.Photoshop', name: 'Adobe Photoshop', category: 'Graphics & Design', desc: 'Industry standard digital image editing, raster graphic design & retouching', icon: 'Palette', popular: true },
  { id: 'GIMP.GIMP', name: 'GIMP', category: 'Graphics & Design', desc: 'Free & open source image manipulation program and photo editor', icon: 'Palette', popular: true },
  { id: 'dotPDNLLC.paintdotnet', name: 'Paint.NET', category: 'Graphics & Design', desc: 'Intuitive image and photo editing software with layer support', icon: 'Palette', popular: true },
  { id: 'Inkscape.Inkscape', name: 'Inkscape', category: 'Graphics & Design', desc: 'Professional open-source vector graphics editor for SVG, EPS and PDF', icon: 'Palette' },

  // 5. AI Tools
  { id: 'OpenAI.ChatGPT', name: 'ChatGPT', category: 'AI Tools', desc: 'Official ChatGPT desktop app for chat, coding and instant assistance', icon: 'Bot', popular: true },
  { id: 'Google.Gemini', name: 'Google Gemini', category: 'AI Tools', desc: 'Official Google Gemini AI multimodal intelligent assistant', icon: 'Sparkles', popular: true },
  { id: 'Anthropic.Claude', name: 'Claude', category: 'AI Tools', desc: 'Anthropic Claude desktop assistant for complex analysis and coding', icon: 'Bot', popular: true },
  { id: 'Microsoft.Copilot', name: 'Microsoft Copilot', category: 'AI Tools', desc: 'Everyday AI companion integrated for Windows productivity', icon: 'Sparkles', popular: true },
  { id: 'Perplexity.Perplexity', name: 'Perplexity', category: 'AI Tools', desc: 'AI-powered conversational search engine with verified source citations', icon: 'Bot', popular: true },

  // 6. Backup & Recovery
  { id: 'ParamountSoftware.MacriumReflectHome', name: 'Macrium Reflect', category: 'Backup & Recovery', desc: 'Award-winning disk imaging, cloning and full system bare-metal backup', icon: 'HardDriveDownload', popular: true },
  { id: 'AOMEI.Backupper', name: 'AOMEI Backupper', category: 'Backup & Recovery', desc: 'Complete backup, system restore and disk partition cloning tool', icon: 'HardDriveDownload', popular: true },
  { id: 'EaseUS.TodoBackup', name: 'EaseUS Todo Backup', category: 'Backup & Recovery', desc: 'Reliable one-click system backup, disk clone and emergency restore', icon: 'HardDriveDownload' },

  // 7. System & Hardware
  { id: 'CPUID.CPU-Z', name: 'CPU-Z', category: 'System & Hardware', desc: 'Detailed real-time processor, motherboard, cache and memory telemetry', icon: 'Cpu', popular: true },
  { id: 'TechPowerUp.GPU-Z', name: 'GPU-Z', category: 'System & Hardware', desc: 'Lightweight utility for graphics card, VRAM, clock & sensor monitoring', icon: 'Cpu', popular: true },
  { id: 'REALiX.HWiNFO', name: 'HWiNFO', category: 'System & Hardware', desc: 'Comprehensive hardware analysis, thermal sensors and real-time monitoring', icon: 'Cpu', popular: true },
  { id: 'CrystalDewWorld.CrystalDiskInfo', name: 'CrystalDiskInfo', category: 'System & Hardware', desc: 'HDD/SSD health monitoring utility with S.M.A.R.T. analytics', icon: 'Cpu', popular: true },
  { id: 'Piriform.Speccy', name: 'Speccy', category: 'System & Hardware', desc: 'Quick and detailed visual summary of all hardware components in your PC', icon: 'Cpu' },

  // 8. Network Tools
  { id: 'WireGuard.WireGuard', name: 'WireGuard', category: 'Network Tools', desc: 'Extremely fast, modern, and secure VPN tunnel protocol and client', icon: 'Network', popular: true },
  { id: 'OpenVPNTechnologies.OpenVPNConnect', name: 'OpenVPN Connect', category: 'Network Tools', desc: 'Official full-featured OpenVPN client for Windows', icon: 'Network', popular: true },
  { id: 'Tailscale.Tailscale', name: 'Tailscale', category: 'Network Tools', desc: 'Zero-config WireGuard mesh VPN to securely connect your devices', icon: 'Network', popular: true },
  { id: 'ZeroTier.ZeroTierOne', name: 'ZeroTier', category: 'Network Tools', desc: 'Virtual software-defined networking client for peer-to-peer connectivity', icon: 'Network' },

  // 9. Download Tools
  { id: 'qBittorrent.qBittorrent', name: 'qBittorrent', category: 'Download Tools', desc: 'Free, ad-free and open source torrent download client', icon: 'Download', popular: true },
  { id: 'SoftDeluxe.FreeDownloadManager', name: 'Free Download Manager', category: 'Download Tools', desc: 'Powerful multi-thread download accelerator and media grabber', icon: 'Download', popular: true },
  { id: 'Tonec.InternetDownloadManager', name: 'Internet Download Manager', category: 'Download Tools', desc: 'High-speed download accelerator with browser integration & resume support', icon: 'Download', popular: true },

  // 10. Database & Server
  { id: 'Oracle.MySQLWorkbench', name: 'MySQL Workbench', category: 'Database & Server', desc: 'Visual database design, SQL querying and administration tool for MySQL', icon: 'Database', popular: true },
  { id: 'dbeaver.dbeaver', name: 'DBeaver', category: 'Database & Server', desc: 'Universal free database tool supporting PostgreSQL, MySQL, SQLite and more', icon: 'Database', popular: true },
  { id: 'FileZilla.FileZilla', name: 'FileZilla', category: 'Database & Server', desc: 'Fast and reliable cross-platform FTP, FTPS and SFTP client', icon: 'Database', popular: true },
  { id: 'PostgreSQL.pgAdmin', name: 'pgAdmin', category: 'Database & Server', desc: 'Management tool and administration platform for PostgreSQL databases', icon: 'Database', popular: true },

  // 11. Web Browsers
  { id: 'Google.Chrome', name: 'Google Chrome', category: 'Web Browsers', desc: 'Fast, secure and official web browser by Google', icon: 'Globe', popular: true },
  { id: 'Mozilla.Firefox', name: 'Mozilla Firefox', category: 'Web Browsers', desc: 'Privacy-first open source web browser with tracking protection', icon: 'Globe', popular: true },
  { id: 'Microsoft.Edge', name: 'Microsoft Edge', category: 'Web Browsers', desc: 'Chromium-based native Windows browser with AI copilot integration', icon: 'Globe' },
  { id: 'Brave.Brave', name: 'Brave Browser', category: 'Web Browsers', desc: 'Privacy browser with built-in ad, popup and tracker blocking', icon: 'Globe', popular: true },
  { id: 'Opera.Opera', name: 'Opera Browser', category: 'Web Browsers', desc: 'Feature-rich web browser with built-in VPN and social messenger sidebar', icon: 'Globe' },

  // 12. Developer & Coding
  { id: 'Microsoft.VisualStudioCode', name: 'Visual Studio Code', category: 'Developer & Coding', desc: 'Industry standard code editor with extensions, debugging & terminal', icon: 'Code2', popular: true },
  { id: 'Git.Git', name: 'Git for Windows', category: 'Developer & Coding', desc: 'Distributed version control system and Git Bash CLI environment', icon: 'Code2', popular: true },
  { id: 'Python.Python.3.14', name: 'Python 3', category: 'Developer & Coding', desc: 'Powerful high-level programming language and PIP package manager', icon: 'Code2', popular: true },
  { id: 'OpenJS.NodeJS.LTS', name: 'Node.js (LTS)', category: 'Developer & Coding', desc: 'JavaScript runtime environment with NPM package manager', icon: 'Code2', popular: true },

  // 13. Multimedia
  { id: 'VideoLAN.VLC', name: 'VLC Media Player', category: 'Multimedia', desc: 'Plays all audio, video formats and streaming protocols natively', icon: 'Film', popular: true },
  { id: 'Spotify.Spotify', name: 'Spotify Music', category: 'Multimedia', desc: 'Digital streaming music and podcast player with curated playlists', icon: 'Film', popular: true },
  { id: 'OBSProject.OBSStudio', name: 'OBS Studio', category: 'Multimedia', desc: 'Free open source screen recording and live streaming broadcast studio', icon: 'Film', popular: true },
  { id: 'Audacity.Audacity', name: 'Audacity Audio Editor', category: 'Multimedia', desc: 'Multi-track audio editor and sound recorder for creators', icon: 'Film' },
  { id: 'HandBrake.HandBrake', name: 'HandBrake Transcoder', category: 'Multimedia', desc: 'High performance video transcoder and format converter', icon: 'Film' },

  // 14. Utilities & Tools
  { id: '7zip.7zip', name: '7-Zip Archiver', category: 'Utilities & Tools', desc: 'High compression ratio file archiver for 7z, ZIP, RAR, TAR', icon: 'Wrench', popular: true },
  { id: 'RARLab.WinRAR', name: 'WinRAR', category: 'Utilities & Tools', desc: 'Powerful archive manager with recovery record capabilities', icon: 'Wrench', popular: true },
  { id: 'voidtools.Everything', name: 'Everything Search', category: 'Utilities & Tools', desc: 'Instant millisecond filename search engine for Windows NTFS', icon: 'Wrench', popular: true },
  { id: 'Microsoft.PowerToys', name: 'Microsoft PowerToys', category: 'Utilities & Tools', desc: 'System utilities for power users (FancyZones, ColorPicker, Run)', icon: 'Wrench', popular: true },
  { id: 'Rufus.Rufus', name: 'Rufus USB Creator', category: 'Utilities & Tools', desc: 'Create bootable USB drives for Windows and Linux installations', icon: 'Wrench' },
  { id: 'ShareX.ShareX', name: 'ShareX Screen Capture', category: 'Utilities & Tools', desc: 'Advanced screen capture, file sharing and productivity tool', icon: 'Wrench' },
  { id: 'OmicronLab.Avro', name: 'Avro Keyboard', category: 'Utilities & Tools', desc: 'Standard phonetic Bangla typing software for Windows', icon: 'Wrench', popular: true },

  // 15. Communication
  { id: 'WhatsApp.WhatsApp', name: 'WhatsApp Desktop', category: 'Communication', desc: 'Desktop client for WhatsApp messaging and video calls', icon: 'MessageSquare', popular: true },
  { id: 'Telegram.TelegramDesktop', name: 'Telegram Desktop', category: 'Communication', desc: 'Fast, secure cloud messaging client with unlimited storage', icon: 'MessageSquare', popular: true },
  { id: 'Discord.Discord', name: 'Discord', category: 'Communication', desc: 'Voice, video and text chat platform for communities and gaming', icon: 'MessageSquare', popular: true },
  { id: 'Zoom.Zoom', name: 'Zoom Workplace', category: 'Communication', desc: 'Enterprise video meetings, screen sharing and team chat', icon: 'MessageSquare' },
  { id: 'Microsoft.Teams', name: 'Microsoft Teams', category: 'Communication', desc: 'Collaboration and video conferencing platform for business', icon: 'MessageSquare' },

  // 16. Gaming
  { id: 'Valve.Steam', name: 'Steam Client', category: 'Gaming', desc: 'Ultimate entertainment platform for playing and creating games', icon: 'Gamepad2', popular: true },
  { id: 'EpicGames.EpicGamesLauncher', name: 'Epic Games Launcher', category: 'Gaming', desc: 'Play Unreal Engine titles and claim weekly free PC games', icon: 'Gamepad2', popular: true },
  { id: 'ElectronicArts.EADesktop', name: 'EA Desktop App', category: 'Gaming', desc: 'Official game launcher for EA games and subscriptions', icon: 'Gamepad2' },
  { id: 'Ubisoft.Connect', name: 'Ubisoft Connect', category: 'Gaming', desc: 'Ecosystem of players and games across Ubisoft network', icon: 'Gamepad2' },
  { id: 'RiotGames.RiotClient', name: 'Riot Client', category: 'Gaming', desc: 'Launcher for League of Legends, Valorant and Teamfight Tactics', icon: 'Gamepad2' },
  { id: 'Microsoft.GamingApp', name: 'Xbox App', category: 'Gaming', desc: 'Play PC Game Pass titles, connect with friends and cloud gaming', icon: 'Gamepad2' },

  // 17. Security & Privacy
  { id: 'Bitwarden.Bitwarden', name: 'Bitwarden', category: 'Security & Privacy', desc: 'Secure open-source password manager with end-to-end encryption', icon: 'ShieldCheck', popular: true },
  { id: 'Malwarebytes.Malwarebytes', name: 'Malwarebytes', category: 'Security & Privacy', desc: 'Industry leading anti-malware, spyware and ransomware scanner', icon: 'ShieldCheck', popular: true },
  { id: 'Proton.ProtonVPN', name: 'Proton VPN', category: 'Security & Privacy', desc: 'High-speed Swiss VPN with rigorous no-logs policy', icon: 'ShieldCheck' }
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
    apps: ['Microsoft.VisualStudioCode', 'Git.Git', 'Python.Python.3.14', 'OpenJS.NodeJS.LTS', 'Notepad++.Notepad++', 'PuTTY.PuTTY', 'dbeaver.dbeaver', '7zip.7zip'],
    tweaks: ['disable_telemetry', 'classic_context_menu', 'flush_dns_cache']
  },
  {
    name: '🤖 AI Power User',
    desc: 'Curated collection of next-gen AI desktops (ChatGPT, Gemini, Claude, Copilot, Perplexity).',
    apps: ['OpenAI.ChatGPT', 'Google.Gemini', 'Anthropic.Claude', 'Microsoft.Copilot', 'Perplexity.Perplexity'],
    tweaks: ['disable_bing_start', 'clean_temp_files']
  },
  {
    name: '🏢 Office Workstation',
    desc: 'Full productivity suite with Microsoft 365, WPS Office, PDF reader, and Cloud sync.',
    apps: ['Microsoft.Office', 'Kingsoft.WPSOffice', 'Adobe.Acrobat.Reader.64-bit', 'Google.GoogleDrive', 'Telegram.TelegramDesktop', '7zip.7zip'],
    tweaks: ['disable_bing_start', 'clean_temp_files', 'flush_dns_cache']
  }
];
