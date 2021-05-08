<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Digest;

class Proteome extends Model
{
    use HasFactory;

    protected $fillable = [
      'user_id',
      'name',
      'path',
      'organism',
      'description',
    ];

    public function digests()
    {
      return $this->hasMany(Digest::class)->get();
    }
}
