<?php

namespace App\Http\Requests\Staff;

use Illuminate\Foundation\Http\FormRequest;

class RefundPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Route dilindungi oleh middleware auth + role:staff
    }

    public function rules(): array
    {
        return [
            'refund_amount' => 'required|numeric|min:0',
            'reason'        => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'refund_amount.required' => 'Jumlah refund harus diisi.',
            'refund_amount.numeric'  => 'Jumlah refund harus berupa angka.',
            'refund_amount.min'      => 'Jumlah refund tidak boleh negatif.',
            'reason.required'        => 'Alasan refund harus diisi.',
            'reason.max'             => 'Alasan refund maksimal 255 karakter.',
        ];
    }
}
