<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $staffId = $this->route('staff')?->id;

        return [
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($staffId)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($staffId)],
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:admin,staff',
        ];
    }
}
