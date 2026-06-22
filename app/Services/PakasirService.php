<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PakasirService
{
    private const METHODS = ['qris', 'bri_va'];

    public function createTransaction(Order $order, string $method): array
    {
        if (!in_array($method, self::METHODS, true)) {
            return [
                'success' => false,
                'message' => 'Metode Pakasir tidak didukung',
            ];
        }

        if (!$this->isConfigured()) {
            return [
                'success' => false,
                'message' => 'Pakasir credential is not configured.',
            ];
        }

        $payload = $this->basePayload($order);
        $url = $this->baseUrl() . '/api/transactioncreate/' . $method;

        try {
            Log::info('Pakasir create transaction request', $this->logContext($order, $method));

            $response = Http::timeout(20)->post($url, $payload);
            $responseBody = $response->json() ?? $response->body();

            if (!$response->successful()) {
                Log::warning('Pakasir create transaction failed', [
                    ...$this->logContext($order, $method),
                    'status' => $response->status(),
                    'body' => $this->safeError($responseBody),
                ]);

                return [
                    'success' => false,
                    'message' => $this->messageForFailedResponse($response->status(), $responseBody),
                    'status' => $response->status(),
                    'error' => $this->safeError($responseBody),
                ];
            }

            if (!is_array($response->json('payment'))) {
                Log::warning('Pakasir create transaction returned unexpected body', [
                    ...$this->logContext($order, $method),
                    'status' => $response->status(),
                    'body' => $this->safeError($responseBody),
                ]);

                return [
                    'success' => false,
                    'message' => 'Pakasir response did not include payment data.',
                    'status' => $response->status(),
                    'error' => $this->safeError($responseBody),
                ];
            }

            return [
                'success' => true,
                'payment' => $response->json('payment'),
                'raw' => $response->json(),
            ];
        } catch (\Throwable $e) {
            Log::error('Pakasir create transaction error', [
                'order_id' => $order->id,
                'order_ref' => $order->order_ref,
                'method' => $method,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Pakasir tidak dapat dihubungi: ' . $e->getMessage(),
            ];
        }
    }

    public function createQrisTransaction(Order $order): array
    {
        return $this->createTransaction($order, 'qris');
    }

    public function createBriVaTransaction(Order $order): array
    {
        return $this->createTransaction($order, 'bri_va');
    }

    public function getTransactionDetail(Order $order): array
    {
        if (!$this->isConfigured()) {
            return [
                'success' => false,
                'message' => 'Pakasir credential is not configured.',
            ];
        }

        try {
            $response = Http::timeout(15)->get($this->baseUrl() . '/api/transactiondetail', $this->basePayload($order));

            if (!$response->successful()) {
                Log::warning('Pakasir transaction detail failed', [
                    'order_id' => $order->id,
                    'order_ref' => $order->order_ref,
                    'status' => $response->status(),
                    'error' => $this->safeError($response->json() ?? $response->body()),
                ]);

                return [
                    'success' => false,
                    'message' => $this->messageFromResponse($response->json()) ?: 'Pakasir transaction detail could not be retrieved.',
                    'status' => $response->status(),
                    'error' => $this->safeError($response->json() ?? $response->body()),
                ];
            }

            return [
                'success' => true,
                'data' => $response->json(),
            ];
        } catch (\Throwable $e) {
            Log::error('Pakasir transaction detail error', [
                'order_id' => $order->id,
                'order_ref' => $order->order_ref,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Pakasir tidak dapat dihubungi: ' . $e->getMessage(),
            ];
        }
    }

    public function simulatePayment(Order $order): array
    {
        if (!$this->isConfigured()) {
            return [
                'success' => false,
                'message' => 'Pakasir credential is not configured.',
            ];
        }

        try {
            $response = Http::timeout(20)->post($this->baseUrl() . '/api/paymentsimulation', $this->basePayload($order));

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'message' => $this->messageFromResponse($response->json()) ?: 'Pakasir payment simulation failed.',
                    'status' => $response->status(),
                    'error' => $this->safeError($response->json() ?? $response->body()),
                ];
            }

            return [
                'success' => true,
                'data' => $response->json(),
            ];
        } catch (\Throwable $e) {
            Log::error('Pakasir payment simulation error', [
                'order_id' => $order->id,
                'order_ref' => $order->order_ref,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Pakasir tidak dapat dihubungi: ' . $e->getMessage(),
            ];
        }
    }

    public function validateWebhook(array $payload, Order $order, ?string $rawBody = null): bool
    {
        // 1. HMAC Signature validation (if PAKASIR_WEBHOOK_SECRET is configured)
        if (!$this->validateWebhookSignature($rawBody, $payload)) {
            return false;
        }

        $project = config('services.pakasir.project');
        $method = $payload['payment_method'] ?? null;

        // 2. Project slug must match
        if (($payload['project'] ?? null) !== $project) {
            return false;
        }

        // 3. Order reference must match
        if (($payload['order_id'] ?? null) !== $order->order_ref) {
            return false;
        }

        // 4. Status must be completed
        if (($payload['status'] ?? null) !== 'completed') {
            return false;
        }

        // 5. Payment method must be supported
        if (!in_array($method, self::METHODS, true)) {
            return false;
        }

        // 6. Amount must match (prevents tampered webhook)
        return (int) ($payload['amount'] ?? 0) === $this->orderAmount($order);
    }

    /**
     * Validate HMAC-SHA256 webhook signature from Pakasir.
     *
     * If PAKASIR_WEBHOOK_SECRET is not configured, validation is skipped (permissive).
     * If it IS configured, the incoming signature must match — otherwise reject.
     *
     * Pakasir is expected to send the signature in the X-Pakasir-Signature header
     * as: sha256=<hex_digest> computed over the raw request body.
     */
    public function validateWebhookSignature(?string $rawBody, array $payload = []): bool
    {
        $secret = config('services.pakasir.webhook_secret');

        // If no secret is configured, skip signature check (backward-compatible)
        if (empty($secret)) {
            return true;
        }

        // Try header-based signature first (preferred, more secure)
        $headerSignature = request()->header('X-Pakasir-Signature')
            ?? request()->header('X-Signature')
            ?? null;

        if ($headerSignature !== null && $rawBody !== null) {
            $expected = 'sha256=' . hash_hmac('sha256', $rawBody, $secret);

            return hash_equals($expected, $headerSignature);
        }

        // Fallback: check signature field inside payload body
        $payloadSignature = $payload['signature'] ?? $payload['sign'] ?? null;

        if ($payloadSignature !== null && $rawBody !== null) {
            $expected = hash_hmac('sha256', $rawBody, $secret);

            return hash_equals($expected, $payloadSignature);
        }

        // If secret is set but no signature was provided at all, reject
        Log::warning('Pakasir webhook received without signature, but PAKASIR_WEBHOOK_SECRET is configured.', [
            'has_header' => $headerSignature !== null,
            'has_payload_sign' => $payloadSignature !== null,
        ]);

        return false;
    }

    public function paymentMethodForPakasirMethod(string $method): string
    {
        return match ($method) {
            'qris' => 'qris_pakasir',
            'bri_va' => 'bri_va_pakasir',
            default => throw new \InvalidArgumentException('Metode Pakasir tidak didukung'),
        };
    }

    private function basePayload(Order $order): array
    {
        return [
            'project' => config('services.pakasir.project'),
            'order_id' => $order->order_ref,
            'amount' => $this->orderAmount($order),
            'api_key' => config('services.pakasir.api_key'),
        ];
    }

    private function orderAmount(Order $order): int
    {
        return (int) round((float) $order->total_price);
    }

    private function baseUrl(): string
    {
        return rtrim((string) config('services.pakasir.base_url', 'https://app.pakasir.com'), '/');
    }

    private function isConfigured(): bool
    {
        return filled(config('services.pakasir.project'))
            && filled(config('services.pakasir.api_key'))
            && filled(config('services.pakasir.mode'))
            && filled(config('services.pakasir.base_url'));
    }

    private function messageFromResponse(mixed $body): ?string
    {
        if (!is_array($body)) {
            return null;
        }

        foreach (['message', 'error', 'errors'] as $key) {
            $value = $body[$key] ?? null;

            if (is_string($value) && $value !== '') {
                return $value;
            }
        }

        return null;
    }

    private function messageForFailedResponse(int $status, mixed $body): string
    {
        if ($this->looksLikeCredentialRejection($status, $body)) {
            return 'Pakasir rejected the transaction. Check project slug and API key.';
        }

        return $this->messageFromResponse(is_array($body) ? $body : null)
            ?: 'Pakasir payment could not be created.';
    }

    private function looksLikeCredentialRejection(int $status, mixed $body): bool
    {
        if (in_array($status, [401, 403], true)) {
            return true;
        }

        $bodyText = strtolower(is_string($body) ? $body : (json_encode($body) ?: ''));

        return $status === 422
            && (
                str_contains($bodyText, 'api_key')
                || str_contains($bodyText, 'apikey')
                || str_contains($bodyText, 'api key')
                || str_contains($bodyText, 'project')
                || str_contains($bodyText, 'slug')
                || str_contains($bodyText, 'credential')
                || str_contains($bodyText, 'unauthorized')
                || str_contains($bodyText, 'invalid key')
            );
    }

    private function logContext(Order $order, string $method): array
    {
        return [
            'project' => config('services.pakasir.project'),
            'mode' => config('services.pakasir.mode'),
            'base_url' => $this->baseUrl(),
            'method' => $method,
            'order_ref' => $order->order_ref,
            'amount' => $this->orderAmount($order),
        ];
    }

    private function safeError(mixed $error): mixed
    {
        if (is_array($error)) {
            unset($error['api_key'], $error['apikey'], $error['key']);
        }

        if (is_string($error) && filled(config('services.pakasir.api_key'))) {
            return str_replace((string) config('services.pakasir.api_key'), '[redacted]', $error);
        }

        return $error;
    }
}
