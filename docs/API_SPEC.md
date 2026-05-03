# Spesifikasi API: AI Microservice

Dokumen ini mendeskripsikan spesifikasi endpoint dari **Python FastAPI Microservice** yang menangani fungsionalitas *Artificial Intelligence*.

**Base URL**: `http://localhost:8000/api`

---

## 1. Estimasi Waktu Penyajian (Multiple Linear Regression)
Memprediksi estimasi waktu pesanan selesai berdasarkan jumlah antrean, kompleksitas item, dan jumlah staff yang aktif.

**Endpoint**: `GET /estimation/predict`

**Query Parameters:**
- `queue_length` (int): Jumlah pesanan yang sedang diproses.
- `item_complexity` (float): Rata-rata bobot kompleksitas item dalam pesanan (1.0 - 5.0).
- `staff_on_duty` (int): Jumlah staff yang sedang bekerja.

**Response (200 OK):**
```json
{
  "estimated_minutes": 12,
  "confidence_score": 0.85
}
```

---

## 2. Performa Model MLR
Menampilkan performa dan metrik dari model regresi.

**Endpoint**: `GET /estimation/performance`

**Response (200 OK):**
```json
{
  "mae": 1.2,
  "rmse": 1.8,
  "r2_score": 0.92,
  "last_trained": "2026-05-01T10:00:00Z"
}
```

---

## 3. Analisis Menu Populer (Weighted Moving Average)
Menganalisis pergerakan transaksi beberapa periode terakhir untuk memberikan peringkat menu populer.

**Endpoint**: `GET /menu/popular`

**Response (200 OK):**
```json
{
  "period": "weekly",
  "rankings": [
    {
      "menu_id": "M01",
      "name": "Single Origin Flat White",
      "wma_score": 84.5,
      "trend": "up"
    },
    {
      "menu_id": "M04",
      "name": "Honey Oat Latte",
      "wma_score": 76.2,
      "trend": "down"
    }
  ]
}
```

---

## 4. Analisis Sentimen Review (Naive Bayes + TF-IDF)
Menganalisis teks review pelanggan untuk mengklasifikasikan kepuasan mereka.

**Endpoint**: `POST /sentiment/analyze`

**Request Body:**
```json
{
  "review_text": "Kopinya enak banget, tapi nunggunya agak lama karena ramai."
}
```

**Response (200 OK):**
```json
{
  "sentiment": "neutral",
  "polarity_score": 0.55,
  "tags": ["kopi_enak", "waktu_tunggu_lama"]
}
```

---

## 5. Ringkasan Sentimen Keseluruhan
Menampilkan distribusi sentimen dari seluruh review terbaru.

**Endpoint**: `GET /sentiment/summary`

**Response (200 OK):**
```json
{
  "average_index": 4.8,
  "distribution": {
    "highly_satisfied": 92.0,
    "neutral": 5.6,
    "critical": 2.4
  },
  "total_reviews_analyzed": 1420
}
```
