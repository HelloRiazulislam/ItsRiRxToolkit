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
$ToolkitVersion = "1.1.0"
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
    # 1. Web Browsers
    "Google Chrome"       = @{ Id = "Google.Chrome"; Name = "Google Chrome"; Category = "Web Browsers" }
    "Mozilla Firefox"     = @{ Id = "Mozilla.Firefox"; Name = "Mozilla Firefox"; Category = "Web Browsers" }
    "Microsoft Edge"      = @{ Id = "Microsoft.Edge"; Name = "Microsoft Edge"; Category = "Web Browsers" }
    "Brave"               = @{ Id = "Brave.Brave"; Name = "Brave Browser"; Category = "Web Browsers" }
    "Opera"               = @{ Id = "Opera.Opera"; Name = "Opera Browser"; Category = "Web Browsers" }

    # 2. Developer & Coding
    "VS Code"             = @{ Id = "Microsoft.VisualStudioCode"; Name = "Visual Studio Code"; Category = "Developer & Coding" }
    "Git"                 = @{ Id = "Git.Git"; Name = "Git for Windows"; Category = "Developer & Coding" }
    "Python"              = @{ Id = "Python.Python.3.14"; Name = "Python"; Category = "Developer & Coding" }
    "Node.js"             = @{ Id = "OpenJS.NodeJS.LTS"; Name = "Node.js (LTS)"; Category = "Developer & Coding" }
    "Notepad++"           = @{ Id = "Notepad++.Notepad++"; Name = "Notepad++"; Category = "Developer & Coding" }

    # 3. Multimedia
    "VLC Media Player"    = @{ Id = "VideoLAN.VLC"; Name = "VLC Media Player"; Category = "Multimedia" }
    "Spotify"             = @{ Id = "Spotify.Spotify"; Name = "Spotify Music"; Category = "Multimedia" }
    "OBS Studio"          = @{ Id = "OBSProject.OBSStudio"; Name = "OBS Studio"; Category = "Multimedia" }
    "Audacity"            = @{ Id = "Audacity.Audacity"; Name = "Audacity Audio Editor"; Category = "Multimedia" }
    "HandBrake"           = @{ Id = "HandBrake.HandBrake"; Name = "HandBrake Video Transcoder"; Category = "Multimedia" }

    # 4. Utilities & Tools
    "7-Zip"               = @{ Id = "7zip.7zip"; Name = "7-Zip Archiver"; Category = "Utilities & Tools" }
    "WinRAR"              = @{ Id = "RARLab.WinRAR"; Name = "WinRAR"; Category = "Utilities & Tools" }
    "Everything"          = @{ Id = "voidtools.Everything"; Name = "Everything Search"; Category = "Utilities & Tools" }
    "Microsoft PowerToys" = @{ Id = "Microsoft.PowerToys"; Name = "Microsoft PowerToys"; Category = "Utilities & Tools" }
    "Rufus"               = @{ Id = "Rufus.Rufus"; Name = "Rufus USB Creator"; Category = "Utilities & Tools" }
    "ShareX"              = @{ Id = "ShareX.ShareX"; Name = "ShareX Screen Capture"; Category = "Utilities & Tools" }
    "Avro Keyboard"       = @{ Id = "OmicronLab.Avro"; Name = "Avro Keyboard"; Category = "Utilities & Tools" }

    # 5. Communication
    "WhatsApp"            = @{ Id = "WhatsApp.WhatsApp"; Name = "WhatsApp Desktop"; Category = "Communication" }
    "Telegram"            = @{ Id = "Telegram.TelegramDesktop"; Name = "Telegram Desktop"; Category = "Communication" }
    "Discord"             = @{ Id = "Discord.Discord"; Name = "Discord"; Category = "Communication" }
    "Zoom"                = @{ Id = "Zoom.Zoom"; Name = "Zoom Workplace"; Category = "Communication" }
    "Microsoft Teams"     = @{ Id = "Microsoft.Teams"; Name = "Microsoft Teams"; Category = "Communication" }

    # 6. Gaming
    "Steam"               = @{ Id = "Valve.Steam"; Name = "Steam Client"; Category = "Gaming" }
    "Epic Games"          = @{ Id = "EpicGames.EpicGamesLauncher"; Name = "Epic Games Launcher"; Category = "Gaming" }
    "EA App"              = @{ Id = "ElectronicArts.EADesktop"; Name = "EA Desktop App"; Category = "Gaming" }
    "Ubisoft Connect"     = @{ Id = "Ubisoft.Connect"; Name = "Ubisoft Connect"; Category = "Gaming" }
    "Riot Client"         = @{ Id = "RiotGames.RiotClient"; Name = "Riot Client"; Category = "Gaming" }
    "Xbox"                = @{ Id = "Microsoft.GamingApp"; Name = "Xbox App"; Category = "Gaming" }

    # 7. Security & Privacy
    "Bitwarden"           = @{ Id = "Bitwarden.Bitwarden"; Name = "Bitwarden Password Manager"; Category = "Security & Privacy" }
    "Malwarebytes"        = @{ Id = "Malwarebytes.Malwarebytes"; Name = "Malwarebytes Anti-Malware"; Category = "Security & Privacy" }
    "Proton VPN"          = @{ Id = "Proton.ProtonVPN"; Name = "Proton VPN"; Category = "Security & Privacy" }

    # 8. Remote Access & IT
    "AnyDesk"             = @{ Id = "AnyDeskSoftwareGmbH.AnyDesk"; Name = "AnyDesk Remote Desktop"; Category = "Remote Access & IT" }
    "TeamViewer"          = @{ Id = "TeamViewer.TeamViewer"; Name = "TeamViewer Remote"; Category = "Remote Access & IT" }
    "RustDesk"            = @{ Id = "RustDesk.RustDesk"; Name = "RustDesk Open Source Remote"; Category = "Remote Access & IT" }
    "PuTTY"               = @{ Id = "PuTTY.PuTTY"; Name = "PuTTY SSH Client"; Category = "Remote Access & IT" }
    "WinSCP"              = @{ Id = "WinSCP.WinSCP"; Name = "WinSCP SFTP Client"; Category = "Remote Access & IT" }

    # 9. Office & Productivity
    "Microsoft 365"       = @{ Id = "Microsoft.Office"; Name = "Microsoft 365 Office Suite"; Category = "Office & Productivity" }
    "LibreOffice"         = @{ Id = "TheDocumentFoundation.LibreOffice"; Name = "LibreOffice"; Category = "Office & Productivity" }
    "Adobe Acrobat Reader"= @{ Id = "Adobe.Acrobat.Reader.64-bit"; Name = "Adobe Acrobat Reader"; Category = "Office & Productivity" }
    "Notion"              = @{ Id = "Notion.Notion"; Name = "Notion Workspace"; Category = "Office & Productivity" }
}

