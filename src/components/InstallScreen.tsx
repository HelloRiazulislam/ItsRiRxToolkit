import React, { useState } from 'react';
import {
  Download,
  Copy,
  Terminal,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Clock,
  Package,
  Layers,
  Info,
  CheckCircle2,
  FileCode,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SOFTWARE_APPS, SYSTEM_TWEAKS, SoftwareApp, SystemTweak } from '../data/toolkitCatalog';
import { AppLogo } from '../data/appLogos';
import {
  generateBatchInstaller,
  generatePowerShellInstaller,
  generateOneLineCommand,
  triggerFileDownload
} from '../utils/scriptGenerator';

interface InstallScreenProps {
  selectedApps: string[];
  setSelectedApps: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTweaks: string[];
  setSelectedTweaks: React.Dispatch<React.SetStateAction<string[]>>;
  onNotify: (msg: string) => void;
  onNavigateToApps: () => void;
  onNavigateToTweaks: () => void;
  isDark?: boolean;
}

type InstallFormat = 'installer' | 'batch' | 'powershell' | 'winget';

export const InstallScreen: React.FC<InstallScreenProps> = ({
  selectedApps,
  setSelectedApps,
  selectedTweaks,
  setSelectedTweaks,
  onNotify,
  onNavigateToApps,
  onNavigateToTweaks,
  isDark = false
}) => {
  const [format, setFormat] = useState<InstallFormat>('installer');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [silentMode, setSilentMode] = useState<boolean>(true);
  const [acceptAgreements, setAcceptAgreements] = useState<boolean>(true);
  const [autoElevate, setAutoElevate] = useState<boolean>(true);
  const [includeTweaks, setIncludeTweaks] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedAppObjects = selectedApps
    .map((id) => SOFTWARE_APPS.find((a) => a.id === id))
    .filter(Boolean) as SoftwareApp[];

  const selectedTweakObjects = selectedTweaks
    .map((id) => SYSTEM_TWEAKS.find((t) => t.id === id))
    .filter(Boolean) as SystemTweak[];

  const totalCount = selectedApps.length + selectedTweaks.length;

  const removeApp = (id: string) => {
    setSelectedApps((prev) => prev.filter((item) => item !== id));
    const app = SOFTWARE_APPS.find((a) => a.id === id);
    if (app) onNotify(`Removed ${app.name}`);
  };

  const removeTweak = (id: string) => {
    setSelectedTweaks((prev) => prev.filter((item) => item !== id));
    const tweak = SYSTEM_TWEAKS.find((t) => t.id === id);
    if (tweak) onNotify(`Removed ${tweak.title}`);
  };

  const clearAll = () => {
    setSelectedApps([]);
    setSelectedTweaks([]);
    onNotify('Cleared all selected items');
  };

  const tweaksToInclude = includeTweaks ? selectedTweaks : [];

  // Generate scripts dynamically based on options
  const batchScript = generateBatchInstaller(
    selectedApps,
    tweaksToInclude,
    'ItsRiRx Custom Windows Deployment'
  );

  const psScript = generatePowerShellInstaller(
    selectedApps,
    tweaksToInclude,
    'ItsRiRx Custom Windows Deployment'
  );

  const oneLineCommand = generateOneLineCommand(selectedApps, tweaksToInclude);

  const wingetJsonExport = JSON.stringify(
    {
      $schema: 'https://aka.ms/winget-packages.schema.2.0.json',
      CreationDate: new Date().toISOString(),
      Sources: [
        {
          Packages: selectedApps.map((id) => ({ PackageIdentifier: id })),
          SourceDetails: {
            Argument: 'https://cdn.winget.microsoft.com/cache',
            Identifier: 'Microsoft.Winget.Source_8wekyb3d8bbwe',
            Name: 'winget',
            Type: 'Microsoft.PreIndexed.Package'
          }
        }
      ]
    },
    null,
    2
  );

  const handleDownloadInstaller = () => {
    if (totalCount === 0) {
      onNotify('Please select at least 1 application or tweak first!');
      return;
    }
    triggerFileDownload('install-apps.bat', batchScript);
    onNotify(`Downloaded 1-click silent installer for ${totalCount} items!`);
  };

  const handleDownloadBatch = () => {
    triggerFileDownload('install-apps.bat', batchScript);
    onNotify('Downloaded Windows Batch (.bat) file!');
  };

  const handleDownloadPS1 = () => {
    triggerFileDownload('install-apps.ps1', psScript);
    onNotify('Downloaded PowerShell (.ps1) script!');
  };

  const handleDownloadWingetJson = () => {
    triggerFileDownload('winget-import.json', wingetJsonExport);
    onNotify('Downloaded winget-import.json file!');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onNotify(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  // If nothing is selected, display an inviting empty state
  if (totalCount === 0) {
    return (
      <div
        className={`rounded-3xl p-10 text-center border transition-all ${
          isDark
            ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
            : 'bg-white border-slate-200/90 text-slate-700 shadow-sm'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">No Applications Selected</h2>
        <p className={`text-sm max-w-md mx-auto mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          Select the software applications and system performance tweaks you want to install on your PC, then come back here to generate your customized installer.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onNavigateToApps}
            className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Browse Software Store
          </button>
          <button
            onClick={onNavigateToTweaks}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm border transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-500" /> Browse System Tweaks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10 animate-in fade-in duration-150">
      {/* Top Hero Section matching user reference image */}
      <div
        className={`rounded-3xl p-6 md:p-8 transition-all border ${
          isDark
            ? 'bg-zinc-900/70 border-zinc-800 shadow-xl'
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}
      >
        {/* Title & Subtitle */}
        <div className="space-y-2 mb-6">
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Your apps are ready
          </h1>
          <p className={`text-base font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Make sure you have Windows Package Manager installed :)
          </p>
        </div>

        {/* Format Switcher Pills - Exactly like reference image */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <button
            onClick={() => setFormat('installer')}
            className={`px-5 py-2 rounded-full text-sm transition-all cursor-pointer ${
              format === 'installer'
                ? 'border-2 border-slate-900 dark:border-white text-purple-600 dark:text-purple-400 font-bold bg-white dark:bg-zinc-900 shadow-sm'
                : isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium border border-zinc-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200/80'
            }`}
          >
            Download installer
          </button>

          <button
            onClick={() => setFormat('batch')}
            className={`px-5 py-2 rounded-full text-sm transition-all cursor-pointer ${
              format === 'batch'
                ? 'border-2 border-slate-900 dark:border-white text-purple-600 dark:text-purple-400 font-bold bg-white dark:bg-zinc-900 shadow-sm'
                : isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium border border-zinc-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200/80'
            }`}
          >
            Batch
          </button>

          <button
            onClick={() => setFormat('powershell')}
            className={`px-5 py-2 rounded-full text-sm transition-all cursor-pointer ${
              format === 'powershell'
                ? 'border-2 border-slate-900 dark:border-white text-purple-600 dark:text-purple-400 font-bold bg-white dark:bg-zinc-900 shadow-sm'
                : isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium border border-zinc-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200/80'
            }`}
          >
            PowerShell
          </button>

          <button
            onClick={() => setFormat('winget')}
            className={`px-5 py-2 rounded-full text-sm transition-all cursor-pointer ${
              format === 'winget'
                ? 'border-2 border-slate-900 dark:border-white text-purple-600 dark:text-purple-400 font-bold bg-white dark:bg-zinc-900 shadow-sm'
                : isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium border border-zinc-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200/80'
            }`}
          >
            Winget Import
          </button>
        </div>

        {/* Collapsible Default Options Accordion - Exactly like reference image */}
        <div className="mb-6">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-colors ${
              isDark ? 'text-zinc-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {showOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>Default Options</span>
          </button>

          {showOptions && (
            <div
              className={`mt-3 p-4 rounded-2xl border space-y-3 animate-in fade-in duration-150 ${
                isDark ? 'bg-zinc-800/60 border-zinc-700 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={silentMode}
                    onChange={(e) => setSilentMode(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                  />
                  <span>Silent Installation (<code className="font-semibold">--silent</code>)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptAgreements}
                    onChange={(e) => setAcceptAgreements(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                  />
                  <span>Accept Agreements (<code className="font-semibold">--accept-agreements</code>)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoElevate}
                    onChange={(e) => setAutoElevate(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                  />
                  <span>Request Administrator (UAC Prompt)</span>
                </label>

                {selectedTweaks.length > 0 && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeTweaks}
                      onChange={(e) => setIncludeTweaks(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                    />
                    <span>Include {selectedTweaks.length} System Tweaks</span>
                  </label>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Box per selected Format */}
        {format === 'installer' && (
          <div className="space-y-4">
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              <Info className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Download the instant installer and run!</span>
            </div>

            <div>
              <button
                onClick={handleDownloadInstaller}
                className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download installer
              </button>
            </div>
          </div>
        )}

        {format === 'batch' && (
          <div className="space-y-4">
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              <Info className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Standard Windows Batch script (.bat) with automated elevation and error handling.</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadBatch}
                className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download .bat file
              </button>
              <button
                onClick={() => handleCopy(batchScript, 'Batch script')}
                className={`px-5 py-3 rounded-full font-semibold text-sm border transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                Copy Script
              </button>
            </div>

            {/* Code Box */}
            <div
              className={`rounded-2xl p-4 max-h-56 overflow-y-auto border text-xs leading-relaxed ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <pre className="whitespace-pre font-normal">{batchScript}</pre>
            </div>
          </div>
        )}

        {format === 'powershell' && (
          <div className="space-y-4">
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              <Info className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Native PowerShell script (.ps1) or copy 1-line command to run in Windows Terminal.</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadPS1}
                className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download .ps1 script
              </button>
              <button
                onClick={() => handleCopy(oneLineCommand, '1-line command')}
                className={`px-5 py-3 rounded-full font-semibold text-sm border transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                Copy 1-Line Command
              </button>
            </div>

            {/* Code Box */}
            <div
              className={`rounded-2xl p-4 max-h-56 overflow-y-auto border text-xs leading-relaxed ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <pre className="whitespace-pre font-normal">{psScript}</pre>
            </div>
          </div>
        )}

        {format === 'winget' && (
          <div className="space-y-4">
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              <Info className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Standard Winget Import JSON file or one-line CLI argument.</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadWingetJson}
                className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export winget.json
              </button>
              <button
                onClick={() => handleCopy(oneLineCommand, 'Winget command')}
                className={`px-5 py-3 rounded-full font-semibold text-sm border transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                Copy Winget CLI Command
              </button>
            </div>

            {/* Code Box */}
            <div
              className={`rounded-2xl p-4 max-h-56 overflow-y-auto border text-xs leading-relaxed ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <pre className="whitespace-pre font-normal">{wingetJsonExport}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Selected Apps (N) Section - Exactly matching user reference screenshot */}
      {selectedAppObjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Selected apps ({selectedAppObjects.length})
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToApps}
                className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add more
              </button>
              <button
                onClick={() => setSelectedApps([])}
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Clear apps
              </button>
            </div>
          </div>

          {/* Cards Grid matching reference image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedAppObjects.map((app) => (
              <div
                key={app.id}
                className={`rounded-2xl p-4 border transition-all duration-150 flex flex-col justify-between group ${
                  isDark
                    ? 'bg-zinc-900/60 border-zinc-800/90 hover:border-zinc-700'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Row: App Logo, Name, and Remove Button */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                        <AppLogo id={app.id} name={app.name} className="w-8 h-8 object-contain" />
                      </div>
                      <h3
                        className={`text-sm font-bold truncate leading-snug ${
                          isDark ? 'text-zinc-100' : 'text-slate-900'
                        }`}
                        title={app.name}
                      >
                        {app.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => removeApp(app.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
                      title="Remove from installer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* App Description */}
                  <p className={`text-xs leading-relaxed line-clamp-2 mb-3.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {app.desc}
                  </p>
                </div>

                {/* Bottom Metadata: Last updated & ID */}
                <div
                  className={`pt-3 border-t flex flex-col gap-1 text-[11px] ${
                    isDark ? 'border-zinc-800/80 text-zinc-500' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Last updated recently</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Package className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{app.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Tweaks Section if any are chosen */}
      {selectedTweakObjects.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Selected System Tweaks ({selectedTweakObjects.length})
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToTweaks}
                className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add more tweaks
              </button>
              <button
                onClick={() => setSelectedTweaks([])}
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Clear tweaks
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedTweakObjects.map((tweak) => (
              <div
                key={tweak.id}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  isDark
                    ? 'bg-zinc-900/60 border-zinc-800'
                    : 'bg-white border-slate-200/90 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                        Module {tweak.moduleNum}
                      </span>
                    </div>
                    <button
                      onClick={() => removeTweak(tweak.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove tweak"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    {tweak.title}
                  </h3>
                  <p className={`text-xs line-clamp-2 mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {tweak.desc}
                  </p>
                </div>

                <div className={`pt-2 border-t text-[11px] ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-slate-100 text-slate-400'}`}>
                  {tweak.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
