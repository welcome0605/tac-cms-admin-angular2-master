<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnalyticsInfo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('analytics_record', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('app_id')    ->unsigned();
            $table->string('bundle_id')  ->default("");
            $table->integer('item_id')   ->unsigned()->default(0);
            $table->string('action')     ->default("install");
            $table->string('platform');
            $table->string('device_type');
            $table->string('item_name')  ->default("");
            $table->string('item_type')  ->default("");
            $table->string('locale')     ->default("");
            $table->float('location_lat')->default(null);
            $table->float('location_lon')->default(null);
            $table->string('country')    ->default("UK");
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
        Schema::dropIfExists('analytics_record');
        Schema::dropIfExists('analytics_event');
        Schema::dropIfExists('analytics_download');
        Schema::dropIfExists('analytics_session');
    }
}
