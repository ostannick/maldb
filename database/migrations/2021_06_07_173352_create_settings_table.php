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
            $table->decimal('df_decimal', 5, 2)->nullable();
            $table->string('df_string')->nullable();
            $table->integer('df_integer')->nullable();
        });

        //Input all the default settings!
        Setting::create([
            'name' => 'match_count',
            'description' => 'The number of search hits to report.',
            'df_integer' => 5
        ])->save();

        Setting::create([
            'name' => 'perceptron_confidence_threshold',
            'description' => 'Ionizers with confidence values below this threshold are ignored in searches.',
            'df_decimal' => 0.2
        ])->save();

        Setting::create([
            'name' => 'spectral_compression',
            'description' => 'The factor by which uploaded spectra are compressed before viewing in the browser.',
            'df_integer' => 10
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
