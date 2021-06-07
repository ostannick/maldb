<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    use HasFactory;

    protected $fillable = [

        'user_id',
        'setting_id',
        'val_decimal',
        'val_string',
        'val_integer'
    ];

    public function setting()
    {
        return $this->belongsTo(Setting::class);
    }

    public function reset_to_default()
    {
        $parent_setting = $this->setting();

        $this->val_decimal = $parent_setting->default_decimal;
        $this->val_string  = $parent_setting->default_string;
        $this->val_integer = $parent_setting->default_integer;
    }
}
