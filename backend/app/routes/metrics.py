from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db, ScanRecord
from app.schemas.scan import MetricsResponse

router = APIRouter(prefix="/metrics", tags=["Metrics"])

@router.get("", response_model=MetricsResponse)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_scans = db.query(ScanRecord).count()
    
    # Threats blocked: items where severity is not 'safe'
    threats_blocked = db.query(ScanRecord).filter(ScanRecord.severity != "safe").count()

    # Active alerts: critical & high severity threats
    active_alerts = db.query(ScanRecord).filter(ScanRecord.severity.in_(["high", "critical"])).count()

    threat_ratio = round((threats_blocked / total_scans * 100), 1) if total_scans > 0 else 0.0

    # Severity counts breakdown
    severity_rows = db.query(ScanRecord.severity, func.count(ScanRecord.id)).group_by(ScanRecord.severity).all()
    severity_counts = {sev: count for sev, count in severity_rows}
    for key in ["safe", "low", "medium", "high", "critical"]:
        if key not in severity_counts:
            severity_counts[key] = 0

    # Classification counts breakdown
    class_rows = db.query(ScanRecord.classification, func.count(ScanRecord.id)).group_by(ScanRecord.classification).all()
    classification_counts = {cls_name: count for cls_name, count in class_rows}

    return MetricsResponse(
        total_scans=total_scans,
        threats_blocked=threats_blocked,
        active_alerts=active_alerts,
        threat_ratio_percent=threat_ratio,
        trend_24h_change="+18.4% vs prev week",
        severity_counts=severity_counts,
        classification_counts=classification_counts
    )
