<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDigestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('digests', function (Blueprint $table) {
          $table->id();
          $table->timestamps();
          $table->integer('user_id');
          $table->integer('proteome_id');
          $table->string('table_name');
          $table->string('enzyme')->default('trypsin');
          $table->integer('max_mc')->default(0);
          $table->integer('size')->nullable();
          $table->string('status')->nullable();
          $table->integer('process_id')->nullable();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('digests');
    }
}
