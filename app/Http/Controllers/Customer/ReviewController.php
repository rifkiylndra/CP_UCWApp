<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CreateReviewRequest;
use App\Models\Order;
use App\Models\Review;
use App\Services\AiService;
use App\Services\CustomerOrderAccessService;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReviewController extends Controller
{
    protected $aiService;
    protected $orderAccess;

    public function __construct(AiService $aiService, CustomerOrderAccessService $orderAccess)
    {
        $this->aiService = $aiService;
        $this->orderAccess = $orderAccess;
    }

    /**
     * Display review page
     */
    public function create(Request $request, $orderRef)
    {
        if ($redirect = $this->redirectNumericOrderToRef($request, $orderRef, 'customer.review.create')) {
            return $redirect;
        }

        $order = $this->findCustomerOrder($request, $orderRef, ['orderDetails.menu']);
        
        // Check if order is completed
        if ($order->order_status !== 'completed') {
            return redirect()->route('customer.order.status', ['order' => $order->order_ref])
                ->with('error', 'Hanya pesanan yang sudah selesai yang dapat direview');
        }
        
        // Check if review already exists
        if ($order->review) {
            return redirect()->route('customer.order.status', ['order' => $order->order_ref])
                ->with('info', 'Anda sudah memberikan review untuk pesanan ini');
        }

        return Inertia::render('Customer/Review', [
            'order' => $order,
        ]);
    }

    /**
     * Store review
     */
    public function store(CreateReviewRequest $request, $orderRef)
    {
        Log::info('Review request received: ' . $orderRef, $request->all());
        
        $order = $this->findCustomerOrder($request, $orderRef);
        
        // Check if order is completed
        if ($order->order_status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya pesanan yang sudah selesai yang dapat direview',
            ], 400);
        }
        
        // Check if review already exists
        if ($order->review) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memberikan review untuk pesanan ini',
            ], 400);
        }

        try {
            $validated = $request->validated();
            $rating = $validated['rating'] ?? null;
            $comment = isset($validated['comment']) ? trim((string) $validated['comment']) : null;
            $comment = $comment === '' ? null : $comment;
            $sentimentAnalysis = null;

            if ($comment !== null || $rating !== null) {
                $sentimentAnalysis = $this->aiService->analyzeSentiment($comment ?? '', $rating);
            }
            
            // Create review
            $review = Review::create([
                'order_id' => $order->id,
                'rating' => $rating,
                'comment' => $comment,
                'sentiment_label' => $sentimentAnalysis['sentiment'] ?? null,
            ]);

            Log::info('Review created', [
                'order_id' => $order->id,
                'order_ref' => $order->order_ref,
                'review_id' => $review->id,
                'rating' => $rating,
                'sentiment' => $sentimentAnalysis['sentiment'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Terima kasih atas review Anda!',
                'review' => $review,
                'sentiment_analysis' => $sentimentAnalysis,
            ]);
        } catch (QueryException $e) {
            Log::warning('Duplicate review rejected by database constraint', [
                'order_id' => $order->id,
                'order_ref' => $order->order_ref,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memberikan review untuk pesanan ini',
            ], 400);
        } catch (\Exception $e) {
            Log::error('Error creating review: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan review: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get order reviews
     */
    public function getOrderReviews(Request $request, $orderRef)
    {
        $order = $this->findCustomerOrder($request, $orderRef);
        $reviews = Review::where('order_id', $order->id)->get();
        
        return response()->json($reviews);
    }

    /**
     * Get recent reviews
     */
    public function getRecentReviews()
    {
        $reviews = Review::with(['order.orderDetails.menu'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function (Review $review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'sentiment_label' => $review->sentiment_label,
                    'created_at' => $review->created_at?->toIso8601String(),
                    'updated_at' => $review->updated_at?->toIso8601String(),
                    'order' => $review->order ? [
                        'order_type' => $review->order->order_type,
                        'created_at' => $review->order->created_at?->toIso8601String(),
                        'items' => $review->order->orderDetails->map(fn ($detail) => [
                            'name' => $detail->menu_name ?? $detail->menu?->name,
                            'quantity' => $detail->quantity,
                        ])->values(),
                    ] : null,
                ];
            });
        
        return response()->json($reviews);
    }

    /**
     * Get review statistics
     */
    public function getStatistics()
    {
        $reviews = Review::query()
            ->select(['rating', 'sentiment_label'])
            ->get();
        
        return response()->json([
            'total_reviews' => $reviews->count(),
            'average_rating' => round((float) ($reviews->avg('rating') ?? 0), 1),
            'sentiment_distribution' => [
                'positive' => $reviews->where('sentiment_label', 'positive')->count(),
                'neutral' => $reviews->where('sentiment_label', 'neutral')->count(),
                'negative' => $reviews->where('sentiment_label', 'negative')->count(),
            ],
        ]);
    }

    private function findCustomerOrder(Request $request, string $orderRef, array $with = []): Order
    {
        $order = Order::with($with)->where('order_ref', $orderRef)->firstOrFail();

        $this->orderAccess->abortUnlessCanAccess($request, $order);

        return $order;
    }

    private function redirectNumericOrderToRef(Request $request, string $orderRef, string $route)
    {
        if (!ctype_digit($orderRef)) {
            return null;
        }

        $order = Order::find($orderRef);

        if ($order) {
            $this->orderAccess->abortUnlessCanAccess($request, $order);
        }

        return $order
            ? redirect()->route($route, ['order' => $order->order_ref])
            : null;
    }
}
