import React, { useState } from 'react';

interface AppLogoProps {
  id: string;
  name?: string;
  className?: string;
}

// Maps winget IDs to SimpleIcons slugs for high-fidelity fallback
const SIMPLE_ICONS_MAP: Record<string, { slug: string; color: string }> = {
  'Microsoft.Office': { slug: 'microsoftoffice', color: 'D83B01' },
  'Kingsoft.WPSOffice': { slug: 'wpspresentation', color: 'D24726' },
  'TheDocumentFoundation.LibreOffice': { slug: 'libreoffice', color: '18A303' },
  'Notepad++.Notepad++': { slug: 'notepadplusplus', color: '90E59A' },
  'Adobe.Acrobat.Reader.64-bit': { slug: 'adobereader', color: 'EC1C24' },
  'Google.GoogleDrive': { slug: 'googledrive', color: '4285F4' },
  'Microsoft.OneDrive': { slug: 'microsoftonedrive', color: '0078D4' },
  'Dropbox.Dropbox': { slug: 'dropbox', color: '0061FF' },
  'Mega.MEGAsync': { slug: 'mega', color: 'D9272E' },
  'AnyDeskSoftwareGmbH.AnyDesk': { slug: 'anydesk', color: 'EF243B' },
  'TeamViewer.TeamViewer': { slug: 'teamviewer', color: '0E80E5' },
  'RustDesk.RustDesk': { slug: 'rustdesk', color: '0E80E5' },
  'PuTTY.PuTTY': { slug: 'putty', color: '0000FF' },
  'Figma.Figma': { slug: 'figma', color: 'F24E1E' },
  'Canva.Canva': { slug: 'canva', color: '00C4CC' },
  'GIMP.GIMP': { slug: 'gimp', color: '5C5543' },
  'Inkscape.Inkscape': { slug: 'inkscape', color: '000000' },
  'BlenderFoundation.Blender': { slug: 'blender', color: 'F5792A' },
  'OpenAI.ChatGPT': { slug: 'openai', color: '10A37F' },
  'Google.Gemini': { slug: 'googlegemini', color: '8E75FF' },
  'Anthropic.Claude': { slug: 'anthropic', color: 'D97757' },
  'Microsoft.Copilot': { slug: 'microsoftcopilot', color: '0078D4' },
  'Perplexity.Perplexity': { slug: 'perplexity', color: '20B2AA' },
  'Duplicati.Duplicati': { slug: 'duplicati', color: '2077B4' },
  'Macrium.ReflectFree': { slug: 'microsoftexchange', color: '0078D4' },
  'EaseUS.TodoBackupFree': { slug: 'serverless', color: 'FD5750' },
  'CPUID.CPU-Z': { slug: 'cpu', color: '6B21A8' },
  'TechPowerUp.GPU-Z': { slug: 'nvidia', color: '76B900' },
  'CrystalDewWorld.CrystalDiskInfo': { slug: 'harddrive', color: '0284C7' },
  'CrystalDewWorld.CrystalDiskMark': { slug: 'speedtest', color: '14B8A6' },
  'Wagnardsoft.DisplayDriverUninstaller': { slug: 'amd', color: 'ED1C24' },
  'WiresharkFoundation.Wireshark': { slug: 'wireshark', color: '1679A7' },
  'Insecure.Nmap': { slug: 'nmap', color: '2563EB' },
  'WinSCP.WinSCP': { slug: 'files', color: '2563EB' },
  'AdvancedIPScanner.AdvancedIPScanner': { slug: 'radar', color: '0D9488' },
  'Tonec.InternetDownloadManager': { slug: 'download', color: '16A34A' },
  'FreeDownloadManager.FreeDownloadManager': { slug: 'fdroid', color: '1976D2' },
  'qBittorrent.qBittorrent': { slug: 'qbittorrent', color: '2F679F' },
  'dbeaver.dbeaver': { slug: 'dbeaver', color: '382923' },
  'FileZilla.FileZilla': { slug: 'filezilla', color: 'BF0000' },
  'PostgreSQL.pgAdmin': { slug: 'postgresql', color: '4169E1' },
  'Google.Chrome': { slug: 'googlechrome', color: '4285F4' },
  'Mozilla.Firefox': { slug: 'firefox', color: 'FF7139' },
  'Microsoft.Edge': { slug: 'microsoftedge', color: '0078D7' },
  'Brave.Brave': { slug: 'brave', color: 'FB542B' },
  'Opera.Opera': { slug: 'opera', color: 'FF1B2D' },
  'Microsoft.VisualStudioCode': { slug: 'visualstudiocode', color: '007ACC' },
  'Microsoft.VisualStudioCode.Insiders': { slug: 'visualstudiocode', color: '22A565' },
  'Git.Git': { slug: 'git', color: 'F05032' },
  'Python.Python.3.14': { slug: 'python', color: '3776AB' },
  'OpenJS.NodeJS.LTS': { slug: 'nodedotjs', color: '5FA04E' },
  'VideoLAN.VLC': { slug: 'vlcmediaplayer', color: 'FF8800' },
  'Spotify.Spotify': { slug: 'spotify', color: '1ED760' },
  'OBSProject.OBSStudio': { slug: 'obsstudio', color: '302E31' },
  'Audacity.Audacity': { slug: 'audacity', color: '0000EB' },
  'HandBrake.HandBrake': { slug: 'handbrake', color: '7D5F34' },
  '7zip.7zip': { slug: '7zip', color: '000000' },
  'RARLab.WinRAR': { slug: 'winrar', color: '4D78B8' },
  'Microsoft.VCRedist.2015+.x64': { slug: 'cplusplus', color: '00599C' },
  'voidtools.Everything': { slug: 'search', color: 'F97316' },
  'Microsoft.PowerToys': { slug: 'windows', color: '0078D6' },
  'Rufus.Rufus': { slug: 'usb', color: '2563EB' },
  'ShareX.ShareX': { slug: 'sharex', color: '1888CC' },
  'File-New-Project.EarTrumpet': { slug: 'windows', color: '1E88E5' },
  'OmicronLab.Avro': { slug: 'keyboard', color: '059669' },
  'WhatsApp.WhatsApp': { slug: 'whatsapp', color: '25D366' },
  'Telegram.TelegramDesktop': { slug: 'telegram', color: '26A5E4' },
  'Discord.Discord': { slug: 'discord', color: '5865F2' },
  'Zoom.Zoom': { slug: 'zoom', color: '0B5CFF' },
  'Microsoft.Teams': { slug: 'microsoftteams', color: '6264A7' },
  'Valve.Steam': { slug: 'steam', color: '000000' },
  'EpicGames.EpicGamesLauncher': { slug: 'epicgames', color: '313131' },
  'Microsoft.DirectX': { slug: 'microsoft', color: '0078D4' },
  'ElectronicArts.EADesktop': { slug: 'ea', color: 'FF4747' },
  'Ubisoft.Connect': { slug: 'ubisoft', color: '000000' },
  'RiotGames.RiotClient': { slug: 'riotgames', color: 'D32936' },
  'Microsoft.GamingApp': { slug: 'xbox', color: '107C10' },
  'Bitwarden.Bitwarden': { slug: 'bitwarden', color: '175DDC' },
  'Malwarebytes.Malwarebytes': { slug: 'malwarebytes', color: '0069B4' },
  'Proton.ProtonVPN': { slug: 'protonvpn', color: '6D4AFF' }
};

