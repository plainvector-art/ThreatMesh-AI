import React, { useState } from 'react';
import { Search, Zap, Globe, Server, Hash, FileCode, ArrowRight } from 'lucide-react';

interface ScanInputBarProps {
  onScanSubmit: (inputTarget: string, inputType: string) => Promise<void>;
  isScanning: boolean;
}

export const ScanInputBar: React.FC<ScanInputBarProps> = ({ onScanSubmit, isScanning }) => {
  const [target, setTarget] = useState('');
  const [inputType, setInputType] = useState('auto');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim() || isScanning) return;
    await onScanSubmit(target.trim(), inputType);
  };

  const applyPreset = async (presetTarget: string, presetType: string) => {
    setTarget(presetTarget);
    setInputType(presetType);
    await onScanSubmit(presetTarget, presetType);
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          Interactive Threat Scan Console
        </h2>
        <span className="text-xs text-slate-400">Supports URLs, IP addresses, hashes, & logs</span>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
        {/* Type Selector */}
        <select
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
        >
          <option value="auto">Auto-Detect</option>
          <option value="url">URL Target</option>
          <option value="ip">IP / Host</option>
          <option value="hash">File Hash</option>
          <option value="log">Log / Payload</option>
        </select>

        {/* Input Target */}
        <div className="relative flex-1">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Paste URL (e.g. http://phish-bank.xyz), IP address, MD5/SHA256, or SQLi log..."
            className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs rounded-lg pl-9 pr-4 py-2.5 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!target.trim() || isScanning}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all whitespace-nowrap"
        >
          {isScanning ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Execute Scan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Preset Samples */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium mr-1">Quick Demos:</span>
        
        <button
          type="button"
          onClick={() => applyPreset('https://verify-account-update-bank.xyz/login', 'url')}
          className="px-2.5 py-1 rounded bg-slate-950 hover:bg-rose-500/10 text-rose-400 border border-slate-800 hover:border-rose-500/30 font-mono text-[11px] flex items-center gap-1 transition-all"
        >
          <Globe className="w-3 h-3" />
          <span>Phishing URL</span>
        </button>

        <button
          type="button"
          onClick={() => applyPreset('185.220.101.5:8080/c2_beacon', 'ip')}
          className="px-2.5 py-1 rounded bg-slate-950 hover:bg-amber-500/10 text-amber-400 border border-slate-800 hover:border-amber-500/30 font-mono text-[11px] flex items-center gap-1 transition-all"
        >
          <Server className="w-3 h-3" />
          <span>Malware IP</span>
        </button>

        <button
          type="button"
          onClick={() => applyPreset("SELECT * FROM admin_users WHERE username = 'admin' OR 1=1--", 'log')}
          className="px-2.5 py-1 rounded bg-slate-950 hover:bg-rose-500/10 text-rose-400 border border-slate-800 hover:border-rose-500/30 font-mono text-[11px] flex items-center gap-1 transition-all"
        >
          <FileCode className="w-3 h-3" />
          <span>SQLi Payload</span>
        </button>

        <button
          type="button"
          onClick={() => applyPreset('https://www.google.com', 'url')}
          className="px-2.5 py-1 rounded bg-slate-950 hover:bg-emerald-500/10 text-emerald-400 border border-slate-800 hover:border-emerald-500/30 font-mono text-[11px] flex items-center gap-1 transition-all"
        >
          <Globe className="w-3 h-3" />
          <span>Safe URL</span>
        </button>
      </div>
    </div>
  );
};
