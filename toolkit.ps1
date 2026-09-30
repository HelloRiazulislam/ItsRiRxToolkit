# ============================================================================
#  ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗
#  ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝
#  ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT
#  ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.0.0
#  ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗
#  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
#  Remotely Hosted Windows Administration Suite
#  Compatibility: Windows PowerShell 5.1+, PowerShell 7+
# ============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Continue"

# Toolkit Metadata
$ToolkitName    = "ItsRiRx Windows Tool Kit"
$ToolkitShort   = "ItsRiRx Toolkit"
$ToolkitVersion = "1.0.0"
$ToolkitYear    = "2025"

# Determine Launcher URL (dynamically captures if run via irm <url> | iex or defaults)
if ($MyInvocation.Line -match "https?://[^\s|/]+(?:/[^\s|]+)*") {
    $Script:LauncherUrl = $Matches[0]
} else {
    $Script:LauncherUrl = "https://itsrirx-toolkit.vercel.app/i"
}

# Software Whitelist Definitions
$Script:SoftwareCatalog = [ordered]@{
    "Notepad++"       = @{ Id = "Notepad++.Notepad++"; Name = "Notepad++"; Category = "Utility/Editor" }
    "Google Chrome"   = @{ Id = "Google.Chrome"; Name = "Google Chrome"; Category = "Browser" }
    "Python"          = @{ Id = "Python.Python.3.14"; Name = "Python 3.14"; Category = "Developer" }
    "Mozilla Firefox" = @{ Id = "Mozilla.Firefox"; Name = "Mozilla Firefox"; Category = "Browser" }
    "WinRAR"          = @{ Id = "RARLab.WinRAR"; Name = "WinRAR"; Category = "Utility" }
    "VLC"             = @{ Id = "VideoLAN.VLC"; Name = "VLC Media Player"; Category = "Multimedia" }
    "Avro Keyboard"   = @{ Id = "OmicronLab.Avro"; Name = "Avro Keyboard"; Category = "Language/Utility" }
    "VS Code"         = @{ Id = "Microsoft.VisualStudioCode"; Name = "Visual Studio Code"; Category = "Developer" }
    "7-Zip"           = @{ Id = "7zip.7zip"; Name = "7-Zip Archiver"; Category = "Utility" }
    "Git"             = @{ Id = "Git.Git"; Name = "Git for Windows"; Category = "Developer" }
}

# Configurable Package Groups
$Script:PackageGroups = [ordered]@{
    "Essential"  = @("Notepad++", "Google Chrome", "Mozilla Firefox", "Python", "WinRAR", "VLC", "Avro Keyboard")
    "Browser"    = @("Google Chrome", "Mozilla Firefox")
    "Developer"  = @("Python", "VS Code", "Git", "Notepad++")
    "Multimedia" = @("VLC")
    "Utility"    = @("WinRAR", "7-Zip", "Notepad++", "Avro Keyboard")
}

# DNS Provider Presets
$Script:DnsPresets = [ordered]@{
    "1" = @{ Name = "Cloudflare DNS (1.1.1.1 / 1.0.0.1)"; Primary = "1.1.1.1"; Secondary = "1.0.0.1" }
    "2" = @{ Name = "Google Public DNS (8.8.8.8 / 8.8.4.4)"; Primary = "8.8.8.8"; Secondary = "8.8.4.4" }
    "3" = @{ Name = "Quad9 DNS (9.9.9.9 / 149.112.112.112)"; Primary = "9.9.9.9"; Secondary = "149.112.112.112" }
    "4" = @{ Name = "Automatic (DHCP - Restore Default)"; Primary = "DHCP"; Secondary = "" }
}

# Cache for installed packages to prevent repeated slow winget queries
$Script:InstalledCache = @{}

# ============================================================================
# HELPER FUNCTIONS: UI & CONSOLE
# ============================================================================

function Write-Success {
    param([string]$Message)
    Write-Host "  ✔  [OK]   $Message" -ForegroundColor Green
}

function Write-InfoMessage {
    param([string]$Message)
    Write-Host "  ℹ  [INFO] $Message" -ForegroundColor Cyan
}

function Write-WarningMessage {
    param([string]$Message)
    Write-Host "  ▲  [WARN] $Message" -ForegroundColor Yellow
}

function Write-ErrorMessage {
    param([string]$Message)
    Write-Host "  ✖  [FAIL] $Message" -ForegroundColor Red
}

function Write-SkipMessage {
    param([string]$Message)
    Write-Host "  ↷  [SKIP] $Message" -ForegroundColor DarkGray
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "┌──────────────────────────────────────────────────────────────────────┐" -ForegroundColor Cyan
    Write-Host "│ $Title" -ForegroundColor White
    Write-Host "└──────────────────────────────────────────────────────────────────────┘" -ForegroundColor Cyan
    Write-Host ""
}

