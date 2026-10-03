import React, { useState, useMemo } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { SOFTWARE_APPS, CATEGORIES, PRESET_BUNDLES, SoftwareApp } from '../data/toolkitCatalog';
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

  // Filter apps based on search and category
  const filteredApps = useMemo(() => {
    return SOFTWARE_APPS.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.desc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All Applications' || app.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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

  const clearSelection = () => {
    setSelectedApps([]);
    onNotify('Cleared all selected applications');
  };

  const applyPreset = (presetName: string) => {
    const preset = PRESET_BUNDLES.find((p) => p.name === presetName);
    if (preset && preset.apps.length > 0) {
      setSelectedApps(preset.apps);
      onNotify(`Applied preset: ${preset.name} (${preset.apps.length} apps)`);
    }
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
      case 'Web Browsers':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'Developer & Coding':
        return <Code2 className="w-4 h-4 text-emerald-500" />;
      case 'Multimedia':
        return <Film className="w-4 h-4 text-amber-500" />;
      case 'Utilities & Tools':
        return <Wrench className="w-4 h-4 text-purple-500" />;
      case 'Communication':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'Gaming':
        return <Gamepad2 className="w-4 h-4 text-rose-500" />;
      case 'Security & Privacy':
        return <ShieldCheck className="w-4 h-4 text-cyan-500" />;
      case 'Remote Access & IT':
        return <Monitor className="w-4 h-4 text-teal-500" />;
      case 'Office & Productivity':
        return <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Boxes className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* Glassmorphic Hero Banner */}
      <div
        className={`rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden ${
          isDark
            ? 'bg-zinc-900/60 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]'
            : 'bg-white/70 border border-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                <Sparkles className="w-3.5 h-3.5" /> Web Software Hub
              </span>
              <span className={isDark ? 'text-zinc-600' : 'text-slate-300'}>·</span>
              <span className={`font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                44 Curated Packages
              </span>
            </div>

            <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Multi-App Silent Installer
            </h2>

            <p className={`text-sm max-w-2xl leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
              Select multiple applications to bundle into a single 1-click silent installer file (
              <code className={`font-mono text-xs font-semibold px-1.5 py-0.5 rounded-md ${isDark ? 'bg-zinc-800 text-cyan-300' : 'bg-slate-100 text-cyan-700'}`}>.bat</code> or{' '}
              <code className={`font-mono text-xs font-semibold px-1.5 py-0.5 rounded-md ${isDark ? 'bg-zinc-800 text-cyan-300' : 'bg-cyan-700'}`}>.ps1</code>). Zero wizard dialogs, zero bloatware, completely automated.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              <Layers className="w-3.5 h-3.5 text-cyan-500" /> 1-Click Curated Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_BUNDLES.slice(0, 4).map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p.name)}
                  className={`px-3 py-1.5 text-xs rounded-xl backdrop-blur-md transition-all font-medium flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                    isDark
                      ? 'bg-zinc-800/70 hover:bg-zinc-700/80 border border-white/10 text-zinc-200 hover:text-white'
                      : 'bg-white/80 hover:bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:shadow-md'
                  }`}
                >
                  <span>{p.name.split(' ')[0]}</span>
                  <span>{p.name.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search software by name (Chrome, VS Code, Git, VLC), category, or Winget ID..."
            className={`w-full rounded-2xl pl-10 pr-4 py-3 text-sm placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-sans backdrop-blur-xl ${
              isDark
                ? 'bg-zinc-900/60 border border-white/10 text-zinc-100 focus:border-cyan-500'
                : 'bg-white/70 border border-white/90 text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:border-cyan-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Global Select/Deselect buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={selectAllFiltered}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold backdrop-blur-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 border border-white/10'
                : 'bg-white/75 hover:bg-white text-slate-700 border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Select All ({filteredApps.length})
          </button>
          {selectedApps.length > 0 && (
            <button
              onClick={clearSelection}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold backdrop-blur-xl transition-all cursor-pointer active:scale-95 ${
                isDark
                  ? 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 border border-white/10'
                  : 'bg-white/75 hover:bg-white text-slate-500 border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
              }`}
            >
              Clear ({selectedApps.length})
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Glass Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const count =
            cat === 'All Applications'
              ? SOFTWARE_APPS.length
              : SOFTWARE_APPS.filter((a) => a.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-2 cursor-pointer backdrop-blur-md ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 border-transparent'
                  : isDark
                  ? 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 border border-white/10 hover:border-white/20'
                  : 'bg-white/70 text-slate-600 hover:text-slate-900 border border-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-white'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : isDark
                    ? 'bg-white/5 text-zinc-400'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Application Cards Grid with Frosted Glasstic Style */}
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
                <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  {app.desc}
                </p>
              </div>

              {/* Footer with Winget ID and Action buttons */}
              <div
                className={`pt-3 border-t flex items-center justify-between gap-2 mt-auto ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}
              >
                <code className={`text-[11px] font-mono truncate max-w-[140px] sm:max-w-[160px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {app.id}
                </code>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCopySingleApp(app, e)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-cyan-300'
                        : 'bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                    title="Copy Winget command for this app"
                  >
                    {copiedAppId === app.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleDownloadSingleApp(app, e)}
                    className={`p-1.5 rounded-lg transition-colors border border-transparent cursor-pointer ${
                      isDark
                        ? 'bg-zinc-800/80 hover:bg-emerald-950 hover:text-emerald-400 hover:border-emerald-800 text-zinc-300'
                        : 'bg-slate-100/90 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-600'
                    }`}
                    title="Download 1-click silent installer (.bat)"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <div
          className={`text-center py-16 border rounded-3xl p-8 backdrop-blur-xl ${
            isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
          }`}
        >
          <Wrench className="w-10 h-10 text-slate-400 dark:text-zinc-500 mx-auto mb-3" />
          <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            No Applications Found
          </h3>
          <p className={`text-xs max-w-sm mx-auto mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            No software package matched your search query "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Applications');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
