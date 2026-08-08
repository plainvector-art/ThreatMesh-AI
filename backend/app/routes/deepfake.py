from typing import List, Dict, Any, Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from pydantic import BaseModel
from app.services.deepfake_analyzer import deepfake_analyzer

router = APIRouter(prefix="/deepfake", tags=["Deepfake Detector"])

class SamplePreset(BaseModel):
    id: str
    name: str
    category: str
    image_url: str
    expected_classification: str
    description: str

@router.get("/samples", response_model=List[SamplePreset])
def get_sample_presets():
    return [
        SamplePreset(
            id="sample-1",
            name="Synthetic GAN Face Portrait",
            category="Deepfake Face",
            image_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80",
            expected_classification="AI Generated / Deepfake",
            description="High-resolution synthetic portrait generated via StyleGAN2 architecture with smoothed skin boundary artifacts."
        ),
        SamplePreset(
            id="sample-2",
            name="Midjourney v6 Conceptual Art",
            category="AI Diffusion",
            image_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80",
            expected_classification="AI Generated / Deepfake",
            description="Diffusion model scene with hyper-saturated lighting and spectral noise variance anomalies."
        ),
        SamplePreset(
            id="sample-3",
            name="Authentic Studio Photography",
            category="Real Photo",
            image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
            expected_classification="Authentic / Real Image",
            description="Genuine camera photograph with natural optical depth, grain structure, and standard EXIF metadata."
        )
    ]

@router.post("/analyze")
async def analyze_deepfake_file(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be a valid image (JPEG, PNG, WEBP)")
    
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    result = deepfake_analyzer.analyze_image(contents, filename=file.filename or "uploaded_image.png")
    return result

@router.post("/analyze-preset")
async def analyze_preset_image(preset_id: str = Form(...)):
    # Mock analysis for preset sample buttons for instant responsive UI demo
    presets_map = {
        "sample-1": {
            "filename": "synthetic_face_stylegan.png",
            "image_width": 1024,
            "image_height": 1024,
            "faces_detected": 1,
            "probability": 0.88,
            "probability_percent": 88.0,
            "classification": "AI Generated / Deepfake",
            "severity": "critical",
            "confidence": 94.2,
            "artifacts": [
                {
                    "name": "Facial Texture Smoothness",
                    "status": "flagged",
                    "score": 94,
                    "detail": "Sub-surface skin variance is unnaturally uniform (variance: 42.1). Matches StyleGAN2 boundary blending."
                },
                {
                    "name": "High-Frequency Spectral Noise",
                    "status": "warning",
                    "score": 86,
                    "detail": "Suppressed high-frequency grain structure in hair and iris regions."
                },
                {
                    "name": "Chromatic Saturation Profile",
                    "status": "passed",
                    "score": 38,
                    "detail": "Color saturation balance is within natural photographic range."
                },
                {
                    "name": "Camera Hardware Metadata (EXIF)",
                    "status": "warning",
                    "score": 75,
                    "detail": "No camera sensor EXIF tags present."
                }
            ],
            "laplacian_variance": 42.1,
            "mean_saturation": 112.4
        },
        "sample-2": {
            "filename": "midjourney_v6_diffusion.jpg",
            "image_width": 1280,
            "image_height": 720,
            "faces_detected": 0,
            "probability": 0.92,
            "probability_percent": 92.0,
            "classification": "AI Generated / Deepfake",
            "severity": "critical",
            "confidence": 96.5,
            "artifacts": [
                {
                    "name": "Chromatic Saturation Profile",
                    "status": "flagged",
                    "score": 96,
                    "detail": "Unnatural hyper-saturation detected (Mean S=178.4). Matches Midjourney v6 rendering profile."
                },
                {
                    "name": "High-Frequency Spectral Noise",
                    "status": "flagged",
                    "score": 90,
                    "detail": "Suppressed high-frequency noise variance (Laplacian: 88.2)."
                },
                {
                    "name": "Camera Hardware Metadata (EXIF)",
                    "status": "warning",
                    "score": 80,
                    "detail": "Missing camera hardware EXIF tags."
                }
            ],
            "laplacian_variance": 88.2,
            "mean_saturation": 178.4
        },
        "sample-3": {
            "filename": "authentic_portrait.jpg",
            "image_width": 1920,
            "image_height": 1080,
            "faces_detected": 1,
            "probability": 0.12,
            "probability_percent": 12.0,
            "classification": "Authentic / Real Image",
            "severity": "safe",
            "confidence": 98.0,
            "artifacts": [
                {
                    "name": "Facial Region Alignment",
                    "status": "passed",
                    "score": 15,
                    "detail": "Natural pores, micro-reflections, and skin texture variance confirmed."
                },
                {
                    "name": "High-Frequency Spectral Noise",
                    "status": "passed",
                    "score": 12,
                    "detail": "Natural optical lens grain and sensor noise present (variance: 342.6)."
                },
                {
                    "name": "Camera Hardware Metadata (EXIF)",
                    "status": "passed",
                    "score": 5,
                    "detail": "Valid camera hardware EXIF tags present (Canon EOS R5)."
                }
            ],
            "laplacian_variance": 342.6,
            "mean_saturation": 94.2
        }
    }

    if preset_id not in presets_map:
        raise HTTPException(status_code=404, detail="Preset sample not found")
    
    return presets_map[preset_id]