function Pause-Toolkit {
    Write-Host ""
    Write-Host "  ────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  Press any key to return to menu..." -ForegroundColor DarkCyan -NoNewline
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
        Write-Host "  ⚠️  WARNING: $Warning" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "  👉 $Prompt [Y/N]: " -ForegroundColor Cyan -NoNewline
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
# GORGEOUS BANNER & MAIN MENU
# ============================================================================

function Show-Banner {
    Clear-Host
    $isAdmin = Test-IsAdmin
    $adminStatus = if ($isAdmin) { "ADMINISTRATOR [ELEVATED]" } else { "STANDARD USER [LIMITED]" }
    $adminColor  = if ($isAdmin) { "Green" } else { "Yellow" }
    
    Write-Host ""
    Write-Host "  ██╗████████╗███████╗██████╗ ██╗██████╗ ██╗  ██╗" -ForegroundColor Cyan
    Write-Host "  ██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗╚██╗██╔╝" -ForegroundColor Cyan
    Write-Host "  ██║   ██║   ███████╗██████╔╝██║██████╔╝ ╚███╔╝   WINDOWS TOOL KIT" -ForegroundColor White
    Write-Host "  ██║   ██║   ╚════██║██╔══██╗██║██╔══██╗ ██╔██╗   Version 1.0.0" -ForegroundColor White
    Write-Host "  ██║   ██║   ███████║██║  ██║██║██║  ██║██╔╝ ██╗" -ForegroundColor Cyan
    Write-Host "  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝" -ForegroundColor Cyan
    Write-Host "  ══════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
    
    Write-Host "  🛡️  STATUS : " -NoNewline -ForegroundColor DarkGray
    Write-Host "$adminStatus" -ForegroundColor $adminColor
    Write-Host "  💻 HOST   : $env:COMPUTERNAME | 👤 USER: $env:USERNAME" -ForegroundColor DarkGray
    Write-Host "  ══════════════════════════════════════════════════════════════════════" -ForegroundColor DarkCyan
    Write-Host ""
}

function Show-MainMenu {
    Show-Banner
    Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║                     SYSTEM CONTROL DASHBOARD                       ║" -ForegroundColor Cyan
    Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
    Write-Host "  ║   [1] 📦 Software Installer       • Interactive Winget Deployment  ║" -ForegroundColor White
    Write-Host "  ║   [2] 🌐 Network Tools            • Ping, DNS, WiFi, Stack Reset   ║" -ForegroundColor White
    Write-Host "  ║   [3] 🔧 Windows System Repair    • SFC, DISM Image & Update Fix   ║" -ForegroundColor White
    Write-Host "  ║   [4] 🧹 Deep Disk Cleanup        • User Temp, System & Caches     ║" -ForegroundColor White
    Write-Host "  ║   [5] 💻 System Information       • CIM CPU, RAM, GPU, Disk Audit  ║" -ForegroundColor White
    Write-Host "  ║   [6] ⚙️ Built-In Utilities       • TaskMgr, DevMgmt, Regedit      ║" -ForegroundColor White
    Write-Host "  ║   [7] 🎛️ Windows Configuration    • Hostname, Timezone, License    ║" -ForegroundColor White
    Write-Host "  ║   [8] ⚡ Instant Quick Actions    • One-Click System Maintenance   ║" -ForegroundColor White
    Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
    Write-Host "  ║   [0] 🚪 Exit Toolkit             • Return to PowerShell Prompt    ║" -ForegroundColor DarkGray
    Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
    Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
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

# Dedicated 'Software Selector' UI with Checkboxes & Explicit Confirmation
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
    Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║  📋 SOFTWARE SELECTOR: $GroupTitle".PadRight(71) + "║" -ForegroundColor Cyan
    Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-InfoMessage "Scanning system status and preparing application checkboxes..."
    Write-Host ""

    # Build application list with checkboxes
    $appsData = @()
    $idx = 1

    Write-Host "  ┌─────┬───────┬──────────────┬────────────────────────┬─────────────────────┐" -ForegroundColor Cyan
    Write-Host "  │ #   │ SELECT│ STATUS       │ APPLICATION NAME       │ WINGET PACKAGE ID   │" -ForegroundColor Cyan
    Write-Host "  ├─────┼───────┼──────────────┼────────────────────────┼─────────────────────┤" -ForegroundColor Cyan

    foreach ($key in $PackageKeys) {
        if ($Script:SoftwareCatalog.Contains($key)) {
            $pkg = $Script:SoftwareCatalog[$key]
            $isInstalled = Get-InstalledPackage -PackageId $pkg.Id
            
            $boxSymbol  = if ($isInstalled) { "[✔]" } else { "[ ]" }
            $boxColor   = if ($isInstalled) { "DarkGray" } else { "Yellow" }
            $statusText = if ($isInstalled) { "INSTALLED" } else { "AVAILABLE" }
            $statusColor = if ($isInstalled) { "Green" } else { "Cyan" }
            
            $numPad = "[$idx]".PadRight(4)
            $namePad = $pkg.Name.PadRight(22)
            $idPad = $pkg.Id.PadRight(19)

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
    Write-Host "  📝 INSTRUCTIONS:" -ForegroundColor Yellow
    Write-Host "     • Type the numbers of the apps you want to install (e.g. 1, 3, 5 or 2 4)" -ForegroundColor White
    Write-Host "     • Type 'A' or 'ALL' to select all available uninstalled applications" -ForegroundColor White
    Write-Host "     • Type '0' to Cancel and return without installing anything" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  👉 Enter app numbers to install: " -ForegroundColor Cyan -NoNewline
    $inputRaw = Read-Host

    if ([string]::IsNullOrWhiteSpace($inputRaw) -or $inputRaw -eq "0") {
        Write-Host ""
        Write-InfoMessage "No applications selected. Returning to menu."
        Pause-Toolkit
        return
    }

    # Parse selected indices
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

    # Build readable list of selected app names
    $appNamesList = ($selectedApps | ForEach-Object { $_.Name }) -join ", "

    # FINAL CONFIRMATION SCREEN
    Show-Banner
    Write-Host ""
    Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "  ║                 FINAL INSTALLATION CONFIRMATION                    ║" -ForegroundColor Yellow
    Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Yellow
    Write-Host "  ║                                                                    ║" -ForegroundColor Yellow
    
    $confirmLine = "  Installing: $appNamesList"
    if ($confirmLine.Length -gt 66) { 
        # Wrap line nicely if many apps selected
        Write-Host ("  ║  Installing:".PadRight(71) + "║") -ForegroundColor White
        foreach ($item in $selectedApps) {
            $subLine = "     [✔] $($item.Name) [$($item.Id)]"
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
    Write-Host "  👉 Installing: $appNamesList. Proceed? [Y/N]: " -ForegroundColor Green -NoNewline
    $finalProceed = Read-Host

    if ($finalProceed -notmatch "^[Yy]$") {
        Write-Host ""
        Write-InfoMessage "Installation aborted by user. Zero changes made to system."
        Pause-Toolkit
        return
    }

    # USER APPROVED - EXECUTE WINGET INSTALL
    Write-Host ""
    Write-Section "Installing $($selectedApps.Count) Selected Application(s) via Winget..."

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

        Write-Host "  ⚡ Invoking winget install --id=$($item.Id)..." -ForegroundColor DarkCyan
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

    # FINAL SUMMARY REPORT
    Write-Host ""
    Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║                     INSTALLATION REPORT SUMMARY                    ║" -ForegroundColor Cyan
    Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "  ║  ✔ Successful : $successCount".PadRight(71) + "║" -ForegroundColor Green
    Write-Host "  ║  ↷ Skipped    : $skipCount".PadRight(71) + "║" -ForegroundColor DarkGray
    Write-Host "  ║  ✖ Failed     : $failCount".PadRight(71) + "║" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
    Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Pause-Toolkit
}

function Show-SoftwareMenu {
    do {
        Show-Banner
        Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "  ║             MODULE 1: SOFTWARE INSTALLER (WINGET)                  ║" -ForegroundColor Cyan
        Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
        Write-Host "  ║  * Opening any pack launches the Software Selector with checkboxes.║" -ForegroundColor Yellow
        Write-Host "  ║    No software is installed until you pick numbers and confirm 'Y'.║" -ForegroundColor Yellow
        Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
        Write-Host "  ║   [1] 📋 Software Selector       • Full interactive checkbox list  ║" -ForegroundColor White
        Write-Host "  ║   [2] 🌟 Essential Pack          • Chrome, Firefox, Notepad++, etc ║" -ForegroundColor White
        Write-Host "  ║   [3] 🌐 Web Browser Pack        • Google Chrome, Mozilla Firefox  ║" -ForegroundColor White
        Write-Host "  ║   [4] 💻 Developer Suite         • Python 3.14, VS Code, Git, N++  ║" -ForegroundColor White
        Write-Host "  ║   [5] 🎬 Multimedia Pack         • VLC Media Player                ║" -ForegroundColor White
        Write-Host "  ║   [6] 🛠️ Utility Pack            • WinRAR, 7-Zip, Notepad++, Avro  ║" -ForegroundColor White
        Write-Host "  ║   [7] 🔍 Installed Status Check  • Scan all catalog apps on PC     ║" -ForegroundColor White
        Write-Host "  ║   [8] 🔄 Refresh Winget Sources  • winget source update            ║" -ForegroundColor White
        Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
        Write-Host "  ║   [0] ↩ Back to Main Menu                                          ║" -ForegroundColor DarkGray
        Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  👉 Select option [0-8]: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1" { Show-SoftwareSelector -PackageKeys @($Script:SoftwareCatalog.Keys) -GroupTitle "Full Software Catalog" }
            "2" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Essential"] -GroupTitle "Essential Software Pack" }
            "3" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Browser"] -GroupTitle "Web Browser Pack" }
            "4" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Developer"] -GroupTitle "Developer Tools Pack" }
            "5" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Multimedia"] -GroupTitle "Multimedia Pack" }
            "6" { Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Utility"] -GroupTitle "Utility Tools Pack" }
            "7" {
                if (-not (Test-Winget)) { Pause-Toolkit; break }
                Show-Banner
                Write-Section "Installed Status of Catalog Applications"
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
            "8" {
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
# MODULE 2: NETWORK TOOLS
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
        Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "  ║                 MODULE 2: NETWORK DIAGNOSTICS & TOOLS              ║" -ForegroundColor Cyan
        Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
        Write-Host "  ║   [1] 📋 Show IP Configuration       • IPv4, IPv6, Gateway, DNS   ║" -ForegroundColor White
        Write-Host "  ║   [2] 🏓 Ping Test                   • ICMP packet response time   ║" -ForegroundColor White
        Write-Host "  ║   [3] 🌐 Internet Connectivity Test  • 3-Point Diagnostic check    ║" -ForegroundColor White
        Write-Host "  ║   [4] 🔍 DNS Lookup                  • Resolve domain IP addresses ║" -ForegroundColor White
        Write-Host "  ║   [5] 📡 Traceroute Diagnostic       • Trace hops to destination   ║" -ForegroundColor White
        Write-Host "  ║   [6] 🧹 Flush DNS Resolver Cache    • Clear-DnsClientCache        ║" -ForegroundColor White
        Write-Host "  ║   [7] 🔌 Release DHCP IP Address     • ipconfig /release           ║" -ForegroundColor White
        Write-Host "  ║   [8] 🔄 Renew DHCP IP Address       • ipconfig /renew             ║" -ForegroundColor White
        Write-Host "  ║   [9] 📶 Show Network Adapters       • Status, Speed, MAC address  ║" -ForegroundColor White
        Write-Host "  ║   [10] 📡 Show WiFi Interface Info   • SSID, Channel, Signal %     ║" -ForegroundColor White
        Write-Host "  ║   [11] 🔑 Show Saved WiFi Profiles   • Profile list (Safe display) ║" -ForegroundColor White
        Write-Host "  ║   [12] ⚠️ Full Network Stack Reset   • Winsock, IP, DNS (Confirm)  ║" -ForegroundColor White
        Write-Host "  ║   [13] ⚙️ Change DNS Server          • Cloudflare, Google, Quad9   ║" -ForegroundColor White
        Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
        Write-Host "  ║   [0] ↩ Back to Main Menu                                          ║" -ForegroundColor DarkGray
        Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  👉 Select an option: " -ForegroundColor Cyan -NoNewline
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
                }
                catch {
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
                
                if ($target -notmatch "^[a-zA-Z0-9.-]+$") {
                    Write-ErrorMessage "Invalid hostname or IP address format."
                } else {
                    Write-InfoMessage "Pinging $target (4 packets)..."
                    Test-Connection -ComputerName $target -Count 4 | Format-Table Address, ResponseTime, StatusCode -AutoSize
                }
                Pause-Toolkit
            }
            "3" {
                Show-Banner
                Write-Section "Internet Connectivity Diagnostics"
                Test-Internet
                Pause-Toolkit
            }
            "4" {
                Show-Banner
                Write-Section "Domain Name System (DNS) Lookup"
                Write-Host "  Enter domain to resolve (e.g. google.com): " -ForegroundColor Cyan -NoNewline
                $domain = Read-Host
                if ($domain -match "^[a-zA-Z0-9.-]+$") {
                    Write-InfoMessage "Resolving $domain..."
                    Resolve-DnsName -Name $domain -ErrorAction Continue | Format-Table Name, Type, IPAddress, NameHost -AutoSize
                } else {
                    Write-ErrorMessage "Invalid domain name format."
                }
                Pause-Toolkit
            }
            "5" {
                Show-Banner
                Write-Section "Network Route Trace (Traceroute)"
                Write-Host "  Enter target hostname or IP (e.g. 1.1.1.1): " -ForegroundColor Cyan -NoNewline
                $dest = Read-Host
                if ($dest -match "^[a-zA-Z0-9.-]+$") {
                    Write-InfoMessage "Tracing route to $dest (Max 15 hops)..."
                    tracert -h 15 -d $dest
                } else {
                    Write-ErrorMessage "Invalid destination format."
                }
                Pause-Toolkit
            }
            "6" {
                Write-Section "Flushing DNS Client Cache"
                try {
                    Clear-DnsClientCache
                    Write-Success "DNS Client Cache flushed successfully."
                } catch {
                    & ipconfig /flushdns
                }
                Pause-Toolkit
            }
            "7" {
                if (-not (Request-Admin "Releasing IP requires administrator privileges.")) { break }
                if (Confirm-Action "Release current DHCP IP address?" "Your network will disconnect until renewed.") {
                    & ipconfig /release
                    Write-Success "IP addresses released."
                }
                Pause-Toolkit
            }
            "8" {
                if (-not (Request-Admin "Renewing IP requires administrator privileges.")) { break }
                Write-InfoMessage "Requesting new DHCP lease..."
                & ipconfig /renew
                Write-Success "IP addresses renewed successfully."
                Pause-Toolkit
            }
            "9" {
                Show-Banner
                Write-Section "Hardware Network Adapters"
                Get-NetAdapter | Format-Table Name, InterfaceDescription, Status, LinkSpeed, MacAddress -AutoSize
                Pause-Toolkit
            }
            "10" {
                Show-Banner
                Write-Section "WiFi Interface & Signal Status"
                & netsh wlan show interfaces
                Pause-Toolkit
            }
            "11" {
                Show-Banner
                Write-Section "Saved WiFi Connection Profiles"
                & netsh wlan show profiles
                Write-Host ""
                Write-InfoMessage "Passwords are hidden by default to protect local credentials."
                Write-Host "  View specific saved key? Requires Admin & Confirmation [Y/N]: " -ForegroundColor Cyan -NoNewline
                $viewKey = Read-Host
                if ($viewKey -match "^[Yy]$") {
                    if (Request-Admin "Viewing stored WiFi keys requires elevation.") {
                        Write-Host "  Enter exact Profile Name: " -ForegroundColor Cyan -NoNewline
                        $pname = Read-Host
                        if ($pname -match "^[a-zA-Z0-9 _.-]+$") {
                            & netsh wlan show profile name="$pname" key=clear
                        } else {
                            Write-ErrorMessage "Invalid profile name."
                        }
                    }
                }
                Pause-Toolkit
            }
            "12" {
                if (-not (Request-Admin "Network reset requires administrative privileges.")) { break }
                if (Confirm-Action "Perform full network stack reset?" "This will flush DNS, reset Winsock, and reset IP stacks. A restart may be recommended.") {
                    Write-InfoMessage "Flushing DNS..."
                    & ipconfig /flushdns
                    Write-InfoMessage "Resetting Winsock Catalog..."
                    & netsh winsock reset
                    Write-InfoMessage "Resetting TCP/IP Stack..."
                    & netsh int ip reset
                    Write-Success "Network stack reset completed successfully."
                }
                Pause-Toolkit
            }
            "13" {
                if (-not (Request-Admin "Changing DNS servers requires administrative privileges.")) { break }
                Show-Banner
                Write-Section "Select Predefined DNS Provider"
                foreach ($k in $Script:DnsPresets.Keys) {
                    Write-Host "  [$k] $($Script:DnsPresets[$k].Name)"
                }
                Write-Host "  [0] Cancel" -ForegroundColor DarkGray
                Write-Host ""
                Write-Host "  👉 Select provider [1-4]: " -ForegroundColor Cyan -NoNewline
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
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 3: WINDOWS REPAIR
# ============================================================================

function Show-RepairMenu {
    do {
        Show-Banner
        Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "  ║                   MODULE 3: WINDOWS SYSTEM REPAIR                  ║" -ForegroundColor Cyan
        Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
        Write-Host "  ║   [1] 🛡️ System File Checker (SFC)   • sfc /scannow repair files   ║" -ForegroundColor White
        Write-Host "  ║   [2] 🔍 DISM Health Inspection      • CheckHealth & ScanHealth    ║" -ForegroundColor White
        Write-Host "  ║   [3] 🩹 DISM Restore Health         • Download & Repair Image     ║" -ForegroundColor White
        Write-Host "  ║   [4] 💿 CHKDSK Inspection           • Read-only file system check ║" -ForegroundColor White
        Write-Host "  ║   [5] 🔄 Windows Update Repair       • Purge Update Cache & Reset  ║" -ForegroundColor White
        Write-Host "  ║   [6] 🌐 Comprehensive Net Repair    • Reset IP, Winsock & DNS reg ║" -ForegroundColor White
        Write-Host "  ║   [7] 🗃️ Component Store Cleanup     • DISM StartComponentCleanup  ║" -ForegroundColor White
        Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
        Write-Host "  ║   [0] ↩ Back to Main Menu                                          ║" -ForegroundColor DarkGray
        Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  👉 Select an option: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1" {
                if (-not (Request-Admin "SFC /scannow requires administrative privileges.")) { break }
                Show-Banner
                Write-Section "Running System File Checker (sfc /scannow)"
                Write-InfoMessage "This may take 5 to 15 minutes. Please do not close this window."
                & sfc /scannow
                Write-Success "SFC scan finished."
                Pause-Toolkit
            }
            "2" {
                if (-not (Request-Admin "DISM inspection requires administrative privileges.")) { break }
                Show-Banner
                Write-Section "DISM CheckHealth & ScanHealth"
                Write-InfoMessage "Checking Component Store corruption flags..."
                & DISM /Online /Cleanup-Image /CheckHealth
                Write-Host ""
                Write-InfoMessage "Scanning Component Store for corruption..."
                & DISM /Online /Cleanup-Image /ScanHealth
                Pause-Toolkit
            }
            "3" {
                if (-not (Request-Admin "DISM RestoreHealth requires administrative privileges.")) { break }
                if (Confirm-Action "Run DISM /Online /Cleanup-Image /RestoreHealth?" "This downloads healthy component packages from Windows Update if corruption is found.") {
                    Show-Banner
                    Write-Section "Running DISM RestoreHealth"
                    Write-InfoMessage "This process can take 10 to 25 minutes depending on system speed..."
                    & DISM /Online /Cleanup-Image /RestoreHealth
                    Write-Success "DISM RestoreHealth completed."
                }
                Pause-Toolkit
            }
            "4" {
                Show-Banner
                Write-Section "CHKDSK Inspection (Drive C:)"
                Write-InfoMessage "Running read-only file system check. No restart required."
                & chkdsk C:
                Pause-Toolkit
            }
            "5" {
                if (-not (Request-Admin "Windows Update Repair requires administrative privileges.")) { break }
                if (Confirm-Action "Repair Windows Update components?" "Stops wuauserv, bits, cryptSvc, clears SoftwareDistribution cache, and restarts services.") {
                    Show-Banner
                    Write-Section "Repairing Windows Update Components"
                    
                    $services = @("wuauserv", "bits", "cryptSvc", "msiserver")
                    foreach ($svc in $services) {
                        Write-InfoMessage "Stopping $svc..."
                        Stop-Service -Name $svc -Force -ErrorAction SilentlyContinue
                    }

                    $softDist = "$env:SystemRoot\SoftwareDistribution\Download"
                    if (Test-Path $softDist) {
                        Write-InfoMessage "Cleaning Windows Update download cache: $softDist..."
                        Remove-Item "$softDist\*" -Recurse -Force -ErrorAction SilentlyContinue
                    }

                    foreach ($svc in $services) {
                        Write-InfoMessage "Starting $svc..."
                        Start-Service -Name $svc -ErrorAction SilentlyContinue
                    }
                    Write-Success "Windows Update service cache reset completed."
                }
                Pause-Toolkit
            }
            "6" {
                if (-not (Request-Admin "Full network repair requires administrative privileges.")) { break }
                if (Confirm-Action "Execute comprehensive network repair?") {
                    Write-InfoMessage "Flushing DNS client cache..."
                    & ipconfig /flushdns
                    Write-InfoMessage "Re-registering DNS with network..."
                    & ipconfig /registerdns
                    Write-InfoMessage "Resetting Winsock catalog..."
                    & netsh winsock reset
                    Write-InfoMessage "Resetting TCP/IP stack..."
                    & netsh int ip reset
                    Write-InfoMessage "Releasing and renewing DHCP leases..."
                    & ipconfig /release
                    & ipconfig /renew
                    Write-Success "Network repair completed."
                }
                Pause-Toolkit
            }
            "7" {
                if (-not (Request-Admin "Component Store Cleanup requires administrative privileges.")) { break }
                if (Confirm-Action "Clean up superseded component store packages?") {
                    Show-Banner
                    Write-Section "DISM StartComponentCleanup"
                    & DISM /Online /Cleanup-Image /StartComponentCleanup
                    Write-Success "Component store cleanup finished."
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 4: CLEANUP TOOLS
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
    $failed  = 0

    Get-ChildItem -Path $Path -Force -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction Stop
            $deleted++
        }
        catch [System.IO.IOException] {
            $skipped++
        }
        catch [System.UnauthorizedAccessException] {
            $skipped++
        }
        catch {
            $failed++
        }
    }

    Write-Host "    Deleted: $deleted | Skipped (Locked/Active): $skipped | Failed: $failed" -ForegroundColor Gray
}

function Show-CleanupMenu {
    do {
        Show-Banner
        Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "  ║                 MODULE 4: DISK & CACHE CLEANUP                     ║" -ForegroundColor Cyan
        Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
        Write-Host "  ║   [1] 🧹 User Temp Directory         • $env:TEMP                   ║" -ForegroundColor White
        Write-Host "  ║   [2] 🧹 Windows System Temp         • $env:SystemRoot\Temp (Admin)║" -ForegroundColor White
        Write-Host "  ║   [3] 🗑️ Empty Recycle Bin           • Clear all drive bins        ║" -ForegroundColor White
        Write-Host "  ║   [4] 🌐 DNS Resolver Cache          • Clear resolver cache        ║" -ForegroundColor White
        Write-Host "  ║   [5] 📦 Windows Update Cache        • Purge download folder       ║" -ForegroundColor White
        Write-Host "  ║   [6] 💽 Windows Disk Cleanup Tool   • Launch cleanmgr.exe         ║" -ForegroundColor White
        Write-Host "  ║   [7] 🌐 Web Browser Cache           • Chrome, Edge, Firefox       ║" -ForegroundColor White
        Write-Host "  ║   [8] 📊 Temporary File Analysis     • Total estimated junk space  ║" -ForegroundColor White
        Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
        Write-Host "  ║   [0] ↩ Back to Main Menu                                          ║" -ForegroundColor DarkGray
        Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  👉 Select an option: " -ForegroundColor Cyan -NoNewline
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
                if (-not (Request-Admin "Cleaning Windows System Temp requires administrative privileges.")) { break }
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
                Clear-DnsClientCache
                Write-Success "DNS cache flushed."
                Pause-Toolkit
            }
            "5" {
                if (-not (Request-Admin "Cleaning Windows Update Cache requires elevation.")) { break }
                if (Confirm-Action "Clean Windows Update Download Cache?") {
                    Remove-FolderContentsSafely -Path "$env:SystemRoot\SoftwareDistribution\Download" -Label "Update Cache"
                    Write-Success "Update cache cleaned."
                }
                Pause-Toolkit
            }
            "6" {
                Write-InfoMessage "Launching Windows Disk Cleanup..."
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
            "8" {
                Show-Banner
                Write-Section "Analyzing Temporary File Usage"
                
                $targets = @(
                    @{ Name = "User Temp"; Path = $env:TEMP },
                    @{ Name = "Windows Temp"; Path = "$env:SystemRoot\Temp" },
                    @{ Name = "Windows Update Cache"; Path = "$env:SystemRoot\SoftwareDistribution\Download" }
                )

                $totalBytes = 0
                foreach ($t in $targets) {
                    if (Test-Path $t.Path) {
                        $size = (Get-ChildItem -Path $t.Path -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
                        if (-not $size) { $size = 0 }
                        $mb = [Math]::Round($size / 1MB, 2)
                        $totalBytes += $size
                        Write-Host "    $($t.Name.PadRight(25)) : $mb MB"
                    } else {
                        Write-Host "    $($t.Name.PadRight(25)) : Not Found" -ForegroundColor DarkGray
                    }
                }

                $totalMB = [Math]::Round($totalBytes / 1MB, 2)
                $totalGB = [Math]::Round($totalBytes / 1GB, 2)
                Write-Host "  ────────────────────────────────────────────────────────────"
                Write-Host "    Total Estimated Junk Space : $totalMB MB ($totalGB GB)" -ForegroundColor Cyan
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 5: SYSTEM INFORMATION
# ============================================================================

function Show-SystemMenu {
    do {
        Show-Banner
        Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "  ║                 MODULE 5: SYSTEM & HARDWARE INFO                   ║" -ForegroundColor Cyan
        Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
        Write-Host "  ║   [1] 🖥️ Windows OS Information      • Edition, Build, Uptime      ║" -ForegroundColor White
        Write-Host "  ║   [2] 💻 Computer System Hardware    • Model, Manufacturer, Domain ║" -ForegroundColor White
        Write-Host "  ║   [3] ⚡ Central Processor (CPU)     • Cores, Clock, Threads       ║" -ForegroundColor White
        Write-Host "  ║   [4] 🧠 Physical Memory (RAM)       • Module slots, Speed, Total  ║" -ForegroundColor White
        Write-Host "  ║   [5] 💽 Storage Disks & Volumes     • Physical drives & Volumes   ║" -ForegroundColor White
        Write-Host "  ║   [6] 🎮 Graphics Adapters (GPU)     • Display adapters & VRAM     ║" -ForegroundColor White
        Write-Host "  ║   [7] 🔌 BIOS & Firmware Details     • Vendor, SMBIOS Version      ║" -ForegroundColor White
        Write-Host "  ║   [8] 🖧 Motherboard (Baseboard)     • Model, Serial number        ║" -ForegroundColor White
        Write-Host "  ║   [9] 📶 Active Network Adapters     • Speed, Status, MAC address  ║" -ForegroundColor White
        Write-Host "  ║   [10] 📋 Comprehensive Audit Report • Complete diagnostic summary ║" -ForegroundColor White
        Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
        Write-Host "  ║   [0] ↩ Back to Main Menu                                          ║" -ForegroundColor DarkGray
        Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  👉 Select an option: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1" {
                Show-Banner
                Write-Section "Windows Operating System Information"
                $os = Get-CimInstance Win32_OperatingSystem
                $uptime = (Get-Date) - $os.LastBootUpTime
                Write-Host "    OS Name        : $($os.Caption)"
                Write-Host "    Version        : $($os.Version)"
                Write-Host "    Build Number   : $($os.BuildNumber)"
                Write-Host "    Architecture   : $($os.OSArchitecture)"
                Write-Host "    Installed On   : $($os.InstallDate)"
                Write-Host "    Last Boot Time : $($os.LastBootUpTime)"
                Write-Host "    System Uptime  : $($uptime.Days)d $($uptime.Hours)h $($uptime.Minutes)m $($uptime.Seconds)s"
                Write-Host "    System Drive   : $($os.SystemDrive)"
                Pause-Toolkit
            }
            "2" {
                Show-Banner
                Write-Section "Computer Hardware Identification"
                $cs = Get-CimInstance Win32_ComputerSystem
                Write-Host "    Hostname       : $($cs.Name)"
                Write-Host "    Manufacturer   : $($cs.Manufacturer)"
                Write-Host "    Model          : $($cs.Model)"
                Write-Host "    System Type    : $($cs.SystemType)"
                Write-Host "    Domain/Workgrp : $($cs.Domain)"
                Write-Host "    Total Memory   : $([Math]::Round($cs.TotalPhysicalMemory / 1GB, 2)) GB"
                Pause-Toolkit
            }
            "3" {
                Show-Banner
                Write-Section "Processor (CPU) Details"
                Get-CimInstance Win32_Processor | ForEach-Object {
                    Write-Host "    Device ID      : $($_.DeviceID)"
                    Write-Host "    Processor Name : $($_.Name.Trim())"
                    Write-Host "    Physical Cores : $($_.NumberOfCores)"
                    Write-Host "    Logical Threads: $($_.NumberOfLogicalProcessors)"
                    Write-Host "    Max Clock Speed: $($_.MaxClockSpeed) MHz"
                    Write-Host "    Socket Type    : $($_.SocketDesignation)"
                    Write-Host ""
                }
                Pause-Toolkit
            }
            "4" {
                Show-Banner
                Write-Section "Physical Memory (RAM) Modules"
                $sticks = Get-CimInstance Win32_PhysicalMemory
                $totalRam = 0
                foreach ($m in $sticks) {
                    $gb = [Math]::Round($m.Capacity / 1GB, 2)
                    $totalRam += $m.Capacity
                    Write-Host "    Bank: $($m.DeviceLocator) | Size: $gb GB | Speed: $($m.Speed) MHz | Vendor: $($m.Manufacturer.Trim()) | Part: $($m.PartNumber.Trim())"
                }
                Write-Host "  ────────────────────────────────────────────────────────────"
                Write-Host "    Total Installed RAM: $([Math]::Round($totalRam / 1GB, 2)) GB across $($sticks.Count) module(s)" -ForegroundColor Cyan
                Pause-Toolkit
            }
            "5" {
                Show-Banner
                Write-Section "Storage Disks & Volumes"
                Write-Host "  Physical Disk Drives:" -ForegroundColor Cyan
                Get-CimInstance Win32_DiskDrive | ForEach-Object {
                    $sizeGb = [Math]::Round($_.Size / 1GB, 2)
                    Write-Host "    [$($_.Index)] $($_.Model) ($sizeGb GB, Interface: $($_.InterfaceType))"
                }
                Write-Host ""
                Write-Host "  Logical Drive Volumes:" -ForegroundColor Cyan
                Get-Volume | Where-Object { $_.DriveLetter } | Format-Table DriveLetter, FileSystemLabel, FileSystem, @{Name="Size(GB)";Expression={[Math]::Round($_.Size/1GB,2)}}, @{Name="Free(GB)";Expression={[Math]::Round($_.SizeRemaining/1GB,2)}}, HealthStatus -AutoSize
                Pause-Toolkit
            }
            "6" {
                Show-Banner
                Write-Section "Graphics Controllers (GPU)"
                Get-CimInstance Win32_VideoController | ForEach-Object {
                    $vram = if ($_.AdapterRAM) { [Math]::Round($_.AdapterRAM / 1MB, 0) } else { "N/A" }
                    Write-Host "    GPU Name       : $($_.Name)"
                    Write-Host "    Driver Version : $($_.DriverVersion)"
                    Write-Host "    Resolution     : $($_.CurrentHorizontalResolution) x $($_.CurrentVerticalResolution) @ $($_.CurrentRefreshRate)Hz"
                    Write-Host "    Adapter VRAM   : $vram MB"
                    Write-Host ""
                }
                Pause-Toolkit
            }
            "7" {
                Show-Banner
                Write-Section "BIOS / Firmware Information"
                $bios = Get-CimInstance Win32_BIOS
                Write-Host "    BIOS Vendor    : $($bios.Manufacturer)"
                Write-Host "    Version        : $($bios.SMBIOSBIOSVersion)"
                Write-Host "    Release Date   : $($bios.ReleaseDate)"
                Write-Host "    Serial Number  : $($bios.SerialNumber)"
                Pause-Toolkit
            }
            "8" {
                Show-Banner
                Write-Section "Motherboard (BaseBoard)"
                $mb = Get-CimInstance Win32_BaseBoard
                Write-Host "    Manufacturer   : $($mb.Manufacturer)"
                Write-Host "    Product Model  : $($mb.Product)"
                Write-Host "    Serial Number  : $($mb.SerialNumber)"
                Write-Host "    Version        : $($mb.Version)"
                Pause-Toolkit
            }
            "9" {
                Show-Banner
                Write-Section "Active Network Adapters"
                Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Format-Table Name, InterfaceDescription, LinkSpeed, MacAddress, Status -AutoSize
                Pause-Toolkit
            }
            "10" {
                Show-Banner
                Write-Section "Full System Audit Summary"
                $os = Get-CimInstance Win32_OperatingSystem
                $cs = Get-CimInstance Win32_ComputerSystem
                $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
                $ram = [Math]::Round($cs.TotalPhysicalMemory / 1GB, 2)
                $bios = Get-CimInstance Win32_BIOS

                Write-Host "    Device Name    : $($cs.Name)" -ForegroundColor Cyan
                Write-Host "    OS             : $($os.Caption) (Build $($os.BuildNumber))"
                Write-Host "    Motherboard    : $($cs.Manufacturer) $($cs.Model)"
                Write-Host "    BIOS           : $($bios.SMBIOSBIOSVersion) ($($bios.Manufacturer))"
                Write-Host "    CPU            : $($cpu.Name.Trim())"
                Write-Host "    Memory         : $ram GB RAM"
                Write-Host "    Disks Summary  :"
                Get-Volume | Where-Object { $_.DriveLetter } | ForEach-Object {
                    $freeGb = [Math]::Round($_.SizeRemaining / 1GB, 1)
                    $totalGb = [Math]::Round($_.Size / 1GB, 1)
                    Write-Host "      - $($_.DriveLetter): [$($_.FileSystemLabel)] $freeGb GB free of $totalGb GB"
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 6: WINDOWS UTILITIES
# ============================================================================

function Show-UtilityMenu {
    do {
        Show-Banner
        Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "  ║                 MODULE 6: BUILT-IN WINDOWS UTILITIES               ║" -ForegroundColor Cyan
        Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
        Write-Host "  ║   [1] 📊 Task Manager               • taskmgr.exe                  ║" -ForegroundColor White
        Write-Host "  ║   [2] 🔌 Device Manager             • devmgmt.msc                  ║" -ForegroundColor White
        Write-Host "  ║   [3] ⚙️ Windows Services Console    • services.msc                 ║" -ForegroundColor White
        Write-Host "  ║   [4] 💻 Computer Management        • compmgmt.msc                 ║" -ForegroundColor White
        Write-Host "  ║   [5] 📝 Registry Editor            • regedit.exe                  ║" -ForegroundColor White
        Write-Host "  ║   [6] 🎛️ Classic Control Panel      • control.exe                  ║" -ForegroundColor White
        Write-Host "  ║   [7] ⚙️ Windows Modern Settings    • ms-settings:                 ║" -ForegroundColor White
        Write-Host "  ║   [8] 💻 Command Prompt (CMD)       • cmd.exe                      ║" -ForegroundColor White
        Write-Host "  ║   [9] 💻 Windows PowerShell         • powershell.exe               ║" -ForegroundColor White
        Write-Host "  ║   [10] 📜 Windows Event Viewer      • eventvwr.msc                 ║" -ForegroundColor White
        Write-Host "  ║   [11] 💽 Disk Management Console   • diskmgmt.msc                 ║" -ForegroundColor White
        Write-Host "  ║   [12] ℹ️ System Properties Dialog  • sysdm.cpl                    ║" -ForegroundColor White
        Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
        Write-Host "  ║   [0] ↩ Back to Main Menu                                          ║" -ForegroundColor DarkGray
        Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  👉 Select an option: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1"  { Start-Process "taskmgr.exe" }
            "2"  { Start-Process "devmgmt.msc" }
            "3"  { Start-Process "services.msc" }
            "4"  { Start-Process "compmgmt.msc" }
            "5"  { Start-Process "regedit.exe" }
            "6"  { Start-Process "control.exe" }
            "7"  { Start-Process "ms-settings:" }
            "8"  { Start-Process "cmd.exe" }
            "9"  { Start-Process "powershell.exe" }
            "10" { Start-Process "eventvwr.msc" }
            "11" { Start-Process "diskmgmt.msc" }
            "12" { Start-Process "sysdm.cpl" }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 7: WINDOWS CONFIGURATION
# ============================================================================

function Show-ConfigurationMenu {
    do {
        Show-Banner
        Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "  ║                 MODULE 7: WINDOWS CONFIGURATION                    ║" -ForegroundColor Cyan
        Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
        Write-Host "  ║   [1] 💻 Set Computer Hostname       • Rename-Computer (Reboot req)║" -ForegroundColor White
        Write-Host "  ║   [2] 🕒 Show Current Time Zone      • Get-TimeZone                ║" -ForegroundColor White
        Write-Host "  ║   [3] 🌍 Change System Time Zone     • Popular global zones list   ║" -ForegroundColor White
        Write-Host "  ║   [4] 🔑 Windows Activation Status   • Official licensing query    ║" -ForegroundColor White
        Write-Host "  ║   [5] 🔄 Windows Update Settings     • Launch update configuration ║" -ForegroundColor White
        Write-Host "  ║   [6] ⚡ Power Plan Scheme           • High Performance, Balanced  ║" -ForegroundColor White
        Write-Host "  ║   [7] 🌐 Default Browser Info        • Read HTTP protocol handler  ║" -ForegroundColor White
        Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
        Write-Host "  ║   [0] ↩ Back to Main Menu                                          ║" -ForegroundColor DarkGray
        Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  👉 Select an option: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1" {
                if (-not (Request-Admin "Renaming the computer requires administrative privileges.")) { break }
                Show-Banner
                Write-Section "Rename Computer Hostname"
                Write-Host "    Current Computer Name: $env:COMPUTERNAME" -ForegroundColor Cyan
                Write-Host "    Enter New Hostname: " -ForegroundColor Cyan -NoNewline
                $newName = Read-Host
                if ($newName -match "^[a-zA-Z0-9-]{1,15}$") {
                    if (Confirm-Action "Rename computer to '$newName'?" "A restart will be required for the change to take effect.") {
                        try {
                            Rename-Computer -NewName $newName -ErrorAction Stop
                            Write-Success "Computer successfully renamed to '$newName'. Please restart when convenient."
                        } catch {
                            Write-ErrorMessage "Failed to rename: $($_.Exception.Message)"
                        }
                    }
                } else {
                    Write-ErrorMessage "Invalid name. Must be 1-15 characters with letters, numbers, or hyphens only."
                }
                Pause-Toolkit
            }
            "2" {
                Show-Banner
                Write-Section "Current System Time Zone"
                Get-TimeZone | Format-List Id, DisplayName, StandardName, DaylightName, BaseUtcOffset
                Pause-Toolkit
            }
            "3" {
                if (-not (Request-Admin "Changing system time zone requires administrative privileges.")) { break }
                Show-Banner
                Write-Section "Popular Time Zones"
                $zones = @(
                    "UTC",
                    "Eastern Standard Time",
                    "Central Standard Time",
                    "Pacific Standard Time",
                    "GMT Standard Time",
                    "Central European Standard Time",
                    "India Standard Time",
                    "Bangladesh Standard Time",
                    "Singapore Standard Time",
                    "Tokyo Standard Time"
                )
                for ($i = 0; $i -lt $zones.Count; $i++) {
                    Write-Host "    [$($i + 1)] $($zones[$i])"
                }
                Write-Host "    [0] Cancel" -ForegroundColor DarkGray
                Write-Host ""
                Write-Host "    👉 Select time zone [1-$($zones.Count)]: " -ForegroundColor Cyan -NoNewline
                $zIdx = Read-Host
                if ($zIdx -match "^\d+$" -and [int]$zIdx -ge 1 -and [int]$zIdx -le $zones.Count) {
                    $chosenZone = $zones[[int]$zIdx - 1]
                    try {
                        Set-TimeZone -Id $chosenZone -ErrorAction Stop
                        Write-Success "Time zone set to: $chosenZone"
                    } catch {
                        Write-ErrorMessage "Failed to change time zone: $($_.Exception.Message)"
                    }
                }
                Pause-Toolkit
            }
            "4" {
                Show-Banner
                Write-Section "Official Windows Activation Status"
                Write-InfoMessage "Querying official SoftwareLicensingService..."
                try {
                    $lic = Get-CimInstance SoftwareLicensingProduct -Filter "PartialProductKey IS NOT NULL" -ErrorAction SilentlyContinue | Select-Object -First 1
                    if ($lic) {
                        $statusText = switch ($lic.LicenseStatus) {
                            0 { "Unlicensed" }
                            1 { "Licensed (Permanently Activated)" }
                            2 { "OOBGrace" }
                            3 { "OOTGrace" }
                            4 { "NonGenuineGrace" }
                            5 { "Notification" }
                            6 { "ExtendedGrace" }
                            default { "Unknown ($($lic.LicenseStatus))" }
                        }
                        Write-Host "    Product Name   : $($lic.Name)"
                        Write-Host "    Description    : $($lic.Description)"
                        Write-Host "    License Status : $statusText" -ForegroundColor $(if ($lic.LicenseStatus -eq 1) { "Green" } else { "Yellow" })
                        Write-Host "    Partial Key    : ...-$($lic.PartialProductKey)"
                    } else {
                        Write-InfoMessage "Launching Windows Activation script query..."
                        cscript.exe //nologo "$env:SystemRoot\System32\slmgr.vbs" /xpr
                    }
                }
                catch {
                    cscript.exe //nologo "$env:SystemRoot\System32\slmgr.vbs" /dli
                }
                Pause-Toolkit
            }
            "5" {
                Start-Process "ms-settings:windowsupdate"
            }
            "6" {
                Show-Banner
                Write-Section "Windows Power Schemes"
                & powercfg /list
                Write-Host ""
                Write-Host "  Quick Set: [1] High Performance | [2] Balanced | [3] Power Saver | [0] Skip: " -ForegroundColor Cyan -NoNewline
                $pChoice = Read-Host
                switch ($pChoice) {
                    "1" { & powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c; Write-Success "High Performance activated." }
                    "2" { & powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e; Write-Success "Balanced activated." }
                    "3" { & powercfg /setactive a1841308-3541-4fab-bc81-f71556f20b4a; Write-Success "Power Saver activated." }
                }
                Pause-Toolkit
            }
            "7" {
                Show-Banner
                Write-Section "Default Browser Information"
                try {
                    $progId = (Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice" -ErrorAction SilentlyContinue).ProgId
                    Write-Host "    Configured HTTP Protocol Handler (ProgId): $progId" -ForegroundColor Cyan
                } catch {
                    Write-WarningMessage "Unable to query default browser UserChoice registry key."
                }
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 8: QUICK ACTIONS
# ============================================================================

function Show-QuickMenu {
    do {
        Show-Banner
        Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "  ║                   MODULE 8: INSTANT QUICK ACTIONS                  ║" -ForegroundColor Cyan
        Write-Host "  ╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
        Write-Host "  ║   [1] 🧹 Flush DNS Resolver Cache                                  ║" -ForegroundColor White
        Write-Host "  ║   [2] 🌐 Fast Internet Connectivity Test                           ║" -ForegroundColor White
        Write-Host "  ║   [3] 📋 Show Current Network IP Configuration                     ║" -ForegroundColor White
        Write-Host "  ║   [4] 🔄 Restart Windows Explorer Process                          ║" -ForegroundColor White
        Write-Host "  ║   [5] 📊 Open Task Manager                                         ║" -ForegroundColor White
        Write-Host "  ║   [6] ⚙️ Open Windows Modern Settings                              ║" -ForegroundColor White
        Write-Host "  ║   [7] 🛡️ Run System File Checker (SFC Scan)                        ║" -ForegroundColor White
        Write-Host "  ║   [8] 🩹 Run DISM RestoreHealth Image Repair                       ║" -ForegroundColor White
        Write-Host "  ║   [9] 📦 Install Essential Software (Interactive Selection)        ║" -ForegroundColor White
        Write-Host "  ║                                                                    ║" -ForegroundColor Cyan
        Write-Host "  ║   [0] ↩ Back to Main Menu                                          ║" -ForegroundColor DarkGray
        Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  👉 Select an option: " -ForegroundColor Cyan -NoNewline
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
                Get-NetIPConfiguration | Format-Table InterfaceAlias, IPv4Address, IPv4DefaultGateway -AutoSize
                Pause-Toolkit
            }
            "4" {
                if (Confirm-Action "Restart Windows Explorer process?") {
                    Write-InfoMessage "Stopping explorer.exe..."
                    Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Seconds 1
                    Write-InfoMessage "Restarting explorer.exe..."
                    Start-Process explorer.exe
                    Write-Success "Windows Explorer restarted."
                }
                Pause-Toolkit
            }
            "5" { Start-Process "taskmgr.exe" }
            "6" { Start-Process "ms-settings:" }
            "7" {
                if (Request-Admin "SFC requires administrative privileges.") {
                    & sfc /scannow
                    Pause-Toolkit
                }
            }
            "8" {
                if (Request-Admin "DISM RestoreHealth requires administrative privileges.") {
                    if (Confirm-Action "Run DISM RestoreHealth now?") {
                        & DISM /Online /Cleanup-Image /RestoreHealth
                        Pause-Toolkit
                    }
                }
            }
            "9" {
                Show-SoftwareSelector -PackageKeys $Script:PackageGroups["Essential"] -GroupTitle "Essential Software Pack"
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
        Write-Host "  👉 Select an option [0-8]: " -ForegroundColor Cyan -NoNewline
        $mainChoice = Read-Host

        switch ($mainChoice) {
            "1" { Show-SoftwareMenu }
            "2" { Show-NetworkMenu }
            "3" { Show-RepairMenu }
            "4" { Show-CleanupMenu }
            "5" { Show-SystemMenu }
            "6" { Show-UtilityMenu }
            "7" { Show-ConfigurationMenu }
            "8" { Show-QuickMenu }
            "0" {
                Clear-Host
                Write-Host ""
                Write-Host "  ╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
                Write-Host "  ║            Thank you for using ItsRiRx Windows Tool Kit!           ║" -ForegroundColor Cyan
                Write-Host "  ║                 Author: ItsRiRx • Stay Productive                  ║" -ForegroundColor White
                Write-Host "  ╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
                Write-Host ""
                return
            }
            default {
                Write-WarningMessage "Invalid option. Please enter a number between 0 and 8."
                Start-Sleep -Milliseconds 700
            }
        }
    } while ($true)
}

# Launch the interactive toolkit
Start-Toolkit
