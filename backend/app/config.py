import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ThreatMesh AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment & Secrets
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./threatmesh.db")
    
    # Core Engine Weights
    AI_WEIGHT: float = 0.75
    RULE_WEIGHT: float = 0.25
    SAFE_THRESHOLD: float = 0.30
    DANGEROUS_THRESHOLD: float = 0.70

    class Config:
        case_sensitive = True

settings = Settings()
