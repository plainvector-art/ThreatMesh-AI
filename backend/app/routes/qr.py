from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.qr_analyzer import qr_analyzer

router = APIRouter(prefix="/qr", tags=["QR Decoder"])

@router.post("/analyze")
async def analyze_qr_code(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid QR image")
    
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded image is empty")

    result = qr_analyzer.analyze_qr(contents, filename=file.filename or "qrcode.png")
    return result