export const AppLogo: React.FC<AppLogoProps> = ({ id, name, className = 'w-14 h-14' }) => {
  const [cdnFailed, setCdnFailed] = useState(false);

  // 1. First-class Pixel-Perfect Vector SVGs for Top Major Brands
  switch (id) {
    // Google Chrome
    case 'Google.Chrome':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#f8fafc" />
          <path d="M50 4 A46 46 0 0 1 89.8 73 L67.8 73 A23 23 0 0 0 50 27 Z" fill="#EA4335" />
          <path d="M89.8 73 A46 46 0 0 1 10.2 73 L21.2 54 A23 23 0 0 0 67.8 73 Z" fill="#FBBC05" />
          <path d="M10.2 73 A46 46 0 0 1 50 4 L61 23 A23 23 0 0 0 21.2 54 Z" fill="#34A853" />
          <circle cx="50" cy="50" r="23" fill="#ffffff" />
          <circle cx="50" cy="50" r="18" fill="#4285F4" />
        </svg>
      );

    // Mozilla Firefox
    case 'Mozilla.Firefox':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="44" fill="#3B82F6" />
          <circle cx="48" cy="50" r="38" fill="#1D4ED8" />
          <path
            d="M 50 8 C 72 8, 90 26, 90 48 C 90 70, 72 90, 50 90 C 26 90, 10 70, 10 48 C 10 32, 20 18, 36 12 C 34 20, 38 28, 46 32 C 40 36, 36 44, 38 52 C 42 42, 50 38, 56 34 C 64 28, 68 18, 50 8 Z"
            fill="#F97316"
          />
          <path
            d="M 50 90 C 66 90, 82 78, 86 60 C 82 74, 68 84, 52 84 C 36 84, 26 72, 28 58 C 22 68, 30 84, 50 90 Z"
            fill="#EF4444"
          />
          <circle cx="50" cy="50" r="24" fill="#FBBF24" />
        </svg>
      );

    // Microsoft Edge
    case 'Microsoft.Edge':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0078D7" />
              <stop offset="50%" stopColor="#00BCF2" />
              <stop offset="100%" stopColor="#107C41" />
            </linearGradient>
          </defs>
          <path
            d="M 78 48 C 76 34, 64 24, 48 24 C 32 24, 20 36, 20 52 C 20 70, 34 82, 52 82 C 68 82, 80 72, 80 58 C 80 50, 74 44, 64 44 C 44 44, 34 60, 52 64 C 62 66, 68 62, 68 56 C 68 50, 60 48, 52 48 C 38 48, 32 56, 32 64 C 32 74, 42 78, 52 78 C 66 78, 76 68, 78 48 Z"
            fill="url(#edgeGrad)"
          />
          <path
            d="M 50 14 C 28 14, 12 30, 12 52 C 12 74, 28 88, 50 88 C 68 88, 82 76, 86 60 C 80 70, 66 78, 50 78 C 34 78, 22 66, 22 52 C 22 36, 34 24, 50 24 C 64 24, 76 32, 80 44 C 84 28, 70 14, 50 14 Z"
            fill="#0284c7"
            opacity="0.3"
          />
        </svg>
      );

    // VS Code
    case 'Microsoft.VisualStudioCode':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 72 12 L 92 24 L 92 76 L 72 88 L 34 56 L 16 70 L 8 62 L 24 50 L 8 38 L 16 30 L 34 44 Z" fill="#007ACC" />
          <path d="M 72 12 L 92 24 L 92 76 L 72 88 L 52 70 L 52 30 Z" fill="#1F9CF0" />
          <path d="M 72 88 L 34 56 L 52 40 L 72 58 Z" fill="#0065A9" opacity="0.6" />
        </svg>
      );

    // VS Code Insiders
    case 'Microsoft.VisualStudioCode.Insiders':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 72 12 L 92 24 L 92 76 L 72 88 L 34 56 L 16 70 L 8 62 L 24 50 L 8 38 L 16 30 L 34 44 Z" fill="#22A565" />
          <path d="M 72 12 L 92 24 L 92 76 L 72 88 L 52 70 L 52 30 Z" fill="#37C47A" />
          <path d="M 72 88 L 34 56 L 52 40 L 72 58 Z" fill="#187B4B" opacity="0.6" />
        </svg>
      );

    // Zoom Workplace
    case 'Zoom.Zoom':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="24" fill="#0B5CFF" />
          <path
            d="M 24 38 C 24 33 27 30 32 30 L 52 30 C 57 30 60 33 60 38 L 60 62 C 60 67 57 70 52 70 L 32 70 C 27 70 24 67 24 62 Z"
            fill="#FFFFFF"
          />
          <path
            d="M 64 42 L 74 34 C 77 32 80 34 80 37 L 80 63 C 80 66 77 68 74 66 L 64 58 Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    // OBS Studio
    case 'OBSProject.OBSStudio':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#18181b" />
          <circle cx="50" cy="50" r="44" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
          <g fill="#ffffff">
            <path d="M 50 18 C 62 18 72 26 76 36 C 70 34 62 36 56 42 C 54 36 50 30 42 26 C 44 21 47 18 50 18 Z" />
            <path d="M 78 54 C 78 68 70 78 58 82 C 60 76 58 68 52 62 C 58 60 64 56 68 48 C 73 50 76 52 78 54 Z" />
            <path d="M 28 64 C 20 54 22 42 28 32 C 32 36 38 40 46 40 C 44 46 44 54 48 62 C 43 64 36 66 28 64 Z" />
            <circle cx="50" cy="50" r="8" fill="#18181b" />
          </g>
        </svg>
      );

    // Discord
    case 'Discord.Discord':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#5865F2" />
          <path
            d="M 70 32 C 65 30 60 28 55 28 L 54 30 C 60 32 63 34 66 37 C 58 33 49 31 40 31 C 31 31 22 33 14 37 C 17 34 20 32 26 30 L 25 28 C 20 28 15 30 10 32 C 4 44 2 56 3 67 C 9 72 16 74 22 74 L 25 70 C 19 68 16 65 14 62 C 16 63 18 64 21 65 C 29 69 40 71 50 71 C 60 71 71 69 79 65 C 82 64 84 63 86 62 C 84 65 81 68 75 70 L 78 74 C 84 74 91 72 97 67 C 98 55 94 43 70 32 Z M 35 56 C 31 56 27 52 27 48 C 27 43 31 39 35 39 C 40 39 43 43 43 48 C 43 52 40 56 35 56 Z M 65 56 C 60 56 57 52 57 48 C 57 43 60 39 65 39 C 70 39 73 43 73 48 C 73 52 70 56 65 56 Z"
            fill="#FFFFFF"
            transform="scale(0.85) translate(8, 8)"
          />
        </svg>
      );

    // Dropbox
    case 'Dropbox.Dropbox':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <g fill="#0061FF">
            <path d="M 28 20 L 50 34 L 28 48 L 6 34 Z" />
            <path d="M 72 20 L 94 34 L 72 48 L 50 34 Z" />
            <path d="M 28 48 L 50 62 L 28 76 L 6 62 Z" />
            <path d="M 72 48 L 94 62 L 72 76 L 50 62 Z" />
            <path d="M 50 64 L 72 78 L 50 92 L 28 78 Z" />
          </g>
        </svg>
      );

    // EarTrumpet
    case 'File-New-Project.EarTrumpet':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="24" fill="#1E88E5" />
          <path d="M 30 42 L 44 42 L 58 30 L 58 70 L 44 58 L 30 58 Z" fill="#FFFFFF" />
          <path d="M 66 38 C 72 44 72 56 66 62" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <path d="M 74 30 C 84 40 84 60 74 70" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    // ShareX
    case 'ShareX.ShareX':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="44" fill="#ffffff" />
          <path d="M 50 14 C 68 14 84 28 86 46 L 70 46 C 68 36 60 28 50 28 Z" fill="#22c55e" />
          <path d="M 86 46 C 88 64 74 80 56 86 L 56 70 C 66 68 74 60 74 50 Z" fill="#0ea5e9" />
          <path d="M 56 86 C 38 88 22 74 16 56 L 32 56 C 34 66 42 74 52 74 Z" fill="#eab308" />
          <path d="M 16 56 C 14 38 28 22 46 16 L 46 32 C 36 34 28 42 28 52 Z" fill="#ef4444" />
        </svg>
      );

    // Microsoft Teams
    case 'Microsoft.Teams':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="68" cy="34" r="10" fill="#7B83EB" />
          <rect x="52" y="46" width="32" height="28" rx="6" fill="#7B83EB" />
          <circle cx="40" cy="28" r="14" fill="#5059C9" />
          <rect x="18" y="44" width="44" height="38" rx="8" fill="#5059C9" />
          <rect x="14" y="38" width="30" height="30" rx="6" fill="#464EB8" />
          <text x="29" y="60" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">T</text>
        </svg>
      );

    // Steam
    case 'Valve.Steam':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#171A21" />
          <path
            d="M 50 8 C 28 8 10 24 8 46 L 32 56 C 36 52 42 50 48 52 L 64 36 C 64 30 70 24 76 24 C 84 24 90 30 90 38 C 90 46 84 52 76 52 L 60 68 C 60 74 56 80 50 82 C 42 84 34 80 32 72 L 14 64 C 18 80 32 92 50 92 C 73 92 92 73 92 50 C 92 27 73 8 50 8 Z"
            fill="#1999D6"
          />
          <circle cx="76" cy="38" r="7" fill="#ffffff" />
          <circle cx="44" cy="66" r="8" fill="#ffffff" />
        </svg>
      );

    // Spotify
    case 'Spotify.Spotify':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#1DB954" />
          <path d="M 28 40 C 44 34 62 36 74 42" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 32 50 C 44 46 58 48 68 53" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 34 60 C 44 56 56 58 64 62" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );

    // VLC
    case 'VideoLAN.VLC':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 44 14 L 56 14 L 62 34 L 38 34 Z" fill="#F97316" />
          <path d="M 38 34 L 62 34 L 68 52 L 32 52 Z" fill="#FFFFFF" />
          <path d="M 32 52 L 68 52 L 74 70 L 26 70 Z" fill="#F97316" />
          <path d="M 26 70 L 74 70 L 78 80 L 22 80 Z" fill="#FFFFFF" />
          <rect x="14" y="80" width="72" height="10" rx="5" fill="#F97316" />
        </svg>
      );

    // 7-Zip
    case '7zip.7zip':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="18" fill="#18181b" />
          <rect x="10" y="24" width="80" height="52" fill="#000000" stroke="#3b82f6" strokeWidth="3" rx="4" />
          <text x="35" y="60" fill="#ffffff" fontSize="32" fontWeight="900" fontFamily="monospace">7</text>
          <text x="65" y="60" fill="#38bdf8" fontSize="24" fontWeight="bold" fontFamily="sans-serif">z</text>
        </svg>
      );

    // WinRAR
    case 'RARLab.WinRAR':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect x="24" y="16" width="52" height="18" rx="3" fill="#3B82F6" />
          <rect x="20" y="36" width="60" height="18" rx="3" fill="#10B981" />
          <rect x="22" y="56" width="56" height="18" rx="3" fill="#8B5CF6" />
          <rect x="20" y="76" width="60" height="12" rx="3" fill="#F59E0B" />
          <rect x="44" y="12" width="12" height="78" fill="#1E293B" rx="2" />
          <rect x="42" y="44" width="16" height="16" fill="#F59E0B" rx="3" stroke="#ffffff" strokeWidth="2" />
        </svg>
      );

    // Notepad++
    case 'Notepad++.Notepad++':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect x="20" y="10" width="60" height="80" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
          <path d="M 32 30 L 68 30 M 32 44 L 68 44 M 32 58 L 56 58" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
          <path d="M 50 64 L 76 64 M 63 51 L 63 77" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    // Telegram
    case 'Telegram.TelegramDesktop':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#24A1DE" />
          <path d="M 24 48 L 74 26 L 64 74 L 50 62 L 42 70 L 40 56 Z" fill="#FFFFFF" />
          <path d="M 40 56 L 62 40 L 48 54 Z" fill="#D2EAF6" />
        </svg>
      );

    // WhatsApp
    case 'WhatsApp.WhatsApp':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#25D366" />
          <path
            d="M 34 32 C 32 32 30 34 30 38 C 30 46 38 60 52 68 C 58 70 62 68 64 66 L 68 62 C 70 60 70 58 68 56 L 62 52 C 60 50 58 50 56 52 L 54 54 C 52 53 47 48 46 46 L 48 44 C 50 42 50 40 48 38 L 44 32 C 42 30 40 30 38 32 Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    // Git
    case 'Git.Git':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect x="15" y="15" width="70" height="70" rx="14" fill="#F05032" transform="rotate(45 50 50)" />
          <circle cx="40" cy="50" r="6" fill="#ffffff" />
          <circle cx="62" cy="38" r="6" fill="#ffffff" />
          <circle cx="62" cy="62" r="6" fill="#ffffff" />
          <line x1="40" y1="50" x2="62" y2="38" stroke="#ffffff" strokeWidth="4" />
          <line x1="40" y1="50" x2="62" y2="62" stroke="#ffffff" strokeWidth="4" />
        </svg>
      );

    // Python
    case 'Python.Python.3.14':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path
            d="M 48 10 C 32 10 24 16 24 28 L 24 38 L 50 38 L 50 42 L 18 42 C 10 42 6 48 6 60 C 6 70 12 76 22 76 L 28 76 L 28 66 C 28 54 36 48 48 48 L 74 48 L 74 38 C 74 26 66 10 48 10 Z"
            fill="#3776AB"
          />
          <circle cx="34" cy="22" r="3" fill="#ffffff" />
          <path
            d="M 52 90 C 68 90 76 84 76 72 L 76 62 L 50 62 L 50 58 L 82 58 C 90 58 94 52 94 40 C 94 30 88 24 78 24 L 72 24 L 72 34 C 72 46 64 52 52 52 L 26 52 L 26 62 C 26 74 34 90 52 90 Z"
            fill="#FFD43B"
          />
          <circle cx="66" cy="78" r="3" fill="#ffffff" />
        </svg>
      );

    // Node.js
    case 'OpenJS.NodeJS.LTS':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="50,10 88,32 88,72 50,94 12,72 12,32" fill="#339933" />
          <text x="50" y="60" fill="#ffffff" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">node</text>
        </svg>
      );

    // Adobe Acrobat
    case 'Adobe.Acrobat.Reader.64-bit':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#EC1C24" />
          <path
            d="M 28 72 C 34 58 44 40 50 28 C 56 40 66 58 72 72 C 60 68 40 68 28 72 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinejoin="round"
          />
        </svg>
      );

    // Microsoft 365
    case 'Microsoft.Office':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#EA3E0C" />
          <path d="M 22 26 L 62 14 L 80 22 L 80 78 L 62 86 L 22 74 Z" fill="#D83B01" />
          <path d="M 20 30 L 52 30 L 52 70 L 20 70 Z" fill="#F25022" rx="4" />
          <text x="36" y="58" fill="#ffffff" fontSize="28" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">O</text>
        </svg>
      );

    // WPS Office
    case 'Kingsoft.WPSOffice':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#EA4836" />
          <path d="M 18 34 L 32 70 L 50 48 L 68 70 L 82 34 L 68 34 L 58 56 L 50 44 L 42 56 L 32 34 Z" fill="#FFFFFF" />
        </svg>
      );

    // LibreOffice
    case 'TheDocumentFoundation.LibreOffice':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect x="22" y="14" width="56" height="72" rx="6" fill="#18A303" />
          <polygon points="56,14 78,36 56,36" fill="#A1E598" />
          <text x="50" y="66" fill="#ffffff" fontSize="30" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">L</text>
        </svg>
      );

    // Figma
    case 'Figma.Figma':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 32 10 A 18 18 0 0 1 50 28 L 50 10 Z" fill="#F24E1E" />
          <path d="M 50 10 A 18 18 0 0 1 68 28 L 50 28 Z" fill="#FF7262" />
          <path d="M 32 38 A 18 18 0 0 1 50 56 L 50 38 Z" fill="#A259FF" />
          <circle cx="68" cy="47" r="9" fill="#1ABCFE" />
          <path d="M 32 66 A 18 18 0 0 1 50 84 L 32 84 Z" fill="#0ACF83" />
        </svg>
      );

    // Canva
    case 'Canva.Canva':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#00C4CC" />
          <text x="50" y="65" fill="#ffffff" fontSize="48" fontWeight="bold" fontStyle="italic" textAnchor="middle" fontFamily="serif">C</text>
        </svg>
      );

    // Blender
    case 'BlenderFoundation.Blender':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="58" r="28" fill="#F5792A" />
          <circle cx="50" cy="58" r="14" fill="#0E80E5" />
          <circle cx="50" cy="58" r="7" fill="#FFFFFF" />
          <line x1="50" y1="30" x2="50" y2="12" stroke="#F5792A" strokeWidth="10" strokeLinecap="round" />
          <line x1="32" y1="40" x2="16" y2="28" stroke="#F5792A" strokeWidth="10" strokeLinecap="round" />
          <line x1="68" y1="40" x2="84" y2="28" stroke="#F5792A" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );

    // GIMP
    case 'GIMP.GIMP':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#5C5543" />
          <circle cx="42" cy="48" r="18" fill="#FFFFFF" />
          <circle cx="44" cy="48" r="8" fill="#000000" />
          <path d="M 40 68 C 60 74 74 62 82 50 C 80 44 72 44 68 50 Z" fill="#B5A895" />
          <path d="M 68 28 L 86 16" stroke="#D97706" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    // Inkscape
    case 'Inkscape.Inkscape':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#18181b" />
          <polygon points="50,18 78,68 22,68" fill="#FFFFFF" />
          <polygon points="50,18 64,48 50,42 36,48" fill="#000000" />
        </svg>
      );

    // ChatGPT
    case 'OpenAI.ChatGPT':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="24" fill="#10A37F" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="#ffffff" strokeWidth="6" />
          <circle cx="50" cy="50" r="14" fill="none" stroke="#ffffff" strokeWidth="6" />
          <circle cx="50" cy="50" r="4" fill="#ffffff" />
        </svg>
      );

    // Google Gemini
    case 'Google.Gemini':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1BA1E2" />
              <stop offset="50%" stopColor="#7B5EE3" />
              <stop offset="100%" stopColor="#FA5B72" />
            </linearGradient>
          </defs>
          <path
            d="M 50 10 C 50 32, 68 50, 90 50 C 68 50, 50 68, 50 90 C 50 68, 32 50, 10 50 C 32 50, 50 32, 50 10 Z"
            fill="url(#gemGrad)"
          />
        </svg>
      );

    // Claude
    case 'Anthropic.Claude':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="24" fill="#CC785C" />
          <circle cx="50" cy="50" r="24" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="14" fill="#CC785C" />
        </svg>
      );

    // Microsoft Copilot
    case 'Microsoft.Copilot':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="copG1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0078D4" />
              <stop offset="100%" stopColor="#50E6FF" />
            </linearGradient>
            <linearGradient id="copG2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E05BFF" />
              <stop offset="100%" stopColor="#FA823A" />
            </linearGradient>
          </defs>
          <path d="M 28 30 C 28 18 42 18 52 28 C 62 38 72 38 72 50 C 72 62 58 62 48 52 Z" fill="url(#copG1)" />
          <path d="M 72 70 C 72 82 58 82 48 72 C 38 62 28 62 28 50 C 28 38 42 38 52 48 Z" fill="url(#copG2)" />
        </svg>
      );

    // Perplexity AI
    case 'Perplexity.Perplexity':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#20B2AA" />
          <path d="M 32 30 L 68 68 M 68 30 L 32 68 M 50 20 L 50 80" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
        </svg>
      );

    // Google Drive
    case 'Google.GoogleDrive':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 34 18 L 66 18 L 84 50 L 52 50 Z" fill="#FFC107" />
          <path d="M 16 50 L 34 18 L 52 50 L 34 82 Z" fill="#4CAF50" />
          <path d="M 52 50 L 84 50 L 66 82 L 34 82 Z" fill="#2196F3" />
        </svg>
      );

    // OneDrive
    case 'Microsoft.OneDrive':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 40 40 A 18 18 0 0 1 70 36 A 22 22 0 0 1 88 56 A 16 16 0 0 1 74 74 L 34 74 A 20 20 0 0 1 20 52 A 20 20 0 0 1 40 40 Z" fill="#0078D4" />
          <path d="M 54 48 A 16 16 0 0 1 80 44 A 20 20 0 0 1 92 64 L 54 64 Z" fill="#28A8EA" opacity="0.6" />
        </svg>
      );

    // MEGA
    case 'Mega.MEGAsync':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#D9272E" />
          <path d="M 28 32 L 28 68 M 72 32 L 72 68 M 28 34 L 50 56 L 72 34" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    // AnyDesk
    case 'AnyDeskSoftwareGmbH.AnyDesk':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#EF243B" />
          <rect x="25" y="25" width="30" height="30" rx="6" fill="#FFFFFF" transform="rotate(45 40 40)" />
          <rect x="45" y="25" width="30" height="30" rx="6" fill="#FFFFFF" opacity="0.8" transform="rotate(45 60 40)" />
        </svg>
      );

    // TeamViewer
    case 'TeamViewer.TeamViewer':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#0E80E5" />
          <circle cx="50" cy="50" r="30" fill="#FFFFFF" />
          <path d="M 36 50 L 64 50 M 42 42 L 34 50 L 42 58 M 58 42 L 66 50 L 58 58" stroke="#0E80E5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    // RustDesk
    case 'RustDesk.RustDesk':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="24" fill="#0E80E5" />
          <path d="M 30 26 L 70 26 C 74 26 78 30 78 34 L 78 62 C 78 66 74 70 70 70 L 30 70 C 26 70 22 66 22 62 L 22 34 C 22 30 26 26 30 26 Z" fill="#FFFFFF" />
          <path d="M 38 78 L 62 78 M 50 70 L 50 78" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="48" r="10" fill="#F97316" />
        </svg>
      );

    // PuTTY
    case 'PuTTY.PuTTY':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="20" fill="#1E293B" />
          <rect x="18" y="22" width="64" height="44" rx="6" fill="#000000" stroke="#3B82F6" strokeWidth="3" />
          <path d="M 28 36 L 40 44 L 28 52" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="46" y1="52" x2="58" y2="52" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
          <rect x="36" y="68" width="28" height="12" rx="3" fill="#64748B" />
        </svg>
      );

    // CPU-Z
    case 'CPUID.CPU-Z':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#581C87" />
          <rect x="24" y="24" width="52" height="52" rx="8" fill="#1E1B4B" stroke="#A855F7" strokeWidth="4" />
          <text x="50" y="58" fill="#FFFFFF" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">CPU-Z</text>
        </svg>
      );

    // GPU-Z
    case 'TechPowerUp.GPU-Z':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#1E293B" />
          <rect x="20" y="26" width="60" height="48" rx="8" fill="#76B900" />
          <text x="50" y="58" fill="#000000" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">GPU-Z</text>
        </svg>
      );

    // CrystalDiskInfo
    case 'CrystalDewWorld.CrystalDiskInfo':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#0284C7" />
          <rect x="22" y="26" width="56" height="48" rx="6" fill="#FFFFFF" />
          <circle cx="36" cy="50" r="6" fill="#0284C7" />
          <circle cx="64" cy="50" r="4" fill="#22C55E" />
          <text x="50" y="84" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CDI</text>
        </svg>
      );

    // CrystalDiskMark
    case 'CrystalDewWorld.CrystalDiskMark':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#0D9488" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="50" y1="50" x2="68" y2="36" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="50" r="6" fill="#FFFFFF" />
        </svg>
      );

    // DDU
    case 'Wagnardsoft.DisplayDriverUninstaller':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#DC2626" />
          <rect x="24" y="26" width="52" height="40" rx="6" fill="#FFFFFF" />
          <line x1="32" y1="36" x2="68" y2="56" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" />
          <line x1="68" y1="36" x2="32" y2="56" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" />
          <text x="50" y="82" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">DDU</text>
        </svg>
      );

    // Wireshark
    case 'WiresharkFoundation.Wireshark':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#1679A7" />
          <path d="M 20 65 C 40 65, 45 40, 50 25 C 55 45, 65 65, 80 65 Z" fill="#FFFFFF" />
        </svg>
      );

    // Nmap
    case 'Insecure.Nmap':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#2563EB" />
          <circle cx="50" cy="50" r="34" fill="none" stroke="#FFFFFF" strokeWidth="4" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="#60A5FA" strokeWidth="4" />
          <circle cx="50" cy="50" r="10" fill="#93C5FD" />
          <line x1="50" y1="16" x2="50" y2="84" stroke="#FFFFFF" strokeWidth="3" />
          <line x1="16" y1="50" x2="84" y2="50" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      );

    // WinSCP
    case 'WinSCP.WinSCP':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#1D4ED8" />
          <circle cx="44" cy="44" r="14" fill="none" stroke="#F59E0B" strokeWidth="6" />
          <path d="M 52 48 L 74 70 M 64 60 L 70 66" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
          <polygon points="50,16 36,44 48,44 42,66 66,34 54,34" fill="#EF4444" />
        </svg>
      );

    // Advanced IP Scanner
    case 'AdvancedIPScanner.AdvancedIPScanner':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#0D9488" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#FFFFFF" strokeWidth="4" />
          <circle cx="50" cy="50" r="18" fill="none" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="50" cy="50" r="6" fill="#FFFFFF" />
          <line x1="50" y1="50" x2="78" y2="24" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    // IDM (Internet Download Manager)
    case 'Tonec.InternetDownloadManager':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#1E40AF" />
          <path d="M 50 20 L 50 64 M 32 46 L 50 64 L 68 46" stroke="#22C55E" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="26" y1="78" x2="74" y2="78" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    // Free Download Manager (FDM)
    case 'FreeDownloadManager.FreeDownloadManager':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#2563EB" />
          <path d="M 50 24 L 50 62 M 34 46 L 50 62 L 66 46" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 30 74 L 70 74" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    // qBittorrent
    case 'qBittorrent.qBittorrent':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#2F679F" />
          <text x="36" y="64" fill="#ffffff" fontSize="42" fontWeight="bold" fontFamily="sans-serif">q</text>
          <text x="64" y="64" fill="#ffffff" fontSize="42" fontWeight="bold" fontFamily="sans-serif">B</text>
        </svg>
      );

    // DBeaver
    case 'dbeaver.dbeaver':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#45322E" />
          <ellipse cx="50" cy="58" rx="28" ry="24" fill="#8D6E63" />
          <circle cx="40" cy="52" r="4" fill="#FFFFFF" />
          <circle cx="60" cy="52" r="4" fill="#FFFFFF" />
          <ellipse cx="50" cy="62" rx="6" ry="4" fill="#3E2723" />
          <rect x="46" y="66" width="8" height="8" rx="2" fill="#FFFFFF" />
        </svg>
      );

    // FileZilla
    case 'FileZilla.FileZilla':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#BF0000" />
          <text x="50" y="68" fill="#ffffff" fontSize="46" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">FZ</text>
        </svg>
      );

    // pgAdmin / PostgreSQL
    case 'PostgreSQL.pgAdmin':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#336791" />
          <path d="M 32 30 C 32 18 68 18 68 30 C 68 44 60 52 50 62 L 50 78" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="42" cy="38" r="4" fill="#FFFFFF" />
          <circle cx="58" cy="38" r="4" fill="#FFFFFF" />
        </svg>
      );

    // Audacity
    case 'Audacity.Audacity':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#0000EB" />
          <path d="M 24 50 C 24 30 76 30 76 50" stroke="#F59E0B" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 30 54 L 38 42 L 46 62 L 54 36 L 62 60 L 70 50" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    // HandBrake
    case 'HandBrake.HandBrake':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#EAB308" />
          <polygon points="50,14 62,38 38,38" fill="#15803D" />
          <ellipse cx="50" cy="62" rx="22" ry="24" fill="#CA8A04" />
          <line x1="38" y1="46" x2="62" y2="76" stroke="#991B1B" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    // Visual C++ Runtimes
    case 'Microsoft.VCRedist.2015+.x64':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#00599C" />
          <text x="50" y="62" fill="#FFFFFF" fontSize="32" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">C++</text>
        </svg>
      );

    // Everything Search (voidtools)
    case 'voidtools.Everything':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#F97316" />
          <circle cx="44" cy="44" r="20" fill="none" stroke="#FFFFFF" strokeWidth="7" />
          <line x1="58" y1="58" x2="78" y2="78" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    // Microsoft PowerToys
    case 'Microsoft.PowerToys':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#0078D7" />
          <path d="M 30 30 L 70 30 L 70 46 L 46 46 L 46 70 L 30 70 Z" fill="#FFFFFF" />
          <circle cx="64" cy="64" r="8" fill="#F59E0B" />
        </svg>
      );

    // Rufus
    case 'Rufus.Rufus':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#2563EB" />
          <rect x="36" y="24" width="28" height="48" rx="6" fill="#FFFFFF" />
          <rect x="42" y="16" width="16" height="8" rx="2" fill="#CBD5E1" />
          <polygon points="50,34 44,52 50,52 46,64 56,46 50,46" fill="#F59E0B" />
        </svg>
      );

    // Avro Keyboard
    case 'OmicronLab.Avro':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#059669" />
          <text x="50" y="68" fill="#ffffff" fontSize="52" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">অ</text>
        </svg>
      );

    // Epic Games
    case 'EpicGames.EpicGamesLauncher':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 50 10 L 84 20 L 76 80 L 50 92 L 24 80 L 16 20 Z" fill="#2D2D2D" />
          <text x="50" y="60" fill="#ffffff" fontSize="36" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">EPIC</text>
        </svg>
      );

    // DirectX
    case 'Microsoft.DirectX':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#0078D4" />
          <text x="50" y="68" fill="#FFFFFF" fontSize="56" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="sans-serif">X</text>
        </svg>
      );

    // EA Desktop
    case 'ElectronicArts.EADesktop':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#FF4747" />
          <text x="50" y="64" fill="#ffffff" fontSize="36" fontWeight="bold" fontStyle="italic" textAnchor="middle" fontFamily="sans-serif">EA</text>
        </svg>
      );

    // Ubisoft Connect
    case 'Ubisoft.Connect':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#0070D1" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="50 20" />
          <circle cx="50" cy="50" r="14" fill="#FFFFFF" />
        </svg>
      );

    // Riot Client
    case 'RiotGames.RiotClient':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#D32936" />
          <polygon points="26,72 32,28 66,28 74,48 56,58 48,72" fill="#FFFFFF" />
        </svg>
      );

    // Xbox App
    case 'Microsoft.GamingApp':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#107C10" />
          <path d="M 28 32 C 40 44 50 68 50 82 C 50 68 60 44 72 32 C 60 22 40 22 28 32 Z" fill="#FFFFFF" />
          <path d="M 18 42 C 28 58 38 72 46 86 C 26 84 14 66 18 42 Z" fill="#FFFFFF" />
          <path d="M 82 42 C 72 58 62 72 54 86 C 74 84 86 66 82 42 Z" fill="#FFFFFF" />
        </svg>
      );

    // Bitwarden
    case 'Bitwarden.Bitwarden':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M 50 14 L 84 26 L 84 56 C 84 74 68 86 50 92 C 32 86 16 74 16 56 L 16 26 Z" fill="#175DDC" />
          <path d="M 32 38 L 68 38 C 72 38 74 40 74 44 L 74 54 C 74 66 62 74 50 78 C 38 74 26 66 26 54 L 26 44 C 26 40 28 38 32 38 Z" fill="#FFFFFF" />
        </svg>
      );

    // Malwarebytes
    case 'Malwarebytes.Malwarebytes':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#0069B4" />
          <path d="M 26 72 L 26 28 L 50 56 L 74 28 L 74 72" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    // Proton VPN
    case 'Proton.ProtonVPN':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#6D4AFF" />
          <polygon points="50,22 80,74 20,74" fill="#FFFFFF" />
          <polygon points="50,42 66,74 34,74" fill="#6D4AFF" />
        </svg>
      );

    // Duplicati
    case 'Duplicati.Duplicati':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#2077B4" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="35 15" />
          <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
        </svg>
      );

    // Macrium Reflect
    case 'Macrium.ReflectFree':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="22" fill="#0078D4" />
          <rect x="22" y="32" width="56" height="36" rx="6" fill="#FFFFFF" />
          <path d="M 38 50 L 62 50 M 52 42 L 62 50 L 52 58" stroke="#0078D4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    // EaseUS Todo Backup
    case 'EaseUS.TodoBackupFree':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="46" fill="#F97316" />
          <rect x="26" y="32" width="48" height="36" rx="6" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="8" fill="#F97316" />
        </svg>
      );

    // 2. High-Fidelity SimpleIcons CDN Fallback for any other package
    default: {
      const meta = SIMPLE_ICONS_MAP[id];
      if (meta && !cdnFailed) {
        return (
          <img
            src={`https://cdn.simpleicons.org/${meta.slug}/${meta.color}`}
            alt={name || id}
            className={`${className} object-contain`}
            onError={() => setCdnFailed(true)}
            loading="lazy"
          />
        );
      }

      // Elegant Monogram Fallback
      const initial = (name || id.split('.').pop() || 'A').slice(0, 2).toUpperCase();
      return (
        <div
          className={`${className} rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm`}
        >
          {initial}
        </div>
      );
    }
  }
};
