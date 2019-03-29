<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
class CreateAnalyticsSession extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('analytics_session', function (Blueprint $table) {
            $table->increments('session_id');
            $table->integer('session_app_id')->unsigned();
            $table->integer('session_device_k')->default(1)->comment('1=>Android, 2=>iOS');
            $table->date('session_create');
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
        Schema::dropIfExists('analytics_session');
    }
}