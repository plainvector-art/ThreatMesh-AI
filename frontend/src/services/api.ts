import { ScanRecord, DashboardMetrics } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchMetrics(): Promise<DashboardMetrics> {
  const resp = await fetch(`${API_BASE}/metrics`);
  if (!resp.ok) {
    throw new Error('Failed to fetch metrics');
  }
  return resp.json();
}

export async function fetchLiveFeed(severity?: string): Promise<ScanRecord[]> {
  const url = severity ? `${API_BASE}/scans?severity=${severity}` : `${API_BASE}/scans`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('Failed to fetch live scan feed');
  }
  return resp.json();
}

export async function fetchScanById(id: string): Promise<ScanRecord> {
  const resp = await fetch(`${API_BASE}/scans/${id}`);
  if (!resp.ok) {
    throw new Error('Failed to fetch scan detail');
  }
  return resp.json();
}

export async function submitNewScan(inputTarget: string, inputType: string = 'auto'): Promise<ScanRecord> {
  const resp = await fetch(`${API_BASE}/scans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input_target: inputTarget, input_type: inputType })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to process scan' }));
    throw new Error(err.detail || 'Scan processing failed');
  }
  return resp.json();
}

export async function triggerTestAlert(): Promise<{ status: string; message: string }> {
  const resp = await fetch(`${API_BASE}/alerts/test`, { method: 'POST' });
  if (!resp.ok) {
    throw new Error('Failed to trigger test alert');
  }
  return resp.json();
}

export async function fetchDeepfakePresets(): Promise<any[]> {
  const resp = await fetch(`${API_BASE}/deepfake/samples`);
  if (!resp.ok) {
    throw new Error('Failed to fetch deepfake sample presets');
  }
  return resp.json();
}

export async function analyzeDeepfakeImageFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  const resp = await fetch(`${API_BASE}/deepfake/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to analyze deepfake image' }));
    throw new Error(err.detail || 'Deepfake analysis failed');
  }
  return resp.json();
}

export async function analyzeDeepfakePreset(presetId: string): Promise<any> {
  const formData = new FormData();
  formData.append('preset_id', presetId);
  const resp = await fetch(`${API_BASE}/deepfake/analyze-preset`, {
    method: 'POST',
    body: formData,
  });
  if (!resp.ok) {
    throw new Error('Failed to analyze preset image');
  }
  return resp.json();
}

export async function analyzeQRCode(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  const resp = await fetch(`${API_BASE}/qr/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!resp.ok) {
    throw new Error('Failed to decode QR code');
  }
  return resp.json();
}

export async function analyzeAudioSample(sampleId: string): Promise<any> {
  const formData = new FormData();
  formData.append('sample_id', sampleId);
  const resp = await fetch(`${API_BASE}/audio/analyze-sample`, {
    method: 'POST',
    body: formData,
  });
  if (!resp.ok) {
    throw new Error('Failed to analyze audio sample');
  }
  return resp.json();
}

export async function askSecurityChatbot(message: string): Promise<any> {
  const resp = await fetch(`${API_BASE}/chat/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if (!resp.ok) {
    throw new Error('Failed to send chatbot message');
  }
  return resp.json();
}

export async function fetchQuizzes(): Promise<any[]> {
  const resp = await fetch(`${API_BASE}/awareness/quizzes`);
  if (!resp.ok) {
    throw new Error('Failed to fetch quizzes');
  }
  return resp.json();
}

export async function fetchNews(): Promise<any[]> {
  const resp = await fetch(`${API_BASE}/awareness/news`);
  if (!resp.ok) {
    throw new Error('Failed to fetch news feed');
  }
  return resp.json();
}
