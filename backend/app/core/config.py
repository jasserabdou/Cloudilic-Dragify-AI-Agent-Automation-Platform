import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "77c3aaed164dee98fc5f8ccb5aed731e78fd4efc29309bbcde90e7bd91d76f08"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://cloudilic-agent.vercel.app",
    ]

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:2006@localhost:5432/cloudilic"
    )

    # Number of retries for CRM operations
    CRM_MAX_RETRIES: int = 3
    CRM_RETRY_DELAY: int = 2  # seconds

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
