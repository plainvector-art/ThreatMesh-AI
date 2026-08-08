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
          <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
            MEDIUM
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            LOW
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
    <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[520px]">
      {/* Feed Header & Filters */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-slate-200">Real-Time Threat Scan Feed</h2>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400">
            {filteredScans.length} events
          </span>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
          {['all', 'critical', 'high', 'medium', 'safe'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                filterSeverity === sev
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {sev.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Content List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
            Loading scan feed...
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            No scans recorded matching filter '{filterSeverity}'. Submit a scan above to see live analysis.
          </div>
        ) : (
          filteredScans.map((scan) => {
            const isSelected = scan.id === selectedScanId;
            return (
              <div
                key={scan.id}
                onClick={() => onSelectScan(scan)}
                className={`p-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/90 transition-colors ${
                  isSelected ? 'bg-slate-900/90 border-l-2 border-l-blue-500' : ''
                }`}
              >
                {/* Target & Classification */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 uppercase">
                    {scan.input_type}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-200 truncate max-w-[280px] md:max-w-[420px]">
                        {scan.input_target}
                      </span>
                      <button
                        onClick={(e) => copyToClipboard(scan.input_target, scan.id, e)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                        title="Copy target string"
                      >
                        {copiedId === scan.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{scan.classification}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="font-mono text-blue-400/90">{scan.confidence}% confidence</span>
                    </p>
                  </div>
                </div>

                {/* Badge & Timestamp */}
                <div className="flex items-center gap-3">
                  {getSeverityBadge(scan.severity)}
                  <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                    {formatTimestamp(scan.created_at)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
