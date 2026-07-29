"""
KARA Backend - Configuration Settings
"""
from pydantic import field_validator
from pydantic_settings import BaseSettings
from typing import Optional, Union


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "KARA"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: Union[list[str], str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, list[str]]) -> list[str]:
        if isinstance(v, str):
            if not v or v.strip() == "*":
                return ["*"]
            if v.startswith("["):
                import json
                return json.loads(v)
            return [i.strip() for i in v.split(",")]
        return v
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./kara.db"
    DATABASE_ECHO: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT Authentication
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Google Gemini
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_EMBEDDING_MODEL: str = "text-embedding-004"
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    EXPORT_DIR: str = "./exports"
    MAX_UPLOAD_SIZE_MB: int = 50
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
