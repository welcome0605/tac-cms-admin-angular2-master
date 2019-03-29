<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
class CreateAnalyticsDownload extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('analytics_download', function (Blueprint $table) {
            $table->increments('download_id');
            $table->integer('download_app_id')->unsigned();
            $table->integer('device_k')->default(1)->comment('1=>Android, 2=>iOS');
            $table->string('Country');
            $table->date('down_time');
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
        Schema::dropIfExists('analytics_download');
    }
}