# Categorized Package Packs matching the 9 domains
$Script:PackageGroups = [ordered]@{
    "Browsers"       = @("Google Chrome", "Mozilla Firefox", "Microsoft Edge", "Brave", "Opera")
    "Developer"      = @("VS Code", "Git", "Python", "Node.js", "Notepad++")
    "Multimedia"     = @("VLC Media Player", "Spotify", "OBS Studio", "Audacity", "HandBrake")
    "Utilities"      = @("7-Zip", "WinRAR", "Everything", "Microsoft PowerToys", "Rufus", "ShareX", "Avro Keyboard")
    "Communication"  = @("WhatsApp", "Telegram", "Discord", "Zoom", "Microsoft Teams")
    "Gaming"         = @("Steam", "Epic Games", "EA App", "Ubisoft Connect", "Riot Client", "Xbox")
    "Security"       = @("Bitwarden", "Malwarebytes", "Proton VPN")
    "RemoteIT"       = @("AnyDesk", "TeamViewer", "RustDesk", "PuTTY", "WinSCP")
    "Office"         = @("Microsoft 365", "LibreOffice", "Adobe Acrobat Reader", "Notion")
    "Essential"      = @("Google Chrome", "Mozilla Firefox", "Notepad++", "Python", "7-Zip", "VLC Media Player", "Avro Keyboard")
}

# DNS Provider Presets
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
    Write-Host "  [OK]   $Message" -ForegroundColor Green
}

function Write-InfoMessage {
    param([string]$Message)
    Write-Host "  [INFO] $Message" -ForegroundColor Cyan
}

function Write-WarningMessage {
    param([string]$Message)
    Write-Host "  [WARN] $Message" -ForegroundColor Yellow
}

function Write-ErrorMessage {
    param([string]$Message)
    Write-Host "  [FAIL] $Message" -ForegroundColor Red
}

function Write-SkipMessage {
    param([string]$Message)
    Write-Host "  [SKIP] $Message" -ForegroundColor DarkGray
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "--- $Title ---" -ForegroundColor Cyan
    Write-Host ""
}

