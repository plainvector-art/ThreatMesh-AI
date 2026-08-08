import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db, ScanRecord
from app.schemas.scan import ScanRequest, ScanResponse
from app.core_engine.scoring_engine import ScoringEngine
from app.services.tavily_service import tavily_service
from app.services.n8n_service import n8n_service

router = APIRouter(prefix="/scans", tags=["Scans"])
scoring_engine = ScoringEngine()

@router.post("", response_model=ScanResponse)
def create_scan(req: ScanRequest, db: Session = Depends(get_db)):
    target = req.input_target.strip()
    if not target:
        raise HTTPException(status_code=400, detail="input_target cannot be empty")

    # 1. Run core detection engine
    res = scoring_engine.process(input_target=target, input_type=req.input_type or "auto")

    classification = res["classification"]
    severity = res["severity"]
    confidence = res["confidence"]
    reasoning_trace = res["reasoning_trace"]
    input_type = res["input_type"]

    # 2. Fetch Tavily Live Web Context for non-benign results (or if forced)
    tavily_context = None
    if severity != "safe" or req.force_tavily:
        tavily_context = tavily_service.fetch_live_web_context(
            input_target=target,
            classification=classification,
            severity=severity
        )

    # 3. Create database record
    scan_rec = ScanRecord(
        input_target=target,
        input_type=input_type,
        classification=classification,
        severity=severity,
        confidence=confidence,
        tavily_context=tavily_context,
        webhook_sent=False,
        webhook_status="none"
    )
    scan_rec.reasoning_trace = reasoning_trace

    db.add(scan_rec)
    db.commit()
    db.refresh(scan_rec)

    # 4. Trigger n8n Incident Response Webhook for high & critical severity
    if severity in ["high", "critical"]:
        scan_dict = {
            "id": scan_rec.id,
            "input_target": scan_rec.input_target,
            "input_type": scan_rec.input_type,
            "classification": scan_rec.classification,
            "severity": scan_rec.severity,
            "confidence": scan_rec.confidence,
            "reasoning_trace": scan_rec.reasoning_trace,
            "tavily_context": scan_rec.tavily_context,
            "created_at": scan_rec.created_at.isoformat()
        }
        alert_res = n8n_service.trigger_alert_webhook(scan_dict)
        scan_rec.webhook_sent = alert_res.get("sent", False)
        scan_rec.webhook_status = alert_res.get("status", "failed")
        db.commit()
        db.refresh(scan_rec)

    return scan_rec


@router.get("", response_model=List[ScanResponse])
def list_scans(
    limit: int = Query(50, ge=1, le=200),
    severity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ScanRecord)
    if severity:
        query = query.filter(ScanRecord.severity == severity)
    
    scans = query.order_by(ScanRecord.created_at.desc()).limit(limit).all()
    return scans


@router.get("/{scan_id}", response_model=ScanResponse)
def get_scan_detail(scan_id: str, db: Session = Depends(get_db)):
    scan = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")
    return scan
