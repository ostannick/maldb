<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Setting;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->string('description');
            $table->string('type');
            $table->string('df_value');
            $table->decimal('min', 5, 2)->default(0.00);
            $table->decimal('max', 5, 2)->default(100);
            $table->decimal('step', 5, 2)->default(0.5);
        });

        //Input all the default settings!
        Setting::create([
            'name' => 'match_count',
            'description' => 'The number of search hits to report.',
            'type' => 'int',
            'df_value' => 5,
            'min' => 5,
            'max' => 25,
            'step' => 1 
        ])->save();

        Setting::create([
            'name' => 'perceptron_confidence_threshold',
            'description' => 'Ionizers with confidence values below this threshold are ignored in searches.',
            'type' => 'float',
            'df_value' => 0.2,
            'min' => 0.00,
            'max' => 0.5,
            'step' => 0.01 
        ])->save();

        Setting::create([
            'name' => 'spectral_compression',
            'description' => 'The factor by which uploaded spectra are compressed before viewing in the browser.',
            'type' => 'int',
            'df_value' => 10,
            'min' => 0,
            'max' => 10,
            'step' => 1 
        ])->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settings');
    }
}
