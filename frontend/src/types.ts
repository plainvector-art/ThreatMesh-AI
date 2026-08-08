export type SeverityLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export interface ReasoningStep {
  step: number;
  title: string;
  status: 'passed' | 'warning' | 'flagged' | 'critical';
  detail: string;
}

export interface ScanRecord {
  id: string;
  input_target: string;
  input_type: 'url' | 'ip' | 'hash' | 'log';
  classification: string;
  severity: SeverityLevel;
  confidence: number;
  reasoning_trace: ReasoningStep[];
  tavily_context?: string | null;
  webhook_sent: boolean;
  webhook_status: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_scans: number;
  threats_blocked: number;
  active_alerts: number;
  threat_ratio_percent: number;
  trend_24h_change: string;
  severity_counts: Record<SeverityLevel, number>;
  classification_counts: Record<string, number>;
}
