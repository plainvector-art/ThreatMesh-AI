export interface DeepfakePreset {
  id: string;
  name: string;
  category: string;
  image_url: string;
  expected_classification: string;
  description: string;
}

export interface DeepfakeResult {
  analysis_id: string;
  verdict: string;
  ai_probability: number;
  real_probability: number;
  confidence: string;
  classification: {
    ai_generated: boolean;
    ai_edited: boolean;
    deepfake: boolean;
    camera_origin_supported: boolean;
  };
  model_consensus: {
    providers_available: number;
    providers_agreeing: number;
    agreement: string;
  };
  providers: Array<{
    provider: string;
    available: boolean;
    ai_probability?: number;
    real_probability?: number;
    category?: string;
    latency_ms: number;
    error?: string;
  }>;
  provenance: {
    c2pa_present: boolean;
    c2pa_valid: boolean;
    creator?: string;
    software?: string;
    actions: string[];
    signature_status: string;
  };
  metadata: {
    has_exif: boolean;
    camera_make?: string;
    camera_model?: string;
    software?: string;
    creation_date?: string;
  };
  forensics: Array<{
    name: string;
    value: number;
  }>;
  image_quality: {
    low_quality: boolean;
    noise_level: number;
  };
  limitations: string[];
}
