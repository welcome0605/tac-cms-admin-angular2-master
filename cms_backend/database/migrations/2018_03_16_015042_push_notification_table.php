<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PushNotificationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        if(!Schema::hasTable('push_notification'))
        {
            Schema::create('push_notification', function(Blueprint $table) {
                $table->increments('id')->comment('Primary Key');
                $table->integer('app_id');
                $table->integer('ios');
                $table->integer('android');
                $table->integer('web');
                $table->integer('all_type');
                $table->text('title', 256);
                $table->text('description', 2048);
                $table->text('server_key', 256);
                $table->text('time', 256);
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
        //
        Schema::dropIfExists('push_notification');
    }
}
