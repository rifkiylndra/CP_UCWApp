<?php

namespace App\Services;

use App\Models\Review;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class FeedbackService
{
    public function paginateForAdmin(array $filters): LengthAwarePaginator
    {
        return $this->query($filters)
            ->latest('reviews.created_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Review $review) => $this->formatReview($review));
    }

    public function summarize(array $filters): array
    {
        $reviews = $this->query($filters, false)->get(['id', 'rating', 'sentiment_label']);
        $total = $reviews->count();

        return [
            'total' => $total,
            'average_rating' => $reviews->whereNotNull('rating')->count() > 0
                ? round((float) $reviews->whereNotNull('rating')->avg('rating'), 1)
                : 0,
            'positive' => $reviews->where('sentiment_label', 'positive')->count(),
            'neutral' => $reviews->where('sentiment_label', 'neutral')->count(),
            'negative' => $reviews->where('sentiment_label', 'negative')->count(),
            'rating_counts' => collect(range(1, 5))
                ->mapWithKeys(fn (int $rating) => [$rating => $reviews->where('rating', $rating)->count()])
                ->all(),
        ];
    }

    public function exportRows(array $filters): Collection
    {
        return $this->query($filters)
            ->latest('reviews.created_at')
            ->get()
            ->map(fn (Review $review) => $this->formatReview($review));
    }

    private function query(array $filters, bool $withRelations = true): Builder
    {
        $query = Review::query();

        if ($withRelations) {
            $query->with(['order.table', 'order.orderDetails.menu']);
        }

        if (!empty($filters['rating'])) {
            $query->where('rating', (int) $filters['rating']);
        }

        if (!empty($filters['sentiment'])) {
            $query->where('sentiment_label', $filters['sentiment']);
        }

        if (!empty($filters['search'])) {
            $search = trim((string) $filters['search']);

            $query->where(function (Builder $feedbackQuery) use ($search) {
                $feedbackQuery
                    ->where('comment', 'like', "%{$search}%")
                    ->orWhereHas('order', function (Builder $orderQuery) use ($search) {
                        $orderQuery
                            ->where('order_ref', 'like', "%{$search}%")
                            ->orWhere('customer_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('order.table', function (Builder $tableQuery) use ($search) {
                        $tableQuery->where('table_number', 'like', "%{$search}%");
                    })
                    ->orWhereHas('order.orderDetails.menu', function (Builder $menuQuery) use ($search) {
                        $menuQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }

    private function formatReview(Review $review): array
    {
        $order = $review->order;
        $items = $order?->orderDetails
            ? $order->orderDetails->map(fn ($detail) => [
                'name' => $detail->menu?->name ?? 'Menu #' . $detail->menu_id,
                'quantity' => (int) $detail->quantity,
                'note' => $detail->note,
                'subtotal' => (float) $detail->subtotal,
            ])->values()
            : collect();

        return [
            'id' => $review->id,
            'rating' => $review->rating !== null ? (int) $review->rating : null,
            'comment' => $review->comment,
            'sentiment_label' => $review->sentiment_label,
            'created_at' => $review->created_at?->toIso8601String(),
            'order' => $order ? [
                'id' => $order->id,
                'order_ref' => $order->order_ref,
                'customer_name' => $order->customer_name ?? 'Walk-in Customer',
                'order_type' => $order->order_type,
                'order_status' => $order->order_status,
                'payment_status' => $order->payment_status,
                'table_number' => $order->table?->table_number,
                'total_price' => (float) $order->total_price,
                'items' => $items,
                'menu_summary' => $items->take(3)
                    ->map(fn (array $item) => $item['quantity'] . 'x ' . $item['name'])
                    ->implode(', '),
            ] : null,
        ];
    }
}
