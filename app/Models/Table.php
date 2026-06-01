<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;

    protected $table = 'tables'; // karena nama tabel 'tables' (reserved word)

    protected $fillable = ['table_number', 'qr_code', 'status'];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}