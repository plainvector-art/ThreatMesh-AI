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
    
    # Image Detection APIs
    SIGHTENGINE_API_USER: str = os.getenv("SIGHTENGINE_API_USER", "")
    SIGHTENGINE_API_SECRET: str = os.getenv("SIGHTENGINE_API_SECRET", "")
    HIVE_API_KEY: str = os.getenv("HIVE_API_KEY", "")

    # Local Model
    MODEL_REGISTRY_URL: str = os.getenv("MODEL_REGISTRY_URL", "")
    MODEL_CACHE_DIR: str = os.getenv("MODEL_CACHE_DIR", "./models/cache")
    DETECTION_TIMEOUT: int = int(os.getenv("DETECTION_TIMEOUT", "30"))
    DETECTION_THRESHOLD: float = float(os.getenv("DETECTION_THRESHOLD", "0.65"))

    # Core Engine Weights
    AI_WEIGHT: float = 0.75
    RULE_WEIGHT: float = 0.25
    SAFE_THRESHOLD: float = 0.30
    DANGEROUS_THRESHOLD: float = 0.70

    class Config:
        case_sensitive = True

settings = Settings()
