# ============================================================================
# ITS RIRX WINDOWS TOOL KIT
# Short Name: ItsRiRx Toolkit
# Remote PowerShell Administration Toolkit
# Compatibility: Windows PowerShell 5.1+, PowerShell 7+
# ============================================================================

[CmdletBinding()]
param()

# Ensure standard error handling preference
$ErrorActionPreference = "Continue"

# Toolkit Constants
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
    "Notepad++"     = @{ Id = "Notepad++.Notepad++"; Name = "Notepad++"; Category = "Utility/Dev" }
    "Google Chrome" = @{ Id = "Google.Chrome"; Name = "Google Chrome"; Category = "Browser" }
    "Python"        = @{ Id = "Python.Python.3.14"; Name = "Python 3.14"; Category = "Developer" }
    "Mozilla Firefox"= @{ Id = "Mozilla.Firefox"; Name = "Mozilla Firefox"; Category = "Browser" }
    "WinRAR"        = @{ Id = "RARLab.WinRAR"; Name = "WinRAR"; Category = "Utility" }
    "VLC"           = @{ Id = "VideoLAN.VLC"; Name = "VLC Media Player"; Category = "Multimedia" }
    "Avro Keyboard" = @{ Id = "OmicronLab.Avro"; Name = "Avro Keyboard"; Category = "Language/Utility" }
}

# Configurable Package Groups
$Script:PackageGroups = [ordered]@{
    "Essential"  = @("Notepad++", "Google Chrome", "Mozilla Firefox", "Python", "WinRAR", "VLC", "Avro Keyboard")
    "Browser"    = @("Google Chrome", "Mozilla Firefox")
    "Developer"  = @("Python", "Notepad++")
    "Multimedia" = @("VLC")
    "Utility"    = @("WinRAR", "Notepad++")
}

# DNS Provider Presets
$Script:DnsPresets = [ordered]@{
    "1" = @{ Name = "Cloudflare DNS (1.1.1.1 / 1.0.0.1)"; Primary = "1.1.1.1"; Secondary = "1.0.0.1" }
    "2" = @{ Name = "Google Public DNS (8.8.8.8 / 8.8.4.4)"; Primary = "8.8.8.8"; Secondary = "8.8.4.4" }
    "3" = @{ Name = "Quad9 DNS (9.9.9.9 / 149.112.112.112)"; Primary = "9.9.9.9"; Secondary = "149.112.112.112" }
    "4" = @{ Name = "Automatic (DHCP - Restore Default)"; Primary = "DHCP"; Secondary = "" }
}

# ============================================================================
# HELPER FUNCTIONS: UI & CONSOLE
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
# BANNERS & MENUS
# ============================================================================

