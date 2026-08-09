import pytest
import os
import json
from app.core_engine.fusion import EvidenceFusionEngine

@pytest.fixture
def fusion_engine():
    return EvidenceFusionEngine()

@pytest.fixture
def benchmark_data():
    fixtures_dir = os.path.join(os.path.dirname(__file__), "fixtures", "image_detection")
    manifest_path = os.path.join(fixtures_dir, "manifest.json")
    with open(manifest_path, "r") as f:
        manifest = json.load(f)
    return manifest, fixtures_dir

def get_image_bytes(fixtures_dir, filename):
    with open(os.path.join(fixtures_dir, filename), "rb") as f:
        return f.read()

def test_fusion_engine_no_models(fusion_engine, monkeypatch):
    def mock_analyze(self, image_bytes, filename):
        return {"available": False, "error": "FAILED"}

    from app.services.detectors.providers import SightengineProvider, HiveProvider
    from app.services.detectors.local_ml_provider import LocalMLProvider

    monkeypatch.setattr(SightengineProvider, "analyze", mock_analyze)
    monkeypatch.setattr(HiveProvider, "analyze", mock_analyze)
    monkeypatch.setattr(LocalMLProvider, "analyze", mock_analyze)

    from app.services.forensics import PixelForensics
    monkeypatch.setattr(PixelForensics, "analyze", lambda s, b: {"is_low_quality": False, "laplacian_variance": 100, "mean_saturation": 100, "noise_level": 10})

    result = fusion_engine.analyze(b"fakebytes", "test.jpg")

    assert result["verdict"] == "DETECTION_UNAVAILABLE"
    assert result["confidence"] == "NONE"

def test_regression_image_a(fusion_engine, benchmark_data):
    manifest, fixtures_dir = benchmark_data
    ai_item = next(item for item in manifest if item["ground_truth"] == "AI_GENERATED")
    image_bytes = get_image_bytes(fixtures_dir, ai_item["path"])

    result = fusion_engine.analyze(image_bytes, ai_item["path"])

    assert "verdict" in result
    assert "ai_probability" in result
    assert result["classification"]["ai_generated"] in [True, False]
    assert len(result["providers"]) == 3

def test_regression_image_b(fusion_engine, benchmark_data):
    manifest, fixtures_dir = benchmark_data
    real_item = next(item for item in manifest if item["ground_truth"] == "REAL_CAMERA_PHOTO")
    image_bytes = get_image_bytes(fixtures_dir, real_item["path"])

    result = fusion_engine.analyze(image_bytes, real_item["path"])

    assert "verdict" in result
    assert result["ai_probability"] >= 0.0
    assert result["real_probability"] >= 0.0
    assert "model_consensus" in result
