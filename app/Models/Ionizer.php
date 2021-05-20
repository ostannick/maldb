<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ionizer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'parent_name',
        'sequence',
        'ionized',
        'intensity_absolute',
        'intensity_normalized'
    ];
}
