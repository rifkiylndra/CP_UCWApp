# ai_service/config.py
import os
from dotenv import load_dotenv

# Baca .env dari root project Laravel (satu level di atas ai_service/)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

class Config:
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_DATABASE", "ucw_app")
    DB_USER = os.getenv("DB_USERNAME", "postgres")
    DB_PASS = os.getenv("DB_PASSWORD", "")
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

config = Config()
