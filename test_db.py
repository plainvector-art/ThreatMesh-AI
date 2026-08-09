from app.database import init_db, SessionLocal, ImageRecord, ImageAnalysis
from app.core_engine.fusion import EvidenceFusionEngine
import hashlib

init_db()
engine = EvidenceFusionEngine()

# Test 1: First insertion
img_bytes = b"fake_image_bytes_123"
res1 = engine.analyze(img_bytes, "test.jpg")

# Test 2: Cache retrieval
res2 = engine.analyze(img_bytes, "test.jpg")

db = SessionLocal()
img_hash = hashlib.sha256(img_bytes).hexdigest()
record = db.query(ImageRecord).filter(ImageRecord.sha256 == img_hash).first()
analysis = db.query(ImageAnalysis).filter(ImageAnalysis.image_id == record.id).first()

print(f"Record ID: {record.id}")
print(f"Analysis Verdict: {analysis.verdict}")
print(f"Res1 ID: {res1['analysis_id']}")
print(f"Res2 ID: {res2['analysis_id']}")
assert res1['analysis_id'] == res2['analysis_id']
