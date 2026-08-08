import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { NavigationTabs, TabType } from './components/NavigationTabs';
import { HeroMetrics } from './components/HeroMetrics';
import { ScanInputBar } from './components/ScanInputBar';
import { LiveFeed } from './components/LiveFeed';
import { ThreatModal } from './components/ThreatModal';
import { DeepfakeDetector } from './components/DeepfakeDetector';
import { SecurityChatbot } from './components/SecurityChatbot';
import { SecurityAwareness } from './components/SecurityAwareness';
import { DashboardMetrics, ScanRecord } from './types';
import { fetchMetrics, fetchLiveFeed, submitNewScan, triggerTestAlert } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('threats');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingScans, setIsLoadingScans] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [m, s] = await Promise.all([fetchMetrics(), fetchLiveFeed()]);
      setMetrics(m);
      setScans(s);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoadingMetrics(false);
      setIsLoadingScans(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleScanSubmit = async (target: string, inputType: string) => {
    setIsScanning(true);
    setNotification(null);
    try {
      const newScan = await submitNewScan(target, inputType);
      setNotification({
        type: 'success',
        message: `Scan executed: ${newScan.classification} (${newScan.severity.toUpperCase()} severity)`
      });
      await loadData();
      setSelectedScan(newScan);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to process threat scan'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleTestAlert = async () => {
    try {
      const res = await triggerTestAlert();
      setNotification({
        type: 'success',
        message: `Test n8n Alert Payload Dispatched: ${res.message}`
      });
      await loadData();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to dispatch test alert'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        onRefresh={loadData}
        onTestAlert={handleTestAlert}
        isRefreshing={isRefreshing}
      />

      {/* 4-Tab Navigation Bar Switcher */}
      <NavigationTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Toast Notification Banner */}
        {notification && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-200 font-bold ml-4"
            >
              &times;
            </button>
          </div>
        )}

        {/* Tab 1: Threat Recognition & OSINT Mesh */}
        {activeTab === 'threats' && (
          <>
            <HeroMetrics metrics={metrics} isLoading={isLoadingMetrics} />
            <ScanInputBar onScanSubmit={handleScanSubmit} isScanning={isScanning} />
            <LiveFeed
              scans={scans}
              isLoading={isLoadingScans}
              onSelectScan={(scan) => setSelectedScan(scan)}
              selectedScanId={selectedScan?.id}
            />
          </>
        )}

        {/* Tab 2: Deepfake & Media Forensics */}
        {activeTab === 'deepfake' && <DeepfakeDetector />}

        {/* Tab 3: AI Security Assistant Chatbot */}
        {activeTab === 'chatbot' && <SecurityChatbot />}

        {/* Tab 4: Security Awareness & Intel Feed */}
        {activeTab === 'awareness' && <SecurityAwareness />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ThreatMesh AI &bull; Full-Spectrum Threat Intelligence Suite</span>
          <span className="font-mono text-[11px]">OpenCV Forensics &bull; AI Security Copilot &bull; Tavily OSINT &bull; n8n Webhooks</span>
        </div>
      </footer>

      {/* Threat Detail Modal Side-Panel Drawer */}
      <ThreatModal
        scan={selectedScan}
        onClose={() => setSelectedScan(null)}
      />
    </div>
  );
}

export default App;
