from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_ENV: str = "development"
    APP_NAME: str = "VidhiVerse AI"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173"
    LOG_LEVEL: str = "INFO"

    DATABASE_URL: str = "sqlite+aiosqlite:///../storage/vidhiverse.db"

    SECRET_KEY: str = ""
    GUEST_EXPIRY_DAYS: int = 30

    LLM_PROVIDER: str = "mock"
    LLM_MODEL: str = ""
    LLM_API_KEY: str = ""
    LLM_BASE_URL: str = ""
    LLM_FALLBACK_PROVIDER: str = ""
    LLM_FALLBACK_MODEL: str = ""
    LLM_FALLBACK_API_KEY: str = ""
    LLM_FALLBACK_BASE_URL: str = ""
    LLM_DATA_POLICY: str = "may_train"
    LLM_ALLOW_USER_DOCUMENTS: bool = False

    EMBEDDING_PROVIDER: str = "hash"
    EMBEDDING_MODEL: str = ""
    EMBEDDING_DIMENSIONS: int = 384
    RAG_MIN_SIMILARITY: float = 0.78

    ENABLED_LANGUAGES: str = "en"

    STORAGE_PROVIDER: str = "local"
    STORAGE_PATH: str = "../storage"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
