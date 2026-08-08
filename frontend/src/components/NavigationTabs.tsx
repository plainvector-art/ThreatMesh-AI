import React from 'react';
import { Shield, Eye, Bot, BookOpen } from 'lucide-react';

export type TabType = 'threats' | 'deepfake' | 'chatbot' | 'awareness';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'threats' as TabType,
      label: 'Threat Recognition & OSINT Mesh',
      shortLabel: 'Threat Mesh',
      icon: Shield,
      color: 'blue',
      activeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-blue-500/10',
      iconColor: 'text-blue-400',
      badge: null,
    },
    {
      id: 'deepfake' as TabType,
      label: 'Deepfake & Media Forensics',
      shortLabel: 'Deepfake Forensics',
      icon: Eye,
      color: 'rose',
      activeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-rose-500/10',
      iconColor: 'text-rose-400',
      badge: 'OpenCV',
    },
    {
      id: 'chatbot' as TabType,
      label: 'AI Security Assistant',
      shortLabel: 'AI Copilot',
      icon: Bot,
      color: 'emerald',
      activeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10',
      iconColor: 'text-emerald-400',
      badge: 'Copilot',
    },
    {
      id: 'awareness' as TabType,
      label: 'Security Awareness & Intel',
      shortLabel: 'Intel Feed',
      icon: BookOpen,
      color: 'amber',
      activeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-amber-500/10',
      iconColor: 'text-amber-400',
      badge: null,
    },
  ];

  return (
    <nav className="bg-slate-950/90 border-b border-slate-800/80 sticky top-[73px] z-20 backdrop-blur-md px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
                isActive
                  ? `${tab.activeClass} font-bold shadow-md bg-slate-900`
                  : 'bg-slate-900/40 text-slate-400 border-slate-800/60 hover:bg-slate-850 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? tab.iconColor : 'text-slate-400'}`} />
              <span className="hidden sm:inline font-sans">{tab.label}</span>
              <span className="sm:hidden font-sans">{tab.shortLabel}</span>

              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded uppercase tracking-wider ${
                    isActive
                      ? 'bg-slate-800 border border-slate-700'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
