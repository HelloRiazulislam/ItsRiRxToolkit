# ============================================================================
#  ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗
#  ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝
#  ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT
#  ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.1.0
#  ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗
#  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
#  Advanced Remote PowerShell Administration Suite
#  Compatibility: Windows PowerShell 5.1+, PowerShell 7+
# ============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Continue"

# Toolkit Metadata
$ToolkitName    = "ItsRiRx Windows Tool Kit"
$ToolkitShort   = "ItsRiRx Toolkit"
$ToolkitVersion = "1.2.0"
$ToolkitYear    = "2025"

# Determine Launcher URL dynamically
if ($MyInvocation.Line -match "https?://[^\s|/]+(?:/[^\s|]+)*") {
    $Script:LauncherUrl = $Matches[0]
} else {
    $Script:LauncherUrl = "https://itsrirx-toolkit.vercel.app/i"
}

# ============================================================================
# TOP APPLICATIONS CATALOG BY CATEGORY
# ============================================================================

$Script:SoftwareCatalog = [ordered]@{
    # 1. Office & Productivity
    "Microsoft 365"         = @{ Id = "Microsoft.Office"; Name = "Microsoft 365 Apps"; Category = "Office & Productivity" }
    "WPS Office"            = @{ Id = "Kingsoft.WPSOffice"; Name = "WPS Office"; Category = "Office & Productivity" }
    "LibreOffice"           = @{ Id = "TheDocumentFoundation.LibreOffice"; Name = "LibreOffice"; Category = "Office & Productivity" }
    "Notepad++"             = @{ Id = "Notepad++.Notepad++"; Name = "Notepad++"; Category = "Office & Productivity" }
    "Adobe Acrobat Reader"  = @{ Id = "Adobe.Acrobat.Reader.64-bit"; Name = "Adobe Acrobat Reader"; Category = "Office & Productivity" }

    # 2. Cloud & Storage
    "Google Drive"          = @{ Id = "Google.GoogleDrive"; Name = "Google Drive"; Category = "Cloud & Storage" }
    "OneDrive"              = @{ Id = "Microsoft.OneDrive"; Name = "OneDrive"; Category = "Cloud & Storage" }
    "Dropbox"               = @{ Id = "Dropbox.Dropbox"; Name = "Dropbox"; Category = "Cloud & Storage" }
    "MEGA"                  = @{ Id = "Mega.MEGAsync"; Name = "MEGA"; Category = "Cloud & Storage" }

    # 3. Remote Access
    "AnyDesk"               = @{ Id = "AnyDeskSoftwareGmbH.AnyDesk"; Name = "AnyDesk Remote Desktop"; Category = "Remote Access" }
    "TeamViewer"            = @{ Id = "TeamViewer.TeamViewer"; Name = "TeamViewer Remote"; Category = "Remote Access" }
    "RustDesk"              = @{ Id = "RustDesk.RustDesk"; Name = "RustDesk Open Source Remote"; Category = "Remote Access" }
    "PuTTY"                 = @{ Id = "PuTTY.PuTTY"; Name = "PuTTY SSH Client"; Category = "Remote Access" }

    # 4. Graphics & Design
    "Adobe Photoshop"       = @{ Id = "Adobe.Photoshop"; Name = "Adobe Photoshop"; Category = "Graphics & Design" }
    "GIMP"                  = @{ Id = "GIMP.GIMP"; Name = "GIMP Image Editor"; Category = "Graphics & Design" }
    "Paint.NET"             = @{ Id = "dotPDNLLC.paintdotnet"; Name = "Paint.NET"; Category = "Graphics & Design" }
    "Inkscape"              = @{ Id = "Inkscape.Inkscape"; Name = "Inkscape Vector Graphics"; Category = "Graphics & Design" }

    # 5. AI Tools
    "ChatGPT"               = @{ Id = "OpenAI.ChatGPT"; Name = "ChatGPT Desktop"; Category = "AI Tools" }
    "Google Gemini"         = @{ Id = "Google.Gemini"; Name = "Google Gemini AI"; Category = "AI Tools" }
    "Claude"                = @{ Id = "Anthropic.Claude"; Name = "Claude AI Assistant"; Category = "AI Tools" }
    "Microsoft Copilot"     = @{ Id = "Microsoft.Copilot"; Name = "Microsoft Copilot"; Category = "AI Tools" }
    "Perplexity"            = @{ Id = "Perplexity.Perplexity"; Name = "Perplexity AI"; Category = "AI Tools" }

    # 6. Backup & Recovery
    "Macrium Reflect"       = @{ Id = "ParamountSoftware.MacriumReflectHome"; Name = "Macrium Reflect"; Category = "Backup & Recovery" }
    "AOMEI Backupper"       = @{ Id = "AOMEI.Backupper"; Name = "AOMEI Backupper"; Category = "Backup & Recovery" }
    "EaseUS Todo Backup"    = @{ Id = "EaseUS.TodoBackup"; Name = "EaseUS Todo Backup"; Category = "Backup & Recovery" }

    # 7. System & Hardware
    "CPU-Z"                 = @{ Id = "CPUID.CPU-Z"; Name = "CPU-Z"; Category = "System & Hardware" }
    "GPU-Z"                 = @{ Id = "TechPowerUp.GPU-Z"; Name = "GPU-Z"; Category = "System & Hardware" }
    "HWiNFO"                = @{ Id = "REALiX.HWiNFO"; Name = "HWiNFO Diagnostic"; Category = "System & Hardware" }
    "CrystalDiskInfo"       = @{ Id = "CrystalDewWorld.CrystalDiskInfo"; Name = "CrystalDiskInfo"; Category = "System & Hardware" }
    "Speccy"                = @{ Id = "Piriform.Speccy"; Name = "Speccy System Info"; Category = "System & Hardware" }

    # 8. Network Tools
    "WireGuard"             = @{ Id = "WireGuard.WireGuard"; Name = "WireGuard VPN Client"; Category = "Network Tools" }
    "OpenVPN Connect"       = @{ Id = "OpenVPNTechnologies.OpenVPNConnect"; Name = "OpenVPN Connect"; Category = "Network Tools" }
    "Tailscale"             = @{ Id = "Tailscale.Tailscale"; Name = "Tailscale Mesh VPN"; Category = "Network Tools" }
    "ZeroTier"              = @{ Id = "ZeroTier.ZeroTierOne"; Name = "ZeroTier One"; Category = "Network Tools" }

    # 9. Download Tools
    "qBittorrent"           = @{ Id = "qBittorrent.qBittorrent"; Name = "qBittorrent Client"; Category = "Download Tools" }
    "Free Download Manager" = @{ Id = "SoftDeluxe.FreeDownloadManager"; Name = "Free Download Manager"; Category = "Download Tools" }
    "IDM"                   = @{ Id = "Tonec.InternetDownloadManager"; Name = "Internet Download Manager"; Category = "Download Tools" }

    # 10. Database & Server
    "MySQL Workbench"       = @{ Id = "Oracle.MySQLWorkbench"; Name = "MySQL Workbench"; Category = "Database & Server" }
    "DBeaver"               = @{ Id = "dbeaver.dbeaver"; Name = "DBeaver Universal Database"; Category = "Database & Server" }
    "FileZilla"             = @{ Id = "FileZilla.FileZilla"; Name = "FileZilla FTP Client"; Category = "Database & Server" }
    "pgAdmin"               = @{ Id = "PostgreSQL.pgAdmin"; Name = "pgAdmin PostgreSQL"; Category = "Database & Server" }

    # 11. Web Browsers
    "Google Chrome"         = @{ Id = "Google.Chrome"; Name = "Google Chrome"; Category = "Web Browsers" }
    "Mozilla Firefox"       = @{ Id = "Mozilla.Firefox"; Name = "Mozilla Firefox"; Category = "Web Browsers" }
    "Microsoft Edge"        = @{ Id = "Microsoft.Edge"; Name = "Microsoft Edge"; Category = "Web Browsers" }
    "Brave"                 = @{ Id = "Brave.Brave"; Name = "Brave Browser"; Category = "Web Browsers" }
    "Opera"                 = @{ Id = "Opera.Opera"; Name = "Opera Browser"; Category = "Web Browsers" }

    # 12. Developer & Coding
    "VS Code"               = @{ Id = "Microsoft.VisualStudioCode"; Name = "Visual Studio Code"; Category = "Developer & Coding" }
    "Git"                   = @{ Id = "Git.Git"; Name = "Git for Windows"; Category = "Developer & Coding" }
    "Python"                = @{ Id = "Python.Python.3.14"; Name = "Python 3"; Category = "Developer & Coding" }
    "Node.js"               = @{ Id = "OpenJS.NodeJS.LTS"; Name = "Node.js (LTS)"; Category = "Developer & Coding" }

    # 13. Multimedia
    "VLC Media Player"      = @{ Id = "VideoLAN.VLC"; Name = "VLC Media Player"; Category = "Multimedia" }
    "Spotify"               = @{ Id = "Spotify.Spotify"; Name = "Spotify Music"; Category = "Multimedia" }
    "OBS Studio"            = @{ Id = "OBSProject.OBSStudio"; Name = "OBS Studio"; Category = "Multimedia" }
    "Audacity"              = @{ Id = "Audacity.Audacity"; Name = "Audacity Audio Editor"; Category = "Multimedia" }
    "HandBrake"             = @{ Id = "HandBrake.HandBrake"; Name = "HandBrake Video Transcoder"; Category = "Multimedia" }

    # 14. Utilities & Tools
    "7-Zip"                 = @{ Id = "7zip.7zip"; Name = "7-Zip Archiver"; Category = "Utilities & Tools" }
    "WinRAR"                = @{ Id = "RARLab.WinRAR"; Name = "WinRAR"; Category = "Utilities & Tools" }
    "Everything"            = @{ Id = "voidtools.Everything"; Name = "Everything Search"; Category = "Utilities & Tools" }
    "Microsoft PowerToys"   = @{ Id = "Microsoft.PowerToys"; Name = "Microsoft PowerToys"; Category = "Utilities & Tools" }
    "Rufus"                 = @{ Id = "Rufus.Rufus"; Name = "Rufus USB Creator"; Category = "Utilities & Tools" }
    "ShareX"                = @{ Id = "ShareX.ShareX"; Name = "ShareX Screen Capture"; Category = "Utilities & Tools" }
    "Avro Keyboard"         = @{ Id = "OmicronLab.Avro"; Name = "Avro Keyboard"; Category = "Utilities & Tools" }

    # 15. Communication
    "WhatsApp"              = @{ Id = "WhatsApp.WhatsApp"; Name = "WhatsApp Desktop"; Category = "Communication" }
    "Telegram"              = @{ Id = "Telegram.TelegramDesktop"; Name = "Telegram Desktop"; Category = "Communication" }
    "Discord"               = @{ Id = "Discord.Discord"; Name = "Discord"; Category = "Communication" }
    "Zoom"                  = @{ Id = "Zoom.Zoom"; Name = "Zoom Workplace"; Category = "Communication" }
    "Microsoft Teams"       = @{ Id = "Microsoft.Teams"; Name = "Microsoft Teams"; Category = "Communication" }

    # 16. Gaming
    "Steam"                 = @{ Id = "Valve.Steam"; Name = "Steam Client"; Category = "Gaming" }
    "Epic Games"            = @{ Id = "EpicGames.EpicGamesLauncher"; Name = "Epic Games Launcher"; Category = "Gaming" }
    "EA App"                = @{ Id = "ElectronicArts.EADesktop"; Name = "EA Desktop App"; Category = "Gaming" }
    "Ubisoft Connect"       = @{ Id = "Ubisoft.Connect"; Name = "Ubisoft Connect"; Category = "Gaming" }
    "Riot Client"           = @{ Id = "RiotGames.RiotClient"; Name = "Riot Client"; Category = "Gaming" }
    "Xbox"                  = @{ Id = "Microsoft.GamingApp"; Name = "Xbox App"; Category = "Gaming" }

    # 17. Security & Privacy
    "Bitwarden"             = @{ Id = "Bitwarden.Bitwarden"; Name = "Bitwarden Password Manager"; Category = "Security & Privacy" }
    "Malwarebytes"          = @{ Id = "Malwarebytes.Malwarebytes"; Name = "Malwarebytes Anti-Malware"; Category = "Security & Privacy" }
    "Proton VPN"            = @{ Id = "Proton.ProtonVPN"; Name = "Proton VPN"; Category = "Security & Privacy" }
}
$Script:PackageGroups = [ordered]@{
    "Office"         = @("Microsoft 365", "WPS Office", "LibreOffice", "Notepad++", "Adobe Acrobat Reader")
    "Cloud"          = @("Google Drive", "OneDrive", "Dropbox", "MEGA")
    "Remote"         = @("AnyDesk", "TeamViewer", "RustDesk", "PuTTY")
    "Graphics"       = @("Adobe Photoshop", "GIMP", "Paint.NET", "Inkscape")
    "AITools"        = @("ChatGPT", "Google Gemini", "Claude", "Microsoft Copilot", "Perplexity")
    "Backup"         = @("Macrium Reflect", "AOMEI Backupper", "EaseUS Todo Backup")
    "System"         = @("CPU-Z", "GPU-Z", "HWiNFO", "CrystalDiskInfo", "Speccy")
    "Network"        = @("WireGuard", "OpenVPN Connect", "Tailscale", "ZeroTier")
    "Downloads"      = @("qBittorrent", "Free Download Manager", "IDM")
    "Database"       = @("MySQL Workbench", "DBeaver", "FileZilla", "pgAdmin")
    "Browsers"       = @("Google Chrome", "Mozilla Firefox", "Microsoft Edge", "Brave", "Opera")
    "Developer"      = @("VS Code", "Git", "Python", "Node.js", "Notepad++")
    "Multimedia"     = @("VLC Media Player", "Spotify", "OBS Studio", "Audacity", "HandBrake")
    "Utilities"      = @("7-Zip", "WinRAR", "Everything", "Microsoft PowerToys", "Rufus", "ShareX", "Avro Keyboard")
    "Communication"  = @("WhatsApp", "Telegram", "Discord", "Zoom", "Microsoft Teams")
    "Gaming"         = @("Steam", "Epic Games", "EA App", "Ubisoft Connect", "Riot Client", "Xbox")
    "Security"       = @("Bitwarden", "Malwarebytes", "Proton VPN")
    "Essential"      = @("Google Chrome", "Mozilla Firefox", "Notepad++", "Python", "7-Zip", "VLC Media Player", "Avro Keyboard", "AnyDesk", "ChatGPT")
}
$Script:DnsPresets = [ordered]@{
    "1" = @{ Name = "Cloudflare DNS (1.1.1.1 / 1.0.0.1)"; Primary = "1.1.1.1"; Secondary = "1.0.0.1" }
    "2" = @{ Name = "Google Public DNS (8.8.8.8 / 8.8.4.4)"; Primary = "8.8.8.8"; Secondary = "8.8.4.4" }
    "3" = @{ Name = "Quad9 DNS (9.9.9.9 / 149.112.112.112)"; Primary = "9.9.9.9"; Secondary = "149.112.112.112" }
    "4" = @{ Name = "Automatic (DHCP - Restore Default)"; Primary = "DHCP"; Secondary = "" }
}

$Script:InstalledCache = @{}

# ============================================================================
# HELPER FUNCTIONS: UI & NOTIFICATIONS
# ============================================================================

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-InfoMessage {
    param([string]$Message)
    Write-Host "  [i]  $Message" -ForegroundColor Cyan
}

