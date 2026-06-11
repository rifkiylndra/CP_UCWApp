<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewStatisticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_review_statistics_empty_response_keeps_contract_shape(): void
    {
        $this->getJson('/api/review/statistics')
            ->assertOk()
            ->assertExactJson([
                'total_reviews' => 0,
                'average_rating' => 0,
                'sentiment_distribution' => [
                    'positive' => 0,
                    'neutral' => 0,
                    'negative' => 0,
                ],
            ]);
    }

    public function test_review_statistics_counts_sentiment_distribution_portably(): void
    {
        $this->createReview(5, 'positive');
        $this->createReview(4, 'positive');
        $this->createReview(3, 'neutral');
        $this->createReview(1, 'negative');

        $this->getJson('/api/review/statistics')
            ->assertOk()
            ->assertJsonPath('total_reviews', 4)
            ->assertJsonPath('average_rating', 3.3)
            ->assertJsonPath('sentiment_distribution.positive', 2)
            ->assertJsonPath('sentiment_distribution.neutral', 1)
            ->assertJsonPath('sentiment_distribution.negative', 1);
    }

    public function test_review_statistics_response_shape_matches_legacy_contract(): void
    {
        $this->createReview(null, null);

        $this->getJson('/api/review/statistics')
            ->assertOk()
            ->assertJsonStructure([
                'total_reviews',
                'average_rating',
                'sentiment_distribution' => [
                    'positive',
                    'neutral',
                    'negative',
                ],
            ]);
    }

    private function createReview(?int $rating, ?string $sentiment): Review
    {
        $order = Order::create([
            'order_type' => 'takeaway',
            'order_status' => 'completed',
            'payment_status' => 'paid',
            'total_price' => 25000,
        ]);

        return Review::create([
            'order_id' => $order->id,
            'rating' => $rating,
            'comment' => $sentiment ? "Review {$sentiment}" : null,
            'sentiment_label' => $sentiment,
        ]);
    }
}
