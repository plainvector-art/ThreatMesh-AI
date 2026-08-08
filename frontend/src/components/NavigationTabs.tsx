import React from 'react';
import { Shield, Eye, Bot, BookOpen } from 'lucide-react';

export type TabType = 'threats' | 'deepfake' | 'chatbot' | 'awareness';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-6 pt-3 flex flex-wrap items-center gap-2">
      {/* Tab 1: Threat Console */}
      <button
        onClick={() => onTabChange('threats')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold border-t border-x transition-all ${
          activeTab === 'threats'
            ? 'bg-slate-950 text-blue-400 border-slate-800 border-b-transparent font-bold shadow-lg'
            : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850'
        }`}
      >
        <Shield className="w-4 h-4 text-blue-400" />
        <span>Threat Recognition &amp; OSINT Mesh</span>
      </button>

      {/* Tab 2: Deepfake & Media Forensics */}
      <button
        onClick={() => onTabChange('deepfake')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold border-t border-x transition-all ${
          activeTab === 'deepfake'
            ? 'bg-slate-950 text-rose-400 border-slate-800 border-b-transparent font-bold shadow-lg'
            : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850'
        }`}
      >
        <Eye className="w-4 h-4 text-rose-400" />
        <span>Deepfake &amp; Media Forensics</span>
      </button>

      {/* Tab 3: AI Security Copilot Chatbot */}
      <button
        onClick={() => onTabChange('chatbot')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold border-t border-x transition-all ${
          activeTab === 'chatbot'
            ? 'bg-slate-950 text-emerald-400 border-slate-800 border-b-transparent font-bold shadow-lg'
            : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850'
        }`}
      >
        <Bot className="w-4 h-4 text-emerald-400" />
        <span>AI Security Assistant</span>
        <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
          Copilot
        </span>
      </button>

      {/* Tab 4: Security Awareness & News */}
      <button
        onClick={() => onTabChange('awareness')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold border-t border-x transition-all ${
          activeTab === 'awareness'
            ? 'bg-slate-950 text-amber-400 border-slate-800 border-b-transparent font-bold shadow-lg'
            : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850'
        }`}
      >
        <BookOpen className="w-4 h-4 text-amber-400" />
        <span>Security Awareness &amp; Intel</span>
      </button>
    </div>
  );
};
