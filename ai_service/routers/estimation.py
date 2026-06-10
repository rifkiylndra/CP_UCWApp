# ai_service/routers/estimation.py
import numpy as np
from fastapi import APIRouter
from schemas.schemas import EstimasiRequest
from model_loader import load_json, load_pickle

router = APIRouter(prefix="/api/estimation", tags=["Estimasi Waktu"])

# ── Load model (sama persis seperti di flask_app_estimasi.py) ───────────
MODEL, MODEL_STATUS = load_pickle("estimation_model.pkl")
CONFIG, CONFIG_STATUS = load_json("model_config.json", {})
MODEL_LOADED = MODEL_STATUS["loaded"]

BUFFER = CONFIG.get("buffer_persen", 15)
W_MIN  = CONFIG.get("waktu_minimum", 1.0)
# Urutan fitur WAJIB sama dengan saat training:
# ["jumlah_kopi", "jumlah_kopi_manual", "jumlah_non_kopi", "jumlah_makanan", "antrian_dapur", "is_peak_hour"]


# ── Helper (salin langsung dari flask_app_estimasi.py) ───────────────────
def predict_estimasi(jumlah_kopi, jumlah_kopi_manual, jumlah_non_kopi, jumlah_makanan, antrian_dapur, is_peak_hour) -> dict:
    if not MODEL_LOADED:
        return fallback_estimasi(
            jumlah_kopi,
            jumlah_kopi_manual,
            jumlah_non_kopi,
            jumlah_makanan,
            antrian_dapur,
            is_peak_hour,
            "model_unavailable",
        )

    X = np.array([[jumlah_kopi, jumlah_kopi_manual, jumlah_non_kopi, jumlah_makanan, antrian_dapur, is_peak_hour]])
    try:
        waktu = float(MODEL.predict(X)[0])
    except Exception:
        return fallback_estimasi(
            jumlah_kopi,
            jumlah_kopi_manual,
            jumlah_non_kopi,
            jumlah_makanan,
            antrian_dapur,
            is_peak_hour,
            "prediction_failed",
        )

    waktu     = max(W_MIN, round(waktu, 1))
    waktu_min = max(1, round(waktu * (1 - BUFFER / 100)))
    waktu_max = round(waktu * (1 + BUFFER / 100))
    return {
        "source":         "model",
        "model_loaded":   True,
        "estimasi_menit": waktu,
        "range_min":      waktu_min,
        "range_max":      waktu_max,
        "display":        f"{waktu_min}–{waktu_max} menit",
        "total_item":     jumlah_kopi + jumlah_kopi_manual + jumlah_non_kopi + jumlah_makanan,
        "antrian_dapur":  antrian_dapur,
    }


# ── Endpoints ──────────────────────────────────────────────────────────────
def fallback_estimasi(jumlah_kopi, jumlah_kopi_manual, jumlah_non_kopi, jumlah_makanan, antrian_dapur, is_peak_hour, reason) -> dict:
    total_item = jumlah_kopi + jumlah_kopi_manual + jumlah_non_kopi + jumlah_makanan
    waktu = 5 + (total_item * 3) + (antrian_dapur * 2) + (3 if is_peak_hour else 0)
    waktu = max(W_MIN, min(60, round(float(waktu), 1)))
    waktu_min = max(1, round(waktu * (1 - BUFFER / 100)))
    waktu_max = round(waktu * (1 + BUFFER / 100))

    return {
        "source":         "fallback",
        "reason":         reason,
        "model_loaded":   False,
        "estimasi_menit": waktu,
        "range_min":      waktu_min,
        "range_max":      waktu_max,
        "display":        f"{waktu_min}-{waktu_max} menit",
        "total_item":     total_item,
        "antrian_dapur":  antrian_dapur,
    }


def health_status() -> dict:
    return {
        "model_loaded": MODEL_LOADED,
        "model": MODEL_STATUS,
        "config": CONFIG_STATUS,
    }


@router.post("/predict")
def predict(req: EstimasiRequest):
    """Estimasi waktu penyajian untuk satu order."""
    total_items = req.jumlah_kopi + req.jumlah_kopi_manual + req.jumlah_non_kopi + req.jumlah_makanan
    if total_items == 0:
        from fastapi import HTTPException
        raise HTTPException(400, "Minimal 1 item harus ada")
    
    hasil = predict_estimasi(
        req.jumlah_kopi, 
        req.jumlah_kopi_manual,
        req.jumlah_non_kopi,
        req.jumlah_makanan, 
        req.antrian_dapur,
        req.is_peak_hour
    )
    return {"status": "ok" if hasil["source"] == "model" else "fallback", **hasil}

@router.get("/info")
def info():
    """Info model dan metrik performa."""
    return {"status": "ok", "config": CONFIG, **health_status()}
