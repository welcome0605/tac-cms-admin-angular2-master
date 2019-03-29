<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFitnessChallengeDayTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         if(!Schema::hasTable('fitness_challenge_day'))
        {
            Schema::create('fitness_challenge_day', function (Blueprint $table) 
            {
                $table->increments('id')->comment('Primary key');
                $table->integer('challenge_id')->nullable();
                $table->integer('day_no')->nullable();
                $table->string('title',255)->nullable();
                $table->string('image',255)->nullable(); 
                $table->string('video_url',255)->nullable();
                $table->timestamps();
                $table->enum('status',['1','2','3'])->default('1')->comment('1=>active, 2=>inactive, 3=>deleted');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fitness_challenge_day');
    }
}
