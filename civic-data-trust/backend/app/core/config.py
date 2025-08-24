from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings optimized for Python 3.12+"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="forbid"
    )
    
    PROJECT_NAME: str = "Data Science Workflow API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS settings - Using Field for better validation
    ALLOWED_HOSTS: List[str] = Field(default=["*"])
    
    # File upload settings
    MAX_FILE_SIZE: int = Field(default=10 * 1024 * 1024, description="10MB")
    ALLOWED_FILE_TYPES: List[str] = Field(default=[".csv", ".xlsx", ".json"])
    
    # Execution settings
    MAX_EXECUTION_TIME: int = Field(default=300, description="5 minutes")
    MAX_CHAIN_LENGTH: int = Field(default=20)
    
    # Python 3.12+ specific optimizations
    ENABLE_PERFORMANCE_MONITORING: bool = Field(default=True)
    USE_ASYNCIO_OPTIMIZATION: bool = Field(default=True)

settings = Settings()