<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
class CreateAnalyticsEvent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('analytics_event', function (Blueprint $table) {
            $table->increments('event_id');
            $table->integer('event_app_id')->unsigned();
            $table->integer('event_device_k')->default(1)->comment('1=>Android, 2=>iOS');
            $table->string('event_name'); //mean : everytime stack when user enter pages of their apps
            $table->date('event_date');
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
        Schema::dropIfExists('analytics_event');
    }
}