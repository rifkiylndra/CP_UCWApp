<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FeedbackFilterRequest;
use App\Services\FeedbackService;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function __construct(private FeedbackService $feedbackService)
    {
    }

    public function index(FeedbackFilterRequest $request)
    {
        $filters = $this->filters($request);

        return Inertia::render('Admin/Feedback', [
            'feedbacks' => $this->feedbackService->paginateForAdmin($filters),
            'summary' => $this->feedbackService->summarize($filters),
            'filters' => [
                'rating' => $request->input('rating', ''),
                'sentiment' => $request->input('sentiment', ''),
                'search' => $request->input('search', ''),
            ],
        ]);
    }

    public function export(FeedbackFilterRequest $request)
    {
        $rows = $this->feedbackService->exportRows($this->filters($request));
        $filename = 'customer-feedback-' . now()->format('Ymd-His') . '.csv';

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($rows) {
            $file = fopen('php://output', 'w');

            fputcsv($file, [
                'Date',
                'Order Ref',
                'Customer',
                'Table',
                'Rating',
                'Sentiment',
                'Comment',
                'Menu Summary',
                'Order Total',
            ]);

            foreach ($rows as $row) {
                fputcsv($file, [
                    $row['created_at'],
                    $row['order']['order_ref'] ?? '',
                    $row['order']['customer_name'] ?? '',
                    $row['order']['table_number'] ?? '',
                    $row['rating'],
                    $row['sentiment_label'] ?? '',
                    $row['comment'] ?? '',
                    $row['order']['menu_summary'] ?? '',
                    $row['order']['total_price'] ?? 0,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function filters(FeedbackFilterRequest $request): array
    {
        return collect($request->validated())
            ->only(['rating', 'sentiment', 'search'])
            ->filter(fn ($value) => $value !== null && $value !== '')
            ->all();
    }
}
