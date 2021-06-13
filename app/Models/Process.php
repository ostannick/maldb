<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Process extends Model
{
    use HasFactory;

    protected $fillable = [
      'user_id',
      'description'
    ];

    public function status()
    {
      return $this->hasMany(Status::class)->where('process_id', $this->id)->orderBy('progress', 'DESC')->first();
    }
}
