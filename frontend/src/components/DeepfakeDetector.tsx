import React, { useState, useEffect } from 'react';
import { Upload, Eye, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, Image as ImageIcon, Sparkles, RefreshCw, Zap, Play, Mic, QrCode } from 'lucide-react';
import { DeepfakePreset } from '../deepfakeTypes';
import { fetchDeepfakePresets, analyzeDeepfakeImageFile, analyzeDeepfakePreset, analyzeQRCode, analyzeAudioSample } from '../services/api';

export const DeepfakeDetector: React.FC = () => {
  const [subTab, setSubTab] = useState<'image' | 'audio' | 'qr'>('image');
  const [presets, setPresets] = useState<DeepfakePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeepfakePresets()
      .then((data) => {
        setPresets(data);
        if (data.length > 0) {
          handlePresetSelect(data[0]);
        }
      })
      .catch((err) => console.error('Failed to load deepfake presets:', err));
  }, []);

  const handlePresetSelect = async (preset: DeepfakePreset) => {
    setSelectedPresetId(preset.id);
    setSelectedFile(null);
    setPreviewUrl(preset.image_url);
    runImageAnalysis(preset.id, null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setSelectedFile(file);
    setSelectedPresetId(null);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const runImageAnalysis = async (presetId: string | null = selectedPresetId, file: File | null = selectedFile) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      if (file) {
        if (subTab === 'qr') {
          const res = await analyzeQRCode(file);
          setResult(res);
        } else {
          const res = await analyzeDeepfakeImageFile(file);
          setResult(res);
        }
      } else if (presetId) {
        const res = await analyzeDeepfakePreset(presetId);
        setResult(res);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute deepfake analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAudioSampleAnalysis = async (sampleId: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await analyzeAudioSample(sampleId);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Audio analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tab Switcher */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Eye className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-lg font-bold text-slate-100 font-display">Deepfake &amp; Media Forensics Workspace</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                OpenCV Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Forensic inspection suite analyzing synthetic AI images, neural voice clones, and QR code (Quishing) phishing payloads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-semibold border border-slate-800 transition-all cursor-pointer whitespace-nowrap shadow-sm">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>{selectedFile ? selectedFile.name.slice(0, 20) + '...' : 'Upload Media File'}</span>
              <input type="file" accept="image/*,audio/*" className="hidden" onChange={handleFileSelect} />
            </label>

            <button
              onClick={() => runImageAnalysis()}
              disabled={isAnalyzing || (!selectedFile && !selectedPresetId)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Running Forensics...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white text-white" />
                  <span>Execute Forensic Scan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setSubTab('image'); setResult(null); }}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'image'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold shadow-sm'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
            <span>AI Generated Images</span>
          </button>

          <button
            onClick={() => { setSubTab('audio'); runAudioSampleAnalysis('audio-sample-1'); }}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'audio'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold shadow-sm'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-rose-400" />
            <span>Voice Clone Audio</span>
          </button>

          <button
            onClick={() => { setSubTab('qr'); setResult(null); }}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'qr'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold shadow-sm'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            <span>QR Code Quishing</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: AI Image Forensics */}
      {subTab === 'image' && (
        <>
          {/* Quick Preset Samples Row */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Demo Presets &amp; Benchmark Samples:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {presets.map((p) => {
                const isSelected = selectedPresetId === p.id && !selectedFile;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePresetSelect(p)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-rose-500/50 shadow-md shadow-rose-500/10'
                        : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                        {p.category}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-200 mt-1 truncate">{p.name}</h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col items-center">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2 self-start font-display">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                Inspected Image Preview
              </h3>

              <div className="relative w-full max-h-[380px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[240px] shadow-inner">
                {previewUrl ? (
                  <img src={previewUrl} alt="Target" className="w-full h-full object-contain max-h-[360px]" />
                ) : (
                  <div className="p-12 text-center text-slate-500 text-xs font-mono">No image loaded.</div>
                )}
              </div>

              <button
                onClick={() => runImageAnalysis()}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Execute Image Deepfake Scan</span>
              </button>
            </div>

            <div className="lg:col-span-7 space-y-5">
              {result && result.probability_percent !== undefined ? (
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Synthetic Risk Gauge</span>
                      <span className="text-xs font-mono font-bold text-slate-300">Confidence: {result.confidence}%</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-4xl font-extrabold font-mono text-rose-400">{result.probability_percent}%</h3>
                      <span className="text-xs font-bold text-slate-200 uppercase px-2.5 py-0.5 rounded bg-slate-850 border border-slate-700">
                        {result.classification}
                      </span>
                    </div>
                    
                    {/* Visual Probability Bar */}
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-3">
                      <div
                        className={`h-full transition-all duration-700 ${
                          result.probability_percent >= 65
                            ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/50'
                            : result.probability_percent >= 40
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                            : 'bg-gradient-to-r from-blue-500 to-emerald-500'
                        }`}
                        style={{ width: `${result.probability_percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">Forensic Artifact Breakdown:</h4>
                    {result.artifacts && result.artifacts.map((art: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-200">{art.name}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase ${
                            art.status === 'flagged' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            art.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            Score: {art.score}/100
                          </span>
                        </div>
                        <p className="text-slate-400 font-mono text-[11px] leading-relaxed mt-1">{art.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs font-mono shadow-inner">
                  Click "Execute Image Deepfake Scan" to inspect synthetic neural features.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Sub-Tab 2: Audio Voice Clone Analysis */}
      {subTab === 'audio' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-display">
              <Mic className="w-4 h-4 text-rose-400" />
              Voice Clone &amp; Audio Deepfake Inspector
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => runAudioSampleAnalysis('audio-sample-1')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-rose-400 border border-rose-500/30 text-xs font-mono font-semibold transition-all cursor-pointer"
              >
                Sample 1: Synthetic Voice Clone
              </button>
              <button
                onClick={() => runAudioSampleAnalysis('audio-sample-2')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold transition-all cursor-pointer"
              >
                Sample 2: Real Human Voice
              </button>
            </div>
          </div>

          {result && result.probability_percent !== undefined && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-display font-bold">Audio Synthetic Risk Score</span>
                  <h3 className="text-3xl font-extrabold font-mono text-rose-400 mt-1">{result.probability_percent}%</h3>
                  <span className="text-xs text-slate-300 font-semibold">{result.classification}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">File: {result.filename}</span>
              </div>

              <div className="space-y-2">
                {result.artifacts && result.artifacts.map((art: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-200">{art.name}</span>
                    <p className="text-slate-400 font-mono text-[11px] mt-0.5">{art.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: QR Code Quishing Scanner */}
      {subTab === 'qr' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-display">
              <QrCode className="w-4 h-4 text-blue-400" />
              QR Code Quishing Payload Decoder
            </h3>
            <span className="text-xs text-slate-400">Upload a QR code image to decode target payload</span>
          </div>

          {result && result.qr_found !== undefined && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Extracted QR Payload:</span>
                <span className="text-blue-400 font-bold">{result.payload}</span>
              </div>

              {result.threat_assessment && (
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <p className="text-slate-300 font-sans">Threat Classification: <strong className="text-rose-400">{result.threat_assessment.classification}</strong></p>
                  <p className="text-slate-400 text-[11px] mt-1">Severity: {result.threat_assessment.severity.toUpperCase()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
