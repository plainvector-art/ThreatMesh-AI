import React, { useState } from 'react';
import { Shield, ExternalLink, ChevronRight, Copy, Check, Filter } from 'lucide-react';
import { ScanRecord, SeverityLevel } from '../types';

interface LiveFeedProps {
  scans: ScanRecord[];
  isLoading: boolean;
  onSelectScan: (scan: ScanRecord) => void;
  selectedScanId?: string;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({
  scans,
  isLoading,
  onSelectScan,
  selectedScanId
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredScans = filterSeverity === 'all'
    ? scans
    : scans.filter((s) => s.severity === filterSeverity);

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
            MEDIUM
          </span>
        );
      case 'low':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            LOW
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            CLEAN
          </span>
        );
    }
  };

  const copyToClipboard = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[520px] shadow-xl">
      {/* Feed Header & Filters */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-display">
              Real-Time Threat Scan Feed
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">Live telemetry &bull; {filteredScans.length} events logged</p>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
          {['all', 'critical', 'high', 'medium', 'low', 'safe'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold shadow-sm'
                  : 'text-slate-400 bg-slate-900/60 border border-slate-800/60 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {sev.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Content List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
            Synchronizing live threat telemetry...
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs font-mono">
            No threat scans recorded matching severity filter '{filterSeverity}'. Submit a scan above to trigger live analysis.
          </div>
        ) : (
          filteredScans.map((scan) => {
            const isSelected = scan.id === selectedScanId;
            return (
              <div
                key={scan.id}
                onClick={() => onSelectScan(scan)}
                className={`p-3.5 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900/90 border-l-4 border-l-blue-500 shadow-md'
                    : 'hover:bg-slate-900/60 border-l-4 border-l-transparent'
                }`}
              >
                {/* Target & Classification */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-850 text-slate-300 border border-slate-700/60 uppercase">
                    {scan.input_type}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-100 truncate max-w-[280px] md:max-w-[440px]">
                        {scan.input_target}
                      </span>
                      <button
                        onClick={(e) => copyToClipboard(scan.input_target, scan.id, e)}
                        className="text-slate-500 hover:text-slate-200 transition-colors p-0.5 rounded"
                        title="Copy target string"
                      >
                        {copiedId === scan.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="font-medium text-slate-300">{scan.classification}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="font-mono text-blue-400 font-semibold">{scan.confidence}% confidence</span>
                    </p>
                  </div>
                </div>

                {/* Badge & Timestamp */}
                <div className="flex items-center gap-3 shrink-0">
                  {getSeverityBadge(scan.severity)}
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                    {formatTimestamp(scan.created_at)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
