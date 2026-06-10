# ai_service/routers/menu.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from fastapi import APIRouter, Query
from database import query

router = APIRouter(prefix="/api/menu", tags=["Menu Populer"])

def hitung_wma(periode_hari: int, limit: int) -> dict:
    """
    Hitung ranking menu populer dengan Weighted Moving Average.
    Data diambil dari tabel order_details + orders + menus di PostgreSQL.
    """
    cutoff_date = (datetime.utcnow() - timedelta(days=periode_hari)).date().isoformat()
    sql = """
        SELECT
            COALESCE(od.menu_id, 0) AS menu_id,
            COALESCE(od.menu_name, m.name, 'Deleted menu') AS nama,
            DATE(o.created_at) AS tanggal,
            SUM(od.quantity) AS qty_terjual
        FROM order_details od
        LEFT JOIN menus m ON m.id = od.menu_id
        JOIN orders o ON o.id = od.order_id
        WHERE o.created_at >= :cutoff_date
          AND o.order_status = 'completed'
        GROUP BY COALESCE(od.menu_id, 0), COALESCE(od.menu_name, m.name, 'Deleted menu'), DATE(o.created_at)
        ORDER BY tanggal ASC
    """

    try:
        rows = query(sql, {"cutoff_date": cutoff_date})
    except Exception:
        return menu_populer_fallback(periode_hari, "database_unavailable")

    # Jika belum ada data (database masih kosong saat development)
    if not rows:
        return {
            "status": "ok",
            "periode_hari": periode_hari,
            "rankings": [],
            "catatan": "Belum ada data transaksi yang selesai"
        }

    df = pd.DataFrame(rows)
    df["tanggal"] = pd.to_datetime(df["tanggal"])

    # Hitung WMA per menu
    results = []
    for menu_id, group in df.groupby("menu_id"):
        group  = group.sort_values("tanggal")
        qty    = group["qty_terjual"].values.astype(float)
        n      = len(qty)
        # Bobot linear: hari terakhir dapat bobot tertinggi
        # Contoh 3 hari: [1, 2, 3] → normalize → [0.17, 0.33, 0.50]
        weights = np.arange(1, n + 1, dtype=float)
        weights /= weights.sum()
        skor_wma = float(np.dot(weights, qty))
        results.append({
            "menu_id":      int(menu_id),
            "nama":         group["nama"].iloc[0],
            "skor_wma":     round(skor_wma, 3),
            "total_terjual": int(qty.sum())
        })

    # Sort by skor WMA descending, ambil top N
    results.sort(key=lambda x: x["skor_wma"], reverse=True)
    results = results[:limit]

    # Tambah persentase relatif terhadap skor tertinggi
    max_skor = results[0]["skor_wma"] if results else 1
    for r in results:
        r["persentase"] = round((r["skor_wma"] / max_skor) * 100, 1)

    return {"status": "ok", "periode_hari": periode_hari, "rankings": results}


def menu_populer_fallback(periode_hari: int, reason: str) -> dict:
    return {
        "status": "fallback",
        "periode_hari": periode_hari,
        "rankings": [],
        "reason": reason,
        "catatan": "Data menu populer belum tersedia",
    }


@router.get("/populer")
def menu_populer(
    limit:       int = Query(default=10, ge=1, le=50),
    periode_hari: int = Query(default=30, ge=1, le=365)
):
    """Ranking menu populer berdasarkan Weighted Moving Average."""
    return hitung_wma(periode_hari, limit)
