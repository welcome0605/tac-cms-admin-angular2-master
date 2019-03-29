<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppGeneralDicussionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_general_dicussions', function (Blueprint $table) {
            $table->increments('id')->comment('Primary Key');

            $table->integer('app_id')->unsigned()->comment(' app foreign key');
            $table->integer('sender_id')->unsigned()->comment('sender(normal user) foreign key');
            $table->integer('receiver_id')->unsigned()->comment('receiver(typically user) foreign key');

            $table->foreign('app_id')->references('id')->on('app_basic');
            $table->foreign('sender_id')->references('id')->on('users');
            $table->foreign('receiver_id')->references('id')->on('users');

            $table->longText('dicussion')->nullable();
            $table->enum('status',['1','2','3'])->default('1')->comment('1=>open, 2=>close, 3=>deleted');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('app_general_dicussions');
    }
}
