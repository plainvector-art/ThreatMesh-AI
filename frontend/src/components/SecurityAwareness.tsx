import React, { useState, useEffect } from 'react';
import { BookOpen, Newspaper, Award, CheckCircle, XCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { fetchQuizzes, fetchNews } from '../services/api';

export const SecurityAwareness: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchQuizzes().then(setQuizzes).catch(console.error);
    fetchNews().then(setNews).catch(console.error);
  }, []);

  const handleSelectOption = (quizId: string, optionIndex: number) => {
    if (submittedQuiz[quizId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: optionIndex }));
  };

  const handleSubmitQuiz = (quizId: string) => {
    setSubmittedQuiz((prev) => ({ ...prev, [quizId]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100 font-display">Security Awareness &amp; Threat Intelligence</h2>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              Threat Intel Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Interactive training challenges for Tier 1 analysts and live CISA/NVD cybersecurity news advisories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Security Quizzes */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
              <Award className="w-4 h-4 text-amber-400" />
              Security Analyst Knowledge Challenges ({quizzes.length} Modules)
            </h3>

            <div className="space-y-5">
              {quizzes.map((q) => {
                const isSubmitted = submittedQuiz[q.id];
                const selectedOpt = selectedAnswers[q.id];
                const isCorrect = selectedOpt === q.correct_index;

                return (
                  <div key={q.id} className="p-4.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-xs">{q.title}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-850 text-slate-400 border border-slate-750 uppercase tracking-wider">
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-slate-300 font-medium text-xs leading-relaxed">{q.question}</p>

                    {/* Options List */}
                    <div className="space-y-2">
                      {q.options.map((opt: string, idx: number) => {
                        let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850";
                        if (selectedOpt === idx) {
                          btnStyle = "bg-blue-500/20 border-blue-500 text-blue-300 font-medium";
                        }
                        if (isSubmitted) {
                          if (idx === q.correct_index) {
                            btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                          } else if (selectedOpt === idx) {
                            btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(q.id, idx)}
                            className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-mono mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit Button or Explanation */}
                    {!isSubmitted ? (
                      <button
                        onClick={() => handleSubmitQuiz(q.id)}
                        disabled={selectedOpt === undefined}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold disabled:opacity-40 transition-all cursor-pointer"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                          {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                        </div>
                        <p className="text-slate-300 font-sans text-xs">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Cybersecurity News & Threat Advisories */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
              <Newspaper className="w-4 h-4 text-blue-400" />
              Live Threat Advisories &amp; CVE News
            </h3>

            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-850 text-slate-300 border border-slate-750 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-xs">{item.title}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
