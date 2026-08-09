import time
import io
import torch
from typing import Dict, Any
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification
from app.config import settings
from app.services.detectors import ImageDetectionProvider
import logging

logger = logging.getLogger(__name__)

class LocalMLProvider(ImageDetectionProvider):
    def __init__(self):
        self.model_name = "dima806/deepfake_vs_real_image_detection"
        self.processor = None
        self.model = None
        self.available = False
        self._load_model()

    def _load_model(self):
        try:
            self.processor = AutoImageProcessor.from_pretrained(self.model_name)
            self.model = AutoModelForImageClassification.from_pretrained(self.model_name)
            self.model.eval()
            self.available = True
            logger.info(f"Loaded local ML model {self.model_name}")
        except Exception as e:
            logger.error(f"Failed to load local ML model {self.model_name}: {e}")
            self.available = False

    def analyze(self, image_bytes: bytes, filename: str) -> Dict[str, Any]:
        if not self.available:
            return {
                "provider": "local_ml",
                "available": False,
                "error": "LOCAL_MODEL_UNAVAILABLE",
                "latency_ms": 0
            }

        start_time = time.time()
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            inputs = self.processor(images=image, return_tensors="pt")

            with torch.no_grad():
                outputs = self.model(**inputs)

            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=-1)

            # id2label mapping is {0: 'Real', 1: 'Fake'}
            real_prob = float(probs[0, 0].item())
            ai_prob = float(probs[0, 1].item())

            latency = int((time.time() - start_time) * 1000)
            return {
                "provider": "local_ml",
                "available": True,
                "ai_probability": ai_prob,
                "real_probability": real_prob,
                "category": "AI_GENERATED" if ai_prob >= settings.DETECTION_THRESHOLD else "REAL",
                "latency_ms": latency,
                "model_version": self.model_name,
                "raw_response_stored": False
            }
        except Exception as e:
            latency = int((time.time() - start_time) * 1000)
            return {
                "provider": "local_ml",
                "available": False,
                "error": str(e),
                "latency_ms": latency
            }
