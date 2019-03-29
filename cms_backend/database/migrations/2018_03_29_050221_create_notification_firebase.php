<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationFirebase extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notification_firebase', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('app_id')->unsigned();
            $table->integer('platform')->default(1)->comment('1=>Android, 2=>iOS');
            $table->text('device_token');
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
        Schema::dropIfExists('notification_firebase');
    }
}
