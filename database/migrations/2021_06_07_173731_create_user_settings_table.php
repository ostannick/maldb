<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Setting;
use App\Models\UserSetting;

class CreateUserSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->string('description')->nullable();
            $table->integer('user_id');
            $table->integer('setting_id');
            $table->string('type');
            $table->string('value');
            $table->decimal('min', 5, 2)->default(0);
            $table->decimal('max', 5, 2)->default(100);
            $table->decimal('step', 5, 2)->default(0.5);
        });

        //Create settings for user = 1 (me!)
        $all_settings = Setting::all();
        foreach($all_settings as $s)
        {
            UserSetting::create([
                'user_id' => 1,
                'name' => $s->name,
                'description' => $s->description,
                'type' => $s->type,
                'value' => $s->df_value,
                'setting_id' => $s->id,
                'min' => $s->min,
                'max' => $s->max,
                'step' => $s->step
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_settings');
    }
}
