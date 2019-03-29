<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCheckinTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('checkin', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('member_id');
            $table->integer('staff_id');
            $table->integer('points')->default(0);
            $table->integer('app_id');
            $table->string('note')->default('');
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
        Schema::dropIfExists('checkin');
    }
}
