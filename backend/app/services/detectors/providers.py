import requests
import time
from typing import Dict, Any, Optional
from app.config import settings
from app.services.detectors import ImageDetectionProvider

class SightengineProvider(ImageDetectionProvider):
    def analyze(self, image_bytes: bytes, filename: str) -> Dict[str, Any]:
        if not settings.SIGHTENGINE_API_USER or not settings.SIGHTENGINE_API_SECRET:
            return {
                "provider": "sightengine",
                "available": False,
                "error": "PROVIDER_NOT_CONFIGURED",
                "latency_ms": 0
            }

        start_time = time.time()
        try:
            response = requests.post(
                'https://api.sightengine.com/1.0/check.json',
                files={'media': (filename, image_bytes)},
                data={
                    'models': 'genai',
                    'api_user': settings.SIGHTENGINE_API_USER,
                    'api_secret': settings.SIGHTENGINE_API_SECRET
                },
                timeout=settings.DETECTION_TIMEOUT
            )
            latency = int((time.time() - start_time) * 1000)

            if response.status_code == 200:
                data = response.json()
                if "type" in data and "ai_generated" in data["type"]:
                    ai_prob = data["type"]["ai_generated"]
                    real_prob = 1.0 - ai_prob
                    return {
                        "provider": "sightengine",
                        "available": True,
                        "ai_probability": ai_prob,
                        "real_probability": real_prob,
                        "category": "AI_GENERATED" if ai_prob >= settings.DETECTION_THRESHOLD else "REAL",
                        "latency_ms": latency,
                        "model_version": "sightengine_genai_1.0",
                        "raw_response_stored": True,
                        "raw_data": data
                    }
            return {
                "provider": "sightengine",
                "available": False,
                "error": "API_ERROR",
                "latency_ms": latency
            }
        except Exception as e:
            latency = int((time.time() - start_time) * 1000)
            return {
                "provider": "sightengine",
                "available": False,
                "error": str(e),
                "latency_ms": latency
            }

class HiveProvider(ImageDetectionProvider):
    def analyze(self, image_bytes: bytes, filename: str) -> Dict[str, Any]:
        # Hive is currently a placeholder and the exact parsing logic is unverified.
        # Strict PRD requirements dictate returning PROVIDER_NOT_IMPLEMENTED_OR_CONFIGURED
        # rather than fabricating a probability.
        return {
            "provider": "hive",
            "available": False,
            "error": "PROVIDER_NOT_IMPLEMENTED_OR_CONFIGURED",
            "latency_ms": 0
        }
