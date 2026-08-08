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
