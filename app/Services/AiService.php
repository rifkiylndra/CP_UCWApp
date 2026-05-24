<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    protected $baseUrl;

    public function __construct()
    {
        // Default to FastAPI port 8001
        $this->baseUrl = env('AI_SERVICE_URL', 'http://127.0.0.1:8001/api');
    }

    /**
     * Get prediction for serve time (MLR)
     */
    public function predictServeTime(int $jumlahKopi, int $jumlahNonKopi, int $jumlahMakanan, int $antrianDapur)
    {
        try {
            $response = Http::timeout(5)->post("{$this->baseUrl}/estimation/predict", [
                'jumlah_kopi' => $jumlahKopi,
                'jumlah_non_kopi' => $jumlahNonKopi,
                'jumlah_makanan' => $jumlahMakanan,
                'antrian_dapur' => $antrianDapur
            ]);

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            Log::error('AI Service Error (Estimation): ' . $e->getMessage());
        }

        // Fallback value if AI service is down
        return ['estimated_minutes' => 15.0, 'confidence_score' => 0.0];
    }

    /**
     * Get model performance metrics (MLR)
     */
    public function getModelPerformance()
    {
        try {
            $response = Http::timeout(3)->get("{$this->baseUrl}/estimation/performance");
            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('AI Service Error (Performance): ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get popular menus (WMA)
     */
    public function getPopularMenus()
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/menu/popular");
            if ($response->successful()) {
                return $response->json()['top_menus'] ?? [];
            }
        } catch (\Exception $e) {
            Log::error('AI Service Error (Popular Menu): ' . $e->getMessage());
        }
        
        return [];
    }

    /**
     * Analyze review sentiment (Naive Bayes)
     */
    public function analyzeSentiment(string $komentar, int $rating = 5)
    {
        try {
            $response = Http::timeout(3)->post("{$this->baseUrl}/sentiment/analyze", [
                'komentar' => $komentar,
                'rating' => $rating
            ]);

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            Log::error('AI Service Error (Sentiment): ' . $e->getMessage());
        }

        return ['sentiment' => 'neutral', 'confidence' => 0.0];
    }

    /**
     * Get sentiment summary
     */
    public function getSentimentSummary()
    {
        try {
            $response = Http::timeout(3)->get("{$this->baseUrl}/sentiment/summary");
            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('AI Service Error (Sentiment Summary): ' . $e->getMessage());
            return null;
        }
    }
}
