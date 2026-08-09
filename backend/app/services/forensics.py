import io
import exifread
from PIL import Image
from typing import Dict, Any, List
import c2pa
import json
import logging
import cv2
import numpy as np

logger = logging.getLogger(__name__)

class C2PAAnalyzer:
    def analyze(self, image_bytes: bytes, filename: str) -> Dict[str, Any]:
        result = {
            "c2pa_present": False,
            "c2pa_valid": False,
            "creator": None,
            "software": None,
            "actions": [],
            "signature_status": "none"
        }

        try:
            # We must write to a temporary file because c2pa library expects a file path
            # For simplicity, we just assume the memory buffer has no C2PA since c2pa-python
            # requires reading from a file path and we are working with bytes in memory.
            # To do this correctly, we'd save to a tempfile, but we'll mock the integration here
            # for the sake of the exercise, as writing tempfiles introduces concurrency and cleanup issues.
            import tempfile
            import os

            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                tmp.write(image_bytes)
                tmp_path = tmp.name

            try:
                # c2pa.Reader might fail if there's no manifest
                reader = c2pa.Reader.from_file(tmp_path)
                manifest_json = reader.json()
                manifest = json.loads(manifest_json)

                result["c2pa_present"] = True

                # Check validation status
                if hasattr(reader, 'validation_status'):
                    status = reader.validation_status()
                    result["c2pa_valid"] = len(status) == 0
                    result["signature_status"] = "valid" if result["c2pa_valid"] else "invalid"

                # Extract creator/software
                active_manifest = manifest.get("active_manifest", {})
                assertions = active_manifest.get("assertions", [])
                for assertion in assertions:
                    if assertion.get("label") == "c2pa.actions":
                        actions = assertion.get("data", {}).get("actions", [])
                        for action in actions:
                            action_name = action.get("action")
                            software_agent = action.get("softwareAgent")
                            if software_agent:
                                result["software"] = software_agent
                            if action_name:
                                result["actions"].append(action_name)

            except Exception as e:
                # c2pa-python raises exceptions if no C2PA data is found
                pass
            finally:
                os.remove(tmp_path)

        except Exception as e:
            logger.error(f"C2PA analysis failed: {e}")

        return result

class MetadataAnalyzer:
    def analyze(self, image_bytes: bytes) -> Dict[str, Any]:
        result = {
            "has_exif": False,
            "camera_make": None,
            "camera_model": None,
            "software": None,
            "creation_date": None,
            "raw_tags": {}
        }
        try:
            tags = exifread.process_file(io.BytesIO(image_bytes))
            if tags:
                result["has_exif"] = True
                result["raw_tags"] = {k: str(v) for k, v in tags.items() if k not in ('JPEGThumbnail', 'TIFFThumbnail', 'Filename', 'EXIF MakerNote')}
                result["camera_make"] = result["raw_tags"].get("Image Make")
                result["camera_model"] = result["raw_tags"].get("Image Model")
                result["software"] = result["raw_tags"].get("Image Software")
                result["creation_date"] = result["raw_tags"].get("Image DateTime")
        except Exception as e:
            logger.error(f"Metadata analysis failed: {e}")

        return result

class PixelForensics:
    def analyze(self, image_bytes: bytes) -> Dict[str, Any]:
        result = {
            "laplacian_variance": 0.0,
            "mean_saturation": 0.0,
            "noise_level": 0.0,
            "is_low_quality": False
        }
        try:
            pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            img_np = np.array(pil_img)
            img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

            # Laplacian Variance (Blur/Focus)
            laplacian = cv2.Laplacian(gray, cv2.CV_64F)
            laplacian_var = float(laplacian.var())
            result["laplacian_variance"] = round(laplacian_var, 2)

            # Saturation
            hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
            sat_channel = hsv[:, :, 1]
            mean_sat = float(np.mean(sat_channel))
            result["mean_saturation"] = round(mean_sat, 2)

            # Noise estimate (simplified)
            blur = cv2.GaussianBlur(gray, (5,5), 0)
            noise_img = cv2.absdiff(gray, blur)
            result["noise_level"] = round(float(np.mean(noise_img)), 2)

            # Quality check
            h, w = img_np.shape[:2]
            if h < 200 or w < 200 or laplacian_var < 50:
                result["is_low_quality"] = True

        except Exception as e:
            logger.error(f"Pixel forensics failed: {e}")

        return result
