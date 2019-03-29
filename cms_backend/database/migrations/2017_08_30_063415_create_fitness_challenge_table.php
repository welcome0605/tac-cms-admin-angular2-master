<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFitnessChallengeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       if(!Schema::hasTable('fitness_challenge'))
        {
            Schema::create('fitness_challenge', function (Blueprint $table) 
            {
                $table->increments('id')->comment('Primary key');
                $table->string('title',255)->nullable();
                $table->string('image',255)->nullable(); 
                $table->string('video_url',255)->nullable();
                $table->text('description')->nullable(); 
                $table->double('price', 15, 2);
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
        Schema::dropIfExists('fitness_challenge');
    }
}
