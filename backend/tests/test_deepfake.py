import pytest
import os
import urllib.request
from app.core_engine.fusion import EvidenceFusionEngine

@pytest.fixture
def fusion_engine():
    return EvidenceFusionEngine()

def fetch_image(url: str) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return response.read()

def test_fusion_engine_no_models(fusion_engine, monkeypatch):
    def mock_analyze(self, image_bytes, filename):
        return {"available": False, "error": "FAILED"}

    # Mock out providers to fail
    from app.services.detectors.providers import SightengineProvider, HiveProvider
    from app.services.detectors.local_ml_provider import LocalMLProvider

    monkeypatch.setattr(SightengineProvider, "analyze", mock_analyze)
    monkeypatch.setattr(HiveProvider, "analyze", mock_analyze)
    monkeypatch.setattr(LocalMLProvider, "analyze", mock_analyze)

    # Needs to be a valid small image so PIL doesn't crash during pixel forensics
    # Or we can just mock pixel forensics too
    from app.services.forensics import PixelForensics
    monkeypatch.setattr(PixelForensics, "analyze", lambda s, b: {"is_low_quality": False, "laplacian_variance": 100, "mean_saturation": 100, "noise_level": 10})

    result = fusion_engine.analyze(b"fakebytes", "test.jpg")

    assert result["verdict"] == "DETECTION_UNAVAILABLE"
    assert result["confidence"] == "NONE"

def test_regression_image_a(fusion_engine):
    # Test Image A: AI Portrait
    url = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80"
    image_bytes = fetch_image(url)

    result = fusion_engine.analyze(image_bytes, "ai_portrait.jpg")

    assert "verdict" in result
    assert "ai_probability" in result
    # We expect some sort of classification, checking schema adherence
    assert result["classification"]["ai_generated"] in [True, False]
    assert len(result["providers"]) == 3

def test_regression_image_b(fusion_engine):
    # Test Image B: Real Photo
    url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80"
    image_bytes = fetch_image(url)

    result = fusion_engine.analyze(image_bytes, "real_photo.jpg")

    assert "verdict" in result
    assert result["ai_probability"] >= 0.0
    assert result["real_probability"] >= 0.0
    assert "model_consensus" in result
