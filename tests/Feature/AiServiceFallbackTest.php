<?php

namespace Tests\Feature;

use App\Services\AiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiServiceFallbackTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.ai.base_url' => 'http://ai-service.test']);
    }

    public function test_serving_time_estimation_uses_fallback_when_ai_service_is_down(): void
    {
        Http::fake(function () {
            throw new ConnectionException('AI service unavailable');
        });

        $result = app(AiService::class)->getServingTimeEstimation([
            'items' => [],
            'current_queue' => 0,
        ]);

        $this->assertFalse($result['success']);
        $this->assertSame(5, $result['estimated_time']);
        $this->assertSame(1, $result['estimated_min_time']);
        $this->assertSame(10, $result['estimated_max_time']);
    }

    public function test_popular_menu_uses_database_fallback_when_ai_service_fails(): void
    {
        Http::fake([
            'ai-service.test/api/menu/populer*' => Http::response(['status' => 'error'], 500),
        ]);

        $result = app(AiService::class)->getPopularMenus();

        $this->assertFalse($result['success']);
        $this->assertSame([], $result['menus']);
        $this->assertSame('Using database fallback for popular menus', $result['message']);
    }

    public function test_sentiment_analysis_uses_keyword_fallback_when_ai_service_is_down(): void
    {
        Http::fake(function () {
            throw new ConnectionException('AI service unavailable');
        });

        $result = app(AiService::class)->analyzeSentiment('kopinya enak dan pelayanannya ramah', 5);

        $this->assertFalse($result['success']);
        $this->assertSame('positive', $result['sentiment']);
        $this->assertSame(0.5, $result['confidence']);
    }

    public function test_sentiment_summary_uses_database_fallback_when_ai_service_fails(): void
    {
        Http::fake([
            'ai-service.test/api/sentiment/summary' => Http::response(['status' => 'error'], 500),
        ]);

        $result = app(AiService::class)->getSentimentSummary();

        $this->assertFalse($result['success']);
        $this->assertSame(0, $result['summary']['total_reviews']);
        $this->assertSame(0, $result['summary']['average_rating']);
    }
}