function Pause-Toolkit {
    Write-Host ""
    Write-Host "Press any key to return to menu..." -ForegroundColor DarkGray -NoNewline
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
# BANNER & REGULAR MAIN MENU
# ============================================================================

function Show-Banner {
    Clear-Host
    $isAdmin = Test-IsAdmin
    $adminStatus = if ($isAdmin) { "Administrator [ELEVATED]" } else { "Standard User [RESTRICTED]" }
    $adminColor  = if ($isAdmin) { "Green" } else { "Yellow" }
    
    Write-Host ""
    Write-Host "  ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗" -ForegroundColor Cyan
    Write-Host "  ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝" -ForegroundColor Cyan
    Write-Host "  ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT" -ForegroundColor White
    Write-Host "  ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.1.0" -ForegroundColor White
    Write-Host "  ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗" -ForegroundColor Cyan
    Write-Host "  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝" -ForegroundColor Cyan
    Write-Host "  ══════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
    Write-Host "  Status: " -NoNewline -ForegroundColor DarkGray
    Write-Host "$adminStatus" -NoNewline -ForegroundColor $adminColor
    Write-Host " | Host: $env:COMPUTERNAME | User: $env:USERNAME" -ForegroundColor DarkGray
    Write-Host "  ══════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
    Write-Host ""
}

# Beautiful structured main navigation dashboard
function Show-MainMenu {
    Show-Banner
    Write-Host "  ╔════════════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor DarkCyan
    Write-Host "  ║  ⚡ SYSTEM ADMINISTRATION & MAINTENANCE DASHBOARD                                  ║" -ForegroundColor Cyan
    Write-Host "  ╚════════════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  ┌──────┬────────────────────────────┬────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
    Write-Host "  │ NUM  │ MODULE & LOGO              │ DESCRIPTION & CAPABILITIES                     │" -ForegroundColor Cyan
    Write-Host "  ├──────┼────────────────────────────┼────────────────────────────────────────────────┤" -ForegroundColor DarkCyan
    Write-Host "  │ [1]  │ 📦 Software Installer      │ 9 Curated categories with Winget checkboxes    │" -ForegroundColor White
    Write-Host "  │ [2]  │ 🚀 Debloat & Privacy       │ Telemetry, Bing in Start, Classic Context Menu │" -ForegroundColor White
    Write-Host "  │ [3]  │ ⚡ Performance & Gaming    │ Ultimate Power Plan, Game DVR, Mouse 1:1 Fix   │" -ForegroundColor White
    Write-Host "  │ [4]  │ 🛡️ Safety & Restore        │ 1-Click Restore Point, Open Ports, Defender    │" -ForegroundColor White
    Write-Host "  │ [5]  │ 💻 Developer Tools         │ WSL2, Windows Sandbox, Hyper-V Virtualization  │" -ForegroundColor White
    Write-Host "  │ [6]  │ 🔋 Battery & Power         │ HTML Battery Health Report, Wear Level, Sleep  │" -ForegroundColor White
    Write-Host "  │ [7]  │ 🔧 Windows System Repair   │ SFC Scannow, DISM RestoreHealth, Update Repair │" -ForegroundColor White
    Write-Host "  │ [8]  │ 🧹 Disk Cleanup & Storage  │ Temp Cleaner, Top 15 Largest Files, SSD TRIM   │" -ForegroundColor White
    Write-Host "  │ [9]  │ 🌐 Network Diagnostics     │ 3-Point Connectivity, DNS Switcher, Flush DNS  │" -ForegroundColor White
    Write-Host "  │ [10] │ 🎛️ System Info & Utilities │ CIM Hardware specs, License status, TaskMgr    │" -ForegroundColor White
    Write-Host "  │ [11] │ ⚡ Quick Emergency Actions │ 1-Click DNS flush, Explorer restart, ping test │" -ForegroundColor White
    Write-Host "  └──────┴────────────────────────────┴────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  [0] 🚪 Exit Toolkit (Return to prompt)" -ForegroundColor DarkGray
    Write-Host ""
}

# ============================================================================
# MODULE 1: SOFTWARE SELECTOR & INSTALLER (WITH CHECKBOXES & FINAL CONFIRMATION)
# ============================================================================

function Test-Winget {
    $cmd = Get-Command winget -ErrorAction SilentlyContinue
    if (-not $cmd) {
        Write-ErrorMessage "Winget is not available on this computer."
        Write-InfoMessage "App Installer from Microsoft Store or GitHub is required:"
        Write-InfoMessage "https://github.com/microsoft/winget-cli/releases"
        return $false
    }
    return $true
}

function Get-InstalledPackage {
    param([string]$PackageId)
    
    if ($Script:InstalledCache.ContainsKey($PackageId)) {
        return $Script:InstalledCache[$PackageId]
    }

    try {
        $result = & winget list --id $PackageId --exact --accept-source-agreements 2>$null
        if ($LASTEXITCODE -eq 0 -and ($result -match [regex]::Escape($PackageId))) {
            $Script:InstalledCache[$PackageId] = $true
            return $true
        }
    }
    catch {}

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
    Write-InfoMessage "Scanning system status and preparing application checkboxes..."
    Write-Host ""

    $appsData = @()
    $idx = 1

    Write-Host "  ┌─────┬───────┬──────────────┬────────────────────────┬─────────────────────┐" -ForegroundColor Cyan
    Write-Host "  │ #   │ SELECT│ STATUS       │ APPLICATION NAME       │ WINGET PACKAGE ID   │" -ForegroundColor Cyan
    Write-Host "  ├─────┼───────┼──────────────┼────────────────────────┼─────────────────────┤" -ForegroundColor Cyan

    foreach ($key in $PackageKeys) {
        if ($Script:SoftwareCatalog.Contains($key)) {
            $pkg = $Script:SoftwareCatalog[$key]
            $isInstalled = Get-InstalledPackage -PackageId $pkg.Id
            
            $boxSymbol  = if ($isInstalled) { "[OK]" } else { "[ ]" }
            $boxColor   = if ($isInstalled) { "DarkGray" } else { "Yellow" }
            $statusText = if ($isInstalled) { "INSTALLED" } else { "AVAILABLE" }
            $statusColor = if ($isInstalled) { "Green" } else { "Cyan" }
            
            $numPad = "[$idx]".PadRight(4)
            $namePad = $pkg.Name.PadRight(22)
            if ($namePad.Length -gt 22) { $namePad = $namePad.Substring(0, 19) + "..." }
            $idPad = $pkg.Id.PadRight(19)
            if ($idPad.Length -gt 19) { $idPad = $idPad.Substring(0, 16) + "..." }

            Write-Host "  │ $numPad│ " -NoNewline -ForegroundColor Cyan
            Write-Host "$boxSymbol" -NoNewline -ForegroundColor $boxColor
            Write-Host "   │ " -NoNewline -ForegroundColor Cyan
            Write-Host "$statusText".PadRight(13) -NoNewline -ForegroundColor $statusColor
            Write-Host "│ $namePad │ $idPad │" -ForegroundColor White

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
    Write-Host "  └─────┴───────┴──────────────┴────────────────────────┴─────────────────────┘" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  INSTRUCTIONS:" -ForegroundColor Yellow
    Write-Host "    - Type the numbers of the apps you want to install (e.g. 1, 3, 5 or 2 4)" -ForegroundColor White
    Write-Host "    - Type 'A' or 'ALL' to select all available uninstalled applications" -ForegroundColor White
    Write-Host "    - Type '0' to Cancel and return without installing anything" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  Enter app numbers to install: " -ForegroundColor Cyan -NoNewline
    $inputRaw = Read-Host

    if ([string]::IsNullOrWhiteSpace($inputRaw) -or $inputRaw -eq "0") {
        Write-Host ""
        Write-InfoMessage "No applications selected. Returning to menu."
        Pause-Toolkit
        return
    }

    $selectedApps = @()

    if ($inputRaw.Trim().ToUpper() -in @("A", "ALL")) {
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
        Write-WarningMessage "No valid application numbers were entered."
        Pause-Toolkit
        return
    }

    $appNamesList = ($selectedApps | ForEach-Object { $_.Name }) -join ", "

    # Final Confirmation Screen
    Show-Banner
    Write-Host ""
    Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "  ║                 FINAL INSTALLATION CONFIRMATION                    ║" -ForegroundColor Yellow
    Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Yellow
    Write-Host "  ║                                                                    ║" -ForegroundColor Yellow
    
    $confirmLine = "  Installing: $appNamesList"
    if ($confirmLine.Length -gt 66) { 
        Write-Host ("  ║  Installing:".PadRight(71) + "║") -ForegroundColor White
        foreach ($item in $selectedApps) {
            $subLine = "     [X] $($item.Name) [$($item.Id)]"
            if ($subLine.Length -gt 66) { $subLine = $subLine.Substring(0, 63) + "..." }
            Write-Host ("  ║" + $subLine.PadRight(68) + "║") -ForegroundColor Cyan
        }
    } else {
        Write-Host ("  ║" + $confirmLine.PadRight(68) + "║") -ForegroundColor Cyan
    }

    Write-Host "  ║                                                                    ║" -ForegroundColor Yellow
    Write-Host "  ║  Total: $($selectedApps.Count) application(s) will be installed via Winget.       ║" -ForegroundColor White
    Write-Host "  ║  No files will be installed unless you confirm below.              ║" -ForegroundColor Yellow
    Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Installing: $appNamesList. Proceed? [Y/N]: " -ForegroundColor Green -NoNewline
    $finalProceed = Read-Host

    if ($finalProceed -notmatch "^[Yy]$") {
        Write-Host ""
        Write-InfoMessage "Installation aborted by user. Zero changes made to system."
        Pause-Toolkit
        return
    }

    Write-Host ""
    Write-Section "Installing $($selectedApps.Count) Selected Application(s) via Winget"

    $successCount = 0
    $skipCount    = 0
    $failCount    = 0

    foreach ($item in $selectedApps) {
        Write-Host ""
        Write-InfoMessage "Starting: $($item.Name) ($($item.Id))..."
        
        $isInstalled = Get-InstalledPackage -PackageId $item.Id
        if ($isInstalled) {
            Write-SkipMessage "$($item.Name) - Already installed"
            $skipCount++
            continue
        }

        Write-Host "  Invoking winget install --id=$($item.Id)..." -ForegroundColor DarkCyan
        try {
            $process = Start-Process -FilePath "winget" `
                -ArgumentList @("install", "--id=$($item.Id)", "-e", "--silent", "--accept-package-agreements", "--accept-source-agreements") `
                -NoNewWindow -Wait -PassThru

            if ($process.ExitCode -eq 0) {
                Write-Success "$($item.Name) - Installed successfully!"
                $Script:InstalledCache[$item.Id] = $true
                $successCount++
            } else {
                Write-ErrorMessage "$($item.Name) - Installation failed (Exit code: $($process.ExitCode))"
                $failCount++
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
    do {
        Show-Banner
        Write-Host "  ╔════════════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor DarkCyan
        Write-Host "  ║  📦 MODULE 1: SOFTWARE INSTALLER (WINGET APPLICATION CATALOG)                      ║" -ForegroundColor Cyan
        Write-Host "  ║  Interactive Checkboxes • Zero Auto-Install • Safe Approval Flow                   ║" -ForegroundColor DarkGray
        Write-Host "  ╚════════════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor DarkCyan
        Write-Host ""
        Write-Host "  ┌──────┬────────────────────────────┬────────────────────────────────────────────────┐" -ForegroundColor DarkCyan
        Write-Host "  │ NUM  │ CATEGORY & LOGO            │ INCLUDED TOP APPLICATIONS                      │" -ForegroundColor Cyan
        Write-Host "  ├──────┼────────────────────────────┼────────────────────────────────────────────────┤" -ForegroundColor DarkCyan
        Write-Host "  │ [1]  │ 🌐 Web Browsers            │ Chrome, Firefox, Edge, Brave, Opera            │" -ForegroundColor White
        Write-Host "  │ [2]  │ 💻 Developer & Coding      │ VS Code, Git, Python, Node.js, Notepad++       │" -ForegroundColor White
        Write-Host "  │ [3]  │ 🎬 Multimedia & Creators   │ VLC Media Player, Spotify, OBS, HandBrake      │" -ForegroundColor White
        Write-Host "  │ [4]  │ 🛠️ Utilities & Tools       │ 7-Zip, WinRAR, Everything, PowerToys, Rufus    │" -ForegroundColor White
        Write-Host "  │ [5]  │ 💬 Communication & Chat    │ WhatsApp, Telegram, Discord, Zoom, Teams       │" -ForegroundColor White
        Write-Host "  │ [6]  │ 🎮 Gaming Launchers        │ Steam, Epic Games, EA App, Ubisoft, Riot, Xbox │" -ForegroundColor White
        Write-Host "  │ [7]  │ 🔐 Security & Privacy      │ Bitwarden, Malwarebytes, Proton VPN            │" -ForegroundColor White
        Write-Host "  │ [8]  │ 🖥️ Remote Access & IT      │ AnyDesk, TeamViewer, RustDesk, PuTTY, WinSCP   │" -ForegroundColor White
        Write-Host "  │ [9]  │ 📄 Office & Productivity   │ Microsoft 365, LibreOffice, Adobe, Notion      │" -ForegroundColor White
        Write-Host "  ├──────┼────────────────────────────┼────────────────────────────────────────────────┤" -ForegroundColor DarkCyan
        Write-Host "  │ [10] │ 📦 Essential Applications  │ Curated instant pack for fresh Windows setup   │" -ForegroundColor Cyan
        Write-Host "  │ [11] │ 📚 Complete Catalog (All)  │ Browse and select from all verified packages   │" -ForegroundColor Cyan
        Write-Host "  │ [12] │ 🔍 Audit Installed Apps    │ Scan current PC for installed vs missing apps  │" -ForegroundColor DarkGray
        Write-Host "  │ [13] │ 🔄 Refresh Winget Sources  │ Update winget catalog cache definitions        │" -ForegroundColor DarkGray
        Write-Host "  └──────┴────────────────────────────┴────────────────────────────────────────────────┘" -ForegroundColor DarkCyan
        Write-Host ""
        Write-Host "  [0] 🚪 Return to Main Dashboard" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-13]: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Browsers"] -GroupTitle "Web Browsers" }
            "2"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Developer"] -GroupTitle "Developer & Coding" }
            "3"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Multimedia"] -GroupTitle "Multimedia" }
            "4"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Utilities"] -GroupTitle "Utilities & Tools" }
            "5"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Communication"] -GroupTitle "Communication" }
            "6"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Gaming"] -GroupTitle "Gaming Launchers" }
            "7"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Security"] -GroupTitle "Security & Privacy" }
            "8"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["RemoteIT"] -GroupTitle "Remote Access & IT" }
            "9"  { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Office"] -GroupTitle "Office & Productivity" }
            "10" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Essential"] -GroupTitle "Essential Quick Pack" }
            "11" { Show-SoftwareSelector -PackageKeys @($Script:SoftwareCatalog.Keys) -GroupTitle "Complete Software Catalog" }
            "12" {
                if (-not (Test-Winget)) { Pause-Toolkit; break }
                Show-Banner
                Write-Section "Checking Installation Status of Catalog Applications"
                foreach ($k in $Script:SoftwareCatalog.Keys) {
                    $pkg = $Script:SoftwareCatalog[$k]
                    $installed = Get-InstalledPackage -PackageId $pkg.Id
                    if ($installed) {
                        Write-Host "  [INSTALLED] " -ForegroundColor Green -NoNewline
                    } else {
                        Write-Host "  [MISSING]   " -ForegroundColor DarkGray -NoNewline
                    }
                    Write-Host "$($pkg.Name) ($($pkg.Id))"
                }
                Pause-Toolkit
            }
            "13" {
                if (-not (Test-Winget)) { Pause-Toolkit; break }
                Write-Section "Refreshing Winget Package Sources"
                & winget source update
                Write-Success "Winget sources updated successfully."
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 2: DEBLOAT & PRIVACY HARDENING
# ============================================================================

function Show-DebloatMenu {
    do {
        Show-Banner
        Write-Host "  --- MODULE 2: DEBLOAT & PRIVACY HARDENING ---" -ForegroundColor Cyan
        Write-Host "  Fine-tune Windows tracking, telemetry, and unwanted modern OS clutter." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  [1]  Disable Telemetry & Diagnostic Data Tracking (Safe registry tweaks)" -ForegroundColor White
        Write-Host "  [2]  Disable Bing Search & Web Results in Start Menu (Speeds up search)" -ForegroundColor White
        Write-Host "  [3]  Restore Classic Windows 10 Context Menu in Windows 11 (Remove 'Show more options')" -ForegroundColor White
        Write-Host "  [4]  Revert to Modern Windows 11 Context Menu (Restore default)" -ForegroundColor White
        Write-Host "  [5]  Disable Cortana & Search Telemetry" -ForegroundColor White
        Write-Host "  [6]  Disable Activity History & Advertising ID" -ForegroundColor White
        Write-Host "  [7]  Remove Pre-Installed UWP Bloatware (Feedback Hub, Tips, Maps, Weather, Xbox Game Bar)" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-7]: " -ForegroundColor Cyan -NoNewline
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
    do {
        Show-Banner
        Write-Host "  --- MODULE 3: PERFORMANCE & GAMING OPTIMIZATION ---" -ForegroundColor Cyan
        Write-Host "  Maximize system latency, unlock power limits, and eliminate input delays." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  [1]  Unlock & Activate 'Ultimate Performance' Power Scheme" -ForegroundColor White
        Write-Host "  [2]  Activate 'High Performance' Power Scheme" -ForegroundColor White
        Write-Host "  [3]  Disable Windows Game DVR / Background Screen Recording (Boosts FPS)" -ForegroundColor White
        Write-Host "  [4]  Disable Mouse Acceleration (1:1 Raw Input Precision)" -ForegroundColor White
        Write-Host "  [5]  Optimize Visual Effects for Performance (Disable unnecessary animations)" -ForegroundColor White
        Write-Host "  [6]  Disable Windows Search Indexing for Drive C: (Reduces SSD load)" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-6]: " -ForegroundColor Cyan -NoNewline
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
    do {
        Show-Banner
        Write-Host "  --- MODULE 4: SYSTEM SAFETY & RESTORE POINTS ---" -ForegroundColor Cyan
        Write-Host "  Create safety checkpoints and monitor listening ports and security." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  [1]  Create 1-Click System Restore Point (Immediate snapshot)" -ForegroundColor White
        Write-Host "  [2]  List All Active System Restore Points" -ForegroundColor White
        Write-Host "  [3]  Monitor Active Listening TCP/UDP Ports & Associated Processes" -ForegroundColor White
        Write-Host "  [4]  Update Microsoft Defender Signatures" -ForegroundColor White
        Write-Host "  [5]  Run Microsoft Defender Quick Security Scan" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-5]: " -ForegroundColor Cyan -NoNewline
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
    do {
        Show-Banner
        Write-Host "  --- MODULE 5: DEVELOPER & VIRTUALIZATION FEATURES ---" -ForegroundColor Cyan
        Write-Host "  Enable native Windows virtualization, WSL2, and Sandbox with one command." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  [1]  Enable WSL 2 (Windows Subsystem for Linux)" -ForegroundColor White
        Write-Host "  [2]  Enable Windows Sandbox (Isolated testing environment)" -ForegroundColor White
        Write-Host "  [3]  Enable Hyper-V Hypervisor & Management Tools" -ForegroundColor White
        Write-Host "  [4]  Enable Virtual Machine Platform" -ForegroundColor White
        Write-Host "  [5]  Check Status of Windows Virtualization Features" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-5]: " -ForegroundColor Cyan -NoNewline
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
    do {
        Show-Banner
        Write-Host "  --- MODULE 6: BATTERY HEALTH & POWER DIAGNOSTICS ---" -ForegroundColor Cyan
        Write-Host "  Analyze battery degradation, cycle count, and background power drain." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  [1]  Generate & Open Full Battery Health Report (HTML)" -ForegroundColor White
        Write-Host "  [2]  Instant Battery Capacity & Wear Level Audit (Console view)" -ForegroundColor White
        Write-Host "  [3]  Generate Sleep Study Report (Identifies standby battery drain)" -ForegroundColor White
        Write-Host "  [4]  List All Available System Power Schemes" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-4]: " -ForegroundColor Cyan -NoNewline
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
    do {
        Show-Banner
        Write-Host "  --- MODULE 7: WINDOWS SYSTEM REPAIR ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1]  System File Checker (SFC /scannow repair corrupted files)" -ForegroundColor White
        Write-Host "  [2]  DISM Health Inspection (CheckHealth & ScanHealth)" -ForegroundColor White
        Write-Host "  [3]  DISM Restore Health (Download & repair corrupted image)" -ForegroundColor White
        Write-Host "  [4]  CHKDSK Inspection (Read-only file system check for Drive C:)" -ForegroundColor White
        Write-Host "  [5]  Windows Update Repair (Purge SoftwareDistribution & restart services)" -ForegroundColor White
        Write-Host "  [6]  DISM Component Store Cleanup (Clean superseded packages)" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-6]: " -ForegroundColor Cyan -NoNewline
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
    do {
        Show-Banner
        Write-Host "  --- MODULE 8: DISK CLEANUP & ADVANCED STORAGE ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1]  Clean User Temporary Files ($env:TEMP)" -ForegroundColor White
        Write-Host "  [2]  Clean Windows System Temp ($env:SystemRoot\Temp)" -ForegroundColor White
        Write-Host "  [3]  Empty Recycle Bin (All drives)" -ForegroundColor White
        Write-Host "  [4]  Find Top 15 Largest Files on Drive C: (Locate hidden storage hogs)" -ForegroundColor White
        Write-Host "  [5]  Manual SSD TRIM & ReTrim Optimization (Optimize-Volume -ReTrim)" -ForegroundColor White
        Write-Host "  [6]  Launch Windows Native Disk Cleanup (cleanmgr.exe)" -ForegroundColor White
        Write-Host "  [7]  Clean Web Browser Caches (Chrome, Edge, Firefox)" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-7]: " -ForegroundColor Cyan -NoNewline
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
    do {
        Show-Banner
        Write-Host "  --- MODULE 9: NETWORK DIAGNOSTICS & DNS TOOLS ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1]  Show Active IP Configuration (IPv4, IPv6, Gateway, Adapters)" -ForegroundColor White
        Write-Host "  [2]  Ping Response Test (ICMP test to 8.8.8.8 or custom host)" -ForegroundColor White
        Write-Host "  [3]  3-Point Internet Connectivity Validation (Gateway, DNS, HTTPS)" -ForegroundColor White
        Write-Host "  [4]  Flush DNS Client Resolver Cache (Clear-DnsClientCache)" -ForegroundColor White
        Write-Host "  [5]  Switch DNS Server Provider (Cloudflare 1.1.1.1, Google 8.8.8.8, Quad9)" -ForegroundColor White
        Write-Host "  [6]  Show Hardware Network Adapters & Link Speeds" -ForegroundColor White
        Write-Host "  [7]  Show WiFi Interface & Signal Information" -ForegroundColor White
        Write-Host "  [8]  Show Saved WiFi Profiles (Safe display)" -ForegroundColor White
        Write-Host "  [9]  Perform Full Network Stack Reset (Winsock, IP, DNS flush)" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-9]: " -ForegroundColor Cyan -NoNewline
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
    do {
        Show-Banner
        Write-Host "  --- MODULE 10: SYSTEM INFO & UTILITIES ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1]  Windows OS & Uptime Details" -ForegroundColor White
        Write-Host "  [2]  Processor (CPU) Specifications & Physical Cores" -ForegroundColor White
        Write-Host "  [3]  Physical Memory (RAM) Module Frequencies & Slots" -ForegroundColor White
        Write-Host "  [4]  Graphics Adapters (GPU) & Video VRAM" -ForegroundColor White
        Write-Host "  [5]  Official Windows Activation & Licensing Status" -ForegroundColor White
        Write-Host "  [6]  Launch Task Manager (taskmgr.exe)" -ForegroundColor White
        Write-Host "  [7]  Launch Device Manager (devmgmt.msc)" -ForegroundColor White
        Write-Host "  [8]  Launch Registry Editor (regedit.exe)" -ForegroundColor White
        Write-Host "  [9]  Launch Windows Services Console (services.msc)" -ForegroundColor White
        Write-Host "  [10] Launch Disk Management (diskmgmt.msc)" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-10]: " -ForegroundColor Cyan -NoNewline
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
    do {
        Show-Banner
        Write-Host "  --- MODULE 11: INSTANT QUICK ACTIONS ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1]  Flush DNS Resolver Cache" -ForegroundColor White
        Write-Host "  [2]  Fast Internet Connectivity Test" -ForegroundColor White
        Write-Host "  [3]  Restart Windows Explorer Process (Clean fix for taskbar freeze)" -ForegroundColor White
        Write-Host "  [4]  Create Immediate System Restore Point" -ForegroundColor White
        Write-Host "  [5]  Install Essential Applications (Interactive Checkbox Selector)" -ForegroundColor White
        Write-Host ""
        Write-Host "  [0]  Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  Select an option [0-5]: " -ForegroundColor Cyan -NoNewline
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
# MAIN ENTRY LOOP
# ============================================================================

function Start-Toolkit {
    try {
        $Host.UI.RawUI.WindowTitle = "$ToolkitName v$ToolkitVersion"
    } catch {}

    do {
        Show-MainMenu
        Write-Host "  Select an option [0-11]: " -ForegroundColor Cyan -NoNewline
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
            "0"  {
                Clear-Host
                Write-Host ""
                Write-Host "  Thank you for using ItsRiRx Windows Tool Kit!" -ForegroundColor Cyan
                Write-Host "  Session ended. Have a productive day." -ForegroundColor White
                Write-Host ""
                return
            }
            default {
                Write-WarningMessage "Invalid option. Please enter a number between 0 and 11."
                Start-Sleep -Milliseconds 600
            }
        }
    } while ($true)
}

# Launch the toolkit
Start-Toolkit
