<?php

namespace App\Http\Requests\Customer;

use App\Models\Table;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class CreateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Customer doesn't need authentication for QR ordering
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'table_id' => 'nullable|exists:tables,id',
            'table_number' => 'nullable|required_if:order_type,dine_in|string|max:20',
            'customer_name' => 'nullable|required_if:order_type,takeaway|string|max:100',
            'order_type' => 'required|in:dine_in,takeaway',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1|max:10',
            'items.*.note' => 'nullable|string|max:255',
        ];
    }

    protected function prepareForValidation(): void
    {
        $tableNumber = $this->input('table_number');

        if (is_string($tableNumber)) {
            $tableNumber = trim($tableNumber);
        }

        $this->merge([
            'table_number' => $tableNumber === '' ? null : $tableNumber,
            'customer_name' => is_string($this->input('customer_name'))
                ? trim($this->input('customer_name'))
                : $this->input('customer_name'),
        ]);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->input('order_type') !== 'dine_in' || !$this->filled('table_number')) {
                return;
            }

            $exists = Table::whereIn(
                'table_number',
                $this->tableNumberCandidates((string) $this->input('table_number'))
            )->exists();

            if (!$exists) {
                $validator->errors()->add(
                    'table_number',
                    'Nomor meja tidak ditemukan. Masukkan nomor sesuai label meja, contoh 5, 05, atau T05.'
                );
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'order_type.required' => 'Tipe pesanan harus dipilih',
            'order_type.in' => 'Tipe pesanan tidak valid',
            'table_number.required_if' => 'Nomor meja harus diisi untuk dine-in',
            'customer_name.required_if' => 'Nama customer harus diisi untuk takeaway',
            'items.required' => 'Minimal pilih 1 item menu',
            'items.*.menu_id.required' => 'Menu harus dipilih',
            'items.*.menu_id.exists' => 'Menu tidak ditemukan',
            'items.*.quantity.required' => 'Jumlah harus diisi',
            'items.*.quantity.min' => 'Jumlah minimal 1',
            'items.*.quantity.max' => 'Jumlah maksimal 10',
        ];
    }

    private function tableNumberCandidates(string $value): array
    {
        $raw = trim($value);
        $upper = strtoupper($raw);
        $digits = preg_replace('/\D/', '', $upper);
        $candidates = [$raw, $upper];

        if ($digits !== '') {
            $number = (string) ((int) $digits);
            $padded = str_pad($number, 2, '0', STR_PAD_LEFT);

            $candidates = array_merge($candidates, [
                $number,
                $padded,
                'T' . $number,
                'T' . $padded,
            ]);
        }

        return array_values(array_unique(array_filter($candidates, fn ($item) => $item !== '')));
    }
}
