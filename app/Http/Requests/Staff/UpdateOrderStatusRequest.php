<?php

namespace App\Http\Requests\Staff;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Route dilindungi oleh middleware auth + role:staff
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:incoming,pending,confirmed,processing,preparing,ready,completed,cancelled',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status pesanan harus diisi.',
            'status.in'       => 'Status pesanan tidak valid.',
        ];
    }
}
