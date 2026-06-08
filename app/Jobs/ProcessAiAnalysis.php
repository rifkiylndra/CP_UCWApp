<?php

namespace App\Jobs;

use App\Models\Review;
use App\Services\AiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessAiAnalysis implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $reviewId;

    /**
     * Create a new job instance.
     */
    public function __construct($reviewId)
    {
        $this->reviewId = $reviewId;
    }

    /**
     * Execute the job.
     */
    public function handle(AiService $aiService): void
    {
        try {
            $review = Review::find($this->reviewId);
            
            if (!$review) {
                Log::warning('Review not found for AI analysis', ['review_id' => $this->reviewId]);
                return;
            }
            
            // Analyze sentiment using AI service
            $analysis = $aiService->analyzeSentiment($review->comment, $review->rating);
            
            // Update review with sentiment analysis
            $review->update([
                'sentiment_label' => $analysis['sentiment'] ?? null,
            ]);
            
            Log::info('AI analysis completed for review', [
                'review_id' => $this->reviewId,
                'sentiment' => $analysis['sentiment'] ?? null,
                'confidence' => $analysis['confidence'] ?? null,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process AI analysis: ' . $e->getMessage(), [
                'review_id' => $this->reviewId,
                'error' => $e->getMessage(),
            ]);
            
            // Retry the job with exponential backoff
            $this->release(60); // Retry after 60 seconds
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('AI analysis job failed', [
            'review_id' => $this->reviewId,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}