import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  Zap,
  HardDrive,
  Wifi,
  Sparkles,
  Download,
  Copy,
  Check,
  Terminal,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SYSTEM_TWEAKS, SystemTweak } from '../data/toolkitCatalog';
import { generateBatchInstaller, generatePowerShellInstaller, generateOneLineCommand, triggerFileDownload } from '../utils/scriptGenerator';

interface SystemTweaksTabProps {
  selectedTweaks: string[];
  setSelectedTweaks: React.Dispatch<React.SetStateAction<string[]>>;
  onNotify: (msg: string) => void;
}

export const SystemTweaksTab: React.FC<SystemTweaksTabProps> = ({
  selectedTweaks,
  setSelectedTweaks,
  onNotify
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Debloat & Privacy',
    'Performance & Gaming',
    'Windows System Repair',
    'Disk Cleanup & Storage',
    'Network Diagnostics & DNS',
    'Safety & Restore',
    'Instant Quick Actions'
  ];

  const filteredTweaks = SYSTEM_TWEAKS.filter((t) => {
    if (activeCategory === 'All') return true;
    return t.category === activeCategory;
  });

  const toggleTweak = (id: string) => {
    setSelectedTweaks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectRecommended = () => {
    const recIds = SYSTEM_TWEAKS.filter((t) => t.recommended).map((t) => t.id);
    setSelectedTweaks(recIds);
    onNotify(`Selected ${recIds.length} recommended system optimizations!`);
  };

  const clearSelection = () => {
    setSelectedTweaks([]);
    onNotify('Cleared all selected tweaks');
  };

  const handleCopySingle = (tweak: SystemTweak, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tweak.psCode);
    setCopiedId(tweak.id);
    onNotify(`Copied command for ${tweak.title}!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSingle = (tweak: SystemTweak, e: React.MouseEvent) => {
    e.stopPropagation();
    const script = generateBatchInstaller([], [tweak.id], tweak.title);
    triggerFileDownload(`${tweak.id}.bat`, script);
    onNotify(`Downloaded 1-click script for ${tweak.title}!`);
  };

  const handleDownloadBatch = () => {
    if (selectedTweaks.length === 0) {
      onNotify('Please select at least 1 optimization tweak first!');
      return;
    }
    const script = generateBatchInstaller([], selectedTweaks, 'ItsRiRx System Optimization Suite');
    triggerFileDownload('optimize-windows.bat', script);
    onNotify(`Downloaded 1-click batch file for ${selectedTweaks.length} tweaks!`);
  };

  const handleDownloadPS1 = () => {
    if (selectedTweaks.length === 0) {
      onNotify('Please select at least 1 optimization tweak first!');
      return;
    }
    const script = generatePowerShellInstaller([], selectedTweaks, 'ItsRiRx System Optimization Suite');
    triggerFileDownload('optimize-windows.ps1', script);
    onNotify(`Downloaded PowerShell script for ${selectedTweaks.length} tweaks!`);
  };

  const handleCopyCommand = () => {
    if (selectedTweaks.length === 0) {
      onNotify('Please select at least 1 optimization tweak first!');
      return;
    }
    const cmd = generateOneLineCommand([], selectedTweaks);
    navigator.clipboard.writeText(cmd);
    onNotify(`Copied combined execution command for ${selectedTweaks.length} tweaks!`);
  };

  const getModuleBadgeColor = (moduleNum: string) => {
    switch (moduleNum) {
      case '02':
        return 'bg-purple-950/80 text-purple-400 border-purple-800';
      case '03':
        return 'bg-rose-950/80 text-rose-400 border-rose-800';
      case '04':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-800';
      case '07':
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
      case '08':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
      case '09':
        return 'bg-blue-950/80 text-blue-400 border-blue-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Web System Optimizer
              </span>
              <span className="text-xs text-zinc-500 font-mono">1-Click Repair & Tweaks</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Windows Performance, Repair & Debloat Suite
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Access all the toolkit features directly from your web browser. Run any fix with a 1-click download or combine them into a single automated script.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectRecommended}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Select Recommended
            </button>
            {selectedTweaks.length > 0 && (
              <button
                onClick={clearSelection}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-semibold transition-all cursor-pointer active:scale-95"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toolbar when tweaks are selected */}
      {selectedTweaks.length > 0 && (
        <div className="sticky top-20 z-20 bg-emerald-950/95 border-2 border-emerald-500/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl shadow-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black text-lg shadow-lg">
              {selectedTweaks.length}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{selectedTweaks.length} System Optimizations Selected</span>
              </div>
              <p className="text-xs text-emerald-300/80 truncate max-w-md">
                {selectedTweaks
                  .map((id) => SYSTEM_TWEAKS.find((t) => t.id === id)?.title)
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadBatch}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download 1-Click Fix (.bat)
            </button>
            <button
              onClick={handleDownloadPS1}
              className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-400" /> .ps1
            </button>
            <button
              onClick={handleCopyCommand}
              className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Copy className="w-4 h-4 text-emerald-400" /> Copy Command
            </button>
            <button
              onClick={clearSelection}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 border border-zinc-800 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Tweaks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTweaks.map((tweak) => {
          const isSelected = selectedTweaks.includes(tweak.id);
          return (
            <div
              key={tweak.id}
              onClick={() => toggleTweak(tweak.id)}
              className={`border rounded-2xl p-5 transition-all duration-150 flex flex-col justify-between cursor-pointer select-none ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-950/60 to-zinc-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                  : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${getModuleBadgeColor(
                          tweak.moduleNum
                        )}`}
                      >
                        MODULE {tweak.moduleNum}
                      </span>
                      {tweak.recommended && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-white text-base tracking-tight">
                      {tweak.title}
                    </h4>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-black shadow-md shadow-emerald-500/20'
                        : 'border-zinc-700 bg-zinc-800/50'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {tweak.desc}
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-zinc-500">
                  {tweak.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCopySingle(tweak, e)}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Copy PowerShell command to clipboard"
                  >
                    {copiedId === tweak.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={(e) => handleDownloadSingle(tweak, e)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Download 1-Click .bat Script"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .bat</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