function Write-WarningMessage {
    param([string]$Message)
    Write-Host "  [!]  $Message" -ForegroundColor Yellow
}

function Write-ErrorMessage {
    param([string]$Message)
    Write-Host "  [x]  $Message" -ForegroundColor Red
}

function Write-SkipMessage {
    param([string]$Message)
    Write-Host "  [-]  $Message" -ForegroundColor DarkGray
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "  --- $Title ---" -ForegroundColor Cyan
    Write-Host ""
}

function Pause-Toolkit {
    Write-Host ""
    Write-Host "  Press any key to return to menu..." -ForegroundColor DarkGray -NoNewline
    [void][System.Console]::ReadKey($true)
    Write-Host ""
}

function Confirm-Action {
    param(
        [string]$Prompt = "Are you sure you want to proceed?",
        [string]$Warning = ""
    )
    if ($Warning) {
        Write-Host ""
        Write-Host "  WARNING: $Warning" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "  $Prompt [Y/N]: " -ForegroundColor Cyan -NoNewline
    $response = Read-Host
    if ($response -match "^[Yy]$") {
        return $true
    }
    Write-WarningMessage "Action cancelled by user."
    return $false
}

function Test-IsAdmin {
    try {
        $identity  = [Security.Principal.WindowsIdentity]::GetCurrent()
        $principal = New-Object Security.Principal.WindowsPrincipal($identity)
        return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    }
    catch {
        return $false
    }
}

function Request-Admin {
    param([string]$Reason = "This operation requires administrative privileges.")
    
    if (Test-IsAdmin) {
        return $true
    }

    Write-Host ""
    Write-WarningMessage $Reason
    Write-Host "  Administrator privileges are required." -ForegroundColor Yellow
    Write-Host "  Restart toolkit as Administrator? [Y/N]: " -ForegroundColor Cyan -NoNewline
    $answer = Read-Host

    if ($answer -match "^[Yy]$") {
        Write-InfoMessage "Elevating PowerShell session..."
        try {
            $launchCmd = "irm $Script:LauncherUrl | iex"
            Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `"$launchCmd`""
            Write-InfoMessage "Elevated session launched. You can close this window."
            Start-Sleep -Seconds 2
            exit
        }
        catch {
            Write-ErrorMessage "Elevation failed or was denied: $($_.Exception.Message)"
        }
    }
    return $false
}

# ============================================================================
# SYSTEM TELEMETRY & PROGRESS BAR ENGINE
# ============================================================================

function Get-SystemTelemetry {
    $telemetry = @{
        CpuPercent = 0
        RamUsedGb  = 0
        RamTotalGb = 0
        RamPercent = 0
        BatteryStr = "AC Power (Desktop)"
        OsBuild    = "Win 11"
    }
    
    try {
        # Quick CPU load sample
        $cpu = Get-CimInstance Win32_Processor -ErrorAction SilentlyContinue | Select-Object -ExpandProperty LoadPercentage -First 1
        if ($cpu -ne $null) { $telemetry.CpuPercent = [int]$cpu }
    } catch {}

    try {
        # RAM usage
        $os = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue
        if ($os) {
            $totalKb = $os.TotalVisibleMemorySize
            $freeKb  = $os.FreePhysicalMemory
            $usedKb  = $totalKb - $freeKb
            $telemetry.RamTotalGb = [math]::Round($totalKb / 1048576, 1)
            $telemetry.RamUsedGb  = [math]::Round($usedKb / 1048576, 1)
            $telemetry.RamPercent = [math]::Round(($usedKb / $totalKb) * 100)
            $telemetry.OsBuild    = "Build " + $os.BuildNumber
        }
    } catch {}

    try {
        # Battery status
        $battery = Get-CimInstance Win32_Battery -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($battery -and $battery.EstimatedChargeRemaining) {
            $telemetry.BatteryStr = "$($battery.EstimatedChargeRemaining)% " + (if ($battery.BatteryStatus -eq 2) { "⚡ Charging" } else { "🔋 Battery" })
        }
    } catch {}

    return $telemetry
}

function Show-CyberProgress {
    param(
        [int]$Current,
        [int]$Total,
        [string]$Activity = "Downloading & Installing Package",
        [string]$Status = "Processing...",
        [string]$ItemName = ""
    )
    if ($Total -le 0) { $Total = 1 }
    $percent = [math]::Min(100, [math]::Max(0, [math]::Round(($Current / $Total) * 100)))
    $barWidth = 24
    $filled = [math]::Round(($percent / 100) * $barWidth)
    $empty = $barWidth - $filled
    $barStr = ("=" * $filled) + (" " * $empty)

    Write-Host ""
    Write-Host "  [$barStr] $percent% ($Current of $Total) - $Activity" -ForegroundColor Cyan
    if ($ItemName) {
        Write-Host "  Target: $ItemName" -ForegroundColor White
    }
    if ($Status) {
        Write-Host "  Status: $Status" -ForegroundColor DarkGray
    }
}

# ============================================================================
# BANNER & REGULAR MAIN MENU
# ============================================================================

function Show-Banner {
    Clear-Host
    $isAdmin = Test-IsAdmin
    $adminStatus = if ($isAdmin) { "Elevated [Admin]" } else { "Restricted [User]" }
    $adminColor  = if ($isAdmin) { "Green" } else { "Yellow" }
    
    $telem = Get-SystemTelemetry

    # Polished Aesthetic Header Banner (Strict 76 characters width)
    Write-Host ""
    Write-Host "  ┌────────────────────────────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
    
    Write-Host "  │  " -NoNewline -ForegroundColor DarkCyan
    Write-Host "██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗" -NoNewline -ForegroundColor Cyan
    Write-Host "   WINDOWS TOOL KIT  " -NoNewline -ForegroundColor White
    Write-Host "  │" -ForegroundColor DarkCyan

    Write-Host "  │  " -NoNewline -ForegroundColor DarkCyan
    Write-Host "██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝" -NoNewline -ForegroundColor Cyan
    Write-Host "   v1.2.0 Minimalist " -NoNewline -ForegroundColor DarkGray
    Write-Host "  │" -ForegroundColor DarkCyan

    Write-Host "  │  " -NoNewline -ForegroundColor DarkCyan
    Write-Host "██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝ " -NoNewline -ForegroundColor Cyan
    Write-Host "   PowerShell Suite  " -NoNewline -ForegroundColor DarkGray
    Write-Host "  │" -ForegroundColor DarkCyan

    Write-Host "  │  " -NoNewline -ForegroundColor DarkCyan
    Write-Host "██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗ " -NoNewline -ForegroundColor Cyan
    Write-Host "   Remote Admin Tools" -NoNewline -ForegroundColor DarkGray
    Write-Host "  │" -ForegroundColor DarkCyan

    Write-Host "  │  " -NoNewline -ForegroundColor DarkCyan
    Write-Host "╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝" -NoNewline -ForegroundColor Cyan
    Write-Host "   Single-Window     " -NoNewline -ForegroundColor DarkGray
    Write-Host "  │" -ForegroundColor DarkCyan

    Write-Host "  ├────────────────────────────────────────────────────────────────────────┤" -ForegroundColor DarkCyan

    # Host & Session line (strictly 68 chars inside)
    $hostRaw = "$env:COMPUTERNAME ($env:USERNAME)"
    if ($hostRaw.Length -gt 28) { $hostRaw = $hostRaw.Substring(0, 25) + "..." }
    $hostFormatted = ("Host: " + $hostRaw).PadRight(35)
    $statusFormatted = ("Session: " + $adminStatus).PadLeft(33)

    Write-Host "  │  " -NoNewline -ForegroundColor DarkCyan
    Write-Host "$hostFormatted" -NoNewline -ForegroundColor White
    Write-Host "$statusFormatted" -NoNewline -ForegroundColor $adminColor
    Write-Host "  │" -ForegroundColor DarkCyan

    # Telemetry line
    $cpuStr  = "CPU: $($telem.CpuPercent)%"
    $ramStr  = "RAM: $($telem.RamUsedGb)/$($telem.RamTotalGb) GB ($($telem.RamPercent)%)"
    $osStr   = "$($telem.OsBuild)"
    $tCombined = "$cpuStr  │  $ramStr  │  $osStr"
    if ($tCombined.Length -gt 68) { $tCombined = $tCombined.Substring(0, 65) + "..." }
    $tPadded = $tCombined.PadRight(68)

    Write-Host "  │  " -NoNewline -ForegroundColor DarkCyan
    Write-Host "$tPadded" -NoNewline -ForegroundColor Yellow
    Write-Host "  │" -ForegroundColor DarkCyan

    Write-Host "  └────────────────────────────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
    Write-Host ""
}

function Show-ModuleHeader {
    param(
        [string]$ModuleTitle,
        [string]$Subtitle
    )
    # Strip any emojis so terminal character cell widths are exact ASCII
    $cleanTitle = ($ModuleTitle -replace "[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]", "").Trim()
    if ($cleanTitle.Length -gt 68) { $cleanTitle = $cleanTitle.Substring(0, 65) + "..." }
    $titlePadded = $cleanTitle.PadRight(68)

    $cleanSub = ($Subtitle -replace "[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]", "").Trim()
    if ($cleanSub.Length -gt 68) { $cleanSub = $cleanSub.Substring(0, 65) + "..." }
    $subPadded = $cleanSub.PadRight(68)

    Write-Host "  ┌────────────────────────────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
    Write-Host "  │  $titlePadded  │" -ForegroundColor Cyan
    Write-Host "  │  $subPadded  │" -ForegroundColor DarkGray
    Write-Host "  └────────────────────────────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
    Write-Host ""
}

function Show-OptionTable {
    param(
        [array]$Options,
        [string]$PromptRange = ""
    )
    Write-Host "  ┌──────┬────────────────────────────┬────────────────────────────────────┐" -ForegroundColor DarkCyan
    Write-Host "  │ NUM  │ FEATURE / OPTION           │ DESCRIPTION                        │" -ForegroundColor Cyan
    Write-Host "  ├──────┼────────────────────────────┼────────────────────────────────────┤" -ForegroundColor DarkCyan
    foreach ($opt in $Options) {
        $numStr = "[$($opt.Num)]".PadRight(4)
        
        $featStr = if ($opt.Title) { $opt.Title } elseif ($opt.Feature) { $opt.Feature } else { "" }
        $descStr = if ($opt.Desc) { $opt.Desc } elseif ($opt.Description) { $opt.Description } else { "" }
        
        if (-not $featStr -and $opt.Text) {
            $rawText = ($opt.Text -replace "[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]", "").Trim()
            if ($rawText -match "^(.+?)\s*[:(–—-–]\s*(.+?)\)?$") {
                $featStr = $Matches[1].Trim()
                $descStr = $Matches[2].Trim()
            } else {
                $featStr = $rawText
                $descStr = "Execute system optimization"
            }
        }

        # Truncate and pad strictly to exact column widths
        if ($featStr.Length -gt 26) { $featStr = $featStr.Substring(0, 23) + "..." }
        $featPadded = $featStr.PadRight(26)

        if ($descStr.Length -gt 34) { $descStr = $descStr.Substring(0, 31) + "..." }
        $descPadded = $descStr.PadRight(34)

        Write-Host "  │ $numStr │ $featPadded │ $descPadded │" -ForegroundColor White
    }
    Write-Host "  └──────┴────────────────────────────┴────────────────────────────────────┘" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  [0] Return to Main Dashboard" -ForegroundColor DarkGray
    Write-Host ""
    if ($PromptRange) {
        Write-Host "  Select an option [$PromptRange]: " -ForegroundColor Cyan -NoNewline
    }
}

function Show-MainMenu {
    Show-Banner
    Write-Host "  ┌──────┬────────────────────────────┬────────────────────────────────────┐" -ForegroundColor DarkCyan
    Write-Host "  │ NUM  │ MODULE                     │ DESCRIPTION & CAPABILITIES         │" -ForegroundColor Cyan
    Write-Host "  ├──────┼────────────────────────────┼────────────────────────────────────┤" -ForegroundColor DarkCyan
    Write-Host "  │ [01] │ Software Installer         │ Curated apps across 9 domains      │" -ForegroundColor White
    Write-Host "  │ [02] │ Debloat & Privacy          │ Disable telemetry, Bing & bloat    │" -ForegroundColor White
    Write-Host "  │ [03] │ Performance & Gaming       │ Ultimate power plan & Game DVR     │" -ForegroundColor White
    Write-Host "  │ [04] │ Safety & Restore           │ Restore points, ports & Defender   │" -ForegroundColor White
    Write-Host "  │ [05] │ Developer Tools            │ WSL2, Windows Sandbox, Hyper-V     │" -ForegroundColor White
    Write-Host "  │ [06] │ Battery & Power            │ Health analytics & power reports   │" -ForegroundColor White
    Write-Host "  │ [07] │ Windows System Repair      │ SFC scannow, DISM & Update fix     │" -ForegroundColor White
    Write-Host "  │ [08] │ Disk Cleanup & Storage     │ Temp cleaner, top files & TRIM     │" -ForegroundColor White
    Write-Host "  │ [09] │ Network Diagnostics        │ Ping test, DNS switcher & flush    │" -ForegroundColor White
    Write-Host "  │ [10] │ System Info & Utilities    │ Hardware specs, license & tools    │" -ForegroundColor White
    Write-Host "  │ [11] │ Quick Actions              │ Instant DNS flush & Explorer fix   │" -ForegroundColor White
    Write-Host "  │ [12] │ App Uninstaller            │ Batch clean uninstall & wipe       │" -ForegroundColor White
    Write-Host "  └──────┴────────────────────────────┴────────────────────────────────────┘" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  [0] Exit Toolkit" -ForegroundColor DarkGray
    Write-Host ""
}

# ============================================================================
# MODULE 1: SOFTWARE SELECTOR & INSTALLER (WITH CHECKBOXES & FINAL CONFIRMATION)
# ============================================================================

function Get-WingetPath {
    $cmd = Get-Command winget -ErrorAction SilentlyContinue
    if ($cmd) { return "winget" }

    $localPath = "$env:LOCALAPPDATA\Microsoft\WindowsApps\winget.exe"
    if (Test-Path $localPath) { return $localPath }

    $progPath = Get-ChildItem -Path "$env:ProgramFiles\WindowsApps\Microsoft.DesktopAppInstaller_*_x64__8wekyb3d8bbwe\winget.exe" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName -First 1
    if ($progPath -and (Test-Path $progPath)) { return $progPath }

    return "winget"
}

function Test-Winget {
    $wingetExe = Get-WingetPath
    $cmd = Get-Command $wingetExe -ErrorAction SilentlyContinue
    if (-not $cmd -and -not (Test-Path $wingetExe)) {
        Write-ErrorMessage "Winget package manager is not detected on this system."
        Write-InfoMessage "Please install App Installer from Microsoft Store or GitHub:"
        Write-InfoMessage "https://github.com/microsoft/winget-cli/releases"
        return $false
    }
    return $true
}

$Script:RegistryAppsCache = $null

function Initialize-InstalledAppsCache {
    if ($Script:RegistryAppsCache -ne $null) { return }

    $apps = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

    # 1. Scan 64-bit and 32-bit Machine & User Registry Uninstall paths
    $regPaths = @(
        "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*"
    )

    # 2. Add all user hives under HKEY_USERS (critical when elevated as Administrator)
    try {
        $userProfiles = Get-ChildItem Registry::HKEY_USERS -ErrorAction SilentlyContinue | 
            Where-Object { $_.PSChildName -match "^S-1-5-21-" -and $_.PSChildName -notmatch "_Classes$" }
        foreach ($u in $userProfiles) {
            $regPaths += "Registry::HKEY_USERS\$($u.PSChildName)\Software\Microsoft\Windows\CurrentVersion\Uninstall\*"
        }
    } catch {}

    foreach ($rp in $regPaths) {
        try {
            $keys = Get-ItemProperty $rp -ErrorAction SilentlyContinue
            if ($keys) {
                foreach ($k in $keys) {
                    if ($k.DisplayName) { [void]$apps.Add($k.DisplayName.Trim()) }
                    if ($k.PSChildName) { [void]$apps.Add($k.PSChildName.Trim()) }
                }
            }
        } catch {}
    }

    # 3. Add installed Appx/UWP application package names
    try {
        $appx = Get-AppxPackage -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
        if ($appx) {
            foreach ($a in $appx) { [void]$apps.Add($a) }
        }
    } catch {}

    $Script:RegistryAppsCache = $apps
}

function Get-InstalledPackage {
    param(
        [string]$PackageId,
        [string]$PackageName = ""
    )

    if ([string]::IsNullOrWhiteSpace($PackageId)) { return $false }

    if ($Script:InstalledCache.ContainsKey($PackageId)) {
        return $Script:InstalledCache[$PackageId]
    }

    # Layer 1: Query In-Memory Registry & Appx Cache (Instant, 0.001s, Never Blocks)
    Initialize-InstalledAppsCache
    if ($Script:RegistryAppsCache -and $Script:RegistryAppsCache.Count -gt 0) {
        if ($Script:RegistryAppsCache.Contains($PackageId) -or 
            ($PackageName -and $Script:RegistryAppsCache.Contains($PackageName))) {
            $Script:InstalledCache[$PackageId] = $true
            return $true
        }

        # Targeted pattern match against registered display names
        $matched = $false
        foreach ($regApp in $Script:RegistryAppsCache) {
            switch -Wildcard ($PackageId) {
                "Google.Chrome*"              { if ($regApp -match "(?i)Google Chrome") { $matched = $true } }
                "Mozilla.Firefox*"            { if ($regApp -match "(?i)Mozilla Firefox") { $matched = $true } }
                "Microsoft.Edge*"             { if ($regApp -match "(?i)Microsoft Edge") { $matched = $true } }
                "Brave.Brave*"                { if ($regApp -match "(?i)Brave") { $matched = $true } }
                "Opera.Opera*"                { if ($regApp -match "(?i)Opera\b") { $matched = $true } }
                "Microsoft.VisualStudioCode*" { if ($regApp -match "(?i)Visual Studio Code") { $matched = $true } }
                "Git.Git*"                    { if ($regApp -match "(?i)\bGit\b") { $matched = $true } }
                "Python.Python*"              { if ($regApp -match "(?i)Python\s+\d") { $matched = $true } }
                "OpenJS.NodeJS*"              { if ($regApp -match "(?i)Node\.js") { $matched = $true } }
                "Notepad++.Notepad++*"        { if ($regApp -match "(?i)Notepad\+\+") { $matched = $true } }
                "VideoLAN.VLC*"               { if ($regApp -match "(?i)VLC") { $matched = $true } }
                "Spotify.Spotify*"            { if ($regApp -match "(?i)Spotify") { $matched = $true } }
                "OBSProject.OBSStudio*"       { if ($regApp -match "(?i)OBS Studio") { $matched = $true } }
                "Audacity.Audacity*"          { if ($regApp -match "(?i)Audacity") { $matched = $true } }
                "HandBrake.HandBrake*"        { if ($regApp -match "(?i)HandBrake") { $matched = $true } }
                "7zip.7zip*"                  { if ($regApp -match "(?i)7-Zip") { $matched = $true } }
                "RARLab.WinRAR*"              { if ($regApp -match "(?i)WinRAR") { $matched = $true } }
                "voidtools.Everything*"       { if ($regApp -match "(?i)Everything\b") { $matched = $true } }
                "Microsoft.PowerToys*"        { if ($regApp -match "(?i)PowerToys") { $matched = $true } }
                "Rufus.Rufus*"                { if ($regApp -match "(?i)Rufus") { $matched = $true } }
                "ShareX.ShareX*"              { if ($regApp -match "(?i)ShareX") { $matched = $true } }
                "OmicronLab.Avro*"            { if ($regApp -match "(?i)Avro") { $matched = $true } }
                "WhatsApp.WhatsApp*"          { if ($regApp -match "(?i)WhatsApp") { $matched = $true } }
                "Telegram.TelegramDesktop*"   { if ($regApp -match "(?i)Telegram") { $matched = $true } }
                "Discord.Discord*"            { if ($regApp -match "(?i)Discord") { $matched = $true } }
                "Zoom.Zoom*"                  { if ($regApp -match "(?i)Zoom") { $matched = $true } }
                "Microsoft.Teams*"            { if ($regApp -match "(?i)Microsoft Teams") { $matched = $true } }
                "Valve.Steam*"                { if ($regApp -match "(?i)Steam\b") { $matched = $true } }
                "EpicGames.EpicGamesLauncher*"{ if ($regApp -match "(?i)Epic Games") { $matched = $true } }
                "ElectronicArts.EADesktop*"   { if ($regApp -match "(?i)EA (Desktop|App)") { $matched = $true } }
                "Ubisoft.Connect*"            { if ($regApp -match "(?i)Ubisoft") { $matched = $true } }
                "RiotGames.RiotClient*"       { if ($regApp -match "(?i)Riot") { $matched = $true } }
                "Microsoft.GamingApp*"        { if ($regApp -match "(?i)Xbox") { $matched = $true } }
                "Bitwarden.Bitwarden*"        { if ($regApp -match "(?i)Bitwarden") { $matched = $true } }
                "Malwarebytes.Malwarebytes*"  { if ($regApp -match "(?i)Malwarebytes") { $matched = $true } }
                "Proton.ProtonVPN*"           { if ($regApp -match "(?i)Proton") { $matched = $true } }
                "AnyDeskSoftwareGmbH.AnyDesk*"{ if ($regApp -match "(?i)AnyDesk") { $matched = $true } }
                "UltraViewer.UltraViewer*"    { if ($regApp -match "(?i)UltraViewer") { $matched = $true } }
                "TeamViewer.TeamViewer*"      { if ($regApp -match "(?i)TeamViewer") { $matched = $true } }
                "RustDesk.RustDesk*"          { if ($regApp -match "(?i)RustDesk") { $matched = $true } }
                "PuTTY.PuTTY*"                { if ($regApp -match "(?i)PuTTY") { $matched = $true } }
                "WinSCP.WinSCP*"              { if ($regApp -match "(?i)WinSCP") { $matched = $true } }
                "Microsoft.Office*"           { if ($regApp -match "(?i)Microsoft (Office|365)") { $matched = $true } }
                "TheDocumentFoundation.LibreOffice*" { if ($regApp -match "(?i)LibreOffice") { $matched = $true } }
                "Adobe.Acrobat.Reader*"       { if ($regApp -match "(?i)Adobe Acrobat") { $matched = $true } }
                "Notion.Notion*"              { if ($regApp -match "(?i)Notion") { $matched = $true } }
                default {
                    if ($PackageName -and $regApp -match [regex]::Escape($PackageName)) { $matched = $true }
                }
            }
            if ($matched) {
                $Script:InstalledCache[$PackageId] = $true
                return $true
            }
        }
    }

    # Layer 2: Common Executable & Command Detection (Instant Local Disk Check, 0.0001s)
    $installedByPath = switch -Wildcard ($PackageId) {
        "Google.Chrome*"              { (Test-Path "$env:ProgramFiles\Google\Chrome\Application\chrome.exe") -or (Test-Path "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe") -or (Test-Path "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe") }
        "Mozilla.Firefox*"            { (Test-Path "$env:ProgramFiles\Mozilla Firefox\firefox.exe") -or (Test-Path "${env:ProgramFiles(x86)}\Mozilla Firefox\firefox.exe") }
        "Microsoft.Edge*"             { (Test-Path "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe") -or (Test-Path "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") }
        "Brave.Brave*"                { (Test-Path "$env:ProgramFiles\BraveSoftware\Brave-Browser\Application\brave.exe") -or (Test-Path "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe") }
        "Opera.Opera*"                { (Test-Path "$env:LOCALAPPDATA\Programs\Opera\opera.exe") -or (Test-Path "$env:ProgramFiles\Opera\opera.exe") }
        "Microsoft.VisualStudioCode*" { (Test-Path "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe") -or (Test-Path "$env:ProgramFiles\Microsoft VS Code\Code.exe") }
        "Git.Git*"                    { [bool](Get-Command git -ErrorAction SilentlyContinue) -or (Test-Path "$env:ProgramFiles\Git\cmd\git.exe") -or (Test-Path "${env:ProgramFiles(x86)}\Git\cmd\git.exe") }
        "Python.Python*"              { [bool](Get-Command python -ErrorAction SilentlyContinue) -or (Test-Path "$env:LOCALAPPDATA\Programs\Python") }
        "OpenJS.NodeJS*"              { [bool](Get-Command node -ErrorAction SilentlyContinue) -or (Test-Path "$env:ProgramFiles\nodejs\node.exe") }
        "Notepad++.Notepad++*"        { (Test-Path "$env:ProgramFiles\Notepad++\notepad++.exe") -or (Test-Path "${env:ProgramFiles(x86)}\Notepad++\notepad++.exe") }
        "VideoLAN.VLC*"               { (Test-Path "$env:ProgramFiles\VideoLAN\VLC\vlc.exe") -or (Test-Path "${env:ProgramFiles(x86)}\VideoLAN\VLC\vlc.exe") }
        "Spotify.Spotify*"            { (Test-Path "$env:APPDATA\Spotify\Spotify.exe") -or (Test-Path "$env:LOCALAPPDATA\Microsoft\WindowsApps\Spotify.exe") }
        "7zip.7zip*"                  { (Test-Path "$env:ProgramFiles\7-Zip\7z.exe") -or (Test-Path "${env:ProgramFiles(x86)}\7-Zip\7z.exe") }
        "RARLab.WinRAR*"              { (Test-Path "$env:ProgramFiles\WinRAR\WinRAR.exe") -or (Test-Path "${env:ProgramFiles(x86)}\WinRAR\WinRAR.exe") }
        "voidtools.Everything*"       { (Test-Path "$env:ProgramFiles\Everything\Everything.exe") -or (Test-Path "${env:ProgramFiles(x86)}\Everything\Everything.exe") }
        "OmicronLab.Avro*"            { (Test-Path "$env:ProgramFiles\Avro Keyboard\Avro Keyboard.exe") -or (Test-Path "${env:ProgramFiles(x86)}\Avro Keyboard\Avro Keyboard.exe") }
        "WhatsApp.WhatsApp*"          { (Test-Path "$env:LOCALAPPDATA\WhatsApp\WhatsApp.exe") }
        "Telegram.TelegramDesktop*"   { (Test-Path "$env:APPDATA\Telegram Desktop\Telegram.exe") }
        "Discord.Discord*"            { (Test-Path "$env:LOCALAPPDATA\Discord\Update.exe") }
        "Valve.Steam*"                { (Test-Path "${env:ProgramFiles(x86)}\Steam\steam.exe") -or (Test-Path "$env:ProgramFiles\Steam\steam.exe") }
        "AnyDeskSoftwareGmbH.AnyDesk*"{ (Test-Path "${env:ProgramFiles(x86)}\AnyDesk\AnyDesk.exe") -or (Test-Path "$env:ProgramFiles\AnyDesk\AnyDesk.exe") }
        "UltraViewer.UltraViewer*"    { (Test-Path "${env:ProgramFiles(x86)}\UltraViewer\UltraViewer_Desktop.exe") -or (Test-Path "$env:ProgramFiles\UltraViewer\UltraViewer_Desktop.exe") }
        "PuTTY.PuTTY*"                { (Test-Path "$env:ProgramFiles\PuTTY\putty.exe") -or (Test-Path "${env:ProgramFiles(x86)}\PuTTY\putty.exe") }
        "WinSCP.WinSCP*"              { (Test-Path "${env:ProgramFiles(x86)}\WinSCP\WinSCP.exe") -or (Test-Path "$env:ProgramFiles\WinSCP\WinSCP.exe") }
        default { $false }
    }
    if ($installedByPath) {
        $Script:InstalledCache[$PackageId] = $true
        return $true
    }

    # If not found in Registry, Appx, or Local Disk, it is not installed.
    # Completely non-blocking: never invokes external winget list processes in the loop!
    $Script:InstalledCache[$PackageId] = $false
    return $false
}
function Show-SoftwareSelector {
    param(
        [string[]]$PackageKeys,
        [string]$GroupTitle = "Software Selector"
    )

    if (-not (Test-Winget)) {
        Pause-Toolkit
        return
    }

    Show-Banner
    Write-Host "  --- SOFTWARE SELECTOR: $GroupTitle ---" -ForegroundColor Cyan
    Write-Host ""
    Write-InfoMessage "Scanning system status and preparing application catalog..."
    Write-Host ""

    $appsData = @()
    $idx = 1

    Write-Host "  ┌────┬───────┬───────────┬──────────────────────┬──────────────────────┐" -ForegroundColor DarkCyan
    Write-Host "  │ #  │ STATE │ STATUS    │ APPLICATION NAME     │ WINGET PACKAGE ID    │" -ForegroundColor Cyan
    Write-Host "  ├────┼───────┼───────────┼──────────────────────┼──────────────────────┤" -ForegroundColor DarkCyan

    foreach ($key in $PackageKeys) {
        if ($Script:SoftwareCatalog.Contains($key)) {
            $pkg = $Script:SoftwareCatalog[$key]
            $isInstalled = Get-InstalledPackage -PackageId $pkg.Id -PackageName $pkg.Name
            
            $boxSymbol  = if ($isInstalled) { "[OK]" } else { "[ ]" }
            $boxColor   = if ($isInstalled) { "DarkGray" } else { "Yellow" }
            $statusText = if ($isInstalled) { "Installed" } else { "Available" }
            $statusColor = if ($isInstalled) { "Green" } else { "Cyan" }
            
            $numPad = "[$idx]".PadRight(3)
            $statePad = $boxSymbol.PadRight(5)
            $statPad = $statusText.PadRight(9)
            $namePad = $pkg.Name
            if ($namePad.Length -gt 20) { $namePad = $namePad.Substring(0, 17) + "..." }
            $namePad = $namePad.PadRight(20)

            $idPad = $pkg.Id
            if ($idPad.Length -gt 20) { $idPad = $idPad.Substring(0, 17) + "..." }
            $idPad = $idPad.PadRight(20)

            Write-Host "  │ $numPad│ " -NoNewline -ForegroundColor Cyan
            Write-Host "$statePad" -NoNewline -ForegroundColor $boxColor
            Write-Host " │ " -NoNewline -ForegroundColor DarkCyan
            Write-Host "$statPad" -NoNewline -ForegroundColor $statusColor
            Write-Host " │ $namePad │ $idPad │" -ForegroundColor White

            $appsData += [PSCustomObject]@{
                Index       = $idx
                Key         = $key
                Name        = $pkg.Name
                Id          = $pkg.Id
                IsInstalled = $isInstalled
            }
            $idx++
        }
    }
    Write-Host "  └────┴───────┴───────────┴──────────────────────┴──────────────────────┘" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  [M]    Mouse Mode: Open Interactive Checkbox Selection Window" -ForegroundColor Cyan
    Write-Host "  [1..N] Keyboard Mode: Type app numbers separated by commas (e.g. 1, 3, 5)" -ForegroundColor White
    Write-Host "  [A]    Select All: Install all available uninstalled applications" -ForegroundColor Green
    Write-Host "  [0]    Cancel: Return to software menu" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  Enter choice [M, Numbers, or A for All]: " -ForegroundColor Cyan -NoNewline
    $inputRaw = Read-Host

    if ([string]::IsNullOrWhiteSpace($inputRaw) -or $inputRaw -eq "0") {
        Write-Host ""
        Write-InfoMessage "No applications selected. Returning to menu."
        Pause-Toolkit
        return
    }

    $selectedApps = @()

    if ($inputRaw.Trim().ToUpper() -in @("M", "MOUSE", "GUI")) {
        Write-InfoMessage "Launching Interactive Mouse Checkbox Window..."
        try {
            $gridItems = $appsData | Select-Object @{Name='Select';Expression={$_.Index}}, Name, @{Name='Status';Expression={if ($_.IsInstalled) {'Installed'} else {'Available'}}}, @{Name='PackageID';Expression={$_.Id}}
            $guiSelected = $gridItems | Out-GridView -Title "Software Installer — Select Applications & Click OK" -PassThru
            if ($guiSelected) {
                foreach ($item in $guiSelected) {
                    $match = $appsData | Where-Object { $_.Index -eq $item.Select }
                    if ($match) { $selectedApps += $match }
                }
            }
        } catch {
            Write-ErrorMessage "Mouse Grid failed to open: $($_.Exception.Message)"
        }
    } elseif ($inputRaw.Trim().ToUpper() -in @("A", "ALL")) {
        $selectedApps = $appsData | Where-Object { -not $_.IsInstalled }
        if ($selectedApps.Count -eq 0) {
            Write-Success "All applications in this list are already installed on this machine!"
            Pause-Toolkit
            return
        }
    } else {
        $numbers = [regex]::Split($inputRaw, "[,\s]+") | Where-Object { $_ -match "^\d+$" } | ForEach-Object { [int]$_ }
        foreach ($n in $numbers) {
            $match = $appsData | Where-Object { $_.Index -eq $n }
            if ($match -and ($selectedApps -notcontains $match)) {
                $selectedApps += $match
            }
        }
    }

    if ($selectedApps.Count -eq 0) {
        Write-WarningMessage "No applications were selected. Returning to menu."
        Pause-Toolkit
        return
    }

    # Final Minimal Confirmation Screen (Strict 76 characters)
    Show-Banner
    Write-Host "  ┌────────────────────────────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
    Write-Host "  │  INSTALLATION CONFIRMATION                                             │" -ForegroundColor Cyan
    Write-Host "  ├────────────────────────────────────────────────────────────────────────┤" -ForegroundColor DarkCyan
    foreach ($item in $selectedApps) {
        $nameLine = "$($item.Name) ($($item.Id))"
        if ($nameLine.Length -gt 63) { $nameLine = $nameLine.Substring(0, 60) + "..." }
        $line = "  │  [+] " + $nameLine.PadRight(64) + "│"
        Write-Host $line -ForegroundColor White
    }
    Write-Host "  ├────────────────────────────────────────────────────────────────────────┤" -ForegroundColor DarkCyan
    $totalLine = "Total: $($selectedApps.Count) application(s) queued for download & install."
    Write-Host ("  │  " + $totalLine.PadRight(68) + "  │") -ForegroundColor DarkGray
    Write-Host "  └────────────────────────────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  Proceed with installation in current window? [Y/N]: " -ForegroundColor Green -NoNewline
    $finalProceed = Read-Host

    if ($finalProceed -notmatch "^[Yy]$") {
        Write-Host ""
        Write-InfoMessage "Installation aborted by user. Zero changes made to system."
        Pause-Toolkit
        return
    }

    Write-Host ""
    Write-Section "Winget Engine: Deploying $($selectedApps.Count) Applications"

    $successCount = 0
    $skipCount    = 0
    $failCount    = 0
    $totalApps    = $selectedApps.Count
    $currentIdx   = 0

    $wingetCmd = Get-WingetPath

    foreach ($item in $selectedApps) {
        $currentIdx++
        Show-CyberProgress -Current $currentIdx -Total $totalApps -Activity "Software Deployment" -Status "Downloading & Installing $($item.Name)..." -ItemName "$($item.Name) [$($item.Id)]"
        
        $isInstalled = Get-InstalledPackage -PackageId $item.Id -PackageName $item.Name
        if ($isInstalled) {
            Write-SkipMessage "$($item.Name) - Already installed"
            $skipCount++
            continue
        }

        try {
            # Execute winget directly in the CURRENT console session without spawning secondary windows
            $process = Start-Process -FilePath $wingetCmd `
                -ArgumentList @("install", "--id", "$($item.Id)", "-e", "--accept-package-agreements", "--accept-source-agreements", "--disable-interactivity") `
                -NoNewWindow -Wait -PassThru

            if ($process.ExitCode -eq 0) {
                Write-Success "$($item.Name) - Installed successfully!"
                $Script:InstalledCache[$item.Id] = $true
                $successCount++
            } else {
                # Verify installation in case Winget returned a non-zero code but installed successfully
                Start-Sleep -Seconds 1
                $verified = Get-InstalledPackage -PackageId $item.Id -PackageName $item.Name
                if ($verified) {
                    Write-Success "$($item.Name) - Verified installed!"
                    $Script:InstalledCache[$item.Id] = $true
                    $successCount++
                } else {
                    Write-ErrorMessage "$($item.Name) - Installation failed (Exit code: $($process.ExitCode))"
                    $failCount++
                }
            }
        }
        catch {
            Write-ErrorMessage "$($item.Name) - Error: $($_.Exception.Message)"
            $failCount++
        }
    }

    Write-Host ""
    Write-Host "  --- INSTALLATION SUMMARY ---" -ForegroundColor Cyan
    Write-Host "  Successful : $successCount" -ForegroundColor Green
    Write-Host "  Skipped    : $skipCount" -ForegroundColor DarkGray
    Write-Host "  Failed     : $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
    Pause-Toolkit
}

function Show-SoftwareMenu {
    $options = @(
        @{ Num = "1";  Title = "Office & Productivity";Desc = "Microsoft 365, WPS Office, LibreOffice" }
        @{ Num = "2";  Title = "Cloud & Storage";      Desc = "Google Drive, OneDrive, Dropbox, MEGA" }
        @{ Num = "3";  Title = "Remote Access";        Desc = "AnyDesk, TeamViewer, RustDesk, PuTTY" }
        @{ Num = "4";  Title = "Graphics & Design";    Desc = "Photoshop, GIMP, Paint.NET, Inkscape" }
        @{ Num = "5";  Title = "AI Tools Suite";       Desc = "ChatGPT, Gemini, Claude, Copilot" }
        @{ Num = "6";  Title = "Backup & Recovery";    Desc = "Macrium Reflect, AOMEI, EaseUS" }
        @{ Num = "7";  Title = "System & Hardware";    Desc = "CPU-Z, GPU-Z, HWiNFO, CrystalDiskInfo" }
        @{ Num = "8";  Title = "Network Tools";        Desc = "WireGuard, OpenVPN, Tailscale, ZeroTier" }
        @{ Num = "9";  Title = "Download Tools";       Desc = "qBittorrent, FDM, IDM accelerator" }
        @{ Num = "10"; Title = "Database & Server";    Desc = "DBeaver, MySQL Workbench, FileZilla" }
        @{ Num = "11"; Title = "Web Browsers";         Desc = "Chrome, Firefox, Edge, Brave, Opera" }
        @{ Num = "12"; Title = "Developer & Coding";   Desc = "VS Code, Git, Python, Node.js" }
        @{ Num = "13"; Title = "Multimedia Creators";  Desc = "VLC, Spotify, OBS Studio, HandBrake" }
        @{ Num = "14"; Title = "Utilities & Tools";    Desc = "7-Zip, WinRAR, Everything, PowerToys" }
        @{ Num = "15"; Title = "Communication";        Desc = "WhatsApp, Telegram, Discord, Teams" }
        @{ Num = "16"; Title = "Gaming Launchers";     Desc = "Steam, Epic Games, EA, Ubisoft, Xbox" }
        @{ Num = "17"; Title = "Security & Privacy";   Desc = "Bitwarden, Malwarebytes, Proton VPN" }
        @{ Num = "18"; Title = "Essential Quick Pack"; Desc = "Curated standard pack for fresh PC" }
        @{ Num = "19"; Title = "Complete Catalog";     Desc = "Browse all verified software packages" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 1: SOFTWARE INSTALLER (WINGET APPLICATION CATALOG)" -Subtitle "Interactive Selection • Zero Auto-Install • Single-Window Deployment"
        Show-OptionTable -Options $options -PromptRange "0-19"
        $choice = Read-Host

        switch ($choice) {
            "1"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Office"] -GroupTitle "Office & Productivity" }
            "2"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Cloud"] -GroupTitle "Cloud & Storage" }
            "3"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Remote"] -GroupTitle "Remote Access" }
            "4"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Graphics"] -GroupTitle "Graphics & Design" }
            "5"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["AITools"] -GroupTitle "AI Tools" }
            "6"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Backup"] -GroupTitle "Backup & Recovery" }
            "7"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["System"] -GroupTitle "System & Hardware" }
            "8"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Network"] -GroupTitle "Network Tools" }
            "9"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Downloads"] -GroupTitle "Download Tools" }
            "10" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Database"] -GroupTitle "Database & Server" }
            "11" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Browsers"] -GroupTitle "Web Browsers" }
            "12" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Developer"] -GroupTitle "Developer & Coding" }
            "13" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Multimedia"] -GroupTitle "Multimedia" }
            "14" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Utilities"] -GroupTitle "Utilities & Tools" }
            "15" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Communication"] -GroupTitle "Communication" }
            "16" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Gaming"] -GroupTitle "Gaming Launchers" }
            "17" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Security"] -GroupTitle "Security & Privacy" }
            "18" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Essential"] -GroupTitle "Essential Quick Pack" }
            "19" { Show-SoftwareSelector -PackageKeys @($Script:SoftwareCatalog.Keys) -GroupTitle "Complete Software Catalog" }
        }
    } while ($choice -ne "0")
}

