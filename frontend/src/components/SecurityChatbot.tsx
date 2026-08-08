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
          text: 'Error processing security query. Please ensure backend server is reachable.',
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
    <div className="glass-panel rounded-xl border border-slate-800 flex flex-col h-[640px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              AI Security Assistant &amp; Threat Copilot
            </h2>
            <p className="text-[11px] text-slate-400">Real-time incident response advisor &amp; CVE explainer</p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ONLINE
        </span>
      </div>

      {/* Preset Questions */}
      <div className="p-3 border-b border-slate-800/60 bg-slate-950/40 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Prompts:
        </span>
        <button
          onClick={() => handlePresetClick("How do I triage a high-severity phishing alert?")}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] transition-all"
        >
          Phishing Triage Playbook
        </button>
        <button
          onClick={() => handlePresetClick("What spectral artifacts indicate a synthetic voice deepfake?")}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] transition-all"
        >
          Voice Clone Artifacts
        </button>
        <button
          onClick={() => handlePresetClick("How does the n8n incident alert pipeline dispatch webhooks?")}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] transition-all"
        >
          n8n Webhook Pipeline
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mt-1 shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-3.5 rounded-xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-sans'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <span className="block text-[10px] opacity-60 text-right mt-1.5 font-mono">{m.timestamp}</span>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 mt-1 shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Security Copilot anything (e.g. explain SQL injection mitigation)..."
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
