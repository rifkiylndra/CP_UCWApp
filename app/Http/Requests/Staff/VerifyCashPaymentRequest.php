<?php

namespace App\Http\Requests\Staff;

use Illuminate\Foundation\Http\FormRequest;

class VerifyCashPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Route dilindungi oleh middleware auth + role:staff
    }

    public function rules(): array
    {
        return [
            'amount_received' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'amount_received.required' => 'Jumlah uang yang diterima harus diisi.',
            'amount_received.numeric'  => 'Jumlah uang yang diterima harus berupa angka.',
            'amount_received.min'      => 'Jumlah uang yang diterima tidak boleh negatif.',
        ];
    }
}
