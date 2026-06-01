# ai_service/database.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from config import config

engine = create_engine(config.DATABASE_URL)

def query(sql: str, params: dict = {}) -> list:
    """Jalankan raw SQL, return list of dict."""
    with engine.connect() as conn:
        result = conn.execute(text(sql), params)
        return [dict(row._mapping) for row in result]
