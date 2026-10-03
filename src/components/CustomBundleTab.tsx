import React, { useState } from 'react';
import {
  Download,
  Copy,
  Terminal,
  Sparkles,
  Layers,
  Check,
  RotateCcw,
  ShieldCheck,
  Zap,
  ArrowRight,
  Boxes,
  FileCode,
  X
} from 'lucide-react';
import { SOFTWARE_APPS, SYSTEM_TWEAKS } from '../data/toolkitCatalog';
import {
  generateBatchInstaller,
  generatePowerShellInstaller,
  generateOneLineCommand,
  triggerFileDownload
} from '../utils/scriptGenerator';

interface CustomBundleTabProps {
  selectedApps: string[];
  setSelectedApps: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTweaks: string[];
  setSelectedTweaks: React.Dispatch<React.SetStateAction<string[]>>;
  onNotify: (msg: string) => void;
  onNavigateToApps: () => void;
  onNavigateToTweaks: () => void;
}

export const CustomBundleTab: React.FC<CustomBundleTabProps> = ({
  selectedApps,
  setSelectedApps,
  selectedTweaks,
  setSelectedTweaks,
  onNotify,
  onNavigateToApps,
  onNavigateToTweaks
}) => {
  const [activePreviewType, setActivePreviewType] = useState<'bat' | 'ps1'>('bat');
  const [copied, setCopied] = useState(false);

  const selectedAppObjects = selectedApps
    .map((id) => SOFTWARE_APPS.find((a) => a.id === id))
    .filter(Boolean);

  const selectedTweakObjects = selectedTweaks
    .map((id) => SYSTEM_TWEAKS.find((t) => t.id === id))
    .filter(Boolean);

  const totalSelected = selectedApps.length + selectedTweaks.length;

  const removeApp = (id: string) => {
    setSelectedApps((prev) => prev.filter((a) => a !== id));
  };

  const removeTweak = (id: string) => {
    setSelectedTweaks((prev) => prev.filter((t) => t !== id));
  };

  const clearAll = () => {
    setSelectedApps([]);
    setSelectedTweaks([]);
    onNotify('Cleared all apps and tweaks');
  };

  const generatedScript =
    activePreviewType === 'bat'
      ? generateBatchInstaller(selectedApps, selectedTweaks)
      : generatePowerShellInstaller(selectedApps, selectedTweaks);

  const handleDownloadBatch = () => {
    if (totalSelected === 0) {
      onNotify('Please select at least 1 app or tweak first!');
      return;
    }
    const script = generateBatchInstaller(selectedApps, selectedTweaks);
    triggerFileDownload('itsrirx-custom-setup.bat', script);
    onNotify(`Downloaded custom setup file (${selectedApps.length} apps, ${selectedTweaks.length} tweaks)!`);
  };

  const handleDownloadPS1 = () => {
    if (totalSelected === 0) {
      onNotify('Please select at least 1 app or tweak first!');
      return;
    }
    const script = generatePowerShellInstaller(selectedApps, selectedTweaks);
    triggerFileDownload('itsrirx-custom-setup.ps1', script);
    onNotify(`Downloaded custom PowerShell setup file!`);
  };

  const handleCopyCommand = () => {
    if (totalSelected === 0) {
      onNotify('Please select at least 1 app or tweak first!');
      return;
    }
    const cmd = generateOneLineCommand(selectedApps, selectedTweaks);
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    onNotify(`Copied master execution command to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> All-in-One Custom Setup Builder
              </span>
              <span className="text-xs text-zinc-500 font-mono">Automate Any Windows PC</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Build Your Custom Windows Installer
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Combine your chosen software apps and system tweaks into a single, auto-elevating <code className="text-cyan-400 font-mono text-xs">.bat</code> or <code className="text-cyan-400 font-mono text-xs">.ps1</code> deployment file. Run once, sit back, and have your PC configured automatically.
            </p>
          </div>

          {totalSelected > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={clearAll}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 text-xs font-semibold transition-all cursor-pointer"
              >
                Clear Everything
              </button>
            </div>
          )}
        </div>
      </div>

      {totalSelected === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 text-zinc-500 mx-auto flex items-center justify-center">
            <Boxes className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Your Setup Bundle is Empty</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Select applications from the Software Store and optimizations from the System Tweaks tab to generate a custom automated installer file.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToApps}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Browse Applications <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToTweaks}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              Browse System Tweaks <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Builder Content */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Summary of selected items */}
          <div className="lg:col-span-5 space-y-4">
            {/* Master Action Card */}
            <div className="bg-gradient-to-br from-cyan-950/70 to-zinc-900 border-2 border-cyan-500/70 rounded-2xl p-5 shadow-xl shadow-cyan-950/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Deployment Package
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {totalSelected} Items Selected
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black font-black flex items-center justify-center text-lg">
                  {totalSelected}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-black/40 rounded-xl p-2.5 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">APPLICATIONS</span>
                  <span className="text-cyan-300 font-bold text-base">{selectedApps.length}</span>
                </div>
                <div className="bg-black/40 rounded-xl p-2.5 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">OPTIMIZATIONS</span>
                  <span className="text-emerald-300 font-bold text-base">{selectedTweaks.length}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleDownloadBatch}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-5 h-5" /> Download Automated Setup (.bat)
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadPS1}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Terminal className="w-4 h-4 text-cyan-400" /> Download .ps1
                  </button>
                  <button
                    onClick={handleCopyCommand}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                    <span>{copied ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Applications List */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-cyan-400" /> Selected Applications ({selectedApps.length})
                </h4>
                <button
                  onClick={onNavigateToApps}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  + Add More
                </button>
              </div>

              {selectedAppObjects.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-2">No apps selected yet.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedAppObjects.map((app) => (
                    <span
                      key={app!.id}
                      className="inline-flex items-center gap-1.5 text-xs bg-zinc-800/90 text-zinc-200 border border-zinc-700/80 rounded-lg px-2.5 py-1"
                    >
                      <span>{app!.name}</span>
                      <button
                        onClick={() => removeApp(app!.id)}
                        className="text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Selected System Tweaks List */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" /> Selected System Tweaks ({selectedTweaks.length})
                </h4>
                <button
                  onClick={onNavigateToTweaks}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  + Add More
                </button>
              </div>

              {selectedTweakObjects.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-2">No system tweaks selected yet.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedTweakObjects.map((tweak) => (
                    <span
                      key={tweak!.id}
                      className="inline-flex items-center gap-1.5 text-xs bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 rounded-lg px-2.5 py-1"
                    >
                      <span>{tweak!.title}</span>
                      <button
                        onClick={() => removeTweak(tweak!.id)}
                        className="text-emerald-400/70 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Code Preview in Terminal */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Terminal Window Header */}
            <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-zinc-400 ml-2 font-bold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  itsrirx-custom-setup.{activePreviewType}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setActivePreviewType('bat')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activePreviewType === 'bat'
                      ? 'bg-cyan-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  .BAT
                </button>
                <button
                  onClick={() => setActivePreviewType('ps1')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activePreviewType === 'ps1'
                      ? 'bg-cyan-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  .PS1
                </button>
              </div>
            </div>

            {/* Code Output Box */}
            <div className="p-4 bg-zinc-950/90 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[460px] overflow-y-auto leading-relaxed select-all">
              <pre className="text-cyan-300/90 whitespace-pre">{generatedScript}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
