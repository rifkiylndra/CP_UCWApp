<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CreateReviewRequest;
use App\Models\Order;
use App\Models\Review;
use App\Services\AiService;

class ReviewController extends Controller
{
    public function __construct(private AiService $aiService)
    {
    }

    /**
     * Submit review for order
     */
    public function store(Order $order, CreateReviewRequest $request)
    {
        // Analyze sentiment
        $sentimentResult = $this->aiService->analyzeSentiment($request->comment);
        $sentimentLabel = $sentimentResult['sentiment'] ?? 'neutral';

        // Create review
        $review = Review::create([
            'order_id' => $order->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'sentiment_label' => $sentimentLabel,
        ]);

        return response()->json([
            'data' => $review,
            'message' => 'Review submitted successfully',
        ], 201);
    }
}
