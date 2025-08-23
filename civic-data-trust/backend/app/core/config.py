from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings"""
    
    PROJECT_NAME: str = "Data Science Workflow API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS settings
    ALLOWED_HOSTS: List[str] = ["*"]  # In production, specify your frontend domains
    
    # File upload settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [".csv", ".xlsx", ".json"]
    
    # Execution settings
    MAX_EXECUTION_TIME: int = 300  # 5 minutes
    MAX_CHAIN_LENGTH: int = 20
    
    class Config:
        env_file = ".env"

settings = Settings()