function Show-DebloatMenu {
    $options = @(
        @{ Num = "1"; Title = "Disable Telemetry";     Desc = "Stop DiagTrack & diagnostic tracking" }
        @{ Num = "2"; Title = "Disable Bing in Start"; Desc = "Instant local search without web lag" }
        @{ Num = "3"; Title = "Classic Context Menu";  Desc = "Restore Win 10 full right-click menu" }
        @{ Num = "4"; Title = "Modern Context Menu";   Desc = "Revert to default Windows 11 style" }
        @{ Num = "5"; Title = "Disable Cortana";       Desc = "Turn off Cortana voice search daemon" }
        @{ Num = "6"; Title = "Disable Activity Feed"; Desc = "Disable activity history & ad tracking" }
        @{ Num = "7"; Title = "Remove Bloatware UWP";  Desc = "Purge Feedback, Tips, Maps, Weather" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 2: DEBLOAT & PRIVACY HARDENING" -Subtitle "Fine-tune Windows tracking, telemetry, and unwanted modern OS clutter."
        Show-OptionTable -Options $options -PromptRange "0-7"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                if (-not (Request-Admin "Disabling telemetry requires administrative privileges.")) { break }
                if (Confirm-Action "Disable diagnostic telemetry services?") {
                    Write-InfoMessage "Disabling Telemetry and Diagnostics Tracking Service (DiagTrack)..."
                    Stop-Service "DiagTrack" -Force -ErrorAction SilentlyContinue
                    Set-Service "DiagTrack" -StartupType Disabled -ErrorAction SilentlyContinue
                    Stop-Service "dmwappushservice" -Force -ErrorAction SilentlyContinue
                    Set-Service "dmwappushservice" -StartupType Disabled -ErrorAction SilentlyContinue

                    # Registry Telemetry Level 0
                    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "AllowTelemetry" -Type DWord -Value 0 -Force
                    Write-Success "Telemetry tracking services disabled successfully."
                }
                Pause-Toolkit
            }
            "2" {
                if (Confirm-Action "Disable Bing search and web suggestions in Start Menu?") {
                    Write-InfoMessage "Setting registry to disable web search in Start..."
                    $searchPath = "HKCU:\Software\Policies\Microsoft\Windows\Explorer"
                    if (-not (Test-Path $searchPath)) { New-Item -Path $searchPath -Force | Out-Null }
                    Set-ItemProperty -Path $searchPath -Name "DisableSearchBoxSuggestions" -Type DWord -Value 1 -Force
                    
                    $searchPath2 = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search"
                    Set-ItemProperty -Path $searchPath2 -Name "BingSearchEnabled" -Type DWord -Value 0 -Force
                    Write-Success "Bing web search disabled in Start Menu. Local file search will now be instant."
                }
                Pause-Toolkit
            }
            "3" {
                if (Confirm-Action "Restore Windows 10 Classic Right-Click Menu in Windows 11?") {
                    $regKey = "HKCU:\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32"
                    if (-not (Test-Path $regKey)) { New-Item -Path $regKey -Force | Out-Null }
                    Set-ItemProperty -Path $regKey -Name "(Default)" -Value "" -Force
                    Write-InfoMessage "Restarting Windows Explorer to apply changes..."
                    Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Seconds 1
                    Start-Process explorer.exe
                    Write-Success "Classic context menu restored. Right-click will now show all options directly."
                }
                Pause-Toolkit
            }
            "4" {
                if (Confirm-Action "Revert to default Windows 11 modern context menu?") {
                    $regKey = "HKCU:\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}"
                    if (Test-Path $regKey) {
                        Remove-Item -Path $regKey -Recurse -Force
                        Write-InfoMessage "Restarting Windows Explorer..."
                        Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
                        Start-Sleep -Seconds 1
                        Start-Process explorer.exe
                        Write-Success "Windows 11 modern context menu restored."
                    } else {
                        Write-InfoMessage "Classic context menu was not active."
                    }
                }
                Pause-Toolkit
            }
            "5" {
                if (-not (Request-Admin "Disabling Cortana requires elevation.")) { break }
                if (Confirm-Action "Disable Cortana across the system?") {
                    $cPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search"
                    if (-not (Test-Path $cPath)) { New-Item -Path $cPath -Force | Out-Null }
                    Set-ItemProperty -Path $cPath -Name "AllowCortana" -Type DWord -Value 0 -Force
                    Write-Success "Cortana disabled."
                }
                Pause-Toolkit
            }
            "6" {
                if (Confirm-Action "Disable Activity History and Advertising ID?") {
                    $advPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo"
                    if (-not (Test-Path $advPath)) { New-Item -Path $advPath -Force | Out-Null }
                    Set-ItemProperty -Path $advPath -Name "Enabled" -Type DWord -Value 0 -Force

                    $histPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System"
                    if (-not (Test-Path $histPath)) { New-Item -Path $histPath -Force | Out-Null }
                    Set-ItemProperty -Path $histPath -Name "EnableActivityFeed" -Type DWord -Value 0 -Force
                    Write-Success "Activity feed and Advertising ID disabled."
                }
                Pause-Toolkit
            }
            "7" {
                if (Confirm-Action "Remove pre-installed bloatware UWP apps?" "Removes Feedback Hub, Tips, Maps, Weather, and Xbox Game Bar for current user.") {
                    $bloatApps = @(
                        "*WindowsFeedbackHub*",
                        "*GetHelp*",
                        "*Microsoft.Getstarted*",
                        "*WindowsMaps*",
                        "*BingWeather*",
                        "*XboxGamingOverlay*",
                        "*XboxGameOverlay*"
                    )
                    foreach ($app in $bloatApps) {
                        Write-InfoMessage "Removing $app..."
                        Get-AppxPackage -Name $app -ErrorAction SilentlyContinue | Remove-AppxPackage -ErrorAction SilentlyContinue
                    }
                    Write-Success "Selected bloatware packages removed."
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 3: PERFORMANCE & GAMING OPTIMIZATION
# ============================================================================

function Show-PerformanceMenu {
    $options = @(
        @{ Num = "1"; Title = "Ultimate Performance";  Desc = "Unlock & activate maximum power plan" }
        @{ Num = "2"; Title = "High Performance";      Desc = "Switch to Windows High Performance" }
        @{ Num = "3"; Title = "Disable Game DVR";      Desc = "Stop background recording to boost FPS" }
        @{ Num = "4"; Title = "Disable Mouse Accel";   Desc = "Enable raw 1:1 mouse input precision" }
        @{ Num = "5"; Title = "Visual Effects Speed";  Desc = "Disable slow minimize animations" }
        @{ Num = "6"; Title = "Disable Search Index";  Desc = "Reduce background SSD read/writes" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 3: PERFORMANCE & GAMING OPTIMIZATION" -Subtitle "Maximize system latency, unlock power limits, and eliminate input delays."
        Show-OptionTable -Options $options -PromptRange "0-6"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                if (-not (Request-Admin "Unlocking Ultimate Performance scheme requires administrator privileges.")) { break }
                Write-InfoMessage "Unlocking Ultimate Performance Power Scheme GUID..."
                & powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
                & powercfg /setactive e9a42b02-d5df-448d-aa00-03f14749eb61
                Write-Success "Ultimate Performance power scheme unlocked and activated!"
                Pause-Toolkit
            }
            "2" {
                & powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
                Write-Success "High Performance power scheme activated."
                Pause-Toolkit
            }
            "3" {
                if (Confirm-Action "Disable Windows Game DVR background recording?" "Prevents Windows from secretly recording video in the background during gaming.") {
                    $dvrPath = "HKCU:\System\GameConfigStore"
                    Set-ItemProperty -Path $dvrPath -Name "GameDVR_Enabled" -Type DWord -Value 0 -Force
                    
                    $polPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\GameDVR"
                    if (-not (Test-Path $polPath)) { New-Item -Path $polPath -Force | Out-Null }
                    Set-ItemProperty -Path $polPath -Name "AllowGameDVR" -Type DWord -Value 0 -Force
                    Write-Success "Game DVR background recording disabled. Frame drops reduced."
                }
                Pause-Toolkit
            }
            "4" {
                if (Confirm-Action "Disable mouse acceleration (Enhance Pointer Precision)?") {
                    Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseSpeed" -Value "0" -Force
                    Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold1" -Value "0" -Force
                    Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold2" -Value "0" -Force
                    Write-Success "Mouse acceleration disabled. Raw 1:1 input active."
                }
                Pause-Toolkit
            }
            "5" {
                if (Confirm-Action "Adjust visual effects for best performance?" "Disables window minimize animations and menu shadows.") {
                    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop\WindowMetrics" -Name "MinAnimate" -Value "0" -Force
                    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" -Name "VisualFXSetting" -Type DWord -Value 2 -Force
                    Write-Success "Visual effects set to Performance mode."
                }
                Pause-Toolkit
            }
            "6" {
                if (-not (Request-Admin "Disabling search indexing service requires elevation.")) { break }
                if (Confirm-Action "Stop and disable Windows Search indexing service?") {
                    Stop-Service "WSearch" -Force -ErrorAction SilentlyContinue
                    Set-Service "WSearch" -StartupType Disabled -ErrorAction SilentlyContinue
                    Write-Success "Windows Search indexing stopped. Continuous disk read/writes reduced."
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 4: SYSTEM SAFETY & RESTORE POINTS
# ============================================================================

function Show-SafetyMenu {
    $options = @(
        @{ Num = "1"; Title = "Create Restore Point";  Desc = "Instant system checkpoint snapshot" }
        @{ Num = "2"; Title = "List Restore Points";   Desc = "Display all available checkpoints" }
        @{ Num = "3"; Title = "Monitor Open Ports";    Desc = "Audit active listening TCP/UDP ports" }
        @{ Num = "4"; Title = "Update Defender";       Desc = "Download latest antivirus definitions" }
        @{ Num = "5"; Title = "Run Defender Scan";     Desc = "Perform quick malware & threat audit" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 4: SYSTEM SAFETY & RESTORE POINTS" -Subtitle "Create safety checkpoints and monitor listening ports and security."
        Show-OptionTable -Options $options -PromptRange "0-5"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                if (-not (Request-Admin "Creating a System Restore Point requires elevation.")) { break }
                Show-Banner
                Write-Section "Creating System Restore Point"
                Write-InfoMessage "Enabling System Restore on Drive C: if not active..."
                try {
                    Enable-ComputerRestore -Drive "C:\" -ErrorAction SilentlyContinue
                    Write-InfoMessage "Taking snapshot..."
                    Checkpoint-Computer -Description "ItsRiRx-Toolkit-SafeCheckpoint-$(Get-Date -Format 'yyyyMMdd-HHmm')" -RestorePointType "MODIFY_SETTINGS" -ErrorAction Stop
                    Write-Success "System Restore Point created successfully!"
                } catch {
                    Write-ErrorMessage "Failed to create restore point: $($_.Exception.Message)"
                }
                Pause-Toolkit
            }
            "2" {
                Show-Banner
                Write-Section "Existing System Restore Points"
                try {
                    Get-ComputerRestorePoint | Format-Table SequenceNumber, Description, CreationTime, EventType -AutoSize
                } catch {
                    Write-ErrorMessage "Unable to query restore points: $($_.Exception.Message)"
                }
                Pause-Toolkit
            }
            "3" {
                Show-Banner
                Write-Section "Active Listening Ports & Bound Applications"
                try {
                    $ports = Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess -First 25
                    $results = foreach ($p in $ports) {
                        $proc = Get-Process -Id $p.OwningProcess -ErrorAction SilentlyContinue
                        [PSCustomObject]@{
                            Port    = $p.LocalPort
                            Address = $p.LocalAddress
                            PID     = $p.OwningProcess
                            Process = if ($proc) { $proc.ProcessName } else { "System" }
                        }
                    }
                    $results | Format-Table Port, Address, PID, Process -AutoSize
                } catch {
                    & netstat -ano | Select-Object -First 30
                }
                Pause-Toolkit
            }
            "4" {
                if (-not (Request-Admin "Updating Defender definitions requires elevation.")) { break }
                Show-Banner
                Write-Section "Updating Microsoft Defender Signatures"
                try {
                    Update-MpSignature
                    Write-Success "Microsoft Defender signatures updated to the latest security version."
                } catch {
                    Write-ErrorMessage "Update error: $($_.Exception.Message)"
                }
                Pause-Toolkit
            }
            "5" {
                if (-not (Request-Admin "Running Defender scan requires elevation.")) { break }
                Show-Banner
                Write-Section "Running Microsoft Defender Quick Scan"
                Write-InfoMessage "Scanning system memory, startup folders, and critical files..."
                try {
                    Start-MpScan -ScanType QuickScan
                    Write-Success "Quick scan completed successfully. No active threats reported."
                } catch {
                    Write-ErrorMessage "Scan error: $($_.Exception.Message)"
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 5: DEVELOPER & VIRTUALIZATION FEATURES
# ============================================================================

function Show-DeveloperMenu {
    $options = @(
        @{ Num = "1"; Title = "Enable WSL 2";          Desc = "Windows Subsystem for Linux engine" }
        @{ Num = "2"; Title = "Enable Windows Sandbox";Desc = "Isolated disposable testing environment" }
        @{ Num = "3"; Title = "Enable Hyper-V";        Desc = "Native hardware hypervisor & tools" }
        @{ Num = "4"; Title = "Virtual Machine Plat";  Desc = "Required platform for containers" }
        @{ Num = "5"; Title = "Check Feature Status";  Desc = "Inspect current virtualization state" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 5: DEVELOPER & VIRTUALIZATION FEATURES" -Subtitle "Enable native Windows virtualization, WSL2, and Sandbox with one command."
        Show-OptionTable -Options $options -PromptRange "0-5"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                if (-not (Request-Admin "Enabling WSL requires administrative privileges.")) { break }
                if (Confirm-Action "Enable Windows Subsystem for Linux (WSL2)?") {
                    Write-InfoMessage "Enabling Microsoft-Windows-Subsystem-Linux..."
                    Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
                    Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
                    Write-Success "WSL 2 feature enabled! A restart will be required to finalize installation."
                }
                Pause-Toolkit
            }
            "2" {
                if (-not (Request-Admin "Enabling Windows Sandbox requires administrative privileges.")) { break }
                if (Confirm-Action "Enable Windows Sandbox?") {
                    Enable-WindowsOptionalFeature -Online -FeatureName "Containers-DisposableClientVM" -NoRestart
                    Write-Success "Windows Sandbox enabled! A system restart will be required."
                }
                Pause-Toolkit
            }
            "3" {
                if (-not (Request-Admin "Enabling Hyper-V requires administrative privileges.")) { break }
                if (Confirm-Action "Enable Hyper-V components?") {
                    Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -NoRestart
                    Write-Success "Hyper-V enabled! Please restart your PC to use Hyper-V."
                }
                Pause-Toolkit
            }
            "4" {
                if (-not (Request-Admin "Enabling Virtual Machine Platform requires administrative privileges.")) { break }
                if (Confirm-Action "Enable VirtualMachinePlatform?") {
                    Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
                    Write-Success "Virtual Machine Platform enabled!"
                }
                Pause-Toolkit
            }
            "5" {
                Show-Banner
                Write-Section "Virtualization Features State"
                $feats = @("Microsoft-Windows-Subsystem-Linux", "Containers-DisposableClientVM", "Microsoft-Hyper-V-All", "VirtualMachinePlatform")
                foreach ($f in $feats) {
                    $st = Get-WindowsOptionalFeature -Online -FeatureName $f -ErrorAction SilentlyContinue
                    $stateText = if ($st.State -eq "Enabled") { "[ENABLED] " } else { "[DISABLED]" }
                    $color = if ($st.State -eq "Enabled") { "Green" } else { "DarkGray" }
                    Write-Host "  $stateText " -NoNewline -ForegroundColor $color
                    Write-Host "$f"
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 6: BATTERY HEALTH & POWER DIAGNOSTICS (LAPTOPS & PCS)
# ============================================================================

function Show-BatteryMenu {
    $options = @(
        @{ Num = "1"; Title = "Battery Health Report"; Desc = "Generate full HTML battery diagnostics" }
        @{ Num = "2"; Title = "Battery Degradation";   Desc = "Inspect charge cycle wear & capacity" }
        @{ Num = "3"; Title = "Sleep Study Report";    Desc = "Analyze standby & sleep power drains" }
        @{ Num = "4"; Title = "List Power Schemes";    Desc = "View configured system power plans" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 6: BATTERY HEALTH & POWER DIAGNOSTICS" -Subtitle "Analyze battery degradation, cycle count, and background power drain."
        Show-OptionTable -Options $options -PromptRange "0-4"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                Show-Banner
                Write-Section "Generating Battery Health Report"
                $reportPath = "$env:TEMP\battery-report.html"
                & powercfg /batteryreport /output "$reportPath"
                if (Test-Path $reportPath) {
                    Write-Success "Battery report generated at: $reportPath"
                    Start-Process "$reportPath"
                } else {
                    Write-ErrorMessage "Unable to generate battery report. (Device may not have a battery)."
                }
                Pause-Toolkit
            }
            "2" {
                Show-Banner
                Write-Section "Battery Health & Degradation Audit"
                try {
                    $batt = Get-CimInstance -ClassName Win32_Battery -ErrorAction Stop
                    if ($batt) {
                        Write-Host "  Battery Name      : $($batt.Name)"
                        Write-Host "  Estimated Charge  : $($batt.EstimatedChargeRemaining)%" -ForegroundColor Green
                        Write-Host "  Status            : $($batt.Status)"
                        Write-Host "  Design Voltage    : $($batt.DesignVoltage) mV"
                        Write-Host "  Battery Type      : $($batt.Chemistry)"
                    }
                } catch {
                    Write-WarningMessage "No battery detected (Desktop or unsupported hardware)."
                }
                Pause-Toolkit
            }
            "3" {
                if (-not (Request-Admin "Sleep Study report requires elevation.")) { break }
                Show-Banner
                Write-Section "Generating Sleep Study Report"
                $sleepPath = "$env:TEMP\sleepstudy-report.html"
                & powercfg /sleepstudy /output "$sleepPath"
                if (Test-Path $sleepPath) {
                    Write-Success "Sleep study report generated at: $sleepPath"
                    Start-Process "$sleepPath"
                } else {
                    Write-WarningMessage "Sleep study requires Modern Standby (InstantGo) support."
                }
                Pause-Toolkit
            }
            "4" {
                Show-Banner
                Write-Section "Windows Power Schemes"
                & powercfg /list
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 7: WINDOWS SYSTEM REPAIR
# ============================================================================

function Show-RepairMenu {
    $options = @(
        @{ Num = "1"; Title = "SFC Scannow";          Desc = "Scan & repair corrupted system files" }
        @{ Num = "2"; Title = "DISM Check Health";    Desc = "Inspect Windows component store state" }
        @{ Num = "3"; Title = "DISM Restore Health";  Desc = "Download & repair corrupted OS image" }
        @{ Num = "4"; Title = "CHKDSK Drive C:";      Desc = "Read-only file system integrity audit" }
        @{ Num = "5"; Title = "Repair Windows Update";Desc = "Purge SoftwareDistribution & reset" }
        @{ Num = "6"; Title = "Component Store Clean";Desc = "Clean superseded update packages" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 7: WINDOWS SYSTEM REPAIR" -Subtitle "Scan, verify, and automatically repair corrupted OS components."
        Show-OptionTable -Options $options -PromptRange "0-6"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                if (-not (Request-Admin "SFC /scannow requires administrative privileges.")) { break }
                Show-Banner
                Write-Section "Running System File Checker (sfc /scannow)"
                Write-InfoMessage "This may take 5 to 15 minutes. Please keep this window open..."
                & sfc /scannow
                Write-Success "SFC scan finished."
                Pause-Toolkit
            }
            "2" {
                if (-not (Request-Admin "DISM inspection requires elevation.")) { break }
                Show-Banner
                Write-Section "DISM CheckHealth & ScanHealth"
                & DISM /Online /Cleanup-Image /CheckHealth
                & DISM /Online /Cleanup-Image /ScanHealth
                Pause-Toolkit
            }
            "3" {
                if (-not (Request-Admin "DISM RestoreHealth requires elevation.")) { break }
                if (Confirm-Action "Run DISM /Online /Cleanup-Image /RestoreHealth?" "This downloads healthy component packages from Windows Update if corruption is found.") {
                    Show-Banner
                    Write-Section "Running DISM RestoreHealth"
                    & DISM /Online /Cleanup-Image /RestoreHealth
                    Write-Success "DISM RestoreHealth completed."
                }
                Pause-Toolkit
            }
            "4" {
                Show-Banner
                Write-Section "CHKDSK Inspection (Drive C:)"
                & chkdsk C:
                Pause-Toolkit
            }
            "5" {
                if (-not (Request-Admin "Windows Update Repair requires elevation.")) { break }
                if (Confirm-Action "Repair Windows Update components?" "Stops wuauserv, bits, cryptSvc, clears SoftwareDistribution cache, and restarts services.") {
                    Show-Banner
                    Write-Section "Repairing Windows Update Components"
                    $services = @("wuauserv", "bits", "cryptSvc", "msiserver")
                    foreach ($svc in $services) {
                        Stop-Service -Name $svc -Force -ErrorAction SilentlyContinue
                    }
                    $softDist = "$env:SystemRoot\SoftwareDistribution\Download"
                    if (Test-Path $softDist) {
                        Remove-Item "$softDist\*" -Recurse -Force -ErrorAction SilentlyContinue
                    }
                    foreach ($svc in $services) {
                        Start-Service -Name $svc -ErrorAction SilentlyContinue
                    }
                    Write-Success "Windows Update service cache reset completed."
                }
                Pause-Toolkit
            }
            "6" {
                if (-not (Request-Admin "Component Store Cleanup requires elevation.")) { break }
                if (Confirm-Action "Clean up superseded component store packages?") {
                    & DISM /Online /Cleanup-Image /StartComponentCleanup
                    Write-Success "Component store cleanup finished."
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 8: DISK CLEANUP & ADVANCED STORAGE OPTIMIZATION
# ============================================================================

function Remove-FolderContentsSafely {
    param(
        [string]$Path,
        [string]$Label
    )
    if (-not (Test-Path $Path)) {
        Write-WarningMessage "$Label path not found: $Path"
        return
    }

    Write-InfoMessage "Cleaning $Label ($Path)..."
    $deleted = 0
    $skipped = 0

    Get-ChildItem -Path $Path -Force -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction Stop
            $deleted++
        }
        catch {
            $skipped++
        }
    }

    Write-Host "    Deleted: $deleted | Skipped (Locked/Active): $skipped" -ForegroundColor Gray
}

function Show-CleanupMenu {
    $options = @(
        @{ Num = "1"; Title = "Clean User Temp";       Desc = "Purge temporary user profile files" }
        @{ Num = "2"; Title = "Clean System Temp";     Desc = "Purge Windows OS temporary files" }
        @{ Num = "3"; Title = "Empty Recycle Bin";     Desc = "Permanently clear deleted trash" }
        @{ Num = "4"; Title = "Top 15 Largest Files";  Desc = "Scan Drive C: for large disk hogs" }
        @{ Num = "5"; Title = "Manual SSD TRIM";       Desc = "Execute Optimize-Volume ReTrim" }
        @{ Num = "6"; Title = "Windows Disk Cleanup";  Desc = "Launch native cleanmgr.exe tool" }
        @{ Num = "7"; Title = "Clean Browser Cache";   Desc = "Clear Chrome, Edge & Firefox cache" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 8: DISK CLEANUP & STORAGE OPTIMIZATION" -Subtitle "Purge gigabytes of junk, optimize SSD health, and reclaim storage space."
        Show-OptionTable -Options $options -PromptRange "0-7"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                Show-Banner
                Write-Section "Cleaning User Temporary Files"
                Remove-FolderContentsSafely -Path $env:TEMP -Label "User Temp"
                Write-Success "User Temp cleanup finished."
                Pause-Toolkit
            }
            "2" {
                if (-not (Request-Admin "Cleaning System Temp requires elevation.")) { break }
                Show-Banner
                Write-Section "Cleaning Windows System Temporary Files"
                Remove-FolderContentsSafely -Path "$env:SystemRoot\Temp" -Label "Windows Temp"
                Write-Success "Windows Temp cleanup finished."
                Pause-Toolkit
            }
            "3" {
                if (Confirm-Action "Permanently empty the Recycle Bin?") {
                    try {
                        Clear-RecycleBin -Force -ErrorAction Stop
                        Write-Success "Recycle Bin emptied successfully."
                    } catch {
                        Write-ErrorMessage "Failed to clear Recycle Bin: $($_.Exception.Message)"
                    }
                }
                Pause-Toolkit
            }
            "4" {
                Show-Banner
                Write-Section "Scanning for Top 15 Largest Files on Drive C:"
                Write-InfoMessage "Scanning user profiles and documents (Excluding system-protected kernels)..."
                try {
                    $largeFiles = Get-ChildItem -Path "$env:SystemDrive\Users" -Recurse -File -ErrorAction SilentlyContinue |
                        Sort-Object Length -Descending |
                        Select-Object -First 15
                    
                    $largeFiles | Select-Object @{Name="File Name";Expression={$_.Name}}, @{Name="Size (GB)";Expression={[Math]::Round($_.Length / 1GB, 2)}}, @{Name="Directory";Expression={$_.DirectoryName}} |
                        Format-Table -AutoSize
                } catch {
                    Write-ErrorMessage "Scan interrupted: $($_.Exception.Message)"
                }
                Pause-Toolkit
            }
            "5" {
                if (-not (Request-Admin "Manual SSD TRIM requires administrative privileges.")) { break }
                Show-Banner
                Write-Section "Executing SSD ReTrim & Storage Optimization"
                Write-InfoMessage "Running Optimize-Volume on Drive C:..."
                try {
                    Optimize-Volume -DriveLetter C -ReTrim -Verbose
                    Write-Success "SSD TRIM executed successfully. Drive performance optimized."
                } catch {
                    Write-ErrorMessage "TRIM failed: $($_.Exception.Message)"
                }
                Pause-Toolkit
            }
            "6" {
                Start-Process "cleanmgr.exe"
                Pause-Toolkit
            }
            "7" {
                if (Confirm-Action "Clean browser cache folders?" "Please close Chrome, Edge, and Firefox before proceeding.") {
                    $chromeCache = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"
                    $edgeCache   = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"
                    if (Test-Path $chromeCache) { Remove-FolderContentsSafely -Path $chromeCache -Label "Chrome Cache" }
                    if (Test-Path $edgeCache)   { Remove-FolderContentsSafely -Path $edgeCache -Label "Edge Cache" }
                    Write-Success "Browser cache cleaning cycle completed."
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 9: NETWORK DIAGNOSTICS & DNS TOOLS
# ============================================================================

function Test-Internet {
    Write-InfoMessage "Testing internet connectivity across 3 independent checkpoints..."
    $results = @{
        Gateway = $false
        DNS     = $false
        HTTP    = $false
    }

    try {
        $gw = (Get-NetRoute -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue | Select-Object -First 1).NextHop
        if ($gw) {
            $pingGw = Test-Connection -ComputerName $gw -Count 1 -Quiet -ErrorAction SilentlyContinue
            if ($pingGw) { $results.Gateway = $true }
        }
    } catch {}

    try {
        $dnsRes = [System.Net.Dns]::GetHostAddresses("google.com")
        if ($dnsRes.Count -gt 0) { $results.DNS = $true }
    } catch {}

    try {
        $req = [System.Net.WebRequest]::Create("https://1.1.1.1")
        $req.Timeout = 4000
        $req.Method = "HEAD"
        $resp = $req.GetResponse()
        if ($resp) {
            $results.HTTP = $true
            $resp.Close()
        }
    } catch {}

    Write-Host ""
    if ($results.Gateway) { Write-Success "Default Gateway : Reachable" } else { Write-WarningMessage "Default Gateway : Unreachable or ICMP disabled" }
    if ($results.DNS)     { Write-Success "DNS Resolution  : Operational" } else { Write-ErrorMessage "DNS Resolution  : Failed" }
    if ($results.HTTP)    { Write-Success "HTTPS Web Link  : Active" } else { Write-ErrorMessage "HTTPS Web Link  : Connection timed out" }
    
    Write-Host ""
    if ($results.DNS -and $results.HTTP) {
        Write-Success "Internet connection is AVAILABLE and fully operational."
    } elseif ($results.Gateway -or $results.DNS) {
        Write-WarningMessage "Partial connectivity detected. Some services may be unavailable."
    } else {
        Write-ErrorMessage "Internet connection is UNAVAILABLE."
    }
}

function Show-NetworkMenu {
    $options = @(
        @{ Num = "1"; Title = "Active IP Config";      Desc = "View IPv4, IPv6, Gateway & DNS" }
        @{ Num = "2"; Title = "Ping Response Test";    Desc = "Test ICMP latency to 8.8.8.8" }
        @{ Num = "3"; Title = "3-Point Connectivity";  Desc = "Validate Gateway, DNS & HTTPS link" }
        @{ Num = "4"; Title = "Flush DNS Resolver";    Desc = "Clear local DNS client cache" }
        @{ Num = "5"; Title = "Switch DNS Provider";   Desc = "Set Cloudflare, Google or Quad9" }
        @{ Num = "6"; Title = "Hardware Adapters";     Desc = "List network interfaces & link speed" }
        @{ Num = "7"; Title = "WiFi Signal Status";    Desc = "Display current wireless diagnostics" }
        @{ Num = "8"; Title = "Saved WiFi Profiles";   Desc = "List saved wireless network names" }
        @{ Num = "9"; Title = "Full Network Reset";    Desc = "Reset Winsock, TCP/IP stack & flush" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 9: NETWORK DIAGNOSTICS & DNS TOOLS" -Subtitle "Test latency, flush cache, switch DNS servers, and audit adapters."
        Show-OptionTable -Options $options -PromptRange "0-9"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                Show-Banner
                Write-Section "Active Network IP Configuration"
                try {
                    Get-NetIPConfiguration | ForEach-Object {
                        Write-Host "  Adapter: $($_.InterfaceAlias) ($($_.InterfaceDescription))" -ForegroundColor Cyan
                        Write-Host "    IPv4 Address : $($_.IPv4Address.IPAddress -join ', ')"
                        Write-Host "    IPv6 Address : $($_.IPv6Address.IPAddress -join ', ')"
                        Write-Host "    IPv4 Gateway : $($_.IPv4DefaultGateway.NextHop -join ', ')"
                        Write-Host "    DNS Servers  : $($_.DNSServer.ServerAddresses -join ', ')"
                        Write-Host "    Status       : $($_.NetAdapter.Status)"
                        Write-Host ""
                    }
                } catch {
                    ipconfig /all
                }
                Pause-Toolkit
            }
            "2" {
                Show-Banner
                Write-Section "ICMP Ping Response Test"
                Write-Host "  Enter hostname or IP (default: 8.8.8.8): " -ForegroundColor Cyan -NoNewline
                $target = Read-Host
                if ([string]::IsNullOrWhiteSpace($target)) { $target = "8.8.8.8" }
                Test-Connection -ComputerName $target -Count 4 | Format-Table Address, ResponseTime, StatusCode -AutoSize
                Pause-Toolkit
            }
            "3" {
                Show-Banner
                Write-Section "3-Point Internet Connectivity Diagnostics"
                Test-Internet
                Pause-Toolkit
            }
            "4" {
                Clear-DnsClientCache
                Write-Success "DNS Client Cache flushed successfully."
                Pause-Toolkit
            }
            "5" {
                if (-not (Request-Admin "Changing DNS servers requires elevation.")) { break }
                Show-Banner
                Write-Section "Select Predefined DNS Provider"
                foreach ($k in $Script:DnsPresets.Keys) {
                    Write-Host "  [$k] $($Script:DnsPresets[$k].Name)"
                }
                Write-Host "  [0] Cancel" -ForegroundColor DarkGray
                Write-Host ""
                Write-Host "  Select provider [1-4]: " -ForegroundColor Cyan -NoNewline
                $dnsChoice = Read-Host
                if ($Script:DnsPresets.Contains($dnsChoice)) {
                    $selectedDns = $Script:DnsPresets[$dnsChoice]
                    if (Confirm-Action "Apply $($selectedDns.Name) to all active adapters?") {
                        $adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }
                        foreach ($adapter in $adapters) {
                            try {
                                if ($selectedDns.Primary -eq "DHCP") {
                                    Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ResetServerAddresses
                                    Write-Success "Reset DNS to DHCP on $($adapter.Name)"
                                } else {
                                    Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses ($selectedDns.Primary, $selectedDns.Secondary)
                                    Write-Success "Set $($selectedDns.Name) on $($adapter.Name)"
                                }
                            }
                            catch {
                                Write-ErrorMessage "Failed on $($adapter.Name): $($_.Exception.Message)"
                            }
                        }
                    }
                }
                Pause-Toolkit
            }
            "6" {
                Show-Banner
                Write-Section "Hardware Network Adapters"
                Get-NetAdapter | Format-Table Name, InterfaceDescription, Status, LinkSpeed, MacAddress -AutoSize
                Pause-Toolkit
            }
            "7" {
                Show-Banner
                Write-Section "WiFi Interface & Signal Status"
                & netsh wlan show interfaces
                Pause-Toolkit
            }
            "8" {
                Show-Banner
                Write-Section "Saved WiFi Connection Profiles"
                & netsh wlan show profiles
                Pause-Toolkit
            }
            "9" {
                if (-not (Request-Admin "Network reset requires elevation.")) { break }
                if (Confirm-Action "Perform full network stack reset?") {
                    & ipconfig /flushdns
                    & netsh winsock reset
                    & netsh int ip reset
                    Write-Success "Network stack reset completed successfully."
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 10: SYSTEM HARDWARE INFO & BUILT-IN UTILITIES
# ============================================================================

function Show-SystemMenu {
    $options = @(
        @{ Num = "1";  Title = "OS & System Uptime";    Desc = "View Windows edition, build & uptime" }
        @{ Num = "2";  Title = "Processor (CPU) Info";  Desc = "View CPU model, cores & clock speed" }
        @{ Num = "3";  Title = "Physical Memory (RAM)"; Desc = "View RAM module frequency & slots" }
        @{ Num = "4";  Title = "Graphics Adapter (GPU)";Desc = "View GPU model & video memory (VRAM)" }
        @{ Num = "5";  Title = "Windows License Status";Desc = "Check official activation details" }
        @{ Num = "6";  Title = "Launch Task Manager";   Desc = "Open Windows Task Manager console" }
        @{ Num = "7";  Title = "Device Manager";        Desc = "Open Windows Device Manager (msc)" }
        @{ Num = "8";  Title = "Registry Editor";       Desc = "Open Windows Registry Editor tool" }
        @{ Num = "9";  Title = "Services Console";      Desc = "Open Windows Services console" }
        @{ Num = "10"; Title = "Disk Management";       Desc = "Open Windows Disk Management tool" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 10: SYSTEM INFO & BUILT-IN UTILITIES" -Subtitle "Audit hardware specifications, Windows license status, and launch MSC consoles."
        Show-OptionTable -Options $options -PromptRange "0-10"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                Show-Banner
                Write-Section "Windows Operating System Information"
                $os = Get-CimInstance Win32_OperatingSystem
                $uptime = (Get-Date) - $os.LastBootUpTime
                Write-Host "    OS Name        : $($os.Caption)"
                Write-Host "    Build Number   : $($os.BuildNumber)"
                Write-Host "    Architecture   : $($os.OSArchitecture)"
                Write-Host "    System Uptime  : $($uptime.Days)d $($uptime.Hours)h $($uptime.Minutes)m"
                Pause-Toolkit
            }
            "2" {
                Show-Banner
                Write-Section "Processor (CPU) Details"
                Get-CimInstance Win32_Processor | ForEach-Object {
                    Write-Host "    Processor Name : $($_.Name.Trim())"
                    Write-Host "    Physical Cores : $($_.NumberOfCores)"
                    Write-Host "    Logical Threads: $($_.NumberOfLogicalProcessors)"
                    Write-Host "    Max Clock Speed: $($_.MaxClockSpeed) MHz"
                }
                Pause-Toolkit
            }
            "3" {
                Show-Banner
                Write-Section "Physical Memory (RAM) Modules"
                $sticks = Get-CimInstance Win32_PhysicalMemory
                $totalRam = 0
                foreach ($m in $sticks) {
                    $gb = [Math]::Round($m.Capacity / 1GB, 2)
                    $totalRam += $m.Capacity
                    Write-Host "    Bank: $($m.DeviceLocator) | Size: $gb GB | Speed: $($m.Speed) MHz | Part: $($m.PartNumber.Trim())"
                }
                Write-Host "    Total RAM: $([Math]::Round($totalRam / 1GB, 2)) GB" -ForegroundColor Cyan
                Pause-Toolkit
            }
            "4" {
                Show-Banner
                Write-Section "Graphics Controllers (GPU)"
                Get-CimInstance Win32_VideoController | ForEach-Object {
                    $vram = if ($_.AdapterRAM) { [Math]::Round($_.AdapterRAM / 1MB, 0) } else { "N/A" }
                    Write-Host "    GPU Name       : $($_.Name)"
                    Write-Host "    Driver Version : $($_.DriverVersion)"
                    Write-Host "    Adapter VRAM   : $vram MB"
                }
                Pause-Toolkit
            }
            "5" {
                Show-Banner
                Write-Section "Official Windows Activation Status"
                try {
                    $lic = Get-CimInstance SoftwareLicensingProduct -Filter "PartialProductKey IS NOT NULL" -ErrorAction SilentlyContinue | Select-Object -First 1
                    if ($lic) {
                        $statusText = if ($lic.LicenseStatus -eq 1) { "Licensed (Permanently Activated)" } else { "Not Activated ($($lic.LicenseStatus))" }
                        Write-Host "    Product Name   : $($lic.Name)"
                        Write-Host "    License Status : $statusText" -ForegroundColor $(if ($lic.LicenseStatus -eq 1) { "Green" } else { "Yellow" })
                    } else {
                        cscript.exe //nologo "$env:SystemRoot\System32\slmgr.vbs" /xpr
                    }
                } catch {
                    cscript.exe //nologo "$env:SystemRoot\System32\slmgr.vbs" /dli
                }
                Pause-Toolkit
            }
            "6"  { Start-Process "taskmgr.exe" }
            "7"  { Start-Process "devmgmt.msc" }
            "8"  { Start-Process "regedit.exe" }
            "9"  { Start-Process "services.msc" }
            "10" { Start-Process "diskmgmt.msc" }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 11: QUICK ACTIONS
# ============================================================================

function Show-QuickMenu {
    $options = @(
        @{ Num = "1"; Title = "Flush DNS Cache";       Desc = "Instant 1-click DNS cache purge" }
        @{ Num = "2"; Title = "Test Internet Link";     Desc = "Quick 3-point connectivity test" }
        @{ Num = "3"; Title = "Restart Explorer";       Desc = "Clean fix for taskbar & shell freeze" }
        @{ Num = "4"; Title = "Quick Restore Point";    Desc = "Instant 1-click safety checkpoint" }
        @{ Num = "5"; Title = "Essential Apps Pack";    Desc = "Install curated standard PC setup" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 11: INSTANT QUICK ACTIONS" -Subtitle "1-click emergency tools to fix network lag, Explorer freeze, and system glitches."
        Show-OptionTable -Options $options -PromptRange "0-5"
        $choice = Read-Host

        switch ($choice) {
            "1" {
                Clear-DnsClientCache
                Write-Success "DNS cache flushed successfully."
                Pause-Toolkit
            }
            "2" {
                Test-Internet
                Pause-Toolkit
            }
            "3" {
                if (Confirm-Action "Restart Windows Explorer process?") {
                    Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Seconds 1
                    Start-Process explorer.exe
                    Write-Success "Windows Explorer restarted."
                }
                Pause-Toolkit
            }
            "4" {
                if (Request-Admin "Creating Restore Point requires elevation.") {
                    Enable-ComputerRestore -Drive "C:\" -ErrorAction SilentlyContinue
                    Checkpoint-Computer -Description "ItsRiRx-QuickCheckpoint-$(Get-Date -Format 'HHmm')" -RestorePointType "MODIFY_SETTINGS" -ErrorAction SilentlyContinue
                    Write-Success "Quick System Restore Point created."
                    Pause-Toolkit
                }
            }
            "5" {
                Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Essential"] -GroupTitle "Essential Applications Pack"
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 12: APP UNINSTALLER & LEFTOVER DEEP CLEANER
# ============================================================================

function Get-InstalledSoftwareList {
    param([string]$FilterKeyword = "")

    $paths = @(
        "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*"
    )

    # 1. Query all logged-in user profiles in HKEY_USERS (captures user-installed apps like VS Code User, Discord, Chrome per-user)
    try {
        $userProfiles = Get-ChildItem Registry::HKEY_USERS -ErrorAction SilentlyContinue | 
            Where-Object { $_.PSChildName -match "^S-1-5-21-" -and $_.PSChildName -notmatch "_Classes$" }
        foreach ($u in $userProfiles) {
            $paths += "Registry::HKEY_USERS\$($u.PSChildName)\Software\Microsoft\Windows\CurrentVersion\Uninstall\*"
        }
    } catch {}

    $installedList = @()
    $seenNames = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

    # 2. Scan Registry Uninstall Keys
    foreach ($path in $paths) {
        if (Test-Path (Split-Path $path)) {
            Get-ItemProperty $path -ErrorAction SilentlyContinue | ForEach-Object {
                $name = $_.DisplayName
                if ([string]::IsNullOrWhiteSpace($name)) { return }

                # Filter out pure Windows OS updates (KB articles)
                if ($name -match "^(KB\d+|Security Update for|Update for Windows)") { return }

                # Resolve uninstall command (check UninstallString, QuietUninstallString, or InstallLocation uninstaller)
                $uninst = if ($_.UninstallString) { 
                    $_.UninstallString 
                } elseif ($_.QuietUninstallString) { 
                    $_.QuietUninstallString 
                } elseif ($_.InstallLocation -and (Test-Path "$($_.InstallLocation)\unins000.exe")) {
                    "`"$($_.InstallLocation)\unins000.exe`""
                } elseif ($_.InstallLocation -and (Test-Path "$($_.InstallLocation)\uninstall.exe")) {
                    "`"$($_.InstallLocation)\uninstall.exe`""
                } else { 
                    "" 
                }

                # Only include if an uninstallation method is available
                if (-not $uninst) { return }

                $cleanKey = $name.Trim()
                if (-not $seenNames.Contains($cleanKey)) {
                    [void]$seenNames.Add($cleanKey)

                    if ([string]::IsNullOrWhiteSpace($FilterKeyword) -or 
                        ($name -match [regex]::Escape($FilterKeyword)) -or 
                        ($_.Publisher -match [regex]::Escape($FilterKeyword))) {

                        $installedList += [PSCustomObject]@{
                            DisplayName          = $cleanKey
                            DisplayVersion       = if ($_.DisplayVersion) { $_.DisplayVersion } else { "N/A" }
                            Publisher            = if ($_.Publisher) { $_.Publisher } else { "Unknown" }
                            UninstallString      = $uninst
                            QuietUninstallString = $_.QuietUninstallString
                            InstallLocation      = $_.InstallLocation
                            PSChildName          = $_.PSChildName
                            IsUWP                = $false
                        }
                    }
                }
            }
        }
    }

    # 3. Add Removable Windows Store / UWP Applications
    try {
        $uwpPackages = Get-AppxPackage -AllUsers -ErrorAction SilentlyContinue | Where-Object {
            -not $_.IsFramework -and -not $_.NonRemovable -and 
            $_.Name -notmatch "^Microsoft\.(Windows|UI|NET|VCLibs|DirectX|Services|Advertising|DesktopAppInstaller|SecHealthUI|AAD\.BrokerPlugin|AccountsControl|AsyncTextService|BioEnrollment|CredDialogHost|ECApp|LockApp|Win32WebViewHost)"
        }
        foreach ($pkg in $uwpPackages) {
            $uName = if ($pkg.Name -match "^[A-Za-z0-9]+\.(.+)$") { $Matches[1] } else { $pkg.Name }
            if (-not $seenNames.Contains($uName)) {
                [void]$seenNames.Add($uName)

                if ([string]::IsNullOrWhiteSpace($FilterKeyword) -or ($uName -match [regex]::Escape($FilterKeyword))) {
                    $installedList += [PSCustomObject]@{
                        DisplayName          = "$uName (Store App)"
                        DisplayVersion       = if ($pkg.Version) { $pkg.Version } else { "UWP" }
                        Publisher            = if ($pkg.PublisherId) { "Microsoft Store" } else { "Microsoft Store" }
                        UninstallString      = "powershell.exe -Command Remove-AppxPackage -Package $($pkg.PackageFullName)"
                        QuietUninstallString = "powershell.exe -Command Remove-AppxPackage -Package $($pkg.PackageFullName)"
                        InstallLocation      = $pkg.InstallLocation
                        PSChildName          = $pkg.PackageFullName
                        IsUWP                = $true
                    }
                }
            }
        }
    } catch {}

    return ($installedList | Sort-Object DisplayName)
}

function Invoke-DeepLeftoverCleanup {
    param(
        [string]$AppName,
        [string]$Publisher = "",
        [switch]$AutoConfirm
    )

    if ([string]::IsNullOrWhiteSpace($AppName) -or $AppName.Length -lt 3) { return }

    # Clean app name for regex folder search (strip special characters, version numbers, etc.)
    $sanitized = ($AppName -replace "(?i)\s*(64-bit|32-bit|x64|x86|v\d+.*|version.*|\(.*\))", "").Trim()
    if ($sanitized.Length -lt 3) { $sanitized = $AppName }
    
    $cleanKeywords = @($sanitized)
    if ($sanitized -match "^(\w+)") {
        $firstWord = $Matches[1]
        if ($firstWord.Length -ge 4 -and $firstWord -notmatch "(?i)^(microsoft|google|adobe|windows|system|intel|nvidia|realtek)") {
            $cleanKeywords += $firstWord
        }
    }
    if (-not [string]::IsNullOrWhiteSpace($Publisher) -and $Publisher.Length -ge 4 -and $Publisher -notmatch "(?i)^(microsoft|corporation|unknown|inc\.|llc)") {
        $cleanKeywords += $Publisher.Trim()
    }

    $locationsToCheck = @(
        $env:APPDATA,
        $env:LOCALAPPDATA,
        "$env:LOCALAPPDATA\Programs",
        $env:ProgramData,
        "C:\Program Files",
        "C:\Program Files (x86)"
    )

    $foundLeftovers = @()

    foreach ($loc in $locationsToCheck) {
        if (-not (Test-Path $loc)) { continue }
        
        foreach ($kw in ($cleanKeywords | Select-Object -Unique)) {
            try {
                $subDirs = Get-ChildItem -Path $loc -Directory -ErrorAction SilentlyContinue | Where-Object {
                    $_.Name -match "^(?i)" + [regex]::Escape($kw) + "$" -or $_.Name -like "*$kw*"
                }
                foreach ($dir in $subDirs) {
                    # Skip critical system root directories
                    if ($dir.FullName -match "(?i)(system32|syswow64|windowsdefender|microsoft|windowsapp|temp)$") { continue }
                    if ($foundLeftovers -notcontains $dir.FullName) {
                        $foundLeftovers += $dir.FullName
                    }
                }
            } catch {}
        }
    }

    if ($foundLeftovers.Count -gt 0) {
        Write-Host ""
        Write-Host "  [LEFTOVER RESIDUE SCANNER]" -ForegroundColor Yellow
        Write-Host "  Found $($foundLeftovers.Count) leftover directory(s) matching '$AppName':" -ForegroundColor Cyan
        foreach ($item in $foundLeftovers) {
            $sizeStr = "Calculating size..."
            try {
                $measure = Get-ChildItem -Path $item -Recurse -Force -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum
                if ($measure.Sum) {
                    $sizeMb = [Math]::Round($measure.Sum / 1MB, 2)
                    $sizeStr = "$sizeMb MB"
                } else {
                    $sizeStr = "0 MB (Empty folder)"
                }
            } catch { $sizeStr = "N/A" }
            Write-Host "    - $item ($sizeStr)" -ForegroundColor White
        }

        $proceed = $false
        if ($AutoConfirm) {
            $proceed = $true
        } else {
            Write-Host ""
            Write-Host "  Delete all leftover files and folders? [Y/N]: " -ForegroundColor Green -NoNewline
            $ans = Read-Host
            if ($ans -match "^[Yy]$") { $proceed = $true }
        }

        if ($proceed) {
            foreach ($item in $foundLeftovers) {
                try {
                    Remove-Item -Path $item -Recurse -Force -ErrorAction SilentlyContinue
                    Write-Success "Cleaned residual folder: $item"
                } catch {
                    Write-ErrorMessage "Failed to remove $($item): $($_.Exception.Message)"
                }
            }
        } else {
            Write-InfoMessage "Leftover files preserved by user."
        }
    } else {
        Write-Success "Zero leftover folders detected in AppData or ProgramData for '$AppName'."
    }
}

function Invoke-BatchUninstallFlow {
    param(
        [array]$SoftwareList,
        [switch]$DeepClean
    )

    if (-not $SoftwareList -or $SoftwareList.Count -eq 0) {
        Write-WarningMessage "No applications provided for uninstallation."
        Pause-Toolkit
        return
    }

    $pageSize = 25
    $page = 1
    $totalPages = [Math]::Ceiling($SoftwareList.Count / $pageSize)

    do {
        Show-Banner
        Write-Host "  --- SELECT APPLICATIONS TO UNINSTALL (MULTI-SELECT) ---" -ForegroundColor Cyan
        Write-Host "  Page $page of $totalPages | Total Installed Applications: $($SoftwareList.Count)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  ┌────┬─────────────────────────────┬───────────┬────────────────────────┐" -ForegroundColor DarkCyan
        Write-Host "  │ #  │ APPLICATION NAME            │ VERSION   │ PUBLISHER              │" -ForegroundColor Cyan
        Write-Host "  ├────┼─────────────────────────────┼───────────┼────────────────────────┤" -ForegroundColor DarkCyan

        $startIdx = ($page - 1) * $pageSize
        $endIdx = [Math]::Min($startIdx + $pageSize - 1, $SoftwareList.Count - 1)

        for ($i = $startIdx; $i -le $endIdx; $i++) {
            $item = $SoftwareList[$i]
            $numPad = "[$($i + 1)]".PadRight(3)
            $namePad = $item.DisplayName
            if ($namePad.Length -gt 27) { $namePad = $namePad.Substring(0, 24) + "..." }
            $namePad = $namePad.PadRight(27)
            
            $verPad = $item.DisplayVersion
            if ($verPad.Length -gt 9) { $verPad = $verPad.Substring(0, 7) + ".." }
            $verPad = $verPad.PadRight(9)

            $pubPad = $item.Publisher
            if ($pubPad.Length -gt 22) { $pubPad = $pubPad.Substring(0, 19) + "..." }
            $pubPad = $pubPad.PadRight(22)

            Write-Host "  │ $numPad│ $namePad │ $verPad │ $pubPad │" -ForegroundColor White
        }

        Write-Host "  └────┴─────────────────────────────┴───────────┴────────────────────────┘" -ForegroundColor DarkCyan
        Write-Host ""
        Write-Host "  [M]    Mouse Mode: Open Interactive Checkbox Selection Window" -ForegroundColor Cyan
        Write-Host "  [1..N] Keyboard Mode: Type app numbers separated by commas (e.g. 1, 3, 5)" -ForegroundColor White
        Write-Host "  [S]    Search: Filter applications by name keyword" -ForegroundColor White
        Write-Host "  [N/P]  Pagination: Next / Previous page" -ForegroundColor DarkGray
        Write-Host "  [0]    Cancel: Return to uninstaller menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Enter your choice: " -ForegroundColor Cyan -NoNewline
        $inputChoice = Read-Host

        if ([string]::IsNullOrWhiteSpace($inputChoice) -or $inputChoice -eq "0") {
            return
        }

        if ($inputChoice.Trim().ToUpper() -in @("M", "MOUSE", "GUI")) {
            Write-InfoMessage "Launching Interactive Mouse Checkbox Window for Uninstall..."
            try {
                $gridItems = $SoftwareList | Select-Object @{Name='Index';Expression={$SoftwareList.IndexOf($_) + 1}}, DisplayName, DisplayVersion, Publisher
                $guiSelected = $gridItems | Out-GridView -Title "App Uninstaller — Select Applications to Remove & Click OK" -PassThru
                if ($guiSelected) {
                    $selectedItems = @()
                    foreach ($item in $guiSelected) {
                        $target = $SoftwareList[$item.Index - 1]
                        if ($target) { $selectedItems += $target }
                    }
                }
            } catch {
                Write-ErrorMessage "Mouse Grid failed: $($_.Exception.Message)"
            }
        } elseif ($inputChoice.Trim().ToUpper() -eq "N") {
            if ($page -lt $totalPages) { $page++ }
            continue
        } elseif ($inputChoice.Trim().ToUpper() -eq "P") {
            if ($page -gt 1) { $page-- }
            continue
        } elseif ($inputChoice.Trim().ToUpper() -eq "S") {
            Write-Host ""
            Write-Host "  Enter search keyword: " -ForegroundColor Cyan -NoNewline
            $searchKw = Read-Host
            if (-not [string]::IsNullOrWhiteSpace($searchKw)) {
                $filtered = Get-InstalledSoftwareList -FilterKeyword $searchKw
                if ($filtered.Count -gt 0) {
                    Invoke-BatchUninstallFlow -SoftwareList $filtered -DeepClean:$DeepClean
                    return
                } else {
                    Write-WarningMessage "No applications found matching '$searchKw'."
                    Start-Sleep -Seconds 1
                }
            }
            continue
        } else {
            # Parse selected numbers
            $numbers = [regex]::Split($inputChoice, "[,\s]+") | Where-Object { $_ -match "^\d+$" } | ForEach-Object { [int]$_ }
            $selectedItems = @()

            foreach ($n in $numbers) {
                if ($n -ge 1 -and $n -le $SoftwareList.Count) {
                    $target = $SoftwareList[$n - 1]
                    if ($selectedItems -notcontains $target) {
                        $selectedItems += $target
                    }
                }
            }
        }

        if ($selectedItems.Count -eq 0) {
            Write-WarningMessage "No applications were selected."
            Start-Sleep -Seconds 1
            continue
        }

        # Minimal Confirmation Screen (Strict 76 characters)
        Show-Banner
        Write-Host ""
        Write-Host "  ┌────────────────────────────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
        Write-Host "  │  UNINSTALLATION CONFIRMATION                                           │" -ForegroundColor Cyan
        Write-Host "  ├────────────────────────────────────────────────────────────────────────┤" -ForegroundColor DarkCyan
        foreach ($app in $selectedItems) {
            $line = "  │  [-] $($app.DisplayName) (v$($app.DisplayVersion))"
            if ($line.Length -gt 72) { $line = $line.Substring(0, 69) + "..." }
            Write-Host ($line.PadRight(75) + "│") -ForegroundColor White
        }
        if ($DeepClean) {
            Write-Host "  ├────────────────────────────────────────────────────────────────────────┤" -ForegroundColor DarkCyan
            Write-Host "  │  Deep Clean Active: Leftover AppData & ProgramData will be wiped       │" -ForegroundColor Green
        }
        Write-Host "  └────────────────────────────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
        Write-Host ""
        Write-Host "  Proceed with uninstalling $($selectedItems.Count) application(s)? [Y/N]: " -ForegroundColor Yellow -NoNewline
        $confirm = Read-Host

        if ($confirm -notmatch "^[Yy]$") {
            Write-InfoMessage "Uninstallation cancelled by user. Zero changes made."
            Pause-Toolkit
            return
        }

        # Perform uninstallation
        Write-Host ""
        Write-Section "Uninstalling $($selectedItems.Count) Application(s)"

        $uSuccess = 0
        $uFail = 0
        $uTotal = $selectedItems.Count
        $uCurrent = 0

        foreach ($app in $selectedItems) {
            $uCurrent++
            Show-CyberProgress -Current $uCurrent -Total $uTotal -Activity "Uninstalling Application" -Status "Removing $($app.DisplayName)..." -ItemName "$($app.DisplayName)"
            
            $uninstalledOk = $false

            # 0. Check for Windows Store (UWP) package uninstallation
            if ($app.IsUWP -or $app.DisplayName -match "\(Store App\)$") {
                Write-Host "    Removing Windows Store / Appx package..." -ForegroundColor DarkCyan
                Remove-AppxPackage -Package $app.PSChildName -AllUsers -ErrorAction SilentlyContinue
                $uninstalledOk = $true
            }

            # 1. Try winget if available
            $wingetCmd = Get-Command winget -ErrorAction SilentlyContinue
            if ($wingetCmd) {
                Write-Host "    Attempting Winget silent uninstall..." -ForegroundColor DarkCyan
                $wProc = Start-Process winget -ArgumentList @("uninstall", "--name", "`"$($app.DisplayName)`"", "--silent", "--accept-source-agreements") -NoNewWindow -Wait -PassThru -ErrorAction SilentlyContinue
                if ($wProc.ExitCode -eq 0) {
                    $uninstalledOk = $true
                }
            }

            # 2. Try QuietUninstallString or standard UninstallString
            if (-not $uninstalledOk) {
                $uninstStr = if ($app.QuietUninstallString) { $app.QuietUninstallString } else { $app.UninstallString }
                if ($uninstStr) {
                    Write-Host "    Invoking system uninstallation command..." -ForegroundColor DarkCyan
                    try {
                        if ($uninstStr -match "(?i)^msiexec(\.exe)?\s+([/a-zA-Z0-9\s{} -]+)") {
                            $msiArgs = ($Matches[2] -replace "(?i)/i", "/x") + " /qn /norestart"
                            $proc = Start-Process msiexec.exe -ArgumentList $msiArgs -NoNewWindow -Wait -PassThru
                            if ($proc.ExitCode -in @(0, 1605, 3010)) { $uninstalledOk = $true }
                        } else {
                            # Execute native uninstaller string
                            $proc = Start-Process cmd.exe -ArgumentList "/c `"$uninstStr`"" -NoNewWindow -Wait -PassThru -ErrorAction SilentlyContinue
                            if ($proc.ExitCode -in @(0, 3010)) { $uninstalledOk = $true }
                        }
                    } catch {
                        Write-ErrorMessage "Standard uninstaller execution encountered an error: $($_.Exception.Message)"
                    }
                }
            }

            Write-Success "Uninstallation process finished for: $($app.DisplayName)"
            $uSuccess++

            # Deep leftover cleanup
            if ($DeepClean) {
                Invoke-DeepLeftoverCleanup -AppName $app.DisplayName -Publisher $app.Publisher
            }
        }

        Write-Host ""
        Write-Host "  --- UNINSTALLATION COMPLETED ---" -ForegroundColor Cyan
        Write-Host "  Processed: $uSuccess application(s)" -ForegroundColor Green
        Pause-Toolkit
        return

    } while ($true)
}

function Show-UninstallerMenu {
    $options = @(
        @{ Num = "1"; Title = "All Installed Desktop"; Desc = "Multi-select batch uninstaller list" }
        @{ Num = "2"; Title = "Search by Name";        Desc = "Filter software by keyword & remove" }
        @{ Num = "3"; Title = "Clean & Leftover Wipe"; Desc = "Uninstall with AppData/ProgramData wipe" }
        @{ Num = "4"; Title = "Uninstall UWP Apps";    Desc = "Remove Windows Store Appx packages" }
        @{ Num = "5"; Title = "Deep Residue Scan";     Desc = "Inspect orphaned leftover folders" }
    )

    do {
        Show-Banner
        Show-ModuleHeader -ModuleTitle "MODULE 12: APP UNINSTALLER & LEFTOVER CLEANER" -Subtitle "Batch Multi-Select Uninstall • AppData & ProgramData Leftover Residue Wipe"
        Show-OptionTable -Options $options -PromptRange "0-5"
        $uChoice = Read-Host

        switch ($uChoice) {
            "1" {
                Write-InfoMessage "Scanning installed desktop applications..."
                $apps = Get-InstalledSoftwareList
                Invoke-BatchUninstallFlow -SoftwareList $apps
            }
            "2" {
                Write-Host ""
                Write-Host "  Enter application name or keyword to search: " -ForegroundColor Cyan -NoNewline
                $query = Read-Host
                if (-not [string]::IsNullOrWhiteSpace($query)) {
                    Write-InfoMessage "Searching installed software for '$query'..."
                    $apps = Get-InstalledSoftwareList -FilterKeyword $query
                    if ($apps.Count -gt 0) {
                        Invoke-BatchUninstallFlow -SoftwareList $apps
                    } else {
                        Write-WarningMessage "No applications found matching '$query'."
                        Pause-Toolkit
                    }
                }
            }
            "3" {
                Write-InfoMessage "Scanning installed applications for Clean Uninstall + Leftover Wipe..."
                $apps = Get-InstalledSoftwareList
                Invoke-BatchUninstallFlow -SoftwareList $apps -DeepClean
            }
            "4" {
                Show-Banner
                Write-Section "Windows Store (UWP / Appx) Applications"
                Write-InfoMessage "Querying provisioned and installed UWP packages..."
                $uwpApps = Get-AppxPackage -AllUsers -ErrorAction SilentlyContinue | Where-Object { 
                    -not $_.IsFramework -and -not $_.NonRemovable -and $_.Name -notmatch "^Microsoft\.(Windows|UI|NET|VCLibs|DirectX)"
                } | Sort-Object Name

                if ($uwpApps.Count -eq 0) {
                    Write-InfoMessage "No removable user UWP packages found."
                    Pause-Toolkit
                    break
                }

                $idx = 1
                $uwpMap = @()
                Write-Host "  ┌─────┬────────────────────────────────────────────────────────┐" -ForegroundColor Cyan
                Write-Host "  │ #   │ UWP PACKAGE NAME                                       │" -ForegroundColor Cyan
                Write-Host "  ├─────┼────────────────────────────────────────────────────────┤" -ForegroundColor DarkCyan
                foreach ($u in $uwpApps) {
                    $uName = $u.Name
                    if ($uName.Length -gt 54) { $uName = $uName.Substring(0, 51) + "..." }
                    $uName = $uName.PadRight(54)
                    $numPad = "[$idx]".PadRight(4)
                    Write-Host "  │ $numPad│ $uName │" -ForegroundColor White
                    $uwpMap += [PSCustomObject]@{ Index = $idx; Package = $u }
                    $idx++
                }
                Write-Host "  └─────┴────────────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
                Write-Host ""
                Write-Host "  Enter UWP app numbers to uninstall (e.g. 1, 3, 5 or 0 to Cancel): " -ForegroundColor Cyan -NoNewline
                $uwpInput = Read-Host

                if (-not [string]::IsNullOrWhiteSpace($uwpInput) -and $uwpInput -ne "0") {
                    $nums = [regex]::Split($uwpInput, "[,\s]+") | Where-Object { $_ -match "^\d+$" } | ForEach-Object { [int]$_ }
                    foreach ($n in $nums) {
                        $match = $uwpMap | Where-Object { $_.Index -eq $n }
                        if ($match) {
                            Write-InfoMessage "Removing UWP Package: $($match.Package.Name)..."
                            Remove-AppxPackage -Package $match.Package.PackageFullName -AllUsers -ErrorAction SilentlyContinue
                            Write-Success "Removed UWP Package: $($match.Package.Name)"
                        }
                    }
                }
                Pause-Toolkit
            }
            "5" {
                Write-Host ""
                Write-Host "  Enter App / Vendor name to scan for orphaned folders: " -ForegroundColor Cyan -NoNewline
                $kw = Read-Host
                if (-not [string]::IsNullOrWhiteSpace($kw)) {
                    Invoke-DeepLeftoverCleanup -AppName $kw
                }
                Pause-Toolkit
            }
        }
    } while ($uChoice -ne "0")
}

# ============================================================================
# MAIN ENTRY LOOP
# ============================================================================

function Start-Toolkit {
    try {
        $Host.UI.RawUI.WindowTitle = "$ToolkitName v$ToolkitVersion"
    } catch {}

    # Check for administrative privileges at startup
    if (-not (Test-IsAdmin)) {
        Clear-Host
        Write-Host ""
        Write-Host "  ┌────────────────────────────────────────────────────────────────────────┐" -ForegroundColor Yellow
        Write-Host "  │  ADMINISTRATIVE PRIVILEGES REQUIRED                                    │" -ForegroundColor Yellow
        Write-Host "  ├────────────────────────────────────────────────────────────────────────┤" -ForegroundColor Yellow
        Write-Host "  │  Administrator rights are required to install software and configure   │" -ForegroundColor White
        Write-Host "  │  system settings without errors or secondary popup windows.            │" -ForegroundColor White
        Write-Host "  │                                                                        │" -ForegroundColor White
        Write-Host "  │  Relaunching in a single elevated Administrator window...              │" -ForegroundColor Cyan
        Write-Host "  └────────────────────────────────────────────────────────────────────────┘" -ForegroundColor Yellow
        Write-Host ""
        Start-Sleep -Seconds 1

        try {
            $launchCmd = "irm $Script:LauncherUrl | iex"
            Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `"$launchCmd`""
            exit
        } catch {
            Write-ErrorMessage "Elevation was cancelled or denied: $($_.Exception.Message)"
            Write-WarningMessage "Running in restricted mode. Some modules may fail without Administrator rights."
            Pause-Toolkit
        }
    }

    do {
        Show-MainMenu
        Write-Host "  Select an option [0-12]: " -ForegroundColor Cyan -NoNewline
        $mainChoice = Read-Host

        switch ($mainChoice) {
            "1"  { Show-SoftwareMenu }
            "2"  { Show-DebloatMenu }
            "3"  { Show-PerformanceMenu }
            "4"  { Show-SafetyMenu }
            "5"  { Show-DeveloperMenu }
            "6"  { Show-BatteryMenu }
            "7"  { Show-RepairMenu }
            "8"  { Show-CleanupMenu }
            "9"  { Show-NetworkMenu }
            "10" { Show-SystemMenu }
            "11" { Show-QuickMenu }
            "12" { Show-UninstallerMenu }
            "0"  {
                Clear-Host
                Write-Host ""
                Write-Host "  Thank you for using ItsRiRx Windows Tool Kit!" -ForegroundColor Cyan
                Write-Host "  Session ended. Have a productive day." -ForegroundColor White
                Write-Host ""
                return
            }
            default {
                Write-WarningMessage "Invalid option. Please enter a number between 0 and 12."
                Start-Sleep -Milliseconds 600
            }
        }
    } while ($true)
}

# Launch the toolkit
Start-Toolkit
