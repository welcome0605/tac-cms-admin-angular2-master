<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFitnessChallengeLoopTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('fitness_challenge_loop'))
        {
            Schema::create('fitness_challenge_loop', function (Blueprint $table) 
            {
                $table->increments('id')->comment('Primary key');
                $table->integer('day')->nullable();
                $table->string('loop_name',255)->nullable();
                $table->integer('loop_id')->nullable(); 
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
        Schema::dropIfExists('fitness_challenge_loop');
    }
}
