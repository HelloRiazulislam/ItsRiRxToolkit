import React, { useState, useRef, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SYSTEM_TWEAKS, SystemTweak } from '../data/toolkitCatalog';
import { generateBatchInstaller, generatePowerShellInstaller, generateOneLineCommand, triggerFileDownload } from '../utils/scriptGenerator';

interface SystemTweaksTabProps {
  selectedTweaks: string[];
  setSelectedTweaks: React.Dispatch<React.SetStateAction<string[]>>;
  onNotify: (msg: string) => void;
  isDark?: boolean;
}

export const SystemTweaksTab: React.FC<SystemTweaksTabProps> = ({
  selectedTweaks,
  setSelectedTweaks,
  onNotify,
  isDark = false
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Category Slider refs and states
  const tweakScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScrollability = () => {
    if (tweakScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tweakScrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const slideLeft = () => {
    if (tweakScrollRef.current) {
      tweakScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  const slideRight = () => {
    if (tweakScrollRef.current) {
      tweakScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tweakScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tweakScrollRef.current.offsetLeft);
    setScrollLeftState(tweakScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tweakScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - tweakScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tweakScrollRef.current.scrollLeft = scrollLeftState - walk;
    checkScrollability();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (tweakScrollRef.current && Math.abs(e.deltaY) > 0) {
      tweakScrollRef.current.scrollLeft += e.deltaY * 1.2;
      checkScrollability();
    }
  };

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
    if (isDark) {
      switch (moduleNum) {
        case '02':
          return 'bg-purple-950/70 text-purple-300 border-purple-800/80';
        case '03':
          return 'bg-rose-950/70 text-rose-300 border-rose-800/80';
        case '04':
          return 'bg-cyan-950/70 text-cyan-300 border-cyan-800/80';
        case '07':
          return 'bg-amber-950/70 text-amber-300 border-amber-800/80';
        case '08':
          return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';
        case '09':
          return 'bg-blue-950/70 text-blue-300 border-blue-800/80';
        default:
          return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      }
    } else {
      switch (moduleNum) {
        case '02':
          return 'bg-purple-50 text-purple-700 border-purple-200';
        case '03':
          return 'bg-rose-50 text-rose-700 border-rose-200';
        case '04':
          return 'bg-cyan-50 text-cyan-700 border-cyan-200';
        case '07':
          return 'bg-amber-50 text-amber-700 border-amber-200';
        case '08':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case '09':
          return 'bg-blue-50 text-blue-700 border-blue-200';
        default:
          return 'bg-slate-100 text-slate-700 border-slate-200';
      }
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* Glassmorphic Header Banner */}
      <div
        className={`rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden ${
          isDark
            ? 'bg-zinc-900/60 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]'
            : 'bg-white/70 border border-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                <Zap className="w-3.5 h-3.5" /> Web System Optimizer
              </span>
              <span className={isDark ? 'text-zinc-600' : 'text-slate-300'}>·</span>
              <span className={`font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                1-Click Repairs & Optimizations
              </span>
            </div>

            <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Windows Performance & Repair Suite
            </h2>

            <p className={`text-sm max-w-2xl leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              Direct web access to all core toolkit modules. Execute standalone 1-click fixes or select multiple optimizations to automate system debloating and repair.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={selectRecommended}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 backdrop-blur-md ${
                isDark
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Select Recommended
            </button>
            {selectedTweaks.length > 0 && (
              <button
                onClick={clearSelection}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 backdrop-blur-md ${
                  isDark
                    ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/10'
                    : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80 shadow-sm'
                }`}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toolbar when tweaks are selected */}
      {selectedTweaks.length > 0 && (
        <div className="sticky top-20 z-20 bg-slate-900/85 dark:bg-zinc-900/85 border border-white/20 dark:border-white/15 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-500/25">
              {selectedTweaks.length}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{selectedTweaks.length} System Optimizations Selected</span>
              </div>
              <p className="text-xs text-emerald-200/80 truncate max-w-md">
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
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download 1-Click Fix (.bat)
            </button>
            <button
              onClick={handleDownloadPS1}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-400" /> .ps1
            </button>
            <button
              onClick={handleCopyCommand}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Copy className="w-4 h-4 text-emerald-400" /> Copy Command
            </button>
            <button
              onClick={clearSelection}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 border border-white/10 backdrop-blur-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Category Pills Glass Slider with Left/Right Buttons, Mouse Wheel & Drag to Slide */}
      <div className="relative flex items-center gap-2">
        {/* Left Slide Button */}
        <button
          onClick={slideLeft}
          disabled={!canScrollLeft}
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer z-10 backdrop-blur-md ${
            canScrollLeft
              ? isDark
                ? 'bg-zinc-800/90 hover:bg-zinc-700 text-white border border-white/10 shadow-md'
                : 'bg-white/90 hover:bg-white text-slate-800 border border-slate-200/80 shadow-md'
              : 'opacity-30 cursor-not-allowed text-slate-400'
          }`}
          title="Scroll Left"
          aria-label="Scroll Categories Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Category Row */}
        <div
          ref={tweakScrollRef}
          onScroll={checkScrollability}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-center gap-2 overflow-x-auto py-1 scroll-smooth scrollbar-none select-none flex-1 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-2 cursor-pointer backdrop-blur-md shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 border-transparent'
                    : isDark
                    ? 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 border border-white/10 hover:border-white/20'
                    : 'bg-white/70 text-slate-600 hover:text-slate-900 border border-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right Slide Button */}
        <button
          onClick={slideRight}
          disabled={!canScrollRight}
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer z-10 backdrop-blur-md ${
            canScrollRight
              ? isDark
                ? 'bg-zinc-800/90 hover:bg-zinc-700 text-white border border-white/10 shadow-md'
                : 'bg-white/90 hover:bg-white text-slate-800 border border-slate-200/80 shadow-md'
              : 'opacity-30 cursor-not-allowed text-slate-400'
          }`}
          title="Scroll Right"
          aria-label="Scroll Categories Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tweaks Cards Grid with Frosted Glass styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTweaks.map((tweak) => {
          const isSelected = selectedTweaks.includes(tweak.id);
          return (
            <div
              key={tweak.id}
              onClick={() => toggleTweak(tweak.id)}
              className={`rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between cursor-pointer select-none backdrop-blur-xl relative overflow-hidden ${
                isSelected
                  ? isDark
                    ? 'bg-emerald-950/50 border-2 border-emerald-400 shadow-[0_12px_32px_rgba(16,185,129,0.25)] scale-[1.01]'
                    : 'bg-emerald-50/85 border-2 border-emerald-500 shadow-[0_12px_32px_rgba(16,185,129,0.18)] scale-[1.01]'
                  : isDark
                  ? 'bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/10 hover:border-emerald-500/40 hover:shadow-[0_12px_30px_rgba(16,185,129,0.15)]'
                  : 'bg-white/70 hover:bg-white/95 border border-white/90 hover:border-emerald-300 hover:shadow-[0_12px_30px_rgba(16,185,129,0.12)] shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold ${getModuleBadgeColor(
                          tweak.moduleNum
                        )}`}
                      >
                        MODULE {tweak.moduleNum}
                      </span>
                      {tweak.recommended && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold ${
                            isDark
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <h4 className={`font-extrabold text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {tweak.title}
                    </h4>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                        : isDark
                        ? 'border-zinc-700 bg-zinc-800/50 group-hover:border-zinc-500'
                        : 'border-slate-300 bg-slate-50 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  {tweak.desc}
                </p>
              </div>

              {/* Action buttons */}
              <div
                className={`pt-3 border-t flex items-center justify-between gap-2 ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}
              >
                <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {tweak.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCopySingle(tweak, e)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Copy PowerShell command to clipboard"
                  >
                    {copiedId === tweak.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={(e) => handleDownloadSingle(tweak, e)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}
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
