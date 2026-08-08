from fastapi import APIRouter
from app.services.n8n_service import n8n_service

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.post("/test")
def trigger_test_alert():
    mock_scan = {
        "id": "test-alert-001",
        "input_target": "http://phishing-bank-verify-login.xyz/update",
        "input_type": "url",
        "classification": "Phishing Site",
        "severity": "critical",
        "confidence": 98.5,
        "reasoning_trace": [
            {"step": 1, "title": "Ingestion", "status": "passed", "detail": "Parsed target URL"},
            {"step": 2, "title": "Heuristics", "status": "flagged", "detail": "Suspicious TLD '.xyz' and keyword 'verify'"}
        ],
        "tavily_context": "[Tavily Intelligence] Known phishing domain targeting retail banking credentials.",
        "created_at": "2026-08-08T10:30:00Z"
    }
    result = n8n_service.trigger_alert_webhook(mock_scan)
    return result
