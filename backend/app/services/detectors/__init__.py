from abc import ABC, abstractmethod
from typing import Dict, Any

class ImageDetectionProvider(ABC):
    @abstractmethod
    def analyze(self, image_bytes: bytes, filename: str) -> Dict[str, Any]:
        pass
