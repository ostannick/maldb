<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBaseDigestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('base_digests', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('owner');
            $table->string('table_name');
            $table->string('enzyme')->default('trypsin');
            $table->integer('max_mc')->default(0);
            $table->integer('size')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('base_digests');
    }
}
