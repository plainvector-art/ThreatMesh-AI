from typing import Dict, Any, List
import uuid
import hashlib
import json
from app.services.detectors.providers import SightengineProvider, HiveProvider
from app.services.detectors.local_ml_provider import LocalMLProvider
from app.services.forensics import C2PAAnalyzer, MetadataAnalyzer, PixelForensics
from app.database import SessionLocal, ImageRecord, ImageAnalysis, ModelRun, ForensicSignal, ProvenanceRecord
import logging

logger = logging.getLogger(__name__)

class EvidenceFusionEngine:
    def __init__(self):
        self.providers = [
            SightengineProvider(),
            HiveProvider(),
            LocalMLProvider()
        ]
        self.c2pa_analyzer = C2PAAnalyzer()
        self.metadata_analyzer = MetadataAnalyzer()
        self.pixel_forensics = PixelForensics()

    def _determine_verdict(self,
                           ai_probs: List[float],
                           real_probs: List[float],
                           c2pa_data: Dict[str, Any],
                           metadata: Dict[str, Any],
                           is_low_quality: bool) -> Dict[str, Any]:

        # If no models are available
        if not ai_probs:
            return {
                "verdict": "DETECTION_UNAVAILABLE",
                "ai_probability": 0.0,
                "real_probability": 0.0,
                "confidence": "NONE"
            }

        # Quality Gate
        if is_low_quality:
            return {
                "verdict": "LOW_INFORMATION_IMAGE",
                "ai_probability": sum(ai_probs)/len(ai_probs),
                "real_probability": sum(real_probs)/len(real_probs),
                "confidence": "LOW"
            }

        # Provenance takes precedence if cryptographically valid
        if c2pa_data.get("c2pa_present") and c2pa_data.get("c2pa_valid"):
            if "ai_generated" in c2pa_data.get("actions", []) or any("AI" in a for a in c2pa_data.get("actions", [])):
                return {
                    "verdict": "AI_GENERATED",
                    "ai_probability": 0.99,
                    "real_probability": 0.01,
                    "confidence": "HIGH"
                }
            if c2pa_data.get("creator") or c2pa_data.get("camera_make"): # Valid origin
                return {
                    "verdict": "REAL_CAMERA_PHOTO",
                    "ai_probability": 0.01,
                    "real_probability": 0.99,
                    "confidence": "HIGH"
                }

        # Model Ensemble
        avg_ai = sum(ai_probs) / len(ai_probs)
        avg_real = sum(real_probs) / len(real_probs)

        # Calculate agreement
        std_dev = (sum((p - avg_ai) ** 2 for p in ai_probs) / len(ai_probs)) ** 0.5 if len(ai_probs) > 1 else 0
        agreement_high = std_dev < 0.15

        if avg_ai > 0.75:
            verdict = "AI_GENERATED"
            confidence = "HIGH" if agreement_high else "MEDIUM"
        elif avg_ai > 0.40:
            # We don't have a specific deepfake or edit model integrated, so we use thresholding for edited suspicion
            verdict = "AI_EDITED_OR_MANIPULATED" if agreement_high else "UNCERTAIN"
            confidence = "MEDIUM"
        elif avg_ai < 0.20:
            verdict = "REAL_CAMERA_PHOTO"
            confidence = "HIGH" if agreement_high else "MEDIUM"
        else:
            verdict = "UNCERTAIN"
            confidence = "LOW"

        return {
            "verdict": verdict,
            "ai_probability": avg_ai,
            "real_probability": avg_real,
            "confidence": confidence
        }

    def _get_mime_type(self, image_bytes: bytes) -> str:
        if image_bytes.startswith(b'\xff\xd8'):
            return "image/jpeg"
        elif image_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
            return "image/png"
        elif image_bytes.startswith(b'RIFF') and image_bytes[8:12] == b'WEBP':
            return "image/webp"
        return "application/octet-stream"

    def analyze(self, image_bytes: bytes, filename: str) -> Dict[str, Any]:
        FUSION_POLICY_VERSION = "1.0"
        local_model_version = self.providers[2].model_name

        # Cache key considers image hash, local model version, and fusion policy version
        image_hash = hashlib.sha256(image_bytes).hexdigest()
        cache_key_string = f"{image_hash}_{local_model_version}_{FUSION_POLICY_VERSION}"
        sha256 = hashlib.sha256(cache_key_string.encode()).hexdigest()
        db = SessionLocal()

        try:
            # Deduplication: Check if image was already analyzed
            existing_image = db.query(ImageRecord).filter(ImageRecord.sha256 == sha256).first()
            if existing_image:
                existing_analysis = db.query(ImageAnalysis).filter(ImageAnalysis.image_id == existing_image.id).first()
                if existing_analysis:
                    # Return cached result structure (Simplified reconstruction for the endpoint)
                    # In a full implementation we would fetch and construct the exact schema from DB records
                    # Here we return a minimal valid cached schema but typically we'd recreate the full JSON

                    # Fetching supporting records to rebuild response
                    model_runs = db.query(ModelRun).filter(ModelRun.analysis_id == existing_analysis.id).all()
                    provider_results = []
                    for run in model_runs:
                        provider_results.append({
                            "provider": run.provider,
                            "available": run.status == "success",
                            "ai_probability": run.ai_probability,
                            "real_probability": run.real_probability,
                            "latency_ms": run.latency_ms,
                            "model_version": run.model_version
                        })

                    prov = db.query(ProvenanceRecord).filter(ProvenanceRecord.analysis_id == existing_analysis.id).first()
                    c2pa_result = {
                        "c2pa_present": prov.c2pa_present if prov else False,
                        "c2pa_valid": prov.c2pa_valid if prov else False,
                        "creator": prov.creator if prov else None,
                        "software": prov.software if prov else None,
                        "actions": json.loads(prov.actions) if prov and prov.actions else [],
                        "signature_status": prov.signature_status if prov else "none"
                    }

                    signals = db.query(ForensicSignal).filter(ForensicSignal.analysis_id == existing_analysis.id).all()
                    pixel_result = {"laplacian_variance": 0.0, "mean_saturation": 0.0, "noise_level": 0.0, "is_low_quality": False}
                    for sig in signals:
                        if sig.signal_type == "laplacian_variance": pixel_result["laplacian_variance"] = sig.value
                        if sig.signal_type == "mean_saturation": pixel_result["mean_saturation"] = sig.value
                        if sig.signal_type == "noise_level": pixel_result["noise_level"] = sig.value
                        if sig.signal_type == "is_low_quality": pixel_result["is_low_quality"] = bool(sig.value)

                    models_agreeing = 0
                    providers_available = sum(1 for p in provider_results if p.get("available"))
                    if existing_analysis.verdict in ["AI_GENERATED", "AI_EDITED_OR_MANIPULATED"]:
                        models_agreeing = sum(1 for p in provider_results if (p.get("ai_probability") is not None and p.get("ai_probability") > 0.5))
                    elif existing_analysis.verdict == "REAL_CAMERA_PHOTO":
                        models_agreeing = sum(1 for p in provider_results if (p.get("ai_probability") is not None and p.get("ai_probability") < 0.5))

                    return {
                        "analysis_id": existing_analysis.id,
                        "verdict": existing_analysis.verdict,
                        "ai_probability": existing_analysis.ai_probability,
                        "real_probability": existing_analysis.real_probability,
                        "confidence": existing_analysis.confidence,
                        "classification": {
                            "ai_generated": existing_analysis.verdict == "AI_GENERATED",
                            "ai_edited": existing_analysis.verdict == "AI_EDITED_OR_MANIPULATED",
                            "deepfake": False,
                            "camera_origin_supported": False # Simplified for cache reconstruction
                        },
                        "model_consensus": {
                            "providers_available": providers_available,
                            "providers_agreeing": models_agreeing,
                            "agreement": "HIGH" if providers_available > 0 and models_agreeing == providers_available else ("MEDIUM" if models_agreeing > 0 else "LOW")
                        },
                        "providers": provider_results,
                        "provenance": c2pa_result,
                        "metadata": {"has_exif": False}, # Simplified for cache reconstruction
                        "forensics": [
                            {"name": "Laplacian Variance", "value": pixel_result["laplacian_variance"]},
                            {"name": "Mean Saturation", "value": pixel_result["mean_saturation"]}
                        ],
                        "image_quality": {
                            "low_quality": pixel_result["is_low_quality"],
                            "noise_level": pixel_result["noise_level"]
                        },
                        "limitations": ["Cached result. Detection is probabilistic."],
                        "model_versions": []
                    }

            # Not found in cache, run full analysis
            analysis_id = str(uuid.uuid4())

            # Run Forensics
            c2pa_result = self.c2pa_analyzer.analyze(image_bytes, filename)
            metadata_result = self.metadata_analyzer.analyze(image_bytes)
            pixel_result = self.pixel_forensics.analyze(image_bytes)

            # Run Providers
            provider_results = []
            ai_probs = []
            real_probs = []

            for provider in self.providers:
                res = provider.analyze(image_bytes, filename)
                provider_results.append(res)
                if res.get("available") and "ai_probability" in res:
                    ai_probs.append(res["ai_probability"])
                    real_probs.append(res["real_probability"])

            # Fusion
            fusion = self._determine_verdict(
                ai_probs,
                real_probs,
                c2pa_result,
                metadata_result,
                pixel_result.get("is_low_quality", False)
            )

            # Save to Database
            if not existing_image:
                mime = self._get_mime_type(image_bytes)
                image_record = ImageRecord(
                    sha256=sha256,
                    filename=filename,
                    mime_type=mime,
                    size=len(image_bytes)
                )
                db.add(image_record)
                db.commit()
                db.refresh(image_record)
                image_id = image_record.id
            else:
                image_id = existing_image.id

            analysis_record = ImageAnalysis(
                id=analysis_id,
                image_id=image_id,
                status="completed",
                verdict=fusion["verdict"],
                ai_probability=fusion["ai_probability"],
                real_probability=fusion["real_probability"],
                confidence=fusion["confidence"]
            )
            db.add(analysis_record)

            for provider_res in provider_results:
                run = ModelRun(
                    analysis_id=analysis_id,
                    provider=provider_res.get("provider", "unknown"),
                    model_name="unknown", # specific models handled inside providers
                    model_version=provider_res.get("model_version", "unknown"),
                    ai_probability=provider_res.get("ai_probability"),
                    real_probability=provider_res.get("real_probability"),
                    latency_ms=provider_res.get("latency_ms"),
                    status="success" if provider_res.get("available") else "failed",
                    raw_response_reference=json.dumps(provider_res.get("raw_data")) if provider_res.get("raw_data") else None
                )
                db.add(run)

            for k, v in pixel_result.items():
                if isinstance(v, (int, float, bool)):
                    sig = ForensicSignal(
                        analysis_id=analysis_id,
                        signal_type=k,
                        value=float(v)
                    )
                    db.add(sig)

            prov_rec = ProvenanceRecord(
                analysis_id=analysis_id,
                c2pa_present=c2pa_result.get("c2pa_present", False),
                c2pa_valid=c2pa_result.get("c2pa_valid"),
                creator=c2pa_result.get("creator"),
                software=c2pa_result.get("software"),
                actions=json.dumps(c2pa_result.get("actions", [])),
                signature_status=c2pa_result.get("signature_status")
            )
            db.add(prov_rec)
            db.commit()

            # Format response matching exact schema
            providers_available = sum(1 for p in provider_results if p.get("available"))
            models_agreeing = 0
            if fusion["verdict"] in ["AI_GENERATED", "AI_EDITED_OR_MANIPULATED"]:
                models_agreeing = sum(1 for p in ai_probs if p > 0.5)
            elif fusion["verdict"] == "REAL_CAMERA_PHOTO":
                models_agreeing = sum(1 for p in ai_probs if p < 0.5)

            return {
                "analysis_id": analysis_id,
                "verdict": fusion["verdict"],
                "ai_probability": round(fusion["ai_probability"], 4),
                "real_probability": round(fusion["real_probability"], 4),
                "confidence": fusion["confidence"],
                "classification": {
                    "ai_generated": fusion["verdict"] == "AI_GENERATED",
                    "ai_edited": fusion["verdict"] == "AI_EDITED_OR_MANIPULATED",
                    "deepfake": False,
                    "camera_origin_supported": metadata_result.get("has_exif", False) or c2pa_result.get("c2pa_valid", False)
                },
                "model_consensus": {
                    "providers_available": providers_available,
                    "providers_agreeing": models_agreeing,
                    "agreement": "HIGH" if providers_available > 0 and models_agreeing == providers_available else ("MEDIUM" if models_agreeing > 0 else "LOW")
                },
                "providers": provider_results,
                "provenance": c2pa_result,
                "metadata": metadata_result,
                "forensics": [
                    {
                        "name": "Laplacian Variance",
                        "value": pixel_result["laplacian_variance"]
                    },
                    {
                        "name": "Mean Saturation",
                        "value": pixel_result["mean_saturation"]
                    }
                ],
                "image_quality": {
                    "low_quality": pixel_result["is_low_quality"],
                    "noise_level": pixel_result["noise_level"]
                },
                "limitations": [
                    "Detection is probabilistic. Re-encoding, editing and unseen generators may reduce accuracy."
                ],
                "model_versions": [
                    {"provider": "local_ml", "version": p.get("model_version", "unknown")} for p in provider_results if p.get("provider") == "local_ml"
                ]
            }
        finally:
            db.close()
