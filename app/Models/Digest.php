<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

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

    public function delete_everything()
    {
      //Delete the table
      Schema::dropIfExists($this->table_name);

      //Delete the table
      $this->delete();
    }
}
