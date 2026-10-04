import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Check,
  Download,
  Copy,
  Terminal,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  ArrowRight,
  Clock,
  Package
} from 'lucide-react';
import { SOFTWARE_APPS, CATEGORIES, SoftwareApp } from '../data/toolkitCatalog';
import { AppLogo } from '../data/appLogos';
import {
  generateBatchInstaller,
  generatePowerShellInstaller,
  generateOneLineCommand,
  triggerFileDownload
} from '../utils/scriptGenerator';

interface SoftwareInstallerTabProps {
  selectedApps: string[];
  setSelectedApps: React.Dispatch<React.SetStateAction<string[]>>;
  onNotify: (msg: string) => void;
  onNavigateToInstall?: () => void;
  isDark?: boolean;
}

export const SoftwareInstallerTab: React.FC<SoftwareInstallerTabProps> = ({
  selectedApps,
  setSelectedApps,
  onNotify,
  onNavigateToInstall,
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

  return (
    <div className="space-y-6 relative z-10">
      {/* Floating Action Banner When Apps are Selected - matching user reference image */}
      {selectedApps.length > 0 && (
        <div
          className={`sticky top-20 z-20 rounded-2xl p-6 transition-all duration-200 border shadow-xl backdrop-blur-xl ${
            isDark
              ? 'bg-zinc-900/95 border-purple-500/40 text-zinc-100'
              : 'bg-white/95 border-purple-300 text-slate-900'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Your apps are ready
              </h3>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Make sure you have Windows Package Manager installed :) ({selectedApps.length} apps selected)
              </p>
            </div>

            {/* Pill Action Buttons exactly like reference image */}
            <div className="flex flex-wrap items-center gap-2.5">
              {onNavigateToInstall && (
                <button
                  onClick={onNavigateToInstall}
                  className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  Go to Install ({selectedApps.length}) <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleDownloadBatch}
                className="px-5 py-2 rounded-full border-2 border-slate-900 dark:border-white font-bold text-sm text-purple-600 dark:text-purple-400 bg-white dark:bg-zinc-900 hover:bg-purple-50 dark:hover:bg-zinc-800 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download installer
              </button>

              <button
                onClick={handleDownloadBatch}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80'
                }`}
                title="Download .bat batch file"
              >
                Batch
              </button>

              <button
                onClick={handleDownloadPS1}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80'
                }`}
                title="Download PowerShell .ps1 file"
              >
                PowerShell
              </button>

              <button
                onClick={handleCopyCommand}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80'
                }`}
                title="Copy 1-line winget installation command"
              >
                Winget Import
              </button>

              <button
                onClick={clearSelection}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  isDark
                    ? 'text-zinc-400 hover:text-rose-400 hover:bg-zinc-800'
                    : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                }`}
                title="Clear selection"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search applications (e.g. Chrome, VS Code, Discord, Zoom, VLC, Teams)..."
          className={`w-full rounded-xl pl-11 pr-20 py-3 text-sm placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${
            isDark
              ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-purple-500'
              : 'bg-white border border-slate-200 text-slate-900 shadow-sm focus:border-purple-500'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-slate-900"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills Row with Scroll Arrows */}
      <div className="relative flex items-center gap-2">
        <button
          onClick={slideLeft}
          disabled={!canScrollLeft}
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer z-10 ${
            canScrollLeft
              ? isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm'
              : 'opacity-20 cursor-not-allowed text-slate-400'
          }`}
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDark
                    ? 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-normal ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isDark
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={slideRight}
          disabled={!canScrollRight}
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer z-10 ${
            canScrollRight
              ? isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm'
              : 'opacity-20 cursor-not-allowed text-slate-400'
          }`}
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Application Cards Matching User Reference Image with Full Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredApps.map((app) => {
          const isSelected = selectedApps.includes(app.id);
          return (
            <div
              key={app.id}
              onClick={() => toggleApp(app.id)}
              className={`group relative flex flex-col justify-between p-4 rounded-2xl transition-all duration-150 cursor-pointer select-none text-left min-h-[170px] ${
                isSelected
                  ? isDark
                    ? 'bg-purple-950/20 border-2 border-purple-500 shadow-[0_6px_25px_rgba(168,85,247,0.2)]'
                    : 'bg-purple-50/50 border-2 border-purple-600 shadow-[0_6px_25px_rgba(147,51,234,0.12)]'
                  : isDark
                  ? 'bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 hover:shadow-md'
                  : 'bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                {/* Top Row: App Logo, Name, and Selection Checkbox Indicator */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                      <AppLogo id={app.id} name={app.name} className="w-8 h-8 object-contain" />
                    </div>
                    <h3
                      className={`text-sm font-bold truncate leading-snug ${
                        isDark ? 'text-zinc-100 group-hover:text-white' : 'text-slate-900 group-hover:text-slate-950'
                      }`}
                      title={app.name}
                    >
                      {app.name}
                    </h3>
                  </div>

                  {/* Radio / Checkmark Indicator */}
                  <div className="shrink-0 mt-0.5">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-purple-600 dark:bg-purple-500 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-zinc-600 transition-colors group-hover:border-purple-500" />
                    )}
                  </div>
                </div>

                {/* App Description (Details exactly matching user reference screenshot) */}
                <p className={`text-xs leading-relaxed line-clamp-2 mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  {app.desc}
                </p>
              </div>

              {/* Bottom Metadata: Last updated & ID */}
              <div
                className={`pt-3 border-t flex flex-col gap-1 text-[11px] ${
                  isDark ? 'border-zinc-800/80 text-zinc-500' : 'border-slate-100 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Last updated recently</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopySingleApp(app, e)}
                      className="p-1 hover:text-purple-600 transition-colors cursor-pointer"
                      title="Copy package ID"
                    >
                      {copiedAppId === app.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => handleDownloadSingleApp(app, e)}
                      className="p-1 hover:text-purple-600 transition-colors cursor-pointer"
                      title="Download .bat"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Package className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{app.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
