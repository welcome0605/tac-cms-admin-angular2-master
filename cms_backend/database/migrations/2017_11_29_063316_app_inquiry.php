<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AppInquiry extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('app_inquiry', function (Blueprint $table) {
            $table->increments('id')->comment('primary key');
            $table->string('name')->comment('inquiry name');
            $table->string('email')->comment('inquiry mail id');
            $table->integer('budget')->comment('inquiry budget');
            $table->mediumText('app_description')->comment('inquiry application description');
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
        //
        Schema::dropIfExists('app_inquiry');
    }
}
