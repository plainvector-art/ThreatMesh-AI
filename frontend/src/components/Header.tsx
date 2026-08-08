import React from 'react';
import { Shield, Activity, Bell, RefreshCw, Zap } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  onTestAlert: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, onTestAlert, isRefreshing }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-slate-900 to-slate-950 border border-blue-500/30 shadow-lg shadow-blue-500/10 shrink-0">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ThreatMesh <span className="text-blue-500">AI</span>
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full uppercase">
                v1.1 SAAS
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Threat Recognition Engine &bull; Live OSINT Mesh</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Status */}
        <div className="flex items-center gap-3">
          {/* Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono">FastAPI Engine: Active</span>
          </div>

          {/* Test Alert Button */}
          <button
            onClick={onTestAlert}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Dispatch test incident payload to n8n webhook"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test n8n Alert</span>
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
};
