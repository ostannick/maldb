<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Digest extends Model
{
    use HasFactory;

    protected $fillable = [
      'user_id',
      'proteome_id',
      'table_name',
      'enzyme',
      'max_mc',
      'size',
      'status',
      'process_id'
    ];
}
