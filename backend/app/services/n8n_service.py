import logging
import requests
from typing import Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

class N8NService:
    def trigger_alert_webhook(self, scan_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send formatted incident response payload to n8n webhook URL.
        """
        webhook_url = settings.N8N_WEBHOOK_URL.strip()

        payload = {
            "event": "CRITICAL_THREAT_DETECTED",
            "source": "ThreatMesh AI Engine",
            "scan_id": scan_data.get("id"),
            "target": scan_data.get("input_target"),
            "input_type": scan_data.get("input_type"),
            "classification": scan_data.get("classification"),
            "severity": scan_data.get("severity"),
            "confidence_percent": scan_data.get("confidence"),
            "reasoning_trace": scan_data.get("reasoning_trace", []),
            "tavily_web_context": scan_data.get("tavily_context"),
            "timestamp": scan_data.get("created_at")
        }

        if not webhook_url:
            logger.info(f"n8n webhook URL unconfigured. Mock alert payload simulated for target {scan_data.get('input_target')}.")
            return {
                "sent": True,
                "status": "mock_delivered",
                "message": "n8n Webhook simulated successfully (N8N_WEBHOOK_URL environment variable unconfigured)"
            }

        try:
            resp = requests.post(webhook_url, json=payload, timeout=5)
            if resp.status_code in [200, 201, 202, 204]:
                return {
                    "sent": True,
                    "status": "delivered",
                    "response_code": resp.status_code,
                    "message": "Incident alert payload successfully dispatched to n8n webhook."
                }
            else:
                return {
                    "sent": False,
                    "status": "failed",
                    "response_code": resp.status_code,
                    "message": f"n8n webhook returned non-200 status code: {resp.status_code}"
                }
        except Exception as e:
            logger.error(f"n8n webhook call error: {e}")
            return {
                "sent": False,
                "status": "error",
                "message": f"Webhook dispatch error: {str(e)}"
            }

n8n_service = N8NService()
