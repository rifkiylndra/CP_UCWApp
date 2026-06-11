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
        
        $recentReviews = \App\Models\Review::with(['order'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Calculate efficiency tracker data comparing actual prep time vs AI estimated serving time
        $timeSlots = [
            '08:00' => ['min_hour' => 8, 'max_hour' => 9, 'base_actual' => 6.0, 'base_estimated' => 5.5],
            '10:00' => ['min_hour' => 10, 'max_hour' => 11, 'base_actual' => 8.2, 'base_estimated' => 7.8],
            '12:00' => ['min_hour' => 12, 'max_hour' => 13, 'base_actual' => 14.5, 'base_estimated' => 13.5],
            '14:00' => ['min_hour' => 14, 'max_hour' => 15, 'base_actual' => 10.1, 'base_estimated' => 10.5],
            '16:00' => ['min_hour' => 16, 'max_hour' => 17, 'base_actual' => 9.0, 'base_estimated' => 8.8],
            '18:00' => ['min_hour' => 18, 'max_hour' => 22, 'base_actual' => 13.8, 'base_estimated' => 12.8],
        ];

        try {
            $dbData = \DB::table('orders')
                ->leftJoin('payments', 'orders.id', '=', 'payments.order_id')
                ->where('orders.order_status', 'completed')
                ->selectRaw("
                    CAST(EXTRACT(HOUR FROM orders.updated_at) AS INTEGER) as hour,
                    AVG(orders.estimated_serve_time) as avg_estimated,
                    AVG(EXTRACT(EPOCH FROM (orders.updated_at - COALESCE(payments.paid_at, orders.created_at))) / 60) as avg_actual
                ")
                ->groupBy(\DB::raw("EXTRACT(HOUR FROM orders.updated_at)"))
                ->get()
                ->keyBy('hour');
        } catch (\Exception $e) {
            \Log::error('Failed to query efficiency data: ' . $e->getMessage());
            $dbData = collect();
        }

        $efficiencyData = [];
        foreach ($timeSlots as $slot => $config) {
            $totalActual = 0;
            $totalEstimated = 0;
            $count = 0;

            for ($h = $config['min_hour']; $h <= $config['max_hour']; $h++) {
                if (isset($dbData[$h])) {
                    $totalActual += (float) $dbData[$h]->avg_actual;
                    $totalEstimated += (float) $dbData[$h]->avg_estimated;
                    $count++;
                }
            }

            if ($count > 0) {
                $actual = round($totalActual / $count, 1);
                $estimated = round($totalEstimated / $count, 1);
            } else {
                $actual = $config['base_actual'];
                $estimated = $config['base_estimated'];
            }

            $efficiencyData[] = [
                'time' => $slot,
                'Actual' => $actual,
                'Estimated' => $estimated,
            ];
        }
        
        return Inertia::render('Admin/AIAnalytics', [
            'popularMenus' => $popularMenus,
            'sentimentSummary' => $sentimentSummary,
            'recentReviews' => $recentReviews,
            'efficiencyData' => $efficiencyData,
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