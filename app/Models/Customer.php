<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'customers';

    protected $fillable = [
        'user_id',
        'name',
        'rfc',
        'address',
        'phone',
        'website',
    ];

    protected function casts(): array
    {
        return [
            'name' => 'encrypted',
            'rfc' => 'encrypted',
            'address' => 'encrypted',
            'phone' => 'encrypted',
            'website' => 'encrypted',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
