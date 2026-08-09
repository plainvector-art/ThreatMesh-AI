import json
import uuid
from datetime import datetime
from typing import Generator
from sqlalchemy import create_engine, Column, String, Float, Boolean, DateTime, Text, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Handle SQLite connect_args if needed
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    input_target = Column(String, index=True, nullable=False)
    input_type = Column(String, default="url") # url, ip, hash, log
    classification = Column(String, nullable=False) # Phishing, Malware, Suspicious, Safe, SQLi
    severity = Column(String, nullable=False) # safe, low, medium, high, critical
    confidence = Column(Float, nullable=False) # 0 to 100
    reasoning_trace_json = Column(Text, default="[]")
    tavily_context = Column(Text, nullable=True)
    webhook_sent = Column(Boolean, default=False)
    webhook_status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def reasoning_trace(self):
        try:
            return json.loads(self.reasoning_trace_json or "[]")
        except Exception:
            return []

    @reasoning_trace.setter
    def reasoning_trace(self, value):
        self.reasoning_trace_json = json.dumps(value)


def init_db():
    Base.metadata.create_all(bind=engine)

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ImageRecord(Base):
    __tablename__ = "images"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sha256 = Column(String, index=True, nullable=False, unique=True)
    filename = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ImageAnalysis(Base):
    __tablename__ = "analyses"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    image_id = Column(String, nullable=False)
    status = Column(String, nullable=False)
    verdict = Column(String, nullable=False)
    ai_probability = Column(Float, nullable=False)
    real_probability = Column(Float, nullable=False)
    confidence = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ModelRun(Base):
    __tablename__ = "model_runs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    model_version = Column(String, nullable=False)
    ai_probability = Column(Float, nullable=True)
    real_probability = Column(Float, nullable=True)
    latency_ms = Column(Integer, nullable=True)
    status = Column(String, nullable=False)
    raw_response_reference = Column(Text, nullable=True)

class ForensicSignal(Base):
    __tablename__ = "forensic_signals"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, nullable=False)
    signal_type = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    interpretation = Column(String, nullable=True)

class ProvenanceRecord(Base):
    __tablename__ = "provenance"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, nullable=False)
    c2pa_present = Column(Boolean, default=False)
    c2pa_valid = Column(Boolean, nullable=True)
    creator = Column(String, nullable=True)
    software = Column(String, nullable=True)
    actions = Column(Text, nullable=True)
    signature_status = Column(String, nullable=True)

class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    provider = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    checksum = Column(String, nullable=True)
    license = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
