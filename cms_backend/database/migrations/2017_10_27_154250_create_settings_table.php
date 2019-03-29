<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('settings'))
        {
            Schema::create('settings', function (Blueprint $table)
            {
                $table->increments('id')->comment('Primary Key');
                $table->longText('app_unique_id')->nullable();
                $table->string('ios_app_id', 255)->nullable();
                $table->string('ios_appstore_id', 255)->nullable();
                $table->string('andr_app_id', 255)->nullable();
                $table->string('firebase_id_iOS', 255)->nullable();
                $table->longText('server_key_iOS')->nullable();
                $table->longText('firebase_ios_plist')->nullable();
                $table->string('firebase_id_android', 255)->nullable();
                $table->longText('server_key_android')->nullable();
                $table->longText('firebase_android_json')->nullable();
                // $table->longText('rate_android_app_id')->nullable();
                // $table->longText('rate_ios_app_id')->nullable();
                // $table->longText('force_update_message')->nullable();
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
        Schema::dropIfExists('settings');
    }
}
