# ai_service/routers/sentiment.py
import pickle, json, os, re
from fastapi import APIRouter
from schemas.schemas import SentimenRequest, SentimenResponse
from database import query

router = APIRouter(prefix="/api/sentiment", tags=["Sentimen"])

# ── Load semua file model ────────────────────────────────────────────────
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MDL  = os.path.join(BASE, "saved_models")

with open(os.path.join(MDL, "sentiment_model.pkl"),  "rb") as f:
    MODEL = pickle.load(f)
with open(os.path.join(MDL, "tfidf_vectorizer.pkl"), "rb") as f:
    TFIDF = pickle.load(f)
with open(os.path.join(MDL, "stopwords.json"),  encoding="utf-8") as f:
    STOPWORDS = set(json.load(f))
with open(os.path.join(MDL, "slang_dict.json"), encoding="utf-8") as f:
    SLANG = json.load(f)
with open(os.path.join(MDL, "hybrid_config.json"), encoding="utf-8") as f:
    HYBRID = json.load(f)

THRESHOLD = HYBRID.get("confidence_threshold", 0.60)


# ── Fungsi preprocessing (salin dari flask_app.py) ──────────────────────
def normalize_slang(text: str) -> str:
    return " ".join([SLANG.get(tok, tok) for tok in text.split()])

def preprocess(text: str) -> str:
    if not isinstance(text, str) or not text.strip():
        return ""
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", "", text)
    text = re.sub(r"@\w+|#\w+", "", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = normalize_slang(text)
    tokens = [tok for tok in text.split() if tok not in STOPWORDS and len(tok) > 1]
    return " ".join(tokens)

def rating_to_sentiment(rating: int) -> str:
    if rating >= 4: return "positif"
    if rating == 3: return "netral"
    return "negatif"

def is_conflict(ai_label: str, rating: int) -> bool:
    return (ai_label == "positif" and rating <= 2) or (ai_label == "negatif" and rating >= 4)


# ── Fungsi hybrid (salin dari flask_app.py) ─────────────────────────────
def hybrid_predict(teks: str, rating: int) -> dict:
    teks_bersih  = preprocess(teks)
    rating_label = rating_to_sentiment(rating)
    if not teks_bersih:
        return {"label_final": rating_label, "ai_label": None, "ai_confidence": None,
                "rating_label": rating_label, "sumber": "rating_fallback",
                "probabilitas": None, "keterangan": f"Komentar kosong, rating {rating}★"}
    vec      = TFIDF.transform([teks_bersih])
    ai_label = MODEL.predict(vec)[0]
    proba    = MODEL.predict_proba(vec)[0]
    proba_d  = {k: round(float(v), 4) for k, v in zip(MODEL.classes_, proba)}
    ai_conf  = proba_d[ai_label]
    if not is_conflict(ai_label, rating):
        return {"label_final": ai_label, "ai_label": ai_label, "ai_confidence": ai_conf,
                "rating_label": rating_label, "sumber": "ai_model",
                "probabilitas": proba_d, "keterangan": f"AI={ai_label}({ai_conf:.2f}) konsisten"}
    if ai_conf >= THRESHOLD:
        return {"label_final": ai_label, "ai_label": ai_label, "ai_confidence": ai_conf,
                "rating_label": rating_label, "sumber": "ai_override",
                "probabilitas": proba_d, "keterangan": f"KONFLIK: AI override (confidence tinggi)"}
    return {"label_final": "netral", "ai_label": ai_label, "ai_confidence": ai_conf,
            "rating_label": rating_label, "sumber": "conflict_resolved",
            "probabilitas": proba_d, "keterangan": f"KONFLIK: resolve ke netral (confidence rendah)"}


# ── Endpoints ────────────────────────────────────────────────────────────
@router.post("/analyze")
def analyze(req: SentimenRequest):
    """Analisis sentimen hybrid (komentar + rating bintang)."""
    rating = max(1, min(5, req.rating))
    hasil  = hybrid_predict(req.komentar or "", rating)
    return {
        "status":        "ok",
        "sentimen":      hasil["label_final"],   # ← ini yang disimpan ke DB
        "sumber":        hasil["sumber"],
        "ai_label":      hasil["ai_label"],
        "ai_confidence": hasil["ai_confidence"],
        "rating_label":  hasil["rating_label"],
        "probabilitas":  hasil["probabilitas"],
        "keterangan":    hasil["keterangan"],
    }

@router.get("/summary")
def summary():
    """Ringkasan distribusi sentimen dari tabel reviews."""
    sql = """
        SELECT
            COUNT(*) as total,
            SUM(CASE WHEN sentiment_label IN ('positif', 'positive') THEN 1 ELSE 0 END) as positif,
            SUM(CASE WHEN sentiment_label IN ('netral', 'neutral')  THEN 1 ELSE 0 END) as netral,
            SUM(CASE WHEN sentiment_label IN ('negatif', 'negative') THEN 1 ELSE 0 END) as negatif,
            AVG(rating) as avg_rating
        FROM reviews
    """
    rows = query(sql)
    r = rows[0] if rows else {}
    return {
        "status":  "ok",
        "positif": int(r.get("positif", 0) or 0),
        "netral":  int(r.get("netral", 0)  or 0),
        "negatif": int(r.get("negatif", 0) or 0),
        "avg_rating": round(float(r.get("avg_rating", 0) or 0), 2),
        "total_reviews": int(r.get("total", 0) or 0)
    }

@router.post("/bulk")
def bulk(data: dict):
    """Analisis sentimen banyak ulasan sekaligus (max 50)."""
    ulasan_list = data.get("ulasan", [])
    if len(ulasan_list) > 50:
        from fastapi import HTTPException
        raise HTTPException(400, "Maksimal 50 ulasan per request")
    results = []
    for i, item in enumerate(ulasan_list):
        rating = max(1, min(5, int(item.get("rating", 3))))
        hasil  = hybrid_predict(item.get("komentar", "") or "", rating)
        results.append({"index": i, "sentimen": hasil["label_final"], "sumber": hasil["sumber"]})
    return {"status": "ok", "total": len(results), "results": results}
