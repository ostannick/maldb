<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->uuid('job_id');
            $table->integer('user_id');
            $table->string('enzyme');
            $table->string('missedCleavages');
            $table->decimal('tolerance');
            $table->mediumText('modifications')->nullable();
            $table->mediumText('collections');
            $table->mediumText('dataset');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('jobs');
    }
}
