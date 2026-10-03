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
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { SOFTWARE_APPS, CATEGORIES, PRESET_BUNDLES, SoftwareApp } from '../data/toolkitCatalog';
import { generateBatchInstaller, generatePowerShellInstaller, generateOneLineCommand, triggerFileDownload } from '../utils/scriptGenerator';

interface SoftwareInstallerTabProps {
  selectedApps: string[];
  setSelectedApps: React.Dispatch<React.SetStateAction<string[]>>;
  onNotify: (msg: string) => void;
  onSwitchToCustomBuilder?: () => void;
}

export const SoftwareInstallerTab: React.FC<SoftwareInstallerTabProps> = ({
  selectedApps,
  setSelectedApps,
  onNotify,
  onSwitchToCustomBuilder
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
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'Developer & Coding':
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case 'Multimedia':
        return <Film className="w-4 h-4 text-amber-400" />;
      case 'Utilities & Tools':
        return <Wrench className="w-4 h-4 text-purple-400" />;
      case 'Communication':
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'Gaming':
        return <Gamepad2 className="w-4 h-4 text-rose-400" />;
      case 'Security & Privacy':
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      case 'Remote Access & IT':
        return <Monitor className="w-4 h-4 text-teal-400" />;
      case 'Office & Productivity':
        return <FileText className="w-4 h-4 text-yellow-400" />;
      default:
        return <Boxes className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header for App Store */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Web Software Hub
              </span>
              <span className="text-xs text-zinc-500 font-mono">44 Verified Applications</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Multi-App Silent Installer Generator
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Select multiple applications below and download a 1-click silent installer file (<code className="text-cyan-400 font-mono text-xs">.bat</code> / <code className="text-cyan-400 font-mono text-xs">.ps1</code>). No wizard dialogs, no adware, zero manual clicking.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> 1-Click Quick Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_BUNDLES.slice(0, 4).map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p.name)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800/80 hover:bg-cyan-950/60 hover:text-cyan-300 hover:border-cyan-700/60 border border-zinc-700/70 text-zinc-300 transition-all font-medium flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                >
                  {p.name.split(' ')[0]} {p.name.split(' ').slice(1).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar when Apps are selected */}
      {selectedApps.length > 0 && (
        <div className="sticky top-20 z-20 bg-cyan-950/95 border-2 border-cyan-500/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl shadow-cyan-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center font-black text-lg shadow-lg">
              {selectedApps.length}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{selectedApps.length} Applications Selected for Silent Deployment</span>
                <span className="text-xs text-cyan-300 font-mono hidden md:inline">
                  (Ready to install)
                </span>
              </div>
              <p className="text-xs text-cyan-300/80 truncate max-w-md">
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
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download 1-Click Installer (.bat)
            </button>
            <button
              onClick={handleDownloadPS1}
              className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Download PowerShell .ps1 script"
            >
              <Terminal className="w-4 h-4 text-cyan-400" /> .ps1
            </button>
            <button
              onClick={handleCopyCommand}
              className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Copy 1-line command to clipboard"
            >
              <Copy className="w-4 h-4 text-cyan-400" /> Copy Command
            </button>
            <button
              onClick={clearSelection}
              className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800 text-zinc-400 border border-zinc-800 transition-all cursor-pointer"
              title="Deselect All"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search software by name (Chrome, VS Code, Git, VLC), category, or Winget ID..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Global Select/Deselect buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={selectAllFiltered}
            className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Select All ({filteredApps.length})
          </button>
          {selectedApps.length > 0 && (
            <button
              onClick={clearSelection}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold border border-zinc-800 transition-colors cursor-pointer active:scale-95"
            >
              Clear ({selectedApps.length})
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              {cat}
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Application Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredApps.map((app) => {
          const isSelected = selectedApps.includes(app.id);
          return (
            <div
              key={app.id}
              onClick={() => toggleApp(app.id)}
              className={`group border rounded-2xl p-4 transition-all duration-150 flex flex-col justify-between cursor-pointer select-none relative ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/60 to-zinc-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                  : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div>
                {/* Header row with Icon, Checkbox & Badge */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                          : 'bg-zinc-800/70 border-zinc-700/60 text-zinc-400 group-hover:text-zinc-200'
                      }`}
                    >
                      {getCategoryIcon(app.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white text-sm tracking-tight leading-none">
                          {app.name}
                        </h4>
                        {app.popular && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            HOT
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono block mt-1">
                        {app.category}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox indicator */}
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-400 text-black shadow-md shadow-cyan-500/20'
                        : 'border-zinc-700 bg-zinc-800/50 group-hover:border-zinc-600'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed mb-3 line-clamp-2">
                  {app.desc}
                </p>
              </div>

              {/* Footer with Winget ID and Action buttons */}
              <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
                <code className="text-[11px] font-mono text-zinc-500 truncate max-w-[140px] sm:max-w-[160px]">
                  {app.id}
                </code>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleCopySingleApp(app, e)}
                    className="p-1.5 rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-zinc-400 hover:text-cyan-300 transition-colors"
                    title="Copy Winget command for this app"
                  >
                    {copiedAppId === app.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleDownloadSingleApp(app, e)}
                    className="p-1.5 rounded-lg bg-zinc-800/70 hover:bg-emerald-950 hover:text-emerald-400 hover:border-emerald-800 text-zinc-400 transition-colors border border-transparent"
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
        <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">
          <Wrench className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Applications Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            No software package matched your search query "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Applications');
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
