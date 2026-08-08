export interface DeepfakeArtifact {
  name: string;
  status: 'passed' | 'warning' | 'flagged' | 'critical' | 'analyzed';
  score: number;
  detail: string;
}

export interface DeepfakeAnalysisResult {
  filename: string;
  image_width: number;
  image_height: number;
  faces_detected: number;
  probability: number;
  probability_percent: number;
  classification: string;
  severity: 'safe' | 'medium' | 'critical';
  confidence: number;
  artifacts: DeepfakeArtifact[];
  laplacian_variance?: number;
  mean_saturation?: number;
}

export interface DeepfakePreset {
  id: string;
  name: string;
  category: string;
  image_url: string;
  expected_classification: string;
  description: string;
}
