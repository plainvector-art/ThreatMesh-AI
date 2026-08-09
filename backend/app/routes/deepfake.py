from typing import List, Dict, Any, Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from pydantic import BaseModel
from app.core_engine.fusion import EvidenceFusionEngine
import urllib.request

router = APIRouter(prefix="/deepfake", tags=["Deepfake Detector"])
fusion_engine = EvidenceFusionEngine()

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
            expected_classification="AI_GENERATED",
            description="High-resolution synthetic portrait generated via StyleGAN2 architecture with smoothed skin boundary artifacts."
        ),
        SamplePreset(
            id="sample-2",
            name="Midjourney v6 Conceptual Art",
            category="AI Diffusion",
            image_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80",
            expected_classification="AI_GENERATED",
            description="Diffusion model scene with hyper-saturated lighting and spectral noise variance anomalies."
        ),
        SamplePreset(
            id="sample-3",
            name="Authentic Studio Photography",
            category="Real Photo",
            image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
            expected_classification="REAL_CAMERA_PHOTO",
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

    result = fusion_engine.analyze(contents, file.filename or "uploaded_image.png")
    return result

@router.post("/analyze-preset")
async def analyze_preset_image(preset_id: str = Form(...)):
    samples = get_sample_presets()
    target_sample = next((s for s in samples if s.id == preset_id), None)
    
    if not target_sample:
        raise HTTPException(status_code=404, detail="Preset sample not found")

    try:
        req = urllib.request.Request(target_sample.image_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            image_bytes = response.read()

        result = fusion_engine.analyze(image_bytes, f"{preset_id}.jpg")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch and analyze preset image: {str(e)}")
