from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from app.services.audio_analyzer import audio_analyzer

router = APIRouter(prefix="/audio", tags=["Audio Deepfake Detector"])

@router.post("/analyze")
async def analyze_audio_file(file: UploadFile = File(...)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Audio file is empty")

    result = audio_analyzer.analyze_audio(contents, filename=file.filename or "voice.wav")
    return result

@router.post("/analyze-sample")
async def analyze_audio_sample(sample_id: str = Form(...)):
    samples_map = {
        "audio-sample-1": {
            "filename": "synthetic_executive_clone.wav",
            "file_size_kb": 320.5,
            "probability": 0.91,
            "probability_percent": 91.0,
            "classification": "Synthetic Voice Clone / AI Audio Deepfake",
            "severity": "critical",
            "confidence": 95.4,
            "artifacts": [
                {
                    "name": "Robotic Pitch & Fundamental Frequency (F0) Constancy",
                    "status": "flagged",
                    "score": 94,
                    "detail": "Unnatural pitch stability (StdDev: 14.2). Lacks human vocal cord micro-tremors."
                },
                {
                    "name": "Neural Vocoder Phase Inconsistency",
                    "status": "flagged",
                    "score": 88,
                    "detail": "High-frequency phase distortion matching ElevenLabs neural audio synthesis."
                },
                {
                    "name": "Environmental Ambient Noise Floor",
                    "status": "passed",
                    "score": 20,
                    "detail": "Clean noise floor profile."
                }
            ]
        },
        "audio-sample-2": {
            "filename": "authentic_phone_call.wav",
            "file_size_kb": 512.0,
            "probability": 0.08,
            "probability_percent": 8.0,
            "classification": "Authentic Human Voice",
            "severity": "safe",
            "confidence": 98.5,
            "artifacts": [
                {
                    "name": "Robotic Pitch & Fundamental Frequency (F0) Constancy",
                    "status": "passed",
                    "score": 10,
                    "detail": "Natural vocal pitch modulation and fundamental frequency dynamics."
                },
                {
                    "name": "Neural Vocoder Phase Inconsistency",
                    "status": "passed",
                    "score": 8,
                    "detail": "Acoustic phase continuity matches natural human vocal tract resonance."
                }
            ]
        }
    }

    if sample_id not in samples_map:
        raise HTTPException(status_code=404, detail="Audio sample not found")

    return samples_map[sample_id]
