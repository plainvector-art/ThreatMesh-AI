from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ScanRequest(BaseModel):
    input_target: str = Field(..., description="URL, IP address, file hash, or log snippet to scan")
    input_type: Optional[str] = Field("auto", description="url, ip, hash, log, or auto")
    force_tavily: Optional[bool] = Field(False, description="Force Tavily web context search even if safe")

class ScanResponse(BaseModel):
    id: str
    input_target: str
    input_type: str
    classification: str
    severity: str
    confidence: float
    reasoning_trace: List[Dict[str, Any]]
    tavily_context: Optional[str] = None
    webhook_sent: bool
    webhook_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class MetricsResponse(BaseModel):
    total_scans: int
    threats_blocked: int
    active_alerts: int
    threat_ratio_percent: float
    trend_24h_change: str
    severity_counts: Dict[str, int]
    classification_counts: Dict[str, int]
