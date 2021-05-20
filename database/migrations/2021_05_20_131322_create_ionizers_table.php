<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIonizersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ionizers', function (Blueprint $table) {
            $table->id();
            $table->timestamps(); 
            $table->integer('user_id');
            $table->string('parent_name');
            $table->string('sequence');
            $table->boolean('ionized');
            $table->decimal('intensity_absolute')->nullable();
            $table->decimal('intensity_normalized')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ionizers');
    }
}
