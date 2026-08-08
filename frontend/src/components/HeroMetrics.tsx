import React from 'react';
import { Activity, ShieldAlert, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
import { DashboardMetrics } from '../types';

interface HeroMetricsProps {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ metrics, isLoading }) => {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Metric 1: Total Scans */}
      <div className="glass-panel p-5 rounded-xl border-l-4 border-l-blue-500 relative overflow-hidden group hover:border-blue-500/80 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Scans Processed</p>
            <h3 className="text-3xl font-bold text-slate-50 mt-1 font-mono tracking-tight">
              {metrics.total_scans.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-blue-400 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{metrics.trend_24h_change}</span>
        </div>
      </div>

      {/* Metric 2: Threats Blocked */}
      <div className="glass-panel p-5 rounded-xl border-l-4 border-l-emerald-500 relative overflow-hidden group hover:border-emerald-500/80 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Threats Mitigated</p>
            <h3 className="text-3xl font-bold text-slate-50 mt-1 font-mono tracking-tight">
              {metrics.threats_blocked.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>Block Rate: <strong className="text-emerald-400 font-mono">{metrics.threat_ratio_percent}%</strong></span>
          <span className="text-[11px] text-slate-500">Auto-filtered</span>
        </div>
      </div>

      {/* Metric 3: Active Alerts (Neon Coral Highlight) */}
      <div className="glass-panel p-5 rounded-xl border-l-4 border-l-rose-500 relative overflow-hidden group hover:border-rose-500/80 transition-all shadow-lg shadow-rose-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Active High-Severity Alerts
            </p>
            <h3 className="text-3xl font-bold text-rose-400 mt-1 font-mono tracking-tight flex items-baseline gap-2">
              {metrics.active_alerts}
              <span className="text-xs font-sans font-normal text-rose-500/80">requires triage</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-rose-400/90">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>n8n Webhook Dispatch: Enabled</span>
        </div>
      </div>
    </div>
  );
};
