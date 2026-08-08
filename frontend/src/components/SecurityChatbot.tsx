import React, { useState } from 'react';
import { Bot, Send, User, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { askSecurityChatbot } from '../services/api';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const SecurityChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your ThreatMesh AI Security Copilot. Ask me about phishing indicators, deepfake forensic detection, n8n webhook alerts, or incident triage playbooks.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, timestamp: timeStr }]);
    setInput('');
    setIsSending(true);

    try {
      const res = await askSecurityChatbot(userText);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Error processing security query. Please ensure backend server is reachable on port 8000.',
          timestamp: timeStr
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handlePresetClick = (presetQuery: string) => {
    setInput(presetQuery);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[640px] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-display">
              AI Security Assistant &amp; Threat Copilot
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">Real-time incident response advisor &amp; CVE explainer</p>
          </div>
        </div>

        <span className="px-3 py-1 text-[10px] font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          ONLINE
        </span>
      </div>

      {/* Preset Questions */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center gap-2 text-xs overflow-x-auto no-scrollbar">
        <span className="text-slate-400 font-semibold flex items-center gap-1 font-display uppercase tracking-wider text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Prompts:
        </span>
        <button
          onClick={() => handlePresetClick("How do I triage a high-severity phishing alert?")}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-[11px] font-medium transition-all cursor-pointer"
        >
          Phishing Triage Playbook
        </button>
        <button
          onClick={() => handlePresetClick("What spectral artifacts indicate a synthetic voice deepfake?")}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-[11px] font-medium transition-all cursor-pointer"
        >
          Voice Clone Artifacts
        </button>
        <button
          onClick={() => handlePresetClick("How does the n8n incident alert pipeline dispatch webhooks?")}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-[11px] font-medium transition-all cursor-pointer"
        >
          n8n Webhook Pipeline
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/30 custom-scrollbar">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mt-1 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10 font-sans'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-sans shadow-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <span className="block text-[10px] opacity-60 text-right mt-1.5 font-mono">{m.timestamp}</span>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 mt-1 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono italic">
            <Bot className="w-4 h-4 animate-spin" />
            <span>Threat Copilot is generating security analysis...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Security Copilot anything (e.g. explain SQL injection mitigation)..."
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
