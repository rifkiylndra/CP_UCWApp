<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

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
            'customer_name' => 'nullable|string|max:100',
            'order_type' => 'required|in:dine_in,takeaway',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1|max:10',
            'items.*.note' => 'nullable|string|max:255',
            'items.*.price' => 'required|numeric|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'order_type.required' => 'Tipe pesanan harus dipilih',
            'order_type.in' => 'Tipe pesanan tidak valid',
            'items.required' => 'Minimal pilih 1 item menu',
            'items.*.menu_id.required' => 'Menu harus dipilih',
            'items.*.menu_id.exists' => 'Menu tidak ditemukan',
            'items.*.quantity.required' => 'Jumlah harus diisi',
            'items.*.quantity.min' => 'Jumlah minimal 1',
            'items.*.quantity.max' => 'Jumlah maksimal 10',
        ];
    }
}