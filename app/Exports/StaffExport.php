<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StaffExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping
{
    public function __construct(
        protected ?string $role = null,
    ) {
    }

    public function collection()
    {
        return User::query()
            ->when(
                in_array($this->role, ['admin', 'staff'], true),
                fn (Builder $query) => $query->where('role', $this->role),
                fn (Builder $query) => $query->whereIn('role', ['admin', 'staff'])
            )
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            'Role',
            'Registration Date',
        ];
    }

    public function map($user): array
    {
        return [
            $user->name,
            $user->email,
            ucfirst($user->role),
            optional($user->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
