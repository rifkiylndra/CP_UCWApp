# ai_service/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import estimation, sentiment, menu
from database import health_check

app = FastAPI(
    title="UCW App — AI Service",
    description="MLR (Estimasi Waktu) + Naive Bayes Hybrid (Sentimen) + WMA (Menu Populer)",
    version="1.0.0"
)

# Izinkan request dari Laravel (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(estimation.router)
app.include_router(sentiment.router)
app.include_router(menu.router)

@app.get("/health")
def health():
    """Health check — dipanggil Laravel checkAiServiceStatus()."""
    return {
        "status": "ok",
        "service": "UCW AI Service",
        "estimation": estimation.health_status(),
        "sentiment": sentiment.health_status(),
        "database": health_check(),
    }
