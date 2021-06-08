<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Setting;

class UserSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
        'setting_id',
        'type',
        'value',
        'min',
        'max',
        'step',
    ];

    public function setting()
    {
        return $this->belongsTo(Setting::class);
    }

    public function reset_to_default()
    {
        $this->value = $this->setting->df_value;
        $this->save();
    }
}
