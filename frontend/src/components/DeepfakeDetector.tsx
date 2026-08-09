import React, { useState, useEffect } from 'react';
import { Upload, ImageIcon, Mic, QrCode, Play, AlertTriangle, ShieldCheck, Search, Activity, Cpu } from 'lucide-react';
import { analyzeDeepfakeImageFile as analyzeDeepfakeImage, analyzeDeepfakePreset, fetchDeepfakePresets } from '../services/api';
import { DeepfakePreset, DeepfakeResult } from '../deepfakeTypes';

export const DeepfakeDetector: React.FC = () => {
  const [subTab, setSubTab] = useState<'image' | 'audio' | 'qr'>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DeepfakeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [presets, setPresets] = useState<DeepfakePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

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
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResult(null);
    setError(null);
  };

  const runImageAnalysis = async (presetId?: string | null, file?: File | null) => {
    setIsScanning(true);
    setResult(null);
    setError(null);

    const targetPreset = presetId !== undefined ? presetId : selectedPresetId;
    const targetFile = file !== undefined ? file : selectedFile;

    try {
      let data;
      if (targetPreset) {
        data = await analyzeDeepfakePreset(targetPreset);
      } else if (targetFile) {
        data = await analyzeDeepfakeImage(targetFile);
      } else {
        return;
      }
      setResult(data as DeepfakeResult);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={() => setSubTab('image')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            subTab === 'image' ? 'bg-slate-800 text-blue-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Image Forensics
        </button>
      </div>

      {subTab === 'image' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4 font-display">
                <Upload className="w-4 h-4 text-blue-400" />
                Upload Custom Image
              </h3>
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center hover:border-slate-700 transition-colors bg-slate-900/50 cursor-pointer relative">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-500" />
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Drop image or <span className="text-blue-400 font-semibold">Browse</span>
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">JPEG, PNG, WEBP (Max 10MB)</div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4 font-display">
                <Search className="w-4 h-4 text-emerald-400" />
                Benchmark Samples
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {presets.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePresetSelect(p)}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-rose-500/50 shadow-md shadow-rose-500/10'
                          : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <img src={p.image_url} alt={p.name} className="w-full h-24 rounded-lg object-cover border border-slate-800 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-200 mt-2 truncate">{p.name}</h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

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
                disabled={isScanning}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                   <Activity className="w-4 h-4 animate-spin" />
                ) : (
                   <Play className="w-4 h-4 fill-white" />
                )}
                <span>{isScanning ? 'Executing Multi-Model Fusion...' : 'Execute Full Authenticity Scan'}</span>
              </button>
              {error && <div className="mt-4 text-xs text-rose-400 font-mono text-center">{error}</div>}
            </div>

            <div className="lg:col-span-7 space-y-5">
              {result ? (
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
                  {/* Verdict Header */}
                  <div className="border-b border-slate-800 pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Final Verdict</span>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        Confidence: <span className={result.confidence === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'}>{result.confidence}</span>
                      </span>
                    </div>
                    <div className="flex items-baseline gap-4 mt-2">
                      <h2 className={`text-3xl sm:text-4xl font-extrabold font-mono uppercase ${
                          result.verdict === 'AI_GENERATED' ? 'text-rose-500' :
                          result.verdict === 'REAL_CAMERA_PHOTO' ? 'text-emerald-500' :
                          result.verdict === 'AI_EDITED_OR_MANIPULATED' ? 'text-amber-500' :
                          'text-slate-400'
                      }`}>
                        {result.verdict.replace(/_/g, ' ')}
                      </h2>
                    </div>
                    <div className="mt-3 text-sm text-slate-400 flex items-center gap-2">
                        {result.verdict === 'AI_GENERATED' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        {result.verdict === 'REAL_CAMERA_PHOTO' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                        {result.verdict === 'UNCERTAIN' && <Search className="w-4 h-4 text-slate-400" />}
                        <span>AI Probability: <strong>{(result.ai_probability * 100).toFixed(1)}%</strong></span>
                    </div>
                  </div>

                  {/* Consensus & Evidence Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Model Consensus */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-display flex items-center gap-2">
                         <Cpu className="w-3 h-3" /> Model Consensus
                      </h4>
                      <p className="text-xs text-slate-300 font-mono">
                        <strong className="text-blue-400">{result.model_consensus.providers_agreeing}</strong> / {result.model_consensus.providers_available} detectors agree
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">Agreement: {result.model_consensus.agreement}</p>
                    </div>

                    {/* Provenance */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">Provenance (C2PA)</h4>
                      {result.provenance.c2pa_present ? (
                        <>
                           <p className="text-xs text-emerald-400 font-mono font-semibold">Present & {result.provenance.signature_status}</p>
                           {result.provenance.software && <p className="text-[10px] text-slate-400 mt-1 truncate">Tool: {result.provenance.software}</p>}
                        </>
                      ) : (
                        <p className="text-xs text-slate-500 font-mono">Not found</p>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">Metadata (EXIF)</h4>
                      {result.metadata.has_exif ? (
                        <>
                           <p className="text-xs text-slate-300 font-mono">Available</p>
                           {result.metadata.camera_make && <p className="text-[10px] text-slate-400 mt-1 truncate">{result.metadata.camera_make} {result.metadata.camera_model}</p>}
                        </>
                      ) : (
                        <p className="text-xs text-slate-500 font-mono">Not available or stripped</p>
                      )}
                    </div>

                    {/* Forensics */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">Forensics</h4>
                      <ul className="text-xs text-slate-300 font-mono space-y-1">
                        {result.forensics.map((f, i) => (
                           <li key={i} className="flex justify-between">
                              <span className="text-slate-400">{f.name}:</span>
                              <span>{f.value}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Detectors Breakdown */}
                  <div>
                     <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 font-display border-b border-slate-800 pb-2">Provider Breakdown & Health</h4>
                     <div className="space-y-2">
                        {result.providers.map((p, idx) => (
                           <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                              <div className="flex items-center gap-3">
                                 <span className="font-semibold text-slate-200 capitalize w-24">{p.provider.replace('_', ' ')}</span>
                                 {p.available ? (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                                 ) : (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">FAILED</span>
                                 )}
                              </div>
                              {p.available ? (
                                 <div className="flex items-center gap-4 text-slate-400">
                                    <span>AI: <strong className={p.ai_probability! > 0.5 ? 'text-rose-400' : 'text-slate-300'}>{(p.ai_probability! * 100).toFixed(0)}%</strong></span>
                                    <span className="text-slate-500">{p.latency_ms}ms</span>
                                 </div>
                              ) : (
                                 <span className="text-rose-400 text-[10px] truncate max-w-[120px]">{p.error}</span>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Limitations */}
                  {result.limitations.length > 0 && (
                     <div className="mt-4 pt-4 border-t border-slate-800">
                        <p className="text-[10px] text-slate-500 italic">
                           * {result.limitations[0]}
                        </p>
                     </div>
                  )}

                </div>
              ) : (
                <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs font-mono shadow-inner h-full flex items-center justify-center min-h-[300px]">
                  Select an image and execute scan to view multi-model authenticity analysis.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
