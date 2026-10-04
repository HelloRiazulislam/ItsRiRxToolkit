import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Check,
  Download,
  Copy,
  Terminal,
  Sparkles,
  Layers,
  Globe,
  Code2,
  Film,
  Wrench,
  MessageSquare,
  Gamepad2,
  ShieldCheck,
  Monitor,
  FileText,
  Boxes,
  RotateCcw,
  CheckCircle2,
  Cloud,
  Palette,
  Bot,
  HardDriveDownload,
  Cpu,
  Network,
  Database,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Filter
} from 'lucide-react';
import { SOFTWARE_APPS, CATEGORIES, SoftwareApp } from '../data/toolkitCatalog';
import { generateBatchInstaller, generatePowerShellInstaller, generateOneLineCommand, triggerFileDownload } from '../utils/scriptGenerator';

interface SoftwareInstallerTabProps {
  selectedApps: string[];
  setSelectedApps: React.Dispatch<React.SetStateAction<string[]>>;
  onNotify: (msg: string) => void;
  isDark?: boolean;
}

export const SoftwareInstallerTab: React.FC<SoftwareInstallerTabProps> = ({
  selectedApps,
  setSelectedApps,
  onNotify,
  isDark = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Applications');
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);

  // Category Sliding & Scrolling Ref
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScrollability = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
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
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  const slideRight = () => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoryScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - categoryScrollRef.current.offsetLeft);
    setScrollLeftState(categoryScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !categoryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    categoryScrollRef.current.scrollLeft = scrollLeftState - walk;
    checkScrollability();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (categoryScrollRef.current && Math.abs(e.deltaY) > 0) {
      categoryScrollRef.current.scrollLeft += e.deltaY * 1.2;
      checkScrollability();
    }
  };

  const filteredApps = useMemo(() => {
    return SOFTWARE_APPS.filter((app) => {
      const matchesCategory =
        selectedCategory === 'All Applications' || app.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.desc.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleApp = (id: string) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const idsToAdd = filteredApps.map((a) => a.id);
    setSelectedApps((prev) => Array.from(new Set([...prev, ...idsToAdd])));
    onNotify(`Selected all ${filteredApps.length} visible applications`);
  };

  const selectPopularApps = () => {
    const popularIds = SOFTWARE_APPS.filter((a) => a.popular).map((a) => a.id);
    setSelectedApps((prev) => Array.from(new Set([...prev, ...popularIds])));
    onNotify(`Selected ${popularIds.length} popular essential applications!`);
  };

  const clearSelection = () => {
    setSelectedApps([]);
    onNotify('Cleared all selected applications');
  };

  const handleDownloadBatch = () => {
    if (selectedApps.length === 0) {
      onNotify('Please select at least 1 application first!');
      return;
    }
    const script = generateBatchInstaller(selectedApps, [], 'ItsRiRx Silent Software Deployment');
    triggerFileDownload('install-selected-apps.bat', script);
    onNotify(`Downloaded 1-click silent installer for ${selectedApps.length} apps!`);
  };

  const handleDownloadPS1 = () => {
    if (selectedApps.length === 0) {
      onNotify('Please select at least 1 application first!');
      return;
    }
    const script = generatePowerShellInstaller(selectedApps, [], 'ItsRiRx Silent Software Deployment');
    triggerFileDownload('install-selected-apps.ps1', script);
    onNotify(`Downloaded PowerShell script for ${selectedApps.length} apps!`);
  };

  const handleCopyCommand = () => {
    if (selectedApps.length === 0) {
      onNotify('Please select at least 1 application first!');
      return;
    }
    const cmd = generateOneLineCommand(selectedApps, []);
    navigator.clipboard.writeText(cmd);
    onNotify(`Copied silent installation command for ${selectedApps.length} apps!`);
  };

  const handleCopySingleApp = (app: SoftwareApp, e: React.MouseEvent) => {
    e.stopPropagation();
    const cmd = `winget install --id ${app.id} -e --silent --accept-package-agreements --accept-source-agreements --disable-interactivity`;
    navigator.clipboard.writeText(cmd);
    setCopiedAppId(app.id);
    onNotify(`Copied Winget command for ${app.name}!`);
    setTimeout(() => setCopiedAppId(null), 2000);
  };

  const handleDownloadSingleApp = (app: SoftwareApp, e: React.MouseEvent) => {
    e.stopPropagation();
    const script = generateBatchInstaller([app.id], [], `Install ${app.name}`);
    triggerFileDownload(`install-${app.name.toLowerCase().replace(/\s+/g, '-')}.bat`, script);
    onNotify(`Downloaded 1-click installer for ${app.name}!`);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Office & Productivity':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'Cloud & Storage':
        return <Cloud className="w-4 h-4 text-sky-500" />;
      case 'Remote Access':
        return <Monitor className="w-4 h-4 text-teal-500" />;
      case 'Graphics & Design':
        return <Palette className="w-4 h-4 text-purple-500" />;
      case 'AI Tools':
        return <Bot className="w-4 h-4 text-emerald-500" />;
      case 'Backup & Recovery':
        return <HardDriveDownload className="w-4 h-4 text-rose-500" />;
      case 'System & Hardware':
        return <Cpu className="w-4 h-4 text-indigo-500" />;
      case 'Network Tools':
        return <Network className="w-4 h-4 text-blue-500" />;
      case 'Download Tools':
        return <Download className="w-4 h-4 text-cyan-500" />;
      case 'Database & Server':
        return <Database className="w-4 h-4 text-emerald-600" />;
      case 'Web Browsers':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'Developer & Coding':
        return <Code2 className="w-4 h-4 text-emerald-500" />;
      case 'Multimedia':
        return <Film className="w-4 h-4 text-rose-500" />;
      case 'Utilities & Tools':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'Communication':
        return <MessageSquare className="w-4 h-4 text-teal-500" />;
      case 'Gaming':
        return <Gamepad2 className="w-4 h-4 text-violet-500" />;
      case 'Security & Privacy':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <Boxes className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* Modern Redesigned Glassmorphic Command Hero Banner */}
      <div
        className={`rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden border ${
          isDark
            ? 'bg-zinc-900/60 border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.35)]'
            : 'bg-white/75 border-white/90 shadow-[0_12px_45px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left Block: Icon, Title & Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg ${
                isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
              }`}>
                <Zap className="w-3.5 h-3.5 fill-current" /> Unattended Software Deployment
              </span>
              <span className={`text-xs font-mono ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                · {SOFTWARE_APPS.length} Packages Available
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 shrink-0">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Multi-App Silent Installer
                </h2>
                <p className={`text-xs md:text-sm mt-0.5 leading-relaxed max-w-xl ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Select multiple software packages to generate an automated 1-click silent installer script (
                  <code className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">.bat</code> /{' '}
                  <code className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">.ps1</code>). Zero wizard dialogs, zero bundled bloatware.
                </p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-xl flex items-center gap-1.5 ${
                isDark ? 'bg-zinc-800/80 text-zinc-300 border border-white/5' : 'bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}>
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> Pure Silent (<code className="font-bold">--silent</code>)
              </span>
              <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-xl flex items-center gap-1.5 ${
                isDark ? 'bg-zinc-800/80 text-zinc-300 border border-white/5' : 'bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" /> Microsoft Winget Verified
              </span>
              <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-xl flex items-center gap-1.5 ${
                isDark ? 'bg-zinc-800/80 text-zinc-300 border border-white/5' : 'bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Zero Unwanted Bundles
              </span>
            </div>
          </div>

          {/* Right Block: Clean Selection Control Deck */}
          <div className={`p-4 rounded-2xl border flex flex-col gap-2.5 shrink-0 self-stretch lg:self-auto justify-center min-w-[260px] ${
            isDark ? 'bg-zinc-950/50 border-white/10' : 'bg-slate-50/80 border-slate-200/80 shadow-sm'
          }`}>
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10 dark:border-white/5">
              <span className={`text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Queue Status:
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                selectedApps.length > 0
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                  : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-200 text-slate-600'
              }`}>
                {selectedApps.length} Selected
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={selectPopularApps}
                className="w-full px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-current text-amber-300" /> Select Popular Essentials
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllFiltered}
                  className={`flex-1 px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                    isDark
                      ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-white/10'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> All Visible ({filteredApps.length})
                </button>

                {selectedApps.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
                      isDark
                        ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border-rose-800/50'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                    }`}
                    title="Clear selected apps"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Floating Action Bar when Apps are selected */}
      {selectedApps.length > 0 && (
        <div className="sticky top-20 z-20 bg-slate-900/85 dark:bg-zinc-900/85 border border-white/20 dark:border-white/15 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-cyan-500/25">
              {selectedApps.length}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{selectedApps.length} Applications Selected</span>
                <span className="text-xs text-cyan-300 font-mono hidden md:inline">
                  (Ready for 1-Click Silent Deployment)
                </span>
              </div>
              <p className="text-xs text-cyan-200/80 truncate max-w-md">
                {selectedApps
                  .map((id) => SOFTWARE_APPS.find((a) => a.id === id)?.name)
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
              <Download className="w-4 h-4" /> Download 1-Click Installer (.bat)
            </button>
            <button
              onClick={handleDownloadPS1}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Download PowerShell .ps1 script"
            >
              <Terminal className="w-4 h-4 text-cyan-400" /> .ps1
            </button>
            <button
              onClick={handleCopyCommand}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Copy 1-line command to clipboard"
            >
              <Copy className="w-4 h-4 text-cyan-400" /> Copy Command
            </button>
            <button
              onClick={clearSelection}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 border border-white/10 backdrop-blur-md transition-all cursor-pointer"
              title="Deselect All"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar with Glass Styling */}
      <div className="relative">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search software by name (Chrome, WPS, ChatGPT, AnyDesk), category, or Winget ID..."
            className={`w-full rounded-2xl pl-10 pr-20 py-3 text-sm placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-sans backdrop-blur-xl ${
              isDark
                ? 'bg-zinc-900/60 border border-white/10 text-zinc-100 focus:border-cyan-500'
                : 'bg-white/70 border border-white/90 text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:border-cyan-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono px-2 py-0.5 rounded-md bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider with Interactive Left/Right Nav Buttons & Smooth Drag/Wheel */}
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
          ref={categoryScrollRef}
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
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All Applications'
                ? SOFTWARE_APPS.length
                : SOFTWARE_APPS.filter((a) => a.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-2 cursor-pointer backdrop-blur-md shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 border-transparent'
                    : isDark
                    ? 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 border border-white/10 hover:border-white/20'
                    : 'bg-white/70 text-slate-600 hover:text-slate-900 border border-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-white'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isDark
                      ? 'bg-white/5 text-zinc-400'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
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

      {/* Application Cards Grid with Frosted Glass Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => {
          const isSelected = selectedApps.includes(app.id);
          return (
            <div
              key={app.id}
              onClick={() => toggleApp(app.id)}
              className={`group rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between cursor-pointer select-none backdrop-blur-xl relative overflow-hidden ${
                isSelected
                  ? isDark
                    ? 'bg-cyan-950/50 border-2 border-cyan-400 shadow-[0_12px_32px_rgba(6,182,212,0.25)] scale-[1.01]'
                    : 'bg-cyan-50/85 border-2 border-cyan-500 shadow-[0_12px_32px_rgba(6,182,212,0.18)] scale-[1.01]'
                  : isDark
                  ? 'bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_12px_30px_rgba(6,182,212,0.15)]'
                  : 'bg-white/70 hover:bg-white/95 border border-white/90 hover:border-cyan-300 hover:shadow-[0_12px_30px_rgba(6,182,212,0.12)] shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
              }`}
            >
              <div>
                {/* Header row with Icon, Checkbox & Title */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 border-cyan-400'
                          : isDark
                          ? 'bg-zinc-800/80 border-white/10 text-zinc-300 group-hover:text-white'
                          : 'bg-slate-100/80 border-slate-200/60 text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {getCategoryIcon(app.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className={`font-bold text-sm tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {app.name}
                        </h4>
                        {app.popular && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                            HOT
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] font-mono block mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        {app.category}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox indicator */}
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30'
                        : isDark
                        ? 'border-zinc-700 bg-zinc-800/50 group-hover:border-zinc-500'
                        : 'border-slate-300 bg-slate-50 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  {app.desc}
                </p>
              </div>

              {/* Bottom bar with Winget ID and Action buttons */}
              <div
                className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isDark ? 'border-white/5 text-zinc-500' : 'border-slate-100 text-slate-400'
                }`}
              >
                <span className="truncate max-w-[150px] sm:max-w-[180px] text-[11px]">
                  {app.id}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCopySingleApp(app, e)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      copiedAppId === app.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : isDark
                        ? 'hover:bg-zinc-800 hover:text-white border-white/10 text-zinc-400'
                        : 'hover:bg-slate-100 hover:text-slate-800 border-slate-200 text-slate-500'
                    }`}
                    title="Copy Winget command for this app"
                  >
                    {copiedAppId === app.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={(e) => handleDownloadSingleApp(app, e)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isDark
                        ? 'hover:bg-zinc-800 hover:text-cyan-400 border-white/10 text-zinc-400'
                        : 'hover:bg-slate-100 hover:text-cyan-700 border-slate-200 text-slate-500'
                    }`}
                    title="Download 1-click installer (.bat)"
                  >
                    <Download className="w-3.5 h-3.5" />
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
