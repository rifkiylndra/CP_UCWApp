# AI Service Documentation

## 1. Overview

AI service UCW App adalah microservice Python FastAPI di folder `ai_service`. Service ini menyediakan:

- Estimasi waktu penyajian order.
- Ranking menu populer.
- Analisis sentimen review.
- Health check model dan database.

Laravel memanggil AI service melalui `App\Services\AiService`. React tidak memanggil FastAPI langsung; frontend memakai Laravel route/proxy atau data Inertia.

## 2. Structure

```text
ai_service/
  main.py
  config.py
  database.py
  model_loader.py
  requirements.txt
  Dockerfile
  routers/
    estimation.py
    menu.py
    sentiment.py
  schemas/
    schemas.py
  saved_models/
    estimation_model.pkl
    sentiment_model.pkl
    tfidf_vectorizer.pkl
    model_config.json
    hybrid_config.json
    wma_config.json
    slang_dict.json
    stopwords.json
```

Runtime artifacts:

- `__pycache__` dan `*.pyc` muncul di folder AI service, tetapi harus tetap dianggap generated artifact dan tidak perlu didokumentasikan sebagai source utama.

## 3. Dependencies

`requirements.txt`:

- `fastapi`
- `uvicorn[standard]`
- `scikit-learn`
- `numpy`
- `pandas`
- `joblib`
- `psycopg2-binary`
- `sqlalchemy`
- `python-dotenv`
- `pydantic`

## 4. Configuration

`config.py` membaca `.env` Laravel dari root project.

Database:

- Jika `DB_CONNECTION=sqlite`, AI service membaca `database/database.sqlite`.
- Jika `DB_CONNECTION=pgsql` atau `postgres`, AI service membuat PostgreSQL URL dari `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
- MySQL URL juga ada sebagai fallback code path, tetapi stack production project adalah PostgreSQL.

Production Docker:

- `AI_SERVICE_URL=http://ai-service:8000` di `.env.production.example`.
- `docker-compose.yml` menjalankan service `ai-service` dari `ai_service/Dockerfile`.

## 5. Safe Model Loading

`model_loader.py` menyediakan:

- `load_pickle(filename)`
- `load_json(filename, default)`

Behavior:

- Jika file model/config gagal dibaca, service tidak crash.
- Status loaded/error disimpan dan dilaporkan ke `/health`.
- Endpoint memakai fallback jika model tidak tersedia.

Security policy:

- File `.pkl` adalah trusted artifact.
- Jangan load pickle dari sumber tidak terpercaya.
- Sebelum mengganti model production, tambahkan checksum/provenance atau model registry bila memungkinkan.

## 6. Endpoints

### `GET /health`

Fungsi:

- Health check service.
- Melaporkan status estimation model, sentiment model, dan database.

Response ringkas:

```json
{
  "status": "ok",
  "service": "UCW AI Service",
  "estimation": {},
  "sentiment": {},
  "database": {}
}
```

Health URL lokal:

```text
http://127.0.0.1:8000/health
```

### `POST /api/estimation/predict`

Model:

- Multiple Linear Regression.

Input:

- `jumlah_kopi`
- `jumlah_kopi_manual`
- `jumlah_non_kopi`
- `jumlah_makanan`
- `antrian_dapur`
- `is_peak_hour`

Output:

- `estimasi_menit`
- `range_min`
- `range_max`
- `display`
- `total_item`
- `antrian_dapur`
- `source`: `model` atau `fallback`

Fallback:

- Jika model tidak loaded atau predict gagal, endpoint menghitung estimasi heuristic:
  - base 5 menit
  - 3 menit per item
  - 2 menit per queue
  - tambahan peak hour
  - cap 60 menit

### `GET /api/estimation/info`

Fungsi:

- Mengembalikan config model dan status load.

Catatan:

- Endpoint ini bisa dipakai untuk debug/UAT, bukan untuk menampilkan secret.

### `GET /api/menu/populer`

Model/metode:

- Weighted Moving Average.

Query:

- `limit`: default 10, min 1, max 50.
- `periode_hari`: default 30, min 1, max 365.

Data source:

- Query database `order_details`, `orders`, `menus`.
- Hanya order `completed`.

Output:

- `rankings` berisi `menu_id`, `nama`, `skor_wma`, `total_terjual`, `persentase`.

Fallback:

- Jika database unavailable, response `status=fallback` dengan ranking kosong dan reason.

Catatan nama endpoint:

- Repo aktual memakai `/api/menu/populer`.
- Beberapa dokumen lama/user context menyebut `/api/menu/popular`. Gunakan endpoint aktual repo kecuali router diubah.

### `POST /api/sentiment/analyze`

Model:

- Naive Bayes + TF-IDF hybrid dengan rating.

Input:

- `komentar`
- `rating` 1-5

Output:

- `sentimen`: `positif`, `netral`, atau `negatif`.
- `sumber`: `ai_model`, `rating_fallback`, `ai_override`, atau `rating_override`.
- `ai_label`
- `ai_confidence`
- `rating_label`
- `probabilitas`
- `keterangan`

Fallback:

- Jika model atau vectorizer tidak loaded, hasil memakai rating fallback.
- Jika komentar kosong, rating fallback dipakai.

### `GET /api/sentiment/summary`

Fungsi:

- Ringkasan distribusi sentimen dari tabel `reviews`.

Output:

- `positif`
- `netral`
- `negatif`
- `avg_rating`
- `total_reviews`

Fallback:

- Jika query database gagal, status `fallback` dengan angka nol.

### `POST /api/sentiment/bulk`

Fungsi:

- Analisis banyak review sekaligus.

Batas:

- Max 50 item per request.

Status:

- Tersedia di repo.
- Perlu dikonfirmasi apakah dipakai frontend/admin production.

## 7. Laravel Integration

Service Laravel:

- `App\Services\AiService`

Method:

- `getServingTimeEstimation(array $orderData)`
- `getPopularMenus(int $limit = 10)`
- `analyzeSentiment(?string $reviewText = '', ?int $rating = null)`
- `getSentimentSummary()`

Endpoint yang dipanggil Laravel:

- `POST {AI_SERVICE_URL}/api/estimation/predict`
- `GET {AI_SERVICE_URL}/api/menu/populer`
- `POST {AI_SERVICE_URL}/api/sentiment/analyze`
- `GET {AI_SERVICE_URL}/api/sentiment/summary`

Fallback Laravel:

- Estimation fallback: base + item + queue penalty.
- Popular menu fallback: query database order details.
- Sentiment fallback: keyword sederhana.
- Sentiment summary fallback: aggregate database reviews.

## 8. Run Locally

Windows PowerShell:

```bash
cd ai_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

Docker Compose:

```bash
docker compose up -d ai-service
```

## 9. Production Notes

- Pastikan env Laravel production berisi `AI_SERVICE_URL=http://ai-service:8000` bila memakai Docker Compose.
- Pastikan database env yang dibaca AI sama dengan Laravel app.
- Monitor `/health` untuk status model dan database.
- Jika AI service down, Laravel fallback menjaga flow order/review tetap berjalan, tetapi Admin AI Analytics mungkin menampilkan fallback/demo data.
- Jangan expose AI service langsung ke publik kecuali memang dirancang dan dilindungi.

## 10. Perlu Dikonfirmasi

- Apakah endpoint `/api/sentiment/bulk` dipakai production atau hanya utility.
- Apakah model performance yang ditampilkan admin berasal dari artifact live atau masih static/mock.
- Apakah model `.pkl` production sudah punya checksum/provenance.
- Apakah FastAPI akan di-deploy internal Docker-only atau sebagai service terpisah.