function Show-Banner {
    Clear-Host
    $isAdmin = Test-IsAdmin
    $adminStatus = if ($isAdmin) { "Administrator [ELEVATED]" } else { "Standard User [RESTRICTED]" }
    $adminColor  = if ($isAdmin) { "Green" } else { "Yellow" }

    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                  ITS RIRX WINDOWS TOOL KIT                       ║" -ForegroundColor Cyan
    Write-Host "║                         Version 1.0.0                            ║" -ForegroundColor Cyan
    Write-Host "╠══════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║  Status: " -NoNewline -ForegroundColor Cyan
    Write-Host "$adminStatus" -NoNewline -ForegroundColor $adminColor
    $padding = 64 - ("  Status: " + $adminStatus).Length
    Write-Host (" " * [Math]::Max(1, $padding) + "║") -ForegroundColor Cyan
    Write-Host "║  Host:   $env:COMPUTERNAME | User: $env:USERNAME" -NoNewline -ForegroundColor Cyan
    $pad2 = 64 - ("  Host:   $env:COMPUTERNAME | User: $env:USERNAME").Length
    Write-Host (" " * [Math]::Max(1, $pad2) + "║") -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-MainMenu {
    Show-Banner
    Write-Host "  [1] Software Installer       (Winget App Deployments)" -ForegroundColor White
    Write-Host "  [2] Network Tools            (IP, DNS, WiFi, Ping, Trace)" -ForegroundColor White
    Write-Host "  [3] Windows Repair           (SFC, DISM, CHKDSK, WinUpdate)" -ForegroundColor White
    Write-Host "  [4] Cleanup Tools            (Temp Files, Recycle Bin, Caches)" -ForegroundColor White
    Write-Host "  [5] System Information       (CPU, RAM, Disks, GPU, Motherboard)" -ForegroundColor White
    Write-Host "  [6] Windows Utilities        (Task Manager, Regedit, Services)" -ForegroundColor White
    Write-Host "  [7] Windows Configuration    (Hostname, TimeZone, License, Power)" -ForegroundColor White
    Write-Host "  [8] Quick Actions            (One-Click Diagnostic Routines)" -ForegroundColor White
    Write-Host "  [0] Exit Toolkit" -ForegroundColor DarkGray
    Write-Host ""
}

# ============================================================================
# MODULE 1: SOFTWARE INSTALLER
# ============================================================================

function Test-Winget {
    $cmd = Get-Command winget -ErrorAction SilentlyContinue
    if (-not $cmd) {
        Write-ErrorMessage "Winget is not available on this computer."
        Write-InfoMessage "App Installer is required. Install it from Microsoft Store or GitHub:"
        Write-InfoMessage "https://github.com/microsoft/winget-cli/releases"
        return $false
    }
    return $true
}

function Get-InstalledPackage {
    param([string]$PackageId)
    try {
        $result = & winget list --id $PackageId --exact --accept-source-agreements 2>$null
        if ($LASTEXITCODE -eq 0 -and ($result -match [regex]::Escape($PackageId))) {
            return $true
        }
    }
    catch {}
    return $false
}

function Install-WingetPackage {
    param(
        [string]$PackageKey,
        [ref]$SuccessCount,
        [ref]$SkipCount,
        [ref]$FailCount
    )

    if (-not $Script:SoftwareCatalog.Contains($PackageKey)) {
        Write-ErrorMessage "Package key '$PackageKey' is not in the whitelist."
        $FailCount.Value++
        return
    }

    $pkg = $Script:SoftwareCatalog[$PackageKey]
    $pkgId = $pkg.Id
    $pkgName = $pkg.Name

    Write-Host ""
    Write-InfoMessage "Checking: $pkgName ($pkgId)..."

    $isInstalled = Get-InstalledPackage -PackageId $pkgId
    if ($isInstalled) {
        Write-SkipMessage "$pkgName - Already installed"
        $SkipCount.Value++
        return
    }

    Write-InfoMessage "Installing $pkgName via Winget..."
    try {
        # Execute winget install with strict whitelist ID
        $process = Start-Process -FilePath "winget" `
            -ArgumentList @("install", "--id=$pkgId", "-e", "--silent", "--accept-package-agreements", "--accept-source-agreements") `
            -NoNewWindow -Wait -PassThru

        if ($process.ExitCode -eq 0) {
            Write-Success "$pkgName - Installed successfully"
            $SuccessCount.Value++
        } else {
            Write-ErrorMessage "$pkgName - Installation failed (Exit code: $($process.ExitCode))"
            $FailCount.Value++
        }
    }
    catch {
        Write-ErrorMessage "$pkgName - Installation error: $($_.Exception.Message)"
        $FailCount.Value++
    }
}

function Install-SoftwareGroup {
    param([string]$GroupName)
    
    if (-not (Test-Winget)) {
        Pause-Toolkit
        return
    }

    $packages = $Script:PackageGroups[$GroupName]
    if (-not $packages) {
        Write-ErrorMessage "Unknown package group '$GroupName'."
        Pause-Toolkit
        return
    }

    Write-Section "Installing $GroupName Software Package ($($packages.Count) items)"
    
    $success = 0
    $skipped = 0
    $failed  = 0

    foreach ($key in $packages) {
        Install-WingetPackage -PackageKey $key -SuccessCount ([ref]$success) -SkipCount ([ref]$skipped) -FailCount ([ref]$failed)
    }

    Write-Host ""
    Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host " Installation Summary: $GroupName Pack" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  Successful : $success" -ForegroundColor Green
    Write-Host "  Skipped    : $skipped" -ForegroundColor Gray
    Write-Host "  Failed     : $failed"  -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
    Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
    Pause-Toolkit
}

function Show-SoftwareMenu {
    do {
        Show-Banner
        Write-Host "--- MODULE 1: SOFTWARE INSTALLER (WINGET) ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1] Install Essential Software  (Notepad++, Chrome, Firefox, Python, WinRAR, VLC, Avro)" -ForegroundColor White
        Write-Host "  [2] Browser Pack                (Chrome, Firefox)" -ForegroundColor White
        Write-Host "  [3] Developer Pack              (Python 3.14, Notepad++)" -ForegroundColor White
        Write-Host "  [4] Multimedia Pack             (VLC Media Player)" -ForegroundColor White
        Write-Host "  [5] Utility Pack                (WinRAR, Notepad++)" -ForegroundColor White
        Write-Host "  [6] Install Selected Apps       (Choose individually from catalog)" -ForegroundColor White
        Write-Host "  [7] Show Installed Status       (Check catalog apps on this machine)" -ForegroundColor White
        Write-Host "  [8] Refresh Winget Sources      (winget source update)" -ForegroundColor White
        Write-Host "  [0] Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "Select an option: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1" { Install-SoftwareGroup -GroupName "Essential" }
            "2" { Install-SoftwareGroup -GroupName "Browser" }
            "3" { Install-SoftwareGroup -GroupName "Developer" }
            "4" { Install-SoftwareGroup -GroupName "Multimedia" }
            "5" { Install-SoftwareGroup -GroupName "Utility" }
            "6" {
                if (-not (Test-Winget)) { Pause-Toolkit; break }
                Show-Banner
                Write-Section "Select Application to Install"
                $keys = @($Script:SoftwareCatalog.Keys)
                for ($i = 0; $i -lt $keys.Count; $i++) {
                    $k = $keys[$i]
                    $p = $Script:SoftwareCatalog[$k]
                    Write-Host "  [$($i + 1)] $($p.Name) [$($p.Id)]"
                }
                Write-Host "  [0] Cancel" -ForegroundColor DarkGray
                Write-Host ""
                Write-Host "Enter number: " -ForegroundColor Cyan -NoNewline
                $num = Read-Host
                if ($num -match "^\d+$" -and [int]$num -ge 1 -and [int]$num -le $keys.Count) {
                    $selectedKey = $keys[[int]$num - 1]
                    $s = 0; $sk = 0; $f = 0
                    Install-WingetPackage -PackageKey $selectedKey -SuccessCount ([ref]$s) -SkipCount ([ref]$sk) -FailCount ([ref]$f)
                    Pause-Toolkit
                }
            }
            "7" {
                if (-not (Test-Winget)) { Pause-Toolkit; break }
                Show-Banner
                Write-Section "Checking Installation Status of Catalog Apps"
                foreach ($k in $Script:SoftwareCatalog.Keys) {
                    $pkg = $Script:SoftwareCatalog[$k]
                    $installed = Get-InstalledPackage -PackageId $pkg.Id
                    if ($installed) {
                        Write-Host "  [INSTALLED] " -ForegroundColor Green -NoNewline
                    } else {
                        Write-Host "  [MISSING]   " -ForegroundColor Gray -NoNewline
                    }
                    Write-Host "$($pkg.Name) ($($pkg.Id))"
                }
                Pause-Toolkit
            }
            "8" {
                if (-not (Test-Winget)) { Pause-Toolkit; break }
                Write-Section "Refreshing Winget Sources"
                & winget source update
                Write-Success "Winget sources refreshed."
                Pause-Toolkit
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MODULE 2: NETWORK TOOLS
# ============================================================================

function Test-Internet {
    Write-InfoMessage "Testing internet connectivity..."
    $results = @{
        Gateway = $false
        DNS     = $false
        HTTP    = $false
    }

    # 1. Gateway Check
    try {
        $gw = (Get-NetRoute -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue | Select-Object -First 1).NextHop
        if ($gw) {
            $pingGw = Test-Connection -ComputerName $gw -Count 1 -Quiet -ErrorAction SilentlyContinue
            if ($pingGw) { $results.Gateway = $true }
        }
    } catch {}

    # 2. DNS Check
    try {
        $dnsRes = [System.Net.Dns]::GetHostAddresses("google.com")
        if ($dnsRes.Count -gt 0) { $results.DNS = $true }
    } catch {}

    # 3. HTTPS Check
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
    if ($results.Gateway) { Write-Success "Default Gateway Reachable" } else { Write-WarningMessage "Default Gateway unreachable or ICMP blocked" }
    if ($results.DNS)     { Write-Success "DNS Resolution Functional" } else { Write-ErrorMessage "DNS Resolution failed" }
    if ($results.HTTP)    { Write-Success "HTTPS Connectivity Active" } else { Write-ErrorMessage "HTTPS connection failed" }
    
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
        Write-Host "--- MODULE 2: NETWORK TOOLS ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1] Show IP Configuration       (IPv4, IPv6, Gateway, Adapters)" -ForegroundColor White
        Write-Host "  [2] Ping Test                   (Test ICMP response to host/IP)" -ForegroundColor White
        Write-Host "  [3] Internet Connectivity Test  (Gateway, DNS, and HTTPS validation)" -ForegroundColor White
        Write-Host "  [4] DNS Lookup                  (Resolve domain names and records)" -ForegroundColor White
        Write-Host "  [5] Traceroute                  (Trace route hops to remote host)" -ForegroundColor White
        Write-Host "  [6] Flush DNS Cache             (Clear-DnsClientCache / ipconfig)" -ForegroundColor White
        Write-Host "  [7] Release IP Address          (ipconfig /release)" -ForegroundColor White
        Write-Host "  [8] Renew IP Address            (ipconfig /renew)" -ForegroundColor White
        Write-Host "  [9] Show Network Adapters       (Status, link speed, MAC)" -ForegroundColor White
        Write-Host "  [10] Show WiFi Information      (Interfaces, SSID, Signal)" -ForegroundColor White
        Write-Host "  [11] Show Saved WiFi Profiles   (Profile names safely listed)" -ForegroundColor White
        Write-Host "  [12] Reset Network Stack        (Disruptive: Winsock, IP, DNS flush)" -ForegroundColor White
        Write-Host "  [13] Change DNS Server          (Google, Cloudflare, Quad9, DHCP)" -ForegroundColor White
        Write-Host "  [0] Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "Select an option: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1" {
                Show-Banner
                Write-Section "Active Network IP Configuration"
                try {
                    Get-NetIPConfiguration | ForEach-Object {
                        Write-Host "Adapter: $($_.InterfaceAlias) ($($_.InterfaceDescription))" -ForegroundColor Cyan
                        Write-Host "  IPv4 Address : $($_.IPv4Address.IPAddress -join ', ')"
                        Write-Host "  IPv6 Address : $($_.IPv6Address.IPAddress -join ', ')"
                        Write-Host "  IPv4 Gateway : $($_.IPv4DefaultGateway.NextHop -join ', ')"
                        Write-Host "  DNS Servers  : $($_.DNSServer.ServerAddresses -join ', ')"
                        Write-Host "  Status       : $($_.NetAdapter.Status)"
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
                Write-Section "Ping Test"
                Write-Host "Enter hostname or IP (default: 8.8.8.8): " -ForegroundColor Cyan -NoNewline
                $target = Read-Host
                if ([string]::IsNullOrWhiteSpace($target)) { $target = "8.8.8.8" }
                
                # Sanitize input: only valid hostname/IP characters
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
                Write-Section "DNS Lookup"
                Write-Host "Enter domain name to resolve (e.g. google.com): " -ForegroundColor Cyan -NoNewline
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
                Write-Section "Traceroute"
                Write-Host "Enter target hostname or IP (e.g. 1.1.1.1): " -ForegroundColor Cyan -NoNewline
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
                Write-Section "Flushing DNS Cache"
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
                if (Confirm-Action "Release current IP address?" "Your network will disconnect until renewed.") {
                    & ipconfig /release
                    Write-Success "IP addresses released."
                }
                Pause-Toolkit
            }
            "8" {
                if (-not (Request-Admin "Renewing IP requires administrator privileges.")) { break }
                Write-InfoMessage "Renewing IP configuration from DHCP..."
                & ipconfig /renew
                Write-Success "IP addresses renewed."
                Pause-Toolkit
            }
            "9" {
                Show-Banner
                Write-Section "Network Adapters"
                Get-NetAdapter | Format-Table Name, InterfaceDescription, Status, LinkSpeed, MacAddress -AutoSize
                Pause-Toolkit
            }
            "10" {
                Show-Banner
                Write-Section "WiFi Interface Information"
                & netsh wlan show interfaces
                Pause-Toolkit
            }
            "11" {
                Show-Banner
                Write-Section "Saved WiFi Profiles"
                & netsh wlan show profiles
                Write-Host ""
                Write-InfoMessage "Note: Passwords are not displayed by default to protect local credentials."
                Write-Host "  View specific saved key? Requires Admin & Confirmation [Y/N]: " -ForegroundColor Cyan -NoNewline
                $viewKey = Read-Host
                if ($viewKey -match "^[Yy]$") {
                    if (Request-Admin "Viewing stored WiFi keys requires elevation.") {
                        Write-Host "Enter exact Profile Name: " -ForegroundColor Cyan -NoNewline
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
                Write-Section "Predefined DNS Providers"
                foreach ($k in $Script:DnsPresets.Keys) {
                    Write-Host "  [$k] $($Script:DnsPresets[$k].Name)"
                }
                Write-Host "  [0] Cancel" -ForegroundColor DarkGray
                Write-Host ""
                Write-Host "Select provider [1-4]: " -ForegroundColor Cyan -NoNewline
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
        Write-Host "--- MODULE 3: WINDOWS REPAIR ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1] System File Checker (SFC)     (sfc /scannow - checks and fixes corrupted system files)" -ForegroundColor White
        Write-Host "  [2] DISM Health Check             (DISM CheckHealth & ScanHealth - safe read-only)" -ForegroundColor White
        Write-Host "  [3] DISM Restore Health           (DISM RestoreHealth - repairs Windows image)" -ForegroundColor White
        Write-Host "  [4] CHKDSK Disk Inspection        (Read-only volume check on C:)" -ForegroundColor White
        Write-Host "  [5] Windows Update Repair         (Safely stops services, purges update cache, restarts)" -ForegroundColor White
        Write-Host "  [6] Full Network Repair           (DNS flush, register, winsock reset, release/renew)" -ForegroundColor White
        Write-Host "  [7] Component Store Cleanup       (DISM StartComponentCleanup)" -ForegroundColor White
        Write-Host "  [0] Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "Select an option: " -ForegroundColor Cyan -NoNewline
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
            # File is locked by an active process
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
        Write-Host "--- MODULE 4: CLEANUP TOOLS ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1] User Temp Cleanup            ($env:TEMP)" -ForegroundColor White
        Write-Host "  [2] Windows Temp Cleanup         ($env:SystemRoot\Temp - Requires Admin)" -ForegroundColor White
        Write-Host "  [3] Recycle Bin Cleanup          (Clear all recycle bins)" -ForegroundColor White
        Write-Host "  [4] DNS Cache Cleanup            (Flush resolver cache)" -ForegroundColor White
        Write-Host "  [5] Windows Update Cache         ($env:SystemRoot\SoftwareDistribution\Download)" -ForegroundColor White
        Write-Host "  [6] Launch Windows Disk Cleanup  (cleanmgr.exe)" -ForegroundColor White
        Write-Host "  [7] Browser Cache Cleanup        (User cache folders for Chrome, Edge, Firefox)" -ForegroundColor White
        Write-Host "  [8] Show Temporary File Sizes    (Analyze total junk disk usage)" -ForegroundColor White
        Write-Host "  [0] Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "Select an option: " -ForegroundColor Cyan -NoNewline
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
                        Write-Host "  $($t.Name.PadRight(25)) : $mb MB"
                    } else {
                        Write-Host "  $($t.Name.PadRight(25)) : Not Found" -ForegroundColor DarkGray
                    }
                }

                $totalMB = [Math]::Round($totalBytes / 1MB, 2)
                $totalGB = [Math]::Round($totalBytes / 1GB, 2)
                Write-Host "  -------------------------------------------"
                Write-Host "  Total Estimated Junk       : $totalMB MB ($totalGB GB)" -ForegroundColor Cyan
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
        Write-Host "--- MODULE 5: SYSTEM INFORMATION ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1] Windows OS Information      (Edition, Version, Build, Uptime)" -ForegroundColor White
        Write-Host "  [2] Computer System Info        (Model, Manufacturer, Hostname)" -ForegroundColor White
        Write-Host "  [3] Processor (CPU) Info        (Cores, Threads, Base Clock)" -ForegroundColor White
        Write-Host "  [4] Memory (RAM) Info           (Module sizes, Speed, Slots)" -ForegroundColor White
        Write-Host "  [5] Disk & Storage Info         (Physical drives and logical volumes)" -ForegroundColor White
        Write-Host "  [6] Graphics (GPU) Info         (Display adapters, Video RAM, Driver)" -ForegroundColor White
        Write-Host "  [7] BIOS / UEFI Info            (Vendor, Version, Release Date)" -ForegroundColor White
        Write-Host "  [8] Motherboard Info            (Manufacturer, Product, Serial)" -ForegroundColor White
        Write-Host "  [9] Active Network Adapters     (IPs, MAC, Speed, Status)" -ForegroundColor White
        Write-Host "  [10] Full System Audit Report   (Comprehensive diagnostic overview)" -ForegroundColor White
        Write-Host "  [0] Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "Select an option: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1" {
                Show-Banner
                Write-Section "Windows Operating System Information"
                $os = Get-CimInstance Win32_OperatingSystem
                $uptime = (Get-Date) - $os.LastBootUpTime
                Write-Host "  OS Name        : $($os.Caption)"
                Write-Host "  Version        : $($os.Version)"
                Write-Host "  Build Number   : $($os.BuildNumber)"
                Write-Host "  Architecture   : $($os.OSArchitecture)"
                Write-Host "  Installed On   : $($os.InstallDate)"
                Write-Host "  Last Boot Time : $($os.LastBootUpTime)"
                Write-Host "  System Uptime  : $($uptime.Days)d $($uptime.Hours)h $($uptime.Minutes)m $($uptime.Seconds)s"
                Write-Host "  System Drive   : $($os.SystemDrive)"
                Pause-Toolkit
            }
            "2" {
                Show-Banner
                Write-Section "Computer Hardware Identification"
                $cs = Get-CimInstance Win32_ComputerSystem
                Write-Host "  Hostname       : $($cs.Name)"
                Write-Host "  Manufacturer   : $($cs.Manufacturer)"
                Write-Host "  Model          : $($cs.Model)"
                Write-Host "  System Type    : $($cs.SystemType)"
                Write-Host "  Domain/Workgrp : $($cs.Domain)"
                Write-Host "  Total Memory   : $([Math]::Round($cs.TotalPhysicalMemory / 1GB, 2)) GB"
                Pause-Toolkit
            }
            "3" {
                Show-Banner
                Write-Section "Processor (CPU) Details"
                Get-CimInstance Win32_Processor | ForEach-Object {
                    Write-Host "  Device ID      : $($_.DeviceID)"
                    Write-Host "  Processor Name : $($_.Name.Trim())"
                    Write-Host "  Physical Cores : $($_.NumberOfCores)"
                    Write-Host "  Logical Threads: $($_.NumberOfLogicalProcessors)"
                    Write-Host "  Max Clock Speed: $($_.MaxClockSpeed) MHz"
                    Write-Host "  Socket Type    : $($_.SocketDesignation)"
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
                    Write-Host "  Bank: $($m.DeviceLocator) | Size: $gb GB | Speed: $($m.Speed) MHz | Vendor: $($m.Manufacturer.Trim()) | Part: $($m.PartNumber.Trim())"
                }
                Write-Host "  ------------------------------------------------------------------"
                Write-Host "  Total Installed RAM: $([Math]::Round($totalRam / 1GB, 2)) GB across $($sticks.Count) module(s)" -ForegroundColor Cyan
                Pause-Toolkit
            }
            "5" {
                Show-Banner
                Write-Section "Storage Disks & Volumes"
                Write-Host "Physical Disk Drives:" -ForegroundColor Cyan
                Get-CimInstance Win32_DiskDrive | ForEach-Object {
                    $sizeGb = [Math]::Round($_.Size / 1GB, 2)
                    Write-Host "  [$($_.Index)] $($_.Model) ($sizeGb GB, Interface: $($_.InterfaceType))"
                }
                Write-Host ""
                Write-Host "Logical Drive Volumes:" -ForegroundColor Cyan
                Get-Volume | Where-Object { $_.DriveLetter } | Format-Table DriveLetter, FileSystemLabel, FileSystem, @{Name="Size(GB)";Expression={[Math]::Round($_.Size/1GB,2)}}, @{Name="Free(GB)";Expression={[Math]::Round($_.SizeRemaining/1GB,2)}}, HealthStatus -AutoSize
                Pause-Toolkit
            }
            "6" {
                Show-Banner
                Write-Section "Graphics Controllers (GPU)"
                Get-CimInstance Win32_VideoController | ForEach-Object {
                    $vram = if ($_.AdapterRAM) { [Math]::Round($_.AdapterRAM / 1MB, 0) } else { "N/A" }
                    Write-Host "  GPU Name       : $($_.Name)"
                    Write-Host "  Driver Version : $($_.DriverVersion)"
                    Write-Host "  Resolution     : $($_.CurrentHorizontalResolution) x $($_.CurrentVerticalResolution) @ $($_.CurrentRefreshRate)Hz"
                    Write-Host "  Adapter VRAM   : $vram MB"
                    Write-Host ""
                }
                Pause-Toolkit
            }
            "7" {
                Show-Banner
                Write-Section "BIOS / Firmware Information"
                $bios = Get-CimInstance Win32_BIOS
                Write-Host "  BIOS Vendor    : $($bios.Manufacturer)"
                Write-Host "  Version        : $($bios.SMBIOSBIOSVersion)"
                Write-Host "  Release Date   : $($bios.ReleaseDate)"
                Write-Host "  Serial Number  : $($bios.SerialNumber)"
                Pause-Toolkit
            }
            "8" {
                Show-Banner
                Write-Section "Motherboard (BaseBoard)"
                $mb = Get-CimInstance Win32_BaseBoard
                Write-Host "  Manufacturer   : $($mb.Manufacturer)"
                Write-Host "  Product Model  : $($mb.Product)"
                Write-Host "  Serial Number  : $($mb.SerialNumber)"
                Write-Host "  Version        : $($mb.Version)"
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

                Write-Host "  Device Name    : $($cs.Name)" -ForegroundColor Cyan
                Write-Host "  OS             : $($os.Caption) (Build $($os.BuildNumber))"
                Write-Host "  Motherboard    : $($cs.Manufacturer) $($cs.Model)"
                Write-Host "  BIOS           : $($bios.SMBIOSBIOSVersion) ($($bios.Manufacturer))"
                Write-Host "  CPU            : $($cpu.Name.Trim())"
                Write-Host "  Memory         : $ram GB RAM"
                Write-Host "  Disks Summary  :"
                Get-Volume | Where-Object { $_.DriveLetter } | ForEach-Object {
                    $freeGb = [Math]::Round($_.SizeRemaining / 1GB, 1)
                    $totalGb = [Math]::Round($_.Size / 1GB, 1)
                    Write-Host "    - $($_.DriveLetter): [$($_.FileSystemLabel)] $freeGb GB free of $totalGb GB"
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
        Write-Host "--- MODULE 6: WINDOWS BUILT-IN UTILITIES ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1] Task Manager               (taskmgr.exe)" -ForegroundColor White
        Write-Host "  [2] Device Manager             (devmgmt.msc)" -ForegroundColor White
        Write-Host "  [3] Windows Services           (services.msc)" -ForegroundColor White
        Write-Host "  [4] Computer Management        (compmgmt.msc)" -ForegroundColor White
        Write-Host "  [5] Registry Editor            (regedit.exe)" -ForegroundColor White
        Write-Host "  [6] Classic Control Panel      (control.exe)" -ForegroundColor White
        Write-Host "  [7] Windows Modern Settings    (ms-settings:)" -ForegroundColor White
        Write-Host "  [8] Open Command Prompt        (cmd.exe)" -ForegroundColor White
        Write-Host "  [9] Open New PowerShell        (powershell.exe)" -ForegroundColor White
        Write-Host "  [10] Event Viewer              (eventvwr.msc)" -ForegroundColor White
        Write-Host "  [11] Disk Management           (diskmgmt.msc)" -ForegroundColor White
        Write-Host "  [12] System Properties         (sysdm.cpl)" -ForegroundColor White
        Write-Host "  [0] Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "Select an option: " -ForegroundColor Cyan -NoNewline
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
        Write-Host "--- MODULE 7: WINDOWS CONFIGURATION ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1] Set Computer Name           (Rename-Computer - requires reboot)" -ForegroundColor White
        Write-Host "  [2] Show Current Time Zone      (Get-TimeZone)" -ForegroundColor White
        Write-Host "  [3] Change Time Zone            (Set-TimeZone from list)" -ForegroundColor White
        Write-Host "  [4] Windows Activation Status   (Official licensing query only)" -ForegroundColor White
        Write-Host "  [5] Windows Update Settings     (Launch update configuration)" -ForegroundColor White
        Write-Host "  [6] Power Plan Configuration    (List and set active power scheme)" -ForegroundColor White
        Write-Host "  [7] Default Browser Info        (Read configured default HTTP handler)" -ForegroundColor White
        Write-Host "  [0] Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "Select an option: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1" {
                if (-not (Request-Admin "Renaming the computer requires administrative privileges.")) { break }
                Show-Banner
                Write-Section "Rename Computer"
                Write-Host "Current Computer Name: $env:COMPUTERNAME" -ForegroundColor Cyan
                Write-Host "Enter New Computer Name: " -ForegroundColor Cyan -NoNewline
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
                    Write-Host "  [$($i + 1)] $($zones[$i])"
                }
                Write-Host "  [0] Cancel" -ForegroundColor DarkGray
                Write-Host ""
                Write-Host "Select time zone [1-$($zones.Count)]: " -ForegroundColor Cyan -NoNewline
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
                        Write-Host "  Product Name   : $($lic.Name)"
                        Write-Host "  Description    : $($lic.Description)"
                        Write-Host "  License Status : $statusText" -ForegroundColor $(if ($lic.LicenseStatus -eq 1) { "Green" } else { "Yellow" })
                        Write-Host "  Partial Key    : ...-$($lic.PartialProductKey)"
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
                Write-Host "Quick Set: [1] High Performance | [2] Balanced | [3] Power Saver | [0] Skip: " -ForegroundColor Cyan -NoNewline
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
                    Write-Host "  Configured HTTP Protocol Handler (ProgId): $progId" -ForegroundColor Cyan
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
        Write-Host "--- MODULE 8: QUICK ACTIONS (ONE-CLICK DIAGNOSTICS) ---" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1] Flush DNS Resolver Cache" -ForegroundColor White
        Write-Host "  [2] Quick Internet Connectivity Test" -ForegroundColor White
        Write-Host "  [3] Show Current IP Information" -ForegroundColor White
        Write-Host "  [4] Restart Windows Explorer" -ForegroundColor White
        Write-Host "  [5] Open Task Manager" -ForegroundColor White
        Write-Host "  [6] Open Windows Settings" -ForegroundColor White
        Write-Host "  [7] Run System File Checker (SFC)" -ForegroundColor White
        Write-Host "  [8] Run DISM RestoreHealth" -ForegroundColor White
        Write-Host "  [9] Install Essential Software Pack" -ForegroundColor White
        Write-Host "  [0] Back to Main Menu" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "Select an option: " -ForegroundColor Cyan -NoNewline
        $choice = Read-Host

        switch ($choice) {
            "1" {
                Clear-DnsClientCache
                Write-Success "DNS cache flushed."
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
                Install-SoftwareGroup -GroupName "Essential"
            }
        }
    } while ($choice -ne "0")
}

# ============================================================================
# MAIN ENTRY LOOP
# ============================================================================

function Start-Toolkit {
    # Set console title if supported
    try {
        $Host.UI.RawUI.WindowTitle = "$ToolkitName v$ToolkitVersion"
    } catch {}

    do {
        Show-MainMenu
        Write-Host "Select an option [0-8]: " -ForegroundColor Cyan -NoNewline
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
                Write-Host "Thank you for using $ToolkitName!" -ForegroundColor Cyan
                Write-Host "Author: ItsRiRx | Have a productive day." -ForegroundColor Gray
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
