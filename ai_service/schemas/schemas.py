# ai_service/schemas/schemas.py
from pydantic import BaseModel
from typing import Optional, Dict, List

# ── ESTIMASI WAKTU ──────────────────────────────────────
class EstimasiRequest(BaseModel):
    jumlah_kopi: int = 0
    jumlah_kopi_manual: int = 0
    jumlah_non_kopi: int = 0
    jumlah_makanan: int = 0
    antrian_dapur: int = 0
    is_peak_hour: int = 0

class EstimasiResponse(BaseModel):
    status: str
    estimasi_menit: float
    range_min: int
    range_max: int
    display: str        # contoh: "10–13 menit"
    total_item: int
    antrian_dapur: int

# ── SENTIMEN ────────────────────────────────────────────
class SentimenRequest(BaseModel):
    komentar: Optional[str] = ""
    rating: int             # 1–5

class SentimenResponse(BaseModel):
    status: str
    sentimen: str           # "positif" / "netral" / "negatif"
    sumber: str             # "ai_model" / "rating_fallback" / "ai_override" / "conflict_resolved"
    ai_label: Optional[str]
    ai_confidence: Optional[float]
    rating_label: str
    probabilitas: Optional[Dict[str, float]]
    keterangan: str

# ── MENU POPULER (WMA) ──────────────────────────────────
class MenuRanking(BaseModel):
    menu_id: int
    nama: str
    skor_wma: float
    persentase: float
    total_terjual: int

class MenuPopulerResponse(BaseModel):
    status: str
    periode_hari: int
    rankings: List[MenuRanking]
