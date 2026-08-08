import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Search, Bell, Copy, Check, ExternalLink, Zap } from 'lucide-react';
import { ScanRecord } from '../types';

interface ThreatModalProps {
  scan: ScanRecord | null;
  onClose: () => void;
}

export const ThreatModal: React.FC<ThreatModalProps> = ({ scan, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!scan) return null;

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(scan, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'high':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'safe':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Side-Panel Modal Drawer */}
      <div className="w-full max-w-xl bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded border uppercase ${getSeverityStyle(scan.severity)}`}>
                {scan.severity}
              </span>
              <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300 uppercase">
                {scan.input_type}
              </span>
            </div>
            <h2 className="text-sm font-mono font-bold text-slate-100 break-all pr-4">
              {scan.input_target}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Scan ID: <span className="font-mono text-slate-500">{scan.id}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: AI Recognition Decision & Confidence */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                AI Threat Recognition Engine Output
              </h3>
              <span className="text-xs font-mono text-blue-400 font-bold">{scan.confidence}% Confidence</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <p className="text-[11px] text-slate-400">Classification</p>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">{scan.classification}</p>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <p className="text-[11px] text-slate-400">Risk Severity</p>
                <p className="text-sm font-semibold text-slate-100 capitalize mt-0.5">{scan.severity}</p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Model Certainty Gauge</span>
                <span className="font-mono">{scan.confidence}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    scan.severity === 'critical' || scan.severity === 'high'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-gradient-to-r from-blue-500 to-emerald-500'
                  }`}
                  style={{ width: `${scan.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Machine-Readable Reasoning Trace */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Reasoning Trace (Engine Decision Logic)
            </h3>

            <div className="space-y-2.5">
              {scan.reasoning_trace && scan.reasoning_trace.length > 0 ? (
                scan.reasoning_trace.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">
                        Step {step.step}: {step.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          step.status === 'critical'
                            ? 'bg-rose-500/20 text-rose-400'
                            : step.status === 'flagged'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                    <p className="text-slate-400 font-mono text-[11px]">{step.detail}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 font-mono">No detailed reasoning trace logged.</p>
              )}
            </div>
          </div>

          {/* Section 3: Live Web Context (Tavily Intelligence) */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-blue-400" />
              Live Web Context (Tavily Intelligence)
            </h3>

            {scan.tavily_context ? (
              <div className="p-3 rounded-lg bg-slate-950/80 border border-blue-500/20 text-xs text-slate-300 leading-relaxed font-sans">
                {scan.tavily_context}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-500 font-mono">
                Safe classification — Tavily web context search bypassed for benign targets.
              </div>
            )}
          </div>

          {/* Section 4: Incident Orchestration (n8n Webhook Status) */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-400" />
              Incident Orchestration (n8n Alert Pipeline)
            </h3>

            <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${scan.webhook_sent ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <p className="font-medium text-slate-200">Slack / Discord Alert Trigger</p>
                  <p className="text-[11px] text-slate-500">Target response time: &lt; 30s</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-mono rounded font-semibold uppercase ${
                  scan.webhook_sent
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {scan.webhook_status || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={copyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON' : 'Export JSON'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
