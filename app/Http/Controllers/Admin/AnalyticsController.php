<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    protected $aiService;

    public function __construct(AiService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Display AI analytics dashboard
     */
    public function index()
    {
        $popularMenus = $this->aiService->getPopularMenus(10);
        $sentimentSummary = $this->aiService->getSentimentSummary();
        
        return Inertia::render('Admin/Analytics', [
            'popularMenus' => $popularMenus,
            'sentimentSummary' => $sentimentSummary,
            'aiServiceStatus' => $this->checkAiServiceStatus(),
        ]);
    }

    /**
     * Get serving time estimation
     */
    public function getServingTimeEstimation(Request $request)
    {
        $request->validate([
            'order_items' => 'required|array',
            'current_queue' => 'required|integer|min:0',
        ]);

        $estimation = $this->aiService->getServingTimeEstimation([
            'items' => $request->order_items,
            'current_queue' => $request->current_queue,
        ]);

        return response()->json($estimation);
    }

    /**
     * Get popular menus with AI analysis
     */
    public function getPopularMenus()
    {
        $popularMenus = $this->aiService->getPopularMenus(15);
        
        return response()->json($popularMenus);
    }

    /**
     * Analyze review sentiment
     */
    public function analyzeSentiment(Request $request)
    {
        $request->validate([
            'review_text' => 'required|string|min:10|max:1000',
        ]);

        $analysis = $this->aiService->analyzeSentiment($request->review_text);
        
        return response()->json($analysis);
    }

    /**
     * Get sentiment summary
     */
    public function getSentimentSummaryData()
    {
        $summary = $this->aiService->getSentimentSummary();
        
        return response()->json($summary);
    }

    /**
     * Get AI model performance
     */
    public function getModelPerformance()
    {
        try {
            // This would call the AI service for model performance metrics
            // For now, return mock data
            return response()->json([
                'success' => true,
                'models' => [
                    [
                        'name' => 'Multiple Linear Regression',
                        'purpose' => 'Serving Time Estimation',
                        'accuracy' => 0.85,
                        'last_trained' => now()->subDays(2)->format('Y-m-d H:i:s'),
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Weighted Moving Average',
                        'purpose' => 'Popular Menu Prediction',
                        'accuracy' => 0.78,
                        'last_trained' => now()->subDays(5)->format('Y-m-d H:i:s'),
                        'status' => 'active',
                    ],
                    [
                        'name' => 'Naive Bayes + TF-IDF',
                        'purpose' => 'Sentiment Analysis',
                        'accuracy' => 0.82,
                        'last_trained' => now()->subDays(1)->format('Y-m-d H:i:s'),
                        'status' => 'active',
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get model performance: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check AI service status
     */
    private function checkAiServiceStatus(): array
    {
        try {
            $response = \Illuminate\Support\Facades\Http::timeout(5)
                ->get(config('services.ai.base_url') . '/health');
                
            if ($response->successful()) {
                return [
                    'status' => 'online',
                    'response_time' => $response->handlerStats()['total_time'] ?? 0,
                    'message' => 'AI service is running',
                ];
            }
        } catch (\Exception $e) {
            // Service is offline or unreachable
        }
        
        return [
            'status' => 'offline',
            'response_time' => 0,
            'message' => 'AI service is unavailable',
        ];
    }
}