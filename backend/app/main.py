import logging
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db, SessionLocal, ScanRecord
from app.routes.scan import router as scan_router
from app.routes.metrics import router as metrics_router
from app.routes.alerts import router as alerts_router
from app.routes.deepfake import router as deepfake_router
from app.routes.qr import router as qr_router
from app.routes.audio import router as audio_router
from app.routes.chatbot import router as chat_router
from app.routes.awareness import router as awareness_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ThreatMesh AI — Next-Generation Threat Recognition & Incident Orchestration Engine"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(scan_router, prefix=settings.API_V1_STR)
app.include_router(metrics_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)
app.include_router(deepfake_router, prefix=settings.API_V1_STR)
app.include_router(qr_router, prefix=settings.API_V1_STR)
app.include_router(audio_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(awareness_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

def seed_demo_data():
    db = SessionLocal()
    try:
        if db.query(ScanRecord).count() == 0:
            logger.info("Seeding initial demo scan records into ThreatMesh AI database...")
            now = datetime.utcnow()
            demo_scans = [
                ScanRecord(
                    input_target="https://secure-login-hdfc-verification.xyz/auth/login",
                    input_type="url",
                    classification="Phishing Site",
                    severity="critical",
                    confidence=96.4,
                    reasoning_trace_json='[{"step":1,"title":"Domain Analysis","status":"flagged","detail":"Uses suspicious TLD .xyz and unverified bank brand keywords"},{"step":2,"title":"SSL & Certificate","status":"warning","detail":"Self-signed certificate issued 2 hours ago"},{"step":3,"title":"AI Classification","status":"critical","detail":"High probability credential harvesting form matched"}]',
                    tavily_context="[Tavily Intelligence] Active phishing campaign detected targeting HDFC online banking customers. Domain registered via privacy proxy 4 hours ago. Multiple report flags on PhishTank.",
                    webhook_sent=True,
                    webhook_status="delivered",
                    created_at=now - timedelta(minutes=4)
                ),
                ScanRecord(
                    input_target="http://192.168.1.105:8080/payload.bin",
                    input_type="ip",
                    classification="Malware / C2 Beacon",
                    severity="high",
                    confidence=91.2,
                    reasoning_trace_json='[{"step":1,"title":"Host Identification","status":"flagged","detail":"Raw IP address used instead of domain name"},{"step":2,"title":"Heuristic Signature","status":"critical","detail":"Binary executable payload structure over unencrypted HTTP"}]',
                    tavily_context="[Tavily Intelligence] IP matching automated botnet command-and-control infrastructure scanning open port 8080.",
                    webhook_sent=True,
                    webhook_status="delivered",
                    created_at=now - timedelta(minutes=18)
                ),
                ScanRecord(
                    input_target="https://github.com/facebook/react",
                    input_type="url",
                    classification="Safe Target",
                    severity="safe",
                    confidence=99.8,
                    reasoning_trace_json='[{"step":1,"title":"Domain Verification","status":"passed","detail":"Verified legitimate domain github.com with valid TLS/SSL certificate"}]',
                    tavily_context=None,
                    webhook_sent=False,
                    webhook_status="none",
                    created_at=now - timedelta(minutes=35)
                ),
                ScanRecord(
                    input_target="SELECT * FROM users WHERE username = 'admin' AND '1'='1'",
                    input_type="log",
                    classification="SQLi / Exploit Payload",
                    severity="critical",
                    confidence=98.9,
                    reasoning_trace_json='[{"step":1,"title":"Pattern Matching","status":"critical","detail":"OWASP Top 10 SQL Injection payload signature detected in application request log"}]',
                    tavily_context="[Tavily Intelligence] Classic SQL injection bypass vector targeting authentication forms.",
                    webhook_sent=True,
                    webhook_status="delivered",
                    created_at=now - timedelta(hours=1, minutes=10)
                ),
                ScanRecord(
                    input_target="https://render.com/docs/deploy-fastapi",
                    input_type="url",
                    classification="Safe Target",
                    severity="safe",
                    confidence=99.5,
                    reasoning_trace_json='[{"step":1,"title":"Domain Verification","status":"passed","detail":"Verified legitimate cloud platform domain render.com"}]',
                    tavily_context=None,
                    webhook_sent=False,
                    webhook_status="none",
                    created_at=now - timedelta(hours=2, minutes=5)
                )
            ]
            db.add_all(demo_scans)
            db.commit()
            logger.info("Demo dataset successfully seeded!")
    except Exception as e:
        logger.error(f"Error seeding demo scan dataset: {e}")
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    init_db()
    seed_demo_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
