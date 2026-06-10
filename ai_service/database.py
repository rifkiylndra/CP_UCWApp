# ai_service/database.py
from sqlalchemy import create_engine, text
from config import config

engine = create_engine(config.DATABASE_URL, pool_pre_ping=True)

def query(sql: str, params: dict | None = None) -> list:
    """Jalankan raw SQL, return list of dict."""
    with engine.connect() as conn:
        result = conn.execute(text(sql), params or {})
        return [dict(row._mapping) for row in result]


def health_check() -> dict:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        return {
            "status": "ok",
            "connection": config.DB_CONNECTION,
        }
    except Exception as exc:
        return {
            "status": "unavailable",
            "connection": config.DB_CONNECTION,
            "error": exc.__class__.__name__,
        }
