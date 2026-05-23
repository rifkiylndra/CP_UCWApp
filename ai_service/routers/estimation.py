# ai_service/routers/estimation.py
import pickle, json, os, numpy as np
from fastapi import APIRouter
from schemas.schemas import EstimasiRequest, EstimasiResponse

router = APIRouter(prefix="/api/estimation", tags=["Estimasi Waktu"])

# ── Load model (sama persis seperti di flask_app_estimasi.py) ───────────
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MDL  = os.path.join(BASE, "saved_models")

with open(os.path.join(MDL, "estimation_model.pkl"), "rb") as f:
    MODEL = pickle.load(f)
with open(os.path.join(MDL, "model_config.json")) as f:
    CONFIG = json.load(f)

BUFFER = CONFIG.get("buffer_persen", 15)
W_MIN  = CONFIG.get("waktu_minimum", 1.0)
# Urutan fitur WAJIB sama dengan saat training:
# ["jumlah_kopi", "jumlah_non_kopi", "jumlah_makanan", "antrian_dapur"]


# ── Helper (salin langsung dari flask_app_estimasi.py) ───────────────────
def predict_estimasi(jumlah_kopi, jumlah_non_kopi, jumlah_makanan, antrian_dapur) -> dict:
    X = np.array([[jumlah_kopi, jumlah_non_kopi, jumlah_makanan, antrian_dapur]])
    waktu     = float(MODEL.predict(X)[0])
    waktu     = max(W_MIN, round(waktu, 1))
    waktu_min = max(1, round(waktu * (1 - BUFFER / 100)))
    waktu_max = round(waktu * (1 + BUFFER / 100))
    return {
        "estimasi_menit": waktu,
        "range_min":      waktu_min,
        "range_max":      waktu_max,
        "display":        f"{waktu_min}–{waktu_max} menit",
        "total_item":     jumlah_kopi + jumlah_non_kopi + jumlah_makanan,
        "antrian_dapur":  antrian_dapur,
    }


# ── Endpoints ──────────────────────────────────────────────────────────────
@router.post("/predict")
def predict(req: EstimasiRequest):
    """Estimasi waktu penyajian untuk satu order."""
    if (req.jumlah_kopi + req.jumlah_non_kopi + req.jumlah_makanan) == 0:
        from fastapi import HTTPException
        raise HTTPException(400, "Minimal 1 item harus ada")
    hasil = predict_estimasi(req.jumlah_kopi, req.jumlah_non_kopi,
                             req.jumlah_makanan, req.antrian_dapur)
    return {"status": "ok", **hasil}

@router.get("/info")
def info():
    """Info model dan metrik performa."""
    return {"status": "ok", "config": CONFIG}
