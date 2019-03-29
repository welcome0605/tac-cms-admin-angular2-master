<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePushNotification extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('push_real_notification', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('app_id')->unsigned();
            $table->integer('device_k')->default(1)->comment('1=>android, 2=>ios, 3=>both, 4=>all');
            $table->integer('status')->default(1)->comment('1=>active, 2=>inactive, 3=>deleted');
            $table->text('notify_title');
            $table->text('notify_text');
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
        Schema::dropIfExists('push_notification');
        Schema::dropIfExists('push_notification_table');
    }
